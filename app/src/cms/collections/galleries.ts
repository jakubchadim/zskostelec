import type { CollectionConfig } from 'payload'
import { loggedIn, publishedOrLoggedIn } from '../access'
import { slugField, wpIdField } from '../fields'
import { revalidateAfterChange, revalidateAfterDelete } from '../revalidate'

/** Photo galleries. URL: /fotogalerie/<slug>/. */
export const Galleries: CollectionConfig = {
  slug: 'galleries',
  labels: { singular: 'Fotogalerie', plural: 'Fotogalerie' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', '_status'],
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
    wpIdField
  ],
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete]
  }
}
