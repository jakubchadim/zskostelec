/**
 * Public read-only gateway to the `zskostelec-media` R2 bucket (photos,
 * documents and videos migrated from WordPress' wp-content/uploads).
 *
 *   GET /uploads/2023/11/photo.jpg  ->  R2 object "uploads/2023/11/photo.jpg"
 *
 * Runs on workers.dev because the school's DNS isn't on Cloudflare yet;
 * once it is, the bucket can get a custom domain (media.zskostelec.cz) and
 * the site only changes its R2_PUBLIC_URL. Files are immutable (a new
 * upload gets a new name), so browsers may cache them for a year.
 */

interface Env {
  MEDIA: R2Bucket
}

const ALLOWED_PREFIXES = ['uploads/', 'media/']

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() })
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } })
    }

    const url = new URL(request.url)
    const key = decodeURIComponent(url.pathname.slice(1))
    if (!key || key.includes('..') || !ALLOWED_PREFIXES.some((prefix) => key.startsWith(prefix))) {
      return new Response('Not found', { status: 404 })
    }

    // Range + conditional requests are passed to R2 (videos seek, browsers revalidate).
    const object = await env.MEDIA.get(key, { range: request.headers, onlyIf: request.headers })
    if (object === null) {
      return new Response('Not found', { status: 404 })
    }

    const headers = new Headers(corsHeaders())
    object.writeHttpMetadata(headers)
    headers.set('ETag', object.httpEtag)
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    headers.set('Accept-Ranges', 'bytes')

    // onlyIf failed (If-None-Match matched etc.): R2 returns metadata without a body.
    if (!('body' in object)) {
      return new Response(null, { status: 304, headers })
    }

    const range = object.range as { offset?: number; length?: number; suffix?: number } | undefined
    if (range && request.headers.has('Range')) {
      const offset = range.offset ?? (range.suffix !== undefined ? object.size - range.suffix : 0)
      const length = range.length ?? object.size - offset
      headers.set('Content-Range', `bytes ${offset}-${offset + length - 1}/${object.size}`)
      headers.set('Content-Length', String(length))
      return new Response(request.method === 'HEAD' ? null : object.body, { status: 206, headers })
    }

    headers.set('Content-Length', String(object.size))
    return new Response(request.method === 'HEAD' ? null : object.body, { headers })
  }
} satisfies ExportedHandler<Env>

function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Range, If-None-Match, If-Modified-Since'
  }
}
