// app/(auth)/verification-pending/page.tsx
'use client';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Shield, Mail, Clock, CheckCircle, Building2, Stethoscope, FlaskConical } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function VerificationPendingPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || '';

  const getRoleIcon = () => {
    switch (role) {
      case 'doctor': return <Stethoscope className="w-10 h-10 text-amber-600" />;
      case 'clinic_admin': return <Building2 className="w-10 h-10 text-amber-600" />;
      case 'diagnostic_admin': return <FlaskConical className="w-10 h-10 text-amber-600" />;
      default: return <Shield className="w-10 h-10 text-amber-600" />;
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case 'doctor': return 'Doctor Verification Pending';
      case 'clinic_admin': return 'Clinic Verification Pending';
      case 'diagnostic_admin': return 'Diagnostic Center Verification Pending';
      default: return 'Professional Verification Pending';
    }
  };

  const getRoleDescription = () => {
    switch (role) {
      case 'doctor': return 'Your medical credentials have been submitted to the Ministry of Health for verification.';
      case 'clinic_admin': return 'Your clinic credentials have been submitted to the Ministry of Health for verification.';
      case 'diagnostic_admin': return 'Your diagnostic center credentials have been submitted to the Ministry of Health for verification.';
      default: return 'Your professional credentials have been submitted to the Ministry of Health for verification.';
    }
  };

  return (
    <AuthLayout title="Verification Submitted" description="">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
          {getRoleIcon()}
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{getRoleTitle()}</h3>
          <p className="text-gray-600 mt-2">{getRoleDescription()}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-left">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-medium">Processing Time</p>
              <p className="text-sm text-gray-500">Typically 2-3 business days</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-teal-600" />
            <div>
              <p className="font-medium">Email Notification</p>
              <p className="text-sm text-gray-500">You'll receive an email once verified</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium">After Verification</p>
              <p className="text-sm text-gray-500">You can login and start using HealLink</p>
            </div>
          </div>
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link href="/login">Return to Login</Link>
        </Button>
      </div>
    </AuthLayout>
  );
}