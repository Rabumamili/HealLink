'use client';

import { useState, useEffect, useRef } from 'react';
import { Mail, RotateCw, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface EmailVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  role: string;
  tempUserId: string;
  onVerificationComplete: () => void;
  onCancel: () => void;
}

export const EmailVerificationDialog = ({
  open,
  onOpenChange,
  email,
  role,
  tempUserId,
  onVerificationComplete,
  onCancel,
}: EmailVerificationDialogProps) => {
  const { verifyEmail, resendVerificationCode, isVerifyingEmail } = useAuth();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;
    
    if (timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, canResend, open]);

  useEffect(() => {
    if (open) {
      setCode(['', '', '', '', '', '']);
      setTimeLeft(60);
      setCanResend(false);
      setError(null);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [open]);

  const handleVerify = async () => {
    // FIXED: Use code.join('') instead of verificationCode
    const verificationCodeString = code.join('');
    if (!verificationCodeString || verificationCodeString.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    setError(null);

    try {
      // This will verify email AND submit professional verification documents
      // (since documents were already sent during registration)
      await verifyEmail({
        email,
        code: verificationCodeString,
      
      });
      
      toast.success('Email verified successfully! Professional verification submitted.');
      onVerificationComplete();
    } catch (err: any) {
      setError(err?.message || 'Verification failed');
    }
  };

  const handleResend = async () => {
    // FIXED: Use timeLeft instead of resendTimer
    if (timeLeft > 0) return;
    setError(null);
    setIsResending(true);

    try {
      await resendVerificationCode({ email });
      setTimeLeft(60);
      setCanResend(false);
      toast.success('Verification code resent!');
    } catch (err: any) {
      setError(err?.message || 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const pastedCode = pastedData.split('');
    const newCode = [...code];
    for (let i = 0; i < Math.min(pastedCode.length, 6); i++) {
      if (pastedCode[i].match(/[0-9]/)) {
        newCode[i] = pastedCode[i];
      }
    }
    setCode(newCode);
    
    const lastFilledIndex = newCode.findLastIndex(digit => digit !== '');
    if (lastFilledIndex < 5) {
      inputRefs.current[lastFilledIndex + 1]?.focus();
    }
  };

  const isComplete = code.every(digit => digit !== '');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-[480px] mx-4">
        <div className="rounded-2xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-xl sm:rounded-3xl">
          <div className="relative px-6 py-5 sm:px-8 sm:py-6">
            {/* Close Button */}
            <button
              onClick={onCancel}
              className="absolute right-4 top-4 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>

            {/* Header */}
            <div className="mb-4 flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-700 to-cyan-500 shadow-lg sm:h-14 sm:w-14">
                <Mail className="h-6 w-6 text-white sm:h-7 sm:w-7" />
              </div>
              <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
                Verify Your Email
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                We've sent a verification code to <br />
                <strong className="text-teal-600">{email}</strong>
              </p>
              {role !== 'patient' && (
                <p className="mt-2 text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  Professional verification will be submitted automatically
                </p>
              )}
            </div>

            {/* Content */}
            <div className="space-y-4 sm:space-y-5">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 sm:rounded-xl sm:px-4 sm:py-2.5">
                  {error}
                </div>
              )}

              {/* Code Inputs */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="h-12 w-12 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all sm:h-14 sm:w-14 sm:text-2xl"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerify}
                disabled={isVerifyingEmail || !isComplete}
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-700 to-cyan-600 py-2 text-xs font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] disabled:opacity-60 sm:rounded-xl sm:py-2.5 sm:text-sm"
              >
                {isVerifyingEmail ? (
                  <>
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent sm:h-3.5 sm:w-3.5" />
                    Verifying & Submitting...
                  </>
                ) : (
                  'Verify Email & Submit'
                )}
              </button>

              {/* Resend Section */}
              <div className="text-center">
                {canResend ? (
                  <button
                    onClick={handleResend}
                    disabled={isResending}
                    className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-800 text-xs font-semibold sm:text-sm"
                  >
                    <RotateCw className={`h-3.5 w-3.5 ${isResending ? 'animate-spin' : ''}`} />
                    {isResending ? 'Sending...' : 'Resend verification code'}
                  </button>
                ) : (
                  <p className="text-xs text-slate-500">
                    Resend code in <span className="font-semibold text-teal-600">{timeLeft}</span> seconds
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};