// components/schedules/schedule-pro-tip.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScheduleProTipProps {
  type: 'clinic' | 'diagnostic' | 'doctor';
  className?: string;
}

export function ScheduleProTip({ type, className }: ScheduleProTipProps) {
  const getTipContent = () => {
    if (type === 'clinic') {
      return {
        icon: CalendarIcon,
        title: 'Pro Tip: Overlapping Blocks',
        description: 'If you define overlapping time blocks, the system will merge them into a single continuous availability window automatically to prevent booking conflicts.'
      };
    } else if (type === 'diagnostic') {
      return {
        icon: Activity,
        title: 'Best Practice: Peak Hours Management',
        description: 'Consider adding extra staff during morning hours (8-10 AM) as this is typically the busiest time for diagnostic centers. Adjust patient capacity accordingly.'
      };
    } else {
      return {
        icon: Activity,
        title: 'Pro Tip: Overlapping Blocks',
        description: 'If you define overlapping blocks, the system will merge them into a single continuous availability window automatically to prevent booking conflicts.'
      };
    }
  };

  const tip = getTipContent();
  const Icon = tip.icon;

  return (
    <Card className={cn("bg-teal-50 border-teal-200", className)}>
      <CardContent className="p-4">
        <div className="flex gap-3 items-start">
          <div className="p-2 bg-teal-100 rounded-lg">
            <Icon className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-teal-800">{tip.title}</h4>
            <p className="text-sm text-teal-700 mt-1">{tip.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}