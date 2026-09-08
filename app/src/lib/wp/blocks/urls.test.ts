import { describe, expect, it } from 'vitest'
import { rewriteAdminUrls, rewriteBlockLinks } from './urls'
import type { TransformedBlock } from './types'

const search = { sourceUrl: 'https://admin.example.test', replacementUrl: '' }

describe('rewriteBlockLinks', () => {
  function block(content: string): TransformedBlock {
    return {
      blockId: 'id' as TransformedBlock['blockId'],
      parentId: null,
      type: 'core/paragraph',
      attrs: '[]' as TransformedBlock['attrs'],
      content: content as TransformedBlock['content']
    }
  }

  it('rewrites an absolute, trailing-slash admin link to a relative path', () => {
    const result = rewriteBlockLinks(block('<p><a href="https://admin.example.test/o-skole/">O škole</a></p>'), search)
    expect(result.content).toBe('<p><a href="/o-skole/">O škole</a></p>')
  })

  it('leaves a link without a trailing slash untouched', () => {
    const html = '<p><a href="https://admin.example.test/file.pdf">file</a></p>'
    expect(rewriteBlockLinks(block(html), search).content).toBe(html)
  })

  it('rewrites a link stored under the other scheme', () => {
    const result = rewriteBlockLinks(block('<p><a href="http://admin.example.test/o-skole/">O škole</a></p>'), search)
    expect(result.content).toBe('<p><a href="/o-skole/">O škole</a></p>')
  })

  it('leaves an unrelated external link untouched', () => {
    const html = '<p><a href="https://example.com/">Example</a></p>'
    expect(rewriteBlockLinks(block(html), search).content).toBe(html)
  })

  it('passes a block with no content through unchanged', () => {
    const empty = block('')
    expect(rewriteBlockLinks(empty, search)).toBe(empty)
  })
})

describe('rewriteAdminUrls', () => {
  it('replaces the admin origin wherever it appears in nested string values', () => {
    const input = {
      link: 'https://admin.example.test/aktuality/nazev/',
      acf: { file: { url: 'https://admin.example.test/wp-content/uploads/a.pdf' } },
      items: ['https://admin.example.test/x/', 'https://other.test/y/']
    }

    const result = rewriteAdminUrls(input, search)

    expect(result.link).toBe('/aktuality/nazev/')
    expect(result.acf.file.url).toBe('/wp-content/uploads/a.pdf')
    expect(result.items).toEqual(['/x/', 'https://other.test/y/'])
  })

  it('rewrites the same origin spelled with the other scheme', () => {
    // WP keeps the scheme a link was authored under, so an https site still
    // has http:// links recorded in older content.
    expect(rewriteAdminUrls('http://admin.example.test/dokumenty/', search)).toBe('/dokumenty/')
  })

  it('leaves other-scheme media absolute, so images and files still resolve', () => {
    const mediaUrl = 'http://admin.example.test/wp-content/uploads/2021/01/a.jpg'
    expect(rewriteAdminUrls(mediaUrl, search)).toBe(mediaUrl)
  })

  it('leaves an unrelated origin untouched whichever scheme it uses', () => {
    expect(rewriteAdminUrls('http://other.test/x/', search)).toBe('http://other.test/x/')
  })

  it('fixes the &#8211; entity', () => {
    expect(rewriteAdminUrls('Tresky &#8211; plesky', search)).toBe('Tresky - plesky')
  })

  it('passes non-string primitives through unchanged', () => {
    expect(rewriteAdminUrls(42, search)).toBe(42)
    expect(rewriteAdminUrls(null, search)).toBe(null)
    expect(rewriteAdminUrls(true, search)).toBe(true)
  })
})
