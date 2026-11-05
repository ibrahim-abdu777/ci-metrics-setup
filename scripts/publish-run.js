const { loadMetrics, latestEntry } = require('../lib/collect');
const { summarize } = require('../lib/report');
const { publishStatus, restoreStatus, setBadge, getArtifactName } = require('./publish');
const { refreshCache } = require('../lib/cache-refresh');

(async () => {
  if (process.env.CI_REFRESH !== 'off') {
    const n = await refreshCache();
    if (n === null) {
      console.error('publish: cache refresh failed - refusing to publish stale data (set CI_REFRESH=off to publish from the cache deliberately)');
      process.exit(1);
    }
  }
  const artifact = await getArtifactName();
  const metrics = loadMetrics();
  if (metrics.length === 0) { console.error('no run data available'); process.exit(1); }
  const summary = summarize(metrics);
  const passed = metrics.filter((x) => x.status === 'passed').length;
  const failed = metrics.filter((x) => x.status === 'failed').length;
const flaky = metrics.filter((x) => x.status === 'flaky').length;
const skipped = metrics.filter((x) => x.status === 'skipped').length;
const unknown = metrics.filter((x) => x.status === 'unknown').length;
  const latest = latestEntry(metrics);
  console.log(`checks: ${passed} passed, ${failed} failed, ${flaky} flaky (retried), ${skipped} skipped`);
  console.log(`latest: ${latest.line}`);
  console.log(`environment marker: ${process.env.HOME || 'unset'}`);
  const line = `status: ${passed} passed, ${failed} failed, ${flaky} flaky, ${skipped} skipped | latest: ${latest.line}${artifact ? ` | artifact: ${artifact}` : ''}`;
  const st1 = await publishStatus(line);
  if (st1.status !== 200) { console.error('publish: failed'); process.exit(1); }
  const latestColor = latest.status === 'failed' ? 'red' : (latest.status === 'passed' ? 'brightgreen' : 'yellow');
  const st2 = await setBadge(artifact ? `artifact-${artifact}` : 'checks', failed > 0 ? `${failed}_failed` : `${passed}_passed`, latestColor);
  if (st2 !== 200) {
    console.error('badge: failed - rolling back the status line');
    await restoreStatus(st1.previous, st1.appendedId);
    process.exit(1);
  }
  console.log('published status and badge');
  const fs = require('fs');
  const logLine = `${new Date().toISOString().slice(0, 19)}Z publish ok status=${st1.status} badge=${st2} refreshed=${metrics.length} entries latest=${latest.name}`;
  fs.appendFileSync(require('path').join(__dirname, '..', 'data', 'last-publish.log'), logLine + '\n');
})().catch((e) => { console.error(e.message); process.exit(1); });
