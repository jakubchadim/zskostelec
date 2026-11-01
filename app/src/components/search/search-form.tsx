import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Path of the search results page; the query goes in `?q=`. */
export const SEARCH_PATH = '/hledat/'

/**
 * Plain GET form to the results page - works before hydration and without
 * JavaScript. Used in the header dialog, the mobile menu and on the results page.
 */
export function SearchForm({ defaultValue = '', autoFocus, className }: { defaultValue?: string; autoFocus?: boolean; className?: string }) {
  return (
    <form action={SEARCH_PATH} method="get" role="search" className={cn('flex gap-2', className)}>
      <label className="relative block min-w-0 flex-1">
        <span className="sr-only">Hledat na webu</span>
        <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-gray-6" aria-hidden />
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          autoFocus={autoFocus}
          minLength={2}
          required
          placeholder="Co hledáte?"
          className="block w-full rounded-full border-[2.5px] border-ink bg-paper py-3 pr-4 pl-12 text-lg font-semibold shadow-pop-sm outline-none placeholder:font-normal placeholder:text-gray-6 focus:shadow-pop focus:ring-4 focus:ring-sky/50"
        />
      </label>
      <button type="submit" className="btn shrink-0 bg-sun text-lg">
        Hledat
      </button>
    </form>
  )
}
