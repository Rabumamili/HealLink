'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import {
  Calendar,
  CalendarX,
  CreditCard,
  FileText,
  FolderOpen,
  ListChecks,
  MessageSquare,
  Star,
  Stethoscope,
  UserCircle,
  Users,
  ClipboardList,
  Activity,
  Clock,
  AlertCircle,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type EmptyStateVariant = 
  | 'default' 
  | 'profile' 
  | 'appointment' 
  | 'card' 
  | 'schedule' 
  | 'service'
  | 'review';  // Added review variant

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  message?: string;
  submessage?: string;
  icon?: ReactNode;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

const variantConfig: Record<EmptyStateVariant, {
  icon: ReactNode;
  defaultTitle: string;
  defaultMessage: string;
  gradient: string;
}> = {
  default: {
    icon: <FolderOpen className="h-12 w-12" />,
    defaultTitle: "No data found",
    defaultMessage: "No items to display",
    gradient: "from-gray-50 to-gray-100"
  },
  profile: {
    icon: <UserCircle className="h-12 w-12" />,
    defaultTitle: "Profile not set up",
    defaultMessage: "Complete your profile to get started",
    gradient: "from-blue-50 to-cyan-50"
  },
  appointment: {
    icon: <CalendarX className="h-12 w-12" />,
    defaultTitle: "No appointments",
    defaultMessage: "No appointments scheduled",
    gradient: "from-amber-50 to-orange-50"
  },
  card: {
    icon: <CreditCard className="h-12 w-12" />,
    defaultTitle: "No cards",
    defaultMessage: "No cards available",
    gradient: "from-purple-50 to-pink-50"
  },
  schedule: {
    icon: <Calendar className="h-12 w-12" />,
    defaultTitle: "No schedule",
    defaultMessage: "No schedule available",
    gradient: "from-green-50 to-emerald-50"
  },
  service: {
    icon: <Stethoscope className="h-12 w-12" />,
    defaultTitle: "No services",
    defaultMessage: "No services available",
    gradient: "from-teal-50 to-cyan-50"
  },
  review: {
    icon: <MessageSquare className="h-12 w-12" />,
    defaultTitle: "No reviews yet",
    defaultMessage: "Be the first to leave a review",
    gradient: "from-yellow-50 to-amber-50"
  }
};

export function EmptyState({
  variant = 'default',
  title,
  message,
  submessage,
  icon,
  actionLabel,
  actionHref,
  onAction,
  className
}: EmptyStateProps) {
  const config = variantConfig[variant];
  
  const displayTitle = title || config.defaultTitle;
  const displayMessage = message || config.defaultMessage;
  const displayIcon = icon || config.icon;

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed",
      `bg-gradient-to-br ${config.gradient}`,
      className
    )}>
      <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
        <div className="text-gray-400">
          {displayIcon}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {displayTitle}
      </h3>
      
      <p className="text-sm text-gray-500 mb-1">
        {displayMessage}
      </p>
      
      {submessage && (
        <p className="text-xs text-gray-400 mb-4">
          {submessage}
        </p>
      )}
      
      {(actionLabel && (actionHref || onAction)) && (
        actionHref ? (
          <Link href={actionHref}>
            <Button className="mt-2 bg-[#006767] hover:bg-[#008282] rounded-xl">
              {actionLabel}
            </Button>
          </Link>
        ) : (
          <Button onClick={onAction} className="mt-2 bg-[#006767] hover:bg-[#008282] rounded-xl">
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}