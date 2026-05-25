// stores/clinic.store.ts
import { create } from 'zustand'
import { Clinic, ClinicStats } from '@/types/entities/clinic.types'
import { clinicService } from '@/services/clinic.service'

interface ClinicStore {
  profile: Clinic | null
  stats: ClinicStats | null
  isLoading: boolean
  error: string | null
  
  fetchProfile: () => Promise<void>
  fetchStats: () => Promise<void>
  updateProfile: (data: Partial<Clinic>) => Promise<void>
  uploadLogo: (file: File) => Promise<void>
  uploadCover: (file: File) => Promise<void>
  clearError: () => void
}

export const useClinicStore = create<ClinicStore>((set) => ({
  profile: null,
  stats: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null })
    try {
      const profile = await clinicService.getClinicProfile()
      set({ profile, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch clinic profile', isLoading: false })
    }
  },

  fetchStats: async () => {
    try {
      const stats = await clinicService.getClinicStats()
      set({ stats })
    } catch (error) {
      console.error('Failed to fetch clinic stats:', error)
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const updated = await clinicService.updateClinicProfile(data)
      set({ profile: updated, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to update clinic profile', isLoading: false })
    }
  },

  uploadLogo: async (file) => {
    try {
      const { logoUrl } = await clinicService.uploadLogo(file)
      set((state) => ({
        profile: state.profile ? { ...state.profile, logoUrl } : null,
      }))
    } catch (error) {
      set({ error: 'Failed to upload logo' })
    }
  },

  uploadCover: async (file) => {
    try {
      const { coverUrl } = await clinicService.uploadCover(file)
      set((state) => ({
        profile: state.profile ? { ...state.profile, coverImageUrl: coverUrl } : null,
      }))
    } catch (error) {
      set({ error: 'Failed to upload cover image' })
    }
  },

  clearError: () => set({ error: null }),
}))