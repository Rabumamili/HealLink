// components/review/StarRating.tsx
"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  interactive?: boolean
  size?: "default" | "large"
  className?: string
}

export function StarRating({ 
  rating, 
  onRatingChange, 
  interactive = false,
  size = "default",
  className
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)
  
  const getRatingLabel = (rating: number): string => {
    switch (rating) {
      case 5: return "Excellent!"
      case 4: return "Very Good"
      case 3: return "Good"
      case 2: return "Fair"
      case 1: return "Poor"
      default: return ""
    }
  }
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            className={interactive ? "cursor-pointer" : "cursor-default"}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && onRatingChange?.(star)}
          >
            <Star 
              className={cn(
                size === "large" ? "h-8 w-8" : "h-5 w-5",
                star <= (hoverRating || rating) 
                  ? "fill-yellow-400 text-yellow-400" 
                  : "text-muted-foreground/30 fill-muted-foreground/30"
              )} 
            />
          </button>
        ))}
      </div>
      {interactive && hoverRating > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          {getRatingLabel(hoverRating)}
        </p>
      )}
    </div>
  )
}