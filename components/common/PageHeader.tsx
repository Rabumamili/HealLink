// components/common/PageHeader.tsx
'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8", className)}>
      <div>
        <h1 className="text-[28px] md:text-[32px] font-bold text-[#0b1c30] tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="text-[16px] text-[#3d4949] mt-1">{subtitle}</p>}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}