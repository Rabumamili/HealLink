// app/clinic-admin/dashboard/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  Activity,
  Stethoscope,
  UserPlus,
  Edit,
  Trash2,
  Clock as ClockIcon,
  MapPin,
  Phone,
  Mail,
  Building,
  Plus,
  Search,
  Eye,
  Sparkles,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  UserCheck,
  FileText,
  CalendarDays,
  Heart,
  Briefcase
} from "lucide-react"
import { cn } from "@/lib/utils"

// Types
interface Clinic {
  id: number
  name: string
  address: string
  location: string
  contactPhone: string
  email: string
  operatingHours: string
  status: "Active" | "Inactive"
  verificationStatus: "Pending" | "Approved" | "Rejected"
  licenseNumber: string
  tinNumber: string
}

interface Staff {
  id: number
  fullName: string
  email: string
  phoneNumber: string
  role: "Check-in Officer" | "Lead Admin" | "Nurse" | "Receptionist"
  status: "Active" | "Invited" | "Inactive"
  addedDate: string
  avatar: string
}

interface Service {
  id: number
  name: string
  description: string
  durationMinutes: number
  standardFee: number
  status: "Active" | "Inactive"
  serviceType: string
}

interface Appointment {
  id: number
  patientName: string
  service: string
  date: string
  time: string
  status: "Scheduled" | "Checked-in" | "In Progress" | "Completed" | "Cancelled" | "No-show"
  fee: number
  queueNumber: number
  age?: number
  condition?: string
  phone?: string
}

// Mock data - NO card numbers or patient IDs
const mockClinic: Clinic = {
  id: 1,
  name: "Hayat General Clinic",
  address: "Bole Road, Near Megenagna",
  location: "Addis Ababa",
  contactPhone: "+251 911 223 344",
  email: "hayat.clinic@healink.com",
  operatingHours: "Monday - Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 2:00 PM",
  status: "Active",
  verificationStatus: "Approved",
  licenseNumber: "CLN-88921",
  tinNumber: "TIN-123456",
}

const mockStaff: Staff[] = [
  {
    id: 1,
    fullName: "Abebe Kebede",
    email: "abebe.k@healink.et",
    phoneNumber: "+251 911 223 344",
    role: "Check-in Officer",
    status: "Active",
    addedDate: "2023-10-12",
    avatar: "AK",
  },
  {
    id: 2,
    fullName: "Sara Tadesse",
    email: "sara.t@healink.et",
    phoneNumber: "+251 922 556 677",
    role: "Check-in Officer",
    status: "Active",
    addedDate: "2024-03-05",
    avatar: "ST",
  },
  {
    id: 3,
    fullName: "Samuel Bekele",
    email: "samuel.b@healink.et",
    phoneNumber: "+251 933 889 900",
    role: "Receptionist",
    status: "Invited",
    addedDate: "2024-01-20",
    avatar: "SB",
  },
]

const mockServices: Service[] = [
  {
    id: 1,
    name: "General Consultation",
    description: "Standard medical consultation with a general practitioner",
    durationMinutes: 30,
    standardFee: 850,
    status: "Active",
    serviceType: "Consultation",
  },
  {
    id: 2,
    name: "Pediatric Checkup",
    description: "Comprehensive health checkup for children",
    durationMinutes: 45,
    standardFee: 650,
    status: "Active",
    serviceType: "Consultation",
  },
  {
    id: 3,
    name: "Vaccination Service",
    description: "Childhood and adult vaccination services",
    durationMinutes: 20,
    standardFee: 400,
    status: "Inactive",
    serviceType: "Medical Service",
  },
  {
    id: 4,
    name: "Minor Procedure",
    description: "Minor surgical procedures and wound care",
    durationMinutes: 60,
    standardFee: 1500,
    status: "Active",
    serviceType: "Procedure",
  },
]

// Ordered appointments - NO card numbers or patient IDs
const mockAppointments: Appointment[] = [
  {
    id: 1,
    patientName: "Tigist Haile",
    service: "General Consultation",
    date: "2024-05-20",
    time: "09:00 AM",
    status: "Checked-in",
    fee: 850,
    queueNumber: 1,
    age: 32,
    condition: "Regular Checkup",
    phone: "+251 911 223 344"
  },
  {
    id: 2,
    patientName: "Mekdes Alemu",
    service: "Pediatric Checkup",
    date: "2024-05-20",
    time: "10:30 AM",
    status: "Scheduled",
    fee: 650,
    queueNumber: 2,
    age: 28,
    condition: "Child Vaccination",
    phone: "+251 922 556 677"
  },
  {
    id: 3,
    patientName: "Yonas Desta",
    service: "Minor Procedure",
    date: "2024-05-20",
    time: "02:00 PM",
    status: "Scheduled",
    fee: 1500,
    queueNumber: 3,
    age: 52,
    condition: "Wound Care",
    phone: "+251 933 889 900"
  },
  {
    id: 4,
    patientName: "Helen Tsegaye",
    service: "General Consultation",
    date: "2024-05-20",
    time: "03:30 PM",
    status: "Scheduled",
    fee: 850,
    queueNumber: 4,
    age: 45,
    condition: "Hypertension Follow-up",
    phone: "+251 944 112 233"
  }
]

const statusColors: Record<string, string> = {
  "Active": "bg-teal-100 text-teal-700",
  "Inactive": "bg-gray-100 text-gray-700",
  "Invited": "bg-yellow-100 text-yellow-700",
  "Scheduled": "bg-blue-100 text-blue-700",
  "Checked-in": "bg-green-100 text-green-700",
  "In Progress": "bg-purple-100 text-purple-700",
  "Completed": "bg-gray-100 text-gray-700",
  "Cancelled": "bg-red-100 text-red-700",
  "No-show": "bg-red-100 text-red-700",
  "Approved": "bg-green-100 text-green-700",
  "Pending": "bg-yellow-100 text-yellow-700",
  "Rejected": "bg-red-100 text-red-700",
}

export default function ClinicAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [clinic, setClinic] = useState<Clinic>(mockClinic)
  const [staff, setStaff] = useState<Staff[]>(mockStaff)
  const [services, setServices] = useState<Service[]>(mockServices)
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [isEditingClinic, setIsEditingClinic] = useState(false)
  const [isAddingStaff, setIsAddingStaff] = useState(false)
  const [isAddingService, setIsAddingService] = useState(false)
  const [searchStaff, setSearchStaff] = useState("")
  const [searchServices, setSearchServices] = useState("")
  const [searchAppointments, setSearchAppointments] = useState("")

  const checkedInCount = appointments.filter(a => a.status === "Checked-in").length
  const todayCount = appointments.filter(a => a.date === "2024-05-20").length

  const filteredAppointments = appointments.filter(apt =>
    apt.patientName.toLowerCase().includes(searchAppointments.toLowerCase()) ||
    apt.service.toLowerCase().includes(searchAppointments.toLowerCase()) ||
    apt.condition?.toLowerCase().includes(searchAppointments.toLowerCase() || "")
  )

  const stats = [
    { title: "Total Appointments", value: appointments.length.toString(), icon: Calendar, color: "bg-blue-50 text-blue-600", trend: "+12%", trendUp: true },
    { title: "Today's Appointments", value: todayCount.toString(), icon: Activity, color: "bg-teal-50 text-teal-600", trend: "+2", trendUp: true },
    { title: "Active Staff", value: staff.filter(s => s.status === "Active").length.toString(), icon: Users, color: "bg-green-50 text-green-600", trend: "0", trendUp: false },
    { title: "Active Services", value: services.filter(s => s.status === "Active").length.toString(), icon: Stethoscope, color: "bg-purple-50 text-purple-600", trend: "+1", trendUp: true },
  ]

  const filteredStaff = staff.filter(s =>
    s.fullName.toLowerCase().includes(searchStaff.toLowerCase()) ||
    s.email.toLowerCase().includes(searchStaff.toLowerCase())
  )

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchServices.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 p-6 md:p-8 shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -ml-24 -mb-24"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-white/80" />
              <span className="text-white/80 text-sm font-medium">Clinic Dashboard</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{clinic.name}</h2>
            <p className="text-teal-50 text-base">{checkedInCount} patients checked in, {todayCount - checkedInCount} waiting</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Building className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wide">Verification Status</p>
                <Badge className="mt-1 bg-green-500/20 text-white border-0">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  {clinic.verificationStatus}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.title}</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={cn(
                  "text-xs font-semibold",
                  stat.trendUp ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                )}>
                  {stat.trend}
                  {stat.trendUp ? <TrendingUp className="ml-1 h-3 w-3" /> : <TrendingDown className="ml-1 h-3 w-3" />}
                </Badge>
                <span className="text-xs text-gray-500">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="clinic" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm">
            Clinic Info
          </TabsTrigger>
          <TabsTrigger value="staff" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm">
            Staff Management
          </TabsTrigger>
          <TabsTrigger value="services" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm">
            Services
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Today's Appointments */}
          <Card className="border shadow-sm overflow-hidden">
            <div className="bg-gray-50/50 px-6 py-4 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Today's Appointments</h3>
                  <p className="text-sm text-gray-500 mt-1">Patient schedule for today</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search patients..."
                      value={searchAppointments}
                      onChange={(e) => setSearchAppointments(e.target.value)}
                      className="pl-9 w-64 rounded-lg border-gray-200"
                    />
                  </div>
                  <Badge className="bg-teal-100 text-teal-700 px-3 py-1 text-sm">
                    <UserCheck className="mr-1 h-3 w-3" />
                    {checkedInCount} Checked In
                  </Badge>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                {filteredAppointments.map((apt) => (
                  <div key={apt.id} className="group bg-white rounded-xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all duration-300 overflow-hidden">
                    <div className="p-5">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                        {/* Queue Number */}
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-50 text-teal-600 font-bold text-lg">
                          #{apt.queueNumber}
                        </div>
                        
                        {/* Patient Avatar & Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <Avatar className="h-14 w-14 rounded-xl">
                            <AvatarFallback className={cn(
                              "text-lg font-bold",
                              apt.status === "Checked-in" 
                                ? "bg-teal-100 text-teal-600"
                                : "bg-gray-100 text-gray-600"
                            )}>
                              {apt.patientName.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-gray-800 text-lg">{apt.patientName}</h4>
                              <Badge className={statusColors[apt.status]}>
                                {apt.status}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
                                {apt.service}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-teal-600" />
                                {apt.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="h-3.5 w-3.5 text-teal-600" />
                                {apt.condition}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5 text-teal-600" />
                                Age: {apt.age}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3.5 w-3.5 text-teal-600" />
                                ETB {apt.fee}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {apt.status === "Checked-in" && (
                          <Button className="bg-teal-600 hover:bg-teal-700 rounded-lg px-6 shadow-sm hover:shadow transition-all">
                            <Stethoscope className="mr-2 h-4 w-4" />
                            Start Consultation
                          </Button>
                        )}
                      </div>
                      
                      {/* Additional Info - Visible on hover */}
                      <div className="mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3 text-teal-600" />
                            Appointment ID: #{apt.id}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-teal-600" />
                            {apt.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3 w-3 text-teal-600" />
                            {apt.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border shadow-sm hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-600">
                  <UserPlus className="h-5 w-5" />
                  Quick Staff Addition
                </CardTitle>
                <CardDescription>Add a new check-in officer or staff member</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => setIsAddingStaff(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Staff Member
                </Button>
              </CardContent>
            </Card>

            <Card className="border shadow-sm hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-600">
                  <Plus className="h-5 w-5" />
                  New Service
                </CardTitle>
                <CardDescription>Add a new medical service to your clinic</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => setIsAddingService(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Service
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Clinic Info Tab */}
        <TabsContent value="clinic" className="space-y-4">
          <Card className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4 border-b bg-gray-50/50">
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">Clinic Information</CardTitle>
                <CardDescription>Manage your clinic's details and operating hours</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setIsEditingClinic(true)} className="border-teal-200 text-teal-600 hover:bg-teal-50">
                <Edit className="mr-2 h-4 w-4" />
                Edit Clinic
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-teal-50/30 transition-colors">
                    <Building className="h-5 w-5 text-teal-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Clinic Name</p>
                      <p className="text-sm font-medium text-gray-800">{clinic.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-teal-50/30 transition-colors">
                    <MapPin className="h-5 w-5 text-teal-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium text-gray-800">{clinic.location}</p>
                      <p className="text-xs text-gray-500">{clinic.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-teal-50/30 transition-colors">
                    <Phone className="h-5 w-5 text-teal-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Contact Phone</p>
                      <p className="text-sm font-medium text-gray-800">{clinic.contactPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-teal-50/30 transition-colors">
                    <Mail className="h-5 w-5 text-teal-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-800">{clinic.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-teal-50/30 transition-colors md:col-span-2">
                    <ClockIcon className="h-5 w-5 text-teal-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Operating Hours</p>
                      <p className="text-sm font-medium text-gray-800 whitespace-pre-line">{clinic.operatingHours}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Clinic Status</p>
                    <Badge className={statusColors[clinic.status]}>{clinic.status}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Verification Status</p>
                    <Badge className={statusColors[clinic.verificationStatus]}>
                      {clinic.verificationStatus === "Approved" && <CheckCircle className="mr-1 h-3 w-3" />}
                      {clinic.verificationStatus === "Pending" && <ClockIcon className="mr-1 h-3 w-3" />}
                      {clinic.verificationStatus === "Rejected" && <XCircle className="mr-1 h-3 w-3" />}
                      {clinic.verificationStatus}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">License Number</p>
                    <p className="text-sm font-mono font-medium text-gray-800">{clinic.licenseNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">TIN Number</p>
                    <p className="text-sm font-mono font-medium text-gray-800">{clinic.tinNumber}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Management Tab */}
        <TabsContent value="staff" className="space-y-4">
          <Card className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4 border-b bg-gray-50/50">
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">Staff Members</CardTitle>
                <CardDescription>Manage clinic staff including check-in officers</CardDescription>
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setIsAddingStaff(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Staff Member
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search staff by name or email..."
                  value={searchStaff}
                  onChange={(e) => setSearchStaff(e.target.value)}
                  className="pl-9 rounded-lg border-gray-200 focus:border-teal-300 focus:ring-teal-200"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredStaff.map((member) => (
                  <div key={member.id} className="p-4 rounded-xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 rounded-xl">
                          <AvatarFallback className="bg-teal-50 text-teal-600 text-lg font-bold">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold text-gray-800">{member.fullName}</h4>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                      </div>
                      <Badge className={statusColors[member.status]}>{member.status}</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-teal-600" />
                        <span className="text-gray-600">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-teal-600" />
                        <span className="text-gray-600">{member.phoneNumber}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t flex justify-between items-center">
                      <p className="text-xs text-gray-400">Added: {member.addedDate}</p>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-teal-600">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {member.status === "Invited" && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-teal-600">
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <Card className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4 border-b bg-gray-50/50">
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">Medical Services</CardTitle>
                <CardDescription>Manage services offered at your clinic</CardDescription>
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setIsAddingService(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search services..."
                  value={searchServices}
                  onChange={(e) => setSearchServices(e.target.value)}
                  className="pl-9 rounded-lg border-gray-200 focus:border-teal-300 focus:ring-teal-200"
                />
              </div>

              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-700">Service Name</TableHead>
                      <TableHead className="font-semibold text-gray-700">Duration</TableHead>
                      <TableHead className="text-right font-semibold text-gray-700">Fee (ETB)</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="text-center font-semibold text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.map((service) => (
                      <TableRow key={service.id} className="hover:bg-teal-50/30 transition-colors">
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-800">{service.name}</p>
                            <p className="text-xs text-gray-500">{service.serviceType}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">{service.durationMinutes} min</TableCell>
                        <TableCell className="text-right font-medium text-gray-800">{service.standardFee.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[service.status]}>{service.status}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-teal-600">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Clinic Dialog */}
      <Dialog open={isEditingClinic} onOpenChange={setIsEditingClinic}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Edit Clinic Information</DialogTitle>
            <DialogDescription>Update your clinic's details and operating hours</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-gray-700">Clinic Name</Label>
                <Input value={clinic.name} onChange={(e) => setClinic({...clinic, name: e.target.value})} className="rounded-lg" />
              </div>
              <div>
                <Label className="text-gray-700">Location</Label>
                <Input value={clinic.location} onChange={(e) => setClinic({...clinic, location: e.target.value})} className="rounded-lg" />
              </div>
              <div className="md:col-span-2">
                <Label className="text-gray-700">Address</Label>
                <Input value={clinic.address} onChange={(e) => setClinic({...clinic, address: e.target.value})} className="rounded-lg" />
              </div>
              <div>
                <Label className="text-gray-700">Contact Phone</Label>
                <Input value={clinic.contactPhone} onChange={(e) => setClinic({...clinic, contactPhone: e.target.value})} className="rounded-lg" />
              </div>
              <div>
                <Label className="text-gray-700">Email</Label>
                <Input value={clinic.email} onChange={(e) => setClinic({...clinic, email: e.target.value})} className="rounded-lg" />
              </div>
              <div className="md:col-span-2">
                <Label className="text-gray-700">Operating Hours</Label>
                <Textarea 
                  value={clinic.operatingHours} 
                  onChange={(e) => setClinic({...clinic, operatingHours: e.target.value})}
                  placeholder="e.g., Monday - Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 2:00 PM"
                  rows={3}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingClinic(false)}>Cancel</Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setIsEditingClinic(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Staff Dialog */}
      <Dialog open={isAddingStaff} onOpenChange={setIsAddingStaff}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Add Staff Member</DialogTitle>
            <DialogDescription>Add a new staff member to your clinic</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-700">Full Name</Label>
              <Input placeholder="e.g., Dawit Yohannes" className="rounded-lg" />
            </div>
            <div>
              <Label className="text-gray-700">Email Address</Label>
              <Input type="email" placeholder="dawit@example.com" className="rounded-lg" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-gray-700">Phone Number</Label>
                <Input placeholder="+251 ..." className="rounded-lg" />
              </div>
              <div>
                <Label className="text-gray-700">Role</Label>
                <Select>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checkin">Check-in Officer</SelectItem>
                    <SelectItem value="lead">Lead Admin</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="receptionist">Receptionist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingStaff(false)}>Cancel</Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setIsAddingStaff(false)}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Service Dialog */}
      <Dialog open={isAddingService} onOpenChange={setIsAddingService}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Add New Service</DialogTitle>
            <DialogDescription>Add a medical service to your clinic's catalog</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-700">Service Name</Label>
              <Input placeholder="e.g., Specialized Consultation" className="rounded-lg" />
            </div>
            <div>
              <Label className="text-gray-700">Description</Label>
              <Textarea placeholder="Describe the service..." rows={3} className="rounded-lg" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-gray-700">Duration (minutes)</Label>
                <Input type="number" placeholder="30" className="rounded-lg" />
              </div>
              <div>
                <Label className="text-gray-700">Fee (ETB)</Label>
                <Input type="number" placeholder="500" className="rounded-lg" />
              </div>
            </div>
            <div>
              <Label className="text-gray-700">Service Type</Label>
              <Select>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="medical">Medical Service</SelectItem>
                  <SelectItem value="procedure">Procedure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-gray-700">Active Status</Label>
              <Switch defaultChecked />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingService(false)}>Cancel</Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setIsAddingService(false)}>Create Service</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}