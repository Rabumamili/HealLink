// app/clinic-admin/schedule/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { CalendarDays, Plus } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

export default function ClinicSchedulePage() {
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
  const [newSchedule, setNewSchedule] = useState({
    day_of_week: 1,
    start_time: '09:00',
    end_time: '17:00',
    slot_duration_minutes: 30,
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: '2025-12-31'
  })

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
    if (!selectedServiceId) {
      toast.error("Please select a service first")
      return
    }

    setIsSaving(true)
    try {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      
      for (const daySchedule of localSchedule) {
        if (daySchedule.isActive && daySchedule.slots && daySchedule.slots.length > 0) {
          const dayIndex = days.indexOf(daySchedule.day)
          const dayOfWeek = dayIndex === 6 ? 0 : dayIndex + 1 // Convert Monday=0 to 1, Sunday=6 to 0
          
          for (const slot of daySchedule.slots) {
            const scheduleData = {
              service_id: selectedServiceId,
              schedule_type: 'weekly' as const,
              day_of_week: dayOfWeek,
              start_time: slot.startTime,
              end_time: slot.endTime,
              slot_duration_minutes: 30,
              valid_from: new Date().toISOString().split('T')[0],
              valid_until: '2025-12-31'
            }
            
            await createSchedule(scheduleData)
          }
        }
      }
      
      toast.success("Schedule saved successfully")
      await listSchedules()
    } catch (error) {
      console.error('Failed to save schedule:', error)
      toast.error("Failed to save schedule")
    } finally {
      setIsSaving(false)
    }
  }, [selectedServiceId, localSchedule, createSchedule, listSchedules])

  const handleCreateSchedule = useCallback(async () => {
    if (!selectedServiceId) {
      toast.error("Please select a service first")
      return
    }

    setIsSaving(true)
    try {
      const scheduleData = {
        service_id: selectedServiceId,
        schedule_type: 'weekly' as const,
        day_of_week: newSchedule.day_of_week,
        start_time: newSchedule.start_time,
        end_time: newSchedule.end_time,
        slot_duration_minutes: newSchedule.slot_duration_minutes,
        valid_from: newSchedule.valid_from,
        valid_until: newSchedule.valid_until
      }
      
      await createSchedule(scheduleData)
      toast.success("Schedule created successfully")
      setIsCreateScheduleOpen(false)
      setNewSchedule({
        day_of_week: 1,
        start_time: '09:00',
        end_time: '17:00',
        slot_duration_minutes: 30,
        valid_from: new Date().toISOString().split('T')[0],
        valid_until: '2025-12-31'
      })
      await listSchedules()
    } catch (error) {
      console.error('Failed to create schedule:', error)
      toast.error("Failed to create schedule")
    } finally {
      setIsSaving(false)
    }
  }, [selectedServiceId, newSchedule, createSchedule, listSchedules])

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

        {/* Service Selector & Create Schedule */}
        {services.length === 0 ? (
          <EmptyState
            variant="schedule"
            title="No Services Yet"
            message="Create a service first to manage schedules"
            submessage="Go to Services to add your first clinic service."
            icon={<CalendarDays className="h-8 w-8" />}
            actionLabel="Go to Services"
            actionHref="/clinic/services"
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
                    <div className="space-y-2">
                      <Label>Day of Week</Label>
                      <Select value={newSchedule.day_of_week.toString()} onValueChange={(v) => setNewSchedule({ ...newSchedule, day_of_week: parseInt(v) })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Monday</SelectItem>
                          <SelectItem value="2">Tuesday</SelectItem>
                          <SelectItem value="3">Wednesday</SelectItem>
                          <SelectItem value="4">Thursday</SelectItem>
                          <SelectItem value="5">Friday</SelectItem>
                          <SelectItem value="6">Saturday</SelectItem>
                          <SelectItem value="0">Sunday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Input
                          type="time"
                          value={newSchedule.start_time}
                          onChange={(e) => setNewSchedule({ ...newSchedule, start_time: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Time</Label>
                        <Input
                          type="time"
                          value={newSchedule.end_time}
                          onChange={(e) => setNewSchedule({ ...newSchedule, end_time: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Slot Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={newSchedule.slot_duration_minutes}
                        onChange={(e) => setNewSchedule({ ...newSchedule, slot_duration_minutes: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Valid From</Label>
                        <Input
                          type="date"
                          value={newSchedule.valid_from}
                          onChange={(e) => setNewSchedule({ ...newSchedule, valid_from: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Valid Until</Label>
                        <Input
                          type="date"
                          value={newSchedule.valid_until}
                          onChange={(e) => setNewSchedule({ ...newSchedule, valid_until: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateScheduleOpen(false)}>Cancel</Button>
                    <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleCreateSchedule} disabled={isSaving}>
                      {isSaving ? 'Creating...' : 'Create Schedule'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {selectedServiceId && (
              <>
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
              </>
            )}
          </>
        )}

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