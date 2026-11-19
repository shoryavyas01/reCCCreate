// Builds are separate. Run this against the current production build.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
const port = 3199;
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], { stdio: ['ignore', 'pipe', 'pipe'] });
let errors = '';
server.stderr.on('data', (chunk) => { errors += chunk.toString(); });
const pages = ['/', '/about', '/shop', '/phool-mitra', '/contact', '/privacy', '/terms', '/returns'];
const documents = new Map();
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Server did not become ready: ' + errors)), 15000);
    server.on('error', reject);
    server.on('exit', (code) => { if (code) reject(new Error(errors)); });
    server.stdout.on('data', (chunk) => { if (chunk.toString().includes('Ready')) { clearTimeout(timeout); resolve(); } });
  });
  const titles = new Set();
  const descriptions = new Set();
  for (const path of pages) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200, path);
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(response.headers.get('x-frame-options'), 'DENY');
    assert.equal(response.headers.get('x-powered-by'), null);
    const html = await response.text(); documents.set(path, html);
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
    assert.ok(title && description, path + ': title and description');
    assert.ok(!titles.has(title), path + ': unique title'); titles.add(title);
    assert.ok(!descriptions.has(description), path + ': unique description'); descriptions.add(description);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, path + ': one main heading');
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1, path + ': one canonical');
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    assert.equal(new URL(canonical).pathname, path, path + ': correct canonical path');
    assert.ok(canonical.startsWith('https://') && !canonical.includes('localhost'), path + ': public HTTPS canonical');
    assert.ok(html.includes('property="og:image"') && html.includes('name="twitter:card"'), path + ': share metadata');
    assert.ok(html.includes('application/ld+json'), path + ': structured data');
    assert.ok(!/Trace this product|Trace my pack|Traceability|href="\/trace/.test(html), path + ': retired tracing removed');
    for (const policy of ['/privacy', '/terms', '/returns']) assert.ok(html.includes(`href="${policy}"`), path + ': policy links');
    console.log(path + ': metadata, headings, policies and headers OK');
  }
  const links = new Set();
  const assets = new Set();
  for (const [path, html] of documents) {
    for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      const href = match[1].replace(/&amp;/g, '&');
      if (!href.startsWith('/')) continue;
      const target = new URL(href, origin); links.add(target.pathname + target.search);
      if (target.hash && documents.has(target.pathname)) assert.ok(documents.get(target.pathname).includes(`id="${decodeURIComponent(target.hash.slice(1))}"`), `${path}: anchor ${href}`);
    }
    for (const match of html.matchAll(/<img\b[^>]*>/g)) {
      assert.ok(/\balt="/.test(match[0]), path + ': image alt attribute');
      const src = match[0].match(/\bsrc="([^"]+)"/)?.[1];
      if (src?.startsWith('/')) assets.add(src.replace(/&amp;/g, '&'));
    }
  }
  for (const link of links) assert.equal((await fetch(origin + link)).status, 200, 'Internal link: ' + link);
  for (const asset of assets) assert.equal((await fetch(origin + asset)).status, 200, 'Image: ' + asset);
  for (const asset of ['/social/recccreate-share.png', '/icon.svg', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png', '/manifest.webmanifest']) assert.equal((await fetch(origin + asset)).status, 200, asset);
  const sitemap = await (await fetch(origin + '/sitemap.xml')).text();
  assert.equal((sitemap.match(/<loc>/g) || []).length, pages.length);
  assert.ok(!sitemap.includes('/admin') && !sitemap.includes('/trace'));
  const robots = await (await fetch(origin + '/robots.txt')).text();
  assert.ok(robots.includes('Disallow: /admin') && robots.includes('Disallow: /api/') && robots.includes('Sitemap: https://'));
  const admin = await (await fetch(origin + '/admin')).text();
  assert.ok(/name="robots" content="noindex, nofollow"/.test(admin), 'Admin excluded from indexing');
  assert.equal((await fetch(origin + '/this-page-does-not-exist')).status, 404, 'Real 404 status');
  for (const path of ['/trace', '/trace/RG-601', '/trace/sample']) {
    const response = await fetch(origin + path, { redirect: 'manual' });
    assert.equal(response.status, 308, path + ': permanent retirement redirect');
    assert.ok(response.headers.get('location').endsWith('/shop'));
  }
  for (const endpoint of ['/api/contact', '/api/order', '/api/phool-mitra']) {
    const response = await fetch(origin + endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    assert.equal(response.status, 400, endpoint + ': rejects incomplete form without external submission');
    assert.ok(response.headers.get('cache-control').includes('no-store'));
    assert.ok(!(await response.text()).includes('setup'));
  }
  const shop = documents.get('/shop');
  assert.ok(shop.includes('MRP ₹20') && shop.includes('MRP ₹50'));
  for (const path of ['/contact', '/phool-mitra', '/shop']) assert.ok(documents.get(path).includes('name="consent"'), path + ': consent control');
  assert.ok(!errors.includes('Error:') && !errors.includes('Unhandled'), errors);
  console.log(`Release checks passed: ${pages.length} pages, ${links.size} internal links, ${assets.size} image assets, SEO files, icons, 404, retired URLs and three safe API checks. No real messages sent.`);
} finally { server.kill(); }
