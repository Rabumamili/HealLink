// app/(auth)/verify-email/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { EmailVerificationDialog } from '@/components/auth/EmailVerificationDialog';
import { useAuthStore } from '@/stores/slices/authSlice';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [showVerification, setShowVerification] = useState(true);
  
  const email = searchParams.get('email') || '';
  const role = searchParams.get('role') || '';
  const tempUserId = searchParams.get('tempUserId') || '';
  const formData = searchParams.get('formData') || '';

  // If already authenticated, redirect appropriately
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'patient') {
        router.push('/patient/dashboard');
      } else if (user.professional_verification_status === 'approved') {
        const roleRoutes: Record<string, string> = {
          doctor: '/doctor/dashboard',
          clinic_admin: '/clinic-admin/dashboard',
          diagnostic_admin: '/diagnostic-admin/dashboard',
        };
        router.push(roleRoutes[user.role] || '/dashboard');
      } else if (user.professional_verification_status === 'submitted') {
        router.push('/verification-pending');
      }
    }
  }, [isAuthenticated, user, router]);

  // Redirect if no email provided
  useEffect(() => {
    if (!email && typeof window !== 'undefined') {
      router.push('/register');
    }
  }, [email, router]);

  const handleVerificationComplete = () => {
    setShowVerification(false);
    if (role === 'patient') {
      router.push('/login?verified=true');
    } else {
      // For providers, redirect to pending page
      router.push('/verification-pending');
    }
  };

  const handleCancel = () => {
    router.push('/register');
  };

  if (!email) {
    return null;
  }

  return (
    <AuthLayout 
      title="Verify Your Email" 
      description="Enter the verification code sent to your email"
      showLoginLink={true}
    >
      <EmailVerificationDialog
        open={showVerification}
        onOpenChange={setShowVerification}
        email={email}
        role={role}
        tempUserId={tempUserId}
        onVerificationComplete={handleVerificationComplete}
        onCancel={handleCancel}
      />
    </AuthLayout>
  );
}