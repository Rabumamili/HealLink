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
  const { user, isAuthenticated, getCurrentUser, verifyEmail, isVerifyingEmail } = useAuth();
  
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';
  const role = searchParams.get('role') || '';
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'manual'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [showManualVerification, setShowManualVerification] = useState(true);
  const [hasJustVerified, setHasJustVerified] = useState(false);

  // Handle token-based verification from email link
  useEffect(() => {
    const handleTokenVerification = async () => {
      if (!token) {
        setStatus('manual');
        return;
      }

      try {
        console.log('Verifying email with token:', { email, token: token.substring(0, 10) + '...' });
        await verifyEmail({ email, code: token });
        console.log('Email verification successful');
        setStatus('success');

        // Refresh user data after verification
        setTimeout(async () => {
          await getCurrentUser();

          if (role === 'patient') {
            router.push('/login?verified=true');
          } else {
            router.push('/professional-verification-submit');
          }
        }, 2000);
      } catch (error: any) {
        console.error('Email verification failed:', error?.message || error);
        setErrorMessage(error?.message || 'Verification failed. The link may have expired.');
        setStatus('error');
      }
    };

    handleTokenVerification();
  }, [token, verifyEmail, getCurrentUser, router, role]);

  // If already authenticated (has token) AND verified, redirect appropriately
  useEffect(() => {
    const hasToken = localStorage.getItem('token');
    if (hasToken && isAuthenticated && user && user.is_verified) {
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
          router.push('/professional-verification-submit');
        }
      }
    }
  }, [isAuthenticated, user, router]);

  const handleVerificationComplete = async () => {
    console.log('Verification complete, redirecting based on role:', role);
    setHasJustVerified(true); // Prevent auto-redirect to dashboard
    setShowManualVerification(false);

    await getCurrentUser();

    if (role === 'patient') {
      toast.success('Email verified successfully! Please login.');
      router.push('/login?verified=true');
    } else {
      toast.success('Email verified! Please complete professional verification.');
      router.push('/professional-verification-submit');
    }
  };

  const handleCancel = () => {
    router.push('/register');
  };

  // Show loading state
  if (status === 'loading') {
    return (
      <AuthLayout 
        title="Verifying Your Email" 
        description="Please wait while we verify your email address"
        showLoginLink={false}
      >
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mb-4" />
          <p className="text-slate-600">Verifying email...</p>
        </div>
      </AuthLayout>
    );
  }

  // Show success state
  if (status === 'success') {
    return (
      <AuthLayout 
        title="Email Verified!" 
        description="Your email has been successfully verified"
        showLoginLink={false}
      >
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Email Verified Successfully!</h2>
          <p className="text-slate-600 text-center mb-6">
            {role === 'patient' 
              ? 'You can now log in to your account.'
              : 'You will be redirected to complete your professional verification.'}
          </p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600" />
        </div>
      </AuthLayout>
    );
  }

  // Show error state
  if (status === 'error') {
    return (
      <AuthLayout 
        title="Verification Failed" 
        description="We couldn't verify your email"
        showLoginLink={true}
      >
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Verification Failed</h2>
          <p className="text-slate-600 text-center mb-6">{errorMessage}</p>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2.5 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors"
            >
              Go to Login
            </button>
            <button
              onClick={() => router.push('/register')}
              className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
            >
              Register Again
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Show manual verification (no token in URL)
  if (status === 'manual' && !showManualVerification) {
    return (
      <AuthLayout 
        title="Verify Your Email" 
        description="Enter the verification code sent to your email"
        showLoginLink={true}
      >
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center mb-6">
            <svg className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Enter Verification Code</h2>
          <p className="text-slate-600 text-center mb-6">
            We've sent a 6-digit verification code to your email
          </p>
          {email && (
            <p className="text-sm text-teal-600 font-semibold mb-6">{email}</p>
          )}
          <button
            onClick={() => setShowManualVerification(true)}
            className="px-6 py-2.5 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors"
          >
            Enter Code
          </button>
        </div>
      </AuthLayout>
    );
  }

  // Show manual verification dialog
  if (showManualVerification && email) {
    return (
      <AuthLayout 
        title="Verify Your Email" 
        description="Enter the verification code sent to your email"
        showLoginLink={true}
      >
        <EmailVerificationDialog
          open={showManualVerification}
          onOpenChange={setShowManualVerification}
          email={email}
          role={role}
          tempUserId={''}
          onVerificationComplete={handleVerificationComplete}
          onCancel={handleCancel}
        />
      </AuthLayout>
    );
  }

  return null;
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