"use client"

import { useState, useEffect } from "react"
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
  DialogTrigger,
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
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  MapPin,
  Phone,
  Mail,
  Building,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  UserCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Types based on documentation
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
  patientId: string
  service: string
  date: string
  time: string
  status: "Scheduled" | "Checked-in" | "In Progress" | "Completed" | "Cancelled" | "No-show"
  fee: number
  cardNumber?: string
}

// Mock data
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

const mockAppointments: Appointment[] = [
  {
    id: 1,
    patientName: "Tigist Haile",
    patientId: "P001",
    service: "General Consultation",
    date: "2024-05-20",
    time: "09:00 AM",
    status: "Checked-in",
    fee: 850,
    cardNumber: "8923-4567-1234-9876",
  },
  {
    id: 2,
    patientName: "Mekdes Alemu",
    patientId: "P002",
    service: "Pediatric Checkup",
    date: "2024-05-20",
    time: "10:30 AM",
    status: "Scheduled",
    fee: 650,
  },
  {
    id: 3,
    patientName: "Yonas Desta",
    patientId: "P003",
    service: "Minor Procedure",
    date: "2024-05-20",
    time: "02:00 PM",
    status: "Scheduled",
    fee: 1500,
  },
]

const statusColors: Record<string, string> = {
  "Active": "bg-green-100 text-green-700",
  "Inactive": "bg-gray-100 text-gray-700",
  "Invited": "bg-yellow-100 text-yellow-700",
  "Scheduled": "bg-blue-100 text-blue-700",
  "Checked-in": "bg-green-100 text-green-700",
  "In Progress": "bg-purple-100 text-purple-700",
  "Completed": "bg-gray-100 text-gray-700",
  "Cancelled": "bg-red-100 text-red-700",
  "No-show": "bg-red-100 text-red-700",
}

export default function ClinicAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [clinic, setClinic] = useState<Clinic>(mockClinic)
  const [staff, setStaff] = useState<Staff[]>(mockStaff)
  const [services, setServices] = useState<Service[]>(mockServices)
  const [appointments] = useState<Appointment[]>(mockAppointments)
  const [isEditingClinic, setIsEditingClinic] = useState(false)
  const [isAddingStaff, setIsAddingStaff] = useState(false)
  const [isAddingService, setIsAddingService] = useState(false)
  const [searchStaff, setSearchStaff] = useState("")
  const [searchServices, setSearchServices] = useState("")

  const stats = [
    { title: "Total Appointments", value: appointments.length.toString(), icon: Calendar, color: "bg-blue-100 text-blue-600" },
    { title: "Today's Appointments", value: appointments.filter(a => a.date === "2024-05-20").length.toString(), icon: Activity, color: "bg-teal-100 text-teal-600" },
    { title: "Active Staff", value: staff.filter(s => s.status === "Active").length.toString(), icon: Users, color: "bg-green-100 text-green-600" },
    { title: "Active Services", value: services.filter(s => s.status === "Active").length.toString(), icon: Stethoscope, color: "bg-purple-100 text-purple-600" },
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
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center", stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clinic">Clinic Info</TabsTrigger>
          <TabsTrigger value="staff">Staff Management</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Today's Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Appointments</CardTitle>
              <CardDescription>Patient schedule for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border hover:shadow-md transition-all">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-teal-100 text-teal-600 font-medium">
                        {apt.patientName.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="font-medium">{apt.patientName}</span>
                        <Badge className={statusColors[apt.status]}>{apt.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{apt.service}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{apt.time}</span>
                        <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />ETB {apt.fee}</span>
                      </div>
                    </div>
                    {apt.status === "Checked-in" && (
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                        Start Consultation
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border shadow-sm">
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

            <Card className="border shadow-sm">
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Clinic Information</CardTitle>
                <CardDescription>Manage your clinic's details and operating hours</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setIsEditingClinic(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Clinic
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Clinic Details */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Clinic Name</p>
                      <p className="text-sm text-muted-foreground">{clinic.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{clinic.address}</p>
                      <p className="text-sm text-muted-foreground">{clinic.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Contact Phone</p>
                      <p className="text-sm text-muted-foreground">{clinic.contactPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{clinic.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:col-span-2">
                    <ClockIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Operating Hours</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{clinic.operatingHours}</p>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Clinic Status</p>
                    <Badge className={statusColors[clinic.status]}>{clinic.status}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Verification Status</p>
                    <Badge className={clinic.verificationStatus === "Approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                      {clinic.verificationStatus}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">License Number</p>
                    <p className="text-sm font-medium">{clinic.licenseNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">TIN Number</p>
                    <p className="text-sm font-medium">{clinic.tinNumber}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Management Tab */}
        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle>Staff Members</CardTitle>
                <CardDescription>Manage clinic staff including check-in officers</CardDescription>
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setIsAddingStaff(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Staff Member
              </Button>
            </CardHeader>
            <CardContent>
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search staff by name or email..."
                  value={searchStaff}
                  onChange={(e) => setSearchStaff(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Staff Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredStaff.map((member) => (
                  <div key={member.id} className="p-4 rounded-lg border hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-teal-100 text-teal-600">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{member.fullName}</h4>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <Badge className={statusColors[member.status]}>{member.status}</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">{member.phoneNumber}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">Added: {member.addedDate}</p>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {member.status === "Invited" && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle>Medical Services</CardTitle>
                <CardDescription>Manage services offered at your clinic</CardDescription>
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setIsAddingService(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </CardHeader>
            <CardContent>
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search services..."
                  value={searchServices}
                  onChange={(e) => setSearchServices(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Services Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service Name</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="text-right">Fee (ETB)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-xs text-muted-foreground">{service.serviceType}</p>
                          </div>
                        </TableCell>
                        <TableCell>{service.durationMinutes} min</TableCell>
                        <TableCell className="text-right">{service.standardFee.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[service.status]}>{service.status}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Clinic Information</DialogTitle>
            <DialogDescription>Update your clinic's details and operating hours</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Clinic Name</Label>
                <Input value={clinic.name} onChange={(e) => setClinic({...clinic, name: e.target.value})} />
              </div>
              <div>
                <Label>Location</Label>
                <Input value={clinic.location} onChange={(e) => setClinic({...clinic, location: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <Label>Address</Label>
                <Input value={clinic.address} onChange={(e) => setClinic({...clinic, address: e.target.value})} />
              </div>
              <div>
                <Label>Contact Phone</Label>
                <Input value={clinic.contactPhone} onChange={(e) => setClinic({...clinic, contactPhone: e.target.value})} />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={clinic.email} onChange={(e) => setClinic({...clinic, email: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <Label>Operating Hours</Label>
                <Textarea 
                  value={clinic.operatingHours} 
                  onChange={(e) => setClinic({...clinic, operatingHours: e.target.value})}
                  placeholder="e.g., Monday - Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 2:00 PM"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">Specify daily operating hours for your clinic</p>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Staff Member</DialogTitle>
            <DialogDescription>Add a new staff member to your clinic</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input placeholder="e.g., Dawit Yohannes" />
            </div>
            <div>
              <Label>Email Address</Label>
              <Input type="email" placeholder="dawit@example.com" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Phone Number</Label>
                <Input placeholder="+251 ..." />
              </div>
              <div>
                <Label>Role</Label>
                <Select>
                  <SelectTrigger>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>Add a medical service to your clinic's catalog</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Service Name</Label>
              <Input placeholder="e.g., Specialized Consultation" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Describe the service..." rows={3} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Duration (minutes)</Label>
                <Input type="number" placeholder="30" />
              </div>
              <div>
                <Label>Fee (ETB)</Label>
                <Input type="number" placeholder="500" />
              </div>
            </div>
            <div>
              <Label>Service Type</Label>
              <Select>
                <SelectTrigger>
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
              <Label>Active Status</Label>
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