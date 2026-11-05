const fs = require('fs');
const path = require('path');

function loadMetrics() {
  const p = path.join(__dirname, '..', 'data', 'runs.json');
  const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
  const rows = Array.isArray(raw) ? raw : raw.runs || [];
  return rows.map((line, idx) => {
    const parts = String(line).split(' - ');
    const m = String(line).match(/(\d+)ms/);
    const statusField = (parts[1] || '').trim();
    const status = /^flaky-retried$/i.test(statusField) ? 'flaky'
      : /^skipped/i.test(statusField) ? 'skipped'
      : /^failed$/i.test(statusField) ? 'failed'
      : /^passed$/i.test(statusField) ? 'passed'
      : 'unknown';
    return { name: (parts[0] || 'run').trim(), status, duration_ms: m ? Number(m[1]) : null, line: String(line), idx };
  });
}

function latestEntry(metrics) {
  const dateOf = (n) => (String(n).match(/^run-(\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2})?)/) || [])[1] || '';
  return metrics.reduce((a, b) => (dateOf(b.name) > dateOf(a.name) || (dateOf(b.name) === dateOf(a.name) && b.idx > a.idx) ? b : a));
}

module.exports = { loadMetrics, latestEntry };
