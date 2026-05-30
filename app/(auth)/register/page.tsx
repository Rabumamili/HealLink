'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { PatientRegisterForm } from '@/components/auth/PatientRegisterForm';
import { DoctorRegisterForm } from '@/components/auth/DoctorRegisterForm';
import { ClinicRegisterForm } from '@/components/auth/ClinicRegisterForm';
import { DiagnosticRegisterForm } from '@/components/auth/DiagnosticRegisterForm';

function RegisterContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  // Render the appropriate form based on role parameter
  switch (role) {
    case 'doctor':
      return <DoctorRegisterForm />;
    case 'clinic':
    case 'clinic_admin':
      return <ClinicRegisterForm />;
    case 'diagnostic_center':
    case 'diagnostic_admin':
      return <DiagnosticRegisterForm />;
    case 'patient':
    default:
      return <PatientRegisterForm />;
  }
}

export default function RegisterPage() {
  return (
    <AuthLayout>
      <Suspense fallback={
        <div className="w-full h-full min-h-[400px] bg-surface-container-lowest/95 backdrop-blur-xl rounded-[16px] md:rounded-[24px] border border-white/40 shadow-2xl overflow-hidden flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="mt-4 text-on-surface-variant text-sm">Loading...</p>
          </div>
        </div>
      }>
        <RegisterContent />
      </Suspense>
    </AuthLayout>
  );
}