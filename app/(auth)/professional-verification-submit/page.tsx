// app/professional-verification-submit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check, Shield, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function ProfessionalVerificationSubmitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, submitProfessionalVerification, isLoading, getCurrentUser } = useAuth();
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isResubmit = searchParams.get('resubmit') === 'true';

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Check if user is a provider
    const isProviderUser = user.role === 'doctor' || user.role === 'clinic' || user.role === 'diagnostic_center';
    
    if (!isProviderUser) {
      if (user.role === 'patient') {
        router.push('/patient/dashboard');
      } else if (user.role === 'staff') {
        router.push('/staff/dashboard');
      }
      return;
    }

    // If already approved, redirect to dashboard
    if (user.professional_verification_status === 'approved') {
      const roleRoutes: Record<string, string> = {
        doctor: '/doctor/dashboard',
        clinic: '/clinic/dashboard',
        diagnostic_center: '/diagnostic/dashboard',
      };
      router.push(roleRoutes[user.role]);
      return;
    }

    // If already submitted, redirect to status page
    if (user.professional_verification_status === 'submitted') {
      router.push('/professional-verification-status');
      return;
    }
  }, [user, router]);

  const handleSubmit = async () => {
    if (!confirmed) {
      setError('Please confirm that all information is accurate');
      return;
    }

    if (!user) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await submitProfessionalVerification({
        role: user.role as 'doctor' | 'clinic' | 'diagnostic_center',
        license_number: user.license_number || '',
        tin_number: user.tin_number,
      });
      
      toast.success('Professional verification submitted for review');
      router.push('/professional-verification-status');
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Early return if no user
  if (!user) {
    return null;
  }

  const isProviderUser = user.role === 'doctor' || user.role === 'clinic' || user.role === 'diagnostic_center';
  
  if (!isProviderUser) {
    return null;
  }

  const getRoleTitle = () => {
    switch (user.role) {
      case 'doctor': return 'Medical Professional';
      case 'clinic': return 'Healthcare Facility';
      case 'diagnostic_center': return 'Diagnostic Center';
      default: return 'Provider';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#008B8B] via-[#006767] to-[#004f4f] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isResubmit ? 'Resubmit Verification' : 'Professional Verification'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isResubmit 
              ? 'Please review and resubmit your credentials' 
              : 'Review and submit your credentials for verification'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-2">Before you submit:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Ensure all information is accurate</li>
                <li>Documents must be clear and legible</li>
                <li>Verification takes 2-3 business days</li>
                <li>You will be notified via email once reviewed</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">{getRoleTitle()} Information</h3>
          
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Full Name:</span>
            <span className="font-medium">{user.full_name || 'Not provided'}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{user.email}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Phone:</span>
            <span className="font-medium">{user.phone_number}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">License Number:</span>
            <span className="font-medium">{user.license_number || 'Not provided'}</span>
          </div>
          
          {user.tin_number && (
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">TIN Number:</span>
              <span className="font-medium">{user.tin_number}</span>
            </div>
          )}
          
          {user.specialization && (
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Specialization:</span>
              <span className="font-medium">{user.specialization}</span>
            </div>
          )}
        </div>

        <label className="flex items-start gap-3 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
          />
          <span className="text-sm text-gray-700">
            I confirm that all information provided is true, accurate, and complete. 
            I understand that providing false information may result in immediate rejection 
            and potential legal action.
          </span>
        </label>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !confirmed}
          className="w-full bg-gradient-to-r from-teal-700 to-cyan-600"
        >
          {isSubmitting ? 'Submitting...' : (isResubmit ? 'Resubmit for Verification' : 'Submit for Verification')}
        </Button>
      </div>
    </div>
  );
}