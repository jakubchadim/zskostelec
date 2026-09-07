#!/usr/bin/env node
/**
 * Local mock server for the WordPress REST API.
 * Serves snapshots from api-snapshot/ as if they were the real API.
 *
 * Usage (from app/):
 *   node scripts/mock-server.js
 *
 * Then in .env.local:
 *   WP_URL=http://localhost:8765
 *
 * Handles:
 *   - Collection requests with ?per_page / ?page pagination
 *   - ?slug=foo filtering
 *   - /{id} single-item lookup by numeric ID
 *   - ?_fields=... (ignored — full objects returned, which is fine for dev)
 *   - wp-api-menus/v2/menus/{id} individual menu items
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.MOCK_PORT || 8765;
const SNAPSHOT_DIR = path.join(__dirname, '..', 'api-snapshot');
const PRODUCTION_URL = 'https://zskostelec.tode.cz';
const LOCAL_URL = `http://localhost:${PORT}`;

// --- Load manifest ---
let manifest = { routes: [], singleItems: {} };
const manifestPath = path.join(SNAPSHOT_DIR, 'manifest.json');
if (fs.existsSync(manifestPath)) {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
} else {
  console.warn('WARNING: api-snapshot/manifest.json not found. Run "npm run crawl-api" first.');
}

function routeToSlug(route) {
  return route.replace(/^\//, '').replace(/\//g, '-') || 'root';
}

function loadSnapshot(slug) {
  const fp = path.join(SNAPSHOT_DIR, `${slug}.json`);
  if (!fs.existsSync(fp)) return null;
  return JSON.parse(fs.readFileSync(fp, 'utf8'));
}

function rewriteUrls(str) {
  return str.replace(
    new RegExp(PRODUCTION_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
    LOCAL_URL
  );
}

function sendJson(res, status, data, extraHeaders) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Expose-Headers': 'X-WP-Total, X-WP-TotalPages, Link',
    ...extraHeaders,
  });
  res.end(body);
}

// Filter items matching ?slug=foo or ?slug=foo,bar
function filterBySlug(items, slugParam) {
  if (!slugParam) return items;
  const slugs = slugParam.split(',').map((s) => s.trim()).filter(Boolean);
  return items.filter((item) => slugs.includes(item.slug));
}

// Apply simple query filters that the app actually uses
function applyFilters(items, query) {
  let result = items;

  if (query.slug) result = filterBySlug(result, query.slug);
  if (query.status) {
    const statuses = query.status.split(',');
    result = result.filter((i) => statuses.includes(i.status));
  }
  if (query.categories) {
    const cats = query.categories.split(',').map(Number);
    result = result.filter((i) =>
      Array.isArray(i.categories) && i.categories.some((c) => cats.includes(c))
    );
  }
  if (query.parent !== undefined) {
    const parentId = Number(query.parent);
    result = result.filter((i) => i.parent === parentId);
  }

  return result;
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
  // Normalize: strip trailing slash
  const pathname = (parsed.pathname || '/').replace(/\/+$/, '') || '/wp-json';
  const query = parsed.query;

  console.log(`GET ${req.url}`);

  // --- Root index ---
  if (pathname === '/wp-json' || pathname === '') {
    const rootPath = path.join(SNAPSHOT_DIR, 'root.json');
    if (!fs.existsSync(rootPath)) {
      sendJson(res, 503, { message: 'No snapshot found. Run "npm run crawl-api" first.' });
      return;
    }
    const raw = fs.readFileSync(rootPath, 'utf8');
    res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8', 'Access-Control-Allow-Origin': '*' });
    res.end(rewriteUrls(raw));
    return;
  }

  if (!pathname.startsWith('/wp-json/')) {
    sendJson(res, 404, { message: `Unknown path: ${pathname}` });
    return;
  }

  // Strip /wp-json prefix → e.g. /wp/v2/posts or /wp/v2/posts/123
  const route = pathname.slice('/wp-json'.length);

  // --- Check if the last path segment is a numeric ID ---
  const idMatch = route.match(/^(.*?)\/(\d+)$/);

  if (idMatch) {
    const [, collectionRoute, idStr] = idMatch;
    const id = parseInt(idStr, 10);

    // For menus: look for pre-saved individual menu snapshot first
    const collectionSlug = routeToSlug(collectionRoute);
    const individualSlug = `${collectionSlug}-${id}`;
    const individualSnap = loadSnapshot(individualSlug);
    if (individualSnap) {
      sendJson(res, 200, individualSnap.data ?? individualSnap);
      return;
    }

    // Otherwise look up by id in the collection snapshot
    const collSnap = loadSnapshot(collectionSlug);
    if (!collSnap || collSnap.type !== 'array') {
      sendJson(res, 404, { message: `No snapshot for ${collectionRoute}` });
      return;
    }

    const item = collSnap.items.find((i) => i.id === id || i.ID === id);
    if (!item) {
      sendJson(res, 404, { code: 'rest_post_invalid_id', message: `Invalid post ID: ${id}` });
      return;
    }

    sendJson(res, 200, item);
    return;
  }

  // --- Collection route ---
  const slug = routeToSlug(route);
  const snap = loadSnapshot(slug);

  if (!snap) {
    console.log(`  404 — no snapshot for slug "${slug}"`);
    sendJson(res, 404, { message: `No snapshot for route: ${route}` });
    return;
  }

  // Object response (non-paginated)
  if (snap.type === 'object') {
    sendJson(res, 200, snap.data);
    return;
  }

  // Array response — apply filters + paginate
  const filtered = applyFilters(snap.items ?? [], query);

  const perPage = Math.max(1, parseInt(query.per_page || '100', 10));
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  if (page > totalPages && filtered.length > 0) {
    sendJson(res, 400, {
      code: 'rest_post_invalid_page_number',
      message: 'The page number requested is larger than the number of pages available.',
    });
    return;
  }

  const start = (page - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  sendJson(res, 200, pageItems, {
    'X-WP-Total': String(filtered.length),
    'X-WP-TotalPages': String(totalPages),
  });
});

server.listen(PORT, () => {
  const ready = fs.existsSync(path.join(SNAPSHOT_DIR, 'root.json'));
  console.log('');
  console.log('WordPress REST API mock server');
  console.log(`  Listening: http://localhost:${PORT}`);
  console.log(`  Snapshots: ${SNAPSHOT_DIR}`);
  console.log(`  Routes:    ${manifest.routes.length} loaded`);
  if (!ready) {
    console.log('');
    console.log('  WARNING: No snapshot found. Run "npm run crawl-api" first.');
  }
  console.log('');
  console.log('Set in .env.local:');
  console.log(`  WP_URL=http://localhost:${PORT}`);
  console.log('');
  console.log('Then run "npm run dev" as usual.');
  console.log('');
});
