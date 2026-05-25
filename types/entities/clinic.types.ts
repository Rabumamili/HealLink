// types/clinic.ts
export interface Clinic {
  id: number
  name: string
  address: string
  location: string
  contactPhone: string
  email: string
  operatingHours: string
  status: ClinicStatus
  verificationStatus: VerificationStatus
  licenseNumber: string
  tinNumber: string
  website?: string
  description?: string
  establishedYear?: string
  emergencyContact?: string
  logoUrl?: string
  coverImageUrl?: string
  totalDoctors: number
  totalStaff: number
  totalPatientsServed: number
  rating: number
  totalReviews: number
  joinedDate: string
}

export type ClinicStatus = "Active" | "Inactive" | "Pending"
export type VerificationStatus = "Verified" | "Pending" | "Unverified"

export interface ClinicStats {
  totalDoctors: number
  totalStaff: number
  totalPatientsServed: number
  rating: number
  totalReviews: number
}