import type { CollectionConfig } from 'payload'
import { adminsOnly, adminsOnlyField, isAdmin, selfOrAdmin } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Uživatel', plural: 'Uživatelé' },
  auth: {
    // Teachers stay logged in for a school week.
    tokenExpiration: 60 * 60 * 24 * 7,
    maxLoginAttempts: 10,
    lockTime: 10 * 60 * 1000
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Nastavení'
  },
  access: {
    read: selfOrAdmin,
    create: adminsOnly,
    update: selfOrAdmin,
    delete: adminsOnly,
    // Only admins see the "Uživatelé" section in the sidebar.
    admin: ({ req }) => Boolean(req.user)
  },
  fields: [
    { name: 'name', type: 'text', label: 'Jméno', required: true },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Správce webu', value: 'admin' },
        { label: 'Redaktor (učitel)', value: 'editor' }
      ],
      access: { update: adminsOnlyField },
      admin: { description: 'Redaktor může psát články, galerie a dokumenty. Správce navíc spravuje uživatele.' }
    }
  ],
  hooks: {
    // The very first account is always an admin (no one else could create users otherwise).
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', req })
          if (totalDocs === 0) data.role = 'admin'
          else if (!isAdmin(req.user)) data.role = 'editor'
        }
        return data
      }
    ]
  }
}
