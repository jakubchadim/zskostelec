import { NavLink } from '@/components/nav/nav-link'
import type { NavItem } from '@/components/nav/types'
import { Box, BoxContent, BoxHeader } from './box'

type FastMenuBoxProps = {
  title?: string | null
  items: NavItem[]
  className?: string
}

/**
 * One of the two titled "fast menu" cards in `web/src/templates/home.tsx`
 * (`NavFastFirst`/`NavFastSecond` inside a `fullHeight` `UiBox`). Reuses
 * `NavLink` rather than re-implementing external-link/plain-text handling.
 * Legacy doesn't wrap this card's content in a scroll container (unlike
 * the article-preview boxes), so on a tall menu it clips rather than
 * scrolls - ported as-is.
 */
export function FastMenuBox({ title, items, className }: FastMenuBoxProps) {
  return (
    <Box fullHeight className={className}>
      <BoxHeader>
        <h2 className="mt-1 font-bold">{title}</h2>
      </BoxHeader>
      <BoxContent>
        <ul className="m-0 list-none space-y-1 p-0">
          {items.map((item, idx) => (
            <li key={`${item.slug || item.url}-${idx}`}>
              <NavLink item={item} className="hover:text-primary-1" />
            </li>
          ))}
        </ul>
      </BoxContent>
    </Box>
  )
}
