'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight, Mail, ShieldPlus, CheckCircle2, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { login, isLoggingIn, error: authError } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  // Handle auth errors
  useEffect(() => {
    if (authError) {
      // Format error message for better UX
      let errorMessage = authError;
      
      if (authError.toLowerCase().includes('invalid') || 
          authError.toLowerCase().includes('credentials')) {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (authError.toLowerCase().includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (authError.toLowerCase().includes('too many')) {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }
      
      setShowError(errorMessage);
      
      // Auto-hide error after 5 seconds
      const timer = setTimeout(() => setShowError(null), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowError(null);
    }
  }, [authError]);

  const onSubmit = async (data: LoginFormData) => {
    // Clear previous errors
    setShowError(null);
    
    try {
      await login(data);
      // Reset form on successful login (optional)
      // reset();
    } catch (err) {
      // Error is handled by the useAuth hook and authError state
      console.error('Login submission error:', err);
    }
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-3 py-4">

      {/* Background */}
      <div className="absolute left-[-5%] top-[-5%] h-[220px] w-[220px] rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-[-5%] right-[-5%] h-[220px] w-[220px] rounded-full bg-teal-500/10 blur-3xl" />

      {/* CARD ANIMATION */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[750px]"
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

                <h2 className="text-[25px] font-bold">Welcome Back</h2>

                <p className="mt-2 text-xs text-white/80 text-[19px] leading-relaxed">
                  Sign in to your secure healthcare dashboard and continue managing care workflows seamlessly.
                </p>

                <div className="mt-3 rounded-lg bg-white/10 p-3">
                  <p className="text-[17px] text-white/80">
                    Unified platform for doctors, clinics, and patients with secure access.
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-[15px] text-white/80">
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
                <h2 className="text-25 font-bold text-slate-900">Welcome Back</h2>
                <p className="mt-2 text-[17px] text-slate-500">
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
                <h1 className="text-[17] font-semibold text-slate-900">
                  Sign in
                </h1>
                <p className="mt-1 text-[16] text-slate-500">
                  Access your account securely
                </p>
              </motion.div>

              {/* ERROR DISPLAY */}
              <AnimatePresence mode="wait">
                {showError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mb-4 rounded-lg bg-red-50 p-3 border border-red-200"
                    role="alert"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-red-700">{showError}</p>
                      </div>
                      <button
                        onClick={() => setShowError(null)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Close error"
                      >
                        ×
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
                      aria-invalid={!!errors.email}
                      className={`h-11 w-full rounded-xl bg-slate-100/70 px-4 text-[17px] outline-none transition focus:bg-white focus:ring-2 ${
                        errors.email 
                          ? 'border-red-500 ring-2 ring-red-500/20' 
                          : 'focus:ring-teal-500/20'
                      }`}
                      placeholder="name@example.com"
                    />
                    <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>

                  {errors.email && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-xs text-red-500"
                    >
                      {errors.email.message}
                    </motion.p>
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
                      aria-invalid={!!errors.password}
                      className={`h-11 w-full rounded-xl bg-slate-100/70 px-4 text-sm outline-none transition focus:bg-white focus:ring-2 ${
                        errors.password 
                          ? 'border-red-500 ring-2 ring-red-500/20' 
                          : 'focus:ring-teal-500/20'
                      }`}
                      placeholder="••••••••"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {errors.password && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-xs text-red-500"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}

                  <AnimatePresence>
                    {isCapsLock && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="mt-1 text-xs text-amber-600"
                      >
                        ⚠️ Caps Lock is ON
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* REMEMBER ME & FORGOT PASSWORD */}
                <motion.div variants={item} className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-[13] text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span>Remember me</span>
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-[15px] font-medium text-teal-700 hover:text-teal-800 hover:underline transition"
                  >
                    Forgot password?
                  </Link>
                </motion.div>

                {/* SUBMIT BUTTON */}
                <motion.button
                  variants={item}
                  whileHover={{ scale: isLoggingIn ? 1 : 1.02 }}
                  whileTap={{ scale: isLoggingIn ? 1 : 0.98 }}
                  type="submit"
                  disabled={isLoggingIn}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 to-cyan-600 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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

              {/* REGISTER FOOTER */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-5 border-t pt-4 text-center"
              >
                <p className="text-[14px] text-slate-500">
                  Don&apos;t have an account?{' '}
                  <Link className="font-medium text-teal-700 hover:text-teal-800 hover:underline transition" href="/register/select-role">
                    Create an account
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