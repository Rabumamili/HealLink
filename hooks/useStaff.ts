// hooks/useStaff.ts
import { useEffect } from 'react'
import { useStaffStore } from '@/stores/slices/staffSlice'

export const useStaff = () => {
  const {
    staff,
    isLoading,
    error,
    filters,
    fetchStaff,
    addStaff,
    updateStaff,
    deleteStaff,
    resendInvite,
    setFilters,
    clearError,
  } = useStaffStore()

  useEffect(() => {
    fetchStaff()
  }, [])

  const getActiveStaff = () => staff.filter((s) => s.status === 'Active')
  const getInvitedStaff = () => staff.filter((s) => s.status === 'Invited')

  return {
    staff,
    isLoading,
    error,
    filters,
    addStaff,
    updateStaff,
    deleteStaff,
    resendInvite,
    setFilters,
    clearError,
    getActiveStaff,
    getInvitedStaff,
  }
}