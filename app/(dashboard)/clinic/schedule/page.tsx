// app/clinic-admin/schedule/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { CalendarDays } from "lucide-react"
import { toast } from "sonner"

import { useSchedule } from "@/hooks/useSchedule"
import { SchedulePageHeader } from "@/components/schedules/SchedulePageHeader"
import { ScheduleSettings } from "@/components/schedules/schedule-settings"
import { WeeklySchedule } from "@/components/schedules/weekly-schedule"
import { AddSlotDialog } from "@/components/schedules/add-slot-dialog"
import { ScheduleProTip } from "@/components/schedules/schedule-pro-tip"
import { LoadingState } from "@/components/common/LoadingState"

const getCurrentClinicId = (): number | null => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('currentClinicId');
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) return parsed;
    }
  }
  return null;
};

export default function ClinicSchedulePage() {
  const clinicId = getCurrentClinicId();

  if (clinicId === null) {
    return <LoadingState message="Loading schedule..." />;
  }
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false)
  const [localSchedule, setLocalSchedule] = useState<any[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const {
    schedules,
    isLoading,
    listSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  } = useSchedule({ serviceId: undefined, autoFetch: true })

  useEffect(() => {
    if (schedules) {
      setLocalSchedule(schedules)
    }
  }, [schedules])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await listSchedules()
      toast.success("Schedule refreshed")
    } catch {
      toast.error("Failed to refresh schedule")
    } finally {
      setIsRefreshing(false)
    }
  }, [listSchedules])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      // The new API doesn't have batch save, would need to save each schedule individually
      toast.info("Schedule management updated to work with new API")
    } catch {
      toast.error("Failed to save schedule")
    } finally {
      setIsSaving(false)
    }
  }, [])

  const toggleDay = (day: string) => {
    setLocalSchedule((prev) =>
      prev.map((d) =>
        d.day === day ? { ...d, isActive: !d.isActive } : d
      )
    )
  }

  const addSlot = (day: string, slot: any) => {
    setLocalSchedule((prev) =>
      prev.map((d) =>
        d.day === day
          ? {
              ...d,
              slots: [
                ...(d.slots || []),
                {
                  id: Date.now().toString(),
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                  shift: slot.shift,
                },
              ],
            }
          : d
      )
    )
    setIsAddSlotOpen(false)
    toast.success("Slot added")
  }

  const removeSlot = (day: string, slotId: string) => {
    setLocalSchedule((prev) =>
      prev.map((d) =>
        d.day === day
          ? { ...d, slots: (d.slots || []).filter((s: any) => s.id !== slotId) }
          : d
      )
    )
    toast.success("Slot removed")
  }

  if (isLoading && localSchedule.length === 0) {
    return <LoadingState message="Loading schedule..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        <SchedulePageHeader
          title="Clinic Schedule"
          description="Manage your clinic's operating hours, set availability for each day of the week, and configure appointment settings."
          icon={<CalendarDays className="h-5 w-5" />}
          onRefresh={handleRefresh}
          onSave={handleSave}
          isRefreshing={isRefreshing}
          isSaving={isSaving}
        />

        <ScheduleSettings
          settings={{
            slotDuration: "30",
            bufferTime: "5",
            maxAppointmentsPerDay: "20",
          }}
          onSettingChange={(key: string, value: any) => {
            toast.info("Settings management not available in current API version")
          }}
          type="clinic"
        />

        <WeeklySchedule
          schedule={localSchedule}
          type="clinic"
          onToggleDay={toggleDay}
          onAddSlot={(day: string) => {
            setSelectedDay(day)
            setIsAddSlotOpen(true)
          }}
          onRemoveSlot={removeSlot}
        />

        <ScheduleProTip type="clinic" />

        <AddSlotDialog
          open={isAddSlotOpen}
          onOpenChange={setIsAddSlotOpen}
          dayName={selectedDay || undefined}
          type="clinic"
          onAdd={(slot) => selectedDay && addSlot(selectedDay, slot)}
        />
      </div>
    </div>
  )
}