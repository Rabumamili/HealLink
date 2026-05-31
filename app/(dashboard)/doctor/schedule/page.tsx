// app/doctor/schedule/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { Stethoscope } from "lucide-react"
import { toast } from "sonner"

import { useSchedule } from "@/hooks/useSchedule"
import { SchedulePageHeader } from "@/components/schedules/SchedulePageHeader"
import { ScheduleSettings } from "@/components/schedules/schedule-settings"
import { WeeklySchedule } from "@/components/schedules/weekly-schedule"
import { AddSlotDialog } from "@/components/schedules/add-slot-dialog"
import { ScheduleProTip } from "@/components/schedules/schedule-pro-tip"
import { LoadingState } from "@/components/common/LoadingState"

const PROVIDER_ID = 101

export default function DoctorSchedulePage() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false)
  const [localSchedule, setLocalSchedule] = useState<any[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const {
    daySchedule,
    settings,
    isLoading,
    saveDayScheduleTemplate,
    updateScheduleSettings,
    fetchDayScheduleTemplate,
    fetchScheduleSettings,
  } = useSchedule({ providerId: PROVIDER_ID, providerType: "doctor", autoFetch: true })

  useEffect(() => {
    if (daySchedule) {
      setLocalSchedule(daySchedule)
    }
  }, [daySchedule])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await fetchDayScheduleTemplate("doctor", PROVIDER_ID)
      await fetchScheduleSettings(PROVIDER_ID)
      toast.success("Schedule refreshed")
    } catch {
      toast.error("Failed to refresh schedule")
    } finally {
      setIsRefreshing(false)
    }
  }, [fetchDayScheduleTemplate, fetchScheduleSettings])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      await saveDayScheduleTemplate(PROVIDER_ID, localSchedule)
      toast.success("Schedule saved successfully")
    } catch {
      toast.error("Failed to save schedule")
    } finally {
      setIsSaving(false)
    }
  }, [localSchedule, saveDayScheduleTemplate])

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
                  startTime: slot.start,
                  endTime: slot.end,
                  type: slot.type,
                },
              ],
            }
          : d
      )
    )
    setIsAddSlotOpen(false)
    toast.success("Time slot added")
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
    return <LoadingState message="Loading your schedule..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        <SchedulePageHeader
          title="Doctor Schedule"
          description="Manage your consultation availability, set working hours for each day, and configure appointment settings for your practice."
          icon={<Stethoscope className="h-5 w-5" />}
          onRefresh={handleRefresh}
          onSave={handleSave}
          isRefreshing={isRefreshing}
          isSaving={isSaving}
        />

        <ScheduleSettings
          settings={{
            slotDuration: settings?.slotDuration?.toString(),
            bufferTime: settings?.bufferTime?.toString(),
            maxAppointmentsPerDay: settings?.maxAppointmentsPerDay?.toString(),
            breakDuration: (settings as any)?.breakDuration?.toString(),
          }}
          onSettingChange={(key: string, value: any) => {
            updateScheduleSettings(PROVIDER_ID, { [key]: value } as any)
          }}
          type="doctor"
        />

        <WeeklySchedule
          schedule={localSchedule}
          type="doctor"
          onToggleDay={toggleDay}
          onAddSlot={(day: string) => {
            setSelectedDay(day)
            setIsAddSlotOpen(true)
          }}
          onRemoveSlot={removeSlot}
        />

        <ScheduleProTip type="doctor" />

        <AddSlotDialog
          open={isAddSlotOpen}
          onOpenChange={setIsAddSlotOpen}
          dayName={selectedDay || undefined}
          type="doctor"
          onAdd={(slot) => selectedDay && addSlot(selectedDay, slot)}
        />
      </div>
    </div>
  )
}