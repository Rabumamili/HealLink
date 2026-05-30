// components/auth/ForgotPasswordForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Mail, Send, ArrowLeft } from 'lucide-react';

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
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#008B8B] via-[#006767] to-[#004f4f] px-4 py-8">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl" />
        
        <div className="relative z-10 w-full max-w-[480px]">
          <div className="rounded-2xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-xl sm:rounded-3xl">
            <div className="px-6 py-5 sm:px-8 sm:py-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Check Your Email</h3>
                  <p className="text-sm text-slate-600 mt-2">
                    We've sent a password reset link to <br />
                    <strong className="text-teal-600 break-all">{email}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Try another email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#008B8B] via-[#006767] to-[#004f4f] px-4 py-8">
      <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl" />
      
      <div className="relative z-10 w-full max-w-[480px]">
        <div className="rounded-2xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-xl sm:rounded-3xl">
          <div className="px-6 py-5 sm:px-8 sm:py-6">
            <div className="mb-4 flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-700 to-cyan-500 shadow-lg sm:h-14 sm:w-14">
                <Mail className="h-6 w-6 text-white sm:h-7 sm:w-7" />
              </div>
              <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
                Forgot Password?
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Enter your email to reset your password
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 sm:space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 sm:rounded-xl sm:px-4 sm:py-2.5">
                  {error}
                </div>
              )}

              <div className="space-y-1 sm:space-y-1.5">
                <label htmlFor="email" className="block text-xs font-semibold text-slate-600">
                  Email Address
                </label>
                <div className="group relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="patient@healink.com"
                    {...register('email')}
                    className={`w-full rounded-lg border border-transparent bg-slate-100/80 py-2 pl-3.5 pr-10 text-sm text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/10 sm:rounded-xl sm:py-2.5 sm:pl-4 sm:pr-11 sm:focus:ring-4 ${
                      errors.email ? 'border-red-400 ring-2 ring-red-200' : ''
                    }`}
                  />
                  <Mail className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-teal-600 sm:h-4 sm:w-4" />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
                <p className="text-xs text-slate-500">
                  Enter your email and we'll send you a link to reset your password.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSendingResetLink}
                className="group mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-700 to-cyan-600 py-2 text-xs font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] disabled:opacity-60 sm:mt-2 sm:rounded-xl sm:py-2.5 sm:text-sm"
              >
                {isSendingResetLink ? (
                  <>
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent sm:h-3.5 sm:w-3.5" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 border-t border-slate-200 pt-3 text-center sm:mt-5 sm:pt-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold text-teal-700 hover:underline sm:text-sm"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};