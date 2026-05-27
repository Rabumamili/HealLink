// app/(dashboard)/patient/card-numbers/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatsCard } from "@/components/common/StatsCard"
import { useCard, useCardStats } from "@/hooks/useCard"
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
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const providerTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  doctor: Stethoscope,
  clinic: Building2,
  diagnostic_center: FlaskConical,
}

const providerTypeColors: Record<string, string> = {
  doctor: "blue",
  clinic: "teal",
  diagnostic_center: "purple",
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
    time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }
}

export default function PatientCardNumbersPage() {
  const searchParams = useSearchParams()
  const highlightedAppointmentId = searchParams.get("appointment")
  
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<Record<number, string>>({})
  
  const { cards, isLoading: cardsLoading, fetchCards } = useCard({ autoFetch: true })
  const { cardStats, isLoading: statsLoading } = useCardStats()

  // Filter cards that have appointment data (from mockCardsWithAppointments)
  const cardsWithAppointments = cards.filter(card => (card as any).appointment)

  // Active cards (not used and not expired)
  const activeCards = cardsWithAppointments.filter(card => card.status === "Active")
  
  // Used cards (checked in)
  const usedCards = cardsWithAppointments.filter(card => card.status === "Used")
  
  // Expired cards
  const expiredCards = cardsWithAppointments.filter(card => card.status === "Expired")

  // Update time remaining every minute for active cards
  useEffect(() => {
    const updateTimes = () => {
      const times: Record<number, string> = {}
      activeCards.forEach(card => {
        times[card.id] = formatTimeRemaining(card.expiresAt)
      })
      setTimeRemaining(times)
    }

    updateTimes()
    const interval = setInterval(updateTimes, 60000)

    return () => clearInterval(interval)
  }, [activeCards])

  const copyCardNumber = (id: number, cardNumber: string) => {
    navigator.clipboard.writeText(cardNumber.replace(/-/g, ""))
    setCopiedId(id)
    toast.success("Card number copied to clipboard")
    setTimeout(() => setCopiedId(null), 2000)
  }

  const isLoading = cardsLoading || statsLoading

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Card Numbers</h1>
        <p className="text-muted-foreground">Your active appointment cards for check-in</p>
      </div>

      {/* Stats Cards */}
      {cardStats && (
        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard
            title="Total Cards"
            value={cardsWithAppointments.length}
            icon={<CreditCard className="h-5 w-5" />}
            variant="default"
          />
          <StatsCard
            title="Active"
            value={activeCards.length}
            icon={<Clock className="h-5 w-5" />}
            variant="success"
          />
          <StatsCard
            title="Used"
            value={usedCards.length}
            icon={<Check className="h-5 w-5" />}
            variant="info"
          />
          <StatsCard
            title="Expired"
            value={expiredCards.length}
            icon={<Calendar className="h-5 w-5" />}
            variant="warning"
          />
        </div>
      )}

      {cardsWithAppointments.length > 0 ? (
        <div className="space-y-6">
          {/* Active Cards Section */}
          {activeCards.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Active Cards ({activeCards.length})
              </h2>
              <div className="grid gap-6">
                {activeCards.map((card) => {
                  const appointment = (card as any).appointment
                  const ProviderIcon = providerTypeIcons[appointment?.providerType || "clinic"]
                  const color = providerTypeColors[appointment?.providerType || "clinic"]
                  const isHighlighted = highlightedAppointmentId === card.appointmentId.toString()
                  const { date, time } = formatDateTime(appointment?.scheduledDateTime || card.createdAt)
                  
                  return (
                    <Card 
                      key={card.id} 
                      className={cn(
                        "overflow-hidden transition-all",
                        isHighlighted && "ring-2 ring-primary shadow-lg"
                      )}
                    >
                      <div className={cn(
                        "p-6 text-white",
                        color === "blue" && "bg-gradient-to-r from-blue-600 to-blue-500",
                        color === "teal" && "bg-gradient-to-r from-teal-600 to-teal-500",
                        color === "purple" && "bg-gradient-to-r from-purple-600 to-purple-500"
                      )}>
                        <div className="flex items-start justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
                              <CreditCard className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="text-sm opacity-80">Check-in Card Number</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xl md:text-2xl font-mono font-bold tracking-wider">
                                  {card.cardNumber}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-white hover:bg-white/10"
                                  onClick={() => copyCardNumber(card.id, card.cardNumber)}
                                >
                                  {copiedId === card.id ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-white/20 text-white border-0">
                              {card.status}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="h-4 w-4" />
                              {timeRemaining[card.id] || formatTimeRemaining(card.expiresAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <CardContent className="p-6 space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Provider</p>
                            <div className="flex items-center gap-2 mt-1">
                              <ProviderIcon className="h-4 w-4 text-muted-foreground" />
                              <p className="font-medium">{appointment?.providerName || "Provider"}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Service</p>
                            <p className="font-medium">{appointment?.serviceName || "Service"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Date & Time</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <p className="font-medium">{date} at {time}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <p className="font-medium">{appointment?.location || "Addis Ababa"}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Fee</p>
                            <div className="flex items-center gap-2 mt-1">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <p className="font-medium">ETB {appointment?.fee || 0}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                          <Button variant="outline" className="flex-1" asChild>
                            <a href={`https://maps.google.com?q=${encodeURIComponent(appointment?.location || "Addis Ababa")}`} target="_blank" rel="noopener noreferrer">
                              <MapPin className="mr-2 h-4 w-4" />
                              Get Directions
                            </a>
                          </Button>
                          <Button variant="outline" className="flex-1" onClick={() => copyCardNumber(card.id, card.cardNumber)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Number
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Used Cards Section (Collapsed by default, can be expanded) */}
          {usedCards.length > 0 && (
            <details className="group">
              <summary className="cursor-pointer text-lg font-semibold flex items-center gap-2 py-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Used Cards ({usedCards.length})
                <span className="text-sm text-muted-foreground group-open:hidden">Click to expand</span>
                <span className="text-sm text-muted-foreground hidden group-open:inline">Click to collapse</span>
              </summary>
              <div className="grid gap-6 mt-4">
                {usedCards.map((card) => {
                  const appointment = (card as any).appointment
                  const ProviderIcon = providerTypeIcons[appointment?.providerType || "clinic"]
                  const color = providerTypeColors[appointment?.providerType || "clinic"]
                  const { date, time } = formatDateTime(appointment?.scheduledDateTime || card.createdAt)
                  
                  return (
                    <Card key={card.id} className="overflow-hidden opacity-75">
                      <div className={cn(
                        "p-4 text-white opacity-50",
                        color === "blue" && "bg-gradient-to-r from-blue-600 to-blue-500",
                        color === "teal" && "bg-gradient-to-r from-teal-600 to-teal-500",
                        color === "purple" && "bg-gradient-to-r from-purple-600 to-purple-500"
                      )}>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5" />
                            <span className="font-mono text-lg">{card.cardNumber}</span>
                          </div>
                          <Badge className="bg-white/20 text-white border-0">{card.status}</Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="grid gap-2 sm:grid-cols-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Service</p>
                            <p className="font-medium">{appointment?.serviceName}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Date</p>
                            <p>{date}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Checked In</p>
                            <p>{card.usedAt ? new Date(card.usedAt).toLocaleTimeString() : "-"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </details>
          )}

          {/* Expired Cards Section */}
          {expiredCards.length > 0 && (
            <details className="group">
              <summary className="cursor-pointer text-lg font-semibold flex items-center gap-2 py-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Expired Cards ({expiredCards.length})
                <span className="text-sm text-muted-foreground group-open:hidden">Click to expand</span>
                <span className="text-sm text-muted-foreground hidden group-open:inline">Click to collapse</span>
              </summary>
              <div className="grid gap-6 mt-4">
                {expiredCards.map((card) => {
                  const appointment = (card as any).appointment
                  const ProviderIcon = providerTypeIcons[appointment?.providerType || "clinic"]
                  const color = providerTypeColors[appointment?.providerType || "clinic"]
                  const { date, time } = formatDateTime(appointment?.scheduledDateTime || card.createdAt)
                  
                  return (
                    <Card key={card.id} className="overflow-hidden opacity-50">
                      <div className={cn(
                        "p-4 text-white opacity-50",
                        color === "blue" && "bg-gradient-to-r from-blue-600 to-blue-500",
                        color === "teal" && "bg-gradient-to-r from-teal-600 to-teal-500",
                        color === "purple" && "bg-gradient-to-r from-purple-600 to-purple-500"
                      )}>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5" />
                            <span className="font-mono text-lg">{card.cardNumber}</span>
                          </div>
                          <Badge className="bg-white/20 text-white border-0">{card.status}</Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="grid gap-2 sm:grid-cols-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Service</p>
                            <p className="font-medium">{appointment?.serviceName}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Appointment Date</p>
                            <p>{date}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Expired On</p>
                            <p>{new Date(card.expiresAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </details>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold text-lg">No Cards Found</h3>
            <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
              Card numbers are generated when you book and pay for an appointment. 
              Book an appointment to receive your check-in card.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/patient/bookings">Book an Appointment</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-muted/30">
        <CardContent className="p-6 space-y-2">
          <h3 className="font-semibold">About Card Numbers</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
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
  )
}