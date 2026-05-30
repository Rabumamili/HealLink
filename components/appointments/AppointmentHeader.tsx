// components/appointments/AppointmentHeader.tsx
'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AppointmentHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  variant?: 'doctor' | 'clinic' | 'diagnostic' | 'patient';
  className?: string;
}

// Consistent gradient with #008282 for all variants
const variantGradients = {
  doctor: 'from-[#008282]/10 via-[#00a0a0]/5 to-transparent',
  clinic: 'from-[#008282]/15 via-[#00a0a0]/8 to-transparent',
  diagnostic: 'from-[#008282]/10 via-[#00a0a0]/5 to-transparent',
  patient: 'from-[#008282]/10 via-[#00a0a0]/5 to-transparent',
};

// Consistent text color with #008282 for all variants
const variantTextColors = {
  doctor: 'text-[#008282]',
  clinic: 'text-[#008282]',
  diagnostic: 'text-[#008282]',
  patient: 'text-[#008282]',
};

// Consistent background colors
const variantBgColors = {
  doctor: 'bg-[#008282]/10',
  clinic: 'bg-[#008282]/10',
  diagnostic: 'bg-[#008282]/10',
  patient: 'bg-[#008282]/10',
};

export function AppointmentHeader({
  title,
  description,
  icon,
  actions,
  variant = 'clinic',
  className,
}: AppointmentHeaderProps) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl bg-white p-6 md:p-7 shadow-md border border-slate-100 mb-8',
      className
    )}>
      {/* Gradient background */}
      <div className={cn('absolute inset-0 bg-gradient-to-br', variantGradients[variant])} />
      
      {/* Decorative circles */}
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#008282]/5 blur-2xl" />
      <div className="absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-[#008282]/3 blur-2xl" />
      
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#008282] to-[#00a0a0]" />
      
      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {icon && (
              <div className={cn('rounded-xl p-2.5', variantBgColors[variant])}>
                <div className={cn('h-5 w-5', variantTextColors[variant])}>
                  {icon}
                </div>
              </div>
            )}
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>
          </div>
          {description && (
            <p className="text-slate-500 text-sm md:text-base max-w-2xl ml-12">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex-shrink-0 ml-12 md:ml-0">{actions}</div>}
      </div>
    </div>
  );
}