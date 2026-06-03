// hooks/useServices.ts
import { useEffect, useCallback, useMemo, useState } from 'react';
import { useServiceStore } from '@/stores/slices/serviceSlice';
import { Service, CreateServiceDTO } from '@/types/entities/service.types';
import { appointmentService } from '@/services/appointment.service';

interface ServiceStats {
  totalRevenue: number;
  averageFee: number;
}

interface UseServicesOptions {
  autoFetch?: boolean;
  providerId?: number;
  usePatientView?: boolean; // If true, use appointment service for patient view
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

  const { autoFetch = true, providerId, usePatientView = false } = options;
  const [patientServices, setPatientServices] = useState<Service[]>([]);
  const [isLoadingPatient, setIsLoadingPatient] = useState(false);

  // For patient view, use appointment service to fetch all available services
  useEffect(() => {
    if (autoFetch && usePatientView && typeof window !== 'undefined') {
      setIsLoadingPatient(true);
      appointmentService.listServices()
        .then(async (services) => {
          // Fetch provider details for each service
          const servicesWithProviders = await Promise.all(
            services.map(async (service) => {
              try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/providers/${service.providerId}`, {
                  headers: {
                    'Content-Type': 'application/json',
                    ...(localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {})
                  }
                });
                
                if (response.ok) {
                  const providerData = await response.json();
                  return {
                    ...service,
                    providerName: providerData.name || null,
                    providerAvatar: providerData.profile_picture || null,
                  };
                }
                return service;
              } catch (error) {
                console.error('Failed to fetch provider for service:', service.id, error);
                return service;
              }
            })
          );
          setPatientServices(servicesWithProviders);
        })
        .catch((err) => {
          console.error('Failed to fetch patient services:', err);
        })
        .finally(() => {
          setIsLoadingPatient(false);
        });
    }
  }, [autoFetch, usePatientView]);

  // For provider view, use service store
  useEffect(() => {
    if (autoFetch && !usePatientView && typeof window !== 'undefined') {
      fetchServices();
    }
  }, [autoFetch, usePatientView, fetchServices]);

  const servicesToUse = usePatientView ? patientServices : services;
  const loadingToUse = usePatientView ? isLoadingPatient : isLoading;

  const getServiceById = useCallback((id: number): Service | undefined => {
    return servicesToUse.find((s) => s.id === id);
  }, [servicesToUse]);

  const searchServices = useCallback((query: string): Service[] => {
    const lowerQuery = query.toLowerCase();
    return servicesToUse.filter((s) =>
      s.name.toLowerCase().includes(lowerQuery) ||
      (s.description && s.description.toLowerCase().includes(lowerQuery))
    );
  }, [servicesToUse]);

  const handleCreateService = useCallback(async (data: CreateServiceDTO) => {
    const apiData = transformToApiFormat(data);
    await createService(apiData);
  }, [createService]);

  const stats = useMemo<ServiceStats>(() => {
    const activeServices = servicesToUse.filter(s => s.status === 'Active');
    const totalRevenue = activeServices.reduce((sum, s) => sum + s.standardFee, 0);
    const averageFee = activeServices.length > 0 ? totalRevenue / activeServices.length : 0;
    return {
      totalRevenue,
      averageFee,
    };
  }, [servicesToUse]);

  return {
    services: servicesToUse,
    isLoading: loadingToUse,
    error,
    stats,
    fetchServices,
    createService: handleCreateService,
    clearError,
    getServiceById,
    searchServices,
  };
};