// components/schedules/schedule-header.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Copy, Save } from 'lucide-react';

interface ScheduleHeaderProps {
  title: string;
  description: string;
  onApplyToAll?: () => void;
  onSave: () => void;
  showApplyButton?: boolean;
}

export function ScheduleHeader({
  title,
  description,
  onApplyToAll,
  onSave,
  showApplyButton = true
}: ScheduleHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-teal-600">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex gap-3">
        {showApplyButton && onApplyToAll && (
          <Button variant="outline" onClick={onApplyToAll}>
            <Copy className="mr-2 h-4 w-4" />
            Apply Monday to All Weekdays
          </Button>
        )}
        <Button className="bg-teal-600 hover:bg-teal-700" onClick={onSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Schedule
        </Button>
      </div>
    </div>
  );
}