// app/(auth)/register/page.tsx
'use client';

import { AuthLayout, ResetPasswordForm } from '@/components/auth/';

export default function ResetPasswordPage() {
  return (
    <AuthLayout 
      title="Reset Password" 
      description="Join HealLink to manage your healthcare"
      showLoginLink={true}
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}