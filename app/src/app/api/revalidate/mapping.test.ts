import { describe, expect, it } from 'vitest'
import { WP_CACHE_TAGS } from '@/lib/wp/client'
import { resolveRevalidationTags } from './mapping'

const ALL_TAGS = Object.values(WP_CACHE_TAGS)

describe('resolveRevalidationTags', () => {
  it('maps a known type to its single coarse tag', () => {
    expect(resolveRevalidationTags({ type: 'post' })).toEqual([WP_CACHE_TAGS.posts])
    expect(resolveRevalidationTags({ type: 'page' })).toEqual([WP_CACHE_TAGS.pages])
    expect(resolveRevalidationTags({ type: 'category' })).toEqual([WP_CACHE_TAGS.categories])
    expect(resolveRevalidationTags({ type: 'gallery' })).toEqual([WP_CACHE_TAGS.gallery])
    expect(resolveRevalidationTags({ type: 'gutak' })).toEqual([WP_CACHE_TAGS.gutak])
    expect(resolveRevalidationTags({ type: 'menu' })).toEqual([WP_CACHE_TAGS.menus])
  })

  it('ignores id/slug - the coarse tag alone is always sufficient', () => {
    expect(resolveRevalidationTags({ type: 'post', id: 42, slug: 'hello-world' })).toEqual([WP_CACHE_TAGS.posts])
  })

  it('maps employee taxonomies (positions, building) to the employee tag', () => {
    expect(resolveRevalidationTags({ type: 'positions' })).toEqual([WP_CACHE_TAGS.employee])
    expect(resolveRevalidationTags({ type: 'building' })).toEqual([WP_CACHE_TAGS.employee])
    expect(resolveRevalidationTags({ type: 'employee' })).toEqual([WP_CACHE_TAGS.employee])
  })

  it('maps the document taxonomy (documentCategories) to the document tag', () => {
    expect(resolveRevalidationTags({ type: 'documentCategories' })).toEqual([WP_CACHE_TAGS.document])
    expect(resolveRevalidationTags({ type: 'document' })).toEqual([WP_CACHE_TAGS.document])
  })

  it('maps attachment and media to the media tag', () => {
    expect(resolveRevalidationTags({ type: 'attachment' })).toEqual([WP_CACHE_TAGS.media])
    expect(resolveRevalidationTags({ type: 'media' })).toEqual([WP_CACHE_TAGS.media])
  })

  it('falls back to every tag for an unrecognized type', () => {
    expect(resolveRevalidationTags({ type: 'something-unknown' })).toEqual(ALL_TAGS)
  })

  it('falls back to every tag when type is missing', () => {
    expect(resolveRevalidationTags({})).toEqual(ALL_TAGS)
  })

  it('falls back to every tag when type is not a string', () => {
    expect(resolveRevalidationTags({ type: 42 })).toEqual(ALL_TAGS)
    expect(resolveRevalidationTags({ type: null })).toEqual(ALL_TAGS)
    expect(resolveRevalidationTags({ type: undefined })).toEqual(ALL_TAGS)
    expect(resolveRevalidationTags({ type: { nested: true } })).toEqual(ALL_TAGS)
  })
})
