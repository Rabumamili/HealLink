// components/common/EmptyState.tsx
'use client';

import { LucideIcon, CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  message: string;
  submessage?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  variant?: 'appointment' | 'profile' | 'card' | 'schedule' | 'service' | 'default';
  className?: string;
}

const variantIcons = {
  appointment: CalendarPlus,
  profile: null,
  card: null,
  schedule: null,
  service: null,
  default: CalendarPlus,
};

const variantColors = {
  appointment: 'bg-[#EFF4FF] text-[#6d7979]',
  profile: 'bg-gray-100 text-gray-400',
  card: 'bg-blue-50 text-blue-500',
  schedule: 'bg-purple-50 text-purple-500',
  service: 'bg-green-50 text-green-500',
  default: 'bg-[#EFF4FF] text-[#6d7979]',
};

export function EmptyState({
  message,
  submessage,
  icon: Icon,
  actionLabel,
  actionHref,
  onAction,
  variant = 'default',
  className,
}: EmptyStateProps) {
  const DefaultIcon = variantIcons[variant] || variantIcons.default;
  const colors = variantColors[variant];
  const IconComponent = Icon || DefaultIcon;

  return (
    <div className={cn("bg-white rounded-2xl border border-[#E0E7FF] text-center py-16", className)}>
      <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5", colors)}>
        {IconComponent && <IconComponent className="h-10 w-10 opacity-50" />}
      </div>
      <p className="text-[#3d4949] text-lg font-semibold mb-2">{message}</p>
      {submessage && <p className="text-[#6d7979] text-sm mb-6">{submessage}</p>}
      {(actionLabel && (actionHref || onAction)) && (
        actionHref ? (
          <Link href={actionHref}>
            <Button className="bg-[#006767] hover:bg-[#008282] text-white rounded-xl px-8">
              {actionLabel}
            </Button>
          </Link>
        ) : (
          <Button onClick={onAction} className="bg-[#006767] hover:bg-[#008282] text-white rounded-xl px-8">
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}