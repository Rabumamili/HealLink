"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar as CalendarIcon, Clock, Plus, Trash2, Copy, Save } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  shift: string
}

interface DaySchedule {
  day: string
  isActive: boolean
  slots: TimeSlot[]
  note?: string
}

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const initialSchedule: DaySchedule[] = [
  {
    day: "Monday",
    isActive: true,
    slots: [
      { id: "1", startTime: "08:00", endTime: "12:00", shift: "Morning" },
      { id: "2", startTime: "14:00", endTime: "18:00", shift: "Afternoon" },
    ],
  },
  {
    day: "Tuesday",
    isActive: true,
    slots: [
      { id: "3", startTime: "08:00", endTime: "12:00", shift: "Morning" },
      { id: "4", startTime: "14:00", endTime: "18:00", shift: "Afternoon" },
    ],
  },
  {
    day: "Wednesday",
    isActive: true,
    slots: [
      { id: "5", startTime: "09:00", endTime: "17:00", shift: "Full Day" },
    ],
  },
  {
    day: "Thursday",
    isActive: true,
    slots: [
      { id: "6", startTime: "08:00", endTime: "12:00", shift: "Morning" },
      { id: "7", startTime: "14:00", endTime: "18:00", shift: "Afternoon" },
    ],
  },
  {
    day: "Friday",
    isActive: true,
    slots: [
      { id: "8", startTime: "08:00", endTime: "12:00", shift: "Morning" },
      { id: "9", startTime: "14:00", endTime: "16:00", shift: "Afternoon" },
    ],
  },
  {
    day: "Saturday",
    isActive: true,
    slots: [
      { id: "10", startTime: "09:00", endTime: "13:00", shift: "Morning" },
    ],
  },
  {
    day: "Sunday",
    isActive: false,
    slots: [],
    note: "Clinic closed for maintenance",
  },
]

export default function ClinicSchedulePage() {
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false)
  const [globalSlotDuration, setGlobalSlotDuration] = useState("30")
  const [globalBufferTime, setGlobalBufferTime] = useState("0")
  const [maxAppointmentsPerDay, setMaxAppointmentsPerDay] = useState("16")

  const updateDaySchedule = (day: string, updates: Partial<DaySchedule>) => {
    setSchedule(prev => prev.map(d => 
      d.day === day ? { ...d, ...updates } : d
    ))
  }

  const addTimeSlot = (day: string, slot: Omit<TimeSlot, "id">) => {
    setSchedule(prev => prev.map(d => {
      if (d.day === day) {
        const newSlot = { ...slot, id: Date.now().toString() }
        return { ...d, slots: [...d.slots, newSlot] }
      }
      return d
    }))
    setIsAddSlotOpen(false)
  }

  const removeTimeSlot = (day: string, slotId: string) => {
    setSchedule(prev => prev.map(d => {
      if (d.day === day) {
        return { ...d, slots: d.slots.filter(s => s.id !== slotId) }
      }
      return d
    }))
  }

  const applyToAllWeekdays = () => {
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    const mondaySchedule = schedule.find(d => d.day === "Monday")
    if (mondaySchedule) {
      setSchedule(prev => prev.map(d => {
        if (weekdays.includes(d.day) && d.day !== "Monday") {
          return { ...d, slots: [...mondaySchedule.slots], isActive: true }
        }
        return d
      }))
    }
  }

  const saveSchedule = () => {
    // Here you would save to backend
    alert("Schedule saved successfully!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-teal-600">Schedule Management</h1>
          <p className="text-muted-foreground">Configure your clinic's operating hours and availability</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={applyToAllWeekdays}>
            <Copy className="mr-2 h-4 w-4" />
            Apply Monday to All Weekdays
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={saveSchedule}>
            <Save className="mr-2 h-4 w-4" />
            Save Schedule
          </Button>
        </div>
      </div>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-teal-600" />
            Global Settings
          </CardTitle>
          <CardDescription>Configure default settings for all appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label>Slot Duration</Label>
              <Select value={globalSlotDuration} onValueChange={setGlobalSlotDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="20">20 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Buffer Time</Label>
              <Select value={globalBufferTime} onValueChange={setGlobalBufferTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 minutes</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Max Appointments Per Day</Label>
              <Input 
                type="number" 
                value={maxAppointmentsPerDay}
                onChange={(e) => setMaxAppointmentsPerDay(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <div className="space-y-4">
        {schedule.map((day) => (
          <Card key={day.day} className={cn(!day.isActive && "opacity-60")}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold w-28">{day.day}</h3>
                <Switch 
                  checked={day.isActive}
                  onCheckedChange={(checked) => updateDaySchedule(day.day, { isActive: checked })}
                />
              </div>
              {day.isActive && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedDay(day.day)
                    setIsAddSlotOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Time Slot
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {!day.isActive ? (
                <p className="text-sm text-muted-foreground italic">{day.note || "Clinic closed"}</p>
              ) : day.slots.length === 0 ? (
                <p className="text-sm text-muted-foreground">No time slots configured. Click "Add Time Slot" to set hours.</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {day.slots.map((slot) => (
                    <div key={slot.id} className="flex items-center gap-3 px-4 py-2 bg-teal-600 text-white rounded-lg shadow-sm">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{slot.startTime} - {slot.endTime}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-white hover:text-red-200 hover:bg-transparent"
                        onClick={() => removeTimeSlot(day.day, slot.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pro Tip Card */}
      <Card className="bg-teal-50 border-teal-200">
        <CardContent className="p-4">
          <div className="flex gap-3 items-start">
            <div className="p-2 bg-teal-100 rounded-lg">
              <CalendarIcon className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <h4 className="font-semibold text-teal-800">Pro Tip: Overlapping Blocks</h4>
              <p className="text-sm text-teal-700">
                If you define overlapping time blocks, the system will merge them into a single 
                continuous availability window automatically to prevent booking conflicts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Time Slot Dialog */}
      <Dialog open={isAddSlotOpen} onOpenChange={setIsAddSlotOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Time Slot - {selectedDay}</DialogTitle>
            <DialogDescription>Add operating hours for this day</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Start Time</Label>
                <Input type="time" defaultValue="09:00" />
              </div>
              <div>
                <Label>End Time</Label>
                <Input type="time" defaultValue="17:00" />
              </div>
            </div>
            <div>
              <Label>Shift Name (Optional)</Label>
              <Input placeholder="e.g., Morning Shift, Full Day" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSlotOpen(false)}>Cancel</Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => {
              if (selectedDay) {
                addTimeSlot(selectedDay, {
                  startTime: "09:00",
                  endTime: "17:00",
                  shift: "Full Day",
                })
              }
            }}>
              Add Slot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}