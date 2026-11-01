import { foldText } from '@/lib/utils'

/*
 * The pages written in code (not in the CMS) for the site search: title,
 * address and the words people would look them up by. Add a page here when
 * you add one under app/(static)/ or to FIXED_PAGES.
 */

export type SitePage = { title: string; path: string; description: string; keywords: string }

export const SITE_PAGES: SitePage[] = [
  {
    title: 'Úřední deska',
    path: '/uredni-deska/',
    description: 'Základní údaje o škole, pracoviště, bankovní spojení, vedení, GDPR, žádosti a stížnosti, výroční zprávy.',
    keywords: 'ico bankovni ucet datova schranka reditel vedeni gdpr poverenec ochrana osobnich udaju organizacni struktura stiznost zadost vyrocni zprava'
  },
  {
    title: 'Dokumenty',
    path: '/dokumenty/',
    description: 'Dokumenty ke stažení: formuláře, školní řád, výroční zprávy, dokumenty k jednotlivým školním rokům.',
    keywords: 'formulare zadosti skolni rad vyrocni zpravy inspekcni zpravy legislativa ke stazeni pdf'
  },
  {
    title: 'Zaměstnanci',
    path: '/zamestnanci/',
    description: 'Kontakty na učitele, vychovatelky a další zaměstnance školy.',
    keywords: 'ucitele kontakty email telefon vychovatelky asistenti reditel zastupce sborovna'
  },
  {
    title: 'Pracoviště školy',
    path: '/pracoviste/',
    description: 'Budovy školy: Palackého náměstí, Komenského, Drtinova (Skála) a družina Erbenova, na mapě.',
    keywords: 'budovy adresa mapa palackeho namesti komenskeho drtinova skala erbenova kde nas najdete'
  },
  {
    title: 'Historie',
    path: '/historie/',
    description: 'Příběh kosteleckých škol a Jiřího Gutha-Jarkovského, po kterém se škola jmenuje.',
    keywords: 'historie skoly guth jarkovsky olympijske hry vyroci'
  },
  {
    title: 'Dotační projekty a dary',
    path: '/dotacni-programy-projekty/',
    description: 'Projekty a dotační programy, do kterých je škola zapojená.',
    keywords: 'dotace projekty op jak msmt eu kraj etické dilny bezpecne klima dary'
  },
  {
    title: 'Školní vzdělávací program',
    path: '/skolni-vzdelavaci-program/',
    description: 'ŠVP po kapitolách: učební plán, osnovy předmětů, hodnocení a přílohy.',
    keywords: 'svp skolni vzdelavaci program osnovy ucebni plan hodnoceni predmety standardy'
  },
  {
    title: 'Školní stravování',
    path: '/skolni-stravovani/',
    description: 'Obědy, jídelníček, ceny, odhlašování, PrimiApp a platby.',
    keywords: 'obedy jidelna jidelnicek primirest primiapp odhlaseni obedu cena platba stravne dieta'
  },
  {
    title: 'Školní družina',
    path: '/skolni-druzina/',
    description: 'Pracoviště družiny, provozní doba, vychovatelky, poplatky a akce během roku.',
    keywords: 'druzina sd vychovatelky provozni doba poplatek zapis prazdniny odpoledne'
  },
  {
    title: 'Klub rodičů',
    path: '/klub-rodicu/',
    description: 'Výbor rodičů, kontakty, pravidla a žádost o příspěvek.',
    keywords: 'klub rodicu vybor prispevek rodice'
  },
  {
    title: 'Výchovné poradenství',
    path: '/vychovne-poradenstvi/',
    description: 'Výchovná poradkyně, podpora žáků, pedagogicko-psychologická poradna.',
    keywords: 'vychovny poradce poradenstvi ppp podpurna opatreni uceni problemy'
  },
  {
    title: 'Prevence rizikového chování',
    path: '/prevence-rizikoveho-chovani/',
    description: 'Pomoc pro žáky a rodiče, metodička prevence, programy, krizový plán.',
    keywords: 'prevence sikana kybersikana metodik prevence krizovy plan zavislosti pomoc'
  },
  {
    title: 'Kariérové poradenství',
    path: '/karierove-poradenstvi/',
    description: 'Výběr střední školy, přijímací řízení, termíny přihlášek a přijímaček.',
    keywords: 'stredni skola prijimacky prijimaci rizeni prihlasky deváťáci karierovy poradce ucnovske obory'
  },
  {
    title: 'Fotogalerie',
    path: '/fotogalerie/',
    description: 'Fotky z výletů, soutěží a akcí školy po školních rocích.',
    keywords: 'fotky fotografie galerie akce vylety'
  },
  {
    title: 'Školní časopis Guťák',
    path: '/gutak/',
    description: 'Čísla školního časopisu ke stažení.',
    keywords: 'gutak casopis noviny'
  },
  {
    title: 'Prohlášení o přístupnosti',
    path: '/prohlaseni-o-pristupnosti/',
    description: 'Jak je web přístupný a kam hlásit problémy.',
    keywords: 'pristupnost'
  }
]

/** True when every word of `query` occurs in `text` (both folded: case and diacritics ignored). */
export function matchesAllWords(text: string, query: string): boolean {
  const haystack = foldText(text)
  const words = foldText(query).split(/\s+/).filter(Boolean)
  return words.length > 0 && words.every((word) => haystack.includes(word))
}

export function searchSitePages(query: string): SitePage[] {
  return SITE_PAGES.filter((page) => matchesAllWords(`${page.title} ${page.description} ${page.keywords}`, query))
}
