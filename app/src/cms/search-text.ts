import type { Field } from 'payload'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { sql, type MigrateUpArgs } from '@payloadcms/db-postgres'

/*
 * Site search reads one hidden column per article/gallery: its title, perex
 * and text, lower-case and without diacritics, so "vylet" finds "Výlet" with a
 * plain ILIKE and no Postgres extension.
 */

/** Same folding as `foldText` in lib/utils (not imported: the CMS also runs in scripts without the `@/` alias). */
export function fold(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function plaintext(content: unknown): string {
  if (!content || typeof content !== 'object') return ''
  try {
    return convertLexicalToPlaintext({ data: content as SerializedEditorState })
  } catch {
    return ''
  }
}

type Source = { title?: unknown; excerpt?: unknown; content?: unknown }

export function searchTextOf({ title, excerpt, content }: Source): string {
  return fold([title, excerpt, plaintext(content)].filter((part): part is string => typeof part === 'string' && part !== '').join(' '))
}

/** The hidden search column, recomputed on every save. */
export const searchTextField: Field = {
  name: 'searchText',
  type: 'textarea',
  admin: { hidden: true },
  hooks: { beforeChange: [({ siblingData }) => searchTextOf(siblingData as Source)] }
}

type Db = MigrateUpArgs['db']

/** Writes many rows' search text in a few statements (one UPDATE per 300 rows - Neon is a round trip away). */
async function writeSearchText(db: Db, table: 'posts' | 'galleries', rows: { id: number; text: string }[]) {
  for (let i = 0; i < rows.length; i += 300) {
    const values = sql.join(
      rows.slice(i, i + 300).map((row) => sql`(${row.id}::integer, ${row.text})`),
      sql`, `
    )
    await db.execute(sql`UPDATE ${sql.identifier(table)} AS t SET search_text = v.text FROM (VALUES ${values}) AS v(id, text) WHERE t.id = v.id`)
  }
}

/** Fills the column for content saved before it existed (migration on Neon, `scripts/backfill-search-text.ts` locally). */
export async function backfillSearchText(db: Db): Promise<{ posts: number; galleries: number }> {
  const posts = (await db.execute(sql`SELECT id, title, excerpt, content FROM posts`)).rows as (Source & { id: number })[]
  await writeSearchText(db, 'posts', posts.map((row) => ({ id: row.id, text: searchTextOf(row) })))
  const galleries = (await db.execute(sql`SELECT id, title FROM galleries`)).rows as (Source & { id: number })[]
  await writeSearchText(db, 'galleries', galleries.map((row) => ({ id: row.id, text: searchTextOf(row) })))
  return { posts: posts.length, galleries: galleries.length }
}
