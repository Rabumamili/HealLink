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
  center_name: string;
  center_address: string;
  center_phone: string;
  center_license_number: string;
  center_tin_number: string;
  center_accreditation: string;
  services_description: string;
  password: string;
  confirmPassword: string;
}

export const DiagnosticRegisterForm = () => {
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
    center_name: '',
    center_address: '',
    center_phone: '',
    center_license_number: '',
    center_tin_number: '',
    center_accreditation: '',
    services_description: '',
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
      !formData.center_name ||
      !formData.center_address ||
      !formData.center_phone ||
      !formData.center_license_number ||
      !formData.center_tin_number ||
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
      setError('Please upload your center registration document');
      return;
    }

    setError(null);

    try {
      const submitFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitFormData.append(key, String(value));
      });
      submitFormData.append('role', 'diagnostic_admin');
      submitFormData.append('registration_document', registrationFile);

      await registerProvider(submitFormData, 'diagnostic_center');
      
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
      sidebarIcon="science"
      sidebarTitle="Register Your Diagnostic Center"
      sidebarBenefits={[
        'Accredited diagnostics',
        'Digital test reporting',
        'Integrated EMR system',
      ]}
      title={step === 1 ? 'Diagnostic Center Registration' : 'Verify Your Email'}
      subtitle={
        step === 1
          ? 'Register your diagnostic facility to join HealLink.'
          : `We've sent a verification code to ${formData.email}`
      }
      stepBadge={step === 1 ? 'Step 1 of 2' : 'Step 2 of 2'}
    >
      {step === 1 ? (
        <div className="space-y-5 sm:space-y-6 md:space-y-7">
          {error && <ErrorBanner message={error} />}

          {/* Center Information Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <SectionHeader icon="biotech" title="Center Information" />

            <div className="space-y-3 sm:space-y-4">
              {/* Center Name - Full width */}
              <div className="space-y-1.5">
                <label className={labelClass}>Diagnostic Center Name *</label>
                <div className="relative group">
                  <input
                    className={inputClass}
                    placeholder="City Diagnostic Lab"
                    type="text"
                    value={formData.center_name}
                    onChange={(e) => update('center_name', e.target.value)}
                  />
                  <InputFieldIcon name="domain" />
                </div>
              </div>

              {/* Center Address - Full width */}
              <div className="space-y-1.5">
                <label className={labelClass}>Center Address *</label>
                <textarea
                  className={`${inputClass} resize-none min-h-[72px] sm:min-h-[76px] md:min-h-[80px]`}
                  placeholder="123 Diagnostic Street, Healthcare District"
                  rows={2}
                  value={formData.center_address}
                  onChange={(e) => update('center_address', e.target.value)}
                />
              </div>

              {/* Phone and Accreditation - Responsive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Center Phone *</label>
                  <div className="relative group">
                    <input
                      className={inputClass}
                      placeholder="+251 123 456 789"
                      type="tel"
                      value={formData.center_phone}
                      onChange={(e) => update('center_phone', e.target.value)}
                    />
                    <InputFieldIcon name="call" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>Accreditation</label>
                  <div className="relative group">
                    <input
                      className={inputClass}
                      placeholder="ISO 15189, CLIA, etc."
                      type="text"
                      value={formData.center_accreditation}
                      onChange={(e) => update('center_accreditation', e.target.value)}
                    />
                    <InputFieldIcon name="verified" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Optional: Include relevant accreditations
                  </p>
                </div>
              </div>

              {/* Services Description - Full width */}
              <div className="space-y-1.5">
                <label className={labelClass}>Services Description</label>
                <textarea
                  className={`${inputClass} resize-none min-h-[72px] sm:min-h-[80px]`}
                  placeholder="X-ray, MRI, Blood Tests, Ultrasound, CT Scan, etc."
                  rows={2}
                  value={formData.services_description}
                  onChange={(e) => update('services_description', e.target.value)}
                />
                <p className="text-xs text-slate-500 mt-1">
                  List the main diagnostic services you provide
                </p>
              </div>
            </div>
          </div>

          {/* Legal & Registration Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <SectionHeader icon="verified_user" title="Legal & Registration" />

            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>License Number *</label>
                  <input
                    className={inputClass}
                    placeholder="DCL-2024-00123"
                    type="text"
                    value={formData.center_license_number}
                    onChange={(e) => update('center_license_number', e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>TIN Number *</label>
                  <input
                    className={inputClass}
                    placeholder="123456789"
                    type="text"
                    value={formData.center_tin_number}
                    onChange={(e) => update('center_tin_number', e.target.value)}
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
          </div>

          {/* Account Credentials Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <SectionHeader icon="lock" title="Account Credentials" />

            <div className="space-y-3 sm:space-y-4">
              {/* Email - Full width */}
              <div className="space-y-1.5">
                <label className={labelClass}>Email Address *</label>
                <div className="relative group">
                  <input
                    className={inputClass}
                    placeholder="admin@diagnostic.com"
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
          <div className="pt-3 sm:pt-4 md:pt-5 flex flex-col items-center gap-3 sm:gap-4">
            <SubmitButton
              type="button"
              label="Register Diagnostic Center"
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