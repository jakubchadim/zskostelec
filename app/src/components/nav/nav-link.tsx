import type { AnchorHTMLAttributes, Ref } from 'react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavItem } from './types'

function isExternalLink(url: string, target?: string): boolean {
  return url.startsWith('http') || target === '_blank'
}

/** WP "custom link" items used purely as a group heading (e.g. "Přístupy")
 * are authored with a bare `#` URL - render those as plain text. */
function isPlaceholderUrl(url: string): boolean {
  return url === '#' || url === '/#'
}

type NavLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  item: NavItem
  className?: string
  /** Renders a small coloured dot before the label (dropdown menus). */
  dotClassName?: string
  ref?: Ref<HTMLAnchorElement>
}

/** Renders one NavItem as a link (or plain text if it has no real url).
 * Spreads extra props onto the anchor so it works under Radix `asChild`. */
export function NavLink({ item, className, dotClassName, ...rest }: NavLinkProps) {
  const dot = dotClassName ? (
    <span aria-hidden className={cn('size-2.5 shrink-0 rounded-full border-2 border-ink', dotClassName)} />
  ) : null

  if (!item.url || isPlaceholderUrl(item.url)) {
    return <span className={className}>{item.title}</span>
  }

  if (isExternalLink(item.url, item.target)) {
    return (
      <a
        {...rest}
        href={item.url}
        target={item.target ?? '_blank'}
        rel="noopener noreferrer"
        className={cn('inline-flex items-center gap-1', className)}
      >
        {dot}
        {item.title}
        <ExternalLink className="size-3.5 opacity-60" aria-label="(otevře se v novém okně)" />
      </a>
    )
  }

  return (
    <Link {...rest} href={item.url} className={className}>
      {dot}
      {item.title}
    </Link>
  )
}
