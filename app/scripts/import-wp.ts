/**
 * Imports the WordPress site into Payload, straight from the WP database
 * (a MariaDB loaded with the hosting's SQL export) and the uploads folder
 * from the hosting backup. Re-runnable: every record carries its WP id
 * (`wpId`) and existing ones are updated, not duplicated.
 *
 * Usage (from app/):
 *   npx payload run scripts/import-wp.ts -- [options]
 *
 * Options:
 *   --only=categories,doccats,media,galleries,posts,documents,gutak   phases (default: all, in this order)
 *   --files=<dir>        local copy of wp-content/uploads (from the hosting backup)
 *   --fetch-missing      download files missing in --files from the live WP (small samples only!)
 *   --limit=<n>          import only the newest n galleries/posts/documents (+ the media they use)
 *
 * Env: WP_DB_SOCKET (default ../.local/mariadb.sock), WP_DB_NAME (zskostelec),
 *      WP_URL (for --fetch-missing), plus the usual DATABASE_URL / PAYLOAD_SECRET.
 */
import fs from 'node:fs'
import path from 'node:path'
import { JSDOM } from 'jsdom'
import mysql from 'mysql2/promise'
import { getPayload, type Payload } from 'payload'
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import config from '../src/payload.config.ts'

// ---------------------------------------------------------------- options

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith('--'))
    .map((a) => {
      const [k, v] = a.slice(2).split('=')
      return [k, v ?? 'true']
    })
)
const PHASES = (args.only ?? 'categories,doccats,media,galleries,posts,documents,gutak').split(',')
const FILES_DIR = args.files ? path.resolve(args.files) : null
const FETCH_MISSING = args['fetch-missing'] === 'true'
const LIMIT = args.limit ? Number(args.limit) : null
const WP_URL = (process.env.WP_URL ?? 'https://zskostelec.tode.cz').replace(/\/$/, '')
const CTX = { skipRevalidate: true }

// ---------------------------------------------------------------- helpers

type Row = Record<string, unknown>

/** Values of a PHP-serialized flat array (`a:2:{i:0;s:3:"123";i:1;i:456;}` -> ['123','456']). */
function phpArrayValues(value: unknown): string[] {
  if (typeof value !== 'string' || !value.startsWith('a:')) return value ? [String(value)] : []
  const tokens = [...value.matchAll(/([is]):(?:\d+:)?"?([^";]*)"?;/g)].map((m) => m[2])
  return tokens.filter((_, i) => i % 2 === 1)
}

const toInt = (v: unknown) => {
  const n = Number(v)
  return Number.isInteger(n) && n > 0 ? n : null
}

const decodeTitle = (s: string) => new JSDOM(`<p>${s}</p>`).window.document.querySelector('p')!.textContent ?? s

/** WP stores dates as local time; post_date_gmt is UTC ("0000-00-00 00:00:00" for drafts). */
function isoDate(gmt: unknown, local: unknown): string {
  const g = String(gmt ?? '')
  if (g && !g.startsWith('0000')) return new Date(`${g.replace(' ', 'T')}Z`).toISOString()
  return new Date(String(local).replace(' ', 'T')).toISOString()
}

const log = (...m: unknown[]) => console.log(`[${new Date().toLocaleTimeString('cs-CZ')}]`, ...m)

// ---------------------------------------------------------------- WP data

const db = await mysql.createConnection({
  socketPath: process.env.WP_DB_SOCKET ?? path.resolve(process.cwd(), '../.local/mariadb.sock'),
  user: 'root',
  database: process.env.WP_DB_NAME ?? 'zskostelec',
  charset: 'utf8mb4',
  dateStrings: true
})
const q = async (sql: string, params: unknown[] = []) => (await db.query(sql, params))[0] as Row[]

/** postmeta for a set of posts: id -> key -> value (first value wins). */
async function metaFor(ids: number[], keys: string[]): Promise<Map<number, Record<string, string>>> {
  const out = new Map<number, Record<string, string>>()
  if (!ids.length) return out
  for (let i = 0; i < ids.length; i += 5000) {
    const rows = await q('SELECT post_id, meta_key, meta_value FROM wp_postmeta WHERE post_id IN (?) AND meta_key IN (?)', [
      ids.slice(i, i + 5000),
      keys
    ])
    for (const r of rows) {
      const id = Number(r.post_id)
      const rec = out.get(id) ?? {}
      if (!(String(r.meta_key) in rec)) rec[String(r.meta_key)] = String(r.meta_value ?? '')
      out.set(id, rec)
    }
  }
  return out
}

async function termsOf(taxonomy: string) {
  return q(
    `SELECT t.term_id, t.name, t.slug, tt.parent, tt.description, tt.term_taxonomy_id
     FROM wp_terms t JOIN wp_term_taxonomy tt ON tt.term_id = t.term_id WHERE tt.taxonomy = ? ORDER BY tt.parent, t.name`,
    [taxonomy]
  )
}

async function termIdsFor(postIds: number[], taxonomy: string): Promise<Map<number, number[]>> {
  const out = new Map<number, number[]>()
  if (!postIds.length) return out
  const rows = await q(
    `SELECT tr.object_id, tt.term_id FROM wp_term_relationships tr
     JOIN wp_term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
     WHERE tt.taxonomy = ? AND tr.object_id IN (?)`,
    [taxonomy, postIds]
  )
  for (const r of rows) {
    const list = out.get(Number(r.object_id)) ?? []
    list.push(Number(r.term_id))
    out.set(Number(r.object_id), list)
  }
  return out
}

// ---------------------------------------------------------------- payload

const payload: Payload = await getPayload({ config })

/** wpId -> payload id for a collection (one query, then kept up to date). */
async function idMap(collection: 'categories' | 'document-categories' | 'media' | 'galleries' | 'posts' | 'documents' | 'gutak') {
  const map = new Map<number, number>()
  const res = await payload.find({ collection, pagination: false, depth: 0, select: { wpId: true }, where: { wpId: { exists: true } }, draft: true })
  for (const doc of res.docs as { id: number; wpId?: number | null }[]) if (doc.wpId) map.set(doc.wpId, doc.id)
  return map
}

async function upsert<T extends Record<string, unknown>>(
  collection: 'categories' | 'document-categories' | 'galleries' | 'posts' | 'documents' | 'gutak',
  map: Map<number, number>,
  wpId: number,
  data: T
) {
  const existing = map.get(wpId)
  const common = { overrideAccess: true, context: CTX, depth: 0 } as const
  if (existing) {
    await payload.update({ collection, id: existing, data: data as never, ...common })
    return existing
  }
  const doc = await payload.create({ collection, data: { ...data, wpId } as never, ...common })
  map.set(wpId, doc.id as number)
  return doc.id as number
}

// ---------------------------------------------------------------- phases

const catMap = await idMap('categories')
const docCatMap = await idMap('document-categories')
const mediaMap = await idMap('media')
const galleryMap = await idMap('galleries')
const postMap = await idMap('posts')
const docMap = await idMap('documents')
const gutakMap = await idMap('gutak')

async function importTermTree(taxonomy: string, collection: 'categories' | 'document-categories', map: Map<number, number>) {
  const terms = await termsOf(taxonomy)
  // Parents first: keep looping until every term whose parent is known is in.
  const pending = [...terms]
  let guard = 0
  while (pending.length && guard++ < 10) {
    for (const t of [...pending]) {
      const parent = Number(t.parent)
      if (parent && !map.has(parent)) continue
      await upsert(collection, map, Number(t.term_id), {
        title: decodeTitle(String(t.name)),
        slug: String(t.slug),
        parent: parent ? map.get(parent) : null,
        ...(collection === 'categories' ? { description: String(t.description ?? '') } : {})
      })
      pending.splice(pending.indexOf(t), 1)
    }
  }
  log(`${collection}: ${terms.length}`)
}

/** Attachment rows by id, with their file path and alt. */
async function attachments(ids?: number[]) {
  const rows = ids
    ? ids.length
      ? await q(`SELECT ID, post_title, post_mime_type, post_date, post_date_gmt FROM wp_posts WHERE post_type='attachment' AND ID IN (?)`, [ids])
      : []
    : await q(`SELECT ID, post_title, post_mime_type, post_date, post_date_gmt FROM wp_posts WHERE post_type='attachment'`)
  const meta = await metaFor(
    rows.map((r) => Number(r.ID)),
    ['_wp_attached_file', '_wp_attachment_image_alt']
  )
  return rows.map((r) => ({
    id: Number(r.ID),
    title: String(r.post_title ?? ''),
    mime: String(r.post_mime_type ?? ''),
    date: isoDate(r.post_date_gmt, r.post_date),
    file: meta.get(Number(r.ID))?._wp_attached_file ?? '',
    alt: meta.get(Number(r.ID))?._wp_attachment_image_alt ?? ''
  }))
}

/** Finds the attachment's file locally (NFC/NFD-tolerant), optionally downloading it. */
async function localFile(rel: string): Promise<string | null> {
  if (FILES_DIR) {
    for (const form of ['NFC', 'NFD'] as const) {
      const p = path.join(FILES_DIR, rel.normalize(form))
      if (fs.existsSync(p)) return p
    }
  }
  if (!FETCH_MISSING) return null
  const cache = path.resolve(process.cwd(), '../.local/wp-uploads-cache', rel)
  if (fs.existsSync(cache)) return cache
  for (const form of ['NFD', 'NFC'] as const) {
    const url = `${WP_URL}/wp-content/uploads/${rel.normalize(form).split('/').map(encodeURIComponent).join('/')}`
    let res: Response | null = null
    for (let attempt = 0; attempt < 3 && !res; attempt++) {
      try {
        res = await fetch(url, { signal: AbortSignal.timeout(30_000) })
      } catch {
        await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)))
      }
    }
    if (res?.ok) {
      fs.mkdirSync(path.dirname(cache), { recursive: true })
      fs.writeFileSync(cache, Buffer.from(await res.arrayBuffer()))
      await new Promise((r) => setTimeout(r, 250)) // be gentle with the hosting
      return cache
    }
  }
  return null
}

const missingFiles: string[] = []

async function importMedia(ids?: number[]) {
  const todo = (await attachments(ids)).filter((a) => a.file && !mediaMap.has(a.id))
  log(`media: ${todo.length} to import (${mediaMap.size} already there)`)
  let done = 0
  const worker = async () => {
    for (;;) {
      const a = todo.shift()
      if (!a) return
      const filePath = await localFile(a.file)
      if (!filePath) {
        missingFiles.push(a.file)
        continue
      }
      try {
        const doc = await payload.create({
          collection: 'media',
          data: { alt: a.alt || null, legacyPath: `uploads/${a.file}`, wpId: a.id, createdAt: a.date } as never,
          filePath,
          overrideAccess: true,
          context: CTX,
          depth: 0
        })
        mediaMap.set(a.id, doc.id as number)
      } catch (error) {
        console.warn(`  ! media ${a.id} (${a.file}):`, (error as Error).message)
      }
      if (++done % 200 === 0) log(`  media ${done}/${done + todo.length}`)
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker))
}

/** Rows of a post type, newest first, honouring --limit. */
async function postsOf(type: string, statuses = ['publish']) {
  return q(
    `SELECT ID, post_title, post_name, post_content, post_excerpt, post_status, post_date, post_date_gmt
     FROM wp_posts WHERE post_type = ? AND post_status IN (?) ORDER BY post_date DESC ${LIMIT ? `LIMIT ${LIMIT}` : ''}`,
    [type, statuses]
  )
}

async function importGalleries() {
  const rows = await postsOf('gallery', ['publish', 'draft'])
  const meta = await metaFor(
    rows.map((r) => Number(r.ID)),
    ['gallery', 'preview']
  )
  const photoIds = (id: number) => phpArrayValues(meta.get(id)?.gallery).map(Number).filter(Boolean)
  if (LIMIT) await importMedia([...new Set(rows.flatMap((r) => [...photoIds(Number(r.ID)), Number(meta.get(Number(r.ID))?.preview) || 0]))].filter(Boolean))
  for (const r of rows) {
    const id = Number(r.ID)
    const preview = toInt(meta.get(id)?.preview)
    await upsert('galleries', galleryMap, id, {
      title: decodeTitle(String(r.post_title)),
      slug: String(r.post_name || id),
      publishedAt: isoDate(r.post_date_gmt, r.post_date),
      photos: photoIds(id).map((pid) => mediaMap.get(pid)).filter(Boolean),
      cover: preview ? (mediaMap.get(preview) ?? null) : null,
      _status: r.post_status === 'publish' ? 'published' : 'draft'
    })
  }
  log(`galleries: ${rows.length}`)
}

// --- content: WP HTML (Gutenberg or classic) -> Lexical

const editorConfig = await editorConfigFactory.default({ config: payload.config })
const HOSTS = /https?:\/\/(?:www\.)?(?:zskostelec\.tode\.cz|zskostelec\.cz)/g
const SIZE_SUFFIX = /-\d+x\d+(?=\.[a-z0-9]+$)/i

/** attached-file path (`2023/11/x.jpg`) -> attachment id, for images referenced by URL only. */
const attachmentByFile = new Map<string, number>()
async function loadAttachmentIndex() {
  const rows = await q(`SELECT post_id, meta_value FROM wp_postmeta WHERE meta_key = '_wp_attached_file'`)
  for (const r of rows) attachmentByFile.set(String(r.meta_value).normalize('NFC'), Number(r.post_id))
}

function attachmentIdForImg(img: Element): number | null {
  const cls = img.getAttribute('class') ?? ''
  const m = cls.match(/wp-image-(\d+)/)
  if (m) return Number(m[1])
  const src = img.getAttribute('src') ?? ''
  const rel = decodeURIComponent(src.split('/wp-content/uploads/')[1] ?? '').normalize('NFC')
  if (!rel) return null
  return attachmentByFile.get(rel) ?? attachmentByFile.get(rel.replace(SIZE_SUFFIX, '')) ?? null
}

async function contentToLexical(html: string, mediaWanted: Set<number>) {
  const dom = new JSDOM(`<body>${html.replace(/<!--\s*\/?wp:[\s\S]*?-->/g, '')}</body>`)
  const doc = dom.window.document
  // Images -> placeholder paragraphs, swapped for upload nodes after conversion.
  for (const img of [...doc.querySelectorAll('img')]) {
    const id = attachmentIdForImg(img)
    const holder = img.closest('figure') ?? img.closest('a') ?? img
    if (id) {
      mediaWanted.add(id)
      const p = doc.createElement('p')
      p.textContent = `[[media:${id}]]`
      holder.replaceWith(p)
    } else {
      holder.remove()
    }
  }
  // Embeds (YouTube…) -> a plain link.
  for (const fig of [...doc.querySelectorAll('figure.wp-block-embed')]) {
    const url = fig.textContent?.trim() ?? ''
    const p = doc.createElement('p')
    if (url.startsWith('http')) {
      const a = doc.createElement('a')
      a.href = url
      a.textContent = url
      p.append(a)
    }
    fig.replaceWith(p)
  }
  // Absolute links to the old site -> site-relative.
  for (const a of [...doc.querySelectorAll('a[href]')]) {
    a.setAttribute('href', a.getAttribute('href')!.replace(HOSTS, '') || '/')
  }
  // Classic-editor posts use bare text + <br>; wrap loose text in paragraphs.
  const body = doc.body
  if (![...body.children].some((el) => /^(P|H[1-6]|UL|OL|TABLE|BLOCKQUOTE|FIGURE|DIV)$/.test(el.tagName))) {
    const parts = body.innerHTML.split(/(?:<br\s*\/?>\s*){2,}|\n{2,}/)
    body.innerHTML = parts.map((part) => `<p>${part.trim()}</p>`).join('')
  }
  return convertHTMLToLexical({ editorConfig, html: body.innerHTML, JSDOM })
}

type LexNode = { type?: string; children?: LexNode[]; text?: string; [k: string]: unknown }

/** Replace `[[media:ID]]` placeholder paragraphs with upload nodes (dropped if the media wasn't imported). */
function swapMediaPlaceholders(node: LexNode): LexNode {
  if (!node.children) return node
  node.children = node.children.flatMap((child) => {
    const text = child.type === 'paragraph' && child.children?.length === 1 ? child.children[0].text : undefined
    const m = text?.match(/^\[\[media:(\d+)\]\]$/)
    if (m) {
      const mediaId = mediaMap.get(Number(m[1]))
      return mediaId
        ? [{ type: 'upload', version: 3, format: '', id: `wp-${m[1]}`, fields: null, relationTo: 'media', value: mediaId }]
        : []
    }
    return [swapMediaPlaceholders(child)]
  })
  return node
}

async function importPosts() {
  await loadAttachmentIndex()
  const rows = await postsOf('post')
  const ids = rows.map((r) => Number(r.ID))
  const meta = await metaFor(ids, ['gallery', 'file', 'link'])
  const cats = await termIdsFor(ids, 'category')

  // First pass: which media do the posts need (content images + attached files)?
  const wanted = new Set<number>()
  const lexical = new Map<number, unknown>()
  for (const r of rows) {
    lexical.set(Number(r.ID), await contentToLexical(String(r.post_content ?? ''), wanted))
    const file = toInt(meta.get(Number(r.ID))?.file)
    if (file) wanted.add(file)
  }
  await importMedia([...wanted])

  let done = 0
  for (const r of rows) {
    const id = Number(r.ID)
    const m = meta.get(id) ?? {}
    const content = swapMediaPlaceholders(structuredClone(lexical.get(id)) as LexNode)
    try {
      await upsert('posts', postMap, id, {
        title: decodeTitle(String(r.post_title)),
        slug: String(r.post_name || id),
        publishedAt: isoDate(r.post_date_gmt, r.post_date),
        categories: (cats.get(id) ?? []).map((c) => catMap.get(c)).filter(Boolean),
        excerpt: String(r.post_excerpt ?? '').trim() || null,
        content,
        galleries: phpArrayValues(m.gallery)
          .map((g) => galleryMap.get(Number(g)))
          .filter(Boolean),
        file: toInt(m.file) ? (mediaMap.get(Number(m.file)) ?? null) : null,
        link: m.link?.trim() || null,
        _status: 'published'
      })
    } catch (error) {
      console.warn(`  ! post ${id} (${r.post_name}):`, (error as Error).message)
    }
    if (++done % 200 === 0) log(`  posts ${done}/${rows.length}`)
  }
  log(`posts: ${rows.length}`)
}

async function importDocuments() {
  const rows = await postsOf('document')
  const ids = rows.map((r) => Number(r.ID))
  const meta = await metaFor(ids, ['file'])
  const cats = await termIdsFor(ids, 'documentCategories')
  await importMedia(ids.map((id) => toInt(meta.get(id)?.file)).filter((x): x is number => Boolean(x)))
  for (const r of rows) {
    const id = Number(r.ID)
    const file = mediaMap.get(Number(meta.get(id)?.file))
    const category = docCatMap.get((cats.get(id) ?? [])[0])
    if (!file || !category) {
      console.warn(`  ! document ${id} (${r.post_title}): ${!file ? 'missing file' : 'no category'}`)
      continue
    }
    await upsert('documents', docMap, id, {
      title: decodeTitle(String(r.post_title)),
      slug: String(r.post_name || id),
      file,
      category
    })
  }
  log(`documents: ${rows.length}`)
}

async function importGutak() {
  const rows = await postsOf('gutak')
  const ids = rows.map((r) => Number(r.ID))
  const meta = await metaFor(ids, ['file', 'preview'])
  await importMedia(ids.flatMap((id) => [toInt(meta.get(id)?.file), toInt(meta.get(id)?.preview)]).filter((x): x is number => Boolean(x)))
  for (const r of rows) {
    const id = Number(r.ID)
    const file = mediaMap.get(Number(meta.get(id)?.file))
    if (!file) {
      console.warn(`  ! gutak ${id} (${r.post_title}): missing file`)
      continue
    }
    const cover = toInt(meta.get(id)?.preview)
    await upsert('gutak', gutakMap, id, {
      title: decodeTitle(String(r.post_title)),
      file,
      cover: cover ? (mediaMap.get(cover) ?? null) : null,
      publishedAt: isoDate(r.post_date_gmt, r.post_date)
    })
  }
  log(`gutak: ${rows.length}`)
}

// ---------------------------------------------------------------- run

const started = Date.now()
if (PHASES.includes('categories')) await importTermTree('category', 'categories', catMap)
if (PHASES.includes('doccats')) await importTermTree('documentCategories', 'document-categories', docCatMap)
if (PHASES.includes('media') && !LIMIT) await importMedia()
if (PHASES.includes('galleries')) await importGalleries()
if (PHASES.includes('posts')) await importPosts()
if (PHASES.includes('documents')) await importDocuments()
if (PHASES.includes('gutak')) await importGutak()

if (missingFiles.length) {
  const out = path.resolve(process.cwd(), '../.local/import-missing-files.txt')
  fs.writeFileSync(out, missingFiles.join('\n'))
  log(`${missingFiles.length} files not found locally - list in ${out}`)
}
log(`done in ${Math.round((Date.now() - started) / 1000)} s`)
await db.end()
process.exit(0)
