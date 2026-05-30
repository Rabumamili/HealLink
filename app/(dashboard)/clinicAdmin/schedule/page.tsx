// app/clinic-admin/schedule/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { useSchedule } from "@/hooks/useSchedule"
import { ScheduleHeader } from "@/components/schedules/schedule-header"
import { ScheduleSettings } from "@/components/schedules/schedule-settings"
import { WeeklySchedule } from "@/components/schedules/weekly-schedule"
import { AddSlotDialog } from "@/components/schedules/add-slot-dialog"
import { ScheduleProTip } from "@/components/schedules/schedule-pro-tip"

const ID = 103

export default function ClinicSchedulePage() {
  const [day, setDay] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [schedule, setSchedule] = useState<any[]>([])

  const {
    daySchedule,
    settings,
    isLoading,
    saveDayScheduleTemplate,
    updateScheduleSettings,
    fetchDayScheduleTemplate,
    fetchScheduleSettings,
  } = useSchedule({ providerId: ID, providerType: "clinic", autoFetch: true })

  useEffect(() => setSchedule(daySchedule ?? []), [daySchedule])

  const toggle = (d: string) =>
    setSchedule((p) =>
      p.map((x) =>
        x.day === d ? { ...x, isActive: !x.isActive } : x
      )
    )

  const add = (d: string, slot: any) =>
    setSchedule((p) =>
      p.map((x) =>
        x.day === d
          ? {
              ...x,
              slots: [
                ...(x.slots || []),
                { ...slot, id: Date.now().toString() },
              ],
            }
          : x
      )
    )

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-[#006767]">
          Clinic Schedule
        </h1>

        <Button
          onClick={() =>
            fetchDayScheduleTemplate("clinic", ID).then(() =>
              toast.success("Refreshed")
            )
          }
        >
          <RefreshCw />
        </Button>
      </div>

      <ScheduleHeader
        title="Clinic Schedule"
        description="Manage operating hours"
        onSave={() => saveDayScheduleTemplate(ID, schedule)}
      />

<ScheduleSettings
  settings={{
    slotDuration: settings?.slotDuration?.toString(),
    bufferTime: settings?.bufferTime?.toString(),
    maxAppointmentsPerDay:
      settings?.maxAppointmentsPerDay?.toString(),
  }}
  onSettingChange={(key: string, value: any) => {
    updateScheduleSettings(ID, {
      [key]: value,
    } as any);
  }}
  type="clinic"
/>

      <WeeklySchedule
        schedule={schedule}
        type="clinic"
        onToggleDay={toggle}
        onAddSlot={(d: string) => {
          setDay(d)
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

      <ScheduleProTip type="clinic" />

      <AddSlotDialog
        open={open}
        onOpenChange={setOpen}
        dayName={day || undefined}
        type="clinic"
        onAdd={(slot) => day && add(day, slot)}
      />
    </div>
  )
}