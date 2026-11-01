import { describe, expect, it } from 'vitest'
import { asId, type WpDocument } from '@/lib/wp'
import { buildSvpContent, isSvpDocument } from './svp'

function doc(id: number, filename: string, title = ''): WpDocument {
  return { id: asId(id), title, categoryIds: [], filename, fileUrl: `/media/${filename}` }
}

describe('isSvpDocument', () => {
  it('takes the ŠVP category and chapters filed under a school year by their title', () => {
    const svp = asId(66)
    expect(isSvpDocument({ ...doc(1, 'a.pdf'), categoryIds: [svp] }, svp)).toBe(true)
    expect(isSvpDocument(doc(2, '4-osnovy-cesky-jazyk-1.pdf', 'Kostelecký vzdělávací program - Český jazyk'), svp)).toBe(true)
    expect(isSvpDocument(doc(3, 'organizace.pdf', 'Organizace školního roku 2024 - 2025'), svp)).toBe(false)
  })
})

describe('buildSvpContent', () => {
  it('names chapters by their number prefix, not by the uploaded title', () => {
    const { groups } = buildSvpContent([
      doc(1, '5-osnovy-cizi_-jazyk-1.pdf', 'Kostelecký vzdělávací program – Cizí jazyk'),
      doc(2, '1-Charakteristika-skoly.pdf'),
      doc(3, '2025-02-10-osnovy-clovek-a-jeho-svet-1.pdf')
    ])

    const docs = groups.flatMap((group) => group.docs)
    expect(docs.map((d) => d.title)).toEqual(['Charakteristika školy', 'Anglický jazyk', 'Člověk a jeho svět'])
    expect(docs[2].note).toBe('Prvouka, Vlastivěda, Přírodověda')
  })

  it('tells the appendices apart and finds the complete ŠVP', () => {
    const { complete, groups } = buildSvpContent([
      doc(1, 'Priloha-SVP-2-1.pdf', 'Příloha č. 2'),
      doc(2, 'Priloha-SVP-1-1.pdf', 'Příloha č. 1'),
      doc(3, 'SVP ALL.pdf'),
      doc(4, 'Vytah-ze-SVP-prevence-1.pdf')
    ])

    expect(complete?.href).toBe('/media/SVP ALL.pdf')
    expect(groups).toHaveLength(1)
    expect(groups[0].docs.map((d) => [d.title, d.href])).toEqual([
      ['Příloha ŠVP 1', '/media/Priloha-SVP-1-1.pdf'],
      ['Příloha ŠVP 2', '/media/Priloha-SVP-2-1.pdf'],
      ['Výtah ze ŠVP – prevence', '/media/Vytah-ze-SVP-prevence-1.pdf']
    ])
  })

  it('keeps documents that match no chapter, and drops empty groups', () => {
    const { groups, other } = buildSvpContent([doc(1, 'novy-dokument.pdf', 'Nový dokument')])

    expect(groups).toEqual([])
    expect(other).toEqual([{ title: 'Nový dokument', href: '/media/novy-dokument.pdf' }])
  })
})
