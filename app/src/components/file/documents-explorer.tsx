'use client'

import { useMemo, useState } from 'react'
import { FolderOpen } from 'lucide-react'
import type { ID, WpDocument, WpDocumentCategory } from '@/lib/wp'
import { ChipGroup } from '@/components/filter/chip-group'
import { SearchField } from '@/components/filter/search-field'
import { ArticleEmptyState } from '@/components/article/empty-state'
import { accentAt } from '@/components/ui/accent'
import { cn } from '@/lib/utils'
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
 * Client island for the documents page: search (diacritics-insensitive) +
 * category chips, then the matching documents grouped into category
 * sections. Selecting categories narrows which sections show (and always
 * excludes the uncategorised "Ostatní" section); the search narrows the
 * documents within each remaining section.
 */
export function DocumentsExplorer({ documents, categories }: DocumentsExplorerProps) {
  const [name, setName] = useState('')
  const [categoryIds, setCategoryIds] = useState<ID[]>([])

  const groups = useMemo(() => groupDocumentsByCategory(documents, categories), [documents, categories])
  const filteredGroups = useMemo(() => filterDocumentGroups(groups, { name, categoryIds }), [groups, name, categoryIds])
  const filterApplied = name.trim() !== '' || categoryIds.length > 0
  const resultCount = filteredGroups.reduce((sum, group) => sum + group.documents.length, 0)

  const reset = () => {
    setName('')
    setCategoryIds([])
  }

  return (
    <div>
      <div className="sticker space-y-5 bg-grape-tint p-4 sm:p-6">
        <SearchField label="Hledat dokument" placeholder="Hledat dokument, např. přihláška" value={name} onChange={setName} />
        <ChipGroup
          legend="Kategorie"
          items={categories}
          selected={categoryIds}
          onToggle={(id) => setCategoryIds((ids) => toggleId(ids, id))}
          collapseAfter={10}
        />
      </div>

      <div className="mt-6 mb-5 flex flex-wrap items-center justify-between gap-3" aria-live="polite">
        <p className="m-0 font-display text-lg font-bold">
          {filterApplied ? `Nalezeno dokumentů: ${resultCount}` : `Dokumentů celkem: ${documents.length}`}
        </p>
        {filterApplied && (
          <button type="button" onClick={reset} className="rounded-full border-2 border-ink bg-paper px-4 py-1.5 text-sm font-bold hover:bg-berry-tint">
            Zrušit filtry
          </button>
        )}
      </div>

      {filteredGroups.length === 0 ? (
        <ArticleEmptyState parentCategoryLink={null} title="Žádný dokument" text="Zkuste jiné slovo nebo zrušte filtr kategorií." />
      ) : (
        <div className="space-y-10">
          {filteredGroups.map((group, idx) => {
            const accent = accentAt(idx)
            return (
              <section key={group.category?.id ?? 'other'} aria-labelledby={`doc-group-${group.category?.id ?? 'other'}`}>
                <h2 id={`doc-group-${group.category?.id ?? 'other'}`} className="mb-4 flex items-center gap-3 text-2xl">
                  <span className={cn('grid size-10 place-items-center rounded-xl border-2 border-ink', accent.tint)}>
                    <FolderOpen className={cn('size-5', accent.text)} aria-hidden />
                  </span>
                  {group.category?.name ?? 'Ostatní'}
                  <span className="rounded-full bg-gray-2 px-2.5 py-0.5 font-sans text-sm font-bold text-gray-7">{group.documents.length}</span>
                </h2>
                <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-2">
                  {group.documents.map((document) => (
                    <li key={document.id}>
                      <FileCard name={document.title || document.filename} href={document.fileUrl} />
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
