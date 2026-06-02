// hooks/useServices.ts
import { useEffect, useCallback, useMemo } from 'react';
import { useServiceStore } from '@/stores/slices/serviceSlice';
import { Service, CreateServiceDTO } from '@/types/entities/service.types';

interface ServiceStats {
  totalRevenue: number;
  averageFee: number;
}

interface UseServicesOptions {
  autoFetch?: boolean;
  providerId?: number;
}

const transformToApiFormat = (data: CreateServiceDTO) => ({
  name: data.name,
  service_type: data.serviceType,
  location: data.location,
  price: data.standardFee,
  duration_minutes: data.durationMinutes,
  description: data.description,
});

export const useServices = (options: UseServicesOptions = {}) => {
  const {
    services,
    isLoading,
    error,
    fetchServices,
    createService,
    clearError,
  } = useServiceStore();

  const { autoFetch = true, providerId } = options;

  useEffect(() => {
    if (autoFetch) {
      fetchServices();
    }
  }, [autoFetch, fetchServices]);

  const getServiceById = useCallback((id: number): Service | undefined => {
    return services.find((s) => s.id === id);
  }, [services]);

  const searchServices = useCallback((query: string): Service[] => {
    const lowerQuery = query.toLowerCase();
    return services.filter((s) =>
      s.name.toLowerCase().includes(lowerQuery) ||
      (s.description && s.description.toLowerCase().includes(lowerQuery))
    );
  }, [services]);

  const handleCreateService = useCallback(async (data: CreateServiceDTO) => {
    const apiData = transformToApiFormat(data);
    await createService(apiData);
  }, [createService]);

  const stats = useMemo<ServiceStats>(() => {
    const activeServices = services.filter(s => s.status === 'Active');
    const totalRevenue = activeServices.reduce((sum, s) => sum + s.standardFee, 0);
    const averageFee = activeServices.length > 0 ? totalRevenue / activeServices.length : 0;
    return {
      totalRevenue,
      averageFee,
    };
  }, [services]);

  return {
    services,
    isLoading,
    error,
    stats,
    fetchServices,
    createService: handleCreateService,
    clearError,
    getServiceById,
    searchServices,
  };
};