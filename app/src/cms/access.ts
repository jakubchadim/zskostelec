import type { Access, FieldAccess } from 'payload'

/*
 * Two roles: `admin` (the web's maintainer - everything incl. users) and
 * `editor` (school staff - articles, galleries, documents, files).
 */

type MaybeUser = { role?: string | null } | null | undefined

export const isAdmin = (user: MaybeUser) => user?.role === 'admin'

export const loggedIn: Access = ({ req }) => Boolean(req.user)
export const adminsOnly: Access = ({ req }) => isAdmin(req.user)
export const adminsOnlyField: FieldAccess = ({ req }) => isAdmin(req.user)

/** Public reads only see published documents; logged-in staff see drafts too. */
export const publishedOrLoggedIn: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}

/** Users: admins manage everyone, editors only themselves. */
export const selfOrAdmin: Access = ({ req }) => {
  if (isAdmin(req.user)) return true
  if (!req.user) return false
  return { id: { equals: req.user.id } }
}
