// app/doctor/schedule/page.tsx
"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Ban, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useSchedule } from '@/hooks/useSchedule'
import { DaySchedule, TimeSlotTemplate } from '@/types/entities/schedule.types'

import { ScheduleHeader } from '@/components/schedules/schedule-header'
import { ScheduleSettings } from '@/components/schedules/schedule-settings'
import { WeeklySchedule } from '@/components/schedules/weekly-schedule'
import { AddSlotDialog } from '@/components/schedules/add-slot-dialog'
import { ScheduleProTip } from '@/components/schedules/schedule-pro-tip'

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
    providerType: 'doctor',
    autoFetch: true,
  })

  useEffect(() => {
    if (daySchedule.length > 0) {
      setLocalSchedule(daySchedule)
    }
  }, [daySchedule])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await fetchDayScheduleTemplate('doctor', DOCTOR_PROVIDER_ID)
      await fetchScheduleSettings(DOCTOR_PROVIDER_ID)
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
          shift: slotData.type === 'shift' ? 'Shift' : slotData.type === 'break' ? 'Break' : 'Consultation',
          maxCapacity: 1,
        }
        return { ...d, slots: [...(d.slots || []), newSlot] }
      }
      return d
    }))
    setIsAddSlotOpen(false)
    toast.success("Time slot added successfully")
  }

  const removeTimeSlot = (dayName: string, slotId: string) => {
    setLocalSchedule(prev => prev.map(d => {
      if (d.day === dayName) {
        return { ...d, slots: (d.slots || []).filter(s => s.id !== slotId) }
      }
      return d
    }))
    toast.success("Time slot removed")
  }

  const handleToggleDay = (dayName: string) => {
    const currentDay = localSchedule.find(d => d.day === dayName)
    if (currentDay) {
      setLocalSchedule(prev => prev.map(d =>
        d.day === dayName ? { ...d, isActive: !d.isActive } : d
      ))
      toast.success(`${dayName} ${!currentDay.isActive ? "activated" : "deactivated"}`)
    }
  }

  const applyToAllWeekdays = () => {
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    const mondaySchedule = localSchedule.find(d => d.day === "Monday")
    if (mondaySchedule) {
      setLocalSchedule(prev => prev.map(d => {
        if (weekdays.includes(d.day) && d.day !== "Monday") {
          return { ...d, slots: [...(mondaySchedule.slots || [])], isActive: true }
        }
        return d
      }))
      toast.success("Applied Monday schedule to all weekdays")
    }
  }

  const handleOpenAddSlot = (day: string) => {
    setSelectedDay(day)
    setIsAddSlotOpen(true)
  }

  const saveSchedule = useCallback(async () => {
    try {
      await saveDayScheduleTemplate(DOCTOR_PROVIDER_ID, localSchedule)
      toast.success("Schedule saved successfully")
    } catch (error) {
      console.error("Error saving schedule:", error)
      toast.error("Failed to save schedule")
    }
  }, [saveDayScheduleTemplate, localSchedule])

  const handleSettingChange = async (key: string, value: any) => {
    try {
      await updateScheduleSettings(DOCTOR_PROVIDER_ID, { [key]: value })
    } catch (error) {
      console.error("Error updating settings:", error)
      toast.error("Failed to update settings")
    }
  }

  if (isLoading && localSchedule.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Loading schedule...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#006767]">Schedule Management</h1>
          <p className="text-muted-foreground">Configure your clinical availability and booking logic</p>
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
        title="Schedule Management"
        description="Configure your clinical availability and booking logic"
        onApplyToAll={applyToAllWeekdays}
        onSave={saveSchedule}
        showApplyButton={true}
      />

      <ScheduleSettings
        settings={{
          slotDuration: settings?.slotDuration?.toString() || "30",
          bufferTime: settings?.bufferTime?.toString() || "5",
          maxAppointmentsPerDay: settings?.maxAppointmentsPerDay?.toString() || "16",
          breakDuration: (settings as any)?.breakDuration?.toString() || "30",
        }}
        onSettingChange={handleSettingChange}
        type="doctor"
      />

      <WeeklySchedule
        schedule={localSchedule}
        onToggleDay={handleToggleDay}
        onAddSlot={handleOpenAddSlot}
        onRemoveSlot={removeTimeSlot}
        type="doctor"
      />

      {/* Exceptions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Ban className="h-5 w-5 text-[#006767]" />
            Exceptions
          </CardTitle>
          <CardDescription>Add specific dates for holidays or time off</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full border-[#006767]/20 text-[#006767] hover:bg-[#006767]/5">
            <Plus className="mr-2 h-4 w-4" />
            Add Exception
          </Button>
        </CardContent>
      </Card>

      <ScheduleProTip type="doctor" />

      <AddSlotDialog
        open={isAddSlotOpen}
        onOpenChange={setIsAddSlotOpen}
        onAdd={(slot) => selectedDay && addTimeSlot(selectedDay, slot)}
        dayName={selectedDay || undefined}
        type="doctor"
      />
    </div>
  )
}