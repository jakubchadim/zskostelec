/**
 * One-time import of the staff list (scripts/staff-seed.ts) into the CMS:
 * positions, buildings (linked to their building on the town map) and
 * staff. Re-runnable: records are matched by their old WP id (`wpId`) and
 * existing ones are left alone, so edits made in the admin survive.
 *
 * Usage (from app/):
 *   npx payload run scripts/import-staff.ts
 *   DATABASE_URL=<neon> NODE_ENV=production npx payload run scripts/import-staff.ts
 */
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import { BUILDINGS, POSITIONS, STAFF } from './staff-seed.ts'

/** Building name fragment -> building on the town map (Pobytové středisko isn't on it). */
const WORKPLACE_BY_NAME = [
  ['Palackého', 'palackeho'],
  ['Komenského', 'komenskeho'],
  ['Drtinova', 'drtinova'],
  ['Erbenova', 'erbenova']
] as const

const payload = await getPayload({ config })
const common = { overrideAccess: true, depth: 0, context: { skipRevalidate: true } } as const

type Slug = 'staff' | 'staff-positions' | 'staff-buildings'

/** wpId -> CMS id of every record already imported. */
async function idMap(collection: Slug) {
  const res = await payload.find({ collection, pagination: false, depth: 0, where: { wpId: { exists: true } } })
  return new Map(res.docs.map((doc) => [Number(doc.wpId), doc.id]))
}

async function ensure(collection: Slug, map: Map<number, number>, wpId: number, data: Record<string, unknown>) {
  if (map.has(wpId)) return 0
  const doc = await payload.create({ collection, data: { ...data, wpId } as never, ...common })
  map.set(wpId, doc.id)
  return 1
}

const positions = await idMap('staff-positions')
const buildings = await idMap('staff-buildings')
const staff = await idMap('staff')
let created = 0

for (const p of POSITIONS) created += await ensure('staff-positions', positions, Number(p.id), { name: p.name })

for (const b of BUILDINGS) {
  const workplace = WORKPLACE_BY_NAME.find(([match]) => b.name.includes(match))?.[1] ?? null
  created += await ensure('staff-buildings', buildings, Number(b.id), { name: b.name, workplace })
}

for (const s of STAFF) {
  created += await ensure('staff', staff, Number(s.id), {
    name: s.name,
    positions: s.positionIds.map((id) => positions.get(Number(id))).filter(Boolean),
    buildings: s.buildingIds.map((id) => buildings.get(Number(id))).filter(Boolean),
    email: s.email || undefined,
    phone: s.phone || undefined,
    priority: s.priority
  })
}

console.log(`Staff import: ${created} created, ${POSITIONS.length + BUILDINGS.length + STAFF.length - created} already there.`)
process.exit(0)
