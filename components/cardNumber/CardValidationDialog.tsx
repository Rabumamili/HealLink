// components/cardNumber/CardValidationDialog.tsx
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, Loader2, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"

interface CardValidationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onValidate: (cardNumber: string) => Promise<{ isValid: boolean; message?: string; patientName?: string; serviceName?: string }>
  onCheckIn: (cardNumber: string) => Promise<{ success: boolean; message?: string; patientName?: string }>
  staffId: number
  staffType: 'doctor' | 'staff' | 'clinic' | 'diagnostic_center'
}

export function CardValidationDialog({
  open,
  onOpenChange,
  onValidate,
  onCheckIn,
  staffId,
  staffType,
}: CardValidationDialogProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; message?: string; patientName?: string; serviceName?: string } | null>(null)
  const [checkInResult, setCheckInResult] = useState<{ success: boolean; message?: string; patientName?: string } | null>(null)

  const handleValidate = async () => {
    if (!cardNumber.trim()) return
    
    setIsValidating(true)
    setValidationResult(null)
    setCheckInResult(null)
    
    try {
      const result = await onValidate(cardNumber)
      setValidationResult(result)
    } finally {
      setIsValidating(false)
    }
  }

  const handleCheckIn = async () => {
    setIsCheckingIn(true)
    
    try {
      const result = await onCheckIn(cardNumber)
      setCheckInResult(result)
      
      if (result.success) {
        setTimeout(() => {
          onOpenChange(false)
          reset()
        }, 2000)
      }
    } finally {
      setIsCheckingIn(false)
    }
  }

  const reset = () => {
    setCardNumber("")
    setValidationResult(null)
    setCheckInResult(null)
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) reset()
      onOpenChange(newOpen)
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-teal-600" />
            Card Number Check-in
          </DialogTitle>
          <DialogDescription>
            Enter the patient's 16-digit card number to verify and check them in
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="card-number">Card Number</Label>
            <div className="flex gap-2">
              <Input
                id="card-number"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="font-mono flex-1"
                disabled={isValidating || isCheckingIn}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (!validationResult) {
                      handleValidate()
                    } else if (validationResult.isValid && !checkInResult) {
                      handleCheckIn()
                    }
                  }
                }}
              />
              {!validationResult && (
                <Button onClick={handleValidate} disabled={isValidating || !cardNumber.trim()}>
                  {isValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Format: XXXX-XXXX-XXXX-XXXX (16 digits)
            </p>
          </div>

          {/* Validation Result */}
          {validationResult && !checkInResult && (
            <div className={cn(
              "p-4 rounded-lg border",
              validationResult.isValid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            )}>
              {validationResult.isValid ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Patient Found</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Name:</span> {validationResult.patientName}</p>
                    <p><span className="text-muted-foreground">Service:</span> {validationResult.serviceName}</p>
                  </div>
                  <Button onClick={handleCheckIn} disabled={isCheckingIn} className="w-full">
                    {isCheckingIn ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Confirm Check-in
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  <span>{validationResult.message || "Invalid card number"}</span>
                </div>
              )}
            </div>
          )}

          {/* Check-in Result */}
          {checkInResult && (
            <div className={cn(
              "p-4 rounded-lg border animate-in fade-in",
              checkInResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            )}>
              <div className="flex items-center gap-2">
                {checkInResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-700" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-700" />
                )}
                <span className={checkInResult.success ? "text-green-700" : "text-red-700"}>
                  {checkInResult.message || (checkInResult.success ? "Check-in successful!" : "Check-in failed")}
                </span>
              </div>
              {checkInResult.success && checkInResult.patientName && (
                <p className="text-sm text-green-600 mt-2">
                  Welcome, {checkInResult.patientName}!
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCheckingIn}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}