// components/auth/DoctorRegisterForm.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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

const doctorSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    phone_number: z.string().min(10, 'Valid phone number is required'),
    specialization: z.string().min(1, 'Specialization is required'),
    license_number: z.string().min(1, 'License number is required'),
    location: z.string().min(1, 'Location is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type DoctorFormData = z.infer<typeof doctorSchema>;

export const DoctorRegisterForm = () => {
  const router = useRouter();
  const licenseFileInputRef = useRef<HTMLInputElement>(null);
  const { registerDoctor, verifyEmail, resendVerificationCode, submitProfessionalVerification } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [showVerificationCheckbox, setShowVerificationCheckbox] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<DoctorFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema),
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const onSubmit = async (data: DoctorFormData) => {
    setError(null);
    
    if (!licenseFile) {
      setError('Medical license document is required');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const full_name = `${data.first_name} ${data.last_name}`.trim();
      
      await registerDoctor({
        email: data.email,
        password: data.password,
        full_name: full_name,
        phone_number: data.phone_number,
        role: 'doctor',
        specialization: data.specialization,
        license_number: data.license_number,
        location: data.location,
        license_document: licenseFile,
      });
      
      // Store form data for later use in professional verification
      setFormData(data);
      
      toast.success('Verification code sent to your email');
      setStep(2);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    if (!formData) {
      setError('Form data not found');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await verifyEmail({ email: formData.email, code: verificationCode });
      toast.success('Email verified! Please complete professional verification');
      setStep(3);
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

    if (!formData) {
      setError('Form data not found');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await submitProfessionalVerification({
        role: 'doctor',
        license_number: formData.license_number,
        tin_number: undefined,
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
    if (!formData && !getValues('email')) {
      setError('Email not found');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const email = formData?.email || getValues('email');
      await resendVerificationCode({ email });
      toast.success('Verification code resent');
      setResendTimer(60);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to resend code';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RegisterFormShell
      sidebarIcon="medical_services"
      sidebarTitle="Partner with HealLink"
      sidebarBenefits={['Verified credentials', 'Secure consulting', 'Patient management']}
      title={
        step === 1 ? 'Doctor Registration' :
        step === 2 ? 'Verify Your Email' :
        'Professional Verification'
      }
      subtitle={
        step === 1
          ? 'Tell us about your professional background.'
          : step === 2
          ? `We've sent a verification code to ${formData?.email || getValues('email')}`
          : 'Confirm your professional information before submission'
      }
      stepBadge={
        step === 1 ? 'Step 1 of 3' :
        step === 2 ? 'Step 2 of 3' :
        'Step 3 of 3'
      }
    >
      {step === 1 && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6 md:space-y-7">
          {error && <ErrorBanner message={error} />}

          {/* Personal Information Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <SectionHeader icon="person" title="Personal Information" />
            
            <div className="space-y-3 sm:space-y-4">
              {/* First Name and Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>First Name *</label>
                  <div className="relative group">
                    <input 
                      className={inputClass} 
                      placeholder="John" 
                      type="text" 
                      {...register('first_name')} 
                    />
                    <InputFieldIcon name="badge" />
                  </div>
                  {errors.first_name && (
                    <p className="text-xs text-red-500 mt-1">{errors.first_name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>Last Name *</label>
                  <div className="relative group">
                    <input 
                      className={inputClass} 
                      placeholder="Doe" 
                      type="text" 
                      {...register('last_name')} 
                    />
                    <InputFieldIcon name="badge" />
                  </div>
                  {errors.last_name && (
                    <p className="text-xs text-red-500 mt-1">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              {/* Contact info row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Email Address *</label>
                  <div className="relative group">
                    <input
                      className={inputClass}
                      placeholder="doctor@heallink.com"
                      type="email"
                      {...register('email')}
                    />
                    <InputFieldIcon name="mail" />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <label className={labelClass}>Phone Number *</label>
                  <div className="relative group">
                    <input 
                      className={inputClass} 
                      placeholder="+251 123 456 789" 
                      type="tel" 
                      {...register('phone_number')} 
                    />
                    <InputFieldIcon name="call" />
                  </div>
                  {errors.phone_number && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone_number.message}</p>
                  )}
                </div>
              </div>

              {/* Specialty and Location row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Specialty *</label>
                  <div className="relative group">
                    <select
                      className={`${inputClass} appearance-none cursor-pointer pr-10`}
                      {...register('specialization')}
                      defaultValue=""
                    >
                      <option value="" disabled>Select Specialty</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="General Medicine">General Medicine</option>
                      <option value="Surgery">Surgery</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Other">Other</option>
                    </select>
                    <InputFieldIcon name="health_and_safety" />
                  </div>
                  {errors.specialization && (
                    <p className="text-xs text-red-500 mt-1">{errors.specialization.message}</p>
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <label className={labelClass}>Practice Location *</label>
                  <div className="relative group">
                    <input
                      className={inputClass}
                      placeholder="Addis Ababa, Bole"
                      type="text"
                      {...register('location')}
                    />
                    <InputFieldIcon name="location" />
                  </div>
                  {errors.location && (
                    <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Credentials Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <SectionHeader icon="verified_user" title="Professional Credentials" />
            
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Medical License Number *</label>
                  <input
                    className={inputClass}
                    placeholder="MLN-8829-X"
                    type="text"
                    {...register('license_number')}
                  />
                  {errors.license_number && (
                    <p className="text-xs text-red-500 mt-1">{errors.license_number.message}</p>
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <label className={labelClass}>Years of Experience</label>
                  <input
                    className={inputClass}
                    placeholder="5"
                    type="number"
                    min={0}
                  />
                </div>
              </div>

              {/* License Document Upload - Only ONE document */}
              <div className="space-y-1.5">
                <label className={labelClass}>Medical License Document *</label>
                <FileUploadZone
                  fileName={licenseFile?.name ?? null}
                  emptyLabel="Upload Medical License (PDF, JPG, PNG) *"
                  onClick={() => licenseFileInputRef.current?.click()}
                  inputRef={licenseFileInputRef}
                  onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Accepted formats: PDF, JPG, PNG (Max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Account Security Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <SectionHeader icon="lock" title="Account Security" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}>Password *</label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`${inputClass} pr-10`}
                    placeholder="••••••••"
                    {...register('password')}
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
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>
              
              <div className="space-y-1.5">
                <label className={labelClass}>Confirm Password *</label>
                <div className="relative group">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`${inputClass} pr-10`}
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="pt-3 sm:pt-4 md:pt-5 flex flex-col items-center gap-3 sm:gap-4">
            <SubmitButton
              type="submit"
              label="Register as Doctor"
              loadingLabel="Creating Account..."
              isLoading={isSubmitting}
            />
            <LoginLink />
          </div>
        </form>
      )}

      {step === 2 && formData && (
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

      {step === 3 && formData && (
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
                    <span>License Number: <strong>{formData.license_number}</strong></span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Full Name: <strong>{formData.first_name} {formData.last_name}</strong></span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Specialization: <strong>{formData.specialization}</strong></span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Location: <strong>{formData.location}</strong></span>
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