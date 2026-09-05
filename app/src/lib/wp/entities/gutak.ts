import { wpFetchAllPages, WP_CACHE_TAGS } from '../client'
import { asId, type ID, type WpMediaLike } from '../types'
import { extractUrl, normalizeAcfImage } from './media'

type RawWpGutak = {
  id: number
  title: { rendered: string }
  acf?: { file?: { url?: unknown } | null; preview?: unknown }
}

export type WpGutak = {
  id: ID
  title: string
  fileUrl: string
  preview: WpMediaLike | null
}

const GUTAK_FIELDS = ['id', 'title', 'acf']

export function normalizeGutak(raw: RawWpGutak): WpGutak {
  return {
    id: asId(raw.id),
    title: raw.title.rendered,
    fileUrl: extractUrl(raw.acf?.file?.url),
    preview: normalizeAcfImage(raw.acf?.preview)
  }
}

/** Only gutaky with an attached file - matches the Gatsby-era `allWordpressWpGutak` filter (`acf.file.link != null`). */
export async function getGutaky(): Promise<WpGutak[]> {
  const raw = await wpFetchAllPages<RawWpGutak>('wp/v2/gutak', {
    fields: GUTAK_FIELDS,
    tags: [WP_CACHE_TAGS.gutak]
  })

  return raw.map(normalizeGutak).filter((gutak) => gutak.fileUrl !== '')
}
