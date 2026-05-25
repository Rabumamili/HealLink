// app/(auth)/login/page.tsx
'use client';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Welcome Back!" 
      description="Sign in to your HealLink account"
      showRegisterLink={true}
    >
      <LoginForm />
    </AuthLayout>
  );
}