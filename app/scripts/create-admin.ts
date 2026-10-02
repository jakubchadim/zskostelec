/**
 * Creates an admin account directly in the database - run it against
 * production BEFORE the site goes live, so nobody else can claim the
 * "create first user" screen. The generated password is written to
 * ../.local/admin-<email>.txt (never printed).
 *
 * Usage (from app/):
 *   DATABASE_URL=<neon> NODE_ENV=production npx payload run scripts/create-admin.ts -- <email> "<Jméno>"
 */
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

const [email, name = 'Správce webu'] = process.argv.slice(2).filter((a) => a !== '--')
if (!email?.includes('@')) {
  console.error('Usage: npx payload run scripts/create-admin.ts -- <email> "<Jméno>"')
  process.exit(1)
}

const payload = await getPayload({ config })
const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
if (existing.docs.length) {
  console.log(`${email} already exists (role: ${existing.docs[0].role}) - nothing to do.`)
  process.exit(0)
}

const password = crypto.randomBytes(15).toString('base64url')
await payload.create({ collection: 'users', data: { email, name, role: 'admin', password }, overrideAccess: true })
const out = path.resolve(process.cwd(), `../.local/admin-${email}.txt`)
fs.writeFileSync(out, `email=${email}\npassword=${password}\n`, { mode: 0o600 })
console.log(`Admin ${email} created. Password saved to ${out} - change it after the first login.`)
process.exit(0)
