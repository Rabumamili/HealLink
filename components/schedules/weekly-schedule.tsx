'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DayCard } from './DayCard';

export function WeeklySchedule({
  schedule,
  onToggleDay,
  onAddSlot,
  onRemoveSlot,
  type,
}: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Schedule</CardTitle>
        <CardDescription>
          Manage availability across the week
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