'use strict'

export function filterDefined<T>(items: (T | undefined | null)[]): T[] {
  return <T[]>items.filter((i) => i != null)
}

export function toggleItemInArray<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]
}

export function addItemToArray<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr : [...arr, item]
}

export function removeItemFromArray<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : arr
}
