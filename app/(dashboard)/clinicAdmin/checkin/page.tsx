"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StatsCard } from "@/components/common/StatsCard"
import { useCard, useCardCheckIn, useCardValidation, useCardStats } from "@/hooks/useCard"
import { useAppointments } from "@/hooks/useAppointments"
import { Search, CheckCircle, AlertCircle, Loader2, Calendar, Users, Clock, QrCode } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ClinicCheckinPage() {
  const router = useRouter()
  const [cardNumber, setCardNumber] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [foundCard, setFoundCard] = useState<any>(null)
  const [checkInSuccess, setCheckInSuccess] = useState(false)

  const { cards, fetchCards, isLoading: cardsLoading } = useCard({ autoFetch: true })
  const { validateCard, validationResult, clearValidationResult } = useCardValidation()
  const { checkIn, checkInResult, clearCheckInResult } = useCardCheckIn()
  const { cardStats, refresh: refreshStats } = useCardStats()
  const { updateStatus, refreshData } = useAppointments()

  // Staff info - replace with actual from auth context
  const staffId = 1
  const staffType = "clinic" as const

  // Filter active cards - DON'T show card numbers in the list
  const clinicCards = cards.filter(card => card.status === 'Active')

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
      setFoundCard(result.card)
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
  const todayCheckIns = cards.filter(card => 
    card.status === 'Used' && 
    card.usedAt && 
    new Date(card.usedAt).toDateString() === today
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-teal-600">Patient Check-in</h1>
        <p className="text-muted-foreground">Verify patients using their card number</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-teal-600" />
              Quick Patient Check-in
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter card number (e.g., 4512-7893-1023-6745)"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="font-mono"
                    disabled={isVerifying || checkInSuccess}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleVerify()
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the card number shown to the patient
                  </p>
                </div>
                <Button 
                  className="bg-teal-600 hover:bg-teal-700 whitespace-nowrap" 
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

              {/* Results - Card number NOT displayed here */}
              {(validationResult || foundCard || checkInResult) && (
                <div className={cn(
                  "p-4 rounded-lg border",
                  checkInSuccess || checkInResult?.success 
                    ? "bg-green-50 border-green-200" 
                    : validationResult && !validationResult.isValid
                    ? "bg-red-50 border-red-200"
                    : "bg-teal-50 border-teal-200"
                )}>
                  {checkInSuccess || checkInResult?.success ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">Check-in Successful!</span>
                      </div>
                      <p className="text-green-600">
                        Welcome, {checkInResult?.patientName || foundCard?.appointment?.patientName || "Patient"}
                      </p>
                      <p className="text-sm text-green-600">
                        Service: {checkInResult?.serviceName || foundCard?.appointment?.serviceName || "N/A"}
                      </p>
                      <p className="text-sm text-green-600">
                        Please proceed to the waiting area
                      </p>
                    </div>
                  ) : foundCard && validationResult?.isValid ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-teal-100 text-teal-600">
                              {getInitials(foundCard.appointment?.patientName || "Patient")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{foundCard.appointment?.patientName || "Unknown Patient"}</p>
                            <p className="text-sm text-muted-foreground">
                              ID: {foundCard.appointment?.patientId || `APT-${foundCard.appointmentId}`}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Verified</Badge>
                      </div>
                      {/* CARD NUMBER NOT DISPLAYED HERE - just patient info */}
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Service</span>
                          <span>{foundCard.appointment?.serviceName || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Appointment Time</span>
                          <span>
                            {foundCard.appointment?.scheduledDateTime 
                              ? new Date(foundCard.appointment.scheduledDateTime).toLocaleString()
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Provider</span>
                          <span>{foundCard.appointment?.providerName || "N/A"}</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full bg-teal-600 hover:bg-teal-700" 
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
                        className="mt-2"
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

        {/* Active Appointments List - No card numbers shown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-600" />
              Today's Confirmed Appointments ({clinicCards.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cardsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
              </div>
            ) : clinicCards.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {clinicCards.slice(0, 5).map((card) => (
                  <div key={card.id} className="flex items-center justify-between p-3 rounded-lg border hover:border-teal-200 transition-colors">
                    <div className="flex-1">
                      {/* Show patient name, NOT card number */}
                      <p className="font-medium">
                        {(card as any).appointment?.patientName || `Appointment #${card.appointmentId}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(card as any).appointment?.serviceName || "Service"}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Ready</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-2"
                      onClick={() => {
                        // Auto-fill card number (hidden from UI) for verification
                        setCardNumber(card.cardNumber)
                        setTimeout(() => handleVerify(), 100)
                      }}
                    >
                      Check In
                    </Button>
                  </div>
                ))}
                {clinicCards.length > 5 && (
                  <p className="text-center text-sm text-muted-foreground pt-2">
                    +{clinicCards.length - 5} more patients waiting
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No confirmed appointments for today
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}