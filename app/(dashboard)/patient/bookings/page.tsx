"use client"

import { useMemo, useState, Suspense, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ArrowRight, CalendarDays, Clock3, ShieldCheck, ChevronLeft } from "lucide-react"
import { toast } from "sonner"

import { useAppointments } from "@/hooks/useAppointments"
import { useServices } from "@/hooks/useService"

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
import { getProviderRepository } from "@/services/mock"

const getCurrentPatientId = (): number => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("currentPatientId")
    if (stored) return parseInt(stored)
  }
  return 201
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
  const patientId = getCurrentPatientId()

  // State
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

  // Hooks
  const {
    consultationServices,
    procedureServices,
    diagnosticServices,
    isLoading: servicesLoading,
  } = useServices({ autoFetch: true })

  const {
    bookAppointment,
    bookAppointmentWithPendingPayment,
    isLoading: isBooking,
    refreshData,
  } = useAppointments()

  // Fetch provider details when service is selected
  useEffect(() => {
    if (selectedService?.providerId) {
      const providerRepo = getProviderRepository()
      const provider = providerRepo.findById(selectedService.providerId)
      if (provider) {
        setSelectedProvider({
          id: provider.id,
          name: provider.name,
          type: provider.type,
          specialty: provider.specialty,
          rating: provider.rating,
          reviews: provider.reviews,
          image: provider.image,
          location: provider.location,
          locationDetail: provider.locationDetail,
          contactPhone: provider.contactPhone,
          contactEmail: provider.contactEmail,
          bio: provider.bio,
          experience: provider.experience,
          education: provider.education,
        })
      } else {
        setSelectedProvider(null)
      }
    } else {
      setSelectedProvider(null)
    }
  }, [selectedService])

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

  const resetBooking = () => {
    setSelectedService(null)
    setSelectedProvider(null)
    setSelectedDate(dates[0])
    setSelectedTime(timeSlots[0])
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
    if (!selectedService) return

    setIsProcessing(true)
    setShowPaymentModal(false)

    try {
      const scheduledDateTime = `${selectedDate.fullDate} ${selectedTime}:00`

      const request = {
        patientId,
        serviceId: selectedService.id,
        slotId: Math.floor(Math.random() * 100) + 1,
        scheduledDateTime,
        paymentConfirmed,
        notes: `Booking for ${selectedService.name}`,
      }

      const result = paymentConfirmed
        ? await bookAppointment(request)
        : await bookAppointmentWithPendingPayment(request)

      if (!result?.success) {
        toast.error(result?.message || "Booking failed")
        return
      }

      await refreshData()

      setSuccessData({
        title: paymentConfirmed ? "Appointment Confirmed" : "Booking Request Sent",
        message: paymentConfirmed
          ? "Your appointment has been successfully confirmed."
          : "Your appointment is pending payment at the clinic.",
        variant: "booking",
        details: {
          serviceName: selectedService.name,
          appointmentDate: `${selectedDate.day} ${selectedDate.date}/${selectedDate.month}/${selectedDate.year}`,
          appointmentTime: selectedTime,
          amount: totalAmount,
          location: selectedProvider?.name || "Healthcare Facility",
          cardNumber: result.card?.cardNumber,
        },
        primaryAction: { label: "View Appointments", href: "/patient/appointments" },
        secondaryAction: { label: "Book Another", onClick: resetBooking },
      })

      setShowSuccessModal(true)
      toast.success(paymentConfirmed ? "Appointment confirmed successfully" : "Booking request submitted")
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    } finally {
      setIsProcessing(false)
    }
  }

  if (servicesLoading) {
    return <LoadingState message="Loading healthcare services..." size="lg" fullScreen />
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
                    <ServiceCard key={service.id} service={service} providerType={activeProvider} onClick={handleSelectService} variant="expanded" />
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
                {/* Left Column - Scheduling */}
                <div className="space-y-6">
                  {/* Selected Service Summary */}
                  <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm p-5 sm:p-6 md:p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#006767]/10 flex items-center justify-center shrink-0">
                        <CalendarDays className="h-6 w-6 sm:h-7 sm:w-7 text-[#006767]" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c30]">Schedule Appointment</h2>
                        <p className="text-sm text-gray-500 mt-1">Select your preferred date and time for {selectedService.name}</p>
                      </div>
                    </div>

                    <DateSelection dates={dates} selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                    
                    <div className="mt-6">
                      <TimeSelection timeSlots={timeSlots} selectedTime={selectedTime} onTimeSelect={setSelectedTime} />
                    </div>
                  </div>

                  {/* Booking Summary Card - Mobile/Tablet */}
                  <div className="lg:hidden bg-gradient-to-r from-[#006767] to-[#008282] rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <ShieldCheck className="h-5 w-5" />
                          <span className="font-semibold text-white/90">Secure Booking</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black">ETB {totalAmount}</h3>
                        <p className="text-white/80 text-sm mt-1">Confirm your booking and continue payment.</p>
                      </div>
                      <Button onClick={() => setShowPaymentModal(true)} className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl bg-white text-[#006767] hover:bg-white/90 font-bold text-sm sm:text-base">
                        Continue to Payment
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right Column - Sidebar */}
                <BookingSidebar
                  service={selectedService}
                  provider={selectedProvider}
                  totalAmount={totalAmount}
                  isLoading={isProcessing || isBooking}
                  onPayNow={() => setShowPaymentModal(true)}
                  onPayLater={() => handleBooking(false)}
                  onChapaPayment={() => setShowPaymentModal(true)}
                />
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
          isProcessing={isProcessing || isBooking}
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