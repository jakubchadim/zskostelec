/**
 * One-off: exports staff, their positions and school buildings from the WP
 * database (MariaDB loaded with the hosting export) into
 * src/content/staff.ts. After the switch the file is the source of truth -
 * staff changes are edits to that file.
 *
 * Usage (from app/):  node scripts/export-staff.ts
 */
import fs from 'node:fs'
import path from 'node:path'
import mysql from 'mysql2/promise'

const db = await mysql.createConnection({
  socketPath: process.env.WP_DB_SOCKET ?? path.resolve(process.cwd(), '../.local/mariadb.sock'),
  user: 'root',
  database: process.env.WP_DB_NAME ?? 'zskostelec',
  charset: 'utf8mb4'
})
const q = async (sql: string, params: unknown[] = []) => (await db.query(sql, params))[0] as Record<string, unknown>[]

const decode = (s: string) =>
  s
    .replace(/&#8211;/g, '–')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .trim()

async function terms(taxonomy: string) {
  return q(
    `SELECT t.term_id id, t.name FROM wp_terms t JOIN wp_term_taxonomy x ON x.term_id = t.term_id WHERE x.taxonomy = ? ORDER BY t.term_id`,
    [taxonomy]
  )
}

const buildings = (await terms('building')).map((t) => ({ id: String(t.id), name: decode(String(t.name)) }))
const positions = (await terms('positions')).map((t) => ({ id: String(t.id), name: decode(String(t.name)) }))

const people = await q(`SELECT ID, post_title FROM wp_posts WHERE post_type = 'employee' AND post_status = 'publish' ORDER BY post_title`)
const ids = people.map((p) => Number(p.ID))
const meta = await q(`SELECT post_id, meta_key, meta_value FROM wp_postmeta WHERE post_id IN (?) AND meta_key IN ('email','phone','priority')`, [ids])
const rels = await q(
  `SELECT tr.object_id, x.taxonomy, x.term_id FROM wp_term_relationships tr JOIN wp_term_taxonomy x ON x.term_taxonomy_id = tr.term_taxonomy_id
   WHERE tr.object_id IN (?) AND x.taxonomy IN ('building','positions')`,
  [ids]
)

const employees = people.map((p) => {
  const id = Number(p.ID)
  const m = (key: string) => String(meta.find((r) => Number(r.post_id) === id && r.meta_key === key)?.meta_value ?? '').trim()
  const termIds = (tax: string) => rels.filter((r) => Number(r.object_id) === id && r.taxonomy === tax).map((r) => String(r.term_id))
  return {
    id: String(id),
    name: decode(String(p.post_title)),
    positionIds: termIds('positions'),
    buildingIds: termIds('building'),
    priority: Number(m('priority')) || 50,
    email: m('email'),
    phone: m('phone')
  }
})

const out = `/*
 * Staff list, positions and school buildings (shown on /zamestnanci/ and
 * used for the staff counts on /pracoviste/). Exported once from WordPress
 * (scripts/export-staff.ts); edit this file directly from now on.
 *
 * priority: lower = higher in the list (vedení školy first), default 50.
 */
import type { StaffBuilding, StaffMember, StaffPosition } from './staff-types'

export const BUILDINGS: StaffBuilding[] = ${JSON.stringify(buildings, null, 2)}

export const POSITIONS: StaffPosition[] = ${JSON.stringify(positions, null, 2)}

export const STAFF: StaffMember[] = ${JSON.stringify(employees, null, 2)}
`
const target = path.resolve(process.cwd(), 'src/content/staff.ts')
fs.mkdirSync(path.dirname(target), { recursive: true })
fs.writeFileSync(target, out)
console.log(`${employees.length} staff, ${positions.length} positions, ${buildings.length} buildings -> ${target}`)
await db.end()
