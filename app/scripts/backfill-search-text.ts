/**
 * Fills the hidden search column of articles and galleries saved before it
 * existed. On Neon the `tags_search` migration does this; a local database
 * gets the column from Payload's dev schema push, so run this once there.
 *
 * Usage (from app/): npx payload run scripts/backfill-search-text.ts
 */
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import { backfillSearchText } from '../src/cms/search-text.ts'

const payload = await getPayload({ config })
const db = (payload.db as unknown as { drizzle: Parameters<typeof backfillSearchText>[0] }).drizzle
const filled = await backfillSearchText(db)
payload.logger.info(`search_text filled: ${filled.posts} posts, ${filled.galleries} galleries`)
process.exit(0)
