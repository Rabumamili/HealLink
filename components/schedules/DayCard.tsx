'use client';

import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus, Ban } from 'lucide-react';
import { SlotChip } from './SlotChip';

export function DayCard({
  day,
  type,
  onToggle,
  onAdd,
  onRemove,
}: any) {
  const slots = day.slots || day.timeSlots || [];

  return (
    <div className="rounded-xl border bg-white shadow-sm hover:shadow-md transition">
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{day.day}</span>

          <span
            className={`text-[10px] px-2 py-0.5 rounded-full border ${
              day.isActive
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-gray-50 text-gray-500 border-gray-200'
            }`}
          >
            {day.isActive ? 'ACTIVE' : 'OFF'}
          </span>
        </div>

        <Switch checked={day.isActive} onCheckedChange={() => onToggle(day.day)} />
      </div>

      {/* BODY */}
      <div className="p-4">
        {day.isActive ? (
          <div className="flex flex-wrap gap-2 items-center">
            {slots.map((slot: any) => (
              <SlotChip
                key={slot.id}
                slot={slot}
                day={day.day}
                type={type}
                onRemove={onRemove}
              />
            ))}

            <button
              onClick={() => onAdd(day.day)}
              className="h-8 px-3 rounded-full border border-dashed text-xs text-muted-foreground hover:border-teal-500 hover:text-teal-600 transition"
            >
              + Add slot
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Ban className="h-4 w-4" />
              <span>Not available</span>
            </div>

            <Button variant="link" size="sm" onClick={() => onToggle(day.day)}>
              Enable
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}