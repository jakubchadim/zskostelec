import { describe, expect, it } from 'vitest'
import { getPageNumbers } from './pagination'

describe('getPageNumbers', () => {
  it('returns every page when there are 5 or fewer total', () => {
    expect(getPageNumbers(1, 1)).toEqual([1])
    expect(getPageNumbers(5, 1)).toEqual([1, 2, 3, 4, 5])
    expect(getPageNumbers(3, 2)).toEqual([1, 2, 3])
  })

  it('anchors the window to the start when current is near page 1', () => {
    expect(getPageNumbers(10, 1)).toEqual([1, 2, 3, 4, 5])
    expect(getPageNumbers(10, 2)).toEqual([1, 2, 3, 4, 5])
  })

  it('anchors the window to the end when current is near the last page', () => {
    expect(getPageNumbers(10, 10)).toEqual([6, 7, 8, 9, 10])
    expect(getPageNumbers(10, 9)).toEqual([6, 7, 8, 9, 10])
  })

  it('centers the window on current in the middle of the range', () => {
    expect(getPageNumbers(10, 5)).toEqual([3, 4, 5, 6, 7])
  })
})
