// app/(auth)/register/page.tsx
'use client';

import { AuthLayout, RegisterForm } from '@/components/auth/';

export default function RegisterPage() {
  return (
    <AuthLayout 
      title="Create Account" 
      description="Join HealLink to manage your healthcare"
      showLoginLink={true}
    >
      <RegisterForm />
    </AuthLayout>
  );
}