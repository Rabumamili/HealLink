'use client';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back!"
      description="Clinical precision in healthcare management"
      showRegisterLink={true}
    >
      <LoginForm />
    </AuthLayout>
  );
}