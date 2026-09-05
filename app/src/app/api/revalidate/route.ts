import { timingSafeEqual } from 'node:crypto'
import { revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'
import { resolveRevalidationTags, type RevalidatePayload } from './mapping'

const RAW_BODY_ECHO_LIMIT = 500

function isAuthorized(request: NextRequest): boolean {
  const expected = process.env.REVALIDATE_SECRET
  if (!expected) return false // fail closed if unconfigured

  const provided = request.headers.get('x-revalidate-secret') ?? ''
  const providedBuf = Buffer.from(provided)
  const expectedBuf = Buffer.from(expected)

  if (providedBuf.length !== expectedBuf.length) {
    timingSafeEqual(expectedBuf, expectedBuf) // burn a same-cost compare either way
    return false
  }

  return timingSafeEqual(providedBuf, expectedBuf)
}

/** A JSON object (not null, not an array) - anything else is treated as malformed. */
function isPayloadShaped(value: unknown): value is RevalidatePayload {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const rawBody = await request.text()
  let payload: RevalidatePayload = {}
  let malformed = false

  try {
    const parsed = rawBody ? JSON.parse(rawBody) : {}
    if (isPayloadShaped(parsed)) {
      payload = parsed
    } else {
      malformed = true
    }
  } catch {
    malformed = true
  }

  // A malformed body still revalidates (resolveRevalidationTags falls back to
  // every tag for an empty/unknown payload) - a misbehaving webhook should
  // fail toward freshness, not silently leave the cache stale. The raw body
  // is echoed back (truncated) so the bad request is diagnosable.
  const tags = resolveRevalidationTags(payload)

  for (const tag of tags) {
    // `"max"` is Next's recommended second argument for a full on-demand
    // purge from a Route Handler (`revalidateTag(tag)` alone is deprecated -
    // `updateTag` is the alternative, but it only works inside Server Actions).
    revalidateTag(tag, 'max')
  }

  return NextResponse.json({
    revalidated: true,
    type: typeof payload.type === 'string' ? payload.type : null,
    id: payload.id ?? null,
    slug: payload.slug ?? null,
    tags,
    malformed,
    ...(malformed ? { receivedBody: rawBody.slice(0, RAW_BODY_ECHO_LIMIT) } : {})
  })
}
