/**
 * Branded primitive types, mirroring `web/src/types.d.ts`'s `Opaque<K, T>`
 * pattern. These carry no runtime representation beyond the underlying
 * primitive - they exist purely so values that have been through the right
 * normalization step (JSON-encoded block attrs, WP REST rendered HTML, a
 * WP date string) aren't accidentally interchanged with a plain string.
 */
type Opaque<K extends string, T> = T & { readonly __opaque__: K }

export type ID = Opaque<'ID', string>
export type Json = Opaque<'Json', string>
export type RawHTML = Opaque<'RawHTML', string>
export type DateString = Opaque<'DateString', string>
export type Nullable<T> = T | null

/** WP REST ids are numbers; every entity in this data layer keys on the branded string `ID` instead (see T1 plan). */
export function asId(value: string | number): ID {
  return String(value) as ID
}

export function toJson(value: unknown): Json {
  return JSON.stringify(value) as Json
}

export function fromJson<T = unknown>(value: Json): T {
  return JSON.parse(value) as T
}

export type WpImageSize = {
  source_url: string
  width: number
  height: number
}

/** The shape ACF image/file fields configured with `return_format: array` return, fully hydrated (no extra fetch needed). */
export type WpMediaLike = {
  id: ID
  source_url: string
  filename?: string
  caption?: string
  alt_text?: string
  media_details?: {
    sizes?: Record<string, WpImageSize>
  }
}

/** The shape an ACF `link` field (`return_format: array`) returns. */
export type WpAcfLink = {
  url: string
  title: string
  target: string
}
