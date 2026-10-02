import { NextResponse, type NextRequest } from 'next/server'
import { cms } from '@/lib/content/payload'

/** WordPress' generated sizes (`foto-300x200.jpg`) map to the original upload. */
const SIZE_SUFFIX = /-\d+x\d+(?=\.[a-z0-9]+$)/i

/**
 * Old links to WordPress files (`/wp-content/uploads/2023/11/foto.jpg` - in
 * e-mails, on Facebook, in old articles) -> the same file in the CMS, found
 * by the path it had in WordPress (media.legacyPath). Permanent redirect, so
 * browsers and search engines remember the new address.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const rel = path.map((part) => decodeURIComponent(part)).join('/')
  const candidates = [...new Set([rel, rel.replace(SIZE_SUFFIX, '')].flatMap((p) => [p.normalize('NFC'), p.normalize('NFD')]))]

  const payload = await cms()
  const res = await payload.find({
    collection: 'media',
    where: { legacyPath: { in: candidates.map((p) => `uploads/${p}`) } },
    limit: 1,
    depth: 0
  })
  const url = res.docs[0]?.url
  if (!url) {
    return new NextResponse('Soubor nebyl nalezen', { status: 404 })
  }
  return NextResponse.redirect(new URL(url, request.url), 301)
}
