// stores/slices/service.slice.ts
import { create } from 'zustand';
import { Service, ServiceFilters, ServiceStats, CreateServiceDTO, UpdateServiceDTO, ServiceStatus, ServiceType } from '@/types/entities/service.types';
import { getServiceRepository } from '@/services/mock/mock.service';
import { toast } from 'sonner';

interface ServiceState {
  services: Service[];
  stats: ServiceStats | null;
  isLoading: boolean;
  error: string | null;
  filters: ServiceFilters;
  
  fetchServices: (providerId?: number | null) => Promise<void>;
  fetchStats: (providerId?: number | null) => Promise<void>;
  createService: (data: CreateServiceDTO) => Promise<Service | null>;
  updateService: (id: number, data: UpdateServiceDTO) => Promise<Service | null>;
  deleteService: (id: number) => Promise<boolean>;
  toggleServiceStatus: (id: number) => Promise<Service | null>;
  setFilters: (filters: Partial<ServiceFilters>) => void;
  clearError: () => void;
  getServicesByType: (type: ServiceType) => Service[];
  getActiveServices: () => Service[];
  getServicesByProvider: (providerId: number) => Service[];
}

const serviceRepo = getServiceRepository();

export const useServiceStore = create<ServiceState>((set, get) => ({
  services: [],
  stats: null,
  isLoading: false,
  error: null,
  filters: { searchTerm: '', serviceType: 'all', status: 'all' },

  fetchServices: async (providerId?: number | null) => {
    set({ isLoading: true, error: null });
    try {
      let services: Service[];
      if (providerId) {
        services = serviceRepo.findByProvider(undefined, providerId);
      } else {
        services = serviceRepo.findAll();
      }
      
      // Apply current filters
      const { filters } = get();
      let filtered = services;
      
      if (filters.searchTerm) {
        const search = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(s => 
          s.name.toLowerCase().includes(search) ||
          (s.description && s.description.toLowerCase().includes(search))
        );
      }
      
      if (filters.serviceType && filters.serviceType !== 'all') {
        filtered = filtered.filter(s => s.serviceType === filters.serviceType);
      }
      
      if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter(s => s.status === filters.status);
      }
      
      set({ services: filtered, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch services', isLoading: false });
      toast.error('Failed to fetch services');
    }
  },

  fetchStats: async (providerId?: number | null) => {
    set({ isLoading: true });
    try {
      const stats = serviceRepo.getStats(undefined, providerId || undefined);
      set({ stats, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      set({ isLoading: false });
      toast.error('Failed to fetch statistics');
    }
  },

  createService: async (data: CreateServiceDTO) => {
    set({ isLoading: true });
    try {
      const newService = serviceRepo.createService(data);
      set((state) => ({
        services: [...state.services, newService],
        isLoading: false,
      }));
      await get().fetchStats();
      toast.success('Service created successfully');
      return newService;
    } catch (error) {
      set({ error: 'Failed to create service', isLoading: false });
      toast.error('Failed to create service');
      return null;
    }
  },

  updateService: async (id: number, data: UpdateServiceDTO) => {
    set({ isLoading: true });
    try {
      const updated = serviceRepo.updateService(id, data);
      if (updated) {
        set((state) => ({
          services: state.services.map(s => s.id === id ? updated : s),
          isLoading: false,
        }));
        await get().fetchStats();
        toast.success('Service updated successfully');
        return updated;
      }
      throw new Error('Service not found');
    } catch (error) {
      set({ error: 'Failed to update service', isLoading: false });
      toast.error('Failed to update service');
      return null;
    }
  },

  deleteService: async (id: number) => {
    set({ isLoading: true });
    try {
      const success = serviceRepo.deleteService(id);
      if (success) {
        set((state) => ({
          services: state.services.filter(s => s.id !== id),
          isLoading: false,
        }));
        await get().fetchStats();
        toast.success('Service deleted successfully');
        return true;
      }
      throw new Error('Service not found');
    } catch (error) {
      set({ error: 'Failed to delete service', isLoading: false });
      toast.error('Failed to delete service');
      return false;
    }
  },

  toggleServiceStatus: async (id: number) => {
    set({ isLoading: true });
    try {
      const updated = serviceRepo.toggleStatus(id);
      if (updated) {
        set((state) => ({
          services: state.services.map(s => s.id === id ? updated : s),
          isLoading: false,
        }));
        await get().fetchStats();
        toast.success(`Service ${updated.status === 'Active' ? 'activated' : 'deactivated'} successfully`);
        return updated;
      }
      throw new Error('Service not found');
    } catch (error) {
      set({ error: 'Failed to toggle service status', isLoading: false });
      toast.error('Failed to update service status');
      return null;
    }
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
    get().fetchServices();
  },

  clearError: () => set({ error: null }),

  getServicesByType: (type: ServiceType) => {
    const { services } = get();
    return services.filter(s => s.serviceType === type);
  },

  getActiveServices: () => {
    const { services } = get();
    return services.filter(s => s.status === 'Active');
  },

  getServicesByProvider: (providerId: number) => {
    const { services } = get();
    return services.filter(s => s.providerId === providerId);
  },
}));