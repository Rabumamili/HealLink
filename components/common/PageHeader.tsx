// components/common/PageHeader.tsx - Update to include description
'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;  // Add description prop
  icon?: ReactNode;
  actions?: ReactNode;
  variant?: 'default' | 'gradient';
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  description,
  icon,
  actions,
  variant = 'default',
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="rounded-xl bg-[#008282]/10 p-2.5">
                <div className="h-5 w-5 text-[#008282]">{icon}</div>
              </div>
            )}
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>
          </div>
          {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
          {description && <p className="text-slate-500 text-sm max-w-2xl ml-11">{description}</p>}
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}