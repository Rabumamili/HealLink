// components/auth/DiagnosticRegisterForm.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  operating_hours: string;
  established_year: string;
  password: string;
  confirmPassword: string;
}

export const DiagnosticRegisterForm = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { registerDiagnosticCenter, verifyEmail, resendVerificationCode, submitProfessionalVerification, isLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [license_document, setlicense_document] = useState<File | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [showVerificationCheckbox, setShowVerificationCheckbox] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    center_name: '',
    center_address: '',
    center_phone: '',
    center_license_number: '',
    center_tin_number: '',
    center_accreditation: '',
    services_description: '',
    operating_hours: '',
    established_year: '',
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
      !formData.center_name.trim() ||
      !formData.center_address.trim() ||
      !formData.center_phone.trim() ||
      !formData.center_license_number.trim() ||
      !formData.center_tin_number.trim() ||
      !formData.email.trim() ||
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
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }
    if (!/[a-z]/.test(formData.password)) {
      setError('Password must contain at least one lowercase letter');
      return;
    }
    if (!/[0-9]/.test(formData.password)) {
      setError('Password must contain at least one number');
      return;
    }
    if (!/[^A-Za-z0-9]/.test(formData.password)) {
      setError('Password must contain at least one special character');
      return;
    }
    if (!license_document) {
      setError('Please upload your center registration document');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const full_name = formData.center_name.trim();
      
      await registerDiagnosticCenter({
        email: formData.email,
        password: formData.password,
        full_name: full_name,
        phone_number: formData.center_phone,
        role: 'diagnostic_center',
        address: formData.center_address,
        license_number: formData.center_license_number,
        tin_number: formData.center_tin_number,
        description: formData.services_description,
        license_document: license_document,
      });
      
      toast.success('Verification code sent to your email');
      setStep(2);
    } catch (err: any) {
      // Format error message for better UX
      let errorMessage = err?.message || 'Registration failed';
      
      if (err?.message?.toLowerCase().includes('email')) {
        errorMessage = 'This email is already registered. Please use a different email or login.';
      } else if (err?.message?.toLowerCase().includes('phone')) {
        errorMessage = 'This phone number is already registered. Please use a different number.';
      } else if (err?.message?.toLowerCase().includes('license')) {
        errorMessage = 'This license number is already registered. Please verify your license number.';
      } else if (err?.message?.toLowerCase().includes('tin')) {
        errorMessage = 'This TIN number is already registered. Please verify your TIN number.';
      } else if (err?.message?.toLowerCase().includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (err?.message?.toLowerCase().includes('server')) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await verifyEmail({ email: formData.email, code: verificationCode, role: 'diagnostic_center' });
      toast.success('Email verified! Please login to continue');
      router.push('/login?verified=true');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification failed';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfessionalVerification = async () => {
    if (!showVerificationCheckbox) {
      setError('Please confirm that all information is accurate');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await submitProfessionalVerification({
        role: 'diagnostic_center',
        license_number: formData.center_license_number,
        tin_number: formData.center_tin_number,
      });
      
      toast.success('Professional verification submitted for review');
      router.push('/professional-verification-status');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Submission failed';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    setIsSubmitting(true);
    try {
      await resendVerificationCode({ email: formData.email });
      toast.success('Verification code resent');
      setResendTimer(60);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to resend code';
      setError(message);
    } finally {
      setIsSubmitting(false);
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
      title={
        step === 1 ? 'Diagnostic Center Registration' :
        step === 2 ? 'Verify Your Email' :
        'Professional Verification'
      }
      subtitle={
        step === 1
          ? 'Register your diagnostic facility to join HealLink.'
          : step === 2
          ? `We've sent a verification code to ${formData.email}`
          : 'Confirm your professional information before submission'
      }
      stepBadge={
        step === 1 ? 'Step 1 of 3' :
        step === 2 ? 'Step 2 of 3' :
        'Step 3 of 3'
      }
    >
      {step === 1 && (
        <div className="space-y-5 sm:space-y-6 md:space-y-7">

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
                  <label className={labelClass}>Operating Hours *</label>
                  <div className="relative group">
                    <input
                      className={inputClass}
                      placeholder="8:00 AM - 8:00 PM"
                      type="text"
                      value={formData.operating_hours}
                      onChange={(e) => update('operating_hours', e.target.value)}
                    />
                    <InputFieldIcon name="schedule" />
                  </div>
                </div>
              </div>

              {/* Services Description - Full width */}
              <div className="space-y-1.5">
                <label className={labelClass}>Services Description *</label>
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

              {/* Established Year and Accreditation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Established Year</label>
                  <div className="relative group">
                    <input
                      className={inputClass}
                      placeholder="2020"
                      type="text"
                      value={formData.established_year}
                      onChange={(e) => update('established_year', e.target.value)}
                    />
                    <InputFieldIcon name="badge" />
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
                  fileName={license_document?.name ?? null}
                  emptyLabel="Upload Registration Certificate (PDF, JPG, PNG) *"
                  onClick={() => fileInputRef.current?.click()}
                  inputRef={fileInputRef}
                  onChange={(e) => setlicense_document(e.target.files?.[0] || null)}
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
                    Minimum 8 characters with uppercase, lowercase, number, and special character
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
            {error && <ErrorBanner message={error} />}
            <SubmitButton
              type="button"
              label="Register Diagnostic Center"
              loadingLabel="Submitting..."
              isLoading={isSubmitting}
              onClick={handleNext}
            />
            <LoginLink />
          </div>
        </div>
      )}

      {step === 2 && (
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
          isLoading={isSubmitting}
          error={error}
        />
      )}

      {step === 3 && (
        <div className="space-y-6">
          {error && <ErrorBanner message={error} />}
          
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 text-sm font-bold">!</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-800 mb-2">Important Notice</h3>
                <p className="text-sm text-amber-700 mb-3">
                  By submitting this verification, you confirm that all provided information is accurate and complete. 
                  Falsifying information may result in rejection or legal consequences.
                </p>
                <div className="bg-white rounded p-3 space-y-2">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>License Number: <strong>{formData.center_license_number}</strong></span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>TIN Number: <strong>{formData.center_tin_number}</strong></span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Center Name: <strong>{formData.center_name.trim()}</strong></span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Address: <strong>{formData.center_address}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showVerificationCheckbox}
              onChange={(e) => setShowVerificationCheckbox(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700">
              I confirm that all information provided is true, accurate, and complete. 
              I understand that providing false information may result in immediate rejection 
              and potential legal action.
            </span>
          </label>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStep(2);
                setError(null);
              }}
              className="flex-1"
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handleProfessionalVerification}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-teal-700 to-cyan-600"
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
            </Button>
          </div>
        </div>
      )}
    </RegisterFormShell>
  );
};
