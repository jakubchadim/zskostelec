import { describe, expect, it } from 'vitest'
import { asId } from '@/lib/wp'
import type { WpDocument, WpDocumentCategory } from '@/lib/wp'
import {
  EMPTY_DOCUMENT_FILTERS,
  filterDocumentGroups,
  groupDocumentsByCategory,
  matchesDocumentName
} from './filter'

function document(overrides: Partial<WpDocument>): WpDocument {
  return {
    id: asId(1),
    title: 'Školní řád',
    categoryIds: [],
    filename: 'skolni-rad.pdf',
    fileUrl: 'https://example.com/skolni-rad.pdf',
    ...overrides
  }
}

const categoryA: WpDocumentCategory = { id: asId(1), name: 'Dokumenty školy' }
const categoryB: WpDocumentCategory = { id: asId(2), name: 'Formuláře' }

describe('matchesDocumentName', () => {
  const doc = document({ title: 'Školní řád', filename: 'skolni-rad.pdf' })

  it('matches the title as a case-insensitive substring', () => {
    expect(matchesDocumentName(doc, 'školní')).toBe(true)
  })

  it('matches the filename as a case-insensitive substring', () => {
    expect(matchesDocumentName(doc, 'SKOLNI-RAD')).toBe(true)
  })

  it('does not fold diacritics (matches legacy behavior)', () => {
    expect(matchesDocumentName(doc, 'skolni rad')).toBe(false)
  })

  it('matches everything when the query is empty', () => {
    expect(matchesDocumentName(doc, '')).toBe(true)
    expect(matchesDocumentName(doc, '   ')).toBe(true)
  })
})

describe('groupDocumentsByCategory', () => {
  it('groups documents under each category they belong to, in category order', () => {
    const docs = [
      document({ id: asId(1), categoryIds: [categoryA.id] }),
      document({ id: asId(2), categoryIds: [categoryB.id] }),
      document({ id: asId(3), categoryIds: [categoryA.id, categoryB.id] })
    ]

    const groups = groupDocumentsByCategory(docs, [categoryA, categoryB])

    expect(groups).toEqual([
      { category: categoryA, documents: [docs[0], docs[2]] },
      { category: categoryB, documents: [docs[1], docs[2]] }
    ])
  })

  it('drops categories with no matching documents', () => {
    const docs = [document({ id: asId(1), categoryIds: [categoryA.id] })]
    const groups = groupDocumentsByCategory(docs, [categoryA, categoryB])

    expect(groups.map((g) => g.category?.id)).toEqual([categoryA.id])
  })

  it('collects documents matching no known category into a trailing "Ostatní" group', () => {
    const uncategorized = document({ id: asId(9), categoryIds: [] })
    const docs = [document({ id: asId(1), categoryIds: [categoryA.id] }), uncategorized]

    const groups = groupDocumentsByCategory(docs, [categoryA])

    expect(groups).toEqual([
      { category: categoryA, documents: [docs[0]] },
      { category: null, documents: [uncategorized] }
    ])
  })

  it('omits the "Ostatní" group entirely when nothing is uncategorized', () => {
    const docs = [document({ id: asId(1), categoryIds: [categoryA.id] })]
    const groups = groupDocumentsByCategory(docs, [categoryA])

    expect(groups.some((g) => g.category === null)).toBe(false)
  })
})

describe('filterDocumentGroups', () => {
  const docA1 = document({ id: asId(1), title: 'Přihláška', filename: 'prihlaska.pdf', categoryIds: [categoryA.id] })
  const docA2 = document({ id: asId(2), title: 'Výroční zpráva', filename: 'zprava.pdf', categoryIds: [categoryA.id] })
  const docB1 = document({ id: asId(3), title: 'Žádost', filename: 'zadost.docx', categoryIds: [categoryB.id] })
  const uncategorized = document({ id: asId(4), title: 'Ostatní dokument', filename: 'misc.pdf', categoryIds: [] })
  const groups = groupDocumentsByCategory([docA1, docA2, docB1, uncategorized], [categoryA, categoryB])

  it('keeps every group when no filters are applied', () => {
    expect(filterDocumentGroups(groups, EMPTY_DOCUMENT_FILTERS)).toEqual(groups)
  })

  it('restricts to selected categories and drops "Ostatní" when a category is selected', () => {
    const result = filterDocumentGroups(groups, { name: '', categoryIds: [categoryA.id] })
    expect(result).toEqual([{ category: categoryA, documents: [docA1, docA2] }])
  })

  it('filters documents within each remaining group by name, dropping now-empty groups', () => {
    const result = filterDocumentGroups(groups, { name: 'přihláška', categoryIds: [] })
    expect(result).toEqual([{ category: categoryA, documents: [docA1] }])
  })

  it('returns an empty list when nothing matches', () => {
    expect(filterDocumentGroups(groups, { name: 'nonexistent', categoryIds: [] })).toEqual([])
  })
})
