'use client'

import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import * as Dialog from '@radix-ui/react-dialog'
import { ChevronDown, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Container } from '@/components/ui/container'
import { NavLink } from './nav-link'
import { MobileMenuItem } from './mobile-menu-item'
import type { NavItem } from './types'

// Subscribes to scroll position via useSyncExternalStore rather than a
// manual useState+useEffect pair — SSR-safe (server snapshot assumes
// top-of-page, matching a fresh navigation) and avoids setState calls
// inside an effect body.
function subscribeToScroll(onScroll: () => void) {
  document.addEventListener('scroll', onScroll, { passive: true })
  return () => document.removeEventListener('scroll', onScroll)
}

function isScrolledToTop(): boolean {
  return window.scrollY <= 10
}

function isScrolledToTopOnServer(): boolean {
  return true
}

type HeaderProps = {
  menu: NavItem[]
  /** Allows the bar to start transparent and turn solid once scrolled past
   * the top, for pages with a hero image behind the nav (legacy
   * `Layout transparentNav` / `NavMain transparent`). An explicit value
   * always wins; left unset, it defaults to "on for the homepage, off
   * elsewhere" (see the `pathname` check below) - `app/src/app/layout.tsx`
   * renders one `<Header>` for every route and can't pass a per-route
   * prop itself (it's a Server Component that doesn't know the current
   * route the way a route-level template does), so the homepage is
   * detected here instead. Legacy only ever used `transparentNav` on the
   * home template (`web/src/templates/home.tsx`), so gating on the root
   * path is a faithful port, not a guess. */
  transparent?: boolean
}

/** Sticky site header: text logo, desktop flyout nav, mobile Dialog menu,
 * and transparent-over-hero scroll behavior on the homepage. Ports the
 * behavior of web/src/components/nav/main.tsx + web/src/components/ui/nav/. */
export default function Header({ menu, transparent }: HeaderProps) {
  const pathname = usePathname()
  const isTransparentRoute = transparent ?? pathname === '/'
  const atTop = useSyncExternalStore(subscribeToScroll, isScrolledToTop, isScrolledToTopOnServer)
  const isTransparent = isTransparentRoute && atTop
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-primary-1 text-white-1 shadow-medium transition-colors duration-200 ease-in-out',
        isTransparent && 'bg-transparent shadow-none'
      )}
    >
      <Container>
        <div className="flex h-10 items-center md:h-16">
          {/* Deliberately not an <h1> (unlike legacy): page templates carry the semantic h1. */}
          <p className={cn('m-0 text-title-4 font-normal', isTransparent && 'sm:hidden')}>
            <Link href="/" className="no-underline hover:text-inherit">
              ZŠ Kostelec
            </Link>
          </p>

          <NavigationMenu.Root className="relative ml-auto hidden md:block">
            <NavigationMenu.List className="m-0 flex list-none items-center gap-4 p-0">
              {menu.map((item, idx) => (
                <NavigationMenu.Item key={`${item.slug ?? item.url}-${idx}`} className="relative">
                  {item.items.length > 0 ? (
                    <>
                      <NavigationMenu.Trigger className="group flex items-center gap-1 py-2 text-sm font-medium outline-none">
                        {item.title}
                        <ChevronDown
                          className="size-4 opacity-70 transition-transform group-data-[state=open]:rotate-180"
                          aria-hidden
                        />
                      </NavigationMenu.Trigger>
                      <NavigationMenu.Content className="absolute top-full left-1/2 z-50 min-w-48 -translate-x-1/2 rounded-medium bg-white-1 p-3 text-gray-7 shadow-large">
                        <ul className="m-0 list-none p-0 whitespace-nowrap">
                          {item.items.map((child, childIdx) => (
                            <li key={`${child.slug ?? child.url}-${childIdx}`}>
                              <NavLink
                                item={child}
                                className="block px-2 py-1 text-sm hover:text-primary-1"
                              />
                            </li>
                          ))}
                        </ul>
                      </NavigationMenu.Content>
                    </>
                  ) : (
                    <NavLink item={item} className="block px-2 py-1 text-sm font-medium hover:underline" />
                  )}
                </NavigationMenu.Item>
              ))}
            </NavigationMenu.List>
          </NavigationMenu.Root>

          <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="ml-auto flex items-center justify-center md:hidden"
                aria-label="Otevřít menu"
              >
                <Menu className="size-8" aria-hidden />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black-1/50" />
              <Dialog.Content
                aria-describedby={undefined}
                className="fixed inset-y-0 right-0 z-50 w-full max-w-xs overflow-y-auto bg-white-1 p-6 text-gray-7 shadow-lift"
              >
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-title-5 font-normal text-black-1">Menu</Dialog.Title>
                  <Dialog.Close asChild>
                    <button type="button" aria-label="Zavřít menu">
                      <X className="size-7" aria-hidden />
                    </button>
                  </Dialog.Close>
                </div>
                <ul className="m-0 mt-6 list-none space-y-1 p-0">
                  {menu.map((item, idx) => (
                    <MobileMenuItem key={`${item.slug ?? item.url}-${idx}`} item={item} />
                  ))}
                </ul>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </Container>
    </header>
  )
}
