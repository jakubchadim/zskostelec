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
const PRODUCTION_URL = 'https://zskostelec.tode.cz';
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

// --- Helpers ---

function sendJson(res, status, data, extraHeaders) {
  const body = JSON.stringify(data);
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

// Rewrite production URLs → localhost in a JSON string (used for root response)
function rewriteUrls(str) {
  return str.replace(
    new RegExp(PRODUCTION_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
    LOCAL_URL
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
