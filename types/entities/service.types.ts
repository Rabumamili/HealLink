// types/entities/service.types.ts
export type ServiceStatus = 'Active' | 'Inactive';
export type ServiceType = 'Consultation' | 'Diagnostic' | 'Vaccination' | 'Procedure';

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
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFilters {
  searchTerm?: string;
  status?: ServiceStatus | 'all';
  serviceType?: ServiceType | 'all';
}

export interface ServiceStats {
  total: number;
  active: number;
  inactive: number;
  totalRevenue: number;
  averageFee: number;
  byType: Record<ServiceType, number>;
}

export type CreateServiceDTO = Omit<Service, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateServiceDTO = Partial<Omit<Service, 'id' | 'createdAt' | 'updatedAt'>>;