// app/diagnostic-center/schedule/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { useSchedule } from "@/hooks/useSchedule"
import { ScheduleHeader } from "@/components/schedules/schedule-header"
import { ScheduleSettings } from "@/components/schedules/schedule-settings"
import { WeeklySchedule } from "@/components/schedules/weekly-schedule"
import { AddSlotDialog } from "@/components/schedules/add-slot-dialog"
import { ScheduleProTip } from "@/components/schedules/schedule-pro-tip"

const ID = 104

export default function DiagnosticSchedulePage() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [schedule, setSchedule] = useState<any[]>([])
  const [loadingRefresh, setLoadingRefresh] = useState(false)

  const {
    daySchedule,
    settings,
    isLoading,
    saveDayScheduleTemplate,
    updateScheduleSettings,
    fetchDayScheduleTemplate,
    fetchScheduleSettings,
  } = useSchedule({ providerId: ID, providerType: "diagnostic", autoFetch: true })

  useEffect(() => setSchedule(daySchedule ?? []), [daySchedule])

  const refresh = useCallback(async () => {
    setLoadingRefresh(true)
    try {
      await fetchDayScheduleTemplate("diagnostic", ID)
      await fetchScheduleSettings(ID)
      toast.success("Updated")
    } catch {
      toast.error("Refresh failed")
    } finally {
      setLoadingRefresh(false)
    }
  }, [])

  const addSlot = (day: string, slot: any) => {
    setSchedule((prev) =>
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
                  maxCapacity: slot.maxPatients ?? 20,
                },
              ],
            }
          : d
      )
    )
    setOpen(false)
  }

  const toggle = (day: string) => {
    setSchedule((p) =>
      p.map((d) =>
        d.day === day ? { ...d, isActive: !d.isActive } : d
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-[#006767]">
          Diagnostic Schedule
        </h1>

        <Button onClick={refresh} disabled={loadingRefresh}>
          <RefreshCw className={loadingRefresh ? "animate-spin" : ""} />
        </Button>
      </div>

      <ScheduleHeader
        title="Diagnostic Schedule"
        description="Manage test availability"
        onSave={() => saveDayScheduleTemplate(ID, schedule)}
      />

<ScheduleSettings
  settings={{
    slotDuration: settings?.slotDuration?.toString(),
    bufferTime: settings?.bufferTime?.toString(),
    maxAppointmentsPerDay:
      settings?.maxAppointmentsPerDay?.toString(),
    resultTurnaroundTime:
      (settings as any)?.resultTurnaroundTime?.toString(),
  }}
  onSettingChange={(key: string, value: any) => {
    updateScheduleSettings(ID, {
      [key]: value,
    } as any);
  }}
  type="diagnostic"
/>

      <WeeklySchedule
        schedule={schedule}
        type="diagnostic"
        onToggleDay={toggle}
        onAddSlot={(d: string) => {
          setSelectedDay(d)
          setOpen(true)
        }}
        onRemoveSlot={(d: string, id: string) =>
          setSchedule((p) =>
            p.map((x) =>
              x.day === d
                ? {
                    ...x,
                    slots: (x.slots || []).filter((s: any) => s.id !== id),
                  }
                : x
            )
          )
        }
      />

      <ScheduleProTip type="diagnostic" />

      <AddSlotDialog
        open={open}
        onOpenChange={setOpen}
        dayName={selectedDay || undefined}
        type="diagnostic"
        onAdd={(slot) => selectedDay && addSlot(selectedDay, slot)}
      />
    </div>
  )
}