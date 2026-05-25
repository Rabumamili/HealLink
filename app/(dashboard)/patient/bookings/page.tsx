"use client"

import { useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Search,
  Star,
  MapPin,
  Calendar,
  CheckCircle,
  CreditCard,
  X,
  Loader2,
  Building2,
  FlaskConical,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  Phone,
  Share2,
  MessageCircle,
  AlertCircle,
  Award,
  GraduationCap,
  Clock,
  Users
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Ethiopian Doctors Data
const doctors = [
  {
    id: "1",
    name: "Dr. Abraham Yosef",
    specialty: "Interventional Cardiologist",
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop",
    status: "online",
    isActive: true,
    bio: "Dr. Abraham Yosef is a renowned cardiologist with over 15 years of experience. He earned his MD from Addis Ababa University and completed his fellowship in Interventional Cardiology in South Africa. He specializes in treating complex cardiac conditions including hypertension, heart failure, and coronary artery disease.",
    specialization: "Interventional Cardiology",
    experience: "15+ years",
    education: "MD from Addis Ababa University, Fellowship from South Africa",
    services: [
      { name: "Cardiology Consultation", fee: 750 },
      { name: "Echocardiogram", fee: 1200 },
      { name: "Stress Test", fee: 850 },
    ],
    location: "Landmark Hospital, Addis Ababa",
    locationDetail: "Cardiology Department, 2nd Floor",
    contactPhone: "+251-911-234-567",
    contactEmail: "dr.abraham@landmarkhospital.com"
  },
  {
    id: "2",
    name: "Dr. Selam Tesfaye",
    specialty: "General Pediatrician",
    rating: 4.8,
    reviews: 94,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop",
    status: "online",
    isActive: true,
    bio: "Dr. Selam Tesfaye is a dedicated pediatrician passionate about child healthcare. She provides comprehensive care for children from newborns to adolescents, including vaccinations, growth monitoring, and treatment of common childhood illnesses.",
    specialization: "General Pediatrics",
    experience: "10+ years",
    education: "MD from Gondar University, Residency from Tikur Anbessa Hospital",
    services: [
      { name: "Pediatric Checkup", fee: 500 },
      { name: "Vaccination", fee: 300 },
      { name: "Growth Monitoring", fee: 400 },
    ],
    location: "Yekatit 12 Hospital, Addis Ababa",
    locationDetail: "Pediatrics Unit, 1st Floor",
    contactPhone: "+251-911-345-678",
    contactEmail: "dr.selam@yekatit12.gov.et"
  },
  {
    id: "3",
    name: "Dr. Tewodros Mulugeta",
    specialty: "Internal Medicine Specialist",
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop",
    status: "online",
    isActive: false,
    bio: "Dr. Tewodros Mulugeta is an experienced internal medicine specialist focusing on adult health, chronic disease management, and preventive care. He takes a holistic approach to patient care.",
    specialization: "Internal Medicine",
    experience: "12+ years",
    education: "MD from Jimma University, Residency from Black Lion Hospital",
    services: [
      { name: "General Medicine Consultation", fee: 600 },
      { name: "Chronic Disease Management", fee: 800 },
      { name: "Preventive Care Checkup", fee: 550 },
    ],
    location: "St. Paul's Hospital, Addis Ababa",
    locationDetail: "Internal Medicine, 3rd Floor",
    contactPhone: "+251-911-456-789",
    contactEmail: "dr.tewodros@stpauls.edu.et"
  },
  {
    id: "4",
    name: "Dr. Hanna Gebremariam",
    specialty: "Dermatologist",
    rating: 4.9,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop",
    status: "online",
    isActive: false,
    bio: "Dr. Hanna Gebremariam is a board-certified dermatologist specializing in skin health, acne treatment, eczema, psoriasis, and cosmetic dermatology. She provides personalized care for all skin types.",
    specialization: "Dermatology",
    experience: "8+ years",
    education: "MD from Addis Ababa University, Residency from Kenya",
    services: [
      { name: "Dermatology Consultation", fee: 550 },
      { name: "Skin Treatment", fee: 700 },
      { name: "Cosmetic Dermatology", fee: 900 },
    ],
    location: "Kazanchis Skin Clinic, Addis Ababa",
    locationDetail: "2nd Floor, Room 205",
    contactPhone: "+251-911-567-890",
    contactEmail: "dr.hanna@skinclinic.com"
  },
]

const clinics = [
  {
    id: "c1",
    name: "Bethel Medical Center",
    specialty: "General Practice & Primary Care",
    rating: 4.7,
    reviews: 203,
    image: null,
    status: "open",
    isActive: true,
    bio: "Bethel Medical Center provides comprehensive primary care services with a focus on preventive medicine and family health. Our team of experienced doctors offers quality healthcare services.",
    services: [
      { name: "General Checkup", fee: 400 },
      { name: "Vaccination", fee: 200 },
      { name: "Minor Procedure", fee: 800 },
    ],
    location: "Bole Road, Addis Ababa",
    locationDetail: "Near Bole Medhanialem Church",
    contactPhone: "+251-911-678-901",
    contactEmail: "info@bethelclinic.com"
  },
  {
    id: "c2",
    name: "Roha Medical Center",
    specialty: "Family Medicine",
    rating: 4.8,
    reviews: 178,
    image: null,
    status: "open",
    isActive: false,
    bio: "Roha Medical Center offers comprehensive family medicine services with a patient-centered approach. We provide quality healthcare for all ages.",
    services: [
      { name: "Family Medicine Consultation", fee: 450 },
      { name: "Wellness Checkup", fee: 350 },
      { name: "Chronic Care", fee: 600 },
    ],
    location: "Piassa, Addis Ababa",
    locationDetail: "Main Building, 2nd Floor",
    contactPhone: "+251-911-789-012",
    contactEmail: "info@rohamedical.com"
  },
]

const diagnosticCenters = [
  {
    id: "d1",
    name: "Addis Diagnostic Center",
    specialty: "Laboratory & Imaging",
    rating: 4.9,
    reviews: 892,
    image: null,
    status: "open",
    isActive: true,
    bio: "State-of-the-art diagnostic center providing accurate laboratory and imaging services with modern equipment and experienced technicians.",
    services: [
      { name: "Complete Blood Count", fee: 350 },
      { name: "Lipid Panel", fee: 400 },
      { name: "Thyroid Function Test", fee: 500 },
    ],
    location: "Bole, Addis Ababa",
    locationDetail: "Behind Bole Medhanialem Church",
    contactPhone: "+251-911-890-123",
    contactEmail: "info@addisdiagnostic.com"
  },
  {
    id: "d2",
    name: "Selam Diagnostic Lab",
    specialty: "Clinical Laboratory",
    rating: 4.8,
    reviews: 567,
    image: null,
    status: "open",
    isActive: false,
    bio: "Selam Diagnostic Lab offers comprehensive laboratory testing services with quick turnaround times and accurate results.",
    services: [
      { name: "Urinalysis", fee: 200 },
      { name: "Liver Function Test", fee: 450 },
      { name: "Kidney Function Test", fee: 400 },
    ],
    location: "Kazanchis, Addis Ababa",
    locationDetail: "Near Kazanchis Roundabout",
    contactPhone: "+251-911-901-234",
    contactEmail: "info@selamlab.com"
  },
]

const categories = {
  doctors: [
    { id: "all", name: "All Doctors", active: true },
    { id: "cardiology", name: "Cardiology", active: false },
    { id: "pediatrics", name: "Pediatrics", active: false },
    { id: "dermatology", name: "Dermatology", active: false },
    { id: "internal_medicine", name: "Internal Medicine", active: false },
  ],
  clinics: [
    { id: "all", name: "All Clinics", active: true },
    { id: "general", name: "General Practice", active: false },
    { id: "family", name: "Family Medicine", active: false },
  ],
  labs: [
    { id: "all", name: "All Labs", active: true },
    { id: "laboratory", name: "Laboratory", active: false },
    { id: "imaging", name: "Imaging", active: false },
  ]
}

function generateTimeSlots() {
  const slots = []
  for (let i = 8; i <= 16; i++) {
    if (i !== 12) {
      slots.push(`${i.toString().padStart(2, '0')}:30`)
    }
  }
  return slots
}

function generateDates() {
  const dates = []
  const today = new Date()
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push({
      day: days[date.getDay()],
      date: date.getDate(),
      month: date.getMonth() + 1,
      available: i < 5,
      active: i === 0
    })
  }
  return dates
}

// Type definitions
type Doctor = typeof doctors[0]
type Clinic = typeof clinics[0]
type DiagnosticCenter = typeof diagnosticCenters[0]
type Provider = Doctor | Clinic | DiagnosticCenter

function BookingWizardContent() {
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState<"doctors" | "clinics" | "labs">("doctors")
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0])
  const [selectedClinic, setSelectedClinic] = useState(clinics[0])
  const [selectedLab, setSelectedLab] = useState(diagnosticCenters[0])
  const [dates, setDates] = useState(generateDates())
  const [selectedDate, setSelectedDate] = useState(dates[0])
  const [timeSlots, setTimeSlots] = useState(generateTimeSlots())
  const [selectedTime, setSelectedTime] = useState(timeSlots[0])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [bookingId, setBookingId] = useState("")
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedService, setSelectedService] = useState<any>(null)
  const [activeCategory, setActiveCategory] = useState("all")

  const getCurrentItems = (): Provider[] => {
    let items: Provider[] = []
    switch (activeTab) {
      case "doctors": 
        items = doctors
        break
      case "clinics": 
        items = clinics
        break
      case "labs": 
        items = diagnosticCenters
        break
    }
    
    // Filter by search
    if (searchQuery) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Filter by category
    if (activeCategory !== "all") {
      items = items.filter(item => {
        if (activeTab === "doctors") {
          const categoryMap: Record<string, string[]> = {
            "cardiology": ["Interventional Cardiologist", "Cardiologist"],
            "pediatrics": ["General Pediatrician", "Pediatrician"],
            "dermatology": ["Dermatologist"],
            "internal_medicine": ["Internal Medicine Specialist"]
          }
          return categoryMap[activeCategory]?.some(cat => item.specialty.includes(cat)) ?? true
        }
        return true
      })
    }
    
    return items
  }

  const getCurrentSelected = (): Provider => {
    switch (activeTab) {
      case "doctors": return selectedDoctor
      case "clinics": return selectedClinic
      case "labs": return selectedLab
    }
  }

  const setCurrentSelected = (item: Provider) => {
    switch (activeTab) {
      case "doctors": setSelectedDoctor(item as Doctor); break
      case "clinics": setSelectedClinic(item as Clinic); break
      case "labs": setSelectedLab(item as DiagnosticCenter); break
    }
    // Reset selected service when changing provider
    setSelectedService(item?.services?.[0] || null)
  }

  const getProviderTitle = () => {
    switch (activeTab) {
      case "doctors": return "Available Doctors"
      case "clinics": return "Available Clinics"
      case "labs": return "Available Diagnostic Centers"
    }
  }

  const currentItems = getCurrentItems()
  const currentSelected = getCurrentSelected()
  const totalAmount = selectedService?.fee || currentSelected?.services?.[0]?.fee || 0

  // Helper to check if provider has doctor-specific fields
  const isDoctor = (provider: Provider): provider is Doctor => {
    return 'specialization' in provider && 'experience' in provider && 'education' in provider
  }

  const handleServiceSelect = (service: any) => {
    setSelectedService(service)
  }

  const handleBookNow = () => {
    if (!selectedService) {
      toast.error("Please select a service first")
      return
    }
    setShowPaymentModal(true)
  }

  const handlePayment = async () => {
    setIsProcessingPayment(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const isSuccess = true
      
      if (isSuccess) {
        const newBookingId = "HEA-" + Math.floor(10000 + Math.random() * 90000)
        const appointmentId = "APT-" + Date.now()
        
        // Create pending appointment (not confirmed)
        const newAppointment = {
          id: appointmentId,
          providerName: currentSelected?.name,
          providerType: activeTab === "doctors" ? "doctor" : activeTab === "clinics" ? "clinic" : "diagnostic",
          service: selectedService?.name || currentSelected?.services?.[0]?.name,
          date: `${selectedDate.day} ${selectedDate.date}, 2024`,
          time: selectedTime,
          location: currentSelected?.location,
          locationDetail: currentSelected?.locationDetail,
          fee: totalAmount,
          status: "Pending", // Pending until provider confirms
          paymentStatus: "Paid",
          rating: currentSelected?.rating,
          reviews: currentSelected?.reviews,
          contactPhone: currentSelected?.contactPhone,
          contactEmail: currentSelected?.contactEmail
        }
        
        const existingAppointments = JSON.parse(localStorage.getItem('patientAppointments') || '[]')
        existingAppointments.push(newAppointment)
        localStorage.setItem('patientAppointments', JSON.stringify(existingAppointments))
        
        setBookingId(newBookingId)
        setShowPaymentModal(false)
        setShowSuccessModal(true)
        toast.success("Booking request sent! The provider will confirm your appointment.")
      } else {
        toast.error("Payment failed. Please try again.")
      }
    } catch (error) {
      toast.error("An error occurred while processing your payment.")
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const getCategoryList = () => {
    return categories[activeTab] || categories.doctors
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] pb-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0b1c30] tracking-tight">Book an Appointment</h1>
          <p className="text-base md:text-lg text-[#6d7979] mt-2">Find and book with trusted healthcare providers</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Larger */}
          <div className="w-full lg:w-[70%] space-y-6">
            {/* Provider Type Tabs */}
            <div className="bg-white rounded-2xl p-1.5 border border-[#bcc9c8]/30 w-fit shadow-sm">
              <div className="flex gap-1.5">
                <button
                  onClick={() => setActiveTab("doctors")}
                  className={cn(
                    "px-6 md:px-8 py-3 rounded-xl text-base font-bold transition-all flex items-center gap-2",
                    activeTab === "doctors" 
                      ? "bg-[#006767] text-white shadow-md" 
                      : "text-[#515f78] hover:bg-[#d6e3ff]/50"
                  )}
                >
                  <Stethoscope className="h-5 w-5" />
                  Doctors
                </button>
                <button
                  onClick={() => setActiveTab("clinics")}
                  className={cn(
                    "px-6 md:px-8 py-3 rounded-xl text-base font-bold transition-all flex items-center gap-2",
                    activeTab === "clinics" 
                      ? "bg-[#006767] text-white shadow-md" 
                      : "text-[#515f78] hover:bg-[#d6e3ff]/50"
                  )}
                >
                  <Building2 className="h-5 w-5" />
                  Clinics
                </button>
                <button
                  onClick={() => setActiveTab("labs")}
                  className={cn(
                    "px-6 md:px-8 py-3 rounded-xl text-base font-bold transition-all flex items-center gap-2",
                    activeTab === "labs" 
                      ? "bg-[#006767] text-white shadow-md" 
                      : "text-[#515f78] hover:bg-[#d6e3ff]/50"
                  )}
                >
                  <FlaskConical className="h-5 w-5" />
                  Labs
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl border border-[#bcc9c8]/20 shadow-sm overflow-hidden">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6d7979]" />
                <Input
                  placeholder={`Search ${activeTab} by name or specialty...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-5 py-4 bg-[#f8fafc] border-0 rounded-2xl focus:ring-2 focus:ring-[#006767]/20 text-base"
                />
              </div>
            </div>

            {/* Categories Section */}
            <div className="bg-white rounded-2xl border border-[#bcc9c8]/20 overflow-hidden shadow-sm">
              <button
                onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                className="w-full flex justify-between items-center px-6 py-4 bg-[#eff4ff]/50 hover:bg-[#eff4ff] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#006767]">Categories</span>
                  <span className="font-bold text-[#0b1c30] text-base">Browse by category</span>
                </div>
                {isCategoriesExpanded ? (
                  <ChevronUp className="h-5 w-5 text-[#6d7979]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#6d7979]" />
                )}
              </button>
              {isCategoriesExpanded && (
                <div className="px-6 pb-5 pt-3">
                  <div className="flex flex-wrap gap-3">
                    {getCategoryList().map((category: any) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={cn(
                          "px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                          activeCategory === category.id
                            ? "bg-[#006767] text-white border-[#006767]"
                            : "border-[#bcc9c8]/30 text-[#515f78] hover:bg-[#e5eeff]"
                        )}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Provider Grid - Larger Cards */}
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-2xl text-[#0b1c30]">{getProviderTitle()}</h3>
                <span className="text-sm text-[#6d7979] font-medium">{currentItems.length} providers found</span>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {currentItems.map((item: Provider) => (
                  <div
                    key={item.id}
                    className={cn(
                      "bg-white rounded-2xl p-6 border transition-all cursor-pointer group hover:shadow-xl hover:-translate-y-1 duration-300",
                      currentSelected?.id === item.id
                        ? "border-2 border-[#006767] bg-[#f0fdfa] shadow-lg"
                        : "border border-[#bcc9c8]/30 hover:border-[#006767]/50"
                    )}
                    onClick={() => setCurrentSelected(item)}
                  >
                    <div className="flex gap-5">
                      <div className="relative flex-shrink-0">
                        <Avatar className="h-24 w-24 md:h-28 md:w-28 rounded-2xl">
                          {item.image ? (
                            <AvatarImage src={item.image} className="object-cover" />
                          ) : (
                            <AvatarFallback className="bg-[#d6e3ff] text-[#006767] text-2xl font-bold rounded-2xl">
                              {item.name.split(" ").map((n: string) => n[0]).join("")}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-xl text-[#0b1c30] leading-tight">{item.name}</h4>
                            <p className="text-sm text-[#6d7979] mt-1">{item.specialty}</p>
                          </div>
                          <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                            <span className="text-sm font-bold text-amber-700">{item.rating}</span>
                            <span className="text-xs text-amber-600">({item.reviews} reviews)</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-[#6d7979] mt-3 line-clamp-2">{item.bio.substring(0, 120)}...</p>
                        
                        <div className="flex items-center gap-4 mt-4 text-sm text-[#6d7979]">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-[#006767]" />
                            <span>{item.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-[#006767]" />
                            <span>Available Today</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 mt-5">
                          <button className="flex-1 py-2.5 rounded-xl border-2 border-[#bcc9c8]/30 text-[#515f78] font-semibold text-sm hover:bg-[#e5eeff] transition-all">
                            View Profile
                          </button>
                          <button 
                            onClick={() => setCurrentSelected(item)}
                            className="flex-1 py-2.5 rounded-xl bg-[#006767] text-white font-semibold text-sm shadow-md hover:bg-[#008b8b] transition-all"
                          >
                            Select Provider
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date and Time Selection */}
            {currentSelected && (
              <div className="bg-white rounded-2xl p-6 border border-[#bcc9c8]/20 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-2xl text-[#0b1c30]">Schedule Appointment</h3>
                  <div className="flex items-center gap-2 bg-[#eff4ff] px-4 py-2 rounded-xl border border-[#bcc9c8]/20">
                    <Calendar className="h-4 w-4 text-[#006767]" />
                    <span className="text-sm font-bold">October, 2024</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {dates.map((date, idx) => (
                    <button
                      key={idx}
                      disabled={!date.available}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        "py-3 rounded-xl text-sm font-bold transition-all text-center space-y-1",
                        date.active && date.available
                          ? "bg-[#006767] text-white shadow-lg shadow-[#006767]/20"
                          : date.available
                          ? "hover:bg-[#e5eeff] text-[#0b1c30] border border-transparent"
                          : "opacity-40 cursor-not-allowed text-[#6d7979]"
                      )}
                    >
                      <div className="text-xs font-bold">{date.day}</div>
                      <div className="text-base">{date.date}</div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "py-3 rounded-xl text-sm font-bold transition-all border",
                        selectedTime === time
                          ? "border-2 border-[#006767] bg-[#006767]/5 text-[#006767]"
                          : "border-[#bcc9c8]/30 hover:border-[#006767] hover:text-[#006767]"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-5 bg-[#eff4ff] rounded-2xl border border-[#006767]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#006767] border border-[#006767]/10">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#6d7979] uppercase tracking-wide">Selected Slot</p>
                      <p className="text-base font-bold text-[#0b1c30]">
                        {selectedDate.day} {selectedDate.date}, 2024 | {selectedTime}
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleBookNow} 
                    className="w-full sm:w-auto px-8 py-6 bg-[#008b8b] hover:bg-[#006767] text-white font-bold rounded-2xl shadow-lg shadow-[#008b8b]/20 transition-all text-base"
                  >
                    Continue to Payment - ETB {totalAmount}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Provider Details - Larger */}
          <aside className="w-full lg:w-[30%]">
            {currentSelected && (
              <div className="sticky top-24 bg-white rounded-2xl border border-[#bcc9c8]/20 shadow-sm overflow-hidden">
                {/* Profile Header */}
                <div className="relative p-8 bg-[#eff4ff]/40">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-5">
                      <Avatar className="h-36 w-36 rounded-[40px] shadow-2xl border-4 border-white">
                        {currentSelected.image ? (
                          <AvatarImage src={currentSelected.image} className="object-cover rounded-[40px]" />
                        ) : (
                          <AvatarFallback className="bg-[#d6e3ff] text-[#006767] text-3xl font-bold rounded-[40px]">
                            {currentSelected.name?.split(" ").map((n: string) => n[0]).join("")}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-[#0b1c30]">{currentSelected.name}</h2>
                    <p className="text-sm text-[#006767] font-bold tracking-wide uppercase mt-1">{currentSelected.specialty}</p>
                    
                    <div className="flex gap-3 mt-5">
                      <button className="w-10 h-10 rounded-xl bg-white border border-[#bcc9c8]/30 flex items-center justify-center text-[#0b1c30] hover:border-[#006767] hover:text-[#006767] transition-all shadow-sm">
                        <MessageCircle className="h-4 w-4" />
                      </button>
                      <button className="w-10 h-10 rounded-xl bg-white border border-[#bcc9c8]/30 flex items-center justify-center text-[#0b1c30] hover:border-[#006767] hover:text-[#006767] transition-all shadow-sm">
                        <Phone className="h-4 w-4" />
                      </button>
                      <button className="w-10 h-10 rounded-xl bg-white border border-[#bcc9c8]/30 flex items-center justify-center text-[#0b1c30] hover:border-[#006767] hover:text-[#006767] transition-all shadow-sm">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content Sections */}
                <div className="p-6 space-y-6">
                  {/* Biography */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="font-bold text-lg text-[#0b1c30]">Biography</h3>
                    </div>
                    <p className="text-sm text-[#6d7979] leading-relaxed">
                      {currentSelected.bio}
                    </p>
                  </div>

                  {/* Additional Doctor Info - Only for doctors */}
                  {isDoctor(currentSelected) && (
                    <div className="space-y-2 pt-2 border-t border-[#bcc9c8]/20">
                      <h3 className="font-bold text-lg text-[#0b1c30] mb-3">Professional Details</h3>
                      {currentSelected.specialization && (
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-[#006767]" />
                          <span className="text-sm text-[#0b1c30]">
                            <strong>Specialization:</strong> {currentSelected.specialization}
                          </span>
                        </div>
                      )}
                      {currentSelected.experience && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-[#006767]" />
                          <span className="text-sm text-[#0b1c30]">
                            <strong>Experience:</strong> {currentSelected.experience}
                          </span>
                        </div>
                      )}
                      {currentSelected.education && (
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-[#006767]" />
                          <span className="text-sm text-[#0b1c30]">
                            <strong>Education:</strong> {currentSelected.education}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Services */}
                  <div className="border-t border-[#bcc9c8]/20 pt-4">
                    <h3 className="font-bold text-lg text-[#0b1c30] mb-3">Services & Fees</h3>
                    <div className="space-y-2">
                      {currentSelected.services?.map((service: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => handleServiceSelect(service)}
                          className={cn(
                            "w-full flex justify-between items-center p-3 rounded-xl border transition-all cursor-pointer",
                            selectedService?.name === service.name
                              ? "border-2 border-[#006767] bg-[#006767]/5"
                              : "border border-[#bcc9c8]/20 hover:border-[#006767]/50 bg-[#eff4ff]/30"
                          )}
                        >
                          <span className="text-sm font-semibold text-[#0b1c30]">{service.name}</span>
                          <span className="text-sm font-bold text-[#006767]">ETB {service.fee}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="border-t border-[#bcc9c8]/20 pt-4">
                    <h3 className="font-bold text-lg text-[#0b1c30] mb-3">Location</h3>
                    <div className="relative rounded-xl overflow-hidden h-32 bg-[#e2e8f0] border border-[#bcc9c8]/20">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <MapPin className="h-8 w-8 text-[#6d7979] opacity-40" />
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm p-3 rounded-lg border border-[#bcc9c8]/20 shadow-lg">
                        <p className="text-sm font-bold text-[#0b1c30]">{currentSelected.location}</p>
                        {currentSelected.locationDetail && (
                          <p className="text-xs text-[#6d7979] font-medium">{currentSelected.locationDetail}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleBookNow} 
                    className="w-full py-6 bg-[#006767] hover:bg-[#008b8b] text-white font-bold text-base rounded-2xl shadow-xl shadow-[#006767]/20 transition-all"
                  >
                    Request Booking - ETB {totalAmount}
                  </Button>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#0b1c30]">Complete Payment</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 hover:bg-[#eff4ff] rounded-full transition-all"
              >
                <X className="h-5 w-5 text-[#6d7979]" />
              </button>
            </div>

            <div className="bg-[#eff4ff] rounded-2xl p-5">
              <h3 className="font-bold mb-3 text-[#0b1c30] text-base">Payment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6d7979]">{selectedService?.name || "Consultation Fee"}</span>
                  <span className="font-medium">ETB {totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6d7979]">Platform Fee</span>
                  <span className="font-medium">ETB 0</span>
                </div>
                <div className="border-t border-[#bcc9c8]/30 pt-3 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-[#006767] text-lg">ETB {totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#006767]/5 rounded-2xl p-5 border-2 border-[#006767]/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-[#006767] rounded-xl flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0b1c30] text-base">Pay with Chapa</h3>
                  <p className="text-xs text-[#6d7979]">Secure payment gateway</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-[#515f78]">You will be redirected to Chapa's secure payment page.</p>
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>Supports Telebirr, CBEBirr, and bank cards</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              disabled={isProcessingPayment}
              className="w-full py-6 bg-[#006767] hover:bg-[#008b8b] text-white font-bold rounded-xl text-base"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay ETB {totalAmount}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-5 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-[#006767]/10 text-[#006767] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-[#0b1c30]">Request Sent!</h2>
            <p className="text-base text-[#6d7979]">
              Your booking request has been sent to {currentSelected?.name}. You will receive a confirmation once the provider approves your appointment.
            </p>
            <div className="bg-[#eff4ff] p-5 rounded-2xl border border-[#006767]/10">
              <p className="text-xs font-bold text-[#6d7979] uppercase tracking-wide mb-1">Booking ID</p>
              <p className="text-2xl font-bold text-[#006767] tracking-wider">{bookingId}</p>
            </div>
            <Button
              onClick={() => {
                setShowSuccessModal(false)
                router.push("/patient/appointments")
              }}
              className="w-full py-6 bg-[#006767] hover:bg-[#008b8b] text-white font-bold rounded-xl text-base"
            >
              View My Appointments
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function BookAppointmentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BookingWizardContent />
    </Suspense>
  )
}