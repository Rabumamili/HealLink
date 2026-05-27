// components/booking/BookingSidebar.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, CreditCard } from "lucide-react"
import { Service } from "@/types/entities/service.types"

interface BookingSidebarProps {
  service: Service
  totalAmount: number
  onPayNow: () => void
  onPayLater: () => void
  onChapaPayment: () => void
  isLoading?: boolean
}

export function BookingSidebar({
  service,
  totalAmount,
  onPayNow,
  onPayLater,
  onChapaPayment,
  isLoading = false
}: BookingSidebarProps) {
  return (
    <div className="sticky top-24 bg-white rounded-2xl border border-[#bcc9c8]/20 shadow-sm overflow-hidden">
      <div className="p-6 bg-[#eff4ff]/40 border-b border-[#bcc9c8]/20">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 rounded-2xl">
            <AvatarFallback className="bg-[#006767]/10 text-[#006767] text-xl font-bold">
              {service.name.split(" ").map((n: string) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-lg text-[#0b1c30]">{service.name}</h3>
            <p className="text-sm text-[#006767]">{service.serviceType}</p>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-3 w-3 text-[#6d7979]" />
              <span className="text-xs text-[#6d7979]">{service.durationMinutes} minutes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h4 className="font-semibold text-sm text-[#6d7979] mb-2">Description</h4>
          <p className="text-sm text-[#0b1c30]">{service.description}</p>
        </div>

        {service.preparationInstructions && (
          <div>
            <h4 className="font-semibold text-sm text-[#6d7979] mb-2">Preparation Instructions</h4>
            <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-xl">
              {service.preparationInstructions}
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-[#bcc9c8]/20">
          <div className="flex justify-between mb-3">
            <span className="text-[#6d7979]">Service Fee</span>
            <span className="font-bold text-[#0b1c30]">ETB {totalAmount}</span>
          </div>
          <Button
            onClick={onPayNow}
            disabled={isLoading}
            className="w-full py-5 bg-[#006767] hover:bg-[#008282] text-white font-bold rounded-xl mb-3"
          >
            Pay Now
          </Button>
          <Button
            onClick={onPayLater}
            variant="outline"
            disabled={isLoading}
            className="w-full py-5 border-[#006767]/30 text-[#006767] hover:bg-[#006767]/5"
          >
            Book Now, Pay Later
          </Button>
          <Button
            onClick={onChapaPayment}
            variant="ghost"
            disabled={isLoading}
            className="w-full mt-2 py-3 text-sm text-[#6d7979] hover:text-[#006767]"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Pay with Chapa
          </Button>
        </div>
      </div>
    </div>
  )
}