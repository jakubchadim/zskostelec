import os from 'node:os'
import path from 'node:path'
import type { CollectionConfig } from 'payload'
import { loggedIn } from '../access'
import { wpIdField } from '../fields'
import { revalidateAfterChange, revalidateAfterDelete } from '../revalidate'

/**
 * Every uploaded file: photos (resized on upload), PDFs, Word/Excel
 * documents, videos. In production the files live in Cloudflare R2 and are
 * served by the media worker; locally they go to `media/` on disk.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Soubor', plural: 'Soubory a fotky' },
  admin: {
    group: 'Obsah',
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize', 'createdAt'],
    description: 'Fotky, PDF a další soubory. Fotky se při nahrání samy zmenší.'
  },
  access: {
    read: () => true,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn
  },
  upload: {
    // Local files only without R2. With R2 Payload still checks this folder for name clashes,
    // so it must not be the dev folder (that renamed imports to foo-1.jpg) - use an always-empty one.
    staticDir: process.env.R2_ACCESS_KEY_ID ? path.join(os.tmpdir(), 'zskostelec-no-local-media') : path.resolve(process.cwd(), 'media'),
    // Phone photos are huge - keep at most 2560 px on the long side.
    resizeOptions: { width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true },
    imageSizes: [
      { name: 'thumb', width: 480, height: 480, fit: 'inside', withoutEnlargement: true },
      { name: 'medium', width: 1024, height: 1024, fit: 'inside', withoutEnlargement: true },
      { name: 'large', width: 2048, height: 2048, fit: 'inside', withoutEnlargement: true }
    ],
    adminThumbnail: 'thumb',
    focalPoint: true,
    mimeTypes: [
      'image/*',
      'video/mp4',
      'video/quicktime',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.*',
      'application/vnd.ms-excel',
      'application/vnd.ms-powerpoint',
      'application/zip'
    ]
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Popis (pro nevidomé a vyhledávače)',
      admin: { description: 'Krátce, co je na fotce. Nepovinné.' }
    },
    {
      name: 'legacyPath',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        description: 'Původní cesta ve WordPressu (uploads/RRRR/MM/soubor) – kvůli starým odkazům.',
        condition: (data) => Boolean(data?.legacyPath)
      }
    },
    wpIdField
  ],
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete]
  }
}
