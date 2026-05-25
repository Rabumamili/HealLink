"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
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
  Clock,
  Calendar,
  Settings,
  AlertCircle,
  CheckCircle,
  X,
  Plus,
  Copy,
  Save,
  Trash2,
  Edit,
  Sun,
  Moon,
  Activity,
  Users,
  Ban,
  CalendarPlus,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface TimeSlot {
  id: string
  start: string
  end: string
  type: "shift" | "break" | "consultation"
}

interface DaySchedule {
  day: string
  date: string
  isActive: boolean
  timeSlots: TimeSlot[]
  note?: string
}

const weekDays = [
  { name: "Monday", date: "22", full: "Monday, May 22" },
  { name: "Tuesday", date: "23", full: "Tuesday, May 23" },
  { name: "Wednesday", date: "24", full: "Wednesday, May 24" },
  { name: "Thursday", date: "25", full: "Thursday, May 25" },
  { name: "Friday", date: "26", full: "Friday, May 26" },
  { name: "Saturday", date: "27", full: "Saturday, May 27" },
  { name: "Sunday", date: "28", full: "Sunday, May 28" },
]

export default function DoctorSchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [activeTab, setActiveTab] = useState("weekly")
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    {
      day: "Monday",
      date: "22",
      isActive: true,
      timeSlots: [
        { id: "1", start: "08:00", end: "12:00", type: "shift" },
        { id: "2", start: "14:00", end: "18:00", type: "shift" },
      ],
    },
    {
      day: "Tuesday",
      date: "23",
      isActive: true,
      timeSlots: [
        { id: "3", start: "08:00", end: "12:00", type: "shift" },
        { id: "4", start: "14:00", end: "18:00", type: "shift" },
      ],
    },
    {
      day: "Wednesday",
      date: "24",
      isActive: true,
      timeSlots: [
        { id: "5", start: "09:00", end: "17:00", type: "shift" },
      ],
    },
    {
      day: "Thursday",
      date: "25",
      isActive: true,
      timeSlots: [
        { id: "6", start: "08:00", end: "12:00", type: "shift" },
        { id: "7", start: "14:00", end: "18:00", type: "shift" },
      ],
    },
    {
      day: "Friday",
      date: "26",
      isActive: true,
      timeSlots: [
        { id: "8", start: "08:00", end: "12:00", type: "shift" },
        { id: "9", start: "14:00", end: "17:00", type: "shift" },
      ],
    },
    {
      day: "Saturday",
      date: "27",
      isActive: false,
      timeSlots: [],
      note: "Weekend - Clinic closed",
    },
    {
      day: "Sunday",
      date: "28",
      isActive: false,
      timeSlots: [],
      note: "Weekend - Clinic closed",
    },
  ])

  const [globalSettings, setGlobalSettings] = useState({
    slotDuration: "30",
    bufferTime: "5",
    maxAppointmentsPerDay: "16",
    breakDuration: "30",
  })

  const [showAddSlotDialog, setShowAddSlotDialog] = useState(false)
  const [selectedDay, setSelectedDay] = useState<DaySchedule | null>(null)
  const [newSlot, setNewSlot] = useState({ start: "09:00", end: "17:00", type: "shift" })

  const handleAddTimeSlot = () => {
    if (selectedDay) {
      const updatedSchedule = schedule.map(day =>
        day.day === selectedDay.day
          ? {
              ...day,
              timeSlots: [
                ...day.timeSlots,
                {
                  id: Date.now().toString(),
                  start: newSlot.start,
                  end: newSlot.end,
                  type: newSlot.type as "shift" | "break" | "consultation",
                },
              ],
            }
          : day
      )
      setSchedule(updatedSchedule)
      setShowAddSlotDialog(false)
      setNewSlot({ start: "09:00", end: "17:00", type: "shift" })
      toast.success("Time slot added successfully")
    }
  }

  const handleRemoveTimeSlot = (dayName: string, slotId: string) => {
    const updatedSchedule = schedule.map(day =>
      day.day === dayName
        ? {
            ...day,
            timeSlots: day.timeSlots.filter(slot => slot.id !== slotId),
          }
        : day
    )
    setSchedule(updatedSchedule)
    toast.success("Time slot removed")
  }

  const handleToggleDay = (dayName: string) => {
    const updatedSchedule = schedule.map(day =>
      day.day === dayName ? { ...day, isActive: !day.isActive } : day
    )
    setSchedule(updatedSchedule)
    toast.success(`${dayName} ${!schedule.find(d => d.day === dayName)?.isActive ? "activated" : "deactivated"}`)
  }

  const handleApplyToAll = () => {
    const mondaySchedule = schedule.find(d => d.day === "Monday")
    if (mondaySchedule) {
      const updatedSchedule = schedule.map(day => ({
        ...day,
        timeSlots: day.day === "Saturday" || day.day === "Sunday" ? day.timeSlots : mondaySchedule.timeSlots,
        isActive: day.day === "Saturday" || day.day === "Sunday" ? day.isActive : true,
      }))
      setSchedule(updatedSchedule)
      toast.success("Applied Monday schedule to all weekdays")
    }
  }

  const handleSaveSchedule = () => {
    toast.success("Schedule saved successfully")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Schedule Management</h1>
          <p className="text-muted-foreground">Configure your clinical availability and booking logic</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSaveSchedule}>
            <Save className="mr-2 h-4 w-4" />
            Save Schedule
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - Global Settings */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Global Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Slot Duration</Label>
                <Select value={globalSettings.slotDuration} onValueChange={(v) => setGlobalSettings({ ...globalSettings, slotDuration: v })}>
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

              <div className="space-y-2">
                <Label>Buffer Time Between Appointments</Label>
                <Select value={globalSettings.bufferTime} onValueChange={(v) => setGlobalSettings({ ...globalSettings, bufferTime: v })}>
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

              <div className="space-y-2">
                <Label>Break Duration</Label>
                <Select value={globalSettings.breakDuration} onValueChange={(v) => setGlobalSettings({ ...globalSettings, breakDuration: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Max Appointments Per Day</Label>
                <Input
                  type="number"
                  value={globalSettings.maxAppointmentsPerDay}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, maxAppointmentsPerDay: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Ban className="h-5 w-5 text-primary" />
                Exceptions
              </CardTitle>
              <CardDescription>Add specific dates for holidays or time off</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Exception
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Weekly Schedule */}
        <div className="col-span-12 lg:col-span-9">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Weekly Availability</CardTitle>
                <CardDescription>Configure your recurring weekly schedule</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleApplyToAll}>
                <Copy className="mr-2 h-4 w-4" />
                Apply Monday to All Weekdays
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schedule.map((day, index) => (
                  <div key={day.day}>
                    <div className="grid grid-cols-[120px_1fr] gap-4 items-start">
                      <div className="pt-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{day.day}</span>
                          <Switch
                            checked={day.isActive}
                            onCheckedChange={() => handleToggleDay(day.day)}
                          />
                        </div>
                        {day.isActive && day.timeSlots.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {day.timeSlots[0].start} - {day.timeSlots[day.timeSlots.length - 1].end}
                          </span>
                        )}
                      </div>

                      <div>
                        {day.isActive ? (
                          <div className="flex flex-wrap gap-3 items-center">
                            {day.timeSlots.map((slot) => (
                              <div
                                key={slot.id}
                                className="group relative flex items-center gap-3 pl-4 pr-2 py-3 bg-primary text-primary-foreground rounded-lg shadow-md min-w-[180px]"
                              >
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold uppercase opacity-80">
                                    {slot.type === "shift" ? "Shift" : slot.type === "break" ? "Break" : "Consultation"}
                                  </span>
                                  <span className="text-sm font-medium">
                                    {slot.start} — {slot.end}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleRemoveTimeSlot(day.day, slot.id)}
                                  className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                setSelectedDay(day)
                                setShowAddSlotDialog(true)
                              }}
                              className="h-[52px] w-[52px] flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-all"
                            >
                              <Plus className="h-5 w-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Ban className="h-4 w-4" />
                            <span className="text-sm">{day.note || "Not available"}</span>
                            <Button variant="link" size="sm" onClick={() => handleToggleDay(day.day)}>
                              Add Hours
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    {index < schedule.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pro Tip Card */}
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Activity className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Pro Tip: Overlapping Blocks</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    If you define overlapping blocks, the system will merge them into a single continuous availability window automatically to prevent booking conflicts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Time Slot Dialog */}
      <Dialog open={showAddSlotDialog} onOpenChange={setShowAddSlotDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Time Slot</DialogTitle>
            <DialogDescription>
              Add a new time slot for {selectedDay?.day}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={newSlot.start}
                  onChange={(e) => setNewSlot({ ...newSlot, start: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={newSlot.end}
                  onChange={(e) => setNewSlot({ ...newSlot, end: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Slot Type</Label>
              <Select value={newSlot.type} onValueChange={(v) => setNewSlot({ ...newSlot, type: v as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shift">Shift</SelectItem>
                  <SelectItem value="break">Break</SelectItem>
                  <SelectItem value="consultation">Consultation Block</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSlotDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTimeSlot} className="bg-primary hover:bg-primary/90">
              Add Slot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}