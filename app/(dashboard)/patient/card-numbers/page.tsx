"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  DollarSign
} from "lucide-react"

interface CardData {
  id: string
  cardNumber: string
  providerName: string
  providerType: "doctor" | "clinic" | "diagnostic"
  service: string
  date: string
  time: string
  location: string
  fee: number
  expiresAt: Date
  status: "Active" | "Used" | "Expired"
}

const providerTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  doctor: Stethoscope,
  clinic: Building2,
  diagnostic: FlaskConical,
}

function formatTimeRemaining(expiresAt: Date): string {
  const now = new Date()
  const diff = expiresAt.getTime() - now.getTime()
  
  if (diff <= 0) return "Expired"
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days}d ${hours % 24}h remaining`
  }
  
  return `${hours}h ${minutes}m remaining`
}

export default function CardNumbersPage() {
  const searchParams = useSearchParams()
  const appointmentId = searchParams.get("appointment")
  
  const [activeCards, setActiveCards] = useState<CardData[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<Record<string, string>>({})

  useEffect(() => {
    // Load cards from localStorage
    const savedCards = localStorage.getItem('activeCards')
    if (savedCards) {
      const cards = JSON.parse(savedCards)
      // Convert expiresAt string back to Date
      const cardsWithDates = cards.map((card: any) => ({
        ...card,
        expiresAt: new Date(card.expiresAt)
      }))
      setActiveCards(cardsWithDates)
    }
  }, [])

  useEffect(() => {
    const updateTimes = () => {
      const times: Record<string, string> = {}
      activeCards.forEach(card => {
        times[card.id] = formatTimeRemaining(card.expiresAt)
      })
      setTimeRemaining(times)
    }

    updateTimes()
    const interval = setInterval(updateTimes, 60000)

    return () => clearInterval(interval)
  }, [activeCards])

  const copyCardNumber = (id: string, cardNumber: string) => {
    navigator.clipboard.writeText(cardNumber.replace(/-/g, ""))
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const highlightedId = appointmentId

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Card Numbers</h1>
        <p className="text-muted-foreground">Your active appointment cards for check-in</p>
      </div>

      {activeCards.length > 0 ? (
        <div className="grid gap-6">
          {activeCards.map((card) => {
            const ProviderIcon = providerTypeIcons[card.providerType]
            const isHighlighted = highlightedId === card.id
            
            return (
              <Card 
                key={card.id} 
                className={`overflow-hidden ${isHighlighted ? 'ring-2 ring-primary shadow-lg' : ''}`}
              >
                <div className="bg-primary p-6 text-primary-foreground">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-foreground/10">
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
                            className="text-primary-foreground hover:bg-primary-foreground/10"
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
                      <Badge className="bg-primary-foreground/20 text-primary-foreground border-0">
                        {card.status}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4" />
                        {timeRemaining[card.id] || "Calculating..."}
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
                        <p className="font-medium">{card.providerName}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Service</p>
                      <p className="font-medium">{card.service}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date & Time</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{card.date} at {card.time}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{card.location}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fee</p>
                      <div className="flex items-center gap-2 mt-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">ETB {card.fee}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <Button variant="outline" className="flex-1" asChild>
                      <a href={`https://maps.google.com?q=${encodeURIComponent(card.location)}`} target="_blank" rel="noopener noreferrer">
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
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold text-lg">No Active Cards</h3>
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