// stores/slices/profile.slice.ts

import { create } from 'zustand';
import { toast } from 'sonner';

import { profileService } from '@/services/profile.service';

import {
  PatientProfile,
  PatientProfileUpdate,
  DoctorProfile,
  DoctorProfileUpdate,
  ClinicProfile,
  ClinicProfileUpdate,
  DiagnosticCenterProfile,
  DiagnosticCenterProfileUpdate,
  StaffProfile,
  StaffProfileUpdate,
  ChangePasswordData,
  PatientStatistics,
  DoctorStatistics,
  ClinicStatistics,
  DiagnosticCenterStatistics,
} from '@/types/entities/profile.types';

import { UserRole } from '@/types/entities/auth.types';

type Profile =
  | PatientProfile
  | DoctorProfile
  | ClinicProfile
  | DiagnosticCenterProfile
  | StaffProfile;

type Statistics =
  | PatientStatistics
  | DoctorStatistics
  | ClinicStatistics
  | DiagnosticCenterStatistics;

interface ProfileState {
  profile: Profile | null;
  statistics: Statistics | null;

  loading: boolean;
  statisticsLoading: boolean;
  uploadLoading: boolean;
  passwordLoading: boolean;
  deleteLoading: boolean;

  error: string | null;

  // Profile
  fetchProfile: (role: UserRole) => Promise<void>;

  fetchPatientProfile: () => Promise<void>;
  fetchDoctorProfile: () => Promise<void>;
  fetchClinicProfile: () => Promise<void>;
  fetchDiagnosticCenterProfile: () => Promise<void>;
  fetchStaffProfile: () => Promise<void>;

  updatePatientProfile: (
    data: PatientProfileUpdate
  ) => Promise<PatientProfile | null>;

  updateDoctorProfile: (
    data: DoctorProfileUpdate
  ) => Promise<DoctorProfile | null>;

  updateClinicProfile: (
    data: ClinicProfileUpdate
  ) => Promise<ClinicProfile | null>;

  updateDiagnosticCenterProfile: (
    data: DiagnosticCenterProfileUpdate
  ) => Promise<DiagnosticCenterProfile | null>;

  updateStaffProfile: (
    data: StaffProfileUpdate
  ) => Promise<StaffProfile | null>;

  // Uploads
  uploadProfilePicture: (file: File) => Promise<string | null>;
  uploadCoverImage: (file: File) => Promise<string | null>;
  uploadLicenseDocument: (file: File) => Promise<string | null>;
  uploadRegistrationDocument: (file: File) => Promise<string | null>;

  // Password
  changePassword: (
    data: ChangePasswordData
  ) => Promise<boolean>;

  // Statistics
  fetchPatientStatistics: () => Promise<void>;
  fetchDoctorStatistics: () => Promise<void>;
  fetchClinicStatistics: () => Promise<void>;
  fetchDiagnosticCenterStatistics: () => Promise<void>;

  // Account
  deleteAccount: () => Promise<boolean>;

  // Export
  exportHealthData: () => Promise<void>;

  // Utils
  clearProfile: () => void;
  clearError: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  statistics: null,

  loading: false,
  statisticsLoading: false,
  uploadLoading: false,
  passwordLoading: false,
  deleteLoading: false,

  error: null,

  clearError: () => set({ error: null }),

  clearProfile: () =>
    set({
      profile: null,
      statistics: null,
      error: null,
    }),

  // ==========================================================
  // FETCH PROFILE BY ROLE
  // ==========================================================
  fetchProfile: async (role) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const profile = await profileService.getProfileByRole(role);

      set({
        profile,
        loading: false,
      });
    } catch (error: any) {
      const message =
        error?.message || 'Failed to load profile';

      set({
        error: message,
        loading: false,
      });

      toast.error(message);
    }
  },

  // ==========================================================
  // PATIENT
  // ==========================================================
  fetchPatientProfile: async () => {
    try {
      set({ loading: true, error: null });

      const profile =
        await profileService.getPatientProfile();

      set({
        profile,
        loading: false,
      });
    } catch (error: any) {
      const message =
        error?.message || 'Failed to load profile';

      set({
        loading: false,
        error: message,
      });

      toast.error(message);
    }
  },

  updatePatientProfile: async (data) => {
    try {
      set({ loading: true });

      const updated =
        await profileService.updatePatientProfile(data);

      set({
        profile: updated,
        loading: false,
      });

      toast.success('Profile updated successfully');

      return updated;
    } catch (error: any) {
      const message =
        error?.message || 'Failed to update profile';

      set({
        loading: false,
        error: message,
      });

      toast.error(message);

      return null;
    }
  },

  // ==========================================================
  // DOCTOR
  // ==========================================================
  fetchDoctorProfile: async () => {
    try {
      set({ loading: true, error: null });

      const profile =
        await profileService.getDoctorProfile();

      set({
        profile,
        loading: false,
      });
    } catch (error: any) {
      const message =
        error?.message || 'Failed to load profile';

      set({
        loading: false,
        error: message,
      });

      toast.error(message);
    }
  },

  updateDoctorProfile: async (data) => {
    try {
      set({ loading: true });

      const updated =
        await profileService.updateDoctorProfile(data);

      set({
        profile: updated,
        loading: false,
      });

      toast.success('Profile updated successfully');

      return updated;
    } catch (error: any) {
      const message =
        error?.message || 'Failed to update profile';

      set({
        loading: false,
        error: message,
      });

      toast.error(message);

      return null;
    }
  },

  // ==========================================================
  // CLINIC
  // ==========================================================
  fetchClinicProfile: async () => {
    try {
      set({ loading: true, error: null });

      const profile =
        await profileService.getClinicProfile();

      set({
        profile,
        loading: false,
      });
    } catch (error: any) {
      const message =
        error?.message || 'Failed to load profile';

      set({
        loading: false,
        error: message,
      });

      toast.error(message);
    }
  },

  updateClinicProfile: async (data) => {
    try {
      set({ loading: true });

      const updated =
        await profileService.updateClinicProfile(data);

      set({
        profile: updated,
        loading: false,
      });

      toast.success('Profile updated successfully');

      return updated;
    } catch (error: any) {
      const message =
        error?.message || 'Failed to update profile';

      set({
        loading: false,
        error: message,
      });

      toast.error(message);

      return null;
    }
  },

  // ==========================================================
  // DIAGNOSTIC CENTER
  // ==========================================================
  fetchDiagnosticCenterProfile: async () => {
    try {
      set({ loading: true, error: null });

      const profile =
        await profileService.getDiagnosticCenterProfile();

      set({
        profile,
        loading: false,
      });
    } catch (error: any) {
      const message =
        error?.message || 'Failed to load profile';

      set({
        loading: false,
        error: message,
      });

      toast.error(message);
    }
  },

  updateDiagnosticCenterProfile: async (data) => {
    try {
      set({ loading: true });

      const updated =
        await profileService.updateDiagnosticCenterProfile(data);

      set({
        profile: updated,
        loading: false,
      });

      toast.success('Profile updated successfully');

      return updated;
    } catch (error: any) {
      const message =
        error?.message || 'Failed to update profile';

      set({
        loading: false,
        error: message,
      });

      toast.error(message);

      return null;
    }
  },

  // ==========================================================
  // STAFF
  // ==========================================================
  fetchStaffProfile: async () => {
    try {
      set({ loading: true, error: null });

      const profile =
        await profileService.getStaffProfile();

      set({
        profile,
        loading: false,
      });
    } catch (error: any) {
      const message =
        error?.message || 'Failed to load profile';

      set({
        loading: false,
        error: message,
      });

      toast.error(message);
    }
  },

  updateStaffProfile: async (data) => {
    try {
      set({ loading: true });

      const updated =
        await profileService.updateStaffProfile(data);

      set({
        profile: updated,
        loading: false,
      });

      toast.success('Profile updated successfully');

      return updated;
    } catch (error: any) {
      const message =
        error?.message || 'Failed to update profile';

      set({
        loading: false,
        error: message,
      });

      toast.error(message);

      return null;
    }
  },

  // ==========================================================
  // FILE UPLOADS
  // ==========================================================
  uploadProfilePicture: async (file) => {
    try {
      set({ uploadLoading: true });

      const result =
        await profileService.uploadProfilePicture(file);

      set({ uploadLoading: false });

      toast.success('Profile picture uploaded');

      return result.url ?? null;
    } catch (error: any) {
      set({ uploadLoading: false });

      toast.error(
        error?.message || 'Upload failed'
      );

      return null;
    }
  },

  uploadCoverImage: async (file) => {
    try {
      set({ uploadLoading: true });

      const result =
        await profileService.uploadCoverImage(file);

      set({ uploadLoading: false });

      toast.success('Cover image uploaded');

      return result.url ?? null;
    } catch (error: any) {
      set({ uploadLoading: false });

      toast.error(
        error?.message || 'Upload failed'
      );

      return null;
    }
  },

  uploadLicenseDocument: async (file) => {
    try {
      set({ uploadLoading: true });

      const result =
        await profileService.uploadLicenseDocument(file);

      set({ uploadLoading: false });

      toast.success('License uploaded');

      return result.url ?? null;
    } catch (error: any) {
      set({ uploadLoading: false });

      toast.error(
        error?.message || 'Upload failed'
      );

      return null;
    }
  },

  uploadRegistrationDocument: async (file) => {
    try {
      set({ uploadLoading: true });

      const result =
        await profileService.uploadRegistrationDocument(file);

      set({ uploadLoading: false });

      toast.success('Registration uploaded');

      return result.url ?? null;
    } catch (error: any) {
      set({ uploadLoading: false });

      toast.error(
        error?.message || 'Upload failed'
      );

      return null;
    }
  },

  // ==========================================================
  // PASSWORD
  // ==========================================================
  changePassword: async (data) => {
    try {
      set({ passwordLoading: true });

      await profileService.changePassword(data);

      set({ passwordLoading: false });

      toast.success('Password changed successfully');

      return true;
    } catch (error: any) {
      set({ passwordLoading: false });

      toast.error(
        error?.message || 'Failed to change password'
      );

      return false;
    }
  },

  // ==========================================================
  // STATISTICS
  // ==========================================================
  fetchPatientStatistics: async () => {
    try {
      set({ statisticsLoading: true });

      const statistics =
        await profileService.getPatientStatistics();

      set({
        statistics,
        statisticsLoading: false,
      });
    } catch (error: any) {
      set({ statisticsLoading: false });

      toast.error(
        error?.message || 'Failed to load statistics'
      );
    }
  },

  fetchDoctorStatistics: async () => {
    try {
      set({ statisticsLoading: true });

      const statistics =
        await profileService.getDoctorStatistics();

      set({
        statistics,
        statisticsLoading: false,
      });
    } catch (error: any) {
      set({ statisticsLoading: false });

      toast.error(
        error?.message || 'Failed to load statistics'
      );
    }
  },

  fetchClinicStatistics: async () => {
    try {
      set({ statisticsLoading: true });

      const statistics =
        await profileService.getClinicStatistics();

      set({
        statistics,
        statisticsLoading: false,
      });
    } catch (error: any) {
      set({ statisticsLoading: false });

      toast.error(
        error?.message || 'Failed to load statistics'
      );
    }
  },

  fetchDiagnosticCenterStatistics: async () => {
    try {
      set({ statisticsLoading: true });

      const statistics =
        await profileService.getDiagnosticCenterStatistics();

      set({
        statistics,
        statisticsLoading: false,
      });
    } catch (error: any) {
      set({ statisticsLoading: false });

      toast.error(
        error?.message || 'Failed to load statistics'
      );
    }
  },

  // ==========================================================
  // DELETE ACCOUNT
  // ==========================================================
  deleteAccount: async () => {
    try {
      set({ deleteLoading: true });

      await profileService.deleteAccount();

      set({
        deleteLoading: false,
        profile: null,
        statistics: null,
      });

      toast.success('Account deleted');

      return true;
    } catch (error: any) {
      set({ deleteLoading: false });

      toast.error(
        error?.message || 'Failed to delete account'
      );

      return false;
    }
  },

  // ==========================================================
  // EXPORT
  // ==========================================================
  exportHealthData: async () => {
    try {
      const blob =
        await profileService.exportHealthData();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement('a');

      link.href = url;
      link.download = 'health-data.zip';

      document.body.appendChild(link);
      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success('Export started');
    } catch (error: any) {
      toast.error(
        error?.message || 'Export failed'
      );
    }
  },
}));