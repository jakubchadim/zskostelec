'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { ID, WpBuilding, WpEmployee, WpPosition } from '@/lib/wp'
import { ChipGroup } from '@/components/filter/chip-group'
import { SearchField } from '@/components/filter/search-field'
import { ArticleEmptyState } from '@/components/article/empty-state'
import { EmployeeCard } from './employee-card'
import { filterEmployees, resolveNameList, resolveNames } from './filter'

type EmployeesExplorerProps = {
  employees: WpEmployee[]
  positions: WpPosition[]
  buildings: WpBuilding[]
}

function toggleId(ids: ID[], id: ID): ID[] {
  return ids.includes(id) ? ids.filter((existing) => existing !== id) : [...ids, id]
}

/** "1 člověk", "3 lidé", "12 lidí". */
function peopleLabel(count: number): string {
  if (count === 1) return '1 člověk'
  if (count >= 2 && count <= 4) return `${count} lidé`
  return `${count} lidí`
}

/**
 * Client island holding the staff search/filter state: a big search field,
 * building + position filter chips, a live result count, and a card grid.
 * The server template fetches everything and passes it down as props.
 */
export function EmployeesExplorer({ employees, positions, buildings }: EmployeesExplorerProps) {
  const [name, setName] = useState('')
  const [positionIds, setPositionIds] = useState<ID[]>([])
  // `?pracoviste=<building id>` (linked from the Pracoviště map) pre-selects a building.
  const searchParams = useSearchParams()
  const [buildingIds, setBuildingIds] = useState<ID[]>(() => {
    const fromUrl = searchParams.get('pracoviste')
    return buildings.filter((building) => String(building.id) === fromUrl).map((building) => building.id)
  })

  const filtered = useMemo(
    () => filterEmployees(employees, { name, positionIds, buildingIds }),
    [employees, name, positionIds, buildingIds]
  )
  const filterApplied = name.trim() !== '' || positionIds.length > 0 || buildingIds.length > 0

  const reset = () => {
    setName('')
    setPositionIds([])
    setBuildingIds([])
  }

  return (
    <div>
      <div className="sticker space-y-5 bg-grass-tint p-4 sm:p-6">
        <SearchField label="Hledat podle jména" placeholder="Hledat jméno, např. Němec" value={name} onChange={setName} />
        <ChipGroup
          legend="Pracoviště"
          items={buildings}
          selected={buildingIds}
          onToggle={(id) => setBuildingIds((ids) => toggleId(ids, id))}
          activeClassName="bg-sky-tint"
        />
        <ChipGroup
          legend="Pozice"
          items={positions}
          selected={positionIds}
          onToggle={(id) => setPositionIds((ids) => toggleId(ids, id))}
          collapseAfter={8}
        />
      </div>

      <div className="mt-6 mb-5 flex flex-wrap items-center justify-between gap-3" aria-live="polite">
        <p className="m-0 font-display text-lg font-bold">
          {filterApplied ? `Nalezeno: ${peopleLabel(filtered.length)}` : `Celkem ${peopleLabel(employees.length)}`}
        </p>
        {filterApplied && (
          <button type="button" onClick={reset} className="rounded-full border-2 border-ink bg-paper px-4 py-1.5 text-sm font-bold hover:bg-berry-tint">
            Zrušit filtry
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <ArticleEmptyState parentCategoryLink={null} title="Nikoho jsme nenašli" text="Zkuste upravit hledání nebo zrušit některý filtr." />
      ) : (
        <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((employee) => (
            <li key={employee.id}>
              <EmployeeCard
                name={employee.name}
                photo={employee.photo}
                positions={resolveNameList(employee.positionIds, positions)}
                location={resolveNames(employee.buildingIds, buildings)}
                phone={employee.phone}
                email={employee.email}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
