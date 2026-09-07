import { wpFetchAllPages, WP_CACHE_TAGS } from '../client'
import { getUrlRewriteConfig } from '../env'
import { rewriteAdminUrls } from '../blocks/urls'
import { asId, type ID, type Nullable } from '../types'

type RawWpCategory = {
  id: number
  slug: string
  name: string
  link: string
  parent: number
}

export type WpCategory = {
  id: ID
  slug: string
  name: string
  link: string
  parent: Nullable<{ id: ID; name: string; link: string }>
}

const CATEGORY_FIELDS = ['id', 'slug', 'name', 'link', 'parent']

export function normalizeCategory(raw: RawWpCategory, byId: Map<number, RawWpCategory>): WpCategory {
  const parentRaw = raw.parent ? byId.get(raw.parent) : undefined
  const search = getUrlRewriteConfig()
  const link = rewriteAdminUrls(raw.link, search)

  return {
    id: asId(raw.id),
    slug: raw.slug,
    name: raw.name,
    link,
    parent: parentRaw
      ? { id: asId(parentRaw.id), name: parentRaw.name, link: rewriteAdminUrls(parentRaw.link, search) }
      : null
  }
}

export async function getCategories(): Promise<WpCategory[]> {
  const raw = await wpFetchAllPages<RawWpCategory>('wp/v2/categories', {
    fields: CATEGORY_FIELDS,
    tags: [WP_CACHE_TAGS.categories]
  })

  const byId = new Map(raw.map((category) => [category.id, category]))

  return raw.map((category) => normalizeCategory(category, byId))
}

export async function getCategoryBySlug(slug: string): Promise<WpCategory | null> {
  const categories = await getCategories()
  return categories.find((category) => category.slug === slug) ?? null
}

export async function getCategoryById(id: ID): Promise<WpCategory | null> {
  const categories = await getCategories()
  return categories.find((category) => category.id === id) ?? null
}
