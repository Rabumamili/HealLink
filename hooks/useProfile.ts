// hooks/useProfile.ts

import { useCallback } from 'react';
import { useProfileStore } from '@/stores/slices/profileSlice';
import { UserRole } from '@/types/entities/auth.types';

import {
  PatientProfileUpdate,
  DoctorProfileUpdate,
  ClinicProfileUpdate,
  DiagnosticCenterProfileUpdate,
  StaffProfileUpdate,
  ChangePasswordData,
} from '@/types/entities/profile.types';

export const useProfile = () => {
  const {
    profile,
    statistics,

    loading,
    statisticsLoading,
    uploadLoading,
    passwordLoading,
    deleteLoading,

    error,

    fetchProfile,

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

    uploadProfilePicture,
    uploadCoverImage,
    uploadLicenseDocument,
    uploadRegistrationDocument,

    changePassword,

    fetchPatientStatistics,
    fetchDoctorStatistics,
    fetchClinicStatistics,
    fetchDiagnosticCenterStatistics,

    deleteAccount,
    exportHealthData,

    clearProfile,
    clearError,
  } = useProfileStore();

  // ==========================================================
  // PROFILE
  // ==========================================================

  const loadProfile = useCallback(
    async (role: UserRole) => {
      await fetchProfile(role);
    },
    [fetchProfile]
  );

  const loadPatientProfile = useCallback(async () => {
    await fetchPatientProfile();
  }, [fetchPatientProfile]);

  const loadDoctorProfile = useCallback(async () => {
    await fetchDoctorProfile();
  }, [fetchDoctorProfile]);

  const loadClinicProfile = useCallback(async () => {
    await fetchClinicProfile();
  }, [fetchClinicProfile]);

  const loadDiagnosticCenterProfile = useCallback(async () => {
    await fetchDiagnosticCenterProfile();
  }, [fetchDiagnosticCenterProfile]);

  const loadStaffProfile = useCallback(async () => {
    await fetchStaffProfile();
  }, [fetchStaffProfile]);

  // ==========================================================
  // UPDATE PROFILE
  // ==========================================================

  const updatePatient = useCallback(
    async (data: PatientProfileUpdate) => {
      return await updatePatientProfile(data);
    },
    [updatePatientProfile]
  );

  const updateDoctor = useCallback(
    async (data: DoctorProfileUpdate) => {
      return await updateDoctorProfile(data);
    },
    [updateDoctorProfile]
  );

  const updateClinic = useCallback(
    async (data: ClinicProfileUpdate) => {
      return await updateClinicProfile(data);
    },
    [updateClinicProfile]
  );

  const updateDiagnosticCenter = useCallback(
    async (data: DiagnosticCenterProfileUpdate) => {
      return await updateDiagnosticCenterProfile(data);
    },
    [updateDiagnosticCenterProfile]
  );

  const updateStaff = useCallback(
    async (data: StaffProfileUpdate) => {
      return await updateStaffProfile(data);
    },
    [updateStaffProfile]
  );

  // ==========================================================
  // FILE UPLOADS
  // ==========================================================

  const uploadPhoto = useCallback(
    async (file: File) => {
      return await uploadProfilePicture(file);
    },
    [uploadProfilePicture]
  );

  const uploadCover = useCallback(
    async (file: File) => {
      return await uploadCoverImage(file);
    },
    [uploadCoverImage]
  );

  const uploadLicense = useCallback(
    async (file: File) => {
      return await uploadLicenseDocument(file);
    },
    [uploadLicenseDocument]
  );

  const uploadRegistration = useCallback(
    async (file: File) => {
      return await uploadRegistrationDocument(file);
    },
    [uploadRegistrationDocument]
  );

  // ==========================================================
  // PASSWORD
  // ==========================================================

  const updatePassword = useCallback(
    async (data: ChangePasswordData) => {
      return await changePassword(data);
    },
    [changePassword]
  );

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const loadPatientStatistics = useCallback(async () => {
    await fetchPatientStatistics();
  }, [fetchPatientStatistics]);

  const loadDoctorStatistics = useCallback(async () => {
    await fetchDoctorStatistics();
  }, [fetchDoctorStatistics]);

  const loadClinicStatistics = useCallback(async () => {
    await fetchClinicStatistics();
  }, [fetchClinicStatistics]);

  const loadDiagnosticStatistics = useCallback(async () => {
    await fetchDiagnosticCenterStatistics();
  }, [fetchDiagnosticCenterStatistics]);

  // ==========================================================
  // ACCOUNT
  // ==========================================================

  const removeAccount = useCallback(async () => {
    return await deleteAccount();
  }, [deleteAccount]);

  const exportData = useCallback(async () => {
    await exportHealthData();
  }, [exportHealthData]);

  return {
    // State
    profile,
    statistics,

    loading,
    statisticsLoading,
    uploadLoading,
    passwordLoading,
    deleteLoading,

    error,

    // Profile
    loadProfile,

    loadPatientProfile,
    loadDoctorProfile,
    loadClinicProfile,
    loadDiagnosticCenterProfile,
    loadStaffProfile,

    // Updates
    updatePatient,
    updateDoctor,
    updateClinic,
    updateDiagnosticCenter,
    updateStaff,

    // Uploads
    uploadPhoto,
    uploadCover,
    uploadLicense,
    uploadRegistration,

    // Password
    updatePassword,

    // Statistics
    loadPatientStatistics,
    loadDoctorStatistics,
    loadClinicStatistics,
    loadDiagnosticStatistics,

    // Account
    removeAccount,
    exportData,

    // Utils
    clearProfile,
    clearError,
  };
};