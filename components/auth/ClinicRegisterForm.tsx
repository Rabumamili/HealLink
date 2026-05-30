'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  RegisterFormShell,
  SectionHeader,
  ErrorBanner,
  FileUploadZone,
  SubmitButton,
  LoginLink,
  VerificationStep,
  InputFieldIcon,
  inputClass,
  labelClass,
} from './register-form-ui';

interface FormData {
  email: string;
  clinic_name: string;
  clinic_address: string;
  clinic_phone: string;
  clinic_license_number: string;
  clinic_tin_number: string;
  operating_hours: string;
  password: string;
  confirmPassword: string;
}

export const ClinicRegisterForm = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { registerProvider, isRegistering } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationFile, setRegistrationFile] = useState<File | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    clinic_name: '',
    clinic_address: '',
    clinic_phone: '',
    clinic_license_number: '',
    clinic_tin_number: '',
    operating_hours: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleNext = async () => {
    if (
      !formData.clinic_name ||
      !formData.clinic_address ||
      !formData.clinic_phone ||
      !formData.clinic_license_number ||
      !formData.clinic_tin_number ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('Please fill in all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!registrationFile) {
      setError('Please upload your clinic registration document');
      return;
    }

    setError(null);

    try {
      const submitFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitFormData.append(key, String(value));
      });
      submitFormData.append('role', 'clinic_admin');
      submitFormData.append('registration_document', registrationFile);

      await registerProvider(submitFormData, 'clinic');
      
      toast.success('Verification code sent to your email');
      setStep(2);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    setError(null);

    try {
      const { verifyEmail } = useAuth();
      await verifyEmail({ email: formData.email, code: verificationCode });
      toast.success('Email verified successfully! Please login.');
      router.push('/login?verified=true');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification failed';
      setError(message);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    try {
      const { resendVerificationCode } = useAuth();
      await resendVerificationCode(formData.email);
      toast.success('Verification code resent');
      setResendTimer(60);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to resend code';
      setError(message);
    }
  };

  const update = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <RegisterFormShell
      sidebarIcon="local_hospital"
      sidebarTitle="Register Your Clinic"
      sidebarBenefits={[
        'Verified clinic credentials',
        'Staff management tools',
        'Integrated patient system',
      ]}
      title={step === 1 ? 'Clinic Registration' : 'Verify Your Email'}
      subtitle={
        step === 1
          ? 'Register your healthcare facility to join HealLink.'
          : `We've sent a verification code to ${formData.email}`
      }
      stepBadge={step === 1 ? 'Step 1 of 2' : 'Step 2 of 2'}
    >
      {step === 1 ? (
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {error && <ErrorBanner message={error} />}

          {/* Clinic Information Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <SectionHeader icon="local_hospital" title="Clinic Information" />

            <div className="space-y-3 sm:space-y-4">
              {/* Clinic Name */}
              <div className="space-y-1.5">
                <label className={labelClass}>Clinic Name *</label>
                <div className="relative group">
                  <input
                    className={inputClass}
                    placeholder="Central Health Clinic"
                    type="text"
                    value={formData.clinic_name}
                    onChange={(e) => update('clinic_name', e.target.value)}
                  />
                  <InputFieldIcon name="domain" />
                </div>
              </div>

              {/* Clinic Address */}
              <div className="space-y-1.5">
                <label className={labelClass}>Clinic Address *</label>
                <textarea
                  className={`${inputClass} resize-none min-h-[72px] sm:min-h-[76px] md:min-h-[80px]`}
                  placeholder="123 Medical Street, Healthcare District"
                  rows={2}
                  value={formData.clinic_address}
                  onChange={(e) => update('clinic_address', e.target.value)}
                />
              </div>

              {/* Two columns for phone and hours - responsive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Clinic Phone *</label>
                  <div className="relative group">
                    <input
                      className={inputClass}
                      placeholder="+251 123 456 789"
                      type="tel"
                      value={formData.clinic_phone}
                      onChange={(e) => update('clinic_phone', e.target.value)}
                    />
                    <InputFieldIcon name="call" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>Operating Hours</label>
                  <div className="relative group">
                    <input
                      className={inputClass}
                      placeholder="8:00 AM - 6:00 PM"
                      type="text"
                      value={formData.operating_hours}
                      onChange={(e) => update('operating_hours', e.target.value)}
                    />
                    <InputFieldIcon name="schedule" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legal & Registration Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <SectionHeader icon="verified_user" title="Legal & Registration" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}>License Number *</label>
                <input
                  className={inputClass}
                  placeholder="CL-2024-00123"
                  type="text"
                  value={formData.clinic_license_number}
                  onChange={(e) => update('clinic_license_number', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>TIN Number *</label>
                <input
                  className={inputClass}
                  placeholder="123456789"
                  type="text"
                  value={formData.clinic_tin_number}
                  onChange={(e) => update('clinic_tin_number', e.target.value)}
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-1.5">
              <label className={labelClass}>Registration Document *</label>
              <FileUploadZone
                fileName={registrationFile?.name ?? null}
                emptyLabel="Upload Registration Certificate (PDF, JPG, PNG) *"
                onClick={() => fileInputRef.current?.click()}
                inputRef={fileInputRef}
                onChange={(e) => setRegistrationFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-slate-500 mt-1">
                Accepted formats: PDF, JPG, PNG (Max 5MB)
              </p>
            </div>
          </div>

          {/* Account Credentials Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <SectionHeader icon="lock" title="Account Credentials" />

            <div className="space-y-3 sm:space-y-4">
              {/* Email - Full width on all devices */}
              <div className="space-y-1.5">
                <label className={labelClass}>Email Address *</label>
                <div className="relative group">
                  <input
                    className={inputClass}
                    placeholder="admin@clinic.com"
                    type="email"
                    value={formData.email}
                    onChange={(e) => update('email', e.target.value)}
                  />
                  <InputFieldIcon name="mail" />
                </div>
              </div>

              {/* Password Fields - Responsive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Password *</label>
                  <div className="relative group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`${inputClass} pr-10`}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => update('password', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Minimum 6 characters
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>Confirm Password *</label>
                  <div className="relative group">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={`${inputClass} pr-10`}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => update('confirmPassword', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 sm:pt-3 md:pt-4 flex flex-col items-center gap-3 sm:gap-4">
            <SubmitButton
              type="button"
              label="Register Clinic"
              loadingLabel="Submitting..."
              isLoading={isRegistering}
              onClick={handleNext}
            />
            <LoginLink />
          </div>
        </div>
      ) : (
        <VerificationStep
          email={formData.email}
          verificationCode={verificationCode}
          onCodeChange={setVerificationCode}
          resendTimer={resendTimer}
          onResend={handleResendCode}
          onBack={() => {
            setStep(1);
            setError(null);
          }}
          onVerify={handleVerify}
          isLoading={isRegistering}
          error={error}
        />
      )}
    </RegisterFormShell>
  );
};