const assert = require('assert');
const { summarize } = require('../lib/report');

const s = summarize([
  { name: 'a', status: 'passed', duration_ms: 10 },
  { name: 'b', status: 'failed', duration_ms: 30 },
]);
assert.strictEqual(s.count, 2);
assert.strictEqual(s.passed, 1);
assert.strictEqual(s.failed, 1);
assert.strictEqual(s.passRate, 0.5);
assert.strictEqual(s.averageDurationMs, 20);
console.log('report: ok');
