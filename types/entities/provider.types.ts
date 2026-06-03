// types/entities/provider.types.ts

export type BackendProviderType = 'doctor' | 'clinic' | 'diagnostic_center' | string;

export interface BackendProvider {
  id: number;
  name: string;
  provider_type: BackendProviderType;
  email: string;
  phone: string | null;
  specialization: string | null;
  license_number: string | null;
  tin_number: string | null;
  location: string;
  address: string | null;
  description: string | null;
  license_document?: string | null;
  created_at: string;
  is_active?: boolean;
  is_verified?: boolean;
  verification_status?: string;
}

export interface ProviderListFilters {
  provider_type?: string;
  location?: string;
}
