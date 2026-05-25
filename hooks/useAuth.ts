// hooks/useAuth.ts (Updated - removed verifyProvider)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/slices/authSlice';
import { 
  BaseRegisterData,
  ProfessionalRegistrationData,
  LoginCredentials, 
  ForgotPasswordData, 
  ResetPasswordData, 
  VerifyEmailData,
  StaffRegisterData
} from '@/types/entities/auth.types';
import { toast } from 'sonner';

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const { 
    user, 
    isAuthenticated, 
    isLoading,
    error,
    setAuth,
    setLoading,
    setError,
    clearError,
    clearAuth,
    hasRole,
    updateUser
  } = useAuthStore();

  // UNIFIED REGISTRATION - For ALL users (patients AND providers)
  const registerMutation = useMutation({
    mutationFn: (data: BaseRegisterData) => authService.register(data),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (response) => {
      setLoading(false);
      toast.success('Registration successful! Please check your email for verification code.');
      router.push(`/verify-email?email=${encodeURIComponent(response.user.email)}&role=${response.user.role}`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      toast.error(message);
      setLoading(false);
    },
  });

  // Professional details submission to Ministry of Health
  const submitProfessionalDetailsMutation = useMutation({
    mutationFn: (data: ProfessionalRegistrationData) => authService.registerProfessional(data),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: () => {
      setLoading(false);
      toast.success('Professional details submitted! Awaiting verification from Ministry of Health.');
      router.push('/professional-pending');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to submit professional details';
      setError(message);
      toast.error(message);
      setLoading(false);
    },
  });

  // UNIFIED LOGIN
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (response) => {
      setAuth(response.user, response.token, response.refreshToken);
      toast.success(`Welcome back, ${response.user.first_name}!`);
      
      // Redirect based on role and verification status
      if (response.user.role === 'patient') {
        router.push('/patient/dashboard');
      } else if (response.user.role === 'staff') {
        router.push('/staff/dashboard');
      } else {
        // For providers (doctor, clinic_admin, diagnostic_admin)
        if (response.user.professional_verification_status === 'approved') {
          const roleRoutes: Record<string, string> = {
            doctor: '/doctor/dashboard',
            clinic_admin: '/clinic-admin/dashboard',
            diagnostic_admin: '/diagnostic-admin/dashboard',
          };
          router.push(roleRoutes[response.user.role] || '/dashboard');
        } else {
          router.push('/professional-pending');
        }
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Invalid email or password';
      setError(message);
      toast.error(message);
      setLoading(false);
    },
  });

  // Staff Registration (by provider only)
  const registerStaffMutation = useMutation({
    mutationFn: (data: StaffRegisterData) => authService.registerStaff(data),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (response) => {
      setLoading(false);
      toast.success('Staff member added successfully');
      return response;
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to add staff';
      setError(message);
      toast.error(message);
      setLoading(false);
    },
  });

  // Forgot Password
  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordData) => authService.forgotPassword(data),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: () => {
      setLoading(false);
      toast.success('Password reset link sent to your email');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to send reset link';
      setError(message);
      toast.error(message);
      setLoading(false);
    },
  });

  // Reset Password
  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordData) => authService.resetPassword(data),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: () => {
      setLoading(false);
      toast.success('Password reset successful! Please login with your new password.');
      router.push('/login');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to reset password';
      setError(message);
      toast.error(message);
      setLoading(false);
    },
  });

  // Verify Email
  const verifyEmailMutation = useMutation({
    mutationFn: (data: VerifyEmailData) => authService.verifyEmail(data),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (response, variables) => {
      setLoading(false);
      toast.success('Email verified successfully!');
      
      // Redirect based on role
      if (variables.role === 'patient') {
        router.push('/login?verified=true');
      } else {
        // Provider - go to professional details form
        router.push(`/professional-details?email=${encodeURIComponent(variables.email)}&role=${variables.role}`);
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Invalid verification code';
      setError(message);
      toast.error(message);
      setLoading(false);
    },
  });

  // Resend Verification Code
  const resendCodeMutation = useMutation({
    mutationFn: (data: { email: string }) => authService.resendVerificationCode(data.email),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: () => {
      setLoading(false);
      toast.success('New verification code sent to your email');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to resend code';
      setError(message);
      toast.error(message);
      setLoading(false);
    },
  });

  // Logout
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push('/login');
    },
    onError: () => {
      clearAuth();
      queryClient.clear();
      router.push('/login');
    },
  });

  // Helper getters
  const isStaff = user?.role === 'staff';
  const staffSubRole = isStaff ? user?.staff_sub_role : undefined;
  const isProvider = user?.role !== 'patient' && user?.role !== 'staff';
  const isProfessionalVerified = user?.professional_verification_status === 'approved';

  return {
    // State
    user,
    isAuthenticated,
    isLoading: isLoading || registerMutation.isPending || loginMutation.isPending,
    error,
    
    // Helpers
    isStaff,
    staffSubRole,
    isProvider,
    isProfessionalVerified,
    hasRole,
    updateUser,
    clearError,
    
    // Registration (unified)
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    
    // Professional details (for providers after email verification)
    submitProfessionalDetails: submitProfessionalDetailsMutation.mutate,
    isSubmittingProfessionalDetails: submitProfessionalDetailsMutation.isPending,
    
    // Login (unified)
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    
    // Staff management (for providers)
    registerStaff: registerStaffMutation.mutate,
    isRegisteringStaff: registerStaffMutation.isPending,
    
    // Password management
    forgotPassword: forgotPasswordMutation.mutate,
    isSendingResetLink: forgotPasswordMutation.isPending,
    resetPassword: resetPasswordMutation.mutate,
    isResettingPassword: resetPasswordMutation.isPending,
    
    // Email verification
    verifyEmail: verifyEmailMutation.mutate,
    isVerifyingEmail: verifyEmailMutation.isPending,
    resendVerificationCode: resendCodeMutation.mutate,
    isResendingCode: resendCodeMutation.isPending,
    
    // Logout
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
};