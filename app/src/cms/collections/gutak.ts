import type { CollectionConfig } from 'payload'
import { loggedIn } from '../access'
import { wpIdField } from '../fields'
import { revalidateAfterChange, revalidateAfterDelete } from '../revalidate'

/** Issues of the school magazine Guťák (/gutak/): a PDF and its cover. */
export const Gutak: CollectionConfig = {
  slug: 'gutak',
  labels: { singular: 'Číslo Guťáku', plural: 'Guťák' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt'],
    group: 'Obsah',
    description: 'Školní časopis – každé číslo je PDF s obálkou.'
  },
  access: {
    read: () => true,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn
  },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', label: 'Název čísla', required: true, admin: { description: 'Např. „Číslo 2 … 2022 – 2023“' } },
    { name: 'file', type: 'upload', relationTo: 'media', label: 'PDF časopisu', required: true },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: 'Obálka (obrázek)',
      filterOptions: { mimeType: { contains: 'image' } }
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Datum vydání',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'd. M. yyyy' } }
    },
    wpIdField
  ],
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete]
  }
}
