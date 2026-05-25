// stores/serviceSlice.ts
import { create } from 'zustand';
import { Service } from '@/types/service.types';
import { serviceService } from '@/services/api/services';

interface ServiceStore {
  services: Service[];
  isLoading: boolean;
  error: string | null;

  fetchServices: (params?: QueryParams) => Promise<void>;
  createService: (data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateService: (id: string, data: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
}

export const useServiceStore = create<ServiceStore>((set, get) => ({
  services: [],
  isLoading: false,
  error: null,

  fetchServices: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await serviceService.getServices(params);
      if (response.success && response.data) {
        set({ services: response.data.items, isLoading: false });
      } else {
        set({ error: response.error || 'Failed to fetch services', isLoading: false });
      }
    } catch (error) {
      set({ error: 'An error occurred', isLoading: false });
    }
  },

  createService: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await serviceService.createService(data);
      if (response.success && response.data) {
        set((state) => ({
          services: [...state.services, response.data!],
          isLoading: false,
        }));
      } else {
        set({ error: response.error || 'Failed to create service', isLoading: false });
      }
    } catch (error) {
      set({ error: 'An error occurred', isLoading: false });
    }
  },

  updateService: async (id, data) => {
    try {
      const response = await serviceService.updateService(id, data);
      if (response.success && response.data) {
        set((state) => ({
          services: state.services.map((s) =>
            s.id === id ? { ...s, ...response.data } : s
          ),
        }));
      }
    } catch (error) {
      console.error('Failed to update service:', error);
    }
  },

  deleteService: async (id) => {
    try {
      const response = await serviceService.deleteService(id);
      if (response.success) {
        set((state) => ({
          services: state.services.filter((s) => s.id !== id),
        }));
      }
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  },
}));