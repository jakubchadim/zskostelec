import type { ID } from '@/lib/wp'
import type { WpEmployee } from '@/lib/wp'

export type EmployeeFilters = {
  name: string
  positionIds: ID[]
  buildingIds: ID[]
}

export const EMPTY_EMPLOYEE_FILTERS: EmployeeFilters = {
  name: '',
  positionIds: [],
  buildingIds: []
}

/**
 * Port of the inline filter predicate in web/src/templates/allEmployee.tsx: a
 * plain case-insensitive substring match on the name (no diacritics folding -
 * the legacy filter didn't do any, confirmed against web/src/components/filter/*
 * and web/src/utils), and an "any of the selected ids" match for position/building.
 * An empty `positionIds`/`buildingIds` selection matches everything (filter not applied).
 */
export function filterEmployees(employees: WpEmployee[], filters: EmployeeFilters): WpEmployee[] {
  const name = filters.name.trim().toLowerCase()

  return employees.filter((employee) => {
    if (name && !employee.name.toLowerCase().includes(name)) {
      return false
    }

    if (filters.positionIds.length && !filters.positionIds.some((id) => employee.positionIds.includes(id))) {
      return false
    }

    if (filters.buildingIds.length && !filters.buildingIds.some((id) => employee.buildingIds.includes(id))) {
      return false
    }

    return true
  })
}

/** Builds an `id -> name` lookup from a flat dictionary list (positions/buildings), joined
 * comma-separated for the ids on one employee - port of `getDictionaryTranslator`. */
export function resolveNames(ids: ID[], dictionary: { id: ID; name: string }[]): string {
  const byId = new Map(dictionary.map((item) => [item.id, item.name]))
  return ids
    .map((id) => byId.get(id))
    .filter((name): name is string => Boolean(name))
    .join(', ')
}
