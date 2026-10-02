import 'server-only'
import { getPayload, type Payload } from 'payload'
import config from '@payload-config'

/** The Payload Local API (talks to Postgres directly - no HTTP round-trip). */
export function cms(): Promise<Payload> {
  return getPayload({ config })
}
