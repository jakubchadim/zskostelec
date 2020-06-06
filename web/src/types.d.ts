export type Opaque<K, T> = T & { __TYPE__: K }

export type ID = Opaque<'ID', string>
export type Json = Opaque<'Json', string>
export type RawHTML = Opaque<'RawHTML', string>
export type DateString = Opaque<'DateString', string>
export type Nullable<T> = T | null
