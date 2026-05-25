"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Star, 
  Edit2, 
  Trash2,
  MapPin,
  Calendar,
  MessageSquare,
  Stethoscope,
  Building2,
  FlaskConical
} from "lucide-react"

interface Review {
  id: string
  provider: string
  providerType: "doctor" | "clinic" | "diagnostic"
  specialty: string
  location: string
  date: string
  rating: number
  comment: string
}

interface PendingReview {
  id: string
  provider: string
  providerType: "doctor" | "clinic" | "diagnostic"
  specialty: string
  location: string
  visitDate: string
  service: string
}

const myReviews: Review[] = [
  {
    id: "1",
    provider: "Dr. Sara Tesfaye",
    providerType: "doctor",
    specialty: "Cardiologist",
    location: "Black Lion Hospital",
    date: "May 5, 2026",
    rating: 5,
    comment: "Excellent doctor! Very thorough examination and took time to explain my condition clearly. Highly recommend for cardiac care.",
  },
  {
    id: "2",
    provider: "Addis Diagnostic Center",
    providerType: "diagnostic",
    specialty: "Laboratory",
    location: "Megenagna",
    date: "April 28, 2026",
    rating: 4,
    comment: "Quick and professional service. Results were ready on time. The facility was clean and staff were helpful.",
  },
  {
    id: "3",
    provider: "Bethel Clinic",
    providerType: "clinic",
    specialty: "General Practice",
    location: "Bole",
    date: "April 15, 2026",
    rating: 4,
    comment: "Good overall experience. Wait time was a bit long but the care provided was excellent.",
  },
]

const pendingReviews: PendingReview[] = [
  {
    id: "1",
    provider: "Dr. Yonas Bekele",
    providerType: "doctor",
    specialty: "Dermatologist",
    location: "Kazanchis",
    visitDate: "May 8, 2026",
    service: "Skin Consultation",
  },
  {
    id: "2",
    provider: "St. Gabriel Hospital",
    providerType: "clinic",
    specialty: "Multi-specialty",
    location: "Arat Kilo",
    visitDate: "May 3, 2026",
    service: "General Checkup",
  },
]

const providerTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  doctor: Stethoscope,
  clinic: Building2,
  diagnostic: FlaskConical,
}

const providerTypeLabels: Record<string, string> = {
  doctor: "Doctor",
  clinic: "Clinic",
  diagnostic: "Diagnostic Center",
}

function StarRating({ 
  rating, 
  onRatingChange, 
  interactive = false,
  size = "default"
}: { 
  rating: number
  onRatingChange?: (rating: number) => void
  interactive?: boolean
  size?: "default" | "large"
}) {
  const [hoverRating, setHoverRating] = useState(0)
  
  return (
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
            className={`${size === "large" ? "h-8 w-8" : "h-5 w-5"} ${
              star <= (hoverRating || rating) 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-muted-foreground/30 fill-muted-foreground/30"
            }`} 
          />
        </button>
      ))}
    </div>
  )
}

function WriteReviewDialog({ 
  provider, 
  onClose,
  onSuccess 
}: { 
  provider: PendingReview
  onClose: () => void
  onSuccess: () => void
}) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call to submit review
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    onSuccess()
    onClose()
  }

  const ProviderIcon = providerTypeIcons[provider.providerType]

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogDescription>
          Share your experience with {provider.provider}
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
            <p className="font-medium">{provider.provider}</p>
            <p className="text-sm text-muted-foreground">{provider.service}</p>
            <p className="text-xs text-muted-foreground">{provider.visitDate}</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Your Rating</label>
          <div className="flex justify-center py-2">
            <StarRating rating={rating} onRatingChange={setRating} interactive size="large" />
          </div>
          {rating > 0 && (
            <p className="text-center text-sm text-muted-foreground">
              {rating === 5 ? "Excellent!" : 
               rating === 4 ? "Very Good" : 
               rating === 3 ? "Good" : 
               rating === 2 ? "Fair" : "Poor"}
            </p>
          )}
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
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={rating === 0 || isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(myReviews)
  const [pending, setPending] = useState(pendingReviews)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<PendingReview | null>(null)

  const handleReviewSubmitted = () => {
    // Remove the pending review after submission
    if (selectedProvider) {
      setPending(pending.filter(p => p.id !== selectedProvider.id))
    }
  }

  const handleDeleteReview = (reviewId: string) => {
    setReviews(reviews.filter(r => r.id !== reviewId))
  }

  const handleEditReview = (reviewId: string) => {
    // In a real app, this would open an edit dialog
    console.log("Edit review:", reviewId)
  }

  return (

      
      <div className="p-4 lg:p-8 space-y-6">
        <Tabs defaultValue="my-reviews">
          <TabsList>
            <TabsTrigger value="my-reviews">My Reviews</TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              Pending
              {pending.length > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5 bg-primary/10 text-primary">
                  {pending.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-reviews" className="mt-6 space-y-4">
            {reviews.map((review) => {
              const ProviderIcon = providerTypeIcons[review.providerType]
              return (
                <Card key={review.id}>
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
                            <h3 className="font-semibold">{review.provider}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline">{providerTypeLabels[review.providerType]}</Badge>
                              <span>{review.specialty}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditReview(review.id)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive"
                              onClick={() => handleDeleteReview(review.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <StarRating rating={review.rating} />
                        </div>
                        
                        <p className="mt-3 text-sm text-foreground">{review.comment}</p>
                        
                        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {review.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {review.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {reviews.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-semibold text-lg">No reviews yet</h3>
                  <p className="text-muted-foreground mt-1">
                    Your reviews will appear here after you rate providers
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="mt-6 space-y-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Help others find great healthcare</CardTitle>
                <CardDescription>
                  Share your experience with providers you have recently visited. Your reviews help other patients make informed decisions.
                </CardDescription>
              </CardHeader>
            </Card>

            {pending.map((item) => {
              const ProviderIcon = providerTypeIcons[item.providerType]
              return (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <Avatar className="h-14 w-14">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          <ProviderIcon className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.provider}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{providerTypeLabels[item.providerType]}</Badge>
                          <span>{item.specialty}</span>
                          <span>•</span>
                          <span>{item.service}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Visited on {item.visitDate} at {item.location}
                        </p>
                      </div>
                      <Dialog open={reviewDialogOpen && selectedProvider?.id === item.id} onOpenChange={(open) => {
                        setReviewDialogOpen(open)
                        if (!open) setSelectedProvider(null)
                      }}>
                        <DialogTrigger asChild>
                          <Button onClick={() => setSelectedProvider(item)}>
                            Write Review
                          </Button>
                        </DialogTrigger>
                        {selectedProvider && (
                          <WriteReviewDialog 
                            provider={selectedProvider} 
                            onClose={() => {
                              setReviewDialogOpen(false)
                              setSelectedProvider(null)
                            }}
                            onSuccess={handleReviewSubmitted}
                          />
                        )}
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {pending.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-semibold text-lg">All caught up!</h3>
                  <p className="text-muted-foreground mt-1">
                    You have reviewed all your recent visits
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Info Card about Reviews */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">About Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Your reviews help other patients make informed decisions about their healthcare providers.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Reviews can be edited or deleted at any time</li>
              <li>All reviews are moderated for quality and authenticity</li>
              <li>You can only review providers you have actually visited</li>
              <li>Ratings range from 1 (Poor) to 5 (Excellent)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
   
  )
}