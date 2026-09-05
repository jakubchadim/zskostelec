/** Port of web/src/components/employee/employee.tsx's formatPhoneNumber: groups a 9-digit CZ
 * number into `+420 XXX XXX XXX`; any other length is returned unchanged (matches legacy). */
export function formatPhoneNumber(phoneNumber: string): string {
  if (phoneNumber.length !== 9) {
    return phoneNumber
  }

  return `+420 ${phoneNumber.match(/.{1,3}/g)?.join(' ')}`
}
