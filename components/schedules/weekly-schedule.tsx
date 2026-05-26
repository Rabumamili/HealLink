// components/schedules/weekly-schedule.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Clock, Plus, X, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeSlot {
  id: string;
  startTime?: string;
  endTime?: string;
  start?: string;
  end?: string;
  shift?: string;
  type?: string;
  maxPatients?: number;
}

interface DaySchedule {
  day: string;
  isActive: boolean;
  slots?: TimeSlot[];
  timeSlots?: TimeSlot[];
  note?: string;
}

interface WeeklyScheduleProps {
  schedule: DaySchedule[];
  onToggleDay: (day: string) => void;
  onAddSlot: (day: string) => void;
  onRemoveSlot: (day: string, slotId: string) => void;
  type: 'clinic' | 'diagnostic' | 'doctor';
}

export function WeeklySchedule({ schedule, onToggleDay, onAddSlot, onRemoveSlot, type }: WeeklyScheduleProps) {
  const getSlotDisplay = (slot: TimeSlot) => {
    const start = slot.startTime || slot.start;
    const end = slot.endTime || slot.end;
    const maxPatients = slot.maxPatients;
    
    if (type === 'diagnostic') {
      const slotType = slot.type;
      return (
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase opacity-80">
            {slotType === 'morning' ? 'Morning' : slotType === 'afternoon' ? 'Afternoon' : 'Evening'}
          </span>
          <span className="text-sm font-medium">{start} — {end}</span>
          <span className="text-[10px] opacity-80">Max: {maxPatients} patients</span>
        </div>
      );
    } else if (type === 'doctor') {
      const slotType = slot.type;
      return (
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase opacity-80">
            {slotType === 'shift' ? 'Shift' : slotType === 'break' ? 'Break' : 'Consultation'}
          </span>
          <span className="text-sm font-medium">{start} — {end}</span>
        </div>
      );
    } else {
      return (
        <>
          <Clock className="h-4 w-4" />
          <span className="font-medium">{start} - {end}</span>
        </>
      );
    }
  };

  const getSlotClassName = () => {
    if (type === 'clinic') {
      return "flex items-center gap-3 px-4 py-2 bg-teal-600 text-white rounded-lg shadow-sm";
    } else {
      return "group relative flex items-center gap-3 pl-4 pr-2 py-3 bg-teal-600 text-white rounded-lg shadow-md";
    }
  };

  const getSlotMinWidth = () => {
    if (type === 'doctor') return "min-w-[180px]";
    return "";
  };

  const getAddButtonClassName = () => {
    if (type === 'diagnostic') {
      return "h-[72px] w-[52px] flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground hover:border-teal-600 hover:text-teal-600 transition-all";
    }
    return "h-[52px] w-[52px] flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground hover:border-teal-600 hover:text-teal-600 transition-all";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-on-surface">
            {type === 'diagnostic' ? 'Weekly Operating Hours' : 'Weekly Schedule'}
          </CardTitle>
          <CardDescription>
            {type === 'diagnostic' 
              ? 'Configure your diagnostic center\'s weekly schedule'
              : type === 'doctor'
              ? 'Configure your recurring weekly schedule'
              : 'Configure your clinic\'s operating hours and availability'}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schedule.map((day, index) => {
            const slots = day.slots || day.timeSlots || [];
            
            return (
              <div key={day.day}>
                <div className="grid grid-cols-[120px_1fr] gap-4 items-start">
                  <div className="pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{day.day}</span>
                      <Switch
                        checked={day.isActive}
                        onCheckedChange={() => onToggleDay(day.day)}
                      />
                    </div>
                    {day.isActive && slots.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {slots[0].startTime || slots[0].start} - {slots[slots.length - 1].endTime || slots[slots.length - 1].end}
                      </span>
                    )}
                  </div>

                  <div>
                    {day.isActive ? (
                      <div className="flex flex-wrap gap-3 items-center">
                        {slots.map((slot) => (
                          <div
                            key={slot.id}
                            className={cn(getSlotClassName(), getSlotMinWidth())}
                          >
                            {getSlotDisplay(slot)}
                            <button
                              onClick={() => onRemoveSlot(day.day, slot.id)}
                              className={cn(
                                "ml-auto opacity-0 group-hover:opacity-100 transition-opacity",
                                type === 'clinic' ? "text-white hover:text-red-200" : ""
                              )}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => onAddSlot(day.day)}
                          className={getAddButtonClassName()}
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Ban className="h-4 w-4" />
                        <span className="text-sm">{day.note || (type === 'doctor' ? 'Not available' : 'Clinic closed')}</span>
                        <Button variant="link" size="sm" onClick={() => onToggleDay(day.day)}>
                          Add Hours
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                {index < schedule.length - 1 && <Separator className="my-4" />}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}