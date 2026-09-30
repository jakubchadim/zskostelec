import { describe, expect, it } from 'vitest'
import { asId } from '@/lib/wp'
import type { WpEmployee } from '@/lib/wp'
import { EMPTY_EMPLOYEE_FILTERS, filterEmployees, resolveNames } from './filter'

function employee(overrides: Partial<WpEmployee>): WpEmployee {
  return {
    id: asId(1),
    name: 'Jana Nováková',
    positionIds: [],
    buildingIds: [],
    priority: 50,
    email: '',
    phone: '',
    photo: null,
    ...overrides
  }
}

describe('filterEmployees', () => {
  const employees = [
    employee({ id: asId(1), name: 'Jana Nováková', positionIds: [asId(10)], buildingIds: [asId(100)] }),
    employee({ id: asId(2), name: 'Petr Svoboda', positionIds: [asId(20)], buildingIds: [asId(200)] }),
    employee({ id: asId(3), name: 'Karel Novák', positionIds: [asId(10), asId(20)], buildingIds: [asId(100)] })
  ]

  it('returns everything when no filters are applied', () => {
    expect(filterEmployees(employees, EMPTY_EMPLOYEE_FILTERS)).toEqual(employees)
  })

  it('matches name case-insensitively as a substring', () => {
    expect(filterEmployees(employees, { ...EMPTY_EMPLOYEE_FILTERS, name: 'nov' }).map((e) => e.id)).toEqual([
      asId(1),
      asId(3)
    ])
  })

  it('ignores diacritics in both directions', () => {
    expect(filterEmployees(employees, { ...EMPTY_EMPLOYEE_FILTERS, name: 'novakova' }).map((e) => e.id)).toEqual([
      asId(1)
    ])
    expect(filterEmployees(employees, { ...EMPTY_EMPLOYEE_FILTERS, name: 'nováková' }).map((e) => e.id)).toEqual([
      asId(1)
    ])
  })

  it('matches when the employee holds ANY of the selected positions', () => {
    expect(
      filterEmployees(employees, { ...EMPTY_EMPLOYEE_FILTERS, positionIds: [asId(20)] }).map((e) => e.id)
    ).toEqual([asId(2), asId(3)])
  })

  it('matches when the employee is in ANY of the selected buildings', () => {
    expect(
      filterEmployees(employees, { ...EMPTY_EMPLOYEE_FILTERS, buildingIds: [asId(200)] }).map((e) => e.id)
    ).toEqual([asId(2)])
  })

  it('combines name, position and building filters (AND across categories)', () => {
    expect(
      filterEmployees(employees, { name: 'nov', positionIds: [asId(10)], buildingIds: [asId(100)] }).map(
        (e) => e.id
      )
    ).toEqual([asId(1), asId(3)])
  })
})

describe('resolveNames', () => {
  const dictionary = [
    { id: asId(10), name: 'Učitel' },
    { id: asId(20), name: 'Ředitel' }
  ]

  it('joins resolved names with a comma', () => {
    expect(resolveNames([asId(10), asId(20)], dictionary)).toBe('Učitel, Ředitel')
  })

  it('drops ids missing from the dictionary', () => {
    expect(resolveNames([asId(10), asId(999)], dictionary)).toBe('Učitel')
  })

  it('returns an empty string for no ids', () => {
    expect(resolveNames([], dictionary)).toBe('')
  })
})
