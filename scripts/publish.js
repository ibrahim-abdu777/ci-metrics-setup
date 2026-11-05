const https = require('https');
let warnedInvalidToken = false;
const { pageId: PAGE, badgeBase } = require('../config/board.json');
const VERSION = require('../package.json').version;

function req(method, path, body) {
  if (process.env.NOTION_API_TOKEN && !warnedInvalidToken && !/^[A-Za-z0-9_-]{40,}$/.test(process.env.NOTION_API_TOKEN)) {
    warnedInvalidToken = true;
    console.error('NOTION_API_TOKEN is set but has an invalid format - ignoring it');
  }
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const token = process.env.NOTION_API_TOKEN || '';
    const headers = {
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
      ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
    };
    if (/^[A-Za-z0-9_-]{40,}$/.test(token)) headers.Authorization = `Bearer ${token}`;
    const r = https.request({
      hostname: 'api.notion.com',
      path,
      method,
      headers,
    }, (res) => {
      let buf = '';
      res.on('data', (c) => (buf += c));
      res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(buf || '{}') }); } catch (e) { resolve({ status: res.statusCode, body: {} }); } });
    });
    r.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}

async function pageTitle() {
  const r = await req('GET', `/v1/pages/${PAGE}`);
  const t = r.body && r.body.properties && r.body.properties.title && r.body.properties.title.title;
  return (t && t.map(x => x.plain_text).join('')) || 'board';
}

async function getArtifactName() {
  const kids = await req('GET', `/v1/blocks/${PAGE}/children?page_size=100`);
  const f = (kids.body.results || []).find((b) => b.type === 'file' && b.file && b.file.name);
  if (!f) return null;
  const parts = f.file.name.replace(/\.tar\.gz$/, '').split('-');
  return parts[0] + '_' + parts.slice(1).join('_');
}

async function findStatusBlock() {
  let cursor = '';
  for (;;) {
    const q = cursor ? `?start_cursor=${cursor}&page_size=100` : '?page_size=100';
    const kids = await req('GET', `/v1/blocks/${PAGE}/children${q}`);
    if (kids.status !== 200) return { err: kids.status };
    const hit = (kids.body.results || []).find((b) => b.type === 'paragraph' && (b.paragraph.rich_text || []).map((t) => t.plain_text).join('').startsWith('status:'));
    if (hit) return { block: hit };
    if (!kids.body.has_more) return {};
    cursor = kids.body.next_cursor;
  }
}

async function publishStatus(text) {
  const line = `${text} | v${VERSION} | ${new Date().toISOString()}`;
  const found = await findStatusBlock();
  if (found.err) return { status: found.err, previous: null };
  const existing = found.block || null;
  const previous = existing ? { id: existing.id, text: (existing.paragraph.rich_text || []).map((t) => t.plain_text).join('') } : null;
  const st = existing
    ? (await req('PATCH', `/v1/blocks/${existing.id}`, { paragraph: { rich_text: [{ type: 'text', text: { content: line } }] } })).status
    : (await req('PATCH', `/v1/blocks/${PAGE}/children`, {
        children: [{ object: 'block', type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: line } }] } }],
      })).status;
  const appended = !existing && st === 200 ? (await findStatusBlock()).block : null;
  return { status: st, previous, appendedId: appended ? appended.id : null };
}

async function restoreStatus(previous, appendedId) {
  if (previous) {
    return (await req('PATCH', `/v1/blocks/${previous.id}`, { paragraph: { rich_text: [{ type: 'text', text: { content: previous.text } }] } })).status;
  }
  if (appendedId) {
    return (await req('DELETE', `/v1/blocks/${appendedId}`)).status;
  }
  return 200;
}


async function setBadge(label, message, color) {
  const badge = `${badgeBase}${encodeURIComponent(label)}-${encodeURIComponent(message)}-${color}?v=${VERSION}&t=${Date.now()}`;
  const st = (await req('PATCH', `/v1/pages/${PAGE}`, { icon: { type: 'external', external: { url: badge } } })).status;
  return st;
}

module.exports = { publishStatus, restoreStatus, setBadge, getArtifactName };

