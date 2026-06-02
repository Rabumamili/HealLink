'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { HealLinkIcon, type HealLinkIconName } from '@/components/icons/healink-icon';
import {InputFieldIcon} from '@/components/icons/ui-icons';

export const inputClass =
  'w-full px-4 py-2.5 bg-surface-container-low rounded-lg border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-[14px]';

export const labelClass = 'text-[12px] font-bold text-on-surface-variant px-1';

/** @deprecated Use InputFieldIcon with a HealLinkIconName instead */
export const iconClass =
  'absolute right-3 top-2.5 text-outline-variant group-focus-within:text-primary transition-colors pointer-events-none';

export { InputFieldIcon };

export function SectionHeader({ icon, title }: { icon: HealLinkIconName; title: string }) {
  return (
    <div className="flex items-center gap-2 text-primary font-bold text-[12px] uppercase tracking-wider border-b border-outline-variant/30 pb-1">
      <HealLinkIcon name={icon} size={18} />
      <span>{title}</span>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="bg-error-container text-on-error-container rounded-lg p-3 text-sm">{message}</div>
  );
}

interface RegisterFormShellProps {
  sidebarIcon: HealLinkIconName;
  sidebarTitle: string;
  sidebarBenefits: string[];
  title: string;
  subtitle: string;
  children: ReactNode;
  stepBadge?: string;
}

export function RegisterFormShell({
  sidebarIcon,
  sidebarTitle,
  sidebarBenefits,
  title,
  subtitle,
  children,
  stepBadge,
}: RegisterFormShellProps) {
  return (
    <div className="form-card w-full h-full max-h-full bg-surface-container-lowest/95 backdrop-blur-xl rounded-[16px] md:rounded-[24px] border border-white/40 shadow-2xl overflow-hidden flex flex-col min-h-0">
      <div className="flex flex-col md:flex-row h-full min-h-0 flex-1">
        <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="md:w-1/3 bg-primary-container p-5 md:p-8 flex flex-row md:flex-col items-center md:items-start justify-between text-on-primary-container shrink-0"
      >
          <div className="flex items-center md:block gap-3">
            <div className="w-10 h-10 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-lg md:rounded-2xl flex items-center justify-center mb-0 md:mb-6 shrink-0">
              <HealLinkIcon name={sidebarIcon} size={28} className="shrink-0 md:scale-125" />
            </div>
            <h1 className="font-headline-lg text-[18px] md:text-[24px] lg:text-[32px] font-bold leading-tight">
              {sidebarTitle}
            </h1>
          </div>
          <div className="hidden md:block space-y-3 opacity-90">
            {sidebarBenefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2">
                <HealLinkIcon name="check_circle" size={18} />
                <span className="text-[13px] font-semibold">{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="scrollable-form custom-scrollbar flex-1 min-h-0 overflow-y-auto p-5 md:p-8 lg:p-10">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <h2 className="font-headline-md text-[20px] md:text-[24px] font-semibold text-on-surface mb-1">
                {title}
              </h2>
              <p className="font-body-md text-on-surface-variant text-[13px]">{subtitle}</p>
            </div>
            {stepBadge && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container shrink-0">
                {stepBadge}
              </span>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

interface FileUploadZoneProps {
  fileName: string | null;
  emptyLabel?: string;
  onClick: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileUploadZone({
  fileName,
  emptyLabel = 'Upload Document (PDF/JPG)',
  onClick,
  inputRef,
  onChange,
}: FileUploadZoneProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      className="border-2 border-dashed border-outline-variant/30 rounded-xl p-4 flex flex-col items-center justify-center bg-surface-container-low/50 hover:bg-surface-container-high/50 transition-all cursor-pointer group active:bg-surface-container-high"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <HealLinkIcon
        name="cloud_upload"
        size={32}
        className="text-outline-variant group-hover:text-primary transition-colors"
      />
      <p className="text-[13px] text-on-surface-variant mt-1 text-center">
        {fileName || emptyLabel}
      </p>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={onChange}
      />
    </div>
  );
}

interface SubmitButtonProps {
  label: string;
  loadingLabel?: string;
  isLoading: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export function SubmitButton({
  label,
  loadingLabel = 'Submitting...',
  isLoading,
  onClick,
  type = 'submit',
  disabled,
}: SubmitButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className="w-full bg-primary-container text-on-primary-container font-bold py-3.5 rounded-lg shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {loadingLabel}
        </>
      ) : (
        <>
          {label}
          <HealLinkIcon name="arrow_forward" size={18} />
        </>
      )}
    </button>
  );
}

export function LoginLink() {
  return (
    <p className="text-[16px] text-on-surface-variant">
      Already have an account?{' '}
      <Link href="/login" className="text-primary font-bold hover:underline">
        Log In
      </Link>
    </p>
  );
}

interface VerificationStepProps {
  email: string;
  verificationCode: string;
  onCodeChange: (code: string) => void;
  resendTimer: number;
  onResend: () => void;
  onBack: () => void;
  onVerify: () => void;
  isLoading: boolean;
  error: string | null;
}

export function VerificationStep({
  email,
  verificationCode,
  onCodeChange,
  resendTimer,
  onResend,
  onBack,
  onVerify,
  isLoading,
  error,
}: VerificationStepProps) {
  return (
    <div className="space-y-6">
      {error && <ErrorBanner message={error} />}

      <div className="text-center py-4">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-container/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <HealLinkIcon name="mark_email_read" size={40} className="text-primary-container" />
        </div>
        <p className="text-on-surface-variant text-[13px] mb-6">
          Please enter the 6-digit verification code sent to
          <br />
          <span className="font-bold text-primary">{email}</span>
        </p>

        <div className="max-w-xs mx-auto">
          <input
            type="text"
            maxLength={6}
            placeholder="000000"
            value={verificationCode}
            onChange={(e) => onCodeChange(e.target.value.replace(/\D/g, ''))}
            className={`${inputClass} text-center text-xl tracking-[0.4em]`}
          />
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={onResend}
            disabled={resendTimer > 0}
            className="text-primary hover:underline text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend code'}
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-surface-container-high text-on-surface-variant font-bold py-3 rounded-lg hover:bg-surface-container transition-all text-[14px]"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onVerify}
          disabled={isLoading || verificationCode.length !== 6}
          className="flex-1 bg-primary-container text-on-primary-container font-bold py-3 rounded-lg shadow-md hover:shadow-lg active:scale-[0.98] transition-all text-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Verifying...' : 'Verify & Continue'}
        </button>
      </div>
    </div>
  );
}
