// components/common/StatusBadge.tsx
'use client';

import { cn } from '@/lib/utils';

export type StatusType = 
  | 'Scheduled' | 'Confirmed' | 'Checked-in' | 'In Progress' | 'Completed' 
  | 'Cancelled' | 'No-show' | 'Pending' | 'Paid' | 'Failed'
  | 'Active' | 'Inactive' | 'Verified' | 'Unverified';

interface StatusBadgeProps {
  status: StatusType;
  variant?: 'appointment' | 'payment' | 'provider' | 'default';
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  'Scheduled': { label: 'SCHEDULED', className: 'bg-yellow-100 text-yellow-700' },
  'Confirmed': { label: 'CONFIRMED', className: 'bg-emerald-100 text-emerald-700' },
  'Checked-in': { label: 'CHECKED IN', className: 'bg-blue-100 text-blue-700' },
  'In Progress': { label: 'IN PROGRESS', className: 'bg-amber-100 text-amber-700' },
  'Completed': { label: 'COMPLETED', className: 'bg-gray-100 text-gray-700' },
  'Cancelled': { label: 'CANCELLED', className: 'bg-red-100 text-red-700' },
  'No-show': { label: 'NO SHOW', className: 'bg-red-100 text-red-700' },
  'Pending': { label: 'PENDING', className: 'bg-yellow-100 text-yellow-700' },
  'Paid': { label: 'PAID', className: 'bg-green-100 text-green-700' },
  'Failed': { label: 'FAILED', className: 'bg-red-100 text-red-700' },
  'Active': { label: 'ACTIVE', className: 'bg-green-100 text-green-700' },
  'Inactive': { label: 'INACTIVE', className: 'bg-gray-100 text-gray-700' },
  'Verified': { label: 'VERIFIED', className: 'bg-green-100 text-green-700' },
  'Unverified': { label: 'UNVERIFIED', className: 'bg-yellow-100 text-yellow-700' },
};

export function StatusBadge({ status, variant = 'default', className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-700' };
  
  return (
    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase", config.className, className)}>
      {config.label}
    </span>
  );
}