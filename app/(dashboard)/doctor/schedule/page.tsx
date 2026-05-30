// app/doctor/schedule/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { useSchedule } from "@/hooks/useSchedule"
import { DaySchedule, TimeSlotTemplate } from "@/types/entities/schedule.types"

import { ScheduleHeader } from "@/components/schedules/schedule-header"
import { ScheduleSettings } from "@/components/schedules/schedule-settings"
import { WeeklySchedule } from "@/components/schedules/weekly-schedule"
import { AddSlotDialog } from "@/components/schedules/add-slot-dialog"
import { ScheduleProTip } from "@/components/schedules/schedule-pro-tip"

const DOCTOR_PROVIDER_ID = 101

export default function DoctorSchedulePage() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false)
  const [localSchedule, setLocalSchedule] = useState<DaySchedule[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const {
    daySchedule,
    settings,
    isLoading,
    saveDayScheduleTemplate,
    updateScheduleSettings,
    fetchDayScheduleTemplate,
    fetchScheduleSettings,
  } = useSchedule({
    providerId: DOCTOR_PROVIDER_ID,
    providerType: "doctor",
    autoFetch: true,
  })

  useEffect(() => {
    setLocalSchedule(daySchedule ?? [])
  }, [daySchedule])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await fetchDayScheduleTemplate("doctor", DOCTOR_PROVIDER_ID)
      await fetchScheduleSettings(DOCTOR_PROVIDER_ID)
      toast.success("Schedule refreshed")
    } catch {
      toast.error("Failed to refresh schedule")
    } finally {
      setIsRefreshing(false)
    }
  }, [fetchDayScheduleTemplate, fetchScheduleSettings])

  const addTimeSlot = (day: string, slot: any) => {
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
                  shift: slot.type ?? "consultation",
                  maxCapacity: 1,
                },
              ],
            }
          : d
      )
    )
    setIsAddSlotOpen(false)
    toast.success("Slot added")
  }

  const removeTimeSlot = (day: string, id: string) => {
    setLocalSchedule((prev) =>
      prev.map((d) =>
        d.day === day
          ? { ...d, slots: (d.slots || []).filter((s) => s.id !== id) }
          : d
      )
    )
  }

  const toggleDay = (day: string) => {
    setLocalSchedule((prev) =>
      prev.map((d) =>
        d.day === day ? { ...d, isActive: !d.isActive } : d
      )
    )
  }

  const saveSchedule = useCallback(async () => {
    try {
      await saveDayScheduleTemplate(DOCTOR_PROVIDER_ID, localSchedule)
      toast.success("Saved successfully")
    } catch {
      toast.error("Save failed")
    }
  }, [localSchedule, saveDayScheduleTemplate])

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#006767]">
            Doctor Schedule
          </h1>
          <p className="text-muted-foreground">
            Manage consultation availability
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />
          Refresh
        </Button>
      </div>

      <ScheduleHeader
        title="Doctor Schedule"
        description="Manage consultation slots"
        onSave={saveSchedule}
      />

          <ScheduleSettings
            settings={{
              slotDuration: settings?.slotDuration?.toString(),
              bufferTime: settings?.bufferTime?.toString(),
              maxAppointmentsPerDay: settings?.maxAppointmentsPerDay?.toString(),
              breakDuration: (settings as any)?.breakDuration?.toString(),
            }}
            onSettingChange={(key: string, value: any) => {
              updateScheduleSettings(DOCTOR_PROVIDER_ID, {
                [key]: value,
              } as any);
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
        onRemoveSlot={removeTimeSlot}
      />

      <ScheduleProTip type="doctor" />

      <AddSlotDialog
        open={isAddSlotOpen}
        onOpenChange={setIsAddSlotOpen}
        dayName={selectedDay || undefined}
        type="doctor"
        onAdd={(slot) => selectedDay && addTimeSlot(selectedDay, slot)}
      />
    </div>
  )
}