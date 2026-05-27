// app/patient/bookings/page.tsx
"use client"

import { useState, Suspense, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAppointments } from "@/hooks/useAppointments"
import { useServices } from "@/hooks/useService"
import { Service, ServiceType } from "@/types/entities/service.types"

// Reusable components
import { ServiceTypeTabs } from "@/components/appointmentBooking/ServiceTypeTabs"
import { ServiceCard } from "@/components/appointmentBooking/ServiceCard"
import { DateSelection } from "@/components/appointmentBooking/DateSelection"
import { TimeSelection } from "@/components/appointmentBooking/TimeSelection"
import { BookingSidebar } from "@/components/appointmentBooking/BookingSidebar"
import { SuccessModal, SuccessModalData } from "@/components/common/SuccessModal"
import { PaymentModal } from "@/components/appointmentBooking/PaymentModal"

// Helper functions
const getCurrentPatientId = (): number => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('currentPatientId')
    if (stored) return parseInt(stored)
  }
  return 201
}

const generateTimeSlots = () => {
  const slots = []
  for (let i = 8; i <= 16; i++) {
    if (i !== 12) {
      slots.push(`${i.toString().padStart(2, '0')}:00`)
      slots.push(`${i.toString().padStart(2, '0')}:30`)
    }
  }
  return slots
}

const generateDates = () => {
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
      year: date.getFullYear(),
      fullDate: date.toISOString().split('T')[0],
      available: i < 5,
      active: i === 0
    })
  }
  return dates
}

function BookingWizardContent() {
  const router = useRouter()
  const patientId = getCurrentPatientId()
  
  // State
  const [activeTab, setActiveTab] = useState<ServiceType>("Consultation")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [dates] = useState(generateDates())
  const [selectedDate, setSelectedDate] = useState(dates[0])
  const [timeSlots] = useState(generateTimeSlots())
  const [selectedTime, setSelectedTime] = useState(timeSlots[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successData, setSuccessData] = useState<SuccessModalData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Hooks
  const { 
    consultationServices,
    diagnosticServices,
    vaccinationServices,
    procedureServices,
    isLoading: servicesLoading
  } = useServices({ autoFetch: true })
  
  const { 
    bookAppointment, 
    bookAppointmentWithPendingPayment,
    createChapaCheckout,
    isLoading: isBooking 
  } = useAppointments()

  // Get services based on active tab
  const getCurrentServices = useCallback((): Service[] => {
    switch (activeTab) {
      case "Consultation": return consultationServices
      case "Diagnostic": return diagnosticServices
      case "Vaccination": return vaccinationServices
      case "Procedure": return procedureServices
      default: return consultationServices
    }
  }, [activeTab, consultationServices, diagnosticServices, vaccinationServices, procedureServices])

  // Filter services by search
  const filteredServices = getCurrentServices().filter(service => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return service.name.toLowerCase().includes(query) ||
           service.description?.toLowerCase().includes(query)
  })

  const totalAmount = selectedService?.standardFee || 0

  const handleBookNow = () => {
    if (!selectedService) {
      toast.error("Please select a service first")
      return
    }
    setShowPaymentModal(true)
  }

  const handlePayment = async () => {
    if (!selectedService) return

    setIsProcessing(true)
    
    try {
      const scheduledDateTime = `${selectedDate.fullDate} ${selectedTime}:00`
      const slotId = Math.floor(Math.random() * 100) + 1
      
      const request = {
        patientId: patientId,
        serviceId: selectedService.id,
        slotId: slotId,
        scheduledDateTime: scheduledDateTime,
        paymentConfirmed: true,
        notes: `Booking for ${selectedService.name}`
      }

      const result = await bookAppointment(request)
      
      if (result?.success) {
        setShowPaymentModal(false)
        
        setSuccessData({
          title: 'Booking Confirmed!',
          message: 'Your appointment has been successfully confirmed.',
          variant: 'booking',
          details: {
            cardNumber: result.card?.cardNumber,
            serviceName: selectedService.name,
            appointmentDate: `${selectedDate.day} ${selectedDate.date}/${selectedDate.month}/${selectedDate.year}`,
            appointmentTime: selectedTime,
            location: 'Healthcare Facility',
            amount: totalAmount
          },
          primaryAction: {
            label: 'View My Appointments',
            href: '/patient/appointments'
          },
          secondaryAction: {
            label: 'Book Another',
            onClick: () => {
              setSelectedService(null)
              setSelectedDate(dates[0])
              setSelectedTime(timeSlots[0])
            }
          }
        })
        setShowSuccessModal(true)
        
        if (result.card) {
          toast.success(`Appointment confirmed!`, {
            description: `Your card number: ${result.card.cardNumber}`,
            duration: 10000,
          })
        }
      } else {
        toast.error(result?.message || "Failed to book appointment")
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("An error occurred while processing your payment.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePayLater = async () => {
    if (!selectedService) return

    try {
      const scheduledDateTime = `${selectedDate.fullDate} ${selectedTime}:00`
      const slotId = Math.floor(Math.random() * 100) + 1
      
      const request = {
        patientId: patientId,
        serviceId: selectedService.id,
        slotId: slotId,
        scheduledDateTime: scheduledDateTime,
        paymentConfirmed: false,
        notes: `Booking for ${selectedService.name}`
      }

      const result = await bookAppointmentWithPendingPayment(request)
      
      if (result?.success) {
        setSuccessData({
          title: 'Booking Request Sent!',
          message: 'Your booking request has been sent. The provider will confirm your appointment.',
          variant: 'booking',
          details: {
            serviceName: selectedService.name,
            appointmentDate: `${selectedDate.day} ${selectedDate.date}/${selectedDate.month}/${selectedDate.year}`,
            appointmentTime: selectedTime,
            location: 'Healthcare Facility'
          },
          primaryAction: {
            label: 'View My Appointments',
            href: '/patient/appointments'
          },
          secondaryAction: {
            label: 'Book Another',
            onClick: () => {
              setSelectedService(null)
              setSelectedDate(dates[0])
              setSelectedTime(timeSlots[0])
            }
          }
        })
        setShowSuccessModal(true)
        toast.info("Appointment booked. Please complete payment at the clinic to confirm.")
      } else {
        toast.error(result?.message || "Failed to book appointment")
      }
    } catch (error) {
      console.error("Booking error:", error)
      toast.error("Failed to book appointment")
    }
  }

  const handleChapaPayment = async () => {
    if (!selectedService) return

    try {
      const scheduledDateTime = `${selectedDate.fullDate} ${selectedTime}:00`
      const slotId = Math.floor(Math.random() * 100) + 1
      
      const request = {
        patientId: patientId,
        serviceId: selectedService.id,
        slotId: slotId,
        scheduledDateTime: scheduledDateTime,
        paymentConfirmed: false,
        notes: `Booking for ${selectedService.name}`
      }

      const result = await createChapaCheckout(request)
      
      if (result?.checkoutUrl) {
        window.location.href = result.checkoutUrl
      } else {
        toast.error("Failed to create payment link")
      }
    } catch (error) {
      console.error("Chapa checkout error:", error)
      toast.error("Failed to create payment link")
    }
  }

  if (servicesLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FF] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#006767]" />
      </div>
    )
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
          {/* Left Column */}
          <div className="w-full lg:w-[70%] space-y-6">
            <ServiceTypeTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Search Bar */}
            <div className="bg-white rounded-2xl border border-[#bcc9c8]/20 shadow-sm overflow-hidden">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6d7979]" />
                <Input
                  placeholder={`Search ${activeTab.toLowerCase()} services...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-5 py-4 bg-[#f8fafc] border-0 rounded-2xl focus:ring-2 focus:ring-[#006767]/20 text-base"
                />
              </div>
            </div>

            {/* Services Grid */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-2xl text-[#0b1c30]">Available Services</h3>
                <span className="text-sm text-[#6d7979] font-medium">{filteredServices.length} services found</span>
              </div>
              
              {filteredServices.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-[#bcc9c8]/20">
                  <p className="text-[#6d7979]">No services found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      isSelected={selectedService?.id === service.id}
                      onSelect={setSelectedService}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Date and Time Selection */}
            {selectedService && (
              <div className="bg-white rounded-2xl p-6 border border-[#bcc9c8]/20 shadow-sm space-y-6">
                <DateSelection
                  dates={dates}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
                <TimeSelection
                  timeSlots={timeSlots}
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                />
                
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-5 bg-[#eff4ff] rounded-2xl border border-[#006767]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#006767] border border-[#006767]/10">
                      <Search className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#6d7979] uppercase tracking-wide">Selected Slot</p>
                      <p className="text-base font-bold text-[#0b1c30]">
                        {selectedDate.day} {selectedDate.date}/{selectedDate.month} | {selectedTime}
                      </p>
                      <p className="text-sm text-[#006767]">{selectedService.name} • {selectedService.durationMinutes} min</p>
                    </div>
                  </div>
                  <button
                    onClick={handleBookNow}
                    className="w-full sm:w-auto px-8 py-4 bg-[#008b8b] hover:bg-[#006767] text-white font-bold rounded-2xl shadow-lg transition-all text-base"
                  >
                    Continue - ETB {totalAmount}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-[30%]">
            {selectedService && (
              <BookingSidebar
                service={selectedService}
                totalAmount={totalAmount}
                onPayNow={handleBookNow}
                onPayLater={handlePayLater}
                onChapaPayment={handleChapaPayment}
                isLoading={isProcessing || isBooking}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <PaymentModal
        service={selectedService!}
        totalAmount={totalAmount}
        isOpen={showPaymentModal}
        isProcessing={isProcessing || isBooking}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePayment}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        data={successData!}
        onClose={() => setShowSuccessModal(false)}
      />
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