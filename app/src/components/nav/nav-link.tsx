import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavItem } from './types'

function isExternalLink(url: string, target?: string): boolean {
  return url.startsWith('http') || target === '_blank'
}

type NavLinkProps = {
  item: NavItem
  className?: string
}

/** Renders one NavItem as a link (or plain text if it has no url). Mirrors
 * the legacy `renderMenuItem` in web/src/components/nav/submenu.tsx. */
export function NavLink({ item, className }: NavLinkProps) {
  if (!item.url) {
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
