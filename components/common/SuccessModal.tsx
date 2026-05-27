// components/common/SuccessModal.tsx
"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, CreditCard, Calendar, MapPin, Clock, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export interface SuccessModalData {
  title: string
  message: string
  details?: {
    bookingId?: string
    cardNumber?: string
    appointmentDate?: string
    appointmentTime?: string
    location?: string
    serviceName?: string
    amount?: number
  }
  primaryAction?: {
    label: string
    href?: string
    onClick?: () => void
  }
  secondaryAction?: {
    label: string
    onClick?: () => void
  }
  variant?: 'booking' | 'payment' | 'checkin' | 'reschedule' | 'cancellation'
}

interface SuccessModalProps {
  isOpen: boolean
  data: SuccessModalData
  onClose: () => void
}

const variantIcons = {
  booking: CheckCircle,
  payment: CreditCard,
  checkin: CheckCircle,
  reschedule: Calendar,
  cancellation: CheckCircle
}

const variantColors = {
  booking: "bg-[#006767]/10 text-[#006767]",
  payment: "bg-green-100 text-green-600",
  checkin: "bg-blue-100 text-blue-600",
  reschedule: "bg-amber-100 text-amber-600",
  cancellation: "bg-red-100 text-red-600"
}

export function SuccessModal({ isOpen, data, onClose }: SuccessModalProps) {
  const router = useRouter()
  
  if (!isOpen) return null

  const Icon = variantIcons[data.variant || 'booking']
  const colorClass = variantColors[data.variant || 'booking']

  const handlePrimaryAction = () => {
    if (data.primaryAction?.onClick) {
      data.primaryAction.onClick()
    } else if (data.primaryAction?.href) {
      router.push(data.primaryAction.href)
    }
    onClose()
  }

  const handleSecondaryAction = () => {
    if (data.secondaryAction?.onClick) {
      data.secondaryAction.onClick()
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-5 shadow-2xl animate-in zoom-in-95 duration-300 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-[#eff4ff] rounded-full transition-all"
        >
          <X className="h-5 w-5 text-[#6d7979]" />
        </button>

        {/* Icon */}
        <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mx-auto", colorClass)}>
          <Icon className="h-10 w-10" />
        </div>

        {/* Title & Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#0b1c30]">{data.title}</h2>
          <p className="text-base text-[#6d7979]">{data.message}</p>
        </div>

        {/* Card Number (if present) */}
        {data.details?.cardNumber && (
          <div className="bg-[#eff4ff] p-5 rounded-2xl border border-[#006767]/10 space-y-2">
            <p className="text-xs font-bold text-[#6d7979] uppercase tracking-wide">Your Card Number</p>
            <p className="text-xl font-bold text-[#006767] tracking-wider font-mono">
              {data.details.cardNumber}
            </p>
            <p className="text-xs text-[#6d7979]">Please save this number for check-in</p>
          </div>
        )}

        {/* Booking ID (if present) */}
        {data.details?.bookingId && !data.details?.cardNumber && (
          <div className="bg-[#eff4ff] p-5 rounded-2xl border border-[#006767]/10 space-y-2">
            <p className="text-xs font-bold text-[#6d7979] uppercase tracking-wide">Booking ID</p>
            <p className="text-xl font-bold text-[#006767] tracking-wider">
              {data.details.bookingId}
            </p>
          </div>
        )}

        {/* Appointment Details */}
        {(data.details?.appointmentDate || data.details?.appointmentTime || data.details?.location) && (
          <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-left">
            {data.details?.serviceName && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-[#0b1c30]">Service:</span>
                <span className="text-[#6d7979]">{data.details.serviceName}</span>
              </div>
            )}
            {data.details?.appointmentDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-[#006767]" />
                <span className="text-[#6d7979]">{data.details.appointmentDate}</span>
              </div>
            )}
            {data.details?.appointmentTime && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-[#006767]" />
                <span className="text-[#6d7979]">{data.details.appointmentTime}</span>
              </div>
            )}
            {data.details?.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-[#006767]" />
                <span className="text-[#6d7979]">{data.details.location}</span>
              </div>
            )}
            {data.details?.amount && (
              <div className="flex items-center gap-2 text-sm pt-2 border-t border-gray-200">
                <span className="font-medium text-[#0b1c30]">Amount Paid:</span>
                <span className="text-[#006767] font-bold">ETB {data.details.amount}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          {data.secondaryAction && (
            <Button
              variant="outline"
              onClick={handleSecondaryAction}
              className="flex-1 py-6 border-[#006767]/30 text-[#006767] hover:bg-[#006767]/5 rounded-xl"
            >
              {data.secondaryAction.label}
            </Button>
          )}
          <Button
            onClick={handlePrimaryAction}
            className={cn(
              "flex-1 py-6 bg-[#006767] hover:bg-[#008282] text-white font-bold rounded-xl",
              !data.secondaryAction && "w-full"
            )}
          >
            {data.primaryAction?.label || "Continue"}
          </Button>
        </div>
      </div>
    </div>
  )
}