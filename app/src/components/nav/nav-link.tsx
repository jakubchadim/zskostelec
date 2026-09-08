import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavItem } from './types'

function isExternalLink(url: string, target?: string): boolean {
  return url.startsWith('http') || target === '_blank'
}

/** WP "custom link" items used purely as a group heading (e.g. the
 * "Přístupy"/"Informace" labels above a submenu) are authored with a bare
 * `#` URL rather than left empty, so they still carry a truthy `url` after
 * admin-domain rewriting collapses it to `/#`. Render those as plain text
 * too, matching production where they aren't clickable. */
function isPlaceholderUrl(url: string): boolean {
  return url === '#' || url === '/#'
}

type NavLinkProps = {
  item: NavItem
  className?: string
}

/** Renders one NavItem as a link (or plain text if it has no real url). Mirrors
 * the legacy `renderMenuItem` in web/src/components/nav/submenu.tsx. */
export function NavLink({ item, className }: NavLinkProps) {
  if (!item.url || isPlaceholderUrl(item.url)) {
    return <span className={className}>{item.title}</span>
  }

  if (isExternalLink(item.url, item.target)) {
    return (
      <a
        href={item.url}
        target={item.target ?? '_blank'}
        rel="noopener noreferrer"
        className={cn('inline-flex items-center gap-1', className)}
      >
        {item.title}
        <ExternalLink className="size-3.5 opacity-70" aria-hidden />
      </a>
    )
  }

  return (
    <Link href={item.url} className={className}>
      {item.title}
    </Link>
  )
}
