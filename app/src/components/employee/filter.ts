import type { ID } from '@/lib/wp'
import { foldText } from '@/lib/utils'
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
 * Case- and diacritics-insensitive substring match on the name (legacy did
 * no folding, so "nemec" didn't find "Němec" - a real annoyance on phone
 * keyboards), and an "any of the selected ids" match for position/building.
 * An empty `positionIds`/`buildingIds` selection matches everything (filter not applied).
 */
export function filterEmployees(employees: WpEmployee[], filters: EmployeeFilters): WpEmployee[] {
  const name = foldText(filters.name)

  return employees.filter((employee) => {
    if (name && !foldText(employee.name).includes(name)) {
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
  return resolveNameList(ids, dictionary).join(', ')
}

/** Same lookup as `resolveNames`, as a de-duplicated list (one chip per name). */
export function resolveNameList(ids: ID[], dictionary: { id: ID; name: string }[]): string[] {
  const byId = new Map(dictionary.map((item) => [item.id, item.name]))
  const names = ids.map((id) => byId.get(id)).filter((name): name is string => Boolean(name))
  return [...new Set(names)]
}
