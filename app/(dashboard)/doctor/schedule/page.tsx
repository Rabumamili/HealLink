// app/doctor/schedule/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Ban } from 'lucide-react';
import { toast } from 'sonner';
import { useSchedule } from '@/hooks/useSchedule';
import { DaySchedule, TimeSlotTemplate } from '@/types/entities/schedule.types';

import { ScheduleHeader } from '@/components/schedules/schedule-header';
import { ScheduleSettings } from '@/components/schedules/schedule-settings';
import { WeeklySchedule } from '@/components/schedules/weekly-schedule';
import { AddSlotDialog } from '@/components/schedules/add-slot-dialog';
import { ScheduleProTip } from '@/components/schedules/schedule-pro-tip';

const DOCTOR_PROVIDER_ID = 101;

export default function DoctorSchedulePage() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [localSchedule, setLocalSchedule] = useState<DaySchedule[]>([]);

  const {
    daySchedule,
    settings,
    isLoading,
    saveDayScheduleTemplate,
    updateScheduleSettings,
  } = useSchedule({
    providerId: DOCTOR_PROVIDER_ID,
    providerType: 'doctor',
    autoFetch: true,
  });

  useEffect(() => {
    if (daySchedule.length > 0) {
      setLocalSchedule(daySchedule);
    }
  }, [daySchedule]);

  const addTimeSlot = (day: string, slotData: any) => {
    setLocalSchedule(prev => prev.map(d => {
      if (d.day === day) {
        const newSlot: TimeSlotTemplate = {
          id: Date.now().toString(),
          startTime: slotData.startTime,
          endTime: slotData.endTime,
          shift: slotData.type === 'shift' ? 'Shift' : slotData.type === 'break' ? 'Break' : 'Consultation',
          maxCapacity: 1,
        };
        return { ...d, slots: [...(d.slots || []), newSlot] };
      }
      return d;
    }));
    setIsAddSlotOpen(false);
    toast.success("Time slot added successfully");
  };

  const removeTimeSlot = (dayName: string, slotId: string) => {
    setLocalSchedule(prev => prev.map(d => {
      if (d.day === dayName) {
        return { ...d, slots: (d.slots || []).filter(s => s.id !== slotId) };
      }
      return d;
    }));
    toast.success("Time slot removed");
  };

  const handleToggleDay = (dayName: string) => {
    const currentDay = localSchedule.find(d => d.day === dayName);
    if (currentDay) {
      setLocalSchedule(prev => prev.map(d =>
        d.day === dayName ? { ...d, isActive: !d.isActive } : d
      ));
      toast.success(`${dayName} ${!currentDay.isActive ? "activated" : "deactivated"}`);
    }
  };

  const applyToAllWeekdays = () => {
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const mondaySchedule = localSchedule.find(d => d.day === "Monday");
    if (mondaySchedule) {
      setLocalSchedule(prev => prev.map(d => {
        if (weekdays.includes(d.day) && d.day !== "Monday") {
          return { ...d, slots: [...(mondaySchedule.slots || [])], isActive: true };
        }
        return d;
      }));
      toast.success("Applied Monday schedule to all weekdays");
    }
  };

  const handleOpenAddSlot = (day: string) => {
    setSelectedDay(day);
    setIsAddSlotOpen(true);
  };

  const saveSchedule = async () => {
    try {
      await saveDayScheduleTemplate(DOCTOR_PROVIDER_ID, localSchedule);
      toast.success("Schedule saved successfully");
    } catch (error) {
      toast.error("Failed to save schedule");
    }
  };

  const handleSettingChange = async (key: string, value: any) => {
    await updateScheduleSettings(DOCTOR_PROVIDER_ID, { [key]: value });
  };

  if (isLoading && localSchedule.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Loading schedule...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ScheduleHeader
        title="Schedule Management"
        description="Configure your clinical availability and booking logic"
        onApplyToAll={applyToAllWeekdays}
        onSave={saveSchedule}
        showApplyButton={true}
      />

      <ScheduleSettings
        settings={{
          slotDuration: settings?.slotDuration?.toString() || "30",
          bufferTime: settings?.bufferTime?.toString() || "5",
          maxAppointmentsPerDay: settings?.maxAppointmentsPerDay?.toString() || "16",
          breakDuration: (settings as any)?.breakDuration?.toString() || "30",
        }}
        onSettingChange={handleSettingChange}
        type="doctor"
      />

      <WeeklySchedule
        schedule={localSchedule}
        onToggleDay={handleToggleDay}
        onAddSlot={handleOpenAddSlot}
        onRemoveSlot={removeTimeSlot}
        type="doctor"
      />

      {/* Exceptions Card - Additional Card for Doctor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Ban className="h-5 w-5 text-teal-600" />
            Exceptions
          </CardTitle>
          <CardDescription>Add specific dates for holidays or time off</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Exception
          </Button>
        </CardContent>
      </Card>

      <ScheduleProTip type="doctor" />

      <AddSlotDialog
        open={isAddSlotOpen}
        onOpenChange={setIsAddSlotOpen}
        onAdd={(slot) => selectedDay && addTimeSlot(selectedDay, slot)}
        dayName={selectedDay || undefined}
        type="doctor"
      />
    </div>
  );
}