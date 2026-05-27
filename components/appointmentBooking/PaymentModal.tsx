// components/booking/PaymentModal.tsx
"use client"

import { Button } from "@/components/ui/button"
import { CreditCard, Loader2, X } from "lucide-react"
import { Service } from "@/types/entities/service.types"

interface PaymentModalProps {
  service: Service
  totalAmount: number
  isOpen: boolean
  isProcessing: boolean
  onClose: () => void
  onConfirm: () => void
}

export function PaymentModal({
  service,
  totalAmount,
  isOpen,
  isProcessing,
  onClose,
  onConfirm
}: PaymentModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#0b1c30]">Complete Payment</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#eff4ff] rounded-full">
            <X className="h-5 w-5 text-[#6d7979]" />
          </button>
        </div>

        <div className="bg-[#eff4ff] rounded-2xl p-5">
          <h3 className="font-bold mb-3 text-[#0b1c30]">Payment Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6d7979]">{service.name}</span>
              <span className="font-medium">ETB {service.standardFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6d7979]">Platform Fee</span>
              <span className="font-medium">ETB 0</span>
            </div>
            <div className="border-t pt-3 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-[#006767] text-lg">ETB {totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#006767]/5 rounded-2xl p-5 border border-[#006767]/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#006767] rounded-xl flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#0b1c30]">Pay with Chapa</h3>
              <p className="text-xs text-[#6d7979]">Secure payment gateway</p>
            </div>
          </div>
          <p className="text-sm text-[#515f78]">You will be redirected to Chapa's secure payment page.</p>
        </div>

        <Button
          onClick={onConfirm}
          disabled={isProcessing}
          className="w-full py-6 bg-[#006767] hover:bg-[#008282] text-white font-bold rounded-xl"
        >
          {isProcessing ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
          ) : (
            <><CreditCard className="mr-2 h-4 w-4" /> Pay ETB {totalAmount}</>
          )}
        </Button>
      </div>
    </div>
  )
}