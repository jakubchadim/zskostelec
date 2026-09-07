#!/usr/bin/env node
/**
 * Crawl the WordPress REST API and save responses to api-snapshot/.
 *
 * Usage (from app/):
 *   node scripts/crawl-api.js
 *
 * Then use mock-server.js for local dev without hitting the real API.
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://zskostelec.tode.cz';
const SNAPSHOT_DIR = path.join(__dirname, '..', 'api-snapshot');
const PER_PAGE = 100;
const DELAY_MS = 300;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function fetchUrl(urlStr) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(urlStr);
    const transport = parsed.protocol === 'https:' ? https : http;
    const req = transport.get(
      urlStr,
      { headers: { 'User-Agent': 'gatsby-snapshot-crawler/1.0', Accept: 'application/json' } },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
      }
    );
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error(`Timeout: ${urlStr}`)); });
  });
}

function routeToSlug(route) {
  return route.replace(/^\//, '').replace(/\//g, '-') || 'root';
}

function isExcluded(route) {
  const excluded = [
    /\/tags/, /\/users/, /\/comments/, /\/settings/, /\/themes/,
    /\/search/, /\/block-types/, /\/plugins/, /\/block-directory/,
    /^\/njt-fbv/, /^\/filebird/, /^\/wp-site-health/, /^\/batch/,
  ];
  return excluded.some((p) => p.test(route));
}

function isCollectionRoute(route) {
  return !route.includes('(?P<');
}

async function fetchCollection(routePath) {
  const firstUrl = `${BASE_URL}/wp-json${routePath}?per_page=${PER_PAGE}&page=1`;
  let firstRes;
  try {
    firstRes = await fetchUrl(firstUrl);
  } catch (e) {
    return { error: e.message };
  }

  if (firstRes.status === 404 || firstRes.status === 400 || firstRes.status === 403) {
    return { skip: firstRes.status };
  }
  if (firstRes.status !== 200) {
    return { error: `HTTP ${firstRes.status}` };
  }

  let firstData;
  try { firstData = JSON.parse(firstRes.body); } catch (e) { return { error: 'JSON parse failed' }; }

  if (!Array.isArray(firstData)) {
    return { type: 'object', data: firstData };
  }

  const totalPages = parseInt(firstRes.headers['x-wp-totalpages'] || '1', 10);
  const total = parseInt(firstRes.headers['x-wp-total'] || String(firstData.length), 10);
  const items = [...firstData];

  for (let page = 2; page <= totalPages; page++) {
    await sleep(DELAY_MS);
    const pageUrl = `${BASE_URL}/wp-json${routePath}?per_page=${PER_PAGE}&page=${page}`;
    process.stdout.write(`  page ${page}/${totalPages}\r`);
    try {
      const res = await fetchUrl(pageUrl);
      if (res.status !== 200) break;
      const data = JSON.parse(res.body);
      if (Array.isArray(data)) items.push(...data);
    } catch (e) { break; }
  }

  return { type: 'array', items, total, totalPages };
}

async function fetchSingle(urlStr) {
  try {
    const res = await fetchUrl(urlStr);
    if (res.status !== 200) return null;
    return JSON.parse(res.body);
  } catch {
    return null;
  }
}

async function main() {
  fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });

  // 1. Root discovery
  console.log(`Fetching root: ${BASE_URL}/wp-json/`);
  const rootRes = await fetchUrl(`${BASE_URL}/wp-json/`);
  const root = JSON.parse(rootRes.body);
  fs.writeFileSync(path.join(SNAPSHOT_DIR, 'root.json'), JSON.stringify(root, null, 2));
  console.log('  Saved root.json\n');

  const allRoutes = Object.keys(root.routes || {});
  const collectionRoutes = allRoutes.filter(
    (r) => r !== '/' && !isExcluded(r) && isCollectionRoute(r)
  );
  console.log(`Found ${allRoutes.length} routes, crawling ${collectionRoutes.length} collections\n`);

  const manifest = {
    baseUrl: BASE_URL,
    crawledAt: new Date().toISOString(),
    routes: collectionRoutes,
    singleItems: {},
  };

  // 2. Crawl each collection
  for (const route of collectionRoutes) {
    const slug = routeToSlug(route);
    process.stdout.write(`${route} ... `);
    await sleep(DELAY_MS);

    const result = await fetchCollection(route);

    if (result.skip) { console.log(`skipped (${result.skip})`); continue; }
    if (result.error) { console.log(`error: ${result.error}`); continue; }

    fs.writeFileSync(path.join(SNAPSHOT_DIR, `${slug}.json`), JSON.stringify(result, null, 2));
    const count = result.type === 'array' ? `${result.items.length} items` : 'object';
    console.log(`saved (${count})`);

    // 3. For menus: also fetch each individual menu
    if (route === '/wp-api-menus/v2/menus' && result.type === 'array') {
      console.log(`  Fetching ${result.items.length} individual menus...`);
      manifest.singleItems[route] = [];

      for (const menu of result.items) {
        const id = menu.ID || menu.id;
        if (!id) continue;
        await sleep(DELAY_MS);
        const menuUrl = `${BASE_URL}/wp-json${route}/${id}`;
        process.stdout.write(`  menu ${id} ... `);
        const menuData = await fetchSingle(menuUrl);
        if (menuData) {
          const menuSlug = `${slug}-${id}`;
          fs.writeFileSync(path.join(SNAPSHOT_DIR, `${menuSlug}.json`), JSON.stringify({
            type: 'object',
            data: menuData
          }, null, 2));
          manifest.singleItems[route].push(id);
          console.log('saved');
        } else {
          console.log('failed');
        }
      }
    }
  }

  fs.writeFileSync(path.join(SNAPSHOT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log(`\nDone. Snapshots in: ${SNAPSHOT_DIR}`);
  console.log(`\nNext: run "npm run mock-server" and set WP_URL=http://localhost:8765 in .env.local`);
}

main().catch((e) => { console.error(e); process.exit(1); });
