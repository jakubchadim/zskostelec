import type { WpMenuItem } from '@/lib/wp'

// Reconciled against T1's real menu types (`lib/wp/entities/menu.ts`) - this
// used to be a hand-guessed stub. `WpMenuItem` already handles both raw
// `wp-api-menus` response shapes (a flat list carrying `parent`, or a
// nested one carrying `children`) and is unit-tested in `entities/menu.test.ts`.
export type NavItem = WpMenuItem

export type NavMenus = {
  main: NavItem[]
  fastFirst: NavItem[]
  fastSecond: NavItem[]
}
