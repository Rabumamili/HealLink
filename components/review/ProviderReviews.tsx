// components/review/WriteReviewDialog.tsx
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
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StarRating } from "./StarRating"
import { Stethoscope, Building2, FlaskConical } from "lucide-react"

interface PendingProvider {
  id: string
  name: string
  providerType: "doctor" | "clinic" | "diagnostic_center"
  specialty: string
  service: string
  visitDate: string
  location: string
}

interface WriteReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  provider: PendingProvider | null
  onSubmit: (rating: number, comment: string) => Promise<boolean>
}

const providerTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  doctor: Stethoscope,
  clinic: Building2,
  diagnostic_center: FlaskConical,
}

export function WriteReviewDialog({ open, onOpenChange, provider, onSubmit }: WriteReviewDialogProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return
    
    setIsSubmitting(true)
    const success = await onSubmit(rating, comment)
    setIsSubmitting(false)
    
    if (success) {
      handleReset()
      onOpenChange(false)
    }
  }

  const handleReset = () => {
    setRating(0)
    setComment("")
  }

  if (!provider) return null

  const ProviderIcon = providerTypeIcons[provider.providerType]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience with {provider.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                <ProviderIcon className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{provider.name}</p>
              <p className="text-sm text-muted-foreground">{provider.service}</p>
              <p className="text-xs text-muted-foreground">{provider.visitDate}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Rating</label>
            <div className="flex justify-center py-2">
              <StarRating rating={rating} onRatingChange={setRating} interactive size="large" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Review</label>
            <Textarea
              placeholder="Tell others about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={rating === 0 || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}