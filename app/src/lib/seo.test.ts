import { describe, expect, it } from 'vitest'
import { buildTitle, decodeEntities, getSiteUrl, htmlToPlainText, pathFromSlug } from './seo'

describe('getSiteUrl', () => {
  it('returns null when SITE_URL is unset', () => {
    const original = process.env.SITE_URL
    delete process.env.SITE_URL
    expect(getSiteUrl()).toBeNull()
    if (original !== undefined) process.env.SITE_URL = original
  })

  it('strips a trailing slash', () => {
    const original = process.env.SITE_URL
    process.env.SITE_URL = 'https://www.zskostelec.cz/'
    expect(getSiteUrl()).toBe('https://www.zskostelec.cz')
    if (original === undefined) delete process.env.SITE_URL
    else process.env.SITE_URL = original
  })
})

describe('pathFromSlug', () => {
  it('returns the root path for an empty/undefined slug', () => {
    expect(pathFromSlug(undefined)).toBe('/')
    expect(pathFromSlug([])).toBe('/')
  })

  it('joins segments with leading and trailing slashes', () => {
    expect(pathFromSlug(['aktuality', 'strana-2'])).toBe('/aktuality/strana-2/')
  })
})

describe('decodeEntities', () => {
  it('decodes numeric decimal and hex entities', () => {
    expect(decodeEntities('&#352;kola')).toBe('Škola')
    expect(decodeEntities('&#x160;kola')).toBe('Škola')
  })

  it('decodes named entities like &amp;', () => {
    expect(decodeEntities('Škola &amp; rodiče')).toBe('Škola & rodiče')
  })

  it('decodes a decimal entity mid-word (Czech diacritic)', () => {
    expect(decodeEntities('Rodi&#269;e')).toBe('Rodiče')
  })

  it('leaves an unrecognized entity-like sequence untouched', () => {
    expect(decodeEntities('a &notreal; b')).toBe('a &notreal; b')
  })
})

describe('htmlToPlainText', () => {
  it('strips tags, decodes entities, and collapses whitespace', () => {
    expect(htmlToPlainText('<p>Škola &amp; rodiče\n  se   sch&#225;z&#237;...</p>')).toBe('Škola & rodiče se schází...')
  })

  it('returns an empty string for empty markup', () => {
    expect(htmlToPlainText('<p></p>')).toBe('')
  })
})

describe('buildTitle', () => {
  it('appends the site name', () => {
    expect(buildTitle('O škole')).toBe('O škole | ZŠ Kostelec nad Orlicí')
  })
})
