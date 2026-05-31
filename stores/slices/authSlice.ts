// stores/slices/authSlice.ts
import { create } from 'zustand';
import { devtools, persist, PersistOptions } from 'zustand/middleware';
import { authService } from '@/services/auth.service';
import {
  AuthUser,
  LoginCredentials,
  UserRegisterData,
  DoctorRegisterData,
  ClinicRegisterData,
  DiagnosticCenterRegisterData,
  StaffRegisterData,
  StaffSubRole,
  VerifyEmailData,
  ResendVerificationData,
  ForgotPasswordData,
  ResetPasswordData,
  ProfessionalVerificationSubmitData,
} from '@/types/entities/auth.types';

interface StaffRegistrationResponse {
  message: string;
  staff_id: number;
  email: string;
}

interface MessageResponse {
  message: string;
}

interface VerificationStatusResponse {
  status: string;
  rejection_reason?: string;
}

interface AuthState {
  // State
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  registerUser: (data: UserRegisterData) => Promise<void>;
  registerDoctor: (data: DoctorRegisterData) => Promise<void>;
  registerClinic: (data: ClinicRegisterData) => Promise<void>;
  registerDiagnosticCenter: (data: DiagnosticCenterRegisterData) => Promise<void>;
  registerStaff: (data: StaffRegisterData) => Promise<StaffRegistrationResponse>;
  completeStaffRegistration: (token: string, password: string, confirmPassword: string) => Promise<void>;
  resendStaffInvitation: (email: string) => Promise<MessageResponse>;
  verifyEmail: (data: VerifyEmailData) => Promise<void>;
  resendVerificationCode: (data: ResendVerificationData) => Promise<void>;
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  getCurrentUser: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  clearError: () => void;
  initialize: () => Promise<void>;
  
  // Professional verification actions
  submitProfessionalVerification: (data: ProfessionalVerificationSubmitData) => Promise<void>;
  getProfessionalVerificationStatus: () => Promise<VerificationStatusResponse>;
  
  // Staff management actions
  getStaffMembers: (employerId: number, employerType: string) => Promise<AuthUser[]>;
  updateStaffRole: (staffId: number, role: StaffSubRole) => Promise<AuthUser>;
  deactivateStaff: (staffId: number) => Promise<MessageResponse>;
  activateStaff: (staffId: number) => Promise<MessageResponse>;
  deleteStaff: (staffId: number) => Promise<MessageResponse>;
}

type AuthPersist = Pick<AuthState, 'user' | 'isInitialized'>;

const persistOptions: PersistOptions<AuthState, AuthPersist> = {
  name: 'auth-storage',
  storage: {
    getItem: (name) => {
      if (typeof window === 'undefined') return null;
      const value = localStorage.getItem(name);
      if (!value) return null;
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      if (typeof window === 'undefined') return;
      localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name) => {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(name);
    },
  },
  partialize: (state) => ({ 
    user: state.user,
    isInitialized: state.isInitialized 
  }),
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isLoading: false,
        error: null,
        isInitialized: false,

        initialize: async () => {
          if (get().isInitialized) return;
          
          set({ isLoading: true });
          try {
            if (authService.isAuthenticated()) {
              const user = await authService.getCurrentUser();
              set({ user, isInitialized: true, error: null });
            } else {
              set({ isInitialized: true });
            }
          } catch (error) {
            console.error('Failed to initialize auth:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            set({ user: null, isInitialized: true });
          } finally {
            set({ isLoading: false });
          }
        },

        login: async (credentials) => {
          set({ isLoading: true, error: null });
          try {
            const response = await authService.login(credentials);
            set({ user: response.user, error: null });
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Login failed';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        logout: async () => {
          set({ isLoading: true });
          try {
            await authService.logout();
          } catch (error) {
            console.error('Logout error:', error);
          } finally {
            set({ user: null, error: null, isLoading: false });
          }
        },

        registerUser: async (data) => {
          set({ isLoading: true, error: null });
          try {
            const response = await authService.registerUser(data);
            set({ user: response.user, error: null });
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        registerDoctor: async (data) => {
          set({ isLoading: true, error: null });
          try {
            const response = await authService.registerDoctor(data);
            set({ user: response.user, error: null });
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Doctor registration failed';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        registerClinic: async (data) => {
          set({ isLoading: true, error: null });
          try {
            const response = await authService.registerClinic(data);
            set({ user: response.user, error: null });
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Clinic registration failed';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        registerDiagnosticCenter: async (data) => {
          set({ isLoading: true, error: null });
          try {
            const response = await authService.registerDiagnosticCenter(data);
            set({ user: response.user, error: null });
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Diagnostic center registration failed';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        registerStaff: async (data: StaffRegisterData): Promise<StaffRegistrationResponse> => {
          set({ isLoading: true, error: null });
          try {
            const response = await authService.registerStaff(data);
            set({ error: null });
            return response;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Staff registration failed';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        completeStaffRegistration: async (token, password, confirmPassword) => {
          set({ isLoading: true, error: null });
          try {
            const response = await authService.completeStaffRegistration(token, password, confirmPassword);
            set({ user: response.user, error: null });
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Staff registration completion failed';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        resendStaffInvitation: async (email): Promise<MessageResponse> => {
          set({ isLoading: true, error: null });
          try {
            const response = await authService.resendStaffInvitation(email);
            set({ error: null });
            return response;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to resend invitation';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        submitProfessionalVerification: async (data: ProfessionalVerificationSubmitData) => {
          set({ isLoading: true, error: null });
          try {
            await authService.submitProfessionalVerification(data);
            await get().getCurrentUser();
            set({ error: null });
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Professional verification submission failed';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        getProfessionalVerificationStatus: async (): Promise<VerificationStatusResponse> => {
          set({ isLoading: true, error: null });
          try {
            const status = await authService.getProfessionalVerificationStatus();
            set({ error: null });
            return status;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch verification status';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        verifyEmail: async (data) => {
          set({ isLoading: true, error: null });
          try {
            await authService.verifyEmail(data);
            await get().getCurrentUser();
            set({ error: null });
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Email verification failed';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        resendVerificationCode: async (data) => {
          set({ isLoading: true, error: null });
          try {
            await authService.resendVerificationCode(data);
            set({ error: null });
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to resend verification code';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        forgotPassword: async (data) => {
          set({ isLoading: true, error: null });
          try {
            await authService.forgotPassword(data);
            set({ error: null });
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to send reset password email';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        resetPassword: async (data) => {
          set({ isLoading: true, error: null });
          try {
            await authService.resetPassword(data);
            set({ error: null });
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Password reset failed';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        getCurrentUser: async () => {
          set({ isLoading: true, error: null });
          try {
            const user = await authService.getCurrentUser();
            set({ user, error: null });
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch user data';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        updateProfile: async (data) => {
          set({ isLoading: true, error: null });
          try {
            const updatedUser = await authService.updateProfile(data);
            set({ user: updatedUser, error: null });
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        changePassword: async (oldPassword, newPassword) => {
          set({ isLoading: true, error: null });
          try {
            await authService.changePassword(oldPassword, newPassword);
            set({ error: null });
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Password change failed';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        getStaffMembers: async (employerId, employerType): Promise<AuthUser[]> => {
          set({ isLoading: true, error: null });
          try {
            const staff = await authService.getStaffMembers(employerId, employerType);
            set({ error: null });
            return staff;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch staff members';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        updateStaffRole: async (staffId, role): Promise<AuthUser> => {
          set({ isLoading: true, error: null });
          try {
            const updatedStaff = await authService.updateStaffRole(staffId, role);
            set({ error: null });
            return updatedStaff;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update staff role';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        deactivateStaff: async (staffId): Promise<MessageResponse> => {
          set({ isLoading: true, error: null });
          try {
            const response = await authService.deactivateStaff(staffId);
            set({ error: null });
            return response;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to deactivate staff';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        activateStaff: async (staffId): Promise<MessageResponse> => {
          set({ isLoading: true, error: null });
          try {
            const response = await authService.activateStaff(staffId);
            set({ error: null });
            return response;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to activate staff';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        deleteStaff: async (staffId): Promise<MessageResponse> => {
          set({ isLoading: true, error: null });
          try {
            const response = await authService.deleteStaff(staffId);
            set({ error: null });
            return response;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete staff';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        clearError: () => {
          set({ error: null });
        },
      }),
      persistOptions
    ),
    { name: 'AuthStore' }
  )
);