// types/entities/service.types.ts

export const SERVICE_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive'
} as const;

export const SERVICE_TYPE = {
  CONSULTATION: 'Consultation',
  DIAGNOSTIC: 'DiagnosticTests',
  ClinicServices: 'ClinicServices',
 
} as const;

export type ServiceStatus = typeof SERVICE_STATUS[keyof typeof SERVICE_STATUS];
export type ServiceType = typeof SERVICE_TYPE[keyof typeof SERVICE_TYPE];

export interface Service {
  id: number;
  providerId: number;
  name: string;
  description: string;
  durationMinutes: number;
  standardFee: number;
  preparationInstructions: string | null;
  serviceType: ServiceType;
  status: ServiceStatus;
  location: string;
  createdAt: string;
  updatedAt: string;
}

// Fixed: Use undefined instead of 'all'
export interface ServiceFilters {
  searchTerm?: string;
  status?: ServiceStatus | 'all';
  serviceType?: ServiceType | 'all';
  providerId?: number;
  minFee?: number;
  maxFee?: number;
}

export interface ServiceStats {
  total: number;
  active: number;
  inactive: number;
  totalRevenue: number;
  averageFee: number;
  byType: Record<ServiceType, number>;
  averageDuration: number;
}

export type CreateServiceDTO = Omit<Service, 'id' | 'providerId' | 'createdAt' | 'updatedAt'>;
export type UpdateServiceDTO = Partial<Omit<Service, 'id' | 'providerId' | 'createdAt' | 'updatedAt'>>;

// Helper functions
export function isServiceAvailable(service: Service): boolean {
  return service.status === 'Active';
}

export function calculateServiceRevenue(service: Service, numberOfBookings: number): number {
  return service.standardFee * numberOfBookings;
}

export function getServiceTypeColor(serviceType: ServiceType): string {
  const colors: Record<ServiceType, string> = {
    Consultation: 'blue',
    DiagnosticTests: 'green',
  ClinicServices: 'orange'
  };
  return colors[serviceType];
}