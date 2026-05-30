// app/(dashboard)/patient/card-numbers/page.tsx
"use client"

import { useState, useEffect, useMemo } from "react"
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
  Loader2,
  ChevronDown,
  ChevronUp,
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
    time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }
}

const gradientMap: Record<string, string> = {
  blue: "from-blue-600 to-blue-500",
  teal: "from-teal-600 to-teal-500",
  purple: "from-purple-600 to-purple-500",
}

// ── Active Card ──────────────────────────────────────────────────────────────
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
  const color = providerTypeColors[appointment?.providerType || "clinic"]
  const { date, time } = formatDateTime(appointment?.scheduledDateTime || card.createdAt)

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-200",
        isHighlighted && "ring-2 ring-primary shadow-lg"
      )}
    >
      {/* Coloured header */}
      <div className={cn("p-4 sm:p-6 text-white bg-gradient-to-r", gradientMap[color])}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          {/* Card number */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg bg-white/10">
              <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm opacity-80">Check-in Card Number</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base sm:text-xl md:text-2xl font-mono font-bold tracking-wider">
                  {card.cardNumber}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:bg-white/10"
                  onClick={() => onCopy(card.id, card.cardNumber)}
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
          {/* Status + timer */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Badge className="bg-white/20 text-white border-0 text-xs">{card.status}</Badge>
            <div className="flex items-center gap-1 text-xs sm:text-sm opacity-90">
              <Clock className="h-3.5 w-3.5" />
              {timeRemaining[card.id] || formatTimeRemaining(card.expiresAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <CardContent className="p-4 sm:p-6 space-y-4">
        <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Provider</p>
            <div className="flex items-center gap-1.5 mt-1">
              <ProviderIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <p className="font-medium text-sm truncate">{appointment?.providerName || "Provider"}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Service</p>
            <p className="font-medium text-sm mt-1 truncate">{appointment?.serviceName || "Service"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Date & Time</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <p className="font-medium text-sm">{date} · {time}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Location</p>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <p className="font-medium text-sm truncate">{appointment?.location || "Addis Ababa"}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Fee</p>
            <div className="flex items-center gap-1.5 mt-1">
              <DollarSign className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <p className="font-medium text-sm">ETB {appointment?.fee || 0}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <a
              href={`https://maps.google.com?q=${encodeURIComponent(appointment?.location || "Addis Ababa")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin className="mr-2 h-3.5 w-3.5" />
              Get Directions
            </a>
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onCopy(card.id, card.cardNumber)}>
            <Copy className="mr-2 h-3.5 w-3.5" />
            Copy Number
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Compact Card (Used / Expired) ────────────────────────────────────────────
function CompactCardItem({ card, type }: { card: any; type: "used" | "expired" }) {
  const appointment = card.appointment
  const color = providerTypeColors[appointment?.providerType || "clinic"]
  const { date } = formatDateTime(appointment?.scheduledDateTime || card.createdAt)

  return (
    <Card className="overflow-hidden opacity-70">
      <div className={cn("px-4 py-3 text-white bg-gradient-to-r opacity-60", gradientMap[color])}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 shrink-0" />
            <span className="font-mono text-sm sm:text-base">{card.cardNumber}</span>
          </div>
          <Badge className="bg-white/20 text-white border-0 text-xs">{card.status}</Badge>
        </div>
      </div>
      <CardContent className="px-4 py-3">
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Service</p>
            <p className="font-medium truncate">{appointment?.serviceName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Date</p>
            <p>{date}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {type === "used" ? "Checked In" : "Expired On"}
            </p>
            <p>
              {type === "used"
                ? card.usedAt
                  ? new Date(card.usedAt).toLocaleTimeString()
                  : "—"
                : new Date(card.expiresAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Collapsible Section ───────────────────────────────────────────────────────
function CollapsibleSection({
  title,
  count,
  dotColor,
  children,
}: {
  title: string
  count: number
  dotColor: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-2 text-left"
      >
        <span className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <span className={cn("w-2 h-2 rounded-full shrink-0", dotColor)} />
          {title} ({count})
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          {open ? (
            <>Collapse <ChevronUp className="h-4 w-4" /></>
          ) : (
            <>Expand <ChevronDown className="h-4 w-4" /></>
          )}
        </span>
      </button>

      {open && <div className="grid gap-4 mt-3">{children}</div>}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PatientCardNumbersPage() {
  const searchParams = useSearchParams()
  const highlightedAppointmentId = searchParams.get("appointment")

  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<Record<number, string>>({})

  const { cards, isLoading: cardsLoading, fetchCards } = useCard({ autoFetch: true })
  const { cardStats, isLoading: statsLoading } = useCardStats()

  const cardsWithAppointments = useMemo(
    () => cards.filter((card) => (card as any).appointment),
    [cards]
  )
  const activeCards = useMemo(
    () => cardsWithAppointments.filter((c) => c.status === "Active"),
    [cardsWithAppointments]
  )
  const usedCards = useMemo(
    () => cardsWithAppointments.filter((c) => c.status === "Used"),
    [cardsWithAppointments]
  )
  const expiredCards = useMemo(
    () => cardsWithAppointments.filter((c) => c.status === "Expired"),
    [cardsWithAppointments]
  )

  // Depend on the stable card IDs + expiry strings, not the array reference itself,
  // so this effect only re-runs when the actual active cards change.
  const activeCardKeys = activeCards.map((c) => `${c.id}:${c.expiresAt}`).join(",")
  useEffect(() => {
    const updateTimes = () => {
      setTimeRemaining(
        Object.fromEntries(
          activeCards.map((card) => [card.id, formatTimeRemaining(card.expiresAt)])
        )
      )
    }
    updateTimes()
    const interval = setInterval(updateTimes, 60000)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCardKeys])

  const copyCardNumber = (id: number, cardNumber: string) => {
    navigator.clipboard.writeText(cardNumber.replace(/-/g, ""))
    setCopiedId(id)
    toast.success("Card number copied to clipboard")
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (cardsLoading || statsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">My Card Numbers</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your active appointment cards for check-in</p>
      </div>

      {/* Stats */}
      {cardStats && (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
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
        <div className="space-y-5 sm:space-y-6">
          {/* Active */}
          {activeCards.length > 0 && (
            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                Active Cards ({activeCards.length})
              </h2>
              <div className="grid gap-4 sm:gap-5">
                {activeCards.map((card) => (
                  <ActiveCardItem
                    key={card.id}
                    card={card}
                    isHighlighted={highlightedAppointmentId === card.appointmentId.toString()}
                    copiedId={copiedId}
                    timeRemaining={timeRemaining}
                    onCopy={copyCardNumber}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Used — collapsible */}
          {usedCards.length > 0 && (
            <CollapsibleSection title="Used Cards" count={usedCards.length} dotColor="bg-blue-500">
              {usedCards.map((card) => (
                <CompactCardItem key={card.id} card={card} type="used" />
              ))}
            </CollapsibleSection>
          )}

          {/* Expired — collapsible */}
          {expiredCards.length > 0 && (
            <CollapsibleSection title="Expired Cards" count={expiredCards.length} dotColor="bg-red-500">
              {expiredCards.map((card) => (
                <CompactCardItem key={card.id} card={card} type="expired" />
              ))}
            </CollapsibleSection>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold text-lg">No Cards Found</h3>
            <p className="text-muted-foreground mt-1 max-w-sm mx-auto text-sm">
              Card numbers are generated when you book and pay for an appointment.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/patient/bookings">Book an Appointment</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <Card className="bg-muted/30">
        <CardContent className="p-4 sm:p-6 space-y-2">
          <h3 className="font-semibold text-sm sm:text-base">About Card Numbers</h3>
          <div className="space-y-1.5 text-xs sm:text-sm text-muted-foreground">
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