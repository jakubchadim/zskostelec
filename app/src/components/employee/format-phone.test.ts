import { describe, expect, it } from 'vitest'
import { formatPhoneNumber } from './format-phone'

describe('formatPhoneNumber', () => {
  it('groups a 9-digit number into +420 XXX XXX XXX', () => {
    expect(formatPhoneNumber('123456789')).toBe('+420 123 456 789')
  })

  it('returns shorter numbers unchanged', () => {
    expect(formatPhoneNumber('12345')).toBe('12345')
  })

  it('returns longer numbers unchanged', () => {
    expect(formatPhoneNumber('1234567890')).toBe('1234567890')
  })

  it('returns an empty string unchanged', () => {
    expect(formatPhoneNumber('')).toBe('')
  })
})
