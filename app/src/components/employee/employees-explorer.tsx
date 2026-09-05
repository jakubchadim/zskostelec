'use client'

import { FileX, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ID, WpBuilding, WpEmployee, WpPosition } from '@/lib/wp'
import { EmployeeCard } from './employee-card'
import { filterEmployees, resolveNames } from './filter'

type EmployeesExplorerProps = {
  employees: WpEmployee[]
  positions: WpPosition[]
  buildings: WpBuilding[]
}

function toggleId(ids: ID[], id: ID): ID[] {
  return ids.includes(id) ? ids.filter((existing) => existing !== id) : [...ids, id]
}

function ChoiceList({
  title,
  items,
  selected,
  onToggle
}: {
  title: string
  items: { id: ID; name: string }[]
  selected: ID[]
  onToggle: (id: ID) => void
}) {
  return (
    <fieldset className="mt-4 first:mt-0">
      <legend className="mb-2 text-sm font-bold tracking-wide text-gray-7 uppercase">{title}</legend>
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <label key={item.id} className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(item.id)}
              onChange={() => onToggle(item.id)}
              className="accent-secondary-1"
            />
            {item.name}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/**
 * Client island holding the employee search/filter state, ported from the interactive filter
 * sidebar in web/src/templates/allEmployee.tsx (name search + position/building multi-select),
 * restyled with plain Tailwind form controls rather than the legacy generic filter/chooser UI kit.
 * The server template (`templates/employees.tsx`) fetches everything and passes it down as props.
 */
export function EmployeesExplorer({ employees, positions, buildings }: EmployeesExplorerProps) {
  const [name, setName] = useState('')
  const [positionIds, setPositionIds] = useState<ID[]>([])
  const [buildingIds, setBuildingIds] = useState<ID[]>([])

  const filtered = useMemo(
    () => filterEmployees(employees, { name, positionIds, buildingIds }),
    [employees, name, positionIds, buildingIds]
  )
  const filterApplied = filtered.length !== employees.length

  const reset = () => {
    setName('')
    setPositionIds([])
    setBuildingIds([])
  }

  return (
    <div className="gap-8 md:flex">
      <div className="mb-6 rounded-medium bg-white-1 p-4 shadow-lift md:mb-0 md:w-50 md:shrink-0 md:self-start">
        <label className="block">
          <span className="mb-2 block text-sm font-bold tracking-wide text-gray-7 uppercase">Jméno</span>
          <input
            type="text"
            placeholder="např. Němec"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-small border border-gray-5 px-3 py-1 text-base"
          />
        </label>
        <ChoiceList title="Pozice" items={positions} selected={positionIds} onToggle={(id) => setPositionIds((ids) => toggleId(ids, id))} />
        <ChoiceList title="Pracoviště" items={buildings} selected={buildingIds} onToggle={(id) => setBuildingIds((ids) => toggleId(ids, id))} />
      </div>
      <div className="min-w-0 flex-1 space-y-4">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            {filterApplied ? <Search size={46} className="mx-auto mb-4 text-gray-6" /> : <FileX size={46} className="mx-auto mb-4 text-gray-6" />}
            <h2>Zaměstnanec nenalezen</h2>
            <p className="mx-auto max-w-80 opacity-70">Žádný zaměstnanec neodpovídá zadaným kritériím.</p>
            {filterApplied && (
              <button
                type="button"
                onClick={reset}
                className="mt-4 inline-block rounded-small bg-primary-1 px-3 py-2 font-medium text-white-1 hover:bg-primary-2"
              >
                Zobrazit všechny
              </button>
            )}
          </div>
        ) : (
          filtered.map((employee) => (
            <EmployeeCard
              key={employee.id}
              name={employee.name}
              photo={employee.photo}
              position={resolveNames(employee.positionIds, positions)}
              location={resolveNames(employee.buildingIds, buildings)}
              phone={employee.phone}
              email={employee.email}
            />
          ))
        )}
      </div>
    </div>
  )
}
