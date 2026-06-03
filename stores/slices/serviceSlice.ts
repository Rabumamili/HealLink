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

  fetchServices: (providerId?: number | null) => Promise<void>;
  createService: (data: {
    name: string;
    service_type: string;
    location: string;
    price: number;
    duration_minutes: number;
    description: string;
  }) => Promise<void>;
  clearError: () => void;
}

export const useServiceStore = create<ServiceState>((set, get) => ({
  services: [],
  isLoading: false,
  error: null,

  fetchServices: async (providerId?: number | null) => {
    if (typeof window === 'undefined') return;
    set({ isLoading: true, error: null });
    try {
      const services = await serviceService.listServices(providerId);
      console.log('Fetched services:', services);
      set({ services, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch services:', error);
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

  clearError: () => set({ error: null }),
}));