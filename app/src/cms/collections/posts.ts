import type { CollectionConfig } from 'payload'
import { loggedIn, publishedOrLoggedIn } from '../access'
import { slugField, wpIdField } from '../fields'
import { revalidateAfterChange, revalidateAfterDelete } from '../revalidate'

/** Articles (WP posts). URL: /<slug>/ - same as on the WordPress site. */
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Článek', plural: 'Články' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'categories', 'publishedAt', '_status'],
    group: 'Obsah',
    listSearchableFields: ['title', 'slug'],
    preview: (doc) => (doc?.slug ? `/${doc.slug}/` : null)
  },
  versions: { drafts: { autosave: { interval: 2000 } }, maxPerDoc: 20 },
  access: {
    read: publishedOrLoggedIn,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn
  },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', label: 'Nadpis', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'categories',
          type: 'relationship',
          relationTo: 'categories',
          hasMany: true,
          required: true,
          label: 'Kategorie',
          admin: { width: '60%' }
        },
        {
          name: 'publishedAt',
          type: 'date',
          label: 'Datum',
          required: true,
          defaultValue: () => new Date().toISOString(),
          admin: { width: '40%', date: { pickerAppearance: 'dayAndTime', displayFormat: 'd. M. yyyy HH:mm' } }
        }
      ]
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Perex',
      admin: { description: 'Jedna dvě věty do výpisu článků. Když necháte prázdné, vezme se začátek textu.' }
    },
    { name: 'content', type: 'richText', label: 'Text článku' },
    {
      name: 'galleries',
      type: 'relationship',
      relationTo: 'galleries',
      hasMany: true,
      label: 'Fotogalerie k článku',
      admin: { description: 'Galerie se zobrazí pod článkem.' }
    },
    {
      type: 'row',
      fields: [
        { name: 'file', type: 'upload', relationTo: 'media', label: 'Příloha (soubor)', admin: { width: '50%' } },
        { name: 'link', type: 'text', label: 'Odkaz (URL)', admin: { width: '50%' } }
      ]
    },
    {
      name: 'pinned',
      type: 'checkbox',
      label: 'Hlavní článek na úvodní stránce',
      admin: { position: 'sidebar', description: 'Zobrazí se velký nahoře na úvodní stránce (platí nejnovější připnutý).' }
    },
    slugField(),
    wpIdField
  ],
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete]
  }
}
