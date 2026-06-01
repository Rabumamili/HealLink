'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight, Mail, ShieldPlus, CheckCircle2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { login, isLoggingIn, error: authError } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-3 py-6">

      {/* Background */}
      <div className="absolute left-[-5%] top-[-5%] h-[220px] w-[220px] rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-[-5%] right-[-5%] h-[220px] w-[220px] rounded-full bg-teal-500/10 blur-3xl" />

      {/* CARD ANIMATION */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[900px]"
      >
        <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/90 shadow-xl backdrop-blur-xl">

          <div className="grid md:grid-cols-[1fr_1.2fr]">

            {/* LEFT PANEL */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="hidden flex-col justify-between bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-600 p-6 text-white md:flex"
            >
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
                  <ShieldPlus className="h-5 w-5" />
                </div>

                <h2 className="text-xl font-bold">Welcome Back</h2>

                <p className="mt-2 text-xs text-white/80 leading-relaxed">
                  Sign in to your secure healthcare dashboard and continue managing care workflows seamlessly.
                </p>

                <div className="mt-3 rounded-lg bg-white/10 p-3">
                  <p className="text-[11px] text-white/80">
                    Unified platform for doctors, clinics, and patients with secure access.
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-white/80">
                <div className="flex gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 mt-0.5" />
                  Enterprise-grade authentication
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 mt-0.5" />
                  Secure healthcare ecosystem
                </div>
              </div>
            </motion.div>

            {/* FORM SIDE */}
            <div className="bg-white/80 px-4 py-6 sm:px-6 sm:py-7">

              {/* MOBILE HEADER */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-5 text-center md:hidden"
              >
                <h2 className="text-xl font-bold text-slate-900">Welcome Back</h2>
                <p className="mt-2 text-xs text-slate-500">
                  Sign in to your secure healthcare dashboard.
                </p>
              </motion.div>

              {/* DESKTOP HEADER */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-5 hidden md:block"
              >
                <h1 className="text-2xl font-semibold text-slate-900">
                  Sign in
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Access your account securely
                </p>
              </motion.div>

              {/* FORM */}
              <motion.form
                variants={container}
                initial="hidden"
                animate="show"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >

                {/* EMAIL */}
                <motion.div variants={item}>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Email
                  </label>

                  <div className="relative">
                    <input
                      type="email"
                      {...register('email')}
                      className="h-11 w-full rounded-xl bg-slate-100/70 px-4 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-teal-500/20"
                      placeholder="name@example.com"
                    />
                    <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>

                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </motion.div>

                {/* PASSWORD */}
                <motion.div variants={item}>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      onKeyUp={(e) =>
                        setIsCapsLock(e.getModifierState('CapsLock'))
                      }
                      className="h-11 w-full rounded-xl bg-slate-100/70 px-4 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-teal-500/20"
                      placeholder="••••••••"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.password.message}
                    </p>
                  )}

                  {isCapsLock && (
                    <p className="mt-1 text-xs text-amber-600">
                      Caps Lock is ON
                    </p>
                  )}
                </motion.div>

                {/* REMEMBER */}
                <motion.div variants={item} className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 accent-teal-600"
                    />
                    Remember me
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-teal-700 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </motion.div>

                {/* BUTTON */}
                <motion.button
                  variants={item}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoggingIn}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 to-cyan-600 text-sm font-semibold text-white shadow-md disabled:opacity-60"
                >
                  {isLoggingIn ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>

              </motion.form>

              {/* FOOTER */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-5 border-t pt-4 text-center"
              >
                <p className="text-sm text-slate-500">
                  Don&apos;t have an account?{' '}
                  <Link className="font-medium text-teal-700 hover:underline" href="/register">
                    Register
                  </Link>
                </p>
              </motion.div>

            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};