#!/usr/bin/env node
/**
 * Crawl the WordPress REST API and save responses to api-snapshot/.
 *
 * Usage (from web/):
 *   node scripts/crawl-api.js
 *
 * Output: api-snapshot/root.json + api-snapshot/<route-slug>.json for each route.
 * Run this once against the production site, then use mock-server.js for local dev.
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://zskostelec.tode.cz';
const SNAPSHOT_DIR = path.join(__dirname, '..', 'api-snapshot');
const PER_PAGE = 100;
const REQUEST_DELAY_MS = 300; // be polite to the production server

// Mirrors excludedRoutes from .gatsby/gatsby-config.ts
const EXCLUDED_PATTERNS = [
  /\/tags/,
  /\/users/,
  /\/comments/,
  /\/settings/,
  /\/themes/,
  /\/search/,
  /\/block-types/,
  /\/plugins/,
  /\/block-directory/,
  /^\/njt-fbv\//,
  /^\/filebird\//,
  /^\/wp-site-health\//,
  /^\/batch\//,
];

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
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
      }
    );

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error(`Timeout: ${urlStr}`));
    });
  });
}

function routeToSlug(route) {
  return route.replace(/^\//, '').replace(/\//g, '-') || 'root';
}

function isExcluded(route) {
  return EXCLUDED_PATTERNS.some((p) => p.test(route));
}

function isCollectionRoute(route) {
  // Skip single-item routes like /wp/v2/posts/(?P<id>[\d]+)
  return !route.includes('(?P<');
}

async function fetchRoute(routePath) {
  const firstUrl = `${BASE_URL}/wp-json${routePath}?per_page=${PER_PAGE}&page=1`;

  let firstRes;
  try {
    firstRes = await fetchUrl(firstUrl);
  } catch (e) {
    console.log(`  ERROR: ${e.message}`);
    return null;
  }

  if (firstRes.status === 404 || firstRes.status === 400 || firstRes.status === 403) {
    console.log(`  SKIP (${firstRes.status})`);
    return null;
  }

  if (firstRes.status !== 200) {
    console.log(`  ERROR status ${firstRes.status}`);
    return null;
  }

  let firstData;
  try {
    firstData = JSON.parse(firstRes.body);
  } catch (e) {
    console.log(`  ERROR parsing JSON: ${e.message}`);
    return null;
  }

  // Object response (e.g. /wp/v2/types, /wp/v2/taxonomies) — not paginated
  if (!Array.isArray(firstData)) {
    return { type: 'object', data: firstData };
  }

  const totalPages = parseInt(firstRes.headers['x-wp-totalpages'] || '1', 10);
  const total = parseInt(firstRes.headers['x-wp-total'] || String(firstData.length), 10);
  const items = [...firstData];

  for (let page = 2; page <= totalPages; page++) {
    await sleep(REQUEST_DELAY_MS);
    const pageUrl = `${BASE_URL}/wp-json${routePath}?per_page=${PER_PAGE}&page=${page}`;
    console.log(`  page ${page}/${totalPages}`);

    try {
      const res = await fetchUrl(pageUrl);
      if (res.status !== 200) break;
      const data = JSON.parse(res.body);
      if (Array.isArray(data)) items.push(...data);
    } catch (e) {
      console.log(`  ERROR on page ${page}: ${e.message}`);
      break;
    }
  }

  return { type: 'array', items, total, totalPages };
}

async function main() {
  fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });

  // 1. Fetch root index
  console.log(`Fetching root: ${BASE_URL}/wp-json/`);
  const rootRes = await fetchUrl(`${BASE_URL}/wp-json/`);
  const root = JSON.parse(rootRes.body);
  fs.writeFileSync(path.join(SNAPSHOT_DIR, 'root.json'), JSON.stringify(root, null, 2));
  console.log('  Saved root.json\n');

  // 2. Collect collection routes
  const allRoutes = Object.keys(root.routes || {});
  const collectionRoutes = allRoutes.filter(
    (r) => r !== '/' && !isExcluded(r) && isCollectionRoute(r)
  );
  console.log(`Found ${allRoutes.length} routes, fetching ${collectionRoutes.length} collections\n`);

  // 3. Save manifest for the mock server
  const manifest = {
    baseUrl: BASE_URL,
    crawledAt: new Date().toISOString(),
    routes: collectionRoutes,
  };
  fs.writeFileSync(path.join(SNAPSHOT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));

  // 4. Fetch each route
  const results = { ok: [], skipped: [], errored: [] };

  for (const route of collectionRoutes) {
    const slug = routeToSlug(route);
    process.stdout.write(`${route} ... `);

    await sleep(REQUEST_DELAY_MS);
    const result = await fetchRoute(route);

    if (!result) {
      console.log('skipped');
      results.skipped.push(route);
      continue;
    }

    const outPath = path.join(SNAPSHOT_DIR, `${slug}.json`);
    fs.writeFileSync(outPath, JSON.stringify(result, null, 2));

    const count =
      result.type === 'array' ? `${result.items.length} items` : 'object';
    console.log(`saved (${count})`);
    results.ok.push(route);
  }

  console.log(`\nDone.`);
  console.log(`  OK:      ${results.ok.length}`);
  console.log(`  Skipped: ${results.skipped.length}`);
  console.log(`  Errored: ${results.errored.length}`);
  console.log(`\nSnapshots saved to: ${SNAPSHOT_DIR}`);
  console.log(`\nNext: run "yarn mock-server" and set ADMIN_URL=localhost:8765 ADMIN_PROTOCOL=http`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
