// store/slices/authSlice.ts
import { StateCreator } from 'zustand';
import { AuthUser, ProfessionalVerificationStatus } from '@/types/entities/auth.types';

export interface AuthState {
  // State
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingIn: boolean;
  isRegistering: boolean;
  isVerifyingEmail: boolean;
  isResettingPassword: boolean;
  isSendingResetLink: boolean;
  error: string | null;
  
  // Professional verification
  professionalVerificationStatus: {
    status: string;
    submittedAt?: string;
    approvedAt?: string;
    rejectionReason?: string;
  } | null;
  
  // Actions
  setUser: (user: AuthUser | null) => void;
  setTokens: (token: string | null, refreshToken: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  
  // Async actions
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  registerUser: (data: any) => Promise<any>;
  registerProvider: (formData: FormData, role: string) => Promise<any>;
  registerStaff: (data: any) => Promise<any>;
  verifyEmail: (data: { email: string; code: string; tempUserId?: string }) => Promise<any>;
  resendVerificationCode: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string, confirmPassword: string) => Promise<void>;
  refreshTokenRequest: () => Promise<void>;
  getMe: () => Promise<void>;
  
  // Professional verification actions
  checkProfessionalVerification: () => Promise<void>;
  submitProfessionalVerification: (formData: FormData) => Promise<void>;
  canAccessDashboard: () => boolean;
  
  // Helper methods
  getUserDisplayName: () => string;
  getUserInitials: () => string;
  isProvider: () => boolean;
  isPatient: () => boolean;
  isStaff: () => boolean;
  requiresProfessionalVerification: () => boolean;
  isProfessionalVerificationPending: () => boolean;
  isProfessionalVerificationApproved: () => boolean;
}
const toProfessionalVerificationStatus = (status: string | undefined): ProfessionalVerificationStatus | undefined => {
  if (!status) return undefined;
  const validStatuses: ProfessionalVerificationStatus[] = ['pending', 'approved', 'rejected'];
  return validStatuses.includes(status as ProfessionalVerificationStatus) 
    ? status as ProfessionalVerificationStatus 
    : undefined;
};

export const createAuthSlice: StateCreator<AuthState> = (set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  isLoggingIn: false,
  isRegistering: false,
  isVerifyingEmail: false,
  isResettingPassword: false,
  isSendingResetLink: false,
  error: null,
  professionalVerificationStatus: null,

  // Basic actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setTokens: (token, refreshToken) => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken || '');
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
    set({ token, refreshToken });
  },
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      error: null,
      professionalVerificationStatus: null,
    });
  },

  // Login
  login: async (credentials) => {
    set({ isLoggingIn: true, error: null });
    try {
      const { authService } = await import('@/services/auth.service');
      const response = await authService.login(credentials);
      
      // Convert the verification status to the correct type
      const userWithCorrectStatus = {
        ...response.user,
        professional_verification_status: toProfessionalVerificationStatus(response.user.professional_verification_status)
      };
      
      localStorage.setItem('user', JSON.stringify(userWithCorrectStatus));
      
      set({
        user: userWithCorrectStatus,
        token: response.token,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoggingIn: false,
      });
      
      // Check professional verification status for providers
      if (response.user.role === 'doctor' || 
          response.user.role === 'clinic' || 
          response.user.role === 'diagnostic_center') {
        await get().checkProfessionalVerification();
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoggingIn: false,
      });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      const { authService } = await import('@/services/auth.service');
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      get().clearAuth();
    }
  },

  // Register User (Patient)
  registerUser: async (data) => {
    set({ isRegistering: true, error: null });
    try {
      const { authService } = await import('@/services/auth.service');
      const response = await authService.registerUser(data);
      set({ isRegistering: false });
      return response;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Registration failed',
        isRegistering: false,
      });
      throw error;
    }
  },

  // Register Provider
  registerProvider: async (formData, role) => {
    set({ isRegistering: true, error: null });
    try {
      const { authService } = await import('@/services/auth.service');
      let response;
      
      switch (role) {
        case 'doctor':
          response = await authService.registerDoctorWithFiles(formData);
          break;
        case 'clinic':
          response = await authService.registerClinicWithFiles(formData);
          break;
        case 'diagnostic_center':
          response = await authService.registerDiagnosticCenterWithFiles(formData);
          break;
        default:
          throw new Error('Invalid provider role');
      }
      
      set({ isRegistering: false });
      return response;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Registration failed',
        isRegistering: false,
      });
      throw error;
    }
  },

  // Register Staff
  registerStaff: async (data) => {
    set({ isRegistering: true, error: null });
    try {
      const { authService } = await import('@/services/auth.service');
      const response = await authService.registerStaff(data);
      set({ isRegistering: false });
      return response;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Staff registration failed',
        isRegistering: false,
      });
      throw error;
    }
  },

  // Verify Email - FIXED with proper type conversion
  verifyEmail: async (data) => {
    set({ isVerifyingEmail: true, error: null });
    try {
      const { authService } = await import('@/services/auth.service');
      
      const response = await authService.verifyEmail({
        email: data.email,
        code: data.code,
      });
      
      // Update user with new verification status if response contains user data
      if (response?.user) {
        // Convert the verification status to the correct type
        const updatedUser = {
          ...response.user,
          professional_verification_status: toProfessionalVerificationStatus(response.user.professional_verification_status)
        };
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update state
        set({ 
          user: updatedUser,
          isAuthenticated: true,
          professionalVerificationStatus: {
            status: updatedUser.professional_verification_status || 'pending',
            submittedAt: updatedUser.professional_verification_submitted_at || new Date().toISOString(),
          }
        });
        
        // Also store tokens if provided
        if (response.token) {
          localStorage.setItem('token', response.token);
          if (response.refreshToken) {
            localStorage.setItem('refreshToken', response.refreshToken);
          }
          set({ 
            token: response.token,
            refreshToken: response.refreshToken || null
          });
        }
      } else if (response?.data?.user) {
        // Alternative response structure
        const updatedUser = {
          ...response.data.user,
          professional_verification_status: toProfessionalVerificationStatus(response.data.user.professional_verification_status)
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        set({ 
          user: updatedUser,
          isAuthenticated: true,
          professionalVerificationStatus: {
            status: updatedUser.professional_verification_status || 'pending',
          }
        });
      } else {
        // If no user returned, just mark verification as complete
        set({ isVerifyingEmail: false });
        return response;
      }
      
      set({ isVerifyingEmail: false });
      return response;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Email verification failed',
        isVerifyingEmail: false,
      });
      throw error;
    }
  },

  // Resend Verification Code
  resendVerificationCode: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const { authService } = await import('@/services/auth.service');
      await authService.resendVerificationCode({ email });
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to resend code',
        isLoading: false,
      });
      throw error;
    }
  },

  // Forgot Password
  forgotPassword: async (email) => {
    set({ isSendingResetLink: true, error: null });
    try {
      const { authService } = await import('@/services/auth.service');
      await authService.forgotPassword({ email });
      set({ isSendingResetLink: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to send reset link',
        isSendingResetLink: false,
      });
      throw error;
    }
  },

  // Reset Password
  resetPassword: async (token, password, confirmPassword) => {
    set({ isResettingPassword: true, error: null });
    try {
      const { authService } = await import('@/services/auth.service');
      await authService.resetPassword({ token, password, confirm_password: confirmPassword });
      set({ isResettingPassword: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to reset password',
        isResettingPassword: false,
      });
      throw error;
    }
  },

  // Refresh Token Request
  refreshTokenRequest: async () => {
    try {
      const { authService } = await import('@/services/auth.service');
      const response = await authService.refreshToken();
      set({
        token: response.token,
        refreshToken: response.refreshToken,
      });
    } catch (error) {
      get().clearAuth();
      throw error;
    }
  },

  // Get Current User
  getMe: async () => {
    set({ isLoading: true });
    try {
      const { authService } = await import('@/services/auth.service');
      const user = await authService.getMe();
      
      // Convert the verification status to the correct type
      const userWithCorrectStatus = {
        ...user,
        professional_verification_status: toProfessionalVerificationStatus(user.professional_verification_status)
      };
      
      localStorage.setItem('user', JSON.stringify(userWithCorrectStatus));
      set({
        user: userWithCorrectStatus,
        isAuthenticated: true,
        isLoading: false,
      });
      
      // Check professional verification for providers
      if (user.role === 'doctor' || user.role === 'clinic' || user.role === 'diagnostic_center') {
        await get().checkProfessionalVerification();
      }
    } catch (error) {
      set({
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
      throw error;
    }
  },

  // Professional Verification Actions
  checkProfessionalVerification: async () => {
    try {
      const { authService } = await import('@/services/auth.service');
      const status = await authService.getProfessionalVerificationStatus();
      set({ professionalVerificationStatus: status });
      
      // Also update user object if needed
      const currentUser = get().user;
      if (currentUser && status.status) {
        const updatedUser = { 
          ...currentUser, 
          professional_verification_status: toProfessionalVerificationStatus(status.status)
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
      }
    } catch (error) {
      console.error('Failed to get verification status:', error);
    }
  },

  submitProfessionalVerification: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const { authService } = await import('@/services/auth.service');
      await authService.submitProfessionalVerification(formData);
      await get().checkProfessionalVerification();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to submit verification',
        isLoading: false,
      });
      throw error;
    }
  },

  canAccessDashboard: () => {
    const { user, professionalVerificationStatus } = get();
    if (!user) return false;
    
    // Patients and staff can always access
    if (user.role === 'patient' || user.role === 'staff') {
      return true;
    }
    
    // Providers need approved verification
    return professionalVerificationStatus?.status === 'approved';
  },

  // Helper methods
  getUserDisplayName: () => {
    const { user } = get();
    if (!user) return '';
    
    if (user.role === 'patient' || user.role === 'staff') {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    
    if (user.role === 'doctor' || user.role === 'clinic' || user.role === 'diagnostic_center') {
      return user.full_name || '';
    }
    
    return user.email;
  },

  getUserInitials: () => {
    const name = get().getUserDisplayName();
    if (!name) return '?';
    
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (parts[0][0] || '?').toUpperCase();
  },

  isProvider: () => {
    const { user } = get();
    if (!user) return false;
    return ['doctor', 'clinic', 'diagnostic_center'].includes(user.role);
  },

  isPatient: () => {
    const { user } = get();
    return user?.role === 'patient';
  },

  isStaff: () => {
    const { user } = get();
    return user?.role === 'staff';
  },

  requiresProfessionalVerification: () => {
    const { user } = get();
    if (!user) return false;
    return ['doctor', 'clinic', 'diagnostic_center'].includes(user.role);
  },

  isProfessionalVerificationPending: () => {
    const { professionalVerificationStatus } = get();
    return professionalVerificationStatus?.status === 'pending';
  },

  isProfessionalVerificationApproved: () => {
    const { professionalVerificationStatus } = get();
    return professionalVerificationStatus?.status === 'approved';
  },
});