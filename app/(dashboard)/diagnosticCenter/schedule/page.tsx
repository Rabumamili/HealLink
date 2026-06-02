// app/diagnostic-center/schedule/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { FlaskConical, Plus } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/hooks/useAuth"
import { useServices } from "@/hooks/useService"
import { useSchedule } from "@/hooks/useSchedule"
import { SchedulePageHeader } from "@/components/schedules/SchedulePageHeader"
import { ScheduleSettings } from "@/components/schedules/schedule-settings"
import { WeeklySchedule } from "@/components/schedules/weekly-schedule"
import { AddSlotDialog } from "@/components/schedules/add-slot-dialog"
import { ScheduleProTip } from "@/components/schedules/schedule-pro-tip"
import { LoadingState } from "@/components/common/LoadingState"
import { EmptyState } from "@/components/common/EmptyState"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function DiagnosticSchedulePage() {
  const { user, isLoading: isAuthLoading } = useAuth({ requireAuth: true })
  const { services, isLoading: isServicesLoading } = useServices({
    autoFetch: true,
    providerId: user?.provider_id,
  })

  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false)
  const [isCreateScheduleOpen, setIsCreateScheduleOpen] = useState(false)
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
  } = useSchedule({ serviceId: selectedServiceId || undefined, autoFetch: !!selectedServiceId })

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
                  startTime: slot.start,
                  endTime: slot.end,
                  type: slot.type,
                  maxCapacity: slot.maxPatients,
                },
              ],
            }
          : d
      )
    )
    setIsAddSlotOpen(false)
    toast.success("Test slot added")
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
    return <LoadingState message="Loading diagnostic schedule..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        <SchedulePageHeader
          title="Diagnostic Schedule"
          description="Manage your diagnostic center's test availability, set time slots for each day, and configure test appointment settings."
          icon={<FlaskConical className="h-5 w-5" />}
          onRefresh={handleRefresh}
          onSave={handleSave}
          isRefreshing={isRefreshing}
          isSaving={isSaving}
        />

        {/* Service Selector & Create Schedule */}
        {services.length === 0 ? (
          <EmptyState
            variant="schedule"
            title="No Services Yet"
            message="Create a service first to manage schedules"
            submessage="Go to Services to add your first diagnostic test service."
            icon={<FlaskConical className="h-8 w-8" />}
            actionLabel="Go to Services"
            actionHref="/diagnosticCenter/services"
          />
        ) : (
          <>
            <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Service
                </label>
                <Select value={selectedServiceId?.toString() || ""} onValueChange={(v) => setSelectedServiceId(parseInt(v))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a service to manage schedules" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Dialog open={isCreateScheduleOpen} onOpenChange={setIsCreateScheduleOpen}>
                <DialogTrigger asChild>
                  <Button className="mt-6" variant="default" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Schedule
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Schedule</DialogTitle>
                    <DialogDescription>
                      Set up a new schedule for {services.find(s => s.id === selectedServiceId)?.name || 'your service'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {/* Placeholder for schedule creation form */}
                    <p className="text-sm text-slate-600">Schedule creation form coming soon</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {selectedServiceId && (
              <>
                <ScheduleSettings
                  settings={{
                    slotDuration: "30",
                    bufferTime: "5",
                    resultTurnaroundTime: "24",
                    walkInAllowed: false,
                    requireAppointment: true,
                  }}
                  onSettingChange={(key: string, value: any) => {
                    toast.info("Settings management not available in current API version")
                  }}
                  type="diagnostic"
                />

                <WeeklySchedule
                  schedule={localSchedule}
                  type="diagnostic"
                  onToggleDay={toggleDay}
                  onAddSlot={(day: string) => {
                    setSelectedDay(day)
                    setIsAddSlotOpen(true)
                  }}
                  onRemoveSlot={removeSlot}
                />
              </>
            )}
          </>
        )}

        <ScheduleProTip type="diagnostic" />

        <AddSlotDialog
          open={isAddSlotOpen}
          onOpenChange={setIsAddSlotOpen}
          dayName={selectedDay || undefined}
          type="diagnostic"
          onAdd={(slot) => selectedDay && addSlot(selectedDay, slot)}
        />
      </div>
    </div>
  )
}