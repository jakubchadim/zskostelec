import Link from 'next/link'
import { Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SiteTag } from '@/lib/content'

/** `<listing>/stitek-<slug>/` - the listing narrowed to one tag. */
export function tagLink(listingLink: string, tag: SiteTag | null): string {
  return tag ? `${listingLink}stitek-${tag.slug}/` : listingLink
}

type TagSwitcherProps = {
  /** Tags in use in this listing (the school manages them in the admin). */
  tags: SiteTag[]
  current: SiteTag | null
  /** The listing without a tag. */
  listingLink: string
}

/** Tag filter (1. stupeň, 2. stupeň, ŠD…) as a row of chips under the category or school-year chips. */
export function TagSwitcher({ tags, current, listingLink }: TagSwitcherProps) {
  // The chosen tag stays visible even where nothing uses it, so the visitor sees what the empty listing is filtered by.
  const shown = current && !tags.some((tag) => tag.id === current.id) ? [...tags, current] : tags
  if (shown.length === 0) {
    return null
  }

  const chip = 'rounded-full border-2 border-ink px-3.5 py-1 text-[0.95rem] font-display font-bold transition-all hover:-translate-y-0.5'

  return (
    <nav aria-label="Filtr podle štítku" className="mt-3 flex flex-wrap items-center gap-2">
      <span className="mr-1 flex items-center gap-1.5 text-sm font-extrabold tracking-wide text-gray-7 uppercase">
        <Tag className="size-4" aria-hidden /> Filtr
      </span>
      <Link
        href={listingLink}
        aria-current={current == null ? 'page' : undefined}
        className={cn(chip, current == null ? 'bg-ink text-white-1' : 'bg-paper shadow-pop-sm')}
      >
        Vše
      </Link>
      {shown.map((tag) => {
        const active = tag.id === current?.id
        return (
          <Link
            key={tag.id}
            href={tagLink(listingLink, tag)}
            aria-current={active ? 'page' : undefined}
            className={cn(chip, active ? 'bg-ink text-white-1' : 'bg-paper shadow-pop-sm')}
          >
            {tag.name}
          </Link>
        )
      })}
    </nav>
  )
}
