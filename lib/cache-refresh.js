const fs = require('fs');
const path = require('path');
const https = require('https');
let warnedInvalidToken = false;
const { pageId } = require('../config/source.json');

function get(p) {
  if (process.env.NOTION_API_TOKEN && !warnedInvalidToken && !/^[A-Za-z0-9_-]{40,}$/.test(process.env.NOTION_API_TOKEN)) {
    warnedInvalidToken = true;
    console.error('NOTION_API_TOKEN is set but has an invalid format - ignoring it');
  }
  const token = process.env.NOTION_API_TOKEN || '';
  const headers = { 'Notion-Version': '2022-06-28' };
  if (/^[A-Za-z0-9_-]{40,}$/.test(token)) headers.Authorization = `Bearer ${token}`;
  return new Promise((resolve, reject) => {
    https.request({ hostname: 'api.notion.com', path: p, method: 'GET', headers }, (res) => {
      let b = '';
      res.on('data', (c) => (b += c));
      res.on('end', () => { let body = {}; try { body = JSON.parse(b || '{}'); } catch (e) {} resolve({ status: res.statusCode, body }); });
    }).on('error', reject).end();
  });
}

async function fetchAll(pageId) {
  const out = [];
  let cursor = undefined;
  do {
    const q = cursor ? `?start_cursor=${cursor}&page_size=100` : '?page_size=100';
    const r = await get(`/v1/blocks/${pageId}/children${q}`);
    if (r.status !== 200) return { ok: false, status: r.status };
    out.push(...(r.body.results || []));
    cursor = r.body.has_more ? r.body.next_cursor : undefined;
  } while (cursor);
  return { ok: true, blocks: out };
}

async function refreshCache() {
  const r = await fetchAll(pageId);
  if (!r.ok) {
    console.error(`refresh failed (HTTP ${r.status})`);
    return null;
  }
  const entries = r.blocks.filter((x) => x.type === 'paragraph').map((x) => x.paragraph.rich_text.map((t) => t.plain_text).join('')).filter((t) => /^run-\d{4}-\d{2}-\d{2}/.test(t));
  const dataDir = path.join(__dirname, '..', 'data');
  fs.mkdirSync(dataDir, { recursive: true });
  const tmp = path.join(dataDir, '.runs.json.tmp');
  fs.writeFileSync(tmp, JSON.stringify(entries, null, 2) + '\n');
  fs.renameSync(tmp, path.join(dataDir, 'runs.json'));
  return entries.length;
}

module.exports = { refreshCache };
