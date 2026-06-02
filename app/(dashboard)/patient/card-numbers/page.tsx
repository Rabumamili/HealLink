// app/(dashboard)/patient/card-numbers/page.tsx - Fixed with consistent width and CheckinHeader

"use client"

import { Suspense, useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatsCard } from "@/components/common/StatsCard"
import { CheckinHeader } from "@/components/checkin/CheckinHeader"
import { useQr } from "@/hooks/useQr"
import { useAppointments } from "@/hooks/useAppointments"
import {
  Copy,
  Check,
  Clock,
  MapPin,
  Calendar,
  CreditCard,
  Stethoscope,
  Building2,
  FlaskConical,
  DollarSign,
  Loader2,
  Ticket,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const providerTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  doctor: Stethoscope,
  clinic: Building2,
  diagnostic_center: FlaskConical,
}

const providerTypeColors: Record<string, string> = {
  doctor: "from-blue-500 to-blue-600",
  clinic: "from-[#008282] to-[#00a0a0]",
  diagnostic_center: "from-purple-500 to-purple-600",
}

function formatTimeRemaining(expiresAt: string): string {
  const now = new Date()
  const expiry = new Date(expiresAt)
  const diff = expiry.getTime() - now.getTime()
  if (diff <= 0) return "Expired"
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days}d ${hours % 24}h remaining`
  }
  return `${hours}h ${minutes}m remaining`
}

function formatDateTime(dateTimeStr: string): { date: string; time: string } {
  const date = new Date(dateTimeStr)
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }
}

function ActiveCardItem({
  card,
  isHighlighted,
  copiedId,
  timeRemaining,
  onCopy,
}: {
  card: any
  isHighlighted: boolean
  copiedId: number | null
  timeRemaining: Record<number, string>
  onCopy: (id: number, cardNumber: string) => void
}) {
  const appointment = card.appointment
  const ProviderIcon = providerTypeIcons[appointment?.providerType || "clinic"]
  const gradient = providerTypeColors[appointment?.providerType || "clinic"]
  const { date, time } = formatDateTime(appointment?.scheduledDateTime || card.created_at)

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-lg border-slate-200",
        isHighlighted && "ring-2 ring-[#008282] shadow-lg"
      )}
    >
      <div className={cn("p-5 text-white bg-gradient-to-r", gradient)}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs opacity-80">Check-in Card Number</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg sm:text-xl font-mono font-bold tracking-wider">
                  {card.card_number}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:bg-white/10 rounded-lg"
                  onClick={() => onCopy(card.id, card.card_number)}
                >
                  {copiedId === card.id ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-white/20 text-white border-0 text-xs rounded-full">Active</Badge>
            <div className="flex items-center gap-1.5 text-xs opacity-90 bg-white/10 px-2 py-1 rounded-full">
              <Clock className="h-3 w-3" />
              {timeRemaining[card.id] || formatTimeRemaining(card.expires_at)}
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-5 space-y-4">
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
          <div>
            <p className="text-xs text-slate-500">Provider</p>
            <div className="flex items-center gap-1.5 mt-1">
              <ProviderIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <p className="font-medium text-sm text-slate-700 truncate">{appointment?.providerName || "Provider"}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500">Service</p>
            <p className="font-medium text-sm text-slate-700 mt-1 truncate">{appointment?.serviceName || "Service"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Date & Time</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <p className="font-medium text-sm text-slate-700">{date} · {time}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500">Location</p>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <p className="font-medium text-sm text-slate-700 truncate">{appointment?.location || "Addis Ababa"}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500">Fee</p>
            <div className="flex items-center gap-1.5 mt-1">
              <DollarSign className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <p className="font-medium text-sm text-slate-700">ETB {appointment?.fee || 0}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" className="flex-1 rounded-xl" asChild>
            <a
              href={`https://maps.google.com?q=${encodeURIComponent(appointment?.location || "Addis Ababa")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin className="mr-2 h-3.5 w-3.5" />
              Get Directions
            </a>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 rounded-xl border-[#008282] text-[#008282] hover:bg-[#008282]/10"
            onClick={() => onCopy(card.id, card.card_number)}
          >
            <Copy className="mr-2 h-3.5 w-3.5" />
            Copy Number
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function PatientCardNumbersContent() {
  const searchParams = useSearchParams()
  const highlightedAppointmentId = searchParams.get("appointment")

  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<Record<number, string>>({})

  const { qrCodes, isLoading: qrCodesLoading, activeQrCodes, usedQrCodes, expiredQrCodes } = useQr({ autoFetch: true })
  const { appointments } = useAppointments()

  // Transform API appointment data to match UI expectations
  const transformedAppointments = useMemo(() => {
    return appointments.map((apt: any) => ({
      ...apt,
      providerType: 'clinic',
      location: 'Location',
      fee: 0,
      scheduledDateTime: apt.appointment_at,
    }))
  }, [appointments])

  const qrCodesWithAppointments = useMemo(
    () => qrCodes.filter((qr) => qr.appointment_id).map((qr) => ({
      ...qr,
      appointment: transformedAppointments.find((apt) => apt.id === qr.appointment_id)
    })),
    [qrCodes, transformedAppointments]
  )

  const activeQrCodesWithAppointments = useMemo(
    () => qrCodesWithAppointments.filter((c) => c.status === "active"),
    [qrCodesWithAppointments]
  )
  const usedQrCodesWithAppointments = useMemo(
    () => qrCodesWithAppointments.filter((c) => c.status === "used"),
    [qrCodesWithAppointments]
  )
  const expiredQrCodesWithAppointments = useMemo(
    () => qrCodesWithAppointments.filter((c) => c.is_expired),
    [qrCodesWithAppointments]
  )

  const activeQrKeys = activeQrCodesWithAppointments.map((c) => `${c.id}:${c.expires_at}`).join(",")
  useEffect(() => {
    const updateTimes = () => {
      setTimeRemaining(
        Object.fromEntries(
          activeQrCodesWithAppointments.map((card) => [card.id, formatTimeRemaining(card.expires_at)])
        )
      )
    }
    updateTimes()
    const interval = setInterval(updateTimes, 60000)
    return () => clearInterval(interval)
  }, [activeQrKeys])

  const copyCardNumber = (id: number, cardNumber: string) => {
    navigator.clipboard.writeText(cardNumber.replace(/-/g, ""))
    setCopiedId(id)
    toast.success("QR number copied to clipboard")
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (qrCodesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-[#008282]" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CheckinHeader
          title="My Card Numbers"
          description="Your active appointment cards for quick check-in at healthcare facilities."
          icon={<Ticket className="h-5 w-5" />}
        />

        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-8">
            <StatsCard
              title="Total Cards"
              value={qrCodesWithAppointments.length}
              icon={<CreditCard className="h-5 w-5" />}
              variant="default"
            />
            <StatsCard
              title="Active"
              value={activeQrCodesWithAppointments.length}
              icon={<Clock className="h-5 w-5" />}
              variant="success"
            />
            <StatsCard
              title="Used"
              value={usedQrCodesWithAppointments.length}
              icon={<Check className="h-5 w-5" />}
              variant="info"
            />
            <StatsCard
              title="Expired"
              value={expiredQrCodesWithAppointments.length}
              icon={<Calendar className="h-5 w-5" />}
              variant="warning"
            />
          </div>

        {qrCodesWithAppointments.length > 0 ? (
          <div className="space-y-6">
            {activeQrCodesWithAppointments.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Active Cards ({activeQrCodesWithAppointments.length})
                </h2>
                <div className="grid gap-5">
                  {activeQrCodesWithAppointments.map((card) => (
                    <ActiveCardItem
                      key={card.id}
                      card={card}
                      isHighlighted={card.appointment_id !== null && highlightedAppointmentId === card.appointment_id.toString()}
                      copiedId={copiedId}
                      timeRemaining={timeRemaining}
                      onCopy={copyCardNumber}
                    />
                  ))}
                </div>
              </div>
            )}

            <Card className="bg-[#008282]/5 border-[#008282]/10">
              <CardContent className="p-5 space-y-2">
                <h3 className="font-semibold text-sm text-slate-800">About Card Numbers</h3>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <p>Your card number is a unique 16-digit code that serves as your appointment ticket.</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Present this number when you arrive at the healthcare facility</li>
                    <li>The staff will verify your appointment and payment status</li>
                    <li>Card numbers expire 24 hours after your appointment time</li>
                    <li>Keep this number handy for quick check-in</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="border-slate-200">
            <CardContent className="py-16 text-center">
              <Ticket className="h-14 w-14 mx-auto text-slate-300 mb-4" />
              <h3 className="font-semibold text-xl text-slate-800 mb-2">No Cards Found</h3>
              <p className="text-slate-500 max-w-sm mx-auto text-sm">
                Card numbers are generated when you book and pay for an appointment.
              </p>
              <Button className="mt-6 bg-[#008282] hover:bg-[#00a0a0] rounded-xl" asChild>
                <Link href="/patient/bookings">Book an Appointment</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function PatientCardNumbersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#008282]" />
        </div>
      }
    >
      <PatientCardNumbersContent />
    </Suspense>
  )
}