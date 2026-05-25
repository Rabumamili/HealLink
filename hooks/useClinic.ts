// hooks/useClinic.ts
import { useEffect } from 'react'
import { useClinicStore } from '@/stores/slices/clinicSlice'

export const useClinic = () => {
  const {
    profile,
    stats,
    isLoading,
    error,
    fetchProfile,
    fetchStats,
    updateProfile,
    uploadLogo,
    uploadCover,
    clearError,
  } = useClinicStore()

  useEffect(() => {
    fetchProfile()
    fetchStats()
  }, [])

  return {
    profile,
    stats,
    isLoading,
    error,
    updateProfile,
    uploadLogo,
    uploadCover,
    clearError,
  }
}