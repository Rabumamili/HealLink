// hooks/useAuth.ts
import { useAppDispatch, useAppSelector } from './redux';
import {
  login,
  registerPatient,
  registerDoctor,
  registerClinic,
  registerDiagnosticCenter,
  verifyEmail,
  resendVerificationCode,
  forgotPassword,
  resetPassword,
  logout,
  getMe,
  clearError,
  clearVerificationState,
  clearPasswordResetState,
  updateUser,
} from '@/stores/slices/authSlice';
import { LoginCredentials, PatientRegisterData, VerifyEmailData, ResendVerificationData, ForgotPasswordData, ResetPasswordData } from '@/types/entities/auth.types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  
  // Use useAppSelector with proper typing
  const auth = useAppSelector((state) => state.auth);

  const handleLogin = (credentials: LoginCredentials) => {
    return dispatch(login(credentials));
  };

  const handleRegisterPatient = (data: PatientRegisterData) => {
    return dispatch(registerPatient(data));
  };

  const handleRegisterDoctor = (formData: FormData) => {
    return dispatch(registerDoctor(formData));
  };

  const handleRegisterClinic = (formData: FormData) => {
    return dispatch(registerClinic(formData));
  };

  const handleRegisterDiagnosticCenter = (formData: FormData) => {
    return dispatch(registerDiagnosticCenter(formData));
  };

  const handleVerifyEmail = (data: VerifyEmailData) => {
    return dispatch(verifyEmail(data));
  };

  const handleResendVerificationCode = (data: ResendVerificationData) => {
    return dispatch(resendVerificationCode(data));
  };

  const handleForgotPassword = (data: ForgotPasswordData) => {
    return dispatch(forgotPassword(data));
  };

  const handleResetPassword = (data: ResetPasswordData) => {
    return dispatch(resetPassword(data));
  };

  const handleLogout = () => {
    return dispatch(logout());
  };

  const handleGetMe = () => {
    return dispatch(getMe());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const handleClearVerificationState = () => {
    dispatch(clearVerificationState());
  };

  const handleClearPasswordResetState = () => {
    dispatch(clearPasswordResetState());
  };

  const handleUpdateUser = (data: Partial<any>) => {
    dispatch(updateUser(data));
  };

  return {
    // State
    user: auth.user,
    token: auth.token,
    refreshToken: auth.refreshToken,
    isLoading: auth.isLoading,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,
    verificationEmailSent: auth.verificationEmailSent,
    passwordResetEmailSent: auth.passwordResetEmailSent,
    
    // Actions
    login: handleLogin,
    registerPatient: handleRegisterPatient,
    registerDoctor: handleRegisterDoctor,
    registerClinic: handleRegisterClinic,
    registerDiagnosticCenter: handleRegisterDiagnosticCenter,
    verifyEmail: handleVerifyEmail,
    resendVerificationCode: handleResendVerificationCode,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
    logout: handleLogout,
    getMe: handleGetMe,
    clearError: handleClearError,
    clearVerificationState: handleClearVerificationState,
    clearPasswordResetState: handleClearPasswordResetState,
    updateUser: handleUpdateUser,
  };
};