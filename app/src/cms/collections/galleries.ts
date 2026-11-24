import type { CollectionConfig } from 'payload'
import { loggedIn, publishedOrLoggedIn } from '../access'
import { slugField, wpIdField } from '../fields'
import { rememberPathsBeforeDelete, revalidateAfterChange, revalidateAfterDelete } from '../revalidate'
import { searchTextField } from '../search-text'

/** Photo galleries. URL: /fotogalerie/<slug>/. */
export const Galleries: CollectionConfig = {
  slug: 'galleries',
  labels: { singular: 'Fotogalerie', plural: 'Fotogalerie' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'tags', 'publishedAt', '_status'],
    group: 'Obsah',
    listSearchableFields: ['title', 'slug'],
    preview: (doc) => (doc?.slug ? `/fotogalerie/${doc.slug}/` : null)
  },
  versions: { drafts: true, maxPerDoc: 10 },
  access: {
    read: publishedOrLoggedIn,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn
  },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', label: 'Název', required: true },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Datum akce',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'd. M. yyyy' } }
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      label: 'Štítky',
      admin: { description: 'Podle štítků si návštěvníci filtrují výpis (např. 1. stupeň, Školní družina). Štítky spravujete v Nastavení › Štítky.' }
    },
    {
      name: 'photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Fotky',
      filterOptions: { mimeType: { contains: 'image' } },
      admin: { description: 'Přetáhněte sem fotky (klidně celou složku najednou). Pořadí změníte přetažením.' }
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: 'Titulní fotka',
      filterOptions: { mimeType: { contains: 'image' } },
      admin: { position: 'sidebar', description: 'Když nevyberete, použije se první fotka.' }
    },
    slugField(),
    wpIdField,
    searchTextField
  ],
  hooks: {
    afterChange: [revalidateAfterChange],
    // The articles embedding a gallery lose the reference on delete - find them first.
    beforeDelete: [rememberPathsBeforeDelete],
    afterDelete: [revalidateAfterDelete]
  }
}
