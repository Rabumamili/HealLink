// app/clinic-admin/schedule/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useSchedule } from '@/hooks/useSchedule';
import { DaySchedule } from '@/types/entities/schedule.types';

import { ScheduleHeader } from '@/components/schedules/schedule-header';
import { ScheduleSettings } from '@/components/schedules/schedule-settings';
import { WeeklySchedule } from '@/components/schedules/weekly-schedule';
import { AddSlotDialog } from '@/components/schedules/add-slot-dialog';
import { ScheduleProTip } from '@/components/schedules/schedule-pro-tip';

const CLINIC_PROVIDER_ID = 103;

export default function ClinicSchedulePage() {
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
    providerId: CLINIC_PROVIDER_ID,
    providerType: 'clinic',
    autoFetch: true,
  });

  useEffect(() => {
    if (daySchedule.length > 0) {
      setLocalSchedule(daySchedule);
    }
  }, [daySchedule]);

  const updateDaySchedule = (day: string, updates: Partial<DaySchedule>) => {
    setLocalSchedule(prev => prev.map(d => 
      d.day === day ? { ...d, ...updates } : d
    ));
  };

  const addTimeSlot = (day: string, slot: any) => {
    setLocalSchedule(prev => prev.map(d => {
      if (d.day === day) {
        const newSlot = { ...slot, id: Date.now().toString() };
        return { ...d, slots: [...(d.slots || []), newSlot] };
      }
      return d;
    }));
    setIsAddSlotOpen(false);
    toast.success("Time slot added successfully");
  };

  const removeTimeSlot = (day: string, slotId: string) => {
    setLocalSchedule(prev => prev.map(d => {
      if (d.day === day) {
        return { ...d, slots: (d.slots || []).filter(s => s.id !== slotId) };
      }
      return d;
    }));
    toast.success("Time slot removed");
  };

  const handleToggleDay = (day: string) => {
    const currentDay = localSchedule.find(d => d.day === day);
    if (currentDay) {
      updateDaySchedule(day, { isActive: !currentDay.isActive });
      toast.success(`${day} ${!currentDay.isActive ? "activated" : "deactivated"}`);
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
      await saveDayScheduleTemplate(CLINIC_PROVIDER_ID, localSchedule);
      toast.success("Schedule saved successfully");
    } catch (error) {
      toast.error("Failed to save schedule");
    }
  };

  const handleSettingChange = async (key: string, value: any) => {
    await updateScheduleSettings(CLINIC_PROVIDER_ID, { [key]: value });
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
        description="Configure your clinic's operating hours and availability"
        onApplyToAll={applyToAllWeekdays}
        onSave={saveSchedule}
        showApplyButton={true}
      />

      <ScheduleSettings
        settings={{
          slotDuration: settings?.slotDuration?.toString() || "30",
          bufferTime: settings?.bufferTime?.toString() || "0",
          maxAppointmentsPerDay: settings?.maxAppointmentsPerDay?.toString() || "16",
        }}
        onSettingChange={handleSettingChange}
        type="clinic"
      />

      <WeeklySchedule
        schedule={localSchedule}
        onToggleDay={handleToggleDay}
        onAddSlot={handleOpenAddSlot}
        onRemoveSlot={removeTimeSlot}
        type="clinic"
      />

      <ScheduleProTip type="clinic" />

      <AddSlotDialog
        open={isAddSlotOpen}
        onOpenChange={setIsAddSlotOpen}
        onAdd={(slot) => selectedDay && addTimeSlot(selectedDay, slot)}
        dayName={selectedDay || undefined}
        type="clinic"
      />
    </div>
  );
}