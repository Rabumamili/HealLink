"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Calendar,
  Clock,
  MapPin,
  MoreVertical,
  CreditCard,
  X,
  CalendarPlus,
  Stethoscope,
  Building2,
  FlaskConical,
  DollarSign,
  CheckCircle,
  Star,
  Timer,
  Plus,
  Home,
  FileText,
  User,
  CalendarDays,
  Wallet,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  Award,
  GraduationCap,
  Heart,
  Sparkles,
  Bell,
  ClipboardCheck
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Appointment {
  id: string
  providerName: string
  providerType: "doctor" | "clinic" | "diagnostic"
  providerImage?: string
  service: string
  description?: string
  specialization?: string
  experience?: string
  education?: string
  date: string
  time: string
  location: string
  locationDetail?: string
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled" | "Checked-in"
  cardNumber: string | null
  fee: number
  paymentStatus: "Paid" | "Pending" | "Failed"
  rating?: number
  reviews?: number
  contactPhone?: string
  contactEmail?: string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  "Confirmed": { label: "CONFIRMED", className: "bg-primary/10 text-primary" },
  "Pending": { label: "PENDING", className: "bg-yellow-100 text-yellow-700" },
  "Completed": { label: "COMPLETED", className: "bg-gray-100 text-gray-600" },
  "Cancelled": { label: "CANCELLED", className: "bg-red-50 text-red-600" },
  "Checked-in": { label: "CHECKED IN", className: "bg-blue-100 text-blue-700" },
}

const providerIcons = {
  doctor: Stethoscope,
  clinic: Building2,
  diagnostic: FlaskConical,
}

const providerTypeLabels = {
  doctor: "Specialist",
  clinic: "Medical Center",
  diagnostic: "Diagnostic Lab",
}

// Ethiopian healthcare professional images
const providerImages = {
  doctors: [
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop",
  ],
  clinics: [
    "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=150&h=150&fit=crop",
  ],
  diagnostics: [
    "https://images.unsplash.com/photo-1579154204601-0158f351e67f?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1581595219319-a1f4f5acf069?w=150&h=150&fit=crop",
  ]
}

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<Appointment | null>(null)

  useEffect(() => {
    // Load appointments from localStorage
    const savedAppointments = localStorage.getItem('patientAppointments')
    if (savedAppointments) {
      const parsed = JSON.parse(savedAppointments)
      const withRatings = parsed.map((apt: Appointment, idx: number) => ({
        ...apt,
        rating: idx === 0 ? 4.9 : idx === 1 ? 4.8 : idx === 2 ? 4.7 : 4.9,
        reviews: idx === 0 ? 128 : idx === 1 ? 94 : idx === 2 ? 76 : 145,
        locationDetail: apt.providerType === "doctor" ? "Cardiology Department, 2nd Floor" : 
                        apt.providerType === "clinic" ? "Main Building, 1st Floor" : "Lab Services",
        providerImage: getProviderImage(apt.providerType, apt.providerName),
        contactPhone: apt.providerType === "doctor" ? "+251-911-234-567" : 
                      apt.providerType === "clinic" ? "+251-911-345-678" : "+251-911-456-789",
        contactEmail: apt.providerType === "doctor" ? "contact@example.com" : "info@healthcare.com"
      }))
      setAppointments(withRatings)
    } else {
      // Sample data for demo with Ethiopian-themed names and descriptions
      const sampleAppointments: Appointment[] = [
        {
          id: "1",
          providerName: "Dr. Abraham Yosef",
          providerType: "doctor",
          providerImage: providerImages.doctors[2],
          service: "Cardiology Consultation",
          description: "Expert cardiologist specializing in heart disease prevention, diagnosis, and treatment. Dr. Abraham has over 15 years of experience in managing complex cardiac conditions including hypertension, heart failure, and coronary artery disease.",
          specialization: "Interventional Cardiology",
          experience: "15+ years of experience",
          education: "MD from Addis Ababa University, Fellowship in Cardiology from South Africa",
          date: "Oct 24, 2024",
          time: "10:30 AM",
          location: "Landmark Hospital, Addis Ababa",
          locationDetail: "Cardiology Department, 2nd Floor",
          status: "Confirmed",
          cardNumber: "HEA-12345",
          fee: 750,
          paymentStatus: "Paid",
          rating: 4.9,
          reviews: 128,
          contactPhone: "+251-911-234-567",
          contactEmail: "dr.abraham@landmarkhospital.com"
        },
        {
          id: "2",
          providerName: "Dr. Selam Tesfaye",
          providerType: "doctor",
          providerImage: providerImages.doctors[3],
          service: "Pediatric Checkup",
          description: "Dedicated pediatrician passionate about child healthcare. Dr. Selam provides comprehensive care for children from newborns to adolescents, including vaccinations, growth monitoring, and treatment of common childhood illnesses.",
          specialization: "General Pediatrics",
          experience: "10+ years of experience",
          education: "MD from Gondar University, Residency in Pediatrics from Tikur Anbessa Hospital",
          date: "Oct 28, 2024",
          time: "2:15 PM",
          location: "Yekatit 12 Hospital, Addis Ababa",
          locationDetail: "Pediatrics Unit, 1st Floor",
          status: "Pending",
          cardNumber: null,
          fee: 500,
          paymentStatus: "Pending",
          rating: 4.8,
          reviews: 94,
          contactPhone: "+251-911-345-678",
          contactEmail: "dr.selam@yekatit12.gov.et"
        },
        {
          id: "3",
          providerName: "Dr. Tewodros Mulugeta",
          providerType: "doctor",
          providerImage: providerImages.doctors[0],
          service: "General Medicine",
          description: "Experienced internal medicine specialist focusing on adult health, chronic disease management, and preventive care. Dr. Tewodros takes a holistic approach to patient care.",
          specialization: "Internal Medicine",
          experience: "12+ years of experience",
          education: "MD from Jimma University, Residency in Internal Medicine from Black Lion Hospital",
          date: "Nov 5, 2024",
          time: "11:00 AM",
          location: "St. Paul's Hospital, Addis Ababa",
          locationDetail: "Internal Medicine, 3rd Floor",
          status: "Confirmed",
          cardNumber: "SPH-78901",
          fee: 600,
          paymentStatus: "Paid",
          rating: 4.9,
          reviews: 156,
          contactPhone: "+251-911-456-789",
          contactEmail: "dr.tewodros@stpauls.edu.et"
        },
        {
          id: "4",
          providerName: "Dr. Hanna Gebremariam",
          providerType: "doctor",
          providerImage: providerImages.doctors[4],
          service: "Dermatology Consultation",
          description: "Board-certified dermatologist specializing in skin health, acne treatment, eczema, psoriasis, and cosmetic dermatology. Dr. Hanna provides personalized care for all skin types.",
          specialization: "Dermatology",
          experience: "8+ years of experience",
          education: "MD from Addis Ababa University, Residency in Dermatology from Kenya",
          date: "Nov 12, 2024",
          time: "1:30 PM",
          location: "Kazanchis Skin Clinic, Addis Ababa",
          locationDetail: "2nd Floor, Room 205",
          status: "Pending",
          cardNumber: null,
          fee: 550,
          paymentStatus: "Pending",
          rating: 4.9,
          reviews: 87,
          contactPhone: "+251-911-567-890",
          contactEmail: "dr.hanna@skinclinic.com"
        },
        {
          id: "5",
          providerName: "Roha Medical Center",
          providerType: "clinic",
          providerImage: providerImages.clinics[0],
          service: "General Checkup",
          description: "Full-service medical center offering comprehensive healthcare services including general medicine, laboratory tests, and specialist referrals.",
          date: "Nov 10, 2024",
          time: "9:00 AM",
          location: "Piassa, Addis Ababa",
          locationDetail: "Main Building, 2nd Floor",
          status: "Confirmed",
          cardNumber: "RMC-45678",
          fee: 400,
          paymentStatus: "Paid",
          rating: 4.7,
          reviews: 203,
          contactPhone: "+251-911-678-901",
          contactEmail: "info@rohamedical.com"
        }
      ]
      setAppointments(sampleAppointments)
      localStorage.setItem('patientAppointments', JSON.stringify(sampleAppointments))
    }
  }, [])

  const getProviderImage = (type: string, name: string): string => {
    if (type === "doctor") {
      if (name.includes("Abraham")) return providerImages.doctors[2]
      if (name.includes("Selam")) return providerImages.doctors[3]
      if (name.includes("Tewodros")) return providerImages.doctors[0]
      if (name.includes("Hanna")) return providerImages.doctors[4]
      return providerImages.doctors[0]
    }
    if (type === "clinic") return providerImages.clinics[0]
    return providerImages.diagnostics[0]
  }

  const upcomingAppointments = appointments.filter(a => 
    a.status === "Confirmed" || a.status === "Pending" || a.status === "Checked-in"
  )
  const pastAppointments = appointments.filter(a => 
    a.status === "Completed" || a.status === "Cancelled"
  )

  const totalSpent = appointments
    .filter(a => a.paymentStatus === "Paid")
    .reduce((sum, a) => sum + a.fee, 0)

  const stats = [
    {
      title: "Total",
      value: appointments.length.toString(),
      icon: CalendarDays,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      description: "All appointments"
    },
    {
      title: "Upcoming",
      value: upcomingAppointments.length.toString(),
      icon: CalendarPlus,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      description: "Scheduled visits"
    },
    {
      title: "Completed",
      value: appointments.filter(a => a.status === "Completed").length.toString(),
      icon: CheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      description: "Finished appointments"
    },
    {
      title: "Total Spent",
      value: `${totalSpent.toLocaleString()} ETB`,
      icon: Wallet,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      description: "Healthcare investment"
    }
  ]

  const handleCancelClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setCancelDialogOpen(true)
  }

  const handleContactClick = (appointment: Appointment) => {
    setSelectedProvider(appointment)
    setContactDialogOpen(true)
  }

  const handleCancelAppointment = () => {
    if (selectedAppointment) {
      const updatedAppointments = appointments.map(a =>
        a.id === selectedAppointment.id ? { ...a, status: "Cancelled" as const, paymentStatus: "Failed" as const } : a
      )
      setAppointments(updatedAppointments)
      localStorage.setItem('patientAppointments', JSON.stringify(updatedAppointments))
      
      const existingCards = JSON.parse(localStorage.getItem('activeCards') || '[]')
      const updatedCards = existingCards.filter((c: any) => c.id !== selectedAppointment.id)
      localStorage.setItem('activeCards', JSON.stringify(updatedCards))
      
      toast.success("Appointment cancelled successfully")
      setCancelDialogOpen(false)
      setSelectedAppointment(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FF] pb-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8">
        {/* Header with Add Appointment Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[28px] md:text-[32px] font-bold text-[#0b1c30] tracking-tight">My Appointments</h1>
            <p className="text-[16px] text-[#3d4949] mt-1">Manage your healthcare schedule and track your medical visits</p>
          </div>
          <Link href="/patient/bookings">
            <Button className="bg-[#006767] hover:bg-[#008282] text-white rounded-xl px-6 py-6 h-auto shadow-md hover:shadow-lg transition-all group">
              <CalendarPlus className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="font-bold text-base">Book New Appointment</div>
                <div className="text-xs opacity-90">Schedule with a provider</div>
              </div>
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-[#E0E7FF] shadow-[0_4px_20px_rgba(0,139,139,0.05)] hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-sm font-semibold text-[#3d4949] uppercase tracking-wider">{stat.title}</span>
                  <p className="text-xs text-[#6d7979] mt-0.5">{stat.description}</p>
                </div>
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", stat.iconBg)}>
                  <stat.icon className={cn("h-4 w-4", stat.iconColor)} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl md:text-3xl font-bold text-[#0b1c30]">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Action Banner */}
        {upcomingAppointments.length === 0 && (
          <div className="mb-8 bg-gradient-to-r from-[#006767]/5 to-[#008282]/5 rounded-2xl p-6 border border-[#006767]/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#006767]/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-[#006767]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#0b1c30]">No upcoming appointments?</h3>
                  <p className="text-sm text-[#6d7979]">Book your next healthcare visit today</p>
                </div>
              </div>
              <Link href="/patient/bookings">
                <Button variant="outline" className="border-[#006767]/30 text-[#006767] hover:bg-[#006767]/5 rounded-xl">
                  Find a Provider
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-[#EFF4FF] p-1.5 rounded-xl w-fit mb-6">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
              activeTab === "upcoming"
                ? "bg-white shadow-sm text-[#006767]"
                : "text-[#6d7979] hover:text-[#0b1c30]"
            )}
          >
            <Bell className="h-4 w-4" />
            Upcoming ({upcomingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
              activeTab === "past"
                ? "bg-white shadow-sm text-[#006767]"
                : "text-[#6d7979] hover:text-[#0b1c30]"
            )}
          >
            <ClipboardCheck className="h-4 w-4" />
            Past ({pastAppointments.length})
          </button>
        </div>

        {/* Appointments List */}
        <div className="space-y-5">
          {activeTab === "upcoming" && (
            upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((apt) => (
                <AppointmentCard 
                  key={apt.id} 
                  appointment={apt} 
                  onCancel={() => handleCancelClick(apt)}
                  onContact={() => handleContactClick(apt)}
                />
              ))
            ) : (
              <EmptyState 
                message="No upcoming appointments" 
                submessage="Schedule your next healthcare visit to stay on top of your health"
              />
            )
          )}

          {activeTab === "past" && (
            pastAppointments.length > 0 ? (
              pastAppointments.map((apt) => (
                <AppointmentCard 
                  key={apt.id} 
                  appointment={apt} 
                  isPast
                  onContact={() => handleContactClick(apt)}
                />
              ))
            ) : (
              <EmptyState 
                message="No past appointments" 
                submessage="Your appointment history will appear here"
              />
            )
          )}
        </div>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#0b1c30]">Cancel Appointment</DialogTitle>
            <DialogDescription className="text-[#3d4949]">
              Are you sure you want to cancel your appointment with <span className="font-semibold text-[#006767]">{selectedAppointment?.providerName}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-xl bg-[#EFF4FF] p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6d7979]">Service:</span>
                <span className="font-medium text-[#0b1c30]">{selectedAppointment?.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6d7979]">Date & Time:</span>
                <span className="font-medium text-[#0b1c30]">{selectedAppointment?.date} at {selectedAppointment?.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6d7979]">Fee:</span>
                <span className="font-semibold text-[#006767]">ETB {selectedAppointment?.fee}</span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button 
              variant="outline" 
              onClick={() => setCancelDialogOpen(false)}
              className="rounded-xl"
            >
              Keep Appointment
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelAppointment}
              className="rounded-xl bg-red-600 hover:bg-red-700"
            >
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#0b1c30]">Contact Provider</DialogTitle>
            <DialogDescription>
              Get in touch with {selectedProvider?.providerName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4 p-4 bg-[#EFF4FF] rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-[#006767]/10 flex items-center justify-center">
                <Phone className="h-5 w-5 text-[#006767]" />
              </div>
              <div>
                <p className="text-xs text-[#6d7979]">Phone Number</p>
                <a href={`tel:${selectedProvider?.contactPhone}`} className="text-sm font-semibold text-[#0b1c30] hover:text-[#006767]">
                  {selectedProvider?.contactPhone}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-[#EFF4FF] rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-[#006767]/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-[#006767]" />
              </div>
              <div>
                <p className="text-xs text-[#6d7979]">Email Address</p>
                <a href={`mailto:${selectedProvider?.contactEmail}`} className="text-sm font-semibold text-[#0b1c30] hover:text-[#006767] break-all">
                  {selectedProvider?.contactEmail}
                </a>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setContactDialogOpen(false)} className="w-full bg-[#006767] hover:bg-[#008282] rounded-xl">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AppointmentCard({ 
  appointment, 
  isPast = false,
  onCancel,
  onContact
}: { 
  appointment: Appointment
  isPast?: boolean
  onCancel?: () => void
  onContact?: () => void
}) {
  const ProviderIcon = providerIcons[appointment.providerType]
  const status = statusConfig[appointment.status]
  const providerLabel = providerTypeLabels[appointment.providerType]

  return (
    <div className="bg-white rounded-2xl border border-[#E0E7FF] shadow-[0_4px_20px_rgba(0,139,139,0.05)] hover:shadow-md transition-all p-5 md:p-6">
      <div className="flex flex-col md:flex-row gap-5">
        {/* Avatar Section with Photo */}
        <div className="relative flex-shrink-0">
          <Avatar className="w-20 h-20 md:w-24 md:h-24 rounded-2xl">
            <AvatarImage 
              src={appointment.providerImage} 
              alt={appointment.providerName}
              className="object-cover"
            />
            <AvatarFallback className="rounded-2xl bg-[#006767]/10 text-[#006767] text-xl font-bold">
              {appointment.providerName.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          {!isPast && appointment.status === "Confirmed" && (
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full border-2 border-white">
              <CheckCircle className="h-3 w-3" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-grow space-y-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold text-[#0b1c30]">{appointment.providerName}</h3>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase",
                  status.className
                )}>
                  {status.label}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#3d4949] mt-1">
                <ProviderIcon className="h-4 w-4 text-[#006767]" />
                <span className="text-sm">{appointment.service}</span>
                <span className="text-xs text-[#6d7979]">• {providerLabel}</span>
              </div>
            </div>
            {appointment.rating && (
              <div className="flex items-center gap-1 bg-[#EFF4FF] px-3 py-1.5 rounded-full self-start md:self-center">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="text-sm font-semibold text-[#0b1c30]">{appointment.rating}</span>
                <span className="text-xs text-[#6d7979]">({appointment.reviews} reviews)</span>
              </div>
            )}
          </div>

          {/* Doctor Description */}
          {appointment.description && (
            <div className="bg-[#F8F9FF] rounded-xl p-4 space-y-2">
              <p className="text-sm text-[#3d4949] leading-relaxed">{appointment.description}</p>
              
              {/* Additional Doctor Details */}
              {appointment.specialization && (
                <div className="flex items-center gap-2 text-xs text-[#006767] mt-2 pt-2 border-t border-[#E0E7FF]">
                  <Award className="h-3 w-3" />
                  <span className="font-semibold">Specialization:</span>
                  <span>{appointment.specialization}</span>
                </div>
              )}
              
              {appointment.experience && (
                <div className="flex items-center gap-2 text-xs text-[#006767]">
                  <Clock className="h-3 w-3" />
                  <span className="font-semibold">Experience:</span>
                  <span>{appointment.experience}</span>
                </div>
              )}
              
              {appointment.education && (
                <div className="flex items-center gap-2 text-xs text-[#006767]">
                  <GraduationCap className="h-3 w-3" />
                  <span className="font-semibold">Education:</span>
                  <span className="truncate">{appointment.education}</span>
                </div>
              )}
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-y border-[#E0E7FF]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EFF4FF] flex items-center justify-center text-[#006767]">
                <CalendarDays className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#6d7979] uppercase tracking-wider">Date</p>
                <p className="text-sm font-semibold text-[#0b1c30]">{appointment.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EFF4FF] flex items-center justify-center text-[#006767]">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#6d7979] uppercase tracking-wider">Time</p>
                <p className="text-sm font-semibold text-[#0b1c30]">{appointment.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EFF4FF] flex items-center justify-center text-[#006767]">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#6d7979] uppercase tracking-wider">Location</p>
                <p className="text-sm font-semibold text-[#0b1c30]">{appointment.location}</p>
                {appointment.locationDetail && (
                  <p className="text-xs text-[#6d7979]">{appointment.locationDetail}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            {!isPast && appointment.cardNumber ? (
              <Button 
                className="bg-[#006767] hover:bg-[#008282] text-white rounded-xl px-6"
                asChild
              >
                <Link href={`/patient/card-numbers?appointment=${appointment.id}`}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  View Card
                </Link>
              </Button>
            ) : !isPast && appointment.status === "Pending" ? (
              <Button className="bg-[#006767] hover:bg-[#008282] text-white rounded-xl px-6">
                Manage
              </Button>
            ) : null}
            
            <Button 
              variant="outline" 
              className="rounded-xl border-[#006767]/30 text-[#006767] hover:bg-[#006767]/5"
              onClick={onContact}
            >
              <Phone className="mr-2 h-4 w-4" />
              Contact
            </Button>

            {!isPast && appointment.status !== "Cancelled" && appointment.status !== "Completed" && (
              <>
                <Button 
                  variant="outline" 
                  className="rounded-xl border-[#006767]/30 text-[#006767] hover:bg-[#006767]/5"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Reschedule
                </Button>
                <Button 
                  variant="ghost" 
                  className="rounded-xl text-red-600 hover:bg-red-50"
                  onClick={onCancel}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ message, submessage }: { message: string; submessage: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E0E7FF] text-center py-16">
      <div className="w-20 h-20 bg-[#EFF4FF] rounded-2xl flex items-center justify-center mx-auto mb-5">
        <CalendarDays className="h-10 w-10 text-[#6d7979] opacity-50" />
      </div>
      <p className="text-[#3d4949] text-lg font-semibold mb-2">{message}</p>
      <p className="text-[#6d7979] text-sm mb-6">{submessage}</p>
      <Link href="/patient/bookings">
        <Button className="bg-[#006767] hover:bg-[#008282] text-white rounded-xl px-8">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Book an Appointment
        </Button>
      </Link>
    </div>
  )
}

