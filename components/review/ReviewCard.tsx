// components/review/ReviewCard.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StarRating } from "./StarRating"
import { Edit2, Trash2, MapPin, Calendar, Stethoscope, Building2, FlaskConical } from "lucide-react"

interface ReviewCardProps {
  review: {
    id: number
    patientName?: string
    providerName?: string
    providerType?: 'doctor' | 'clinic' | 'diagnostic_center'
    specialty?: string
    location?: string
    created_at?: string
    rating: number
    comment: string
  }
  showProvider?: boolean
  showPatient?: boolean
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
  actions?: boolean
}

const providerTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  doctor: Stethoscope,
  clinic: Building2,
  diagnostic_center: FlaskConical,
}

const providerTypeLabels: Record<string, string> = {
  doctor: "Doctor",
  clinic: "Clinic",
  diagnostic_center: "Diagnostic Center",
}

const getInitials = (name: string): string => {
  if (!name) return "U"
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function ReviewCard({ review, showProvider = true, showPatient = false, onEdit, onDelete, actions = true }: ReviewCardProps) {
  const ProviderIcon = providerTypeIcons[review.providerType || 'clinic']
  const displayName = showProvider ? review.providerName : review.patientName
  const displayRole = showProvider ? providerTypeLabels[review.providerType || 'clinic'] : "Patient"

  if (!displayName) return null

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              <ProviderIcon className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
              <div>
                <h3 className="font-semibold">{displayName}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">{displayRole}</Badge>
                  {review.specialty && <span>{review.specialty}</span>}
                </div>
              </div>
              {actions && (onEdit || onDelete) && (
                <div className="flex items-center gap-2">
                  {onEdit && (
                    <Button variant="ghost" size="icon" onClick={() => onEdit(review.id)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(review.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-3">
              <StarRating rating={review.rating} />
            </div>
            
            <p className="mt-3 text-sm text-foreground">{review.comment}</p>
            
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              {review.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {review.location}
                </span>
              )}
              {review.created_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}