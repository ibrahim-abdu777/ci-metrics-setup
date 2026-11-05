const assert = require('assert');
const { loadMetrics } = require('../lib/collect');

const rows = loadMetrics();
assert.ok(Array.isArray(rows));
assert.ok(rows.length > 0);
for (const r of rows) {
  assert.match(r.name, /^run-/);
  assert.ok(['passed', 'failed', 'flaky', 'skipped', 'unknown'].includes(r.status));
}
console.log('collect: ok (' + rows.length + ' entries)');
