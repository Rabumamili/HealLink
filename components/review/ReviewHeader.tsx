// components/reviews/ReviewHeader.tsx
'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewHeaderProps {
  title: string;
  description: string;
  icon?: ReactNode;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  actions?: ReactNode;
  className?: string;
}

export function ReviewHeader({
  title,
  description,
  icon,
  onRefresh,
  isRefreshing = false,
  actions,
  className,
}: ReviewHeaderProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#008282] to-[#00a0a0] mb-8', className)}>
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
      <div className="absolute right-10 top-10 h-32 w-32 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-white/50 to-white/20" />
      
      <div className="relative px-6 py-6 md:px-8 md:py-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
                  <div className="h-5 w-5 text-white">{icon}</div>
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">{title}</h1>
            </div>
            <p className="text-white/80 text-sm md:text-base max-w-2xl ml-12">{description}</p>
          </div>
          <div className="flex items-center gap-3 ml-12 md:ml-0">
            {onRefresh && (
              <Button
                variant="outline"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            )}
            {actions}
          </div>
        </div>
      </div>
    </div>
  );
}