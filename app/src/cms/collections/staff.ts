import type { CollectionConfig } from 'payload'
import { adminsOnly, loggedIn } from '../access'
import { wpIdField } from '../fields'
import { revalidateAfterChange, revalidateAfterDelete } from '../revalidate'
import { WORKPLACES } from '../../components/workplaces/data'

/** Staff directory on /zamestnanci/ (also the staff counts on /pracoviste/). */
export const Staff: CollectionConfig = {
  slug: 'staff',
  labels: { singular: 'Zaměstnanec', plural: 'Zaměstnanci' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'positions', 'buildings', 'email'],
    group: 'Obsah',
    listSearchableFields: ['name', 'email'],
    description: 'Seznam na stránce Zaměstnanci. Řadí se podle pořadí, pak podle jména.'
  },
  access: {
    read: () => true,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn
  },
  defaultSort: 'name',
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Jméno',
      required: true,
      admin: { description: 'Ve tvaru „Příjmení Jméno, titul“, např. „Novák Jan, Mgr.“' }
    },
    { name: 'positions', type: 'relationship', relationTo: 'staff-positions', hasMany: true, label: 'Pozice' },
    { name: 'buildings', type: 'relationship', relationTo: 'staff-buildings', hasMany: true, label: 'Pracoviště' },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', label: 'E-mail' },
        { name: 'phone', type: 'text', label: 'Telefon' }
      ]
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Fotka',
      filterOptions: { mimeType: { contains: 'image' } },
      admin: { description: 'Nepovinné – bez fotky se ukážou barevné iniciály.' }
    },
    {
      name: 'priority',
      type: 'number',
      label: 'Pořadí',
      defaultValue: 50,
      required: true,
      admin: { position: 'sidebar', description: 'Menší číslo = výš v seznamu (vedení školy má 1–10). Běžně 50.' }
    },
    wpIdField
  ],
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete]
  }
}

export const StaffPositions: CollectionConfig = {
  slug: 'staff-positions',
  labels: { singular: 'Pozice', plural: 'Pozice zaměstnanců' },
  admin: { useAsTitle: 'name', group: 'Nastavení' },
  access: {
    read: () => true,
    create: loggedIn,
    update: loggedIn,
    delete: adminsOnly
  },
  defaultSort: 'name',
  fields: [{ name: 'name', type: 'text', label: 'Název', required: true, unique: true }, wpIdField],
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete]
  }
}

export const StaffBuildings: CollectionConfig = {
  slug: 'staff-buildings',
  labels: { singular: 'Pracoviště', plural: 'Pracoviště' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'workplace'], group: 'Nastavení' },
  access: {
    read: () => true,
    create: adminsOnly,
    update: adminsOnly,
    delete: adminsOnly
  },
  defaultSort: 'name',
  fields: [
    { name: 'name', type: 'text', label: 'Název', required: true, unique: true },
    {
      name: 'workplace',
      type: 'select',
      label: 'Budova na mapě',
      options: WORKPLACES.map((w) => ({ label: `${w.name} (${w.address})`, value: w.key })),
      admin: { description: 'Propojí pracoviště s mapou města (/pracoviste/) a s okénkem o budově u učitelů.' }
    },
    wpIdField
  ],
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete]
  }
}
