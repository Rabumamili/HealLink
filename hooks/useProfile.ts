// hooks/useProfile.ts
'use client';

import { useEffect, useCallback } from 'react';
import { useProfileStore } from '@/stores/slices/profileSlice';
import { useAuth } from './useAuth';
import { ProfileRoleType } from '@/services/profile.service';
import {
  PatientProfileUpdate,
  DoctorProfileUpdate,
  ClinicProfileUpdate,
  DiagnosticCenterProfileUpdate,
  StaffProfileUpdate,
  ChangePasswordData,
  Profile,
  PatientProfile,
  DoctorProfile,
  ClinicProfile,
  DiagnosticCenterProfile,
  StaffProfile,
} from '@/types/entities/profile.types';

interface UseProfileOptions {
  autoFetch?: boolean;
  userId?: number;
  role?: ProfileRoleType;
}

export const useProfile = (options: UseProfileOptions = {}) => {
  const { autoFetch = true, userId, role } = options;
  
  // Get auth state from useAuth hook
  const { user, isAuthenticated } = useAuth();
  
  // Get profile store actions and state
  const {
    currentProfile,
    currentProfileType,
    patientProfile,
    doctorProfile,
    clinicProfile,
    diagnosticCenterProfile,
    staffProfile,
    doctorStatistics,
    clinicStatistics,
    diagnosticCenterStatistics,
    staffStatistics,
    doctors,
    clinics,
    diagnosticCenters,
    staffMembers,
    isLoading: profileLoading,
    error,
    isUpdating,
    isUploading,
    isDeleting,
    fetchMyProfile,
    fetchProfileById,
    updateMyProfile,
    fetchPatientProfile,
    fetchDoctorProfile,
    fetchClinicProfile,
    fetchDiagnosticCenterProfile,
    fetchStaffProfile,
    updatePatientProfile,
    updateDoctorProfile,
    updateClinicProfile,
    updateDiagnosticCenterProfile,
    updateStaffProfile,
    fetchDoctorStatistics,
    fetchClinicStatistics,
    fetchDiagnosticCenterStatistics,
    fetchStaffStatistics,
    fetchAllDoctors,
    fetchAllClinics,
    fetchAllDiagnosticCenters,
    fetchStaffByEmployer,
    uploadProfilePhoto,
    deleteProfilePhoto,
    uploadLicenseDocument,
    uploadRegistrationDocument,
    changePassword: changePasswordStore,
    requestVerification,
    deleteAccount,
    clearProfile,
    clearError,
    setCurrentProfile,
  } = useProfileStore();

  // Auto-fetch profile on mount if authenticated
  useEffect(() => {
    if (autoFetch && isAuthenticated) {
      if (userId && role) {
        fetchProfileById(userId, role);
      } else {
        fetchMyProfile();
      }
    }
  }, [autoFetch, isAuthenticated, userId, role, fetchMyProfile, fetchProfileById]);

  // Helper to get profile by role
  const getProfileByRole = useCallback((): Profile | null => {
    if (!user) return null;
    switch (user.role) {
      case 'patient': return patientProfile;
      case 'doctor': return doctorProfile;
      case 'clinic': return clinicProfile;
      case 'diagnostic_center': return diagnosticCenterProfile;
      case 'staff': return staffProfile;
      default: return currentProfile;
    }
  }, [user, patientProfile, doctorProfile, clinicProfile, diagnosticCenterProfile, staffProfile, currentProfile]);

  // Get statistics by role
  const getStatisticsByRole = useCallback(() => {
    if (!user) return null;
    switch (user.role) {
      case 'doctor': return doctorStatistics;
      case 'clinic': return clinicStatistics;
      case 'diagnostic_center': return diagnosticCenterStatistics;
      case 'staff': return staffStatistics;
      default: return null;
    }
  }, [user, doctorStatistics, clinicStatistics, diagnosticCenterStatistics, staffStatistics]);

  // ===============================
  // PATIENT METHODS
  // ===============================
  const loadPatientProfile = useCallback(async () => {
    if (!user || user.role !== 'patient') return null;
    await fetchPatientProfile();
    return patientProfile;
  }, [user, fetchPatientProfile, patientProfile]);

  const updatePatient = useCallback(async (formData: FormData) => {
    if (!user || user.role !== 'patient') return false;
    try {
      await updatePatientProfile(formData);
      return true;
    } catch {
      return false;
    }
  }, [user, updatePatientProfile]);

  // ===============================
  // DOCTOR METHODS
  // ===============================
  const loadDoctorProfile = useCallback(async () => {
    if (!user || user.role !== 'doctor') return null;
    await fetchDoctorProfile(user.id);
    return doctorProfile;
  }, [user, fetchDoctorProfile, doctorProfile]);

  const updateDoctor = useCallback(async (data: DoctorProfileUpdate) => {
    if (!user || user.role !== 'doctor') return false;
    try {
      await updateDoctorProfile(user.id, data);
      return true;
    } catch {
      return false;
    }
  }, [user, updateDoctorProfile]);

  const loadDoctorStatistics = useCallback(async () => {
    if (!user || user.role !== 'doctor') return null;
    await fetchDoctorStatistics(user.id);
    return doctorStatistics;
  }, [user, fetchDoctorStatistics, doctorStatistics]);

  const uploadLicense = useCallback(async (file: File) => {
    if (!user || (user.role !== 'doctor' && user.role !== 'clinic' && user.role !== 'diagnostic_center')) {
      return null;
    }
    return await uploadLicenseDocument(user.id, user.role as any, file);
  }, [user, uploadLicenseDocument]);

  // ===============================
  // CLINIC METHODS
  // ===============================
  const loadClinicProfile = useCallback(async () => {
    if (!user || user.role !== 'clinic') return null;
    await fetchClinicProfile(user.id);
    return clinicProfile;
  }, [user, fetchClinicProfile, clinicProfile]);

  const updateClinic = useCallback(async (data: ClinicProfileUpdate) => {
    if (!user || user.role !== 'clinic') return false;
    try {
      await updateClinicProfile(user.id, data);
      return true;
    } catch {
      return false;
    }
  }, [user, updateClinicProfile]);

  const loadClinicStatistics = useCallback(async () => {
    if (!user || user.role !== 'clinic') return null;
    await fetchClinicStatistics(user.id);
    return clinicStatistics;
  }, [user, fetchClinicStatistics, clinicStatistics]);

  // ===============================
  // DIAGNOSTIC CENTER METHODS
  // ===============================
  const loadDiagnosticCenterProfile = useCallback(async () => {
    if (!user || user.role !== 'diagnostic_center') return null;
    await fetchDiagnosticCenterProfile(user.id);
    return diagnosticCenterProfile;
  }, [user, fetchDiagnosticCenterProfile, diagnosticCenterProfile]);

  const updateDiagnosticCenter = useCallback(async (data: DiagnosticCenterProfileUpdate) => {
    if (!user || user.role !== 'diagnostic_center') return false;
    try {
      await updateDiagnosticCenterProfile(user.id, data);
      return true;
    } catch {
      return false;
    }
  }, [user, updateDiagnosticCenterProfile]);

  const loadDiagnosticStatistics = useCallback(async () => {
    if (!user || user.role !== 'diagnostic_center') return null;
    await fetchDiagnosticCenterStatistics(user.id);
    return diagnosticCenterStatistics;
  }, [user, fetchDiagnosticCenterStatistics, diagnosticCenterStatistics]);

  // ===============================
  // STAFF METHODS
  // ===============================
  const loadStaffProfile = useCallback(async () => {
    if (!user || user.role !== 'staff') return null;
    await fetchStaffProfile(user.id);
    return staffProfile;
  }, [user, fetchStaffProfile, staffProfile]);

  const updateStaff = useCallback(async (data: StaffProfileUpdate) => {
    if (!user || user.role !== 'staff') return false;
    try {
      await updateStaffProfile(user.id, data);
      return true;
    } catch {
      return false;
    }
  }, [user, updateStaffProfile]);

  const loadStaffStatistics = useCallback(async () => {
    if (!user || user.role !== 'staff') return null;
    await fetchStaffStatistics(user.id);
    return staffStatistics;
  }, [user, fetchStaffStatistics, staffStatistics]);

  // ===============================
  // COMMON METHODS
  // ===============================
  const uploadPhoto = useCallback(async (file: File) => {
    if (!user) return null;
    
    let role: ProfileRoleType;
    switch (user.role) {
      case 'patient': role = 'patient'; break;
      case 'doctor': role = 'doctor'; break;
      case 'clinic': role = 'clinic'; break;
      case 'diagnostic_center': role = 'diagnostic_center'; break;
      case 'staff': role = 'staff'; break;
      default: throw new Error(`Unsupported role: ${user.role}`);
    }
    
    const url = await uploadProfilePhoto(user.id, role, file);
    return url;
  }, [user, uploadProfilePhoto]);

  const deletePhoto = useCallback(async () => {
    if (!user) return;
    
    let role: ProfileRoleType;
    switch (user.role) {
      case 'patient': role = 'patient'; break;
      case 'doctor': role = 'doctor'; break;
      case 'clinic': role = 'clinic'; break;
      case 'diagnostic_center': role = 'diagnostic_center'; break;
      case 'staff': role = 'staff'; break;
      default: throw new Error(`Unsupported role: ${user.role}`);
    }
    
    await deleteProfilePhoto(user.id, role);
  }, [user, deleteProfilePhoto]);

  const uploadRegistration = useCallback(async (file: File) => {
    if (!user || (user.role !== 'clinic' && user.role !== 'diagnostic_center')) {
      return null;
    }
    return await uploadRegistrationDocument(user.id, user.role as any, file);
  }, [user, uploadRegistrationDocument]);

  const updatePassword = useCallback(async (data: ChangePasswordData) => {
    const success = await changePasswordStore(data);
    return success;
  }, [changePasswordStore]);

  const removeAccount = useCallback(async () => {
    if (!user) return false;
    
    let role: ProfileRoleType;
    switch (user.role) {
      case 'patient': role = 'patient'; break;
      case 'doctor': role = 'doctor'; break;
      case 'clinic': role = 'clinic'; break;
      case 'diagnostic_center': role = 'diagnostic_center'; break;
      case 'staff': role = 'staff'; break;
      default: role = 'patient';
    }
    
    const success = await deleteAccount(user.id, role);
    if (success) {
      clearProfile();
    }
    return success;
  }, [user, deleteAccount, clearProfile]);

  const requestProfileVerification = useCallback(async () => {
    if (!user) return;
    
    let role: ProfileRoleType;
    switch (user.role) {
      case 'patient': role = 'patient'; break;
      case 'doctor': role = 'doctor'; break;
      case 'clinic': role = 'clinic'; break;
      case 'diagnostic_center': role = 'diagnostic_center'; break;
      case 'staff': role = 'staff'; break;
      default: role = 'patient';
    }
    
    await requestVerification(user.id, role);
  }, [user, requestVerification]);

  // Role checks
  const isPatient = user?.role === 'patient';
  const isDoctor = user?.role === 'doctor';
  const isClinic = user?.role === 'clinic';
  const isDiagnosticCenter = user?.role === 'diagnostic_center';
  const isStaff = user?.role === 'staff';
  const isLabAssistant = isStaff && user?.staff_sub_role === 'lab assistant';
  const isCardChecker = isStaff && user?.staff_sub_role === 'card_checker';

  // Get display name and photo
  const profile = getProfileByRole();
  const statistics = getStatisticsByRole();
  const displayName = getDisplayNameFromProfile(profile, user);
  const profilePhoto = getProfilePhoto(profile);

  // Loading states
  const loading = profileLoading;
  const uploadLoading = isUploading;
  const passwordLoading = isUpdating;
  const deleteLoading = isDeleting;

  return {
    // State
    profile,
    statistics,
    loading,
    uploadLoading,
    passwordLoading,
    deleteLoading,
    error,
    
    // Patient specific
    loadPatientProfile,
    updatePatient,
    
    // Doctor specific
    loadDoctorProfile,
    updateDoctor,
    loadDoctorStatistics,
    uploadLicense,
    
    // Clinic specific
    loadClinicProfile,
    updateClinic,
    loadClinicStatistics,
    
    // Diagnostic Center specific
    loadDiagnosticCenterProfile,
    updateDiagnosticCenter,
    loadDiagnosticStatistics,
    
    // Staff specific
    loadStaffProfile,
    updateStaff,
    loadStaffStatistics,
    
    // Common
    uploadPhoto,
    deletePhoto,
    updatePassword,
    removeAccount,
    uploadRegistration,
    requestVerification: requestProfileVerification,
    
    // Role checks
    isPatient,
    isDoctor,
    isClinic,
    isDiagnosticCenter,
    isStaff,
    isLabAssistant,
    isCardChecker,
    
    // User info
    user,
    displayName,
    profilePhoto,
    
    // Lists (for admin/staff management)
    doctors,
    clinics,
    diagnosticCenters,
    staffMembers,
    fetchAllDoctors,
    fetchAllClinics,
    fetchAllDiagnosticCenters,
    fetchStaffByEmployer,
    
    // Utility
    clearError,
    refetch: () => {
      if (user) {
        fetchMyProfile();
      }
    },
  };
};

// Helper functions
function getDisplayNameFromProfile(profile: Profile | null, user: any): string {
  if (!profile) return user?.email?.split('@')[0] || 'User';
  
  if ('first_name' in profile && profile.first_name) {
    const lastName = (profile as any).last_name || '';
    return `${profile.first_name} ${lastName}`.trim();
  }
  
  if ('full_name' in profile && profile.full_name) {
    return profile.full_name;
  }
  
  return user?.email?.split('@')[0] || 'User';
}

function getProfilePhoto(profile: Profile | null): string | undefined {
  if (!profile) return undefined;
  return profile.profile_photo;
}