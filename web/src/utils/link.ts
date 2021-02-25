'use strict'

export function getExternalLinkTarget(link?: string): string {
  if (link?.startsWith('http')) {
    return '_blank'
  }

  return ''
}
