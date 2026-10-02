export type StaffBuilding = { id: string; name: string }
export type StaffPosition = { id: string; name: string }

export type StaffMember = {
  id: string
  /** As shown: "Příjmení Jméno, titul". */
  name: string
  positionIds: string[]
  buildingIds: string[]
  /** Lower = higher in the list. */
  priority: number
  email: string
  phone: string
}
