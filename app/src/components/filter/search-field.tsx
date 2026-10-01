import { Search, X } from 'lucide-react'

type SearchFieldProps = {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}

/** Big rounded search input with a clear button. */
export function SearchField({ label, placeholder, value, onChange }: SearchFieldProps) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-gray-6" aria-hidden />
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-full border-[2.5px] border-ink bg-paper py-3 pr-12 pl-12 text-lg font-semibold shadow-pop-sm outline-none placeholder:font-normal placeholder:text-gray-6 focus:shadow-pop focus:ring-4 focus:ring-sky/50 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Vymazat hledání"
          className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-gray-2 hover:bg-berry-tint"
        >
          <X className="size-4" aria-hidden />
        </button>
      )}
    </label>
  )
}
