import type { Field } from 'payload'

/** Lower-case, diacritics-free, dash-separated - "Výlet do Prahy!" -> "vylet-do-prahy". */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)
}

/** URL slug, filled from `from` (usually the title) when left empty. Unique per collection. */
export function slugField(from = 'title'): Field {
  return {
    name: 'slug',
    type: 'text',
    label: 'Adresa (slug)',
    unique: true,
    index: true,
    admin: {
      position: 'sidebar',
      description: 'Část adresy stránky. Když necháte prázdné, vytvoří se z názvu.'
    },
    hooks: {
      beforeValidate: [
        ({ value, data }) => {
          if (typeof value === 'string' && value.trim()) return slugify(value)
          const source = data?.[from]
          return typeof source === 'string' ? slugify(source) : value
        }
      ]
    }
  }
}

/** Original WordPress id - lets the importer re-run without duplicating anything. */
export const wpIdField: Field = {
  name: 'wpId',
  type: 'number',
  unique: true,
  index: true,
  admin: { position: 'sidebar', readOnly: true, description: 'ID z původního WordPressu (import).', condition: (data) => Boolean(data?.wpId) }
}
