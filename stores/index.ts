// store/index.ts
export {
  useAuthStore,
  useAuth,
  useDashboardAccess,
  useStaffManagement,
  useRoleAccess,
  useAuthStatus,
  useProfessionalVerification,
} from './../hooks/useAuth';

export type { AuthState } from '@/stores/slices/authSlice';