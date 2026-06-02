// stores/slices/service.slice.ts
import { create } from 'zustand';
import { Service } from '@/types/entities/service.types';
import { serviceService } from '@/services/service.service';
import { toast } from 'sonner';

interface ServiceStats {
  totalRevenue: number;
  averageFee: number;
}

interface ServiceState {
  services: Service[];
  isLoading: boolean;
  error: string | null;

  fetchServices: (serviceType?: string | null, location?: string | null) => Promise<void>;
  createService: (data: {
    name: string;
    service_type: string;
    location: string;
    price: number;
    duration_minutes: number;
    description: string;
  }) => Promise<void>;
  updateService: (providerId: number, serviceId: number, data: {
    name: string;
    service_type: string;
    location: string;
    price: number;
    duration_minutes: number;
    description: string;
  }) => Promise<void>;
  deleteService: (providerId: number, serviceId: number) => Promise<void>;
  clearError: () => void;
}

export const useServiceStore = create<ServiceState>((set, get) => ({
  services: [],
  isLoading: false,
  error: null,

  fetchServices: async (serviceType?: string | null, location?: string | null) => {
    set({ isLoading: true, error: null });
    try {
      const services = await serviceService.listServices(serviceType, location);
      set({ services, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch services', isLoading: false });
      toast.error('Failed to fetch services');
    }
  },

  createService: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await serviceService.createProviderService(data);
      // Refetch services after creation
      await get().fetchServices();
      toast.success('Service created successfully');
    } catch (error) {
      set({ error: 'Failed to create service', isLoading: false });
      toast.error('Failed to create service');
    }
  },

  updateService: async (providerId: number, serviceId: number, data) => {
    set({ isLoading: true, error: null });
    try {
      await serviceService.updateProviderService(providerId, serviceId, data);
      // Refetch services after update
      await get().fetchServices();
      toast.success('Service updated successfully');
    } catch (error) {
      set({ error: 'Failed to update service', isLoading: false });
      toast.error('Failed to update service');
    }
  },

  deleteService: async (providerId: number, serviceId: number) => {
    set({ isLoading: true, error: null });
    try {
      await serviceService.deleteProviderService(providerId, serviceId);
      // Refetch services after deletion
      await get().fetchServices();
      toast.success('Service deleted successfully');
    } catch (error) {
      set({ error: 'Failed to delete service', isLoading: false });
      toast.error('Failed to delete service');
    }
  },

  clearError: () => set({ error: null }),
}));