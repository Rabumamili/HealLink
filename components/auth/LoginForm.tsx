'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { login, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setError(null);
    login(data, {
      onError: (err: any) => {
        setError(err.response?.data?.message || 'Invalid email or password');
      },
    });
  };

  return (
    <div className="w-full max-w-[480px] space-y-8">
      {/* Main Login Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 md:p-10 border border-white/40 shadow-xl">
        <div className="flex flex-col items-center text-center mb-10">
          <h1 className="text-[32px] font-bold leading-tight text-on-surface mb-2">Welcome Back!</h1>
          <p className="text-[16px] text-on-surface-variant">The safe way to access your health information</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-error-container text-on-error-container rounded-xl p-4 text-sm">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-[14px] font-semibold tracking-wide text-on-surface-variant px-1" htmlFor="email">
              Email or Phone Number
            </label>
            <div className="relative group">
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register('email')}
                className={`w-full bg-[#F1F5F9] border-none rounded-xl py-4 pl-4 pr-12 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all font-body-md outline-none text-[16px] ${errors.email ? 'ring-1 ring-error' : ''}`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-error px-1 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-[14px] font-semibold tracking-wide text-on-surface-variant px-1" htmlFor="password">
              Password
            </label>
            <div className="relative group">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                className={`w-full bg-[#F1F5F9] border-none rounded-xl py-4 pl-4 pr-12 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all font-body-md outline-none text-[16px] ${errors.password ? 'ring-1 ring-error' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-error px-1 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-primary text-on-primary py-4 rounded-xl font-semibold text-[18px] hover:translate-y-[-2px] hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isLoggingIn ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signin in....
              </>
            ) : (
              <>
                Sign in
              </>
            )}
          </button>

          {/* Forgot Password Link - Moved to bottom */}
          <div className="text-center">
            <Link href="/forgot-password" className="text-primary hover:underline text-[14px] font-semibold">
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};