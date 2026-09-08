#!/usr/bin/env node
/**
 * Local mock server that serves api-snapshot/ as if it were the WordPress REST API.
 *
 * Usage (from web/):
 *   node scripts/mock-server.js
 *
 * Then in .env.development.local set:
 *   ADMIN_URL=localhost:8765
 *   ADMIN_PROTOCOL=http
 *
 * Run "yarn develop" normally — Gatsby will hit this server instead of production.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.MOCK_PORT || 8765;
const SNAPSHOT_DIR = path.join(__dirname, '..', 'api-snapshot');
const LOCAL_URL = `http://localhost:${PORT}`;

// --- Load manifest & build route lookup ---

function routeToSlug(route) {
  return route.replace(/^\//, '').replace(/\//g, '-') || 'root';
}

let manifest = { routes: [] };
const manifestPath = path.join(SNAPSHOT_DIR, 'manifest.json');
if (fs.existsSync(manifestPath)) {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
} else {
  console.warn('WARNING: api-snapshot/manifest.json not found. Run "yarn crawl-api" first.');
}

// slug → route path, so we can do exact lookups and fuzzy prefix matching
const slugToRoute = {};
for (const route of manifest.routes) {
  slugToRoute[routeToSlug(route)] = route;
}

// The origin the snapshot was crawled from — recorded in the manifest by
// crawl-api.js; the fallback keeps pre-existing snapshots working.
const SOURCE_URL = (
  process.env.MOCK_SOURCE_URL ||
  manifest.baseUrl ||
  'https://zskostelec.tode.cz'
).replace(/\/+$/, '');

// --- Helpers ---

function sendJson(res, status, data, extraHeaders) {
  const body = rewriteUrls(JSON.stringify(data));
  const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Expose-Headers': 'X-WP-Total, X-WP-TotalPages, Link',
    ...extraHeaders,
  };
  res.writeHead(status, headers);
  res.end(body);
}

function loadSnapshot(slug) {
  const filePath = path.join(SNAPSHOT_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const SOURCE_HOST = SOURCE_URL.replace(/^https?:\/\//, '');
const SOURCE_ORIGIN_RE = new RegExp(
  `https?://${SOURCE_HOST.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(/[^\\s"'<>\\\\]*)?`,
  'g'
);
const MEDIA_PATH_RE = /^\/wp-(?:content|includes)\//;

/**
 * Swaps the crawled origin for this server's own origin, on every response.
 *
 * gatsby-source-wordpress strips ADMIN_PROTOCOL://ADMIN_URL out of the data
 * (see searchReplaceContentUrls in .gatsby/gatsby-config.ts), so pointing it
 * at localhost while the snapshot still says zskostelec.tode.cz leaves every
 * internal link absolute — i.e. pointing back at the real site. Both schemes
 * are matched, because WP keeps whichever one a link was authored under.
 *
 * Media keeps its absolute URL: nothing under wp-content is mirrored into
 * the snapshot, so those requests need to stay pointed at a real host.
 */
function rewriteUrls(str) {
  return str.replace(SOURCE_ORIGIN_RE, (match, path) =>
    path && MEDIA_PATH_RE.test(path) ? match : `${LOCAL_URL}${path ?? ''}`
  );
}

// --- Request handler ---

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.writeHead(405);
    res.end('Method Not Allowed');
    return;
  }

  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname.replace(/\/$/, '') || '/';

  console.log(`GET ${req.url}`);

  // --- Root index: /wp-json ---
  if (pathname === '/wp-json' || pathname === '') {
    const rootPath = path.join(SNAPSHOT_DIR, 'root.json');
    if (!fs.existsSync(rootPath)) {
      sendJson(res, 503, { message: 'Snapshot not found. Run "yarn crawl-api" first.' });
      return;
    }
    const raw = fs.readFileSync(rootPath, 'utf8');
    const rewritten = rewriteUrls(raw);
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(rewritten);
    return;
  }

  // --- Media passthrough ---
  // Nothing under wp-content is mirrored into the snapshot, so any media URL
  // that did get rewritten to this origin is sent on to the real file.
  if (pathname.startsWith('/wp-content') || pathname.startsWith('/wp-includes')) {
    res.writeHead(302, { Location: `${SOURCE_URL}${req.url}`, 'Access-Control-Allow-Origin': '*' });
    res.end();
    return;
  }

  // --- Collection/object routes: /wp-json/... ---
  if (pathname.startsWith('/wp-json/')) {
    const route = pathname.slice('/wp-json'.length); // e.g. /wp/v2/posts
    const slug = routeToSlug(route); // e.g. wp-v2-posts

    const snapshot = loadSnapshot(slug);
    if (!snapshot) {
      console.log(`  404 — no snapshot for slug "${slug}"`);
      sendJson(res, 404, { message: `No snapshot for route: ${route}` });
      return;
    }

    // Object response (e.g. /wp/v2/types)
    if (snapshot.type === 'object') {
      sendJson(res, 200, snapshot.data);
      return;
    }

    // Paginated array response
    const perPage = Math.max(1, parseInt(parsed.query.per_page || '100', 10));
    const page = Math.max(1, parseInt(parsed.query.page || '1', 10));
    const allItems = snapshot.items || [];
    const totalPages = Math.max(1, Math.ceil(allItems.length / perPage));

    if (page > totalPages) {
      sendJson(res, 400, {
        code: 'rest_post_invalid_page_number',
        message: 'The page number requested is larger than the number of pages available.',
      });
      return;
    }

    const start = (page - 1) * perPage;
    const pageItems = allItems.slice(start, start + perPage);

    sendJson(res, 200, pageItems, {
      'X-WP-Total': String(snapshot.total || allItems.length),
      'X-WP-TotalPages': String(totalPages),
    });
    return;
  }

  sendJson(res, 404, { message: `Unknown path: ${pathname}` });
});

server.listen(PORT, () => {
  const snapshotExists = fs.existsSync(path.join(SNAPSHOT_DIR, 'root.json'));

  console.log('');
  console.log(`WordPress REST API mock server`);
  console.log(`  Listening: http://localhost:${PORT}`);
  console.log(`  Snapshots: ${SNAPSHOT_DIR}`);
  console.log(`  Routes:    ${manifest.routes.length} loaded`);
  if (!snapshotExists) {
    console.log('');
    console.log('  WARNING: No snapshot found. Run "yarn crawl-api" to generate one.');
  }
  console.log('');
  console.log('Set in .env.development.local:');
  console.log(`  ADMIN_URL=localhost:${PORT}`);
  console.log(`  ADMIN_PROTOCOL=http`);
  console.log('');
  console.log('Then run "yarn develop" as usual.');
  console.log('');
});
