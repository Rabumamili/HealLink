// types/service.ts
export interface Service {
  id: number
  name: string
  description: string
  durationMinutes: number
  standardFee: number
  status: ServiceStatus
  serviceType: ServiceType
  preparationInstructions?: string
}

export type ServiceStatus = "Active" | "Inactive"
export type ServiceType = "Consultation" | "Diagnostic" | "Vaccination" | "Procedure"

export interface ServiceFilters {
  searchTerm: string
  status: ServiceStatus | "all"
  serviceType: ServiceType | "all"
}