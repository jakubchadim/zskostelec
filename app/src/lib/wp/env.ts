const DEFAULT_REVALIDATE_SECONDS = 300

export function getWpUrl(): string {
  const url = process.env.WP_URL

  if (!url) {
    throw new Error('WP_URL environment variable is not set (e.g. https://zskostelec.tode.cz)')
  }

  return url.replace(/\/+$/, '')
}

export function getWpApiBase(): string {
  return `${getWpUrl()}/wp-json`
}

/** The origin to strip when rewriting admin-domain links/media URLs back to site-relative paths. */
export function getWpAdminOrigin(): string {
  return getWpUrl()
}

export type UrlRewriteConfig = { sourceUrl: string; replacementUrl: string }

export function getUrlRewriteConfig(): UrlRewriteConfig {
  return { sourceUrl: getWpAdminOrigin(), replacementUrl: '' }
}

/**
 * Time-based ISR revalidation window, in seconds, used until T9's
 * tag-based on-demand revalidation (a WP save-post webhook calling
 * `revalidateTag`) lands. Overridable per `wpFetch*` call, or globally via
 * `WP_REVALIDATE_SECONDS`.
 */
export function getRevalidateSeconds(): number {
  const raw = process.env.WP_REVALIDATE_SECONDS
  const parsed = raw != null ? Number(raw) : NaN
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_REVALIDATE_SECONDS
}
