import { documentsHref } from '@/components/file/filter'
import type { NavItem, NavMenus } from './types'

/*
 * Site navigation, maintained in code (it used to be the WP menus
 * `top-menu`, `fast-menu-1`, `fast-menu-2`). Edit freely - every item is
 * just a title + url; external urls open in a new tab automatically.
 */

/** EduPage gets its own always-visible button in the header, not a menu entry. */
export const EDUPAGE_URL = 'https://zsgjkno.edupage.org/'

function link(title: string, url: string, items: NavItem[] = []): NavItem {
  return { title, url, target: '', slug: url.replace(/^\/|\/$/g, '').replace(/\//g, '-'), items }
}

function group(title: string, items: NavItem[]): NavItem {
  return { title, url: '', target: '', slug: title, items }
}

export const MAIN_MENU: NavItem[] = [
  link('Úvod', '/'),
  group('Aktuality', [link('Aktuality', '/clanky/aktuality/'), link('Oznámení školy', '/clanky/upozorneni/')]),
  group('O škole', [
    link('Úřední deska', '/uredni-deska/'),
    link('Dokumenty', '/dokumenty/'),
    link('Zaměstnanci', '/zamestnanci/'),
    link('Pracoviště školy', '/pracoviste/'),
    link('Historie', '/historie/'),
    link('Dotační projekty a dary', '/dotacni-programy-projekty/'),
    link('Pomáháme', '/clanky/pomahame/'),
    link('Školská rada', 'https://www.kostelecno.cz/skolska-rada'),
    link('Školní vzdělávací program', '/skolni-vzdelavaci-program/')
  ]),
  group('Pro rodiče', [
    link('Školní stravování', '/skolni-stravovani/'),
    link('Klub rodičů', '/klub-rodicu/'),
    link('Formuláře', documentsHref('formulare'))
  ]),
  link('Školní družina', '/skolni-druzina/'),
  group('Poradenství', [
    link('Výchovné poradenství', '/vychovne-poradenstvi/'),
    link('Prevence rizikového chování', '/prevence-rizikoveho-chovani/'),
    link('Kariérové poradenství', '/karierove-poradenstvi/'),
    link('Přijímací řízení na SŠ', '/karierove-poradenstvi/#prijimaci-rizeni')
  ]),
  group('Prezentace', [
    link('Fotogalerie', '/fotogalerie/'),
    link('Žákovský web', 'https://www.zakovskyweb.cz/'),
    link('Školní časopis Guťák', '/gutak/'),
    link('Úspěchy žáků', '/clanky/uspechy-zaku/'),
    link('Školní parlament', '/clanky/zakovsky-parlament/')
  ])
]

/** Footer "Rychle" column + first half of the homepage quick links. */
export const FAST_MENU_FIRST: NavItem[] = [link('Edupage', EDUPAGE_URL), link('Úspěchy žáků', '/clanky/uspechy-zaku/')]

/** Footer "Užitečné" column + second half of the homepage quick links. */
export const FAST_MENU_SECOND: NavItem[] = [
  link('Naši zaměstnanci', '/zamestnanci/'),
  link('Najít dokument', '/dokumenty/'),
  link('Fotogalerie', '/fotogalerie/')
]

export const NAV_MENUS: NavMenus = { main: MAIN_MENU, fastFirst: FAST_MENU_FIRST, fastSecond: FAST_MENU_SECOND }
