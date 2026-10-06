import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { EXPERIMENTAL_TableFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { cs } from '@payloadcms/translations/languages/cs'
import sharp from 'sharp'
import { Users } from './cms/collections/users'
import { Media } from './cms/collections/media'
import { Categories } from './cms/collections/categories'
import { Posts } from './cms/collections/posts'
import { Galleries } from './cms/collections/galleries'
import { DocumentCategories, Documents } from './cms/collections/documents'
import { Gutak } from './cms/collections/gutak'
import { Staff, StaffBuildings, StaffPositions } from './cms/collections/staff'
import { migrations } from './migrations'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/*
 * Files: Cloudflare R2 (S3 API) when R2_* credentials are set, otherwise
 * the local `media/` folder (development). Public URLs point at the media
 * worker (R2_PUBLIC_URL), so the site never serves files through Next.
 */
const r2 = process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_ACCOUNT_ID

export default buildConfig({
  serverURL: process.env.SITE_URL || undefined,
  secret: process.env.PAYLOAD_SECRET || '',
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' – Admin ZŠ Kostelec',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/icon.svg' }]
    },
    components: {
      graphics: {
        Logo: '@/cms/admin/branding#Logo',
        Icon: '@/cms/admin/branding#Icon'
      }
    },
    importMap: { baseDir: path.resolve(dirname) },
    dateFormat: 'd. M. yyyy',
    // Light only, matching the site - the default follows the OS and turns dark on many PCs.
    theme: 'light'
  },
  i18n: { supportedLanguages: { cs }, fallbackLanguage: 'cs' },
  collections: [Posts, Galleries, Documents, Gutak, Staff, Media, Categories, DocumentCategories, StaffPositions, StaffBuildings, Users],
  editor: lexicalEditor({ features: ({ defaultFeatures }) => [...defaultFeatures, EXPERIMENTAL_TableFeature()] }),
  db: postgresAdapter({
    // keepAlive: Neon drops idle TCP connections, which surfaced as 'Connection terminated unexpectedly'.
    pool: { connectionString: process.env.DATABASE_URL || '', keepAlive: true, idleTimeoutMillis: 20_000 },
    // Production (Neon) gets its schema from migrations (src/migrations, `payload migrate:create`),
    // applied when the server starts; local development keeps Payload's automatic schema push.
    prodMigrations: migrations
  }),
  sharp,
  graphQL: { disable: true },
  telemetry: false,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  plugins: r2
    ? [
        s3Storage({
          collections: {
            media: {
              prefix: 'media',
              disablePayloadAccessControl: true,
              generateFileURL: ({ filename, prefix }) =>
                `${process.env.R2_PUBLIC_URL}/${[prefix, filename].filter(Boolean).join('/')}`
            }
          },
          // Browser -> R2 directly (presigned PUT): phone photos exceed Vercel's 4.5 MB request
          // limit. Payload then reads the file back to generate the smaller sizes.
          clientUploads: true,
          bucket: process.env.R2_BUCKET || 'zskostelec-media',
          config: {
            endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            region: 'auto',
            credentials: {
              accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
              secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || ''
            }
          }
        })
      ]
    : []
})
