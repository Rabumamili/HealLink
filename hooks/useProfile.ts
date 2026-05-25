// hooks/useProfile.ts
import { useAppDispatch, useAppSelector } from './redux';
import {
  fetchPatientProfile,
  fetchDoctorProfile,
  fetchClinicProfile,
  fetchDiagnosticCenterProfile,
  updatePatientProfile,
  updateDoctorProfile,
  updateClinicProfile,
  updateDiagnosticCenterProfile,
  fetchPatientStatistics,
  fetchDoctorStatistics,
  fetchClinicStatistics,
  fetchDiagnosticCenterStatistics,
  addAllergy,
  removeAllergy,
  addChronicCondition,
  removeChronicCondition,
  addMedication,
  removeMedication,
  uploadProfilePicture,
  uploadCoverImage,
  uploadLicenseDocument,
  uploadRegistrationDocument,
  changePassword,
  deleteAccount,
  clearProfileError,
  clearUpdateSuccess,
  clearPasswordChangeSuccess,
  resetProfileState,
} from '@/stores/slices/profileSlice';
import {
  PatientProfileUpdate,
  DoctorProfileUpdate,
  ClinicProfileUpdate,
  DiagnosticCenterProfileUpdate,
  ChangePasswordData,
} from '@/types/entities/profile.types';
import { UserRole } from '@/types/entities/auth.types';

export const useProfile = () => {
  const dispatch = useAppDispatch();
  
  // Use useAppSelector with proper typing
  const profileState = useAppSelector((state) => state.profile);
  const authUser = useAppSelector((state) => state.auth.user);

  // Helper to determine which profile to fetch based on user role
  const fetchProfileByRole = (role?: UserRole) => {
    const userRole = role || authUser?.role;
    if (!userRole) return Promise.reject('No role specified');
    
    switch (userRole) {
      case 'patient':
        return dispatch(fetchPatientProfile());
      case 'doctor':
        return dispatch(fetchDoctorProfile());
      case 'clinic':
        return dispatch(fetchClinicProfile());
      case 'diagnostic_center':
        return dispatch(fetchDiagnosticCenterProfile());
      default:
        return Promise.reject(`Invalid role: ${userRole}`);
    }
  };

  // Helper to update profile based on role
  const updateProfileByRole = (
    data: PatientProfileUpdate | DoctorProfileUpdate | ClinicProfileUpdate | DiagnosticCenterProfileUpdate
  ) => {
    const role = authUser?.role;
    
    switch (role) {
      case 'patient':
        return dispatch(updatePatientProfile(data as PatientProfileUpdate));
      case 'doctor':
        return dispatch(updateDoctorProfile(data as DoctorProfileUpdate));
      case 'clinic':
        return dispatch(updateClinicProfile(data as ClinicProfileUpdate));
      case 'diagnostic_center':
        return dispatch(updateDiagnosticCenterProfile(data as DiagnosticCenterProfileUpdate));
      default:
        return Promise.reject('No role found');
    }
  };

  // Helper to fetch statistics based on role
  const fetchStatisticsByRole = () => {
    const role = authUser?.role;
    
    switch (role) {
      case 'patient':
        return dispatch(fetchPatientStatistics());
      case 'doctor':
        return dispatch(fetchDoctorStatistics());
      case 'clinic':
        return dispatch(fetchClinicStatistics());
      case 'diagnostic_center':
        return dispatch(fetchDiagnosticCenterStatistics());
      default:
        return Promise.reject('No role found');
    }
  };

  // Get display name helper
  const getDisplayName = (): string => {
    const profile = profileState.profile;
    if (!profile) return '';
    
    if ('first_name' in profile && profile.first_name) {
      const lastName = 'last_name' in profile ? profile.last_name : '';
      return `${profile.first_name} ${lastName || ''}`.trim();
    }
    if ('name' in profile && profile.name) {
      return profile.name;
    }
    if ('full_name' in profile && profile.full_name) {
      return profile.full_name;
    }
    return '';
  };

  // Check if profile is individual (has first_name)
  const isIndividual = (): boolean => {
    const profile = profileState.profile;
    return profile !== null && 'first_name' in profile;
  };

  // Check if profile is organization (has name)
  const isOrganization = (): boolean => {
    const profile = profileState.profile;
    return profile !== null && 'name' in profile;
  };

  return {
    // State
    profile: profileState.profile,
    role: profileState.role,
    isLoading: profileState.isLoading,
    error: profileState.error,
    updateSuccess: profileState.updateSuccess,
    patientStats: profileState.patientStats,
    doctorStats: profileState.doctorStats,
    clinicStats: profileState.clinicStats,
    diagnosticCenterStats: profileState.diagnosticCenterStats,
    isUploading: profileState.isUploading,
    uploadProgress: profileState.uploadProgress,
    isChangingPassword: profileState.isChangingPassword,
    passwordChangeSuccess: profileState.passwordChangeSuccess,
    
    // Profile fetching
    fetchProfileByRole,
    fetchPatientProfile: () => dispatch(fetchPatientProfile()),
    fetchDoctorProfile: () => dispatch(fetchDoctorProfile()),
    fetchClinicProfile: () => dispatch(fetchClinicProfile()),
    fetchDiagnosticCenterProfile: () => dispatch(fetchDiagnosticCenterProfile()),
    
    // Profile updates
    updateProfileByRole,
    updatePatientProfile: (data: PatientProfileUpdate) => dispatch(updatePatientProfile(data)),
    updateDoctorProfile: (data: DoctorProfileUpdate) => dispatch(updateDoctorProfile(data)),
    updateClinicProfile: (data: ClinicProfileUpdate) => dispatch(updateClinicProfile(data)),
    updateDiagnosticCenterProfile: (data: DiagnosticCenterProfileUpdate) => 
      dispatch(updateDiagnosticCenterProfile(data)),
    
    // Statistics
    fetchStatisticsByRole,
    fetchPatientStatistics: () => dispatch(fetchPatientStatistics()),
    fetchDoctorStatistics: () => dispatch(fetchDoctorStatistics()),
    fetchClinicStatistics: () => dispatch(fetchClinicStatistics()),
    fetchDiagnosticCenterStatistics: () => dispatch(fetchDiagnosticCenterStatistics()),
    
    // Medical history (patient specific)
    addAllergy: (allergy: string) => dispatch(addAllergy(allergy)),
    removeAllergy: (allergy: string) => dispatch(removeAllergy(allergy)),
    addChronicCondition: (condition: string) => dispatch(addChronicCondition(condition)),
    removeChronicCondition: (condition: string) => dispatch(removeChronicCondition(condition)),
    addMedication: (medication: string) => dispatch(addMedication(medication)),
    removeMedication: (medication: string) => dispatch(removeMedication(medication)),
    
    // File uploads
    uploadProfilePicture: (file: File) => dispatch(uploadProfilePicture(file)),
    uploadCoverImage: (file: File) => dispatch(uploadCoverImage(file)),
    uploadLicenseDocument: (file: File) => dispatch(uploadLicenseDocument(file)),
    uploadRegistrationDocument: (file: File) => dispatch(uploadRegistrationDocument(file)),
    
    // Password and account
    changePassword: (data: ChangePasswordData) => dispatch(changePassword(data)),
    deleteAccount: () => dispatch(deleteAccount()),
    
    // Utility
    clearProfileError: () => dispatch(clearProfileError()),
    clearUpdateSuccess: () => dispatch(clearUpdateSuccess()),
    clearPasswordChangeSuccess: () => dispatch(clearPasswordChangeSuccess()),
    resetProfileState: () => dispatch(resetProfileState()),
    
    // Helper methods
    getDisplayName,
    isIndividual,
    isOrganization,
  };
};