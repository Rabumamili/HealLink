// app/verify-email/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { EmailVerificationDialog } from '@/components/auth/EmailVerificationDialog';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated, getCurrentUser } = useAuth();
  const [showVerification, setShowVerification] = useState(true);
  
  const email = searchParams.get('email') || '';
  const role = searchParams.get('role') || '';

  // If already authenticated, redirect appropriately
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'patient') {
        router.push('/patient/dashboard');
      } 
      else if (user.role === 'doctor' || user.role === 'clinic' || user.role === 'diagnostic_center') {
        const verificationStatus = user.professional_verification_status;
        
        if (verificationStatus === 'approved') {
          const roleRoutes: Record<string, string> = {
            doctor: '/doctor/dashboard',
            clinic: '/clinic/dashboard',
            diagnostic_center: '/diagnostic/dashboard',
          };
          router.push(roleRoutes[user.role]);
        } 
        else if (verificationStatus === 'submitted') {
          router.push('/professional-verification-status');
        }
        else if (verificationStatus === 'rejected') {
          router.push('/professional-verification-status?status=rejected');
        }
        else {
          // Not yet submitted - go to submission page
          router.push('/professional-verification-submit');
        }
      }
    }
  }, [isAuthenticated, user, router]);

  // Redirect if no email provided
  useEffect(() => {
    if (!email && typeof window !== 'undefined') {
      router.push('/register');
    }
  }, [email, router]);

  const handleVerificationComplete = async () => {
    setShowVerification(false);
    
    // Refresh user data
    await getCurrentUser();
    
    if (role === 'patient') {
      toast.success('Email verified successfully! Please login.');
      router.push('/login?verified=true');
    } else {
      // For providers: after email verification, redirect to professional verification submission
      toast.success('Email verified! Please complete professional verification.');
      router.push('/professional-verification-submit');
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
        onVerificationComplete={handleVerificationComplete}
        onCancel={handleCancel} tempUserId={''}      />
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout title="Verify Email" description="Loading...">
          <div className="flex min-h-[200px] items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        </AuthLayout>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}