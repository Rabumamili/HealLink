// hooks/useAuth.ts
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/slices/authSlice';
import { useRouter } from 'next/navigation';
import {
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
  AuthUser,
  UserRole,
  ProviderType,
  ProfessionalVerificationSubmitData,
  ProfessionalVerificationStatus,
} from '@/types/entities/auth.types';
import { authService } from '@/services/auth.service';

interface UseAuthOptions {
  requireAuth?: boolean;
  allowedRoles?: UserRole[];
  redirectTo?: string;
  redirectIfAuthenticated?: string;
}

// ─── Type guards ─────────────────────────────────────────────────────────────

const isProvider = (
  user: AuthUser | null
): user is AuthUser & {
  role: 'doctor' | 'clinic' | 'diagnostic_center';
  professional_verification_status?: ProfessionalVerificationStatus;
  rejection_reason?: string;
} =>
  user !== null &&
  (user.role === 'doctor' ||
    user.role === 'clinic' ||
    user.role === 'diagnostic_center');

const isPatient = (
  user: AuthUser | null
): user is AuthUser & { role: 'patient' } =>
  user !== null && user.role === 'patient';

const isStaffUser = (
  user: AuthUser | null
): user is AuthUser & { role: 'staff' } =>
  user !== null && user.role === 'staff';

// ─── Hook ────────────────────────────────────────────────────────────────────

export const useAuth = (options: UseAuthOptions = {}) => {
  const {
    requireAuth = false,
    allowedRoles = [],
    redirectTo = '/login',
    redirectIfAuthenticated,
  } = options;

  const router = useRouter();
  const store = useAuthStore();

  const {
    user,
    isLoading,
    error,
    isInitialized,
    initialize,
    login: storeLogin,
    logout: storeLogout,
    registerUser,
    registerDoctor,
    registerClinic,
    registerDiagnosticCenter,
    registerStaff,
    completeStaffRegistration,
    resendStaffInvitation,
    verifyEmail,
    resendVerificationCode,
    forgotPassword,
    resetPassword,
    getCurrentUser: storeGetCurrentUser,
    updateProfile,
    changePassword,
    clearError,
    getStaffMembers,
    updateStaffRole,
    deactivateStaff,
    activateStaff,
    deleteStaff,
    submitProfessionalVerification,
    getProfessionalVerificationStatus,
  } = store;

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  // ── Route guard ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isInitialized || isLoading) return;

    const isAuthenticated = !!user;
    const hasRequiredRole =
      allowedRoles.length === 0 ||
      (user && allowedRoles.includes(user.role));

    if (redirectIfAuthenticated && isAuthenticated) {
      router.push(redirectIfAuthenticated);
      return;
    }
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }
    if (requireAuth && isAuthenticated && !hasRequiredRole) {
      router.push('/unauthorized');
      return;
    }
  }, [
    user,
    isLoading,
    isInitialized,
    requireAuth,
    allowedRoles,
    redirectTo,
    redirectIfAuthenticated,
    router,
  ]);

  // ── getCurrentUser — returns AuthUser | null ──────────────────────────────
  const getCurrentUser = async (): Promise<AuthUser | null> => {
    await storeGetCurrentUser();
    return useAuthStore.getState().user;
  };

  // ── Role helpers ──────────────────────────────────────────────────────────
  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  };

  const checkIsStaff = (): boolean => isStaffUser(user);

  const hasStaffRole = (subRole: StaffSubRole | StaffSubRole[]): boolean => {
    if (!isStaffUser(user)) return false;
    const roles = Array.isArray(subRole) ? subRole : [subRole];
    return roles.includes(user.staff_sub_role!);
  };

  const isVerified = (): boolean => user?.is_verified || false;

  const isProfessionalVerified = (): boolean => {
    if (!isProvider(user)) return false;
    return user.professional_verification_status === 'approved';
  };

  const hasSubmittedProfessionalVerification = (): boolean => {
    if (!isProvider(user)) return false;
    const s = user.professional_verification_status;
    return s === 'submitted' || s === 'approved';
  };

  const isProfessionalVerificationPending = (): boolean => {
    if (!isProvider(user)) return false;
    const s = user.professional_verification_status;
    return s === 'pending' || !s;
  };

  const getProfessionalStatus = (): {
    status?: ProfessionalVerificationStatus;
    reason?: string;
  } => {
    if (!isProvider(user)) return { status: undefined, reason: undefined };
    return {
      status: user.professional_verification_status,
      reason: user.rejection_reason,
    };
  };

  const needsProfessionalVerification = (): boolean => {
    if (!isProvider(user)) return false;
    const s = user.professional_verification_status;
    return s === 'pending' || s === 'rejected' || !s;
  };

  const getEmployerInfo = (): { id: number; type: ProviderType } | null =>
    authService.getEmployerInfo();

  // ── Login (with post-login routing) ──────────────────────────────────────
  const login = async (
    credentials: LoginCredentials,
    redirectPath?: string
  ) => {
    try {
      await storeLogin(credentials);

      const currentUser = authService.getCurrentUserSync();

      if (!redirectPath && currentUser) {
        if (isPatient(currentUser)) {
          redirectPath = '/patient/dashboard';
        } else if (isStaffUser(currentUser)) {
          if (currentUser.staff_sub_role === 'lab assistant') {
            redirectPath = '/staff/lab-dashboard';
          } else if (currentUser.staff_sub_role === 'card_checker') {
            redirectPath = '/staff/card-checker-dashboard';
          } else {
            redirectPath = '/staff/dashboard';
          }
        } else if (isProvider(currentUser)) {
          const status = currentUser.professional_verification_status;
          if (status === 'approved') {
            const routes: Record<string, string> = {
              doctor: '/doctor/dashboard',
              clinic: '/clinic/dashboard',
              diagnostic_center: '/diagnostic/dashboard',
            };
            redirectPath = routes[currentUser.role];
          } else if (status === 'submitted') {
            redirectPath = '/professional-verification-status';
          } else if (status === 'rejected') {
            redirectPath = '/professional-verification-status?status=rejected';
          } else {
            redirectPath = '/professional-verification-submit';
          }
        }
      }

      if (redirectPath) router.push(redirectPath);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    await storeLogout();
    router.push('/login');
  };

  // ── Staff registration wrapper ────────────────────────────────────────────
  const registerStaffWrapper = async (data: StaffRegisterData) => {
    try {
      const response = await registerStaff(data);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error };
    }
  };

  // ── Return surface ────────────────────────────────────────────────────────
  return {
    // State
    user,
    isLoading,
    error,
    isInitialized,
    isAuthenticated: !!user,

    // Role helpers
    hasRole,
    isStaff: checkIsStaff,
    hasStaffRole,
    isVerified,
    isProfessionalVerified,
    hasSubmittedProfessionalVerification,
    isProfessionalVerificationPending,
    getProfessionalStatus,
    needsProfessionalVerification,
    getEmployerInfo,

    // Auth actions
    login,
    logout,

    // Registration
    registerUser,
    registerDoctor,
    registerClinic,
    registerDiagnosticCenter,
    registerStaff: registerStaffWrapper,
    completeStaffRegistration,
    resendStaffInvitation,

    // Verification
    verifyEmail,
    resendVerificationCode,
    submitProfessionalVerification,
    getProfessionalVerificationStatus,

    // Password
    forgotPassword,
    resetPassword,
    changePassword,

    // Profile
    getCurrentUser,
    updateProfile,

    // Staff management
    getStaffMembers,
    updateStaffRole,
    deactivateStaff,
    activateStaff,
    deleteStaff,

    // Utils
    clearError,

    // Loading aliases
    isRegistering: isLoading,
    isVerifyingEmail: isLoading,
    isSendingResetLink: isLoading,
  };
};