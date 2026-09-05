/** Mirrors legacy `web/src/utils/link.ts`'s `getExternalLinkTarget`: an
 * absolute `http(s)` URL is treated as external and opened in a new tab. */
export function isExternalUrl(url: string): boolean {
  return url.startsWith('http')
}
