import { wpFetch, wpFetchAllPages, wpFetchOrNull, WP_CACHE_TAGS } from '../client'
import { getUrlRewriteConfig } from '../env'
import { normalizeBlocks, transformBlocks } from '../blocks/normalizer'
import { rewriteAdminUrls } from '../blocks/urls'
import type { RawBlock, TransformedBlock } from '../blocks/types'
import { asId, type ID, type Nullable, type RawHTML, type WpAcfLink } from '../types'

/**
 * Mirrors `web/.gatsby/gatsby-node.ts`'s `TemplateType` enum - the WP page
 * template filename (`page.template`) picks which route template renders
 * a page. Adding a new WP page template requires adding both the PHP
 * template in `admin/theme/` and an entry here.
 */
export enum PageTemplateType {
  HOME = 'page-home',
  GALLERIES = 'page-galleries',
  DOCUMENTS = 'page-documents',
  GUTAKY = 'page-gutak',
  EMPLOYEES = 'page-employees',
  DEFAULT = 'default'
}

const TEMPLATE_TYPE_BY_FILENAME: Record<string, PageTemplateType> = {
  'page-home.php': PageTemplateType.HOME,
  'page-galleries.php': PageTemplateType.GALLERIES,
  'page-documents.php': PageTemplateType.DOCUMENTS,
  'page-gutak.php': PageTemplateType.GUTAKY,
  'page-employees.php': PageTemplateType.EMPLOYEES
}

type RawMainPostRef = { ID?: number; id?: number } | number | null | undefined

type RawWpPage = {
  id: number
  slug: string
  link: string
  title: { rendered: string }
  content: { rendered: string }
  template: string
  blocks?: RawBlock[]
  acf?: {
    mainPost?: RawMainPostRef
    mainCategory?: { slug: string } | null
    additionalCategoryFirst?: { slug: string } | null
    additionalCategorySecond?: { slug: string } | null
    fastMenu?: string
    fastMenuSecond?: string
    sectionLink?: WpAcfLink | null
  }
}

export type WpPageAcf = {
  mainPost: Nullable<ID>
  mainCategory: Nullable<{ slug: string }>
  additionalCategoryFirst: Nullable<{ slug: string }>
  additionalCategorySecond: Nullable<{ slug: string }>
  fastMenu: Nullable<string>
  fastMenuSecond: Nullable<string>
  sectionLink: Nullable<WpAcfLink>
}

export type WpPage = {
  id: ID
  slug: string
  link: string
  title: RawHTML
  content: RawHTML
  blocks: TransformedBlock[]
  template: PageTemplateType
  acf: WpPageAcf
}

const PAGE_FIELDS = ['id', 'slug', 'link', 'title', 'content', 'template', 'blocks', 'acf']

/**
 * The ACF `mainPost` field is a `post_object` with `return_format: object`
 * - the Gatsby-era schema customization (`wordpress__PAGEAcf.mainPost: Int`)
 * shows gatsby-source-wordpress auto-linked it down to just the post's
 * `wordpress_id` (raw WP_Post's `ID` property). Handle both that object
 * shape and a bare id defensively.
 */
function normalizeMainPostId(value: RawMainPostRef): Nullable<ID> {
  if (value == null) {
    return null
  }

  if (typeof value === 'number') {
    return asId(value)
  }

  const id = value.ID ?? value.id
  return id != null ? asId(id) : null
}

function normalizePage(raw: RawWpPage): WpPage {
  const search = getUrlRewriteConfig()
  const rewritten = rewriteAdminUrls(raw, search)
  const blocks = normalizeBlocks(transformBlocks(rewritten.blocks ?? [], null), search)

  return {
    id: asId(rewritten.id),
    slug: rewritten.slug,
    link: rewritten.link,
    title: rewritten.title.rendered as RawHTML,
    content: rewritten.content.rendered as RawHTML,
    blocks,
    template: TEMPLATE_TYPE_BY_FILENAME[rewritten.template] ?? PageTemplateType.DEFAULT,
    acf: {
      mainPost: normalizeMainPostId(rewritten.acf?.mainPost),
      mainCategory: rewritten.acf?.mainCategory ?? null,
      additionalCategoryFirst: rewritten.acf?.additionalCategoryFirst ?? null,
      additionalCategorySecond: rewritten.acf?.additionalCategorySecond ?? null,
      fastMenu: rewritten.acf?.fastMenu ?? null,
      fastMenuSecond: rewritten.acf?.fastMenuSecond ?? null,
      sectionLink: rewritten.acf?.sectionLink ?? null
    }
  }
}

export async function getPages(): Promise<WpPage[]> {
  const raw = await wpFetchAllPages<RawWpPage>('wp/v2/pages', {
    fields: PAGE_FIELDS,
    tags: [WP_CACHE_TAGS.pages]
  })

  return raw.map(normalizePage)
}

export async function getPageBySlug(slug: string): Promise<WpPage | null> {
  const results = await wpFetch<RawWpPage[]>('wp/v2/pages', {
    fields: PAGE_FIELDS,
    params: { slug },
    tags: [WP_CACHE_TAGS.pages, `page-${slug}`]
  })

  const [raw] = results
  return raw ? normalizePage(raw) : null
}

export async function getPageById(id: ID): Promise<WpPage | null> {
  const raw = await wpFetchOrNull<RawWpPage>(`wp/v2/pages/${id}`, {
    fields: PAGE_FIELDS,
    tags: [WP_CACHE_TAGS.pages, `page-${id}`]
  })

  return raw ? normalizePage(raw) : null
}
