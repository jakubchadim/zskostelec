'use client'

import { FileX, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ID, WpDocument, WpDocumentCategory } from '@/lib/wp'
import { FileCard } from './file-card'
import { filterDocumentGroups, groupDocumentsByCategory } from './filter'

type DocumentsExplorerProps = {
  documents: WpDocument[]
  categories: WpDocumentCategory[]
}

function toggleId(ids: ID[], id: ID): ID[] {
  return ids.includes(id) ? ids.filter((existing) => existing !== id) : [...ids, id]
}

/**
 * Client island holding the document search/filter state, ported from the interactive filter
 * sidebar in web/src/templates/allDocument.tsx (name search + category multi-select), restyled
 * with plain Tailwind form controls. Unlike the legacy flat filtered list, results stay grouped
 * into category sections per the task brief - selecting categories narrows which sections show
 * (and always excludes the uncategorized "Ostatní" section, since it matches no specific
 * category), and the name filter narrows documents within each remaining section. The server
 * template (`templates/documents.tsx`) fetches everything and passes it down as props.
 */
export function DocumentsExplorer({ documents, categories }: DocumentsExplorerProps) {
  const [name, setName] = useState('')
  const [categoryIds, setCategoryIds] = useState<ID[]>([])

  const groups = useMemo(() => groupDocumentsByCategory(documents, categories), [documents, categories])
  const filteredGroups = useMemo(
    () => filterDocumentGroups(groups, { name, categoryIds }),
    [groups, name, categoryIds]
  )
  const filterApplied = name.trim() !== '' || categoryIds.length > 0

  const reset = () => {
    setName('')
    setCategoryIds([])
  }

  return (
    <div className="gap-8 md:flex">
      <div className="mb-6 rounded-medium bg-white-1 p-4 shadow-lift md:mb-0 md:w-50 md:shrink-0 md:self-start">
        <label className="block">
          <span className="mb-2 block text-sm font-bold tracking-wide text-gray-7 uppercase">Název souboru</span>
          <input
            type="text"
            placeholder="Název souboru"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-small border border-gray-5 px-3 py-1 text-base"
          />
        </label>
        <fieldset className="mt-4">
          <legend className="mb-2 text-sm font-bold tracking-wide text-gray-7 uppercase">Kategorie</legend>
          <div className="flex flex-col gap-1">
            {categories.map((category) => (
              <label key={category.id} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={categoryIds.includes(category.id)}
                  onChange={() => setCategoryIds((ids) => toggleId(ids, category.id))}
                  className="accent-secondary-1"
                />
                {category.name}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <div className="min-w-0 flex-1">
        {filteredGroups.length === 0 ? (
          <div className="py-16 text-center">
            {filterApplied ? <Search size={46} className="mx-auto mb-4 text-gray-6" /> : <FileX size={46} className="mx-auto mb-4 text-gray-6" />}
            <h2>Dokumenty nenalezeny</h2>
            <p className="mx-auto max-w-80 opacity-70">Hledané dokumenty nebyly nalezeny.</p>
            {filterApplied && (
              <button
                type="button"
                onClick={reset}
                className="mt-4 inline-block rounded-small bg-primary-1 px-3 py-2 font-medium text-white-1 hover:bg-primary-2"
              >
                Vyčistit filtr
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {filteredGroups.map((group) => (
              <section key={group.category?.id ?? 'other'}>
                <h2 className="mb-3">{group.category?.name ?? 'Ostatní'}</h2>
                <div className="space-y-2">
                  {group.documents.map((document) => (
                    <FileCard key={document.id} name={document.title || document.filename} href={document.fileUrl} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
