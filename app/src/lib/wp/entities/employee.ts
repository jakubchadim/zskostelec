import { wpFetchAllPages, WP_CACHE_TAGS } from '../client'
import { asId, type ID, type WpMediaLike } from '../types'
import { normalizeAcfImage } from './media'
import type { WorkplaceKey } from '@/components/workplaces/data'

type RawWpEmployee = {
  id: number
  title: { rendered: string }
  positions: number[]
  building: number[]
  acf?: { email?: string; phone?: string; priority?: number; photo?: unknown }
}

export type WpEmployee = {
  id: ID
  name: string
  positionIds: ID[]
  buildingIds: ID[]
  priority: number
  email: string
  phone: string
  photo: WpMediaLike | null
}

type RawWpTerm = { id: number; name: string }
export type WpPosition = { id: ID; name: string }
/** `workplace`: the building on the town map, for the building popover (CMS only). */
export type WpBuilding = { id: ID; name: string; workplace?: WorkplaceKey | null }

const EMPLOYEE_FIELDS = ['id', 'title', 'positions', 'building', 'acf']

export function normalizeEmployee(raw: RawWpEmployee): WpEmployee {
  return {
    id: asId(raw.id),
    name: raw.title.rendered,
    positionIds: (raw.positions ?? []).map(asId),
    buildingIds: (raw.building ?? []).map(asId),
    priority: raw.acf?.priority ?? 50,
    email: raw.acf?.email ?? '',
    phone: raw.acf?.phone ?? '',
    photo: normalizeAcfImage(raw.acf?.photo)
  }
}

/** Sorted by ACF `priority` then name, matching the Gatsby-era `sort: { fields: [acf___priority, title] }` query. */
export async function getEmployees(): Promise<WpEmployee[]> {
  const raw = await wpFetchAllPages<RawWpEmployee>('wp/v2/employee', {
    fields: EMPLOYEE_FIELDS,
    tags: [WP_CACHE_TAGS.employee]
  })

  return raw.map(normalizeEmployee).sort((a, b) => a.priority - b.priority || a.name.localeCompare(b.name, 'cs'))
}

export async function getPositions(): Promise<WpPosition[]> {
  const raw = await wpFetchAllPages<RawWpTerm>('wp/v2/positions', {
    fields: ['id', 'name'],
    tags: [WP_CACHE_TAGS.employee]
  })

  return raw.map((term) => ({ id: asId(term.id), name: term.name }))
}

export async function getBuildings(): Promise<WpBuilding[]> {
  const raw = await wpFetchAllPages<RawWpTerm>('wp/v2/building', {
    fields: ['id', 'name'],
    tags: [WP_CACHE_TAGS.employee]
  })

  return raw.map((term) => ({ id: asId(term.id), name: term.name }))
}
