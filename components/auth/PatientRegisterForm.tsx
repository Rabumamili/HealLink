'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CalendarDays, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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

type ApiErrorLike = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

const patientSchema = z
  .object({
    first_name: z
      .string()
      .min(3, 'First name must be at least 3 letters')
      .regex(/^[A-Za-z]+$/, 'First name can only contain letters'),
    last_name: z
      .string()
      .min(3, 'Last name must be at least 3 letters')
      .regex(/^[A-Za-z]+$/, 'Last name can only contain letters'),
    email: z.string().email('Invalid email address'),
    phone_number: z
      .string()
      .min(10, 'A valid phone number is required')
      .regex(/^[+]?([0-9][\s-]?){9,}$/, 'Enter a valid phone number with at least 10 digits'),
    date_of_birth: z.string().optional(),
    gender: z.string().optional(),
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

const birthDateStart = new Date(1900, 0, 1);
const today = new Date();

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateInputValue(value?: string) {
  if (!value) return undefined;

  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return undefined;

  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function formatBirthDate(value?: string) {
  const date = parseDateInputValue(value);
  if (!date) return 'Select birth date';

  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export const PatientRegisterForm = () => {
  const router = useRouter();
  const { registerUser, isRegistering } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isBirthDateOpen, setIsBirthDateOpen] = useState(false);
  const [birthDateValue, setBirthDateValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      date_of_birth: '',
      gender: '',
    },
  });
  const selectedBirthDate = parseDateInputValue(birthDateValue);

  const getFriendlyErrorMessage = (err: unknown) => {
    const apiError = err as ApiErrorLike;
    const rawMessage =
      typeof err === 'string'
        ? err
        : apiError.response?.data?.message || apiError.message || '';
    const message = rawMessage.toLowerCase();

    if (message.includes('email')) {
      return 'This email is already registered. Please use a different email or log in.';
    }
    if (message.includes('phone')) {
      return 'This phone number is already in use. Please use a different number or log in.';
    }
    if (message.includes('network')) {
      return 'Network error. Please check your connection and try again.';
    }
    if (message.includes('server')) {
      return 'Server error. Please try again later.';
    }
    return 'Registration failed. Please review the form and try again.';
  };

  const onSubmit = async (data: PatientFormData) => {
    setError(null);
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        role: 'patient',
      });

      toast.success('Registration successful! Please verify your email.');
      router.push(`/verify?email=${encodeURIComponent(data.email)}&role=patient`);
    } catch (err: unknown) {
      setError(getFriendlyErrorMessage(err));
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
              <input type="hidden" {...register('date_of_birth')} />
              <Popover open={isBirthDateOpen} onOpenChange={setIsBirthDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="group h-auto w-full justify-between rounded-lg bg-surface-container-low px-4 py-2.5 text-left text-[14px] font-normal text-on-surface shadow-none transition-all hover:bg-surface-container-lowest focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span className={selectedBirthDate ? 'text-on-surface' : 'text-on-surface-variant'}>
                      {formatBirthDate(birthDateValue)}
                    </span>
                    <span className="flex items-center gap-2 text-outline-variant transition-colors group-hover:text-primary">
                      <CalendarDays className="h-4 w-4" />
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto rounded-2xl border-white/50 bg-surface-container-lowest p-3 shadow-2xl">
                  <Calendar
                    mode="single"
                    selected={selectedBirthDate}
                    onSelect={(date) => {
                      const nextBirthDateValue = date ? toDateInputValue(date) : '';

                      setBirthDateValue(nextBirthDateValue);
                      setValue('date_of_birth', nextBirthDateValue, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                      setIsBirthDateOpen(false);
                    }}
                    captionLayout="dropdown"
                    startMonth={birthDateStart}
                    endMonth={today}
                    disabled={{ after: today, before: birthDateStart }}
                    defaultMonth={selectedBirthDate ?? new Date(2000, 0, 1)}
                    className="[--cell-size:--spacing(8)]"
                    buttonVariant="ghost"
                  />
                </PopoverContent>
              </Popover>
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
                </select>
                <InputFieldIcon name="wc" />
              </div>
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
