import type { CollectionConfig } from 'payload'
import { adminsOnly } from '../access'
import { slugField, wpIdField } from '../fields'
import { revalidateAfterChange, revalidateAfterDelete } from '../revalidate'

/** Article categories (Aktuality, Upozornění, Projekty › Dotace…). URL: /clanky/<parent>/<slug>/. */
export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Kategorie', plural: 'Kategorie' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'parent', 'slug'],
    group: 'Nastavení',
    description: 'Kategorie článků. Mění je jen správce webu (souvisí s menu).'
  },
  access: {
    read: () => true,
    create: adminsOnly,
    update: adminsOnly,
    delete: adminsOnly
  },
  defaultSort: 'title',
  fields: [
    { name: 'title', type: 'text', label: 'Název', required: true },
    { name: 'parent', type: 'relationship', relationTo: 'categories', label: 'Nadřazená kategorie' },
    { name: 'description', type: 'textarea', label: 'Popis' },
    slugField(),
    wpIdField
  ],
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete]
  }
}
