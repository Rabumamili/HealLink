"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Activity,
  Users,
  Ban,
  FlaskConical,
  ChevronLeft,
  ChevronRight,
  Microscope,
  TestTube
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface TimeSlot {
  id: string
  start: string
  end: string
  type: "morning" | "afternoon" | "evening"
  maxPatients: number
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

export default function DiagnosticCenterSchedulePage() {
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    {
      day: "Monday",
      date: "22",
      isActive: true,
      timeSlots: [
        { id: "1", start: "08:00", end: "12:00", type: "morning", maxPatients: 20 },
        { id: "2", start: "13:00", end: "17:00", type: "afternoon", maxPatients: 20 },
      ],
    },
    {
      day: "Tuesday",
      date: "23",
      isActive: true,
      timeSlots: [
        { id: "3", start: "08:00", end: "12:00", type: "morning", maxPatients: 20 },
        { id: "4", start: "13:00", end: "17:00", type: "afternoon", maxPatients: 20 },
      ],
    },
    {
      day: "Wednesday",
      date: "24",
      isActive: true,
      timeSlots: [
        { id: "5", start: "09:00", end: "16:00", type: "morning", maxPatients: 30 },
      ],
    },
    {
      day: "Thursday",
      date: "25",
      isActive: true,
      timeSlots: [
        { id: "6", start: "08:00", end: "12:00", type: "morning", maxPatients: 20 },
        { id: "7", start: "13:00", end: "17:00", type: "afternoon", maxPatients: 20 },
      ],
    },
    {
      day: "Friday",
      date: "26",
      isActive: true,
      timeSlots: [
        { id: "8", start: "08:00", end: "12:00", type: "morning", maxPatients: 20 },
        { id: "9", start: "13:00", end: "16:00", type: "afternoon", maxPatients: 15 },
      ],
    },
    {
      day: "Saturday",
      date: "27",
      isActive: true,
      timeSlots: [
        { id: "10", start: "09:00", end: "13:00", type: "morning", maxPatients: 15 },
      ],
    },
    {
      day: "Sunday",
      date: "28",
      isActive: false,
      timeSlots: [],
      note: "Center closed on Sundays",
    },
  ])

  const [globalSettings, setGlobalSettings] = useState({
    defaultSlotDuration: "30",
    bufferTime: "10",
    maxDailyPatients: "100",
    resultTurnaroundTime: "24",
    walkInAllowed: true,
    requireAppointment: true,
  })

  const [showAddSlotDialog, setShowAddSlotDialog] = useState(false)
  const [selectedDay, setSelectedDay] = useState<DaySchedule | null>(null)
  const [newSlot, setNewSlot] = useState({ start: "09:00", end: "17:00", type: "morning", maxPatients: 20 })

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
                  type: newSlot.type as "morning" | "afternoon" | "evening",
                  maxPatients: newSlot.maxPatients,
                },
              ],
            }
          : day
      )
      setSchedule(updatedSchedule)
      setShowAddSlotDialog(false)
      setNewSlot({ start: "09:00", end: "17:00", type: "morning", maxPatients: 20 })
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
        timeSlots: day.day === "Sunday" ? day.timeSlots : mondaySchedule.timeSlots,
        isActive: day.day === "Sunday" ? day.isActive : true,
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
          <h1 className="text-2xl font-bold tracking-tight">Center Schedule Management</h1>
          <p className="text-muted-foreground">Configure diagnostic center operating hours and test scheduling</p>
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
                Center Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Test Slot Duration</Label>
                <Select value={globalSettings.defaultSlotDuration} onValueChange={(v) => setGlobalSettings({ ...globalSettings, defaultSlotDuration: v })}>
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
                <Label>Buffer Between Tests</Label>
                <Select value={globalSettings.bufferTime} onValueChange={(v) => setGlobalSettings({ ...globalSettings, bufferTime: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="20">20 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Maximum Daily Patients</Label>
                <Input
                  type="number"
                  value={globalSettings.maxDailyPatients}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, maxDailyPatients: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Result Turnaround Time (hours)</Label>
                <Input
                  type="number"
                  value={globalSettings.resultTurnaroundTime}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, resultTurnaroundTime: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Allow Walk-ins</Label>
                <Switch
                  checked={globalSettings.walkInAllowed}
                  onCheckedChange={(v) => setGlobalSettings({ ...globalSettings, walkInAllowed: v })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Require Appointment</Label>
                <Switch
                  checked={globalSettings.requireAppointment}
                  onCheckedChange={(v) => setGlobalSettings({ ...globalSettings, requireAppointment: v })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Ban className="h-5 w-5 text-primary" />
                Holiday Schedule
              </CardTitle>
              <CardDescription>Add dates when the center is closed</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Holiday
              </Button>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Ethiopian Christmas</p>
                    <p className="text-xs text-muted-foreground">January 7, 2025</p>
                  </div>
                  <Badge variant="outline">Closed</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Easter Monday</p>
                    <p className="text-xs text-muted-foreground">April 21, 2025</p>
                  </div>
                  <Badge variant="outline">Closed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Weekly Schedule */}
        <div className="col-span-12 lg:col-span-9">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Weekly Operating Hours</CardTitle>
                <CardDescription>Configure your diagnostic center's weekly schedule</CardDescription>
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
                                className="group relative flex items-center gap-3 pl-4 pr-2 py-3 bg-primary text-primary-foreground rounded-lg shadow-md"
                              >
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold uppercase opacity-80">
                                    {slot.type === "morning" ? "Morning" : slot.type === "afternoon" ? "Afternoon" : "Evening"}
                                  </span>
                                  <span className="text-sm font-medium">
                                    {slot.start} — {slot.end}
                                  </span>
                                  <span className="text-[10px] opacity-80">
                                    Max: {slot.maxPatients} patients
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
                              className="h-[72px] w-[52px] flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-all"
                            >
                              <Plus className="h-5 w-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Ban className="h-4 w-4" />
                            <span className="text-sm">{day.note || "Center closed"}</span>
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

          {/* Service Type Distribution */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TestTube className="h-5 w-5 text-primary" />
                Service Availability by Time Slot
              </CardTitle>
              <CardDescription>Configure which tests are available during each time slot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Morning (8AM - 12PM)
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2">All routine tests, Blood work, Urinalysis</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Afternoon (1PM - 5PM)
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2">Imaging, X-Ray, Ultrasound, Specialized tests</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Evening (5PM - 8PM)
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2">Emergency tests only (by appointment)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pro Tip Card */}
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Activity className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Best Practice: Peak Hours Management</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Consider adding extra staff during morning hours (8-10 AM) as this is typically the busiest time for diagnostic centers. Adjust patient capacity accordingly.
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
            <DialogTitle>Add Operating Hours</DialogTitle>
            <DialogDescription>
              Add a new time slot for {selectedDay?.day}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Opening Time</Label>
                <Input
                  type="time"
                  value={newSlot.start}
                  onChange={(e) => setNewSlot({ ...newSlot, start: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Closing Time</Label>
                <Input
                  type="time"
                  value={newSlot.end}
                  onChange={(e) => setNewSlot({ ...newSlot, end: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Time Period Type</Label>
              <Select value={newSlot.type} onValueChange={(v) => setNewSlot({ ...newSlot, type: v as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning Session</SelectItem>
                  <SelectItem value="afternoon">Afternoon Session</SelectItem>
                  <SelectItem value="evening">Evening Session</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Maximum Patients</Label>
              <Input
                type="number"
                value={newSlot.maxPatients}
                onChange={(e) => setNewSlot({ ...newSlot, maxPatients: parseInt(e.target.value) })}
              />
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