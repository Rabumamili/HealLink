// components/auth/RegisterForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserPlus, Eye, EyeOff, Mail, Phone, Calendar, User,Stethoscope, Building2, FlaskConical } from 'lucide-react';
import { useRouter } from 'next/navigation';

const baseSchema = z.object({
  email: z.string().email('Invalid email address'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone_number: z.string().min(10, 'Valid phone number is required'),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof baseSchema>;

interface RegisterFormProps {
  role: 'patient' | 'doctor' | 'clinic_admin' | 'diagnostic_admin';
}

export const RegisterForm = ({ role }: RegisterFormProps) => {
  const { register: registerUser, isRegistering } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      phone_number: '',
      date_of_birth: '',
      gender: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    const { confirmPassword, ...submitData } = data;
    
    try {
      const response = await registerUser({ ...submitData, role });
      // Redirect to verification page with email and role
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}&role=${role}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case 'patient': return 'Patient Registration';
      case 'doctor': return 'Doctor Registration';
      case 'clinic_admin': return 'Clinic Registration';
      case 'diagnostic_admin': return 'Diagnostic Center Registration';
      default: return 'Create Account';
    }
  };

  const getRoleDescription = () => {
    switch (role) {
      case 'patient': return 'Access quality healthcare services';
      case 'doctor': return 'Join our network of medical professionals';
      case 'clinic_admin': return 'Manage your clinic operations';
      case 'diagnostic_admin': return 'Offer diagnostic services to patients';
      default: return '';
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="text-sm">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          {role === 'patient' && <UserPlus className="h-8 w-8 text-primary" />}
          {role === 'doctor' && <Stethoscope className="h-8 w-8 text-primary" />}
          {role === 'clinic_admin' && <Building2 className="h-8 w-8 text-primary" />}
          {role === 'diagnostic_admin' && <FlaskConical className="h-8 w-8 text-primary" />}
        </div>
        <h3 className="text-xl font-semibold text-foreground">{getRoleTitle()}</h3>
        <p className="text-sm text-muted-foreground mt-1">{getRoleDescription()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name" className="text-sm text-foreground">First Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="first_name"
              placeholder="John"
              className="pl-10 h-11"
              {...register('first_name')}
            />
          </div>
          {errors.first_name && <p className="text-xs text-destructive">{errors.first_name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name" className="text-sm text-foreground">Last Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="last_name"
              placeholder="Doe"
              className="pl-10 h-11"
              {...register('last_name')}
            />
          </div>
          {errors.last_name && <p className="text-xs text-destructive">{errors.last_name.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm text-foreground">Email Address *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            className="pl-10 h-11"
            {...register('email')}
          />
        </div>
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone_number" className="text-sm text-foreground">Phone Number *</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="phone_number"
            placeholder="+1 234 567 8900"
            className="pl-10 h-11"
            {...register('phone_number')}
          />
        </div>
        {errors.phone_number && <p className="text-xs text-destructive">{errors.phone_number.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date_of_birth" className="text-sm text-foreground">Date of Birth</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="date_of_birth"
              type="date"
              className="pl-10 h-11"
              {...register('date_of_birth')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender" className="text-sm text-foreground">Gender</Label>
          <select
            id="gender"
            className="w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            {...register('gender')}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm text-foreground">Password *</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pr-10 h-11"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm text-foreground">Confirm Password *</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            className="h-11"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full h-11 bg-primary hover:bg-primary/90" 
        disabled={isRegistering}
      >
        {isRegistering ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            Creating account...
          </>
        ) : (
          <>
            Continue
            <UserPlus className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  );
};