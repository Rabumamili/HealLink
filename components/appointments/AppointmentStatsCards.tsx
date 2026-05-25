// components/appointments/AppointmentStatsCards.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface StatCardData {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface AppointmentStatsCardsProps {
  stats: StatCardData[];
  variant?: 'doctor' | 'clinic' | 'diagnostic' | 'patient';
  className?: string;
}

const variantColors = {
  doctor: {
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
  },
  clinic: {
    iconBg: 'bg-[#006767]/10',
    iconColor: 'text-[#006767]',
  },
  diagnostic: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  patient: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
};

export function AppointmentStatsCards({ stats, variant = 'clinic', className }: AppointmentStatsCardsProps) {
  const colors = variantColors[variant];

  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10", className)}>
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl p-5 border border-[#E0E7FF] shadow-[0_4px_20px_rgba(0,139,139,0.05)] hover:shadow-md transition-all hover:-translate-y-0.5"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-sm font-semibold text-[#3d4949] uppercase tracking-wider">{stat.title}</span>
              {stat.description && <p className="text-xs text-[#6d7979] mt-0.5">{stat.description}</p>}
            </div>
            <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", colors.iconBg)}>
              <stat.icon className={cn("h-4 w-4", colors.iconColor)} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl md:text-3xl font-bold text-[#0b1c30]">{stat.value}</div>
            {stat.trend && (
              <p className={cn(
                "text-xs mt-1",
                stat.trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {stat.trend.isPositive ? '↑' : '↓'} {Math.abs(stat.trend.value)}% from last month
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}