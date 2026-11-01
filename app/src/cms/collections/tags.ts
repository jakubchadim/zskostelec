import type { CollectionConfig } from 'payload'
import { loggedIn } from '../access'
import { slugField } from '../fields'
import { revalidateAfterChange, revalidateAfterDelete } from '../revalidate'

/**
 * Labels across categories (1. stupeň, 2. stupeň, Školní družina…) that the
 * school sets up itself. Articles and galleries carry them; listings turn the
 * ones in use into filter chips. URL: <listing>/stitek-<slug>/.
 */
export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: { singular: 'Štítek', plural: 'Štítky' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'slug'],
    group: 'Nastavení',
    description:
      'Štítky (např. 1. stupeň, 2. stupeň, Školní družina) přidáváte k článkům a fotogaleriím. Nad výpisy se z nich stane filtr – ukáže se jen štítek, který má aspoň jeden článek nebo galerie v daném výpisu.'
  },
  access: {
    read: () => true,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn
  },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', label: 'Název', required: true },
    {
      name: 'order',
      type: 'number',
      label: 'Pořadí',
      defaultValue: 10,
      required: true,
      admin: { description: 'Pořadí ve filtru: menší číslo je dřív.' }
    },
    slugField()
  ],
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete]
  }
}
