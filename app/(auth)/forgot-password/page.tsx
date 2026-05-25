// app/(auth)/forgot-password/page.tsx
'use client';

import { AuthLayout, ForgotPasswordForm } from '@/components/auth/';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Reset Password" description="Enter your email to reset your password">
      <ForgotPasswordForm />
      <div className="text-center mt-4">
        <Link href="/login" className="text-sm text-teal-600 hover:text-teal-500">
          ← Back to login
        </Link>
      </div>
    </AuthLayout>
  );
}