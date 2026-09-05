import { getRevalidateSeconds, getWpApiBase } from './env'

/**
 * Cache tags per content type. `T9` (ISR + revalidation, later wave) calls
 * `revalidateTag()` with these from a WP save-post webhook, so these
 * strings are a stable cross-task contract - don't rename casually.
 */
export const WP_CACHE_TAGS = {
  posts: 'posts',
  pages: 'pages',
  categories: 'categories',
  gallery: 'gallery',
  employee: 'employee',
  document: 'document',
  gutak: 'gutak',
  menus: 'menus',
  media: 'media'
} as const

export type WpCacheTag = (typeof WP_CACHE_TAGS)[keyof typeof WP_CACHE_TAGS]

export class WpApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly path: string
  ) {
    super(message)
    this.name = 'WpApiError'
  }
}

export type WpFetchOptions = {
  /** `_fields` payload trimming - dot-notation for nested fields (e.g. `acf.mainPost`). */
  fields?: string[]
  params?: Record<string, string | number | boolean | undefined>
  tags?: string[]
  /** Overrides the default `WP_REVALIDATE_SECONDS` window for this call. */
  revalidate?: number | false
}

function buildUrl(path: string, options?: WpFetchOptions): string {
  const base = `${getWpApiBase()}/`
  const url = new URL(path.replace(/^\/+/, ''), base)

  if (options?.fields?.length) {
    url.searchParams.set('_fields', options.fields.join(','))
  }

  for (const [key, value] of Object.entries(options?.params ?? {})) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  }

  return url.toString()
}

async function rawFetch(path: string, options?: WpFetchOptions): Promise<Response> {
  const url = buildUrl(path, options)
  const revalidate = options?.revalidate ?? getRevalidateSeconds()

  const response = await fetch(url, {
    next: { tags: options?.tags, revalidate }
  })

  if (!response.ok) {
    throw new WpApiError(
      `WP REST request failed: ${response.status} ${response.statusText} (${path})`,
      response.status,
      path
    )
  }

  return response
}

export async function wpFetch<T>(path: string, options?: WpFetchOptions): Promise<T> {
  const response = await rawFetch(path, options)
  return (await response.json()) as T
}

/** Like `wpFetch`, but a 404 response resolves to `null` instead of throwing - for single-entity-by-id lookups. */
export async function wpFetchOrNull<T>(path: string, options?: WpFetchOptions): Promise<T | null> {
  try {
    return await wpFetch<T>(path, options)
  } catch (error) {
    if (error instanceof WpApiError && error.status === 404) {
      return null
    }

    throw error
  }
}

export type WpCollectionResult<T> = {
  items: T[]
  totalCount: number
  totalPages: number
}

/** A single page of a WP REST collection endpoint, exposing the `X-WP-Total`/`X-WP-TotalPages` headers. */
export async function wpFetchCollection<T>(path: string, options?: WpFetchOptions): Promise<WpCollectionResult<T>> {
  const response = await rawFetch(path, options)
  const items = (await response.json()) as T[]

  return {
    items,
    totalCount: Number(response.headers.get('x-wp-total') ?? items.length),
    totalPages: Number(response.headers.get('x-wp-totalpages') ?? 1)
  }
}

const MAX_PER_PAGE = 100

/** Loops WP REST pagination (`per_page`/`page`) to fetch every item of a collection. */
export async function wpFetchAllPages<T>(path: string, options?: WpFetchOptions): Promise<T[]> {
  const first = await wpFetchCollection<T>(path, {
    ...options,
    params: { ...options?.params, per_page: MAX_PER_PAGE, page: 1 }
  })

  if (first.totalPages <= 1) {
    return first.items
  }

  const rest = await Promise.all(
    Array.from({ length: first.totalPages - 1 }, (_, idx) =>
      wpFetchCollection<T>(path, {
        ...options,
        params: { ...options?.params, per_page: MAX_PER_PAGE, page: idx + 2 }
      })
    )
  )

  return [first.items, ...rest.map((page) => page.items)].flat()
}
