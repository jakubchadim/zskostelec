import type { NavItem, NavMenus } from './types'

// TODO: replace with lib/wp types (T1). This placeholder stands in for a
// future fetch against `/wp-json/wp-api-menus/v2/menus` (legacy menu slugs
// `top-menu`, `fast-menu-1`, `fast-menu-2` — see
// web/src/components/nav/main.query.tsx, fastFirst.query.tsx,
// fastSecond.query.tsx), with the flat response assembled into a NavItem[]
// tree the same way web/src/components/nav/utils.ts `parseNavItems` did.
// Swap the body of this function for a real call into T1's data layer once
// it lands; callers (layout.tsx) already treat it as async.
export async function getNavData(): Promise<NavMenus> {
  const main: NavItem[] = [
    { title: 'Domů', url: '/', items: [] },
    {
      title: 'O škole',
      url: '/o-skole/',
      items: [
        { title: 'Zaměstnanci', url: '/o-skole/zamestnanci/', items: [] },
        { title: 'Dokumenty', url: '/o-skole/dokumenty/', items: [] }
      ]
    },
    { title: 'Aktuality', url: '/aktuality/', items: [] },
    { title: 'Fotogalerie', url: '/fotogalerie/', items: [] },
    { title: 'Kontakt', url: '/kontakt/', items: [] }
  ]

  const fastFirst: NavItem[] = [
    { title: 'Jídelníček', url: '/jidelnicek/', items: [] },
    { title: 'Externí odkaz', url: 'https://example.com/', target: '_blank', items: [] }
  ]

  const fastSecond: NavItem[] = [
    { title: 'GDPR', url: '/gdpr/', items: [] },
    { title: 'Úřední deska', url: '/uredni-deska/', items: [] }
  ]

  return { main, fastFirst, fastSecond }
}
