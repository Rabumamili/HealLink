// app/(dashboard)/clinic/checkin/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StatsCard } from "@/components/common/StatsCard"
import { CheckinHeader } from "@/components/checkin/CheckinHeader"
import { useCard, useCardCheckIn, useCardValidation, useCardStats } from "@/hooks/useCard"
import { useAppointments } from "@/hooks/useAppointments"
import { Search, CheckCircle, AlertCircle, Loader2, Calendar, Users, Clock, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface CardWithAppointment {
  id: number
  cardNumber: string
  status: string
  appointmentId: number
  expiresAt: string
  usedAt: string | null
  appointment?: {
    patientName: string
    patientId: number
    serviceName: string
    scheduledDateTime: string
    providerName: string
  }
}

export default function ClinicCheckinPage() {
  const [cardNumber, setCardNumber] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [foundCard, setFoundCard] = useState<CardWithAppointment | null>(null)
  const [checkInSuccess, setCheckInSuccess] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { cards, fetchCards, isLoading: cardsLoading } = useCard({ autoFetch: true })
  const { validateCard, validationResult, clearValidationResult } = useCardValidation()
  const { checkIn, checkInResult, clearCheckInResult } = useCardCheckIn()
  const { cardStats, refresh: refreshStats } = useCardStats()
  const { updateStatus, refreshData } = useAppointments()

  const staffId = 1
  const staffType = "clinic" as const

  const clinicCards = (cards as CardWithAppointment[]).filter(card => card.status === 'Active')

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await fetchCards()
      await refreshStats()
      toast.success("Data refreshed")
    } catch {
      toast.error("Failed to refresh")
    } finally {
      setIsRefreshing(false)
    }
  }, [fetchCards, refreshStats])

  const handleVerify = async () => {
    if (!cardNumber.trim()) {
      toast.error("Please enter a card number")
      return
    }

    setIsVerifying(true)
    setFoundCard(null)
    clearValidationResult()
    
    const result = await validateCard(cardNumber)
    
    if (result.isValid && result.card) {
      const fullCard = (cards as CardWithAppointment[]).find(c => c.cardNumber === cardNumber)
      setFoundCard(fullCard || null)
      toast.success("Patient found")
    } else {
      setFoundCard(null)
      toast.error(result.message || "Invalid card number")
    }
    
    setIsVerifying(false)
  }

  const handleCheckIn = async () => {
    if (!foundCard) return

    const result = await checkIn({
      cardNumber: foundCard.cardNumber,
      verifiedByStaffId: staffId,
      verifiedByType: staffType,
    })

    if (result.success) {
      if (result.appointmentId) {
        await updateStatus(result.appointmentId, "Checked-in")
        await refreshData()
      }
      
      setCheckInSuccess(true)
      toast.success(`${result.patientName || foundCard.appointment?.patientName} checked in successfully`)
      
      await refreshStats()
      await fetchCards()
      
      setTimeout(() => {
        setCardNumber("")
        setFoundCard(null)
        setCheckInSuccess(false)
        clearValidationResult()
        clearCheckInResult()
      }, 2000)
    } else {
      toast.error(result.message || "Check-in failed")
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "PT"
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const today = new Date().toDateString()
  const todayCheckIns = (cards as CardWithAppointment[]).filter(card => 
    card.status === 'Used' && 
    card.usedAt && 
    new Date(card.usedAt).toDateString() === today
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CheckinHeader
          title="Patient Check-in"
          description="Verify patients using their card number and manage check-ins efficiently."
          icon={<Building2 className="h-5 w-5" />}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <StatsCard
            title="Total Active Cards"
            value={cardStats?.active || 0}
            icon={<Users className="h-5 w-5" />}
            variant="default"
          />
          <StatsCard
            title="Today's Check-ins"
            value={todayCheckIns.length}
            icon={<CheckCircle className="h-5 w-5" />}
            variant="success"
          />
          <StatsCard
            title="Total Used"
            value={cardStats?.used || 0}
            icon={<Clock className="h-5 w-5" />}
            variant="info"
          />
          <StatsCard
            title="Utilization Rate"
            value={`${cardStats?.utilizationRate || 0}%`}
            icon={<Calendar className="h-5 w-5" />}
            variant="primary"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Search className="h-5 w-5 text-[#008282]" />
                Quick Patient Check-in
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter card number (e.g., 4512-7893-1023-6745)"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="font-mono border-slate-200 focus:border-[#008282] focus:ring-[#008282]"
                      disabled={isVerifying || checkInSuccess}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleVerify()
                      }}
                    />
                    <p className="text-xs text-slate-400 mt-1">Enter the card number shown to the patient</p>
                  </div>
                  <Button 
                    className="bg-[#008282] hover:bg-[#00a0a0] whitespace-nowrap rounded-xl" 
                    onClick={handleVerify}
                    disabled={isVerifying || !cardNumber.trim() || checkInSuccess}
                  >
                    {isVerifying ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="mr-2 h-4 w-4" />
                    )}
                    Verify
                  </Button>
                </div>

                {(validationResult || foundCard || checkInResult) && (
                  <div className={cn(
                    "p-4 rounded-xl border transition-all",
                    checkInSuccess || checkInResult?.success 
                      ? "bg-emerald-50 border-emerald-200" 
                      : validationResult && !validationResult.isValid
                      ? "bg-red-50 border-red-200"
                      : "bg-[#008282]/5 border-[#008282]/10"
                  )}>
                    {checkInSuccess || checkInResult?.success ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-700">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-semibold">Check-in Successful!</span>
                        </div>
                        <p className="text-emerald-600">
                          Welcome, {checkInResult?.patientName || foundCard?.appointment?.patientName || "Patient"}
                        </p>
                        <p className="text-sm text-emerald-600">
                          Service: {checkInResult?.serviceName || foundCard?.appointment?.serviceName || "N/A"}
                        </p>
                        <p className="text-sm text-emerald-600">Please proceed to the waiting area</p>
                      </div>
                    ) : foundCard && validationResult?.isValid ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 rounded-xl">
                              <AvatarFallback className="bg-[#008282]/10 text-[#008282] text-base">
                                {getInitials(foundCard.appointment?.patientName || "Patient")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-slate-800">{foundCard.appointment?.patientName || "Unknown Patient"}</p>
                              <p className="text-sm text-slate-500">
                                ID: {foundCard.appointment?.patientId || `APT-${foundCard.appointmentId}`}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-700 border-0">Verified</Badge>
                        </div>
                        <div className="grid gap-2 text-sm border-t border-slate-100 pt-3">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Service</span>
                            <span className="font-medium text-slate-700">{foundCard.appointment?.serviceName || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Appointment Time</span>
                            <span className="font-medium text-slate-700">
                              {foundCard.appointment?.scheduledDateTime 
                                ? new Date(foundCard.appointment.scheduledDateTime).toLocaleString()
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Provider</span>
                            <span className="font-medium text-slate-700">{foundCard.appointment?.providerName || "N/A"}</span>
                          </div>
                        </div>
                        <Button 
                          className="w-full bg-[#008282] hover:bg-[#00a0a0] rounded-xl" 
                          onClick={handleCheckIn}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Confirm Check-in
                        </Button>
                      </div>
                    ) : validationResult && !validationResult.isValid && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-red-700">
                          <AlertCircle className="h-5 w-5" />
                          <span className="font-semibold">Invalid Card</span>
                        </div>
                        <p className="text-red-600">{validationResult.message}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setCardNumber("")
                            clearValidationResult()
                          }}
                          className="mt-2 rounded-xl"
                        >
                          Try Again
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Users className="h-5 w-5 text-[#008282]" />
                Today's Confirmed Appointments ({clinicCards.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {cardsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-[#008282]" />
                </div>
              ) : clinicCards.length > 0 ? (
                <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                  {clinicCards.map((card) => (
                    <div key={card.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">
                          {card.appointment?.patientName || `Appointment #${card.appointmentId}`}
                        </p>
                        <p className="text-sm text-slate-500">
                          {card.appointment?.serviceName || "Service"}
                        </p>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 border-0">Ready</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-3 rounded-xl border-[#008282] text-[#008282] hover:bg-[#008282]/10"
                        onClick={() => {
                          setCardNumber(card.cardNumber)
                          setTimeout(() => handleVerify(), 100)
                        }}
                      >
                        Check In
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500">No confirmed appointments for today</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}