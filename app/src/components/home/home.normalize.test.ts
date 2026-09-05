import { describe, expect, it } from 'vitest'
import { asId, type DateString, type RawHTML, type WpCategory, type WpPost } from '@/lib/wp'
import { selectMainPostAndPreviews, type HomeArticlePreview } from './home.normalize'

function makeCategory(idx: number): WpCategory {
  return { id: asId(`cat-${idx}`), slug: `category-${idx}`, name: `Category ${idx}`, link: `/kategorie-${idx}/`, parent: null }
}

function makePost(id: string): WpPost {
  return {
    id: asId(id),
    slug: id,
    link: `/${id}/`,
    title: `<p>${id}</p>` as RawHTML,
    excerpt: '<p>excerpt</p>' as RawHTML,
    content: '<p>content</p>' as RawHTML,
    date: '2024-01-01T00:00:00' as DateString,
    blocks: [],
    categories: [],
    acf: { link: null, file: null, gallery: [] }
  }
}

function makePreview(idx: number, articleIds: string[]): HomeArticlePreview {
  return { category: makeCategory(idx), articles: articleIds.map(makePost) }
}

describe('selectMainPostAndPreviews', () => {
  it('leaves previews untouched (minus empty-category filtering) when an explicit main post is set', () => {
    const explicitMainPost = makePost('explicit')
    const previews = [makePreview(0, ['a', 'b']), makePreview(1, [])]

    const result = selectMainPostAndPreviews(explicitMainPost, previews)

    expect(result.mainPost).toBe(explicitMainPost)
    expect(result.previews).toHaveLength(1)
    expect(result.previews[0].articles.map((a) => a.id)).toEqual([asId('a'), asId('b')])
  })

  it('falls back to the first article of previews[0] when no explicit main post is set', () => {
    const previews = [makePreview(0, ['a', 'b', 'c']), makePreview(1, ['d'])]

    const result = selectMainPostAndPreviews(null, previews)

    expect(result.mainPost?.id).toBe(asId('a'))
    expect(result.previews[0].articles.map((a) => a.id)).toEqual([asId('b'), asId('c')])
    expect(result.previews[1].articles.map((a) => a.id)).toEqual([asId('d')])
  })

  it('leaves main post null when previews[0] is empty, even if other previews have articles', () => {
    const previews = [makePreview(0, []), makePreview(1, ['d'])]

    const result = selectMainPostAndPreviews(null, previews)

    expect(result.mainPost).toBeNull()
    expect(result.previews).toHaveLength(1)
    expect(result.previews[0].category.slug).toBe('category-1')
  })

  it('does not retroactively exclude the fallback main post from previews[1]/[2] (legacy quirk, ported as-is)', () => {
    // "d" is popped as the fallback main post from previews[0], but also
    // appears in previews[1] - legacy never re-excludes it there.
    const previews = [makePreview(0, ['d', 'a']), makePreview(1, ['d', 'e'])]

    const result = selectMainPostAndPreviews(null, previews)

    expect(result.mainPost?.id).toBe(asId('d'))
    expect(result.previews[1].articles.map((a) => a.id)).toEqual([asId('d'), asId('e')])
  })

  it('shifts a later preview into an earlier grid slot when a middle category is empty (legacy quirk, ported as-is)', () => {
    const explicitMainPost = makePost('main')
    const previews = [makePreview(0, ['a']), makePreview(1, []), makePreview(2, ['c'])]

    const result = selectMainPostAndPreviews(explicitMainPost, previews)

    expect(result.previews).toHaveLength(2)
    // category-2's preview lands at index 1 (the "additionalArticles" slot),
    // not index 2 - the empty category-1 leaves no gap.
    expect(result.previews[1].category.slug).toBe('category-2')
  })
})
