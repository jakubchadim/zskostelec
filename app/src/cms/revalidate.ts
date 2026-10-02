import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

/**
 * Content changed in the admin -> refresh the public site. The whole site
 * is revalidated: edits are rare (a few a week) and an article or gallery
 * shows up on many pages (home, categories, listings), so precise tags
 * aren't worth the bookkeeping. Skipped for bulk imports
 * (`req.context.skipRevalidate`) and outside Next (scripts).
 */
async function revalidateSite(context: Record<string, unknown>) {
  if (context.skipRevalidate) return
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch {
    // Not inside a Next.js request (e.g. a CLI script) - nothing to revalidate.
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = async ({ doc, req }) => {
  await revalidateSite(req.context)
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await revalidateSite(req.context)
  return doc
}
