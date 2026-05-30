// hooks/useAuth.ts
import { create } from 'zustand';
import { createAuthSlice, AuthState } from '@/stores/slices/authSlice';
import { devtools, persist } from 'zustand/middleware';
import { useState } from 'react';

// Create the store
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get, api) => ({
        ...createAuthSlice(set, get, api),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          token: state.token,
          refreshToken: state.refreshToken,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);

// Main auth hook
export const useAuth = () => {
  const store = useAuthStore();
  
  return {
    // State
    user: store.user,
    token: store.token,
    refreshToken: store.refreshToken,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    isLoggingIn: store.isLoggingIn,
    isRegistering: store.isRegistering,
    isVerifyingEmail: store.isVerifyingEmail,
    isResettingPassword: store.isResettingPassword,
    isSendingResetLink: store.isSendingResetLink,
    error: store.error,
    professionalVerificationStatus: store.professionalVerificationStatus,
    
    // Actions
    login: store.login,
    logout: store.logout,
    registerUser: store.registerUser,
    registerProvider: store.registerProvider,
    registerStaff: store.registerStaff,
    verifyEmail: store.verifyEmail,
    resendVerificationCode: store.resendVerificationCode,
    forgotPassword: store.forgotPassword,
    resetPassword: store.resetPassword,
    refreshTokenRequest: store.refreshTokenRequest,
    getMe: store.getMe,
    
    // Professional verification
    checkProfessionalVerification: store.checkProfessionalVerification,
    submitProfessionalVerification: store.submitProfessionalVerification,
    canAccessDashboard: store.canAccessDashboard,
    
    // Helpers
    getUserDisplayName: store.getUserDisplayName,
    getUserInitials: store.getUserInitials,
    isProvider: store.isProvider,
    isPatient: store.isPatient,
    isStaff: store.isStaff,
    requiresProfessionalVerification: store.requiresProfessionalVerification,
    isProfessionalVerificationPending: store.isProfessionalVerificationPending,
    isProfessionalVerificationApproved: store.isProfessionalVerificationApproved,
    
    // Clear auth
    clearAuth: store.clearAuth,
    setError: store.setError,
    setLoading: store.setLoading,
  };
};

// Hook for checking dashboard access
export const useDashboardAccess = () => {
  const { 
    user, 
    canAccessDashboard, 
    professionalVerificationStatus,
    isProvider: checkIsProvider,
    isPatient: checkIsPatient,
    isStaff: checkIsStaff
  } = useAuth();
  
  return {
    canAccess: canAccessDashboard(),
    isProvider: checkIsProvider(),
    isPatient: checkIsPatient(),
    isStaff: checkIsStaff(),
    verificationStatus: professionalVerificationStatus?.status,
    isVerificationPending: professionalVerificationStatus?.status === 'pending',
    isVerificationApproved: professionalVerificationStatus?.status === 'approved',
    isVerificationRejected: professionalVerificationStatus?.status === 'rejected',
    rejectionReason: professionalVerificationStatus?.rejectionReason,
    userRole: user?.role,
  };
};

// Hook for staff-specific actions
export const useStaffManagement = () => {
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);
  
  const registerStaff = async (data: any) => {
    setIsLoading(true);
    try {
      const { authService } = await import('@/services/auth.service');
      const response = await authService.registerStaff(data);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStaffList = async (employerId: number, employerType: string) => {
    setIsLoading(true);
    try {
      const { authService } = await import('@/services/auth.service');
      const response = await authService.getStaffList(employerId, employerType);
      setStaffList(response.data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateStaffRole = async (staffId: number, role: string) => {
    setIsLoading(true);
    try {
      const { authService } = await import('@/services/auth.service');
      const response = await authService.updateStaffRole(staffId, role);
      setStaffList(prev => prev.map(staff => 
        staff.id === staffId ? { ...staff, staff_sub_role: role } : staff
      ));
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deactivateStaff = async (staffId: number) => {
    setIsLoading(true);
    try {
      const { authService } = await import('@/services/auth.service');
      await authService.deactivateStaff(staffId);
      setStaffList(prev => prev.map(staff => 
        staff.id === staffId ? { ...staff, is_active: false } : staff
      ));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const activateStaff = async (staffId: number) => {
    setIsLoading(true);
    try {
      const { authService } = await import('@/services/auth.service');
      await authService.activateStaff(staffId);
      setStaffList(prev => prev.map(staff => 
        staff.id === staffId ? { ...staff, is_active: true } : staff
      ));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    registerStaff,
    getStaffList,
    updateStaffRole,
    deactivateStaff,
    activateStaff,
    staffList,
    isLoading,
  };
};

// Hook for role-based access control
export const useRoleAccess = () => {
  const { user, isProvider, isPatient, isStaff } = useAuth();
  
  const hasRole = (roles: string | string[]) => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };
  
  const hasAnyRole = (roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };
  
  const hasAllRoles = (roles: string[]) => {
    if (!user) return false;
    return roles.every(role => role === user.role);
  };
  
  return {
    isProvider: isProvider(),
    isPatient: isPatient(),
    isStaff: isStaff(),
    userRole: user?.role,
    hasRole,
    hasAnyRole,
    hasAllRoles,
  };
};

// Hook for authentication status
export const useAuthStatus = () => {
  const { isAuthenticated, user, isLoading, error } = useAuth();
  
  return {
    isAuthenticated,
    isLoading,
    error,
    user,
    isLoggedIn: isAuthenticated,
    isLoggedOut: !isAuthenticated && !isLoading,
  };
};

// Hook for professional verification status
export const useProfessionalVerification = () => {
  const {
    user,
    professionalVerificationStatus,
    checkProfessionalVerification,
    submitProfessionalVerification,
    isProfessionalVerificationPending,
    isProfessionalVerificationApproved,
    requiresProfessionalVerification,
    isLoading,
  } = useAuth();
  
  const needsVerification = requiresProfessionalVerification();
  const isPending = isProfessionalVerificationPending();
  const isApproved = isProfessionalVerificationApproved();
  const isRejected = professionalVerificationStatus?.status === 'rejected';
  const rejectionReason = professionalVerificationStatus?.rejectionReason;
  
  return {
    needsVerification,
    isPending,
    isApproved,
    isRejected,
    rejectionReason,
    status: professionalVerificationStatus?.status,
    submittedAt: professionalVerificationStatus?.submittedAt,
    approvedAt: professionalVerificationStatus?.approvedAt,
    checkStatus: checkProfessionalVerification,
    submitVerification: submitProfessionalVerification,
    isLoading,
    canAccessDashboard: isApproved || !needsVerification,
  };
};