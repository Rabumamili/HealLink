// stores/staff.store.ts
import { create } from 'zustand'
import { StaffMember, StaffFilters } from '@/types/entities/staff.types'
import { staffService } from '@/services/staff.service'

interface StaffStore {
  staff: StaffMember[]
  isLoading: boolean
  error: string | null
  filters: StaffFilters
  
  fetchStaff: () => Promise<void>
  addStaff: (data: Omit<StaffMember, 'id' | 'addedDate' | 'initials' | 'status'>) => Promise<void>
  updateStaff: (id: number, data: Partial<StaffMember>) => Promise<void>
  deleteStaff: (id: number) => Promise<void>
  resendInvite: (email: string) => Promise<void>
  setFilters: (filters: Partial<StaffFilters>) => void
  clearError: () => void
}

export const useStaffStore = create<StaffStore>((set, get) => ({
  staff: [],
  isLoading: false,
  error: null,
  filters: { searchTerm: '', role: 'all', status: 'all' },

  fetchStaff: async () => {
    set({ isLoading: true, error: null })
    try {
      const staff = await staffService.getStaff(get().filters)
      set({ staff, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch staff', isLoading: false })
    }
  },

  addStaff: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const newStaff = await staffService.addStaff(data)
      set((state) => ({ staff: [...state.staff, newStaff], isLoading: false }))
    } catch (error) {
      set({ error: 'Failed to add staff member', isLoading: false })
    }
  },

  updateStaff: async (id, data) => {
    try {
      const updated = await staffService.updateStaff(id, data)
      set((state) => ({
        staff: state.staff.map((s) => s.id === id ? updated : s),
      }))
    } catch (error) {
      set({ error: 'Failed to update staff member' })
    }
  },

  deleteStaff: async (id) => {
    try {
      await staffService.deleteStaff(id)
      set((state) => ({
        staff: state.staff.filter((s) => s.id !== id),
      }))
    } catch (error) {
      set({ error: 'Failed to delete staff member' })
    }
  },

  resendInvite: async (email) => {
    try {
      await staffService.resendInvitation(email)
    } catch (error) {
      set({ error: 'Failed to resend invitation' })
    }
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }))
    get().fetchStaff()
  },

  clearError: () => set({ error: null }),
}))