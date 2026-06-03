// app/doctor/schedule/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { Stethoscope, Plus } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DoctorSchedulePage() {
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
    schedule_type: 'weekly' as 'daily' | 'weekly',
    day_of_week: 1,
    start_time: '09:00',
    end_time: '17:00',
    slot_duration_minutes: 30,
    valid_from: '',
    valid_until: '',
  })

  const {
    schedules,
    isLoading,
    listSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  } = useSchedule({ serviceId: selectedServiceId || undefined, autoFetch: !!selectedServiceId })

  // Transform API schedule data to UI format
  const transformSchedulesToUIFormat = useCallback((apiSchedules: any[]) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    
    return days.map(day => {
      const daySchedules = apiSchedules.filter(s => {
        const dayIndex = s.day_of_week === 0 ? 6 : s.day_of_week - 1 // Convert 0=Sunday to 6, 1=Monday to 0, etc.
        return days[dayIndex] === day
      })

      return {
        day,
        isActive: daySchedules.length > 0 && daySchedules.some(s => s.is_active),
        slots: daySchedules.map(s => ({
          id: s.id.toString(),
          start: s.start_time,
          end: s.end_time,
          type: 'shift'
        }))
      }
    })
  }, [])

  useEffect(() => {
    if (schedules) {
      setLocalSchedule(transformSchedulesToUIFormat(schedules))
    }
  }, [schedules, transformSchedulesToUIFormat])

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

  const handleCreateSchedule = useCallback(async () => {
    if (!selectedServiceId) {
      toast.error("Please select a service first")
      return
    }

    setIsSaving(true)
    try {
      await createSchedule({
        service_id: selectedServiceId,
        schedule_type: newSchedule.schedule_type,
        day_of_week: newSchedule.day_of_week,
        start_time: newSchedule.start_time,
        end_time: newSchedule.end_time,
        slot_duration_minutes: newSchedule.slot_duration_minutes,
        valid_from: newSchedule.valid_from || new Date().toISOString().split('T')[0],
        valid_until: newSchedule.valid_until || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      })
      toast.success("Schedule created successfully")
      setIsCreateScheduleOpen(false)
      await listSchedules(selectedServiceId)
    } catch (error) {
      toast.error("Failed to create schedule")
      console.error(error)
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

        {/* Service Selector & Create Schedule */}
        {services.length === 0 ? (
          <EmptyState
            variant="schedule"
            title="No Services Yet"
            message="Create a service first to manage schedules"
            submessage="Go to Services to add your first consultation service."
            icon={<Stethoscope className="h-8 w-8" />}
            actionLabel="Go to Services"
            actionHref="/doctor/services"
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
                      <Label htmlFor="schedule_type">Schedule Type</Label>
                      <Select
                        value={newSchedule.schedule_type}
                        onValueChange={(value: 'daily' | 'weekly') => setNewSchedule({ ...newSchedule, schedule_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="day_of_week">Day of Week</Label>
                      <Select
                        value={newSchedule.day_of_week.toString()}
                        onValueChange={(value) => setNewSchedule({ ...newSchedule, day_of_week: parseInt(value) })}
                      >
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
                        <Label htmlFor="start_time">Start Time</Label>
                        <Input
                          id="start_time"
                          type="time"
                          value={newSchedule.start_time}
                          onChange={(e) => setNewSchedule({ ...newSchedule, start_time: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end_time">End Time</Label>
                        <Input
                          id="end_time"
                          type="time"
                          value={newSchedule.end_time}
                          onChange={(e) => setNewSchedule({ ...newSchedule, end_time: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slot_duration_minutes">Slot Duration (minutes)</Label>
                      <Input
                        id="slot_duration_minutes"
                        type="number"
                        value={newSchedule.slot_duration_minutes}
                        onChange={(e) => setNewSchedule({ ...newSchedule, slot_duration_minutes: parseInt(e.target.value) })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="valid_from">Valid From</Label>
                        <Input
                          id="valid_from"
                          type="date"
                          value={newSchedule.valid_from}
                          onChange={(e) => setNewSchedule({ ...newSchedule, valid_from: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="valid_until">Valid Until</Label>
                        <Input
                          id="valid_until"
                          type="date"
                          value={newSchedule.valid_until}
                          onChange={(e) => setNewSchedule({ ...newSchedule, valid_until: e.target.value })}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleCreateSchedule}
                      disabled={isSaving}
                      className="w-full"
                    >
                      {isSaving ? "Creating..." : "Create Schedule"}
                    </Button>
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
                    maxAppointmentsPerDay: "20",
                    breakDuration: "15",
                  }}
                  onSettingChange={(key: string, value: any) => {
                    toast.info("Settings management not available in current API version")
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
              </>
            )}
          </>
        )}

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