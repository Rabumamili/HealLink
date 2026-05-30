'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
  InputFieldIcon,
  inputClass,
  labelClass,
} from './register-form-ui';

const doctorSchema = z
  .object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone_number: z.string().min(10, 'Valid phone number is required'),
    specialization: z.string().min(1, 'Specialization is required'),
    license_number: z.string().min(1, 'License number is required'),
    years_of_experience: z.number().min(0, 'Valid years of experience'),
    location: z.string().min(1, 'Location is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type DoctorFormData = z.infer<typeof doctorSchema>;

export const DoctorRegisterForm = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { registerProvider, isRegistering } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema),
    defaultValues: { years_of_experience: 0 },
  });

  const onSubmit = async (data: DoctorFormData) => {
    setError(null);
    if (!licenseFile) {
      setError('Medical license document is required');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('email', data.email);
      formData.append('phone_number', data.phone_number);
      formData.append('role', 'doctor');
      formData.append('specialization', data.specialization);
      formData.append('license_number', data.license_number);
      formData.append('years_of_experience', String(data.years_of_experience));
      formData.append('location', data.location);
      formData.append('password', data.password);
      formData.append('license_document', licenseFile);

      const response = await registerProvider(formData, 'doctor');
      
      toast.success('Registration successful! Please verify your email.');
      
      const tempUserId = response?.data?.userId || response?.userId;
      router.push(
        `/verify-email?email=${encodeURIComponent(data.email)}&role=doctor&tempUserId=${tempUserId || ''}`
      );
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
    }
  };

  return (
    <RegisterFormShell
      sidebarIcon="medical_services"
      sidebarTitle="Partner with HealLink"
      sidebarBenefits={['Verified credentials', 'Secure consulting', 'Patient management']}
      title="Doctor Registration"
      subtitle="Tell us about your professional background."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6 md:space-y-7">
        {error && <ErrorBanner message={error} />}

        {/* Personal Information Section */}
        <div className="space-y-3 sm:space-y-4 md:space-y-5">
          <SectionHeader icon="person" title="Personal Information" />
          
          <div className="space-y-3 sm:space-y-4">
            {/* Name row - responsive grid */}
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
                    <option value="" disabled>
                      Select Specialty
                    </option>
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
                <label className={labelClass}>Years of Experience *</label>
                <input
                  className={inputClass}
                  placeholder="5"
                  type="number"
                  min={0}
                  {...register('years_of_experience', { valueAsNumber: true })}
                />
                {errors.years_of_experience && (
                  <p className="text-xs text-red-500 mt-1">{errors.years_of_experience.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className={labelClass}>License Document *</label>
              <FileUploadZone
                fileName={licenseFile?.name ?? null}
                emptyLabel="Upload Medical License (PDF, JPG, PNG) *"
                onClick={() => fileInputRef.current?.click()}
                inputRef={fileInputRef}
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
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
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
            label="Create Professional Account"
            loadingLabel="Creating..."
            isLoading={isRegistering}
          />
          <LoginLink />
        </div>
      </form>
    </RegisterFormShell>
  );
};