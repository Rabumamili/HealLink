// stores/slices/profileSlice.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { profileService, ProfileRoleType } from '@/services/profile.service';
import {
  PatientProfile,
  DoctorProfile,
  ClinicProfile,
  DiagnosticCenterProfile,
  StaffProfile,
  PatientStatistics,
  DoctorStatistics,
  ClinicStatistics,
  DiagnosticCenterStatistics,
  StaffStatistics,
  Profile,
  PatientProfileUpdate,
  DoctorProfileUpdate,
  ClinicProfileUpdate,
  DiagnosticCenterProfileUpdate,
  StaffProfileUpdate,
  ChangePasswordData,
} from '@/types/entities/profile.types';

interface ProfileState {
  // Current profile data
  currentProfile: Profile | null;
  currentProfileType: ProfileRoleType | null;
  
  // Profile data by type
  patientProfile: PatientProfile | null;
  doctorProfile: DoctorProfile | null;
  clinicProfile: ClinicProfile | null;
  diagnosticCenterProfile: DiagnosticCenterProfile | null;
  staffProfile: StaffProfile | null;
  
  // Statistics
  patientStatistics: PatientStatistics | null;
  doctorStatistics: DoctorStatistics | null;
  clinicStatistics: ClinicStatistics | null;
  diagnosticCenterStatistics: DiagnosticCenterStatistics | null;
  staffStatistics: StaffStatistics | null;
  
  // Lists
  doctors: DoctorProfile[];
  clinics: ClinicProfile[];
  diagnosticCenters: DiagnosticCenterProfile[];
  staffMembers: StaffProfile[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
  isUploading: boolean;
  isDeleting: boolean;
  
  // Actions
  fetchMyProfile: () => Promise<void>;
  fetchProfileById: (userId: number, role: ProfileRoleType) => Promise<void>;
  
  // Patient actions
  fetchPatientProfile: (userId: number) => Promise<void>;
  updatePatientProfile: (userId: number, data: PatientProfileUpdate) => Promise<void>;
  fetchPatientStatistics: (userId: number) => Promise<void>;
  
  // Doctor actions
  fetchDoctorProfile: (userId: number) => Promise<void>;
  updateDoctorProfile: (userId: number, data: DoctorProfileUpdate) => Promise<void>;
  fetchDoctorStatistics: (userId: number) => Promise<void>;
  fetchAllDoctors: (params?: any) => Promise<void>;
  
  // Clinic actions
  fetchClinicProfile: (userId: number) => Promise<void>;
  updateClinicProfile: (userId: number, data: ClinicProfileUpdate) => Promise<void>;
  fetchClinicStatistics: (userId: number) => Promise<void>;
  fetchAllClinics: (params?: any) => Promise<void>;
  
  // Diagnostic Center actions
  fetchDiagnosticCenterProfile: (userId: number) => Promise<void>;
  updateDiagnosticCenterProfile: (userId: number, data: DiagnosticCenterProfileUpdate) => Promise<void>;
  fetchDiagnosticCenterStatistics: (userId: number) => Promise<void>;
  fetchAllDiagnosticCenters: (params?: any) => Promise<void>;
  
  // Staff actions
  fetchStaffProfile: (userId: number) => Promise<void>;
  updateStaffProfile: (userId: number, data: StaffProfileUpdate) => Promise<void>;
  fetchStaffStatistics: (userId: number) => Promise<void>;
  fetchStaffByEmployer: (employerId: number, employerType: string) => Promise<void>;
  
  // Photo actions
  uploadProfilePhoto: (userId: number, role: ProfileRoleType, file: File) => Promise<string | null>;
  deleteProfilePhoto: (userId: number, role: ProfileRoleType) => Promise<void>;
  
  // Document actions
  uploadLicenseDocument: (userId: number, role: 'doctor' | 'clinic' | 'diagnostic_center', file: File) => Promise<string | null>;
  uploadRegistrationDocument: (userId: number, role: 'clinic' | 'diagnostic_center', file: File) => Promise<string | null>;
  
  // Password & Verification
  changePassword: (data: ChangePasswordData) => Promise<boolean>;
  requestVerification: (userId: number, role: ProfileRoleType) => Promise<void>;
  
  // Account management
  deleteAccount: (userId: number, role: ProfileRoleType) => Promise<boolean>;
  
  // Utility actions
  clearProfile: () => void;
  clearError: () => void;
  setCurrentProfile: (profile: Profile, role?: ProfileRoleType) => void;
}

export const useProfileStore = create<ProfileState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentProfile: null,
      currentProfileType: null,
      patientProfile: null,
      doctorProfile: null,
      clinicProfile: null,
      diagnosticCenterProfile: null,
      staffProfile: null,
      patientStatistics: null,
      doctorStatistics: null,
      clinicStatistics: null,
      diagnosticCenterStatistics: null,
      staffStatistics: null,
      doctors: [],
      clinics: [],
      diagnosticCenters: [],
      staffMembers: [],
      isLoading: false,
      error: null,
      isUpdating: false,
      isUploading: false,
      isDeleting: false,

      // General Actions
      fetchMyProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await profileService.getMyProfile();
          if (response.success) {
            const profile = response.data;
            const profileType = getProfileRole(profile);
            set({ 
              currentProfile: profile,
              currentProfileType: profileType
            });
            
            // Also store in specific profile state
            if (profileType === 'patient') {
              set({ patientProfile: profile as PatientProfile });
            } else if (profileType === 'doctor') {
              set({ doctorProfile: profile as DoctorProfile });
            } else if (profileType === 'clinic') {
              set({ clinicProfile: profile as ClinicProfile });
            } else if (profileType === 'diagnostic_center') {
              set({ diagnosticCenterProfile: profile as DiagnosticCenterProfile });
            } else if (profileType === 'staff') {
              set({ staffProfile: profile as StaffProfile });
            }
          } else {
            set({ error: response.message || 'Failed to fetch profile' });
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchProfileById: async (userId: number, role: ProfileRoleType) => {
        set({ isLoading: true, error: null });
        try {
          const response = await profileService.getProfileById(userId, role);
          if (response.success) {
            const profile = response.data;
            set({ 
              currentProfile: profile,
              currentProfileType: role
            });
            
            // Also store in specific profile state based on role
            if (role === 'patient') {
              set({ patientProfile: profile as PatientProfile });
            } else if (role === 'doctor') {
              set({ doctorProfile: profile as DoctorProfile });
            } else if (role === 'clinic') {
              set({ clinicProfile: profile as ClinicProfile });
            } else if (role === 'diagnostic_center') {
              set({ diagnosticCenterProfile: profile as DiagnosticCenterProfile });
            } else if (role === 'staff') {
              set({ staffProfile: profile as StaffProfile });
            }
          } else {
            set({ error: response.message || 'Failed to fetch profile' });
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
        } finally {
          set({ isLoading: false });
        }
      },

      // Patient Actions
      fetchPatientProfile: async (userId: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await profileService.getPatientProfile(userId);
          if (response.success) {
            set({ patientProfile: response.data });
          } else {
            set({ error: response.message || 'Failed to fetch patient profile' });
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
        } finally {
          set({ isLoading: false });
        }
      },

      updatePatientProfile: async (userId: number, data: PatientProfileUpdate) => {
        set({ isUpdating: true, error: null });
        try {
          const response = await profileService.updatePatientProfile(userId, data);
          if (response.success) {
            set({ patientProfile: response.data });
          } else {
            set({ error: response.message || 'Failed to update patient profile' });
            throw new Error(response.message);
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
          throw error;
        } finally {
          set({ isUpdating: false });
        }
      },

      fetchPatientStatistics: async (userId: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await profileService.getPatientStatistics(userId);
          if (response.success) {
            set({ patientStatistics: response.data });
          } else {
            set({ error: response.message || 'Failed to fetch patient statistics' });
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
        } finally {
          set({ isLoading: false });
        }
      },

      // Doctor Actions
      fetchDoctorProfile: async (userId: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await profileService.getDoctorProfile(userId);
          if (response.success) {
            set({ doctorProfile: response.data });
          } else {
            set({ error: response.message || 'Failed to fetch doctor profile' });
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
        } finally {
          set({ isLoading: false });
        }
      },

      updateDoctorProfile: async (userId: number, data: DoctorProfileUpdate) => {
        set({ isUpdating: true, error: null });
        try {
          const response = await profileService.updateDoctorProfile(userId, data);
          if (response.success) {
            set({ doctorProfile: response.data });
          } else {
            set({ error: response.message || 'Failed to update doctor profile' });
            throw new Error(response.message);
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
          throw error;
        } finally {
          set({ isUpdating: false });
        }
      },

      fetchDoctorStatistics: async (userId: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await profileService.getDoctorStatistics(userId);
          if (response.success) {
            set({ doctorStatistics: response.data });
          } else {
            set({ error: response.message || 'Failed to fetch doctor statistics' });
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchAllDoctors: async (params?: any) => {
        set({ isLoading: true, error: null });
        try {
          const response = await profileService.getAllDoctors(params);
          if (response.success) {
            set({ doctors: response.data });
          } else {
            set({ error: response.message || 'Failed to fetch doctors' });
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
        } finally {
          set({ isLoading: false });
        }
      },

      // Clinic Actions
      fetchClinicProfile: async (userId: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await profileService.getClinicProfile(userId);
          if (response.success) {
            set({ clinicProfile: response.data });
          } else {
            set({ error: response.message || 'Failed to fetch clinic profile' });
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
        } finally {
          set({ isLoading: false });
        }
      },

      updateClinicProfile: async (userId: number, data: ClinicProfileUpdate) => {
        set({ isUpdating: true, error: null });
        try {
          const response = await profileService.updateClinicProfile(userId, data);
          if (response.success) {
            set({ clinicProfile: response.data });
          } else {
            set({ error: response.message || 'Failed to update clinic profile' });
            throw new Error(response.message);
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
          throw error;
        } finally {
          set({ isUpdating: false });
        }
      },

      fetchClinicStatistics: async (userId: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await profileService.getClinicStatistics(userId);
          if (response.success) {
            set({ clinicStatistics: response.data });
          } else {
            set({ error: response.message || 'Failed to fetch clinic statistics' });
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchAllClinics: async (params?: any) => {
        set({ isLoading: true, error: null });
        try {
          const response = await profileService.getAllClinics(params);
          if (response.success) {
            set({ clinics: response.data });
          } else {
            set({ error: response.message || 'Failed to fetch clinics' });
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
        } finally {
          set({ isLoading: false });
        }
      },

      // Diagnostic Center Actions
      fetchDiagnosticCenterProfile: async (userId: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await profileService.getDiagnosticCenterProfile(userId);
          if (response.success) {
            set({ diagnosticCenterProfile: response.data });
          } else {
            set({ error: response.message || 'Failed to fetch diagnostic center profile' });
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
        } finally {
          set({ isLoading: false });
        }
      },

      updateDiagnosticCenterProfile: async (userId: number, data: DiagnosticCenterProfileUpdate) => {
        set({ isUpdating: true, error: null });
        try {
          const response = await profileService.updateDiagnosticCenterProfile(userId, data);
          if (response.success) {
            set({ diagnosticCenterProfile: response.data });
          } else {
            set({ error: response.message || 'Failed to update diagnostic center profile' });
            throw new Error(response.message);
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
          throw error;
        } finally {
          set({ isUpdating: false });
        }
      },

      fetchDiagnosticCenterStatistics: async (userId: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await profileService.getDiagnosticCenterStatistics(userId);
          if (response.success) {
            set({ diagnosticCenterStatistics: response.data });
          } else {
            set({ error: response.message || 'Failed to fetch diagnostic center statistics' });
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchAllDiagnosticCenters: async (params?: any) => {
        set({ isLoading: true, error: null });
        try {
          const response = await profileService.getAllDiagnosticCenters(params);
          if (response.success) {
            set({ diagnosticCenters: response.data });
          } else {
            set({ error: response.message || 'Failed to fetch diagnostic centers' });
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
        } finally {
          set({ isLoading: false });
        }
      },

      // Staff Actions
      fetchStaffProfile: async (userId: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await profileService.getStaffProfile(userId);
          if (response.success) {
            set({ staffProfile: response.data });
          } else {
            set({ error: response.message || 'Failed to fetch staff profile' });
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
        } finally {
          set({ isLoading: false });
        }
      },

      updateStaffProfile: async (userId: number, data: StaffProfileUpdate) => {
        set({ isUpdating: true, error: null });
        try {
          const response = await profileService.updateStaffProfile(userId, data);
          if (response.success) {
            set({ staffProfile: response.data });
          } else {
            set({ error: response.message || 'Failed to update staff profile' });
            throw new Error(response.message);
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
          throw error;
        } finally {
          set({ isUpdating: false });
        }
      },

      fetchStaffStatistics: async (userId: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await profileService.getStaffStatistics(userId);
          if (response.success) {
            set({ staffStatistics: response.data });
          } else {
            set({ error: response.message || 'Failed to fetch staff statistics' });
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchStaffByEmployer: async (employerId: number, employerType: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await profileService.getStaffByEmployer(employerId, employerType);
          if (response.success) {
            set({ staffMembers: response.data });
          } else {
            set({ error: response.message || 'Failed to fetch staff members' });
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
        } finally {
          set({ isLoading: false });
        }
      },

      // Photo Actions
      uploadProfilePhoto: async (userId: number, role: ProfileRoleType, file: File) => {
        set({ isUploading: true, error: null });
        try {
          const response = await profileService.uploadProfilePhoto(userId, role, file);
          if (response.success) {
            return response.url;
          } else {
            set({ error: response.message || 'Failed to upload photo' });
            return null;
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
          return null;
        } finally {
          set({ isUploading: false });
        }
      },

      deleteProfilePhoto: async (userId: number, role: ProfileRoleType) => {
        set({ isUpdating: true, error: null });
        try {
          const response = await profileService.deleteProfilePhoto(userId, role);
          if (!response.success) {
            set({ error: response.message || 'Failed to delete photo' });
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
        } finally {
          set({ isUpdating: false });
        }
      },

      // Document Actions
      uploadLicenseDocument: async (userId: number, role: 'doctor' | 'clinic' | 'diagnostic_center', file: File) => {
        set({ isUploading: true, error: null });
        try {
          const response = await profileService.uploadLicenseDocument(userId, role, file);
          if (response.success) {
            return response.url;
          } else {
            set({ error: response.message || 'Failed to upload license document' });
            return null;
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
          return null;
        } finally {
          set({ isUploading: false });
        }
      },

      uploadRegistrationDocument: async (userId: number, role: 'clinic' | 'diagnostic_center', file: File) => {
        set({ isUploading: true, error: null });
        try {
          const response = await profileService.uploadRegistrationDocument(userId, role, file);
          if (response.success) {
            return response.url;
          } else {
            set({ error: response.message || 'Failed to upload registration document' });
            return null;
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
          return null;
        } finally {
          set({ isUploading: false });
        }
      },

      // Password & Verification
      changePassword: async (data: ChangePasswordData) => {
        set({ isUpdating: true, error: null });
        try {
          const response = await profileService.changePassword(data);
          if (response.success) {
            return true;
          } else {
            set({ error: response.message || 'Failed to change password' });
            return false;
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
          return false;
        } finally {
          set({ isUpdating: false });
        }
      },

      requestVerification: async (userId: number, role: ProfileRoleType) => {
        set({ isUpdating: true, error: null });
        try {
          const response = await profileService.requestVerification(userId, role);
          if (!response.success) {
            set({ error: response.message || 'Failed to request verification' });
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
        } finally {
          set({ isUpdating: false });
        }
      },

      // Account Management
      deleteAccount: async (userId: number, role: ProfileRoleType) => {
        set({ isDeleting: true, error: null });
        try {
          const response = await profileService.deleteAccount(userId, role);
          if (response.success) {
            // Clear all profile data
            set({
              currentProfile: null,
              currentProfileType: null,
              patientProfile: null,
              doctorProfile: null,
              clinicProfile: null,
              diagnosticCenterProfile: null,
              staffProfile: null,
              patientStatistics: null,
              doctorStatistics: null,
              clinicStatistics: null,
              diagnosticCenterStatistics: null,
              staffStatistics: null,
            });
            return true;
          } else {
            set({ error: response.message || 'Failed to delete account' });
            return false;
          }
        } catch (error: any) {
          set({ error: error.message || 'An error occurred' });
          return false;
        } finally {
          set({ isDeleting: false });
        }
      },

      // Utility Actions
      clearProfile: () => {
        set({
          currentProfile: null,
          currentProfileType: null,
          patientProfile: null,
          doctorProfile: null,
          clinicProfile: null,
          diagnosticCenterProfile: null,
          staffProfile: null,
          patientStatistics: null,
          doctorStatistics: null,
          clinicStatistics: null,
          diagnosticCenterStatistics: null,
          staffStatistics: null,
          doctors: [],
          clinics: [],
          diagnosticCenters: [],
          staffMembers: [],
          error: null,
        });
      },

      clearError: () => set({ error: null }),

      setCurrentProfile: (profile: Profile, role?: ProfileRoleType) => {
        const profileType = role || getProfileRole(profile);
        set({ 
          currentProfile: profile,
          currentProfileType: profileType 
        });
      },
    }),
    { name: 'profile-store' }
  )
);

// Helper function to get profile role
function getProfileRole(profile: Profile): ProfileRoleType {
  // For staff profile
  if ('staff_sub_role' in profile && profile.staff_sub_role) {
    return 'staff';
  }
  
  // For all other profiles, use the role property
  if ('role' in profile && profile.role) {
    return profile.role as ProfileRoleType;
  }
  
  return 'patient'; // fallback
}