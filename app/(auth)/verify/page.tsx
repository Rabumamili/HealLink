'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { EmailVerificationDialog } from '@/components/auth/EmailVerificationDialog';
import { useAuth } from '@/hooks/useAuth';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated, professionalVerificationStatus } = useAuth();
  const [showVerification, setShowVerification] = useState(true);
  
  const email = searchParams.get('email') || '';
  const role = searchParams.get('role') || '';
  const tempUserId = searchParams.get('tempUserId') || '';

  // If already authenticated, redirect appropriately
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'patient') {
        router.push('/patient/dashboard');
      } 
      else if (user.role === 'staff') {
        router.push('/staff/dashboard');
      }
      else if (user.role === 'doctor' || user.role === 'clinic' || user.role === 'diagnostic_center') {
        const verificationStatus = professionalVerificationStatus?.status || user.professional_verification_status;
        
        if (verificationStatus === 'approved') {
          const roleRoutes: Record<string, string> = {
            doctor: '/doctor/dashboard',
            clinic: '/clinic/dashboard',
            diagnostic_center: '/diagnostic/dashboard',
          };
          router.push(roleRoutes[user.role] || '/dashboard');
        } 
        else if (verificationStatus === 'pending') {
          router.push('/professional-verification-status');
        }
        else if (verificationStatus === 'rejected') {
          router.push('/professional-verification-status?status=rejected');
        }
      }
    }
  }, [isAuthenticated, user, professionalVerificationStatus, router]);

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
      // For providers: after email verification, professional verification is automatically submitted
      // Show pending status page
      router.push('/professional-verification-status');
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