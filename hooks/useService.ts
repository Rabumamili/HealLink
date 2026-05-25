// hooks/useServices.ts
import { useEffect, useCallback, useMemo } from 'react';
import { useServiceStore } from '@/stores/slices/serviceSlice';
import { ServiceType, ServiceStatus, CreateServiceDTO, UpdateServiceDTO, ServiceFilters, Service, ServiceStats } from '@/types/entities/service.types';
import { toast } from 'sonner';

interface UseServicesOptions {
  providerId?: number | null;
  autoFetch?: boolean;
  initialFilters?: Partial<ServiceFilters>;
}

interface UseServicesReturn {
  // State
  services: Service[];
  stats: ServiceStats | null;
  isLoading: boolean;
  error: string | null;
  filters: ServiceFilters;
  
  // Filtered services
  consultationServices: Service[];
  diagnosticServices: Service[];
  vaccinationServices: Service[];
  procedureServices: Service[];
  activeServices: Service[];
  inactiveServices: Service[];
  
  // Actions
  fetchServices: (providerId?: number | null) => Promise<void>;
  fetchStats: (providerId?: number | null) => Promise<void>;
  createService: (data: CreateServiceDTO) => Promise<Service | null>;
  updateService: (id: number, data: UpdateServiceDTO) => Promise<Service | null>;
  deleteService: (id: number) => Promise<boolean>;
  toggleServiceStatus: (id: number) => Promise<Service | null>;
  setFilters: (filters: Partial<ServiceFilters>) => void;
  clearError: () => void;
  getServicesByProvider: (providerId: number) => Service[];
  getServicesByType: (type: ServiceType) => Service[];
  
  // Helper functions
  getServiceById: (id: number) => Service | undefined;
  getServicesByStatus: (status: ServiceStatus) => Service[];
  searchServices: (query: string) => Service[];
}

export const useServices = (options: UseServicesOptions = {}): UseServicesReturn => {
  const { providerId, autoFetch = true, initialFilters = {} } = options;
  
  // Get store state and actions
  const {
    services,
    stats,
    isLoading,
    error,
    filters,
    fetchServices: fetchServicesStore,
    fetchStats: fetchStatsStore,
    createService: createServiceStore,
    updateService: updateServiceStore,
    deleteService: deleteServiceStore,
    toggleServiceStatus: toggleServiceStatusStore,
    setFilters: setFiltersStore,
    clearError: clearErrorStore,
    getServicesByProvider: getServicesByProviderStore,
    getServicesByType: getServicesByTypeStore,
  } = useServiceStore();

  // Fetch data on mount or when providerId changes
  useEffect(() => {
    if (autoFetch) {
      fetchServices(providerId);
      fetchStats(providerId);
    }
  }, [providerId, autoFetch]);

  // Set initial filters
  useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      setFiltersStore(initialFilters);
    }
  }, []);

  // Wrapper functions
  const fetchServices = useCallback(async (pid?: number | null) => {
    await fetchServicesStore(pid !== undefined ? pid : providerId);
  }, [fetchServicesStore, providerId]);

  const fetchStats = useCallback(async (pid?: number | null) => {
    await fetchStatsStore(pid !== undefined ? pid : providerId);
  }, [fetchStatsStore, providerId]);

  // Filtered services by type
  const consultationServices = useMemo(() => 
    getServicesByTypeStore('Consultation'), 
    [services, getServicesByTypeStore]
  );
  
  const diagnosticServices = useMemo(() => 
    getServicesByTypeStore('Diagnostic'), 
    [services, getServicesByTypeStore]
  );
  
  const vaccinationServices = useMemo(() => 
    getServicesByTypeStore('Vaccination'), 
    [services, getServicesByTypeStore]
  );
  
  const procedureServices = useMemo(() => 
    getServicesByTypeStore('Procedure'), 
    [services, getServicesByTypeStore]
  );
  
  const activeServices = useMemo(() => 
    services.filter(s => s.status === 'Active'), 
    [services]
  );
  
  const inactiveServices = useMemo(() => 
    services.filter(s => s.status === 'Inactive'), 
    [services]
  );

  // Helper functions
  const getServiceById = useCallback((id: number) => {
    return services.find(s => s.id === id);
  }, [services]);

  const getServicesByStatus = useCallback((status: ServiceStatus) => {
    return services.filter(s => s.status === status);
  }, [services]);

  const searchServices = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return services.filter(s => 
      s.name.toLowerCase().includes(lowerQuery) ||
      (s.description && s.description.toLowerCase().includes(lowerQuery))
    );
  }, [services]);

  return {
    // State
    services,
    stats,
    isLoading,
    error,
    filters,
    
    // Filtered services
    consultationServices,
    diagnosticServices,
    vaccinationServices,
    procedureServices,
    activeServices,
    inactiveServices,
    
    // Actions
    fetchServices,
    fetchStats,
    createService: createServiceStore,
    updateService: updateServiceStore,
    deleteService: deleteServiceStore,
    toggleServiceStatus: toggleServiceStatusStore,
    setFilters: setFiltersStore,
    clearError: clearErrorStore,
    getServicesByProvider: getServicesByProviderStore,
    getServicesByType: getServicesByTypeStore,
    
    // Helpers
    getServiceById,
    getServicesByStatus,
    searchServices,
  };
};