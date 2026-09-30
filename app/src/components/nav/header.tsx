'use client'

import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import * as Dialog from '@radix-ui/react-dialog'
import { ChevronDown, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { accentAt } from '@/components/ui/accent'
import { Container } from '@/components/ui/container'
import { Star } from '@/components/ui/doodles'
import { NavLink } from './nav-link'
import { MobileMenuItem } from './mobile-menu-item'
import type { NavItem } from './types'

// Scroll position via useSyncExternalStore: SSR-safe (the server snapshot
// assumes top-of-page) and no setState-in-effect.
function subscribeToScroll(onScroll: () => void) {
  document.addEventListener('scroll', onScroll, { passive: true })
  return () => document.removeEventListener('scroll', onScroll)
}

function isScrolled(): boolean {
  return window.scrollY > 12
}

function isScrolledOnServer(): boolean {
  return false
}

/** True when `pathname` is `item` or lives under one of its children. */
function isActive(item: NavItem, pathname: string): boolean {
  if (item.url && item.url !== '/' && !item.url.startsWith('http') && pathname.startsWith(item.url)) {
    return true
  }
  if (item.url === '/' && pathname === '/') {
    return true
  }
  return item.items.some((child) => isActive(child, pathname))
}

export function Logo({ compact }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="ZŠ Kostelec nad Orlicí – úvodní stránka">
      <span
        className={cn(
          'relative grid shrink-0 place-items-center rounded-full border-[2.5px] border-ink bg-tangerine shadow-pop-sm transition-all duration-300 group-hover:rotate-[-8deg]',
          compact ? 'size-10' : 'size-11 md:size-12'
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset */}
        <img src="/logo.svg" alt="" className="size-[82%]" />
        <Star className="absolute -top-2 -right-2 w-5 text-sun transition-transform duration-500 group-hover:rotate-180" />
      </span>
      <span className="leading-none">
        <span className="block font-display text-xl font-extrabold tracking-tight md:text-2xl">ZŠ Kostelec</span>
        <span className="block text-xs font-bold text-gray-7">nad Orlicí</span>
      </span>
    </Link>
  )
}

type HeaderProps = {
  menu: NavItem[]
}

/** Sticky site header: logo badge, desktop flyout nav (Radix), full-screen mobile menu (Radix Dialog). */
export default function Header({ menu }: HeaderProps) {
  const pathname = usePathname()
  const scrolled = useSyncExternalStore(subscribeToScroll, isScrolled, isScrolledOnServer)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b-[2.5px] transition-all duration-300',
        scrolled ? 'border-ink bg-paper/95 backdrop-blur' : 'border-transparent bg-cream/80 backdrop-blur-sm'
      )}
    >
      <Container>
        <div className={cn('flex items-center gap-4 transition-all duration-300', scrolled ? 'h-14' : 'h-16 md:h-18')}>
          <Logo compact={scrolled} />

          <NavigationMenu.Root className="relative ml-auto hidden lg:block" delayDuration={80}>
            <NavigationMenu.List className="m-0 flex list-none items-center gap-1 p-0">
              {menu.map((item, idx) => {
                const accent = accentAt(idx)
                const active = isActive(item, pathname)
                const pill = cn(
                  'flex items-center gap-1 rounded-full px-3 py-2 font-display text-[1.05rem] font-bold transition-colors outline-none',
                  active ? cn(accent.tint, 'ring-2 ring-ink') : 'hover:bg-white-1'
                )

                return (
                  <NavigationMenu.Item key={`${item.slug ?? item.url}-${idx}`} className="relative">
                    {item.items.length > 0 ? (
                      <>
                        <NavigationMenu.Trigger className={cn('group', pill, 'data-[state=open]:bg-white-1')}>
                          {item.title}
                          <ChevronDown
                            className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
                            aria-hidden
                          />
                        </NavigationMenu.Trigger>
                        <NavigationMenu.Content className="absolute top-full left-1/2 z-50 mt-3 min-w-60 -translate-x-1/2 animate-pop-in">
                          <div className="sticker relative p-2">
                            <span
                              aria-hidden
                              className={cn('absolute -top-2 left-1/2 size-4 -translate-x-1/2 rotate-45 border-t-[2.5px] border-l-[2.5px] border-ink', 'bg-paper')}
                            />
                            <ul className="m-0 list-none p-0">
                              {item.items.map((child, childIdx) =>
                                child.items.length > 0 ? (
                                  <li key={`${child.slug ?? child.url}-${childIdx}`} className="px-3 pt-2 pb-1">
                                    <span className="text-xs font-extrabold tracking-wider text-gray-6 uppercase">{child.title}</span>
                                    <ul className="m-0 mt-1 list-none p-0">
                                      {child.items.map((grand, grandIdx) => (
                                        <li key={`${grand.slug ?? grand.url}-${grandIdx}`}>
                                          <NavigationMenu.Link asChild>
                                            <NavLink
                                              item={grand}
                                              className="-mx-3 flex items-center gap-3 rounded-xl px-3 py-2 font-semibold whitespace-nowrap transition-colors hover:bg-cream"
                                            />
                                          </NavigationMenu.Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </li>
                                ) : (
                                  <li key={`${child.slug ?? child.url}-${childIdx}`}>
                                    <NavigationMenu.Link asChild>
                                      <NavLink
                                        item={child}
                                        className="group/link flex items-center gap-3 rounded-xl px-3 py-2 font-semibold whitespace-nowrap transition-colors hover:bg-cream"
                                        dotClassName={accentAt(idx + childIdx).bg}
                                      />
                                    </NavigationMenu.Link>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </NavigationMenu.Content>
                      </>
                    ) : (
                      <NavigationMenu.Link asChild active={active}>
                        <NavLink item={item} className={pill} />
                      </NavigationMenu.Link>
                    )}
                  </NavigationMenu.Item>
                )
              })}
            </NavigationMenu.List>
          </NavigationMenu.Root>

          <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="btn ml-auto bg-sun px-4 py-2 text-base lg:hidden"
                aria-label="Otevřít menu"
              >
                <Menu className="size-5" aria-hidden />
                Menu
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm data-[state=open]:animate-[fade-in_0.2s_ease]" />
              <Dialog.Content
                aria-describedby={undefined}
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto border-l-[2.5px] border-ink bg-cream shadow-large data-[state=open]:animate-[slide-in_0.3s_cubic-bezier(0.34,1.3,0.64,1)]"
              >
                <div className="flex items-center justify-between border-b-[2.5px] border-ink bg-paper px-5 py-4">
                  <Dialog.Title asChild>
                    <div onClick={() => setMobileOpen(false)}>
                      <Logo compact />
                    </div>
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button type="button" aria-label="Zavřít menu" className="btn bg-berry p-2 text-white-1">
                      <X className="size-6" aria-hidden />
                    </button>
                  </Dialog.Close>
                </div>
                <nav aria-label="Hlavní menu" className="flex-1 px-5 py-6">
                  <ul className="m-0 list-none space-y-3 p-0" onClick={(e) => (e.target as HTMLElement).closest('a') && setMobileOpen(false)}>
                    {menu.map((item, idx) => (
                      <MobileMenuItem key={`${item.slug ?? item.url}-${idx}`} item={item} accentIndex={idx} />
                    ))}
                  </ul>
                </nav>
                <div className="px-5 pb-8 text-sm text-gray-7">
                  Palackého náměstí 45, 517 41 Kostelec nad Orlicí
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </Container>
    </header>
  )
}
