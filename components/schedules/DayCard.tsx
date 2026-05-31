// components/schedules/DayCard.tsx
'use client';

import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus, Ban, Clock } from 'lucide-react';
import { SlotChip } from './SlotChip';
import { cn } from '@/lib/utils';

interface DayCardProps {
  day: {
    day: string;
    isActive: boolean;
    slots?: any[];
    timeSlots?: any[];
  };
  type: 'clinic' | 'diagnostic' | 'doctor';
  onToggle: (day: string) => void;
  onAdd: (day: string) => void;
  onRemove: (day: string, slotId: string) => void;
}

export function DayCard({ day, type, onToggle, onAdd, onRemove }: DayCardProps) {
  const slots = day.slots || day.timeSlots || [];
  const isActive = day.isActive;

  return (
    <div className={cn(
      "rounded-xl border bg-white shadow-sm transition-all duration-200",
      isActive ? "border-slate-200" : "border-slate-100 bg-slate-50/50"
    )}>
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-base text-slate-800">{day.day}</span>
          <span
            className={cn(
              "text-[10px] px-2 py-0.5 rounded-full font-medium",
              isActive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-500 border border-slate-200'
            )}
          >
            {isActive ? 'ACTIVE' : 'OFF'}
          </span>
        </div>
        <Switch 
          checked={isActive} 
          onCheckedChange={() => onToggle(day.day)}
          className="data-[state=checked]:bg-[#008282]"
        />
      </div>

      {/* BODY */}
      <div className="p-4">
        {isActive ? (
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
              className="h-8 px-3 rounded-full border border-dashed border-slate-300 text-xs text-slate-500 hover:border-[#008282] hover:text-[#008282] hover:bg-[#008282]/5 transition-all duration-200 flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              Add slot
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <Ban className="h-4 w-4" />
              <span>Not available for bookings</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onToggle(day.day)}
              className="text-[#008282] hover:text-[#00a0a0] hover:bg-[#008282]/10"
            >
              Enable Day
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}