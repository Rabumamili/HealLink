// components/auth/ForgotPasswordForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft, ShieldPlus, CheckCircle2, AlertCircle, Send } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordForm = () => {
  const { forgotPassword, isSendingResetLink } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  // Handle auth errors
  useEffect(() => {
    if (error) {
      let errorMessage = error;
      
      if (error.toLowerCase().includes('not found')) {
        errorMessage = 'No account found with this email address.';
      } else if (error.toLowerCase().includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.toLowerCase().includes('too many')) {
        errorMessage = 'Too many attempts. Please try again later.';
      }
      
      setShowError(errorMessage);
      
      const timer = setTimeout(() => setShowError(null), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowError(null);
    }
  }, [error]);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    setShowError(null);
    setSubmittedEmail(data.email);
    
    try {
      await forgotPassword(data);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset link');
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

  // Success State
  if (submitted) {
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
              {/* LEFT PANEL - Same as login */}
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

                  <h2 className="text-[20px] font-bold">Reset Password</h2>

                  <p className="mt-2 text-[15px] text-white/80 leading-relaxed">
                    We've sent a password reset link to your email. Follow the instructions to create a new password.
                  </p>

                  <div className="mt-3 rounded-lg bg-white/10 p-3">
                    <p className="text-[1px] text-white/80 break-all">
                      Link sent to: <strong className="font-semibold">{submittedEmail}</strong>
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-white/80">
                  <div className="flex gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 mt-0.5" />
                    Check your spam folder if you don't see the email
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 mt-0.5" />
                    Link expires in 1 hour for security
                  </div>
                </div>
              </motion.div>

              {/* SUCCESS SIDE */}
              <div className="bg-white/80 px-4 py-6 sm:px-6 sm:py-7">
                {/* MOBILE HEADER */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-5 text-center md:hidden"
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <Mail className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Check Your Email</h2>
                  <p className="mt-2 text-xs text-slate-500">
                    We've sent a reset link to <br />
                    <strong className="text-teal-600 break-all">{submittedEmail}</strong>
                  </p>
                </motion.div>

                {/* DESKTOP HEADER */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-5 hidden md:block"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                      <Mail className="w-7 h-7 text-green-600" />
                    </div>
                  </div>
                  <h1 className="text-2xl font-semibold text-slate-900 text-center">
                    Check Your Email
                  </h1>
                  <p className="mt-2 text-sm text-slate-500 text-center">
                    We've sent a password reset link to your email address
                  </p>
                </motion.div>

                {/* TRY ANOTHER EMAIL BUTTON */}
                <motion.div
                  variants={item}
                  className="mt-6 space-y-4"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setSubmittedEmail('');
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 hover:shadow-sm"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Try another email
                  </button>

                  <div className="border-t pt-4 text-center">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-800 hover:underline transition"
                    >
                      Back to Sign In
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>

                {/* MOBILE FOOTER INFO */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 border-t pt-4 text-center md:hidden"
                >
                  <p className="text-xs text-slate-500">
                    Didn't receive the email? Check your spam folder or{' '}
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setSubmittedEmail('');
                      }}
                      className="font-medium text-teal-700 hover:underline"
                    >
                      try again
                    </button>
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Form State
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
        className="relative z-10 w-full max-w-[700px]"
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
                <div className="mb-4  mt-5 flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
                  <ShieldPlus className="h-5 w-5" />
                </div>

                <h2 className="text-[30px] font-bold">Forgot Password?</h2>


                <div className="mt-3 rounded-lg bg-white/10 p-3">
                  <p className="text-[18px] text-white/80">
                    Make sure to check your spam folder if you don't see our email within a few minutes.
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-[17px] mt-5 text-white/80">
                <div className="flex gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 mt-0.5" />
                  Secure password reset process
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 mt-0.5" />
                  Link expires in 1 hour for security
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
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-700 to-cyan-500 shadow-lg mx-auto">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-[30px] font-bold text-slate-900">Forgot Password?</h2>
                <p className="mt-2 text-[20px] text-slate-500">
                  Enter your email to reset your password
                </p>
              </motion.div>

              {/* DESKTOP HEADER */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-5 hidden md:block text-center"
              >
                <h1 className="text-[30px] font-semibold text-slate-900">
                  Reset Password
                </h1>
                <p className="mt-1 text-[20px] text-slate-500">
                  Enter your email to receive a reset link
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
                  <label className="mb-2 block text-[17px] font-medium text-slate-700">
                    Email Address
                  </label>

                  <div className="relative">
                    <input
                      type="email"
                      {...register('email')}
                      aria-invalid={!!errors.email}
                      className={`h-11 w-full rounded-xl bg-slate-100/70 px-4 text-[16px] outline-none transition focus:bg-white focus:ring-2 ${
                        errors.email 
                          ? 'border-red-500 ring-2 ring-red-500/20' 
                          : 'focus:ring-teal-500/20'
                      }`}
                      placeholder="patient@healink.com"
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

                  <p className="mt-2 text-[15px] text-slate-500">
                    Enter your registered email and we'll send you a link to reset your password.
                  </p>
                </motion.div>

                {/* SUBMIT BUTTON */}
                <motion.button
                  variants={item}
                  whileHover={{ scale: isSendingResetLink ? 1 : 1.02 }}
                  whileTap={{ scale: isSendingResetLink ? 1 : 0.98 }}
                  type="submit"
                  disabled={isSendingResetLink}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 to-cyan-600 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSendingResetLink ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending reset link...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </motion.form>

              {/* BACK TO LOGIN FOOTER */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-5 border-t pt-4 text-center"
              >
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-800 hover:underline transition"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};