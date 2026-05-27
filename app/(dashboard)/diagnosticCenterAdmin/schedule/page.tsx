// app/diagnostic-center/schedule/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TestTube, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useSchedule } from '@/hooks/useSchedule';
import { DaySchedule, TimeSlotTemplate } from '@/types/entities/schedule.types';

import { ScheduleHeader } from '@/components/schedules/schedule-header';
import { ScheduleSettings } from '@/components/schedules/schedule-settings';
import { WeeklySchedule } from '@/components/schedules/weekly-schedule';
import { AddSlotDialog } from '@/components/schedules/add-slot-dialog';
import { ScheduleProTip } from '@/components/schedules/schedule-pro-tip';

const DIAGNOSTIC_PROVIDER_ID = 104;

export default function DiagnosticCenterSchedulePage() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [localSchedule, setLocalSchedule] = useState<DaySchedule[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    daySchedule,
    settings,
    isLoading,
    saveDayScheduleTemplate,
    updateScheduleSettings,
    fetchDayScheduleTemplate,
    fetchScheduleSettings,
  } = useSchedule({
    providerId: DIAGNOSTIC_PROVIDER_ID,
    providerType: 'diagnostic',
    autoFetch: true,
  });

  useEffect(() => {
    if (daySchedule.length > 0) {
      setLocalSchedule(daySchedule);
    }
  }, [daySchedule]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await fetchDayScheduleTemplate('diagnostic', DIAGNOSTIC_PROVIDER_ID)
      await fetchScheduleSettings(DIAGNOSTIC_PROVIDER_ID)
      toast.success("Schedule refreshed")
    } catch (error) {
      console.error("Error refreshing schedule:", error)
      toast.error("Failed to refresh schedule")
    } finally {
      setIsRefreshing(false)
    }
  }, [fetchDayScheduleTemplate, fetchScheduleSettings])

  const addTimeSlot = (day: string, slotData: any) => {
    setLocalSchedule(prev => prev.map(d => {
      if (d.day === day) {
        const newSlot: TimeSlotTemplate = {
          id: Date.now().toString(),
          startTime: slotData.startTime,
          endTime: slotData.endTime,
          shift: slotData.type === 'morning' ? 'Morning' : slotData.type === 'afternoon' ? 'Afternoon' : 'Evening',
          maxCapacity: slotData.maxPatients || 20,
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
      await saveDayScheduleTemplate(DIAGNOSTIC_PROVIDER_ID, localSchedule);
      toast.success("Schedule saved successfully");
    } catch (error) {
      toast.error("Failed to save schedule");
    }
  };

  const handleSettingChange = async (key: string, value: any) => {
    try {
      await updateScheduleSettings(DIAGNOSTIC_PROVIDER_ID, { [key]: value });
    } catch (error) {
      toast.error("Failed to update settings");
    }
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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#006767]">Schedule Management</h1>
          <p className="text-muted-foreground">Configure diagnostic center operating hours and test scheduling</p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="border-[#006767]/20 text-[#006767] hover:bg-[#006767]/5"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <ScheduleHeader
        title="Center Schedule Management"
        description="Configure diagnostic center operating hours and test scheduling"
        onApplyToAll={applyToAllWeekdays}
        onSave={saveSchedule}
        showApplyButton={true}
      />

      <ScheduleSettings
        settings={{
          slotDuration: settings?.slotDuration?.toString() || "30",
          bufferTime: settings?.bufferTime?.toString() || "10",
          maxAppointmentsPerDay: settings?.maxAppointmentsPerDay?.toString() || "100",
          resultTurnaroundTime: (settings as any)?.resultTurnaroundTime?.toString() || "24",
          walkInAllowed: (settings as any)?.walkInAllowed ?? true,
          requireAppointment: (settings as any)?.requireAppointment ?? false,
        }}
        onSettingChange={handleSettingChange}
        type="diagnostic"
      />

      <WeeklySchedule
        schedule={localSchedule}
        onToggleDay={handleToggleDay}
        onAddSlot={handleOpenAddSlot}
        onRemoveSlot={removeTimeSlot}
        type="diagnostic"
      />

      {/* Service Type Distribution - Additional Card for Diagnostic */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TestTube className="h-5 w-5 text-teal-600" />
            Service Availability by Time Slot
          </CardTitle>
          <CardDescription>Configure which tests are available during each time slot</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Morning (8AM - 12PM)
              </h4>
              <p className="text-sm text-muted-foreground mt-2">All routine tests, Blood work, Urinalysis</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Afternoon (1PM - 5PM)
              </h4>
              <p className="text-sm text-muted-foreground mt-2">Imaging, X-Ray, Ultrasound, Specialized tests</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Evening (5PM - 8PM)
              </h4>
              <p className="text-sm text-muted-foreground mt-2">Emergency tests only (by appointment)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ScheduleProTip type="diagnostic" />

      <AddSlotDialog
        open={isAddSlotOpen}
        onOpenChange={setIsAddSlotOpen}
        onAdd={(slot) => selectedDay && addTimeSlot(selectedDay, slot)}
        dayName={selectedDay || undefined}
        type="diagnostic"
      />
    </div>
  );
}