// components/auth/ForgotPasswordForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Send } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordForm = () => {
  const { forgotPassword, isSendingResetLink } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    setError(null);
    setEmail(data.email);
    forgotPassword(data, {
      onSuccess: () => setSubmitted(true),
      onError: (err: any) => {
        setError(err.response?.data?.message || 'Failed to send reset link');
      },
    });
  };

  if (submitted) {
    return (
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Check Your Email</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 break-all">
            We've sent a password reset link to <strong className="text-teal-600">{email}</strong>
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setSubmitted(false)}
          className="mt-2 h-10 sm:h-11 text-sm sm:text-base"
        >
          Try another email
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
      {error && (
        <Alert variant="destructive" className="text-sm">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="email" className="text-sm sm:text-base">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="patient@healink.com"
          {...register('email')}
          className={`h-10 sm:h-11 text-sm sm:text-base ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="text-xs sm:text-sm text-red-500">{errors.email.message}</p>}
        <p className="text-xs sm:text-sm text-gray-500">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      <Button type="submit" className="w-full h-10 sm:h-11 bg-teal-600 hover:bg-teal-700 text-sm sm:text-base" disabled={isSendingResetLink}>
        {isSendingResetLink ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Sending...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send Reset Link
          </>
        )}
      </Button>
    </form>
  );
};