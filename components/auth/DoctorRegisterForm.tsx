'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import { Eye, EyeOff } from 'lucide-react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);
    try {
      const { confirmPassword, ...submitData } = data;
      const formData = new FormData();
      formData.append('first_name', submitData.first_name);
      formData.append('last_name', submitData.last_name);
      formData.append('email', submitData.email);
      formData.append('phone_number', submitData.phone_number);
      formData.append('role', 'doctor');
      formData.append('specialization', submitData.specialization);
      formData.append('license_number', submitData.license_number);
      formData.append('years_of_experience', String(submitData.years_of_experience));
      formData.append('location', submitData.location);
      formData.append('password', submitData.password);
      formData.append('license_document', licenseFile);
      const response = await authService.registerProfessional(formData);
      toast.success('Registration successful! Please verify your email.');
      router.push(
        `/verify-email?email=${encodeURIComponent(data.email)}&role=doctor&tempUserId=${response.data.userId}`
      );
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RegisterFormShell
      sidebarIcon="medical_services"
      sidebarTitle="Partner with HealLink"
      sidebarBenefits={['Verified credentials', 'Secure consulting']}
      title="Doctor Registration"
      subtitle="Tell us about your professional background."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && <ErrorBanner message={error} />}

        <div className="space-y-4">
          <SectionHeader icon="person" title="Personal Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>First Name</label>
              <div className="relative group">
                <input className={inputClass} placeholder="John" type="text" {...register('first_name')} />
                <InputFieldIcon name="badge" />
              </div>
              {errors.first_name && (
                <p className="text-xs text-error px-1 mt-1">{errors.first_name.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Last Name</label>
              <div className="relative group">
                <input className={inputClass} placeholder="Doe" type="text" {...register('last_name')} />
                <InputFieldIcon name="badge" />
              </div>
              {errors.last_name && (
                <p className="text-xs text-error px-1 mt-1">{errors.last_name.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Email Address</label>
              <div className="relative group">
                <input
                  className={inputClass}
                  placeholder="doctor@heallink.com"
                  type="email"
                  {...register('email')}
                />
                <InputFieldIcon name="mail" />
              </div>
              {errors.email && <p className="text-xs text-error px-1 mt-1">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Phone Number</label>
              <div className="relative group">
                <input className={inputClass} placeholder="+251 ..." type="tel" {...register('phone_number')} />
                <InputFieldIcon name="call" />
              </div>
              {errors.phone_number && (
                <p className="text-xs text-error px-1 mt-1">{errors.phone_number.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Specialty</label>
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
                  <option value="Other">Other</option>
                </select>
                <InputFieldIcon name="clinical_notes" />
              </div>
              {errors.specialization && (
                <p className="text-xs text-error px-1 mt-1">{errors.specialization.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Practice Location</label>
              <div className="relative group">
                <input
                  className={inputClass}
                  placeholder="Addis Ababa, Bole"
                  type="text"
                  {...register('location')}
                />
                <InputFieldIcon name="location_on" />
              </div>
              {errors.location && (
                <p className="text-xs text-error px-1 mt-1">{errors.location.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <SectionHeader icon="verified_user" title="Professional Credentials" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Medical License</label>
              <input
                className={inputClass}
                placeholder="MLN-8829-X"
                type="text"
                {...register('license_number')}
              />
              {errors.license_number && (
                <p className="text-xs text-error px-1 mt-1">{errors.license_number.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Experience (Years)</label>
              <input
                className={inputClass}
                placeholder="5+"
                type="number"
                min={0}
                {...register('years_of_experience', { valueAsNumber: true })}
              />
              {errors.years_of_experience && (
                <p className="text-xs text-error px-1 mt-1">{errors.years_of_experience.message}</p>
              )}
            </div>
          </div>
          <FileUploadZone
            fileName={licenseFile?.name ?? null}
            emptyLabel="Upload License (PDF/JPG)"
            onClick={() => fileInputRef.current?.click()}
            inputRef={fileInputRef}
            onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
          />
        </div>

        <div className="space-y-4">
          <SectionHeader icon="lock" title="Account Security" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`${inputClass} pr-10`}
                  placeholder="••••••"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-error px-1 mt-1">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Confirm Password</label>
              <div className="relative group">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`${inputClass} pr-10`}
                  placeholder="••••••"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-error px-1 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-col items-center gap-3">
          <SubmitButton
            label="Create Professional Account"
            loadingLabel="Creating..."
            isLoading={isSubmitting}
          />
          <LoginLink />
        </div>
      </form>
    </RegisterFormShell>
  );
};
