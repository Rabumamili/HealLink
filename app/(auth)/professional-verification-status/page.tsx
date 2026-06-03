// app/professional-verification-status/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Mail, 
  Clock, 
  Building2, 
  Stethoscope, 
  FlaskConical,
  XCircle,
  LogOut,
  AlertTriangle,
  FileCheck,
  UserCheck
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

function ProfessionalVerificationStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, logout } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Use verification status from login response (user object) instead of making API call
    const status = user?.professional_verification_status ?? null;
    setVerificationStatus(status);

    const urlStatus = searchParams.get('status');
    if (urlStatus === 'rejected' || status === 'rejected') {
      const reason = user?.rejection_reason ?? 'Your verification was not approved. Please review and resubmit.';
      setRejectionReason(reason);
    }

    setIsLoading(false);
  }, [isAuthenticated, router, user, searchParams]);

  // Check if user is a provider after hooks
  const isProviderUser = user && (user.role === 'doctor' || user.role === 'clinic' || user.role === 'diagnostic_center');
  
  // Redirect non-providers
  useEffect(() => {
    if (!isLoading && user && !isProviderUser) {
      if (user.role === 'patient') {
        router.push('/patient/dashboard');
      }
    }
  }, [user, isLoading, router, isProviderUser]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleResubmit = () => {
    router.push('/professional-verification-submit?resubmit=true');
  };

  // Early returns with null checks
  if (!isAuthenticated || !user) {
    return null;
  }

  if (!isProviderUser) {
    return null;
  }

  // If approved, redirect to dashboard
  if (verificationStatus === 'approved') {
    const roleRoutes: Record<string, string> = {
      doctor: '/doctor/dashboard',
      clinic: '/clinic/dashboard',
      diagnostic_center: '/diagnostic/dashboard',
    };
    router.push(roleRoutes[user.role] || '/dashboard');
    return null;
  }

  const getRoleInfo = () => {
    switch (user?.role) {
      case 'doctor': 
        return { icon: Stethoscope, title: 'Doctor', color: 'text-blue-600', bgColor: 'bg-blue-100' };
      case 'clinic': 
        return { icon: Building2, title: 'Clinic', color: 'text-teal-600', bgColor: 'bg-teal-100' };
      case 'diagnostic_center': 
        return { icon: FlaskConical, title: 'Diagnostic Center', color: 'text-purple-600', bgColor: 'bg-purple-100' };
      default: 
        return { icon: Shield, title: 'Professional', color: 'text-amber-600', bgColor: 'bg-amber-100' };
    }
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  if (isLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#008B8B] via-[#006767] to-[#004f4f] px-4 py-8">
        <div className="relative z-10 w-full max-w-[480px]">
          <div className="rounded-2xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-xl sm:rounded-3xl">
            <div className="px-6 py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4" />
              <p className="text-slate-600">Loading verification status...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SUBMITTED STATUS - Waiting for Ministry approval
  if (verificationStatus === 'submitted') {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#008B8B] via-[#006767] to-[#004f4f] px-4 py-8">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl" />

        <div className="relative z-10 w-full max-w-[480px]">
          <div className="rounded-2xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-xl sm:rounded-3xl">
            <div className="px-6 py-5 sm:px-8 sm:py-6">
              <div className="mb-4 flex flex-col items-center text-center">
                <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-xl ${roleInfo.bgColor} shadow-lg`}>
                  <RoleIcon className={`w-7 h-7 ${roleInfo.color}`} />
                </div>

                <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Verification Under Review
                </h1>
                <p className="mt-1 text-xs text-slate-500">
                  Your {roleInfo.title.toLowerCase()} credentials are being reviewed by the Ministry of Health
                </p>
              </div>

              <div className="space-y-5">
                <div className="bg-amber-50 rounded-lg p-4 space-y-3 text-left border border-amber-200">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-amber-800">Processing Time</p>
                      <p className="text-sm text-amber-700">Typically takes 2-3 business days</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-teal-600" />
                    <div>
                      <p className="font-medium text-gray-800">Email Notification</p>
                      <p className="text-sm text-gray-600">You'll receive an email once approved or if more information is needed</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-800">After Approval</p>
                      <p className="text-sm text-gray-600">You'll get full access to your provider dashboard</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2 border-slate-300 hover:bg-slate-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // REJECTED STATUS
  if (verificationStatus === 'rejected') {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#008B8B] via-[#006767] to-[#004f4f] px-4 py-8">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl" />

        <div className="relative z-10 w-full max-w-[480px]">
          <div className="rounded-2xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-xl sm:rounded-3xl">
            <div className="px-6 py-5 sm:px-8 sm:py-6">
              <div className="mb-4 flex flex-col items-center text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-red-100 shadow-lg">
                  <XCircle className="w-7 h-7 text-red-600" />
                </div>

                <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Verification Not Approved
                </h1>
                <p className="mt-1 text-xs text-slate-500">
                  Your {roleInfo.title.toLowerCase()} verification requires additional information
                </p>
              </div>

              <div className="space-y-5">
                {rejectionReason && (
                  <div className="bg-red-50 rounded-lg p-4 text-left border border-red-200">
                    <p className="font-medium text-red-800 mb-1 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Reason for rejection:
                    </p>
                    <p className="text-sm text-red-700">{rejectionReason}</p>
                  </div>
                )}

                <div className="bg-amber-50 rounded-lg p-4 space-y-3 text-left border border-amber-200">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-teal-600" />
                    <div>
                      <p className="font-medium text-gray-800">Need Help?</p>
                      <p className="text-sm text-gray-600">Contact support@heallink.com for assistance</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleResubmit}
                    className="w-full bg-gradient-to-r from-teal-700 to-cyan-600"
                  >
                    Resubmit Verification
                  </Button>
                  
                  <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2 border-slate-300 hover:bg-slate-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PENDING or null STATUS - Need to submit verification
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#008B8B] via-[#006767] to-[#004f4f] px-4 py-8">
      <div className="relative z-10 w-full max-w-[480px]">
        <div className="rounded-2xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-xl sm:rounded-3xl">
          <div className="px-6 py-5 sm:px-8 sm:py-6">
            <div className="mb-4 flex flex-col items-center text-center">
              <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-xl ${roleInfo.bgColor} shadow-lg`}>
                <RoleIcon className={`w-7 h-7 ${roleInfo.color}`} />
              </div>

              <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
                Complete Professional Verification
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Please submit your professional credentials for verification to access your dashboard
              </p>
            </div>

            <div className="space-y-5">
              <div className="bg-blue-50 rounded-lg p-4 space-y-3 text-left border border-blue-200">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Why verify?</p>
                    <p className="text-sm text-blue-700">Verification ensures patient safety and builds trust</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FileCheck className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-800">What to submit?</p>
                    <p className="text-sm text-gray-600">Professional license, registration documents, and credentials</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleResubmit}
                  className="w-full bg-gradient-to-r from-teal-700 to-cyan-600"
                >
                  Start Verification
                </Button>
                
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 border-slate-300 hover:bg-slate-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfessionalVerificationStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#008B8B] via-[#006767] to-[#004f4f] px-4 py-8">
          <div className="relative z-10 w-full max-w-[480px]">
            <div className="rounded-2xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-xl sm:rounded-3xl">
              <div className="px-6 py-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4" />
                <p className="text-slate-600">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ProfessionalVerificationStatusContent />
    </Suspense>
  );
}