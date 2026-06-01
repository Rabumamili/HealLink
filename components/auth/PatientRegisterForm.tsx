'use client';

import { useState } from 'react';
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
  SubmitButton,
  LoginLink,
  InputFieldIcon,
  inputClass,
  labelClass,
} from './register-form-ui';

const patientSchema = z
  .object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone_number: z.string().min(10, 'Valid phone number is required'),
    date_of_birth: z.string().optional(),
    gender: z.string().optional(),
    emergency_contact: z.string().optional(),
    address: z.string().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type PatientFormData = z.infer<typeof patientSchema>;

export const PatientRegisterForm = () => {
  const router = useRouter();
  const { registerUser, isRegistering } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
  });

  const onSubmit = async (data: PatientFormData) => {
    setError(null);
    try {
      const { confirmPassword, ...rest } = data;

      await registerUser({
        ...rest,
        role: 'patient',
      });

      toast.success('Registration successful!');
      router.push('/patient/dashboard');
    } catch (err: any) {
      // Format error message for better UX
      let errorMessage = err?.message || 'Registration failed';
      
      if (err?.message?.toLowerCase().includes('email')) {
        errorMessage = 'This email is already registered. Please use a different email or login.';
      } else if (err?.message?.toLowerCase().includes('phone')) {
        errorMessage = 'This phone number is already registered. Please use a different number.';
      } else if (err?.message?.toLowerCase().includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (err?.message?.toLowerCase().includes('server')) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setError(errorMessage);
    }
  };

  return (
    <RegisterFormShell
      sidebarIcon="person"
      sidebarTitle="Join HealLink"
      sidebarBenefits={[
        'Personalized healthcare',
        'Easy appointment booking',
        'Secure health records',
      ]}
      title="Patient Registration"
      subtitle="Create your account to access quality healthcare services."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        <div className="space-y-4">
          <SectionHeader icon="person" title="Personal Information" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
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
                <p className="text-xs text-error px-1 mt-1">{errors.first_name.message}</p>
              )}
            </div>

            <div className="space-y-1">
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
                <p className="text-xs text-error px-1 mt-1">{errors.last_name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Email Address *</label>
              <div className="relative group">
                <input
                  className={inputClass}
                  placeholder="patient@heallink.com"
                  type="email"
                  {...register('email')}
                />
                <InputFieldIcon name="mail" />
              </div>
              {errors.email && <p className="text-xs text-error px-1 mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Phone Number *</label>
              <div className="relative group">
                <input className={inputClass} placeholder="+251 ..." type="tel" {...register('phone_number')} />
                <InputFieldIcon name="call" />
              </div>
              {errors.phone_number && (
                <p className="text-xs text-error px-1 mt-1">{errors.phone_number.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Date of Birth</label>
              <div className="relative group">
                <input className={inputClass} type="date" {...register('date_of_birth')} />
                <InputFieldIcon name="cake" />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Gender</label>
              <div className="relative group">
                <select
                  className={`${inputClass} appearance-none cursor-pointer pr-10`}
                  {...register('gender')}
                  defaultValue=""
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <InputFieldIcon name="wc" />
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className={labelClass}>Emergency Contact</label>
              <div className="relative group">
                <input
                  className={inputClass}
                  placeholder="+251 ..."
                  type="tel"
                  {...register('emergency_contact')}
                />
                <InputFieldIcon name="health_and_safety" />
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className={labelClass}>Residential Address (Optional)</label>
              <textarea
                className={`${inputClass} resize-none`}
                placeholder="123 Clinical Way, Health City"
                rows={2}
                {...register('address')}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <SectionHeader icon="lock" title="Account Security" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Password *</label>
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
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-error px-1 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Confirm Password *</label>
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
          {error && <ErrorBanner message={error} />}
          <SubmitButton
            label="Create Patient Account"
            loadingLabel="Creating..."
            isLoading={isRegistering}
          />
          <LoginLink />
        </div>
      </form>
    </RegisterFormShell>
  );
};