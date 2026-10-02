import type { CollectionConfig } from 'payload'
import { adminsOnly, loggedIn } from '../access'
import { slugField, wpIdField } from '../fields'
import { revalidateAfterChange, revalidateAfterDelete } from '../revalidate'

/** Downloadable documents on /dokumenty/ (řády, formuláře, výroční zprávy…). */
export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'Dokument', plural: 'Dokumenty' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'updatedAt'],
    group: 'Obsah',
    listSearchableFields: ['title']
  },
  access: {
    read: () => true,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn
  },
  defaultSort: 'title',
  fields: [
    { name: 'title', type: 'text', label: 'Název', required: true },
    { name: 'file', type: 'upload', relationTo: 'media', label: 'Soubor', required: true },
    { name: 'category', type: 'relationship', relationTo: 'document-categories', label: 'Kategorie', required: true },
    slugField(),
    wpIdField
  ],
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete]
  }
}

export const DocumentCategories: CollectionConfig = {
  slug: 'document-categories',
  labels: { singular: 'Kategorie dokumentů', plural: 'Kategorie dokumentů' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'parent', 'order'], group: 'Nastavení' },
  access: {
    read: () => true,
    create: adminsOnly,
    update: adminsOnly,
    delete: adminsOnly
  },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', label: 'Název', required: true },
    { name: 'parent', type: 'relationship', relationTo: 'document-categories', label: 'Nadřazená kategorie' },
    { name: 'order', type: 'number', label: 'Pořadí', defaultValue: 0 },
    slugField(),
    wpIdField
  ],
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete]
  }
}
