// components/auth/EmailVerificationDialog.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, RotateCw, X } from 'lucide-react';
import { authService } from '@/services/auth.service';
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
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
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

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setCode(['', '', '', '', '', '']);
      setTimeLeft(60);
      setCanResend(false);
      setError(null);
      setIsVerifying(false);
      // Focus first input
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [open]);

  const handleVerify = async () => {
    setError(null);
    setIsVerifying(true);

    try {
      await authService.verifyEmail({
        email,
        code: code.join(''),
      });
      
      toast.success('Email verified successfully!');
      onVerificationComplete();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid verification code');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setIsResending(true);

    try {
      await authService.resendVerificationCode({ email });
      setTimeLeft(60);
      setCanResend(false);
      toast.success('Verification code resent!');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to resend code');
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
    
    // Focus the next empty input or last filled
    const lastFilledIndex = newCode.findLastIndex(digit => digit !== '');
    if (lastFilledIndex < 5) {
      inputRefs.current[lastFilledIndex + 1]?.focus();
    }
  };

  const isComplete = code.every(digit => digit !== '');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="relative p-6 pb-0">
          <button
            onClick={onCancel}
            className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
          <div className="text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Verify Your Email</h3>
            <p className="text-sm text-gray-600 mt-1">
              We've sent a verification code to <br />
              <strong className="text-teal-600">{email}</strong>
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <Alert variant="destructive" className="text-sm">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center gap-3">
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
                className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <Button
            onClick={handleVerify}
            disabled={isVerifying || !isComplete}
            className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isVerifying ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>

          <div className="text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center justify-center gap-2 mx-auto"
              >
                <RotateCw className={`h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
                {isResending ? 'Sending...' : 'Resend verification code'}
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                Resend code in <span className="font-medium text-teal-600">{timeLeft}</span> seconds
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};