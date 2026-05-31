// components/schedules/WeeklySchedule.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DayCard } from './DayCard';
import { CalendarDays } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';

interface WeeklyScheduleProps {
  schedule: any[];
  type: 'clinic' | 'diagnostic' | 'doctor';
  onToggleDay: (day: string) => void;
  onAddSlot: (day: string) => void;
  onRemoveSlot: (day: string, slotId: string) => void;
}

export function WeeklySchedule({
  schedule,
  type,
  onToggleDay,
  onAddSlot,
  onRemoveSlot,
}: WeeklyScheduleProps) {
  if (!schedule || schedule.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800">Weekly Schedule</CardTitle>
          <CardDescription className="text-slate-500">
            Manage your availability across the week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            variant="schedule"
            title="No Schedule Data"
            message="No weekly schedule found"
            submessage="Please refresh the page or contact support if this issue persists."
            icon={<CalendarDays className="h-8 w-8" />}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-800">Weekly Schedule</CardTitle>
        <CardDescription className="text-slate-500">
          Manage your availability across the week. Enable/disable days and add time slots.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {schedule.map((day: any, i: number) => (
          <DayCard
            key={day.day}
            day={day}
            type={type}
            onToggle={onToggleDay}
            onAdd={onAddSlot}
            onRemove={onRemoveSlot}
          />
        ))}
      </CardContent>
    </Card>
  );
}