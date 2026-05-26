// app/(dashboard)/doctor/checkin/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StatsCard } from "@/components/common/StatsCard"
import { useCard, useCardCheckIn, useCardValidation, useCardStats } from "@/hooks/useCard"
import { Search, CheckCircle, AlertCircle, Loader2, Calendar, Users, Clock, Stethoscope } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function DoctorCheckinPage() {
  const [cardNumber, setCardNumber] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [foundCard, setFoundCard] = useState<any>(null)
  const [checkInSuccess, setCheckInSuccess] = useState(false)

  const { cards, fetchCards, isLoading: cardsLoading } = useCard({ autoFetch: true })
  const { validateCard, validationResult, clearValidationResult } = useCardValidation()
  const { checkIn, checkInResult, clearCheckInResult } = useCardCheckIn()
  const { cardStats } = useCardStats()

  // Staff info - replace with actual from auth context
  const staffId = 3
  const staffType = "doctor" as const

  // Filter active cards for doctors
  const doctorCards = cards.filter(card => 
    card.status === 'Active' && 
    (card as any).appointment?.providerType === 'doctor'
  )

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
      setCheckInSuccess(true)
      toast.success(`${result.patientName} checked in successfully`)
      
      setTimeout(() => {
        setCardNumber("")
        setFoundCard(null)
        setCheckInSuccess(false)
        clearValidationResult()
        clearCheckInResult()
        fetchCards()
      }, 2000)
    } else {
      toast.error(result.message || "Check-in failed")
    }
  }

  const getInitials = (name: string) => {
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
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-blue-600">Doctor Check-in</h1>
        <p className="text-muted-foreground">Verify and check in patients for consultations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total Active Cards"
          value={cardStats?.active || 0}
          icon={<Stethoscope className="h-5 w-5" />}
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
        {/* Check-in Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              Patient Check-in
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter 16-digit Card number (e.g., 4512-7893-1023-6745)"
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
                </div>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap" 
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
                  "p-4 rounded-lg border",
                  checkInSuccess || (checkInResult?.success) 
                    ? "bg-green-50 border-green-200" 
                    : validationResult && !validationResult.isValid
                    ? "bg-red-50 border-red-200"
                    : "bg-blue-50 border-blue-200"
                )}>
                  {checkInSuccess || checkInResult?.success ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">Check-in Successful!</span>
                      </div>
                      <p className="text-green-600">
                        Welcome, {checkInResult?.patientName || foundCard?.appointment?.patientName}
                      </p>
                      <p className="text-sm text-green-600">
                        Service: {checkInResult?.serviceName || foundCard?.appointment?.serviceName}
                      </p>
                    </div>
                  ) : foundCard && validationResult?.isValid ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {getInitials(foundCard.appointment?.patientName || "Patient")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{foundCard.appointment?.patientName}</p>
                            <p className="text-sm text-muted-foreground">
                              ID: {foundCard.appointment?.patientId || `APT-${foundCard.appointmentId}`}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Verified</Badge>
                      </div>
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Consultation Type</span>
                          <span>{foundCard.appointment?.serviceName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Appointment Time</span>
                          <span>
                            {foundCard.appointment?.scheduledDateTime 
                              ? new Date(foundCard.appointment.scheduledDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Doctor</span>
                          <span>{foundCard.appointment?.providerName}</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700" 
                        onClick={handleCheckIn}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Confirm Check-in
                      </Button>
                    </div>
                  ) : validationResult && !validationResult.isValid && (
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertCircle className="h-5 w-5" />
                      <span>{validationResult.message}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Doctor Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-blue-600" />
              Active Consultation Cards ({doctorCards.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cardsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : doctorCards.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {doctorCards.slice(0, 5).map((card) => (
                  <div key={card.id} className="flex items-center justify-between p-3 rounded-lg border hover:border-blue-200 transition-colors">
                    <div className="flex-1">
                      <p className="font-mono text-sm font-medium">{card.cardNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {(card as any).appointment?.patientName || `Appointment #${card.appointmentId}`}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-2"
                      onClick={() => {
                        setCardNumber(card.cardNumber)
                        handleVerify()
                      }}
                    >
                      Check In
                    </Button>
                  </div>
                ))}
                {doctorCards.length > 5 && (
                  <p className="text-center text-sm text-muted-foreground pt-2">
                    +{doctorCards.length - 5} more active cards
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No active consultation cards found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}