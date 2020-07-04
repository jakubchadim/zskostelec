export function isExternalLink(url?: string, target?: string): boolean {
  return (url && url.startsWith('http')) || target === '_blank'
}
