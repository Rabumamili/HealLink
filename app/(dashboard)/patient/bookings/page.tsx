"use client"

import { useMemo, useState, Suspense, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ArrowRight, CalendarDays, Clock3, ShieldCheck, ChevronLeft } from "lucide-react"
import { toast } from "sonner"

import { useAppointments } from "@/hooks/useAppointments"
import { useServices } from "@/hooks/useService"
import { useSchedule } from "@/hooks/useSchedule"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { HealLinkIcon } from "@/components/icons/healink-icon"

import { LoadingState } from "@/components/common/LoadingState"
import { EmptyState } from "@/components/common/EmptyState"
import { SuccessModal, SuccessModalData } from "@/components/common/SuccessModal"
import { TabsFilter, TabOption } from "@/components/common/TabsFilter"
import { StatsCard } from "@/components/common/StatsCard"

import { ServiceCard } from "@/components/appointmentBooking/ServiceCard"
import { DateSelection, DateOption } from "@/components/appointmentBooking/DateSelection"
import { TimeSelection } from "@/components/appointmentBooking/TimeSelection"
import { BookingSidebar, ProviderDetails } from "@/components/appointmentBooking/BookingSidebar"
import { PaymentModal } from "@/components/appointmentBooking/PaymentModal"

import { Service } from "@/types/entities/service.types"
import { appointmentService } from "@/services/appointment.service"
import { serviceService } from "@/services/service.service"
import { authService } from "@/services/auth.service"

const getCurrentPatientId = (): number | null => {
  if (typeof window === 'undefined') return null
  const user = authService.getCurrentUserSync()
  if (user?.id) return user.id
  return null
}

const generateTimeSlots = () => {
  const slots = []
  for (let i = 8; i <= 16; i++) {
    if (i !== 12) {
      slots.push(`${i.toString().padStart(2, "0")}:00`)
      slots.push(`${i.toString().padStart(2, "0")}:30`)
    }
  }
  return slots
}

const generateDates = (): DateOption[] => {
  const dates = []
  const today = new Date()
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    dates.push({
      day: days[date.getDay()],
      date: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      fullDate: date.toISOString().split("T")[0],
      available: i < 5,
      active: i === 0,
    })
  }
  return dates
}

type ProviderType = "doctor" | "clinic" | "diagnostic"
type BookingStep = 1 | 2 | 3

const providerTabs: TabOption[] = [
  { id: "doctor", label: "Doctors", icon: <HealLinkIcon name="person" size={18} /> },
  { id: "clinic", label: "Clinics", icon: <HealLinkIcon name="domain" size={18} /> },
  { id: "diagnostic", label: "Diagnostic", icon: <HealLinkIcon name="science" size={18} /> },
]

function BookingWizardContent() {
  // State - ALL hooks must be called before any early returns
  const [activeProvider, setActiveProvider] = useState<ProviderType>("doctor")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<ProviderDetails | null>(null)
  const [dates] = useState(generateDates())
  const [selectedDate, setSelectedDate] = useState(dates[0])
  const [timeSlots] = useState(generateTimeSlots())
  const [selectedTime, setSelectedTime] = useState(timeSlots[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successData, setSuccessData] = useState<SuccessModalData | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [serviceSlots, setServiceSlots] = useState<any[]>([])
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)

  // Hooks
  const {
    services,
    isLoading: servicesLoading,
  } = useServices({ autoFetch: true, usePatientView: true })

  const {
    schedules,
    isLoading: schedulesLoading,
    generateSlots,
  } = useSchedule({ serviceId: selectedService?.id, autoFetch: !!selectedService?.id })

  const patientId = getCurrentPatientId()

  // Debug: Log services when they change
  useEffect(() => {
    console.log('Services loaded:', services)
    if (services.length > 0) {
      console.log('First service with provider info:', services[0])
    }
  }, [services])

  useEffect(() => {
    setIsClient(true)
  }, [])

  const fetchSlotsForService = async (serviceId: number) => {
    setIsLoadingSlots(true)
    try {
      console.log('Fetching slots for service:', serviceId)
      console.log('Available schedules:', schedules)
      console.log('Selected date:', selectedDate)

      // Use the schedule to determine availability for the selected date
      const selectedDateObj = new Date(selectedDate.fullDate)
      const dayOfWeek = selectedDateObj.getDay() // 0=Sunday, 1=Monday, etc.
      console.log('Day of week:', dayOfWeek)

      const activeSchedule = schedules.find(s => s.is_active && s.day_of_week === dayOfWeek)
      console.log('Active schedule for day:', activeSchedule)

      if (activeSchedule) {
        // Generate time slots from the schedule for the selected date
        const slots = []
        const startTime = new Date(`${selectedDate.fullDate}T${activeSchedule.start_time}`)
        const endTime = new Date(`${selectedDate.fullDate}T${activeSchedule.end_time}`)
        const slotDuration = activeSchedule.slot_duration_minutes || 30

        console.log('Generating slots from', startTime, 'to', endTime, 'with duration', slotDuration)

        let currentTime = startTime
        while (currentTime < endTime) {
          const slotEndTime = new Date(currentTime.getTime() + slotDuration * 60000)
          slots.push({
            id: `${serviceId}-${currentTime.getTime()}`,
            service_id: serviceId,
            starts_at: currentTime.toISOString(),
            ends_at: slotEndTime.toISOString(),
            is_booked: false
          })
          currentTime = new Date(currentTime.getTime() + slotDuration * 60000)
        }

        console.log('Generated slots:', slots)
        setServiceSlots(slots)
      } else {
        console.log('No active schedule found for this day')
        setServiceSlots([])
      }
    } catch (error) {
      console.error('Failed to fetch slots:', error)
      setServiceSlots([])
    } finally {
      setIsLoadingSlots(false)
    }
  }

  // Fetch provider details when service is selected
  useEffect(() => {
    const fetchProviderDetails = async () => {
      if (selectedService?.providerId) {
        try {
          // Fetch provider details from the API
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/providers/${selectedService.providerId}`, {
            headers: {
              'Content-Type': 'application/json',
              ...(typeof window !== 'undefined' && localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {})
            }
          })
          
          if (response.ok) {
            const providerData = await response.json()
            console.log('Provider data fetched:', providerData)
            
            setSelectedProvider({
              id: selectedService.providerId,
              name: providerData.name || (selectedService as any).providerName || selectedService.name,
              type: selectedService.serviceType === 'Consultation' ? 'doctor' : selectedService.serviceType === 'ClinicServices' ? 'clinic' : 'diagnostic',
              specialty: providerData.specialization || selectedService.serviceType,
              rating: providerData.rating || 0,
              reviews: providerData.reviews || 0,
              image: providerData.profile_picture || (selectedService as any).providerAvatar || undefined,
              location: providerData.location || selectedService.location || 'Addis Ababa',
              locationDetail: providerData.address || selectedService.location || '',
              contactPhone: providerData.phone || '',
              contactEmail: providerData.email || '',
              bio: providerData.description || selectedService.description || '',
              experience: providerData.experience || '',
              education: providerData.education || '',
            })
          } else {
            // Fallback to service data if provider fetch fails
            console.log('Provider fetch failed, using service data')
            setSelectedProvider({
              id: selectedService.providerId,
              name: (selectedService as any).providerName || selectedService.name,
              type: selectedService.serviceType === 'Consultation' ? 'doctor' : selectedService.serviceType === 'ClinicServices' ? 'clinic' : 'diagnostic',
              specialty: selectedService.serviceType,
              rating: 0,
              reviews: 0,
              image: (selectedService as any).providerAvatar || undefined,
              location: selectedService.location || 'Addis Ababa',
              locationDetail: selectedService.location || '',
              contactPhone: '',
              contactEmail: '',
              bio: selectedService.description || '',
              experience: '',
              education: '',
            })
          }
        } catch (error) {
          console.error('Failed to fetch provider details:', error)
          // Fallback to service data
          setSelectedProvider({
            id: selectedService.providerId,
            name: (selectedService as any).providerName || selectedService.name,
            type: selectedService.serviceType === 'Consultation' ? 'doctor' : selectedService.serviceType === 'ClinicServices' ? 'clinic' : 'diagnostic',
            specialty: selectedService.serviceType,
            rating: 0,
            reviews: 0,
            image: (selectedService as any).providerAvatar || undefined,
            location: selectedService.location || 'Addis Ababa',
            locationDetail: selectedService.location || '',
            contactPhone: '',
            contactEmail: '',
            bio: selectedService.description || '',
            experience: '',
            education: '',
          })
        }
      } else {
        setSelectedProvider(null)
      }
    }

    fetchProviderDetails()
  }, [selectedService])

  // Fetch slots when service or date changes
  useEffect(() => {
    if (selectedService?.id) {
      fetchSlotsForService(selectedService.id)
    } else {
      setServiceSlots([])
      setSelectedSlot(null)
    }
  }, [selectedService, schedules, selectedDate])

  // Derive service categories by filtering based on serviceType
  const consultationServices = services.filter(s => s.serviceType === 'Consultation')
  const procedureServices = services.filter(s => s.serviceType === 'ClinicServices')
  const diagnosticServices = services.filter(s => s.serviceType === 'DiagnosticTests')

  const currentStep: BookingStep = useMemo(() => {
    if (!selectedService) return 1
    return 2
  }, [selectedService])

  const getCurrentServices = useCallback((): Service[] => {
    switch (activeProvider) {
      case "doctor": return consultationServices
      case "clinic": return procedureServices
      case "diagnostic": return diagnosticServices
      default: return consultationServices
    }
  }, [activeProvider, consultationServices, procedureServices, diagnosticServices])

  const filteredServices = useMemo(() => {
    return getCurrentServices().filter((service) => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        service.name.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query)
      )
    })
  }, [getCurrentServices, searchQuery])

  const totalAmount = selectedService?.standardFee || 0

  // Early returns must happen after ALL hooks
  if (!isClient) {
    return <LoadingState message="Loading booking experience..." size="lg" fullScreen />
  }

  if (servicesLoading) {
    return <LoadingState message="Loading healthcare services..." size="lg" fullScreen />
  }

  const resetBooking = () => {
    setSelectedService(null)
    setSelectedProvider(null)
    setSelectedSlot(null)
    setServiceSlots([])
    setShowSuccessModal(false)
  }

  const handleSelectService = (service: Service) => {
    setSelectedService(service)
    setTimeout(() => {
      document.getElementById("booking-schedule-section")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handleBackToServices = () => {
    setSelectedService(null)
    setSelectedProvider(null)
  }

  const handleBooking = async (paymentConfirmed: boolean) => {
    if (!selectedService || !selectedSlot) {
      toast.error('Please select a service and time slot')
      return
    }

    setIsProcessing(true)
    setShowPaymentModal(false)

    try {
      const result = await appointmentService.createAppointment(
        selectedService.id,
        selectedSlot.id,
        `Booking for ${selectedService.name} at ${new Date(selectedSlot.starts_at).toLocaleString()}`
      )

      if (!result) {
        toast.error("Booking failed")
        return
      }

      setSuccessData({
        title: "Appointment Confirmed",
        message: "Your appointment has been successfully confirmed.",
        variant: "booking",
        details: {
          serviceName: selectedService.name,
          appointmentDate: new Date(selectedSlot.starts_at).toLocaleDateString(),
          appointmentTime: new Date(selectedSlot.starts_at).toLocaleTimeString(),
          amount: selectedService.standardFee || 0,
          location: selectedProvider?.name || "Healthcare Facility",
        },
        primaryAction: { label: "View Appointments", href: "/patient/appointments" },
        secondaryAction: { label: "Book Another", onClick: resetBooking },
      })

      setShowSuccessModal(true)
      toast.success("Appointment confirmed successfully")
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f8ff] via-white to-[#f8fbfb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
        {/* Hero Section */}
        <div className="rounded-2xl sm:rounded-3xl md:rounded-[32px] bg-gradient-to-r from-[#006767] to-[#008282] p-6 sm:p-8 md:p-10 text-white shadow-2xl mb-6 md:mb-8 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
            <div className="max-w-2xl">
              <Badge className="bg-white/10 hover:bg-white/10 text-white border-white/20 mb-3 md:mb-4">
                Smart Healthcare Booking
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Book Trusted
                <br />
                Healthcare Services
              </h1>
              <p className="text-white/80 text-sm sm:text-base md:text-lg mt-3 md:mt-4 max-w-xl leading-relaxed">
                Find doctors, clinics, and diagnostic services with a modern, seamless booking experience.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 min-w-[280px] sm:min-w-[320px]">
              <StatsCard title="Services" value={getCurrentServices().length} icon={<HealLinkIcon name="medical_services" size={20} />} variant="info" />
              <StatsCard title="Providers" value={34} icon={<HealLinkIcon name="domain" size={20} />} variant="success" />
              <StatsCard title="Bookings" value="120+" icon={<HealLinkIcon name="schedule" size={20} />} variant="warning" />
              <StatsCard title="Avg Fee" value={`ETB ${Math.round(getCurrentServices().reduce((sum, s) => sum + s.standardFee, 0) / (getCurrentServices().length || 1))}`} icon={<HealLinkIcon name="credit_card" size={20} />} variant="primary" />
            </div>
          </div>
        </div>

        {/* Tabs & Search */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
            <TabsFilter
              tabs={providerTabs}
              activeTab={activeProvider}
              onTabChange={(tab) => {
                setActiveProvider(tab as ProviderType)
                resetBooking()
                setSearchQuery("")
              }}
              variant="rounded"
              size="md"
            />
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder={`Search ${activeProvider} services...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-12 rounded-xl sm:rounded-2xl border-gray-200 focus-visible:ring-[#006767]/20"
              />
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8 md:mb-10 px-4">
          <div className="flex items-center gap-2 sm:gap-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-2 sm:gap-4">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all ${
                    currentStep >= step
                      ? "bg-[#006767] text-white shadow-lg"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-8 sm:w-16 h-1 rounded-full ${currentStep > step ? "bg-[#006767]" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!selectedService ? (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {filteredServices.length === 0 ? (
                <EmptyState variant="service" message="No services found" submessage="Try another search keyword" actionLabel="Clear Search" onAction={() => setSearchQuery("")} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {filteredServices.map((service) => (
                    <ServiceCard 
                      key={service.id} 
                      service={service} 
                      providerType={activeProvider} 
                      providerName={(service as any).providerName || undefined}
                      providerAvatar={(service as any).providerAvatar || undefined}
                      onClick={handleSelectService} 
                      variant="expanded" 
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              id="booking-schedule-section"
            >
              {/* Back Button */}
              <button
                onClick={handleBackToServices}
                className="flex items-center gap-2 text-gray-600 hover:text-[#006767] mb-4 md:mb-6 transition-colors group"
              >
                <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Services</span>
              </button>

              <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 lg:gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* First Card: Schedule Selection */}
                  <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm p-5 sm:p-6 md:p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#006767]/10 flex items-center justify-center shrink-0">
                        <CalendarDays className="h-6 w-6 sm:h-7 sm:w-7 text-[#006767]" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c30]">Select Time Slot</h2>
                        <p className="text-sm text-gray-500 mt-1">Choose an available time slot for {selectedService.name}</p>
                      </div>
                    </div>

                    {isLoadingSlots ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006767]" />
                      </div>
                    ) : serviceSlots.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No available slots for this service</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {serviceSlots.map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              selectedSlot?.id === slot.id
                                ? 'border-[#006767] bg-[#006767]/5 text-[#006767]'
                                : 'border-gray-200 hover:border-[#006767]/50'
                            }`}
                          >
                            <div className="text-sm font-medium">
                              {new Date(slot.starts_at).toLocaleDateString()}
                            </div>
                            <div className="text-lg font-bold mt-1">
                              {new Date(slot.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Second Card: Provider and Service Details */}
                  <BookingSidebar
                    service={selectedService}
                    provider={selectedProvider}
                    totalAmount={totalAmount}
                    isLoading={isProcessing}
                    onPayNow={() => setShowPaymentModal(true)}
                    onChapaPayment={() => setShowPaymentModal(true)}
                  />
                </div>

                {/* Right Column - Payment Card */}
                <div className="space-y-6">
                  {/* Third Card: Payment */}
                  <div className="bg-gradient-to-r from-[#006767] to-[#008282] rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white shadow-xl">
                    <div className="flex items-center gap-2 mb-4">
                      <ShieldCheck className="h-5 w-5" />
                      <span className="font-semibold text-white/90">Secure Booking</span>
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-black mb-2">ETB {totalAmount}</h3>
                    <p className="text-white/80 text-sm mb-6">Confirm your booking and continue payment.</p>
                    <Button onClick={() => setShowPaymentModal(true)} className="w-full h-12 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl bg-white text-[#006767] hover:bg-white/90 font-bold text-sm sm:text-base">
                      Continue to Payment
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      {selectedService && (
        <PaymentModal
          service={selectedService}
          totalAmount={totalAmount}
          isOpen={showPaymentModal}
          isProcessing={isProcessing}
          onClose={() => setShowPaymentModal(false)}
          onConfirm={() => handleBooking(true)}
        />
      )}

      <SuccessModal isOpen={showSuccessModal} data={successData!} onClose={() => setShowSuccessModal(false)} />
    </div>
  )
}

export default function BookAppointmentPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading booking experience..." size="lg" fullScreen />}>
      <BookingWizardContent />
    </Suspense>
  )
}