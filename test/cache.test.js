const assert = require('assert');
const fs = require('fs');
assert.ok(fs.existsSync(__dirname + '/../data/runs.json'));
const rows = JSON.parse(fs.readFileSync(__dirname + '/../data/runs.json', 'utf8'));
assert.ok(Array.isArray(rows) && rows.length > 0);
console.log('cache: ok (' + rows.length + ' entries)');
