// types/staff.ts
export interface StaffMember {
  id: number
  fullName: string
  email: string
  phoneNumber: string
  role: StaffRole
  status: StaffStatus
  addedDate: string
  initials: string
}

export type StaffRole = "Check-in Officer" | "Nurse" | "Receptionist"
export type StaffStatus = "Active" | "Invited" | "Inactive"

export interface StaffFilters {
  searchTerm: string
  role: StaffRole | "all"
  status: StaffStatus | "all"
}