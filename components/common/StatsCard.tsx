// components/profile/StatsCard.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const variantStyles = {
  default: 'bg-white',
  primary: 'bg-blue-50',
  success: 'bg-green-50',
  warning: 'bg-yellow-50',
  info: 'bg-teal-50',
};

const iconBg = {
  default: 'bg-gray-100 text-gray-600',
  primary: 'bg-blue-100 text-blue-600',
  success: 'bg-green-100 text-green-600',
  warning: 'bg-yellow-100 text-yellow-600',
  info: 'bg-teal-100 text-teal-600',
};

export function StatsCard({
  title,
  value,
  icon,
  description,
  variant = 'default',
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        'rounded-2xl border shadow-sm hover:shadow-md transition-all',
        'w-full',
        variantStyles[variant],
        className
      )}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          {/* LEFT */}
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide truncate">
              {title}
            </p>

            <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              {value ?? 0}
            </p>

            {description && (
              <p className="text-xs text-gray-400 truncate">
                {description}
              </p>
            )}

            {trend && (
              <p
                className={cn(
                  'text-xs mt-1 font-medium',
                  trend.isPositive ? 'text-green-600' : 'text-red-500'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </p>
            )}
          </div>

          {/* RIGHT ICON */}
          <div
            className={cn(
              'p-3 rounded-xl shrink-0',
              iconBg[variant]
            )}
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6">
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}