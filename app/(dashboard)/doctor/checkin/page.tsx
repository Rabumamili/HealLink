// app/(dashboard)/doctor/checkin/page.tsx
"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StatsCard } from "@/components/common/StatsCard"
import { CheckinHeader } from "@/components/checkin/CheckinHeader"
import { useQr, useQrCheckIn, useQrValidation, useQrStats } from "@/hooks/useQr"
import { useAppointments } from "@/hooks/useAppointments"
import { useAuth } from "@/hooks/useAuth"
import { Search, CheckCircle, AlertCircle, Loader2, Calendar, Users, Clock, Stethoscope, Camera, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface CardWithAppointment {
  id: number
  card_number: string
  qr_image_b64?: string
  status: string
  appointment_id: number
  expires_at: string
  used_at: string | null
  appointment?: {
    patientName: string
    patientId: number
    serviceName: string
    scheduledDateTime: string
    providerName: string
  }
}

export default function DoctorCheckinPage() {
  const [cardNumber, setCardNumber] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [foundCard, setFoundCard] = useState<CardWithAppointment | null>(null)
  const [checkInSuccess, setCheckInSuccess] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [scanMode, setScanMode] = useState<"manual" | "qr">("manual")
  const [isScanning, setIsScanning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const { user, isLoading: isAuthLoading } = useAuth({ requireAuth: true })
  const { qrCodes, fetchQrCodes, isLoading: qrCodesLoading } = useQr({ autoFetch: true })
  const { validateQr, validationResult, clearValidationResult } = useQrValidation()
  const { checkIn, checkInResult, clearCheckInResult } = useQrCheckIn()
  const { qrStats, refresh: refreshStats } = useQrStats()
  const { updateStatus, refreshData, appointments } = useAppointments()

  if (isAuthLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-[#008282]" />
    </div>
  }

  const staffId = user?.provider_id || null
  const staffType = "doctor" as const

  const qrCodesWithAppointments = qrCodes.map((qr) => ({
    ...qr,
    appointment: appointments.find((apt) => apt.id === qr.appointment_id)
  }))
  const doctorCards = (qrCodesWithAppointments as CardWithAppointment[]).filter(card => card.status === 'active')

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await fetchQrCodes()
      await refreshStats()
      toast.success("Data refreshed")
    } catch {
      toast.error("Failed to refresh")
    } finally {
      setIsRefreshing(false)
    }
  }, [fetchQrCodes, refreshStats])

  const handleVerify = async () => {
    if (!cardNumber.trim()) {
      toast.error("Please enter a card number")
      return
    }

    setIsVerifying(true)
    setFoundCard(null)
    clearValidationResult()
    
    try {
      await validateQr({ card_number: cardNumber })
      const fullCard = (qrCodesWithAppointments as CardWithAppointment[]).find(c => c.card_number === cardNumber)
      setFoundCard(fullCard || null)
      toast.success("Patient found")
    } catch (error) {
      setFoundCard(null)
      toast.error(error instanceof Error ? error.message : "Invalid card number")
    }
    
    setIsVerifying(false)
  }

  const handleStartScan = async () => {
    setIsScanning(true)
    // QR scanning implementation would go here
    // For now, we'll use a placeholder
    toast.info("QR scanning feature - camera access required")
  }

  const handleStopScan = () => {
    setIsScanning(false)
  }

  const handleScanResult = (decodedText: string) => {
    setCardNumber(decodedText)
    setIsScanning(false)
    handleVerify()
  }

  const handleCheckIn = async () => {
    if (!foundCard) return

    const result = await checkIn({
      card_number: foundCard.card_number,
    })

    if (result) {
      if (result.appointment_id) {
        await updateStatus(result.appointment_id, "Checked-in")
        await refreshData()
      }
      
      setCheckInSuccess(true)
      toast.success(`${result.patient_name || foundCard.appointment?.patientName} checked in successfully`)
      
      await refreshStats()
      await fetchQrCodes()
      
      setTimeout(() => {
        setCardNumber("")
        setFoundCard(null)
        setCheckInSuccess(false)
        clearValidationResult()
        clearCheckInResult()
      }, 2000)
    } else {
      toast.error("Check-in failed")
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
  const todayCheckIns = (qrCodesWithAppointments as CardWithAppointment[]).filter(card => 
    card.status === 'used' && 
    card.used_at && 
    new Date(card.used_at).toDateString() === today
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CheckinHeader
          title="Doctor Check-in"
          description="Verify and check in patients for medical consultations using their card number."
          icon={<Stethoscope className="h-5 w-5" />}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <StatsCard
            title="Total Active Cards"
            value={qrStats?.active || 0}
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
            value={qrStats?.used || 0}
            icon={<Clock className="h-5 w-5" />}
            variant="info"
          />
          <StatsCard
            title="Utilization Rate"
            value={`${qrStats?.utilizationRate || 0}%`}
            icon={<Calendar className="h-5 w-5" />}
            variant="primary"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Search className="h-5 w-5 text-[#008282]" />
                  Patient Check-in
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={scanMode === "manual" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setScanMode("manual")}
                    className={cn(
                      "rounded-lg",
                      scanMode === "manual" ? "bg-[#008282] hover:bg-[#00a0a0]" : ""
                    )}
                  >
                    Manual
                  </Button>
                  <Button
                    variant={scanMode === "qr" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setScanMode("qr")}
                    className={cn(
                      "rounded-lg",
                      scanMode === "qr" ? "bg-[#008282] hover:bg-[#00a0a0]" : ""
                    )}
                  >
                    <Camera className="h-4 w-4 mr-1" />
                    QR Scan
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {scanMode === "manual" ? (
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
                ) : (
                  <div className="space-y-4">
                    {isScanning ? (
                      <div className="relative">
                        <div className="bg-slate-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                          <div className="text-center text-white">
                            <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm opacity-70">Camera preview would appear here</p>
                            <p className="text-xs opacity-50 mt-1">Point QR code at camera</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleStopScan}
                          className="mt-2 w-full rounded-lg"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Stop Scanning
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="w-full bg-[#008282] hover:bg-[#00a0a0] rounded-xl"
                        onClick={handleStartScan}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Start QR Scan
                      </Button>
                    )}
                    {cardNumber && (
                      <div className="text-center">
                        <p className="text-sm text-slate-600">Scanned Card Number:</p>
                        <p className="font-mono font-bold text-lg text-[#008282]">{cardNumber}</p>
                      </div>
                    )}
                  </div>
                )}

                {(validationResult || foundCard || checkInResult) && (
                  <div className={cn(
                    "p-4 rounded-xl border transition-all",
                    checkInSuccess || checkInResult 
                      ? "bg-emerald-50 border-emerald-200" 
                      : "bg-[#008282]/5 border-[#008282]/10"
                  )}>
                    {checkInSuccess || checkInResult ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-700">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-semibold">Check-in Successful!</span>
                        </div>
                        <p className="text-emerald-600">
                          Welcome, {checkInResult?.patient_name || foundCard?.appointment?.patientName || "Patient"}
                        </p>
                        <p className="text-sm text-emerald-600">
                          Service: {checkInResult?.service_name || foundCard?.appointment?.serviceName || "N/A"}
                        </p>
                        <p className="text-sm text-emerald-600">Please proceed to the consultation room</p>
                      </div>
                    ) : foundCard ? (
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
                                ID: {foundCard.appointment?.patientId || `APT-${foundCard.appointment_id}`}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-700 border-0">Verified</Badge>
                        </div>
                        <div className="grid gap-2 text-sm border-t border-slate-100 pt-3">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Consultation Type</span>
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
                    ) : validationResult ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 rounded-xl">
                              <AvatarFallback className="bg-[#008282]/10 text-[#008282] text-base">
                                {getInitials(validationResult.patient_name || "Patient")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-slate-800">{validationResult.patient_name || "Unknown Patient"}</p>
                              <p className="text-sm text-slate-500">
                                ID: APT-{validationResult.appointment_id}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-700 border-0">Verified</Badge>
                        </div>
                        <div className="grid gap-2 text-sm border-t border-slate-100 pt-3">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Service</span>
                            <span className="font-medium text-slate-700">{validationResult.service_name || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Checked In At</span>
                            <span className="font-medium text-slate-700">
                              {validationResult.checked_in_at 
                                ? new Date(validationResult.checked_in_at).toLocaleString()
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                        <Button 
                          className="w-full bg-[#008282] hover:bg-[#00a0a0] rounded-xl" 
                          onClick={() => {
                            setCardNumber("")
                            clearValidationResult()
                          }}
                        >
                          Done
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-red-700">
                          <AlertCircle className="h-5 w-5" />
                          <span className="font-semibold">Invalid Card</span>
                        </div>
                        <p className="text-red-600">Card verification failed</p>
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
                Today's Confirmed Appointments ({doctorCards.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {qrCodesLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-[#008282]" />
                </div>
              ) : doctorCards.length > 0 ? (
                <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                  {doctorCards.map((card) => (
                    <div key={card.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        {card.qr_image_b64 && (
                          <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                            <img 
                              src={`data:image/png;base64,${card.qr_image_b64}`} 
                              alt="QR Code" 
                              className="w-10 h-10"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-800">
                            {card.appointment?.patientName || `Appointment #${card.appointment_id}`}
                          </p>
                          <p className="text-sm text-slate-500">
                            {card.appointment?.serviceName || "Consultation"}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 border-0">Ready</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-3 rounded-xl border-[#008282] text-[#008282] hover:bg-[#008282]/10"
                        onClick={() => {
                          setCardNumber(card.card_number)
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
                  <Stethoscope className="h-12 w-12 mx-auto text-slate-300 mb-3" />
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