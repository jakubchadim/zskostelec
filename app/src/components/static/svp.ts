import type { ID, WpDocument } from '@/lib/wp'
import { foldText } from '@/lib/utils'

/** Document category (in the CMS) holding the ŠVP chapters as PDFs. */
export const SVP_CATEGORY_SLUG = 'kostelecky-vzdelavaci-program'

/**
 * Whether a document is part of the ŠVP: in the ŠVP category, or titled as a
 * chapter. In WordPress the chapters were in both the ŠVP and a school-year
 * category; the CMS keeps one category per document, and the import kept the
 * school year - so the title is what still marks them.
 */
export function isSvpDocument(document: WpDocument, svpCategoryId: ID | null): boolean {
  return (svpCategoryId != null && document.categoryIds.includes(svpCategoryId)) || /^(kostelecky|skolni) vzdelavaci program\b/.test(foldText(document.title))
}

type Chapter = {
  title: string
  /** Subjects the chapter covers, shown under the title. */
  note?: string
  /** Tested against the folded (lowercase, no diacritics) `${filename}||${title}`. */
  match: RegExp
}

type ChapterGroup = { eyebrow: string; title: string; chapters: Chapter[] }

/**
 * A numbered chapter: the school's PDFs start with the chapter number
 * ("4-osnovy-cesky-jazyk.pdf"), behind the upload month the WP import added ("2025-02-4-osnovy…").
 */
function numbered(n: number): RegExp {
  return new RegExp(`^(\\d{4}-\\d{2}-)?${n}[-_ .]`)
}

/** Chapter list and naming as the school asked for it (Struktura webu, list ŠVP, 29. 10. 2026). */
export const SVP_CHAPTERS: ChapterGroup[] = [
  {
    eyebrow: 'Úvod',
    title: 'Škola a její program',
    chapters: [
      { title: 'Charakteristika školy', match: numbered(1) },
      { title: 'Charakteristika ŠVP', match: numbered(2) },
      { title: 'Učební plán a organizace vzdělávání', match: numbered(3) }
    ]
  },
  {
    eyebrow: 'Vzdělávací oblasti',
    title: 'Předměty a osnovy',
    chapters: [
      { title: 'Český jazyk', match: numbered(4) },
      { title: 'Anglický jazyk', match: numbered(5) },
      { title: 'Další cizí jazyk', note: 'Německý, francouzský, ruský a španělský jazyk', match: numbered(6) },
      { title: 'Komunikace', match: numbered(7) },
      { title: 'Matematika', match: numbered(8) },
      { title: 'Informatika', match: numbered(9) },
      { title: 'Člověk a jeho svět', note: 'Prvouka, Vlastivěda, Přírodověda', match: numbered(10) },
      { title: 'Člověk a společnost', note: 'Dějepis, Výchova k občanství', match: numbered(11) },
      { title: 'Člověk a příroda', note: 'Fyzika, Chemie, Přírodopis, Zeměpis', match: numbered(12) },
      { title: 'Umění a kultura', note: 'Hudební výchova, Výtvarná výchova', match: numbered(13) },
      { title: 'Člověk a zdraví', note: 'Výchova ke zdraví, Tělesná výchova', match: numbered(14) },
      { title: 'Člověk a svět práce', note: 'Pracovní výchova', match: numbered(15) },
      { title: 'Doplňující vzdělávací obory', match: numbered(16) }
    ]
  },
  {
    eyebrow: 'Další kapitoly',
    title: 'Podpora a hodnocení',
    chapters: [
      { title: 'Žáci s odlišným mateřským jazykem', match: numbered(17) },
      { title: 'Hodnocení', match: numbered(18) }
    ]
  },
  {
    eyebrow: 'Přílohy',
    title: 'Standardy a výtahy',
    chapters: [
      { title: 'Příloha ŠVP 1', note: 'Standardy pro základní vzdělávání (AJ, ČJ, MA)', match: /priloha[^|0-9]*1/ },
      { title: 'Příloha ŠVP 2', note: 'Standardy pro základní vzdělávání (FJ)', match: /priloha[^|0-9]*2/ },
      { title: 'Příloha ŠVP 3', note: 'Standardy pro základní vzdělávání (NJ)', match: /priloha[^|0-9]*3/ },
      { title: 'Výtah ze ŠVP – prevence', match: /vytah/ }
    ]
  }
]

/** The whole ŠVP in one file ("SVP ALL"). */
const COMPLETE_MATCH = /s?vp[-_ ]?all|komplet/

export type SvpDoc = { title: string; note?: string; href: string }
export type SvpGroup = { eyebrow: string; title: string; docs: SvpDoc[] }
export type SvpContent = { complete: SvpDoc | null; groups: SvpGroup[]; other: SvpDoc[] }

function haystack(document: WpDocument): string {
  return foldText(`${document.filename}||${document.title}`)
}

/**
 * Pairs the ŠVP category's documents with the chapter list. Chapters without
 * an uploaded PDF are left out; documents matching no chapter end up in
 * `other`, so a newly uploaded file still shows up on the page.
 */
export function buildSvpContent(documents: WpDocument[]): SvpContent {
  const used = new Set<WpDocument>()
  const take = (match: RegExp): WpDocument | undefined => {
    const document = documents.find((candidate) => !used.has(candidate) && candidate.fileUrl && match.test(haystack(candidate)))
    if (document) {
      used.add(document)
    }
    return document
  }

  const completeDocument = take(COMPLETE_MATCH)
  const groups = SVP_CHAPTERS.map((group) => ({
    eyebrow: group.eyebrow,
    title: group.title,
    docs: group.chapters.flatMap((chapter) => {
      const document = take(chapter.match)
      return document ? [{ title: chapter.title, note: chapter.note, href: document.fileUrl }] : []
    })
  })).filter((group) => group.docs.length > 0)

  const other = documents
    .filter((document) => !used.has(document) && document.fileUrl)
    .map((document) => ({ title: document.title || document.filename, href: document.fileUrl }))

  return {
    complete: completeDocument ? { title: 'Školní vzdělávací program (komplet)', href: completeDocument.fileUrl } : null,
    groups,
    other
  }
}
