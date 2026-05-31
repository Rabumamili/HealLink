// app/(dashboard)/patient/reviews/page.tsx - Fixed with consistent width and gradient header

'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Star,
  Edit2,
  Trash2,
  Filter,
  X,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';
import { useReview } from '@/hooks/useReview';
import { StarRating } from '@/components/review/StarRating';
import { RatingDistribution } from '@/components/review/RatingDistribution';
import { ProviderReviewCard } from '@/components/review/ProviderReviews';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { StatsCard } from '@/components/common/StatsCard';

// Types
interface Review {
  review_id: number;
  rating: number;
  comment: string;
  created_at: string;
  provider?: {
    name: string;
    provider_type: string;
  };
  service_name?: string;
}

interface RatingDistributionType {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

const getCurrentPatientId = (): number => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('currentPatientId');
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) return parsed;
    }
  }
  return 201;
};

// Gradient Header Component
function GradientHeader({ title, description, icon }: { title: string; description: string; icon?: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#008282] to-[#00a0a0] mb-8">
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
      <div className="absolute right-10 top-10 h-32 w-32 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-white/50 to-white/20" />
      
      <div className="relative px-6 py-6 md:px-8 md:py-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
                  <div className="h-5 w-5 text-white">{icon}</div>
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">{title}</h1>
            </div>
            <p className="text-white/80 text-sm md:text-base max-w-2xl ml-12">{description}</p>
          </div>
          <div className="flex-shrink-0 ml-12 md:ml-0">
            <Button
              variant="outline"
              onClick={async () => {
                // Refresh logic
                toast.success('Reviews refreshed');
              }}
              className="rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Review Edit Form Dialog
const EditReviewDialog = ({
  open,
  onOpenChange,
  review,
  onSave
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: Review | null;
  onSave: (rating: number, comment: string) => Promise<void>;
}) => {
  const [rating, setRating] = useState(review?.rating || 0);
  const [comment, setComment] = useState(review?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    setIsSubmitting(true);
    await onSave(rating, comment);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  if (!review) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">Edit Your Review</DialogTitle>
          <DialogDescription className="text-slate-500">
            Update your rating and feedback for {review.provider?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-slate-700">Rating</Label>
            <StarRating rating={rating} onRatingChange={setRating} size="lg" showLabel />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment" className="text-slate-700">Your Review (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Share details about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="rounded-xl border-slate-200 focus:border-[#008282] focus:ring-[#008282]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="bg-[#008282] hover:bg-[#00a0a0] rounded-xl"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Delete Confirmation Dialog
const DeleteReviewDialog = ({
  open,
  onOpenChange,
  review,
  onConfirm
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: Review | null;
  onConfirm: () => Promise<void>;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
    onOpenChange(false);
  };

  if (!review) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-slate-800">Delete Review</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500">
            Are you sure you want to delete your review for {review.provider?.name}?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 rounded-xl"
          >
            {isDeleting ? 'Deleting...' : 'Delete Review'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default function PatientReviewsPage() {
  const [patientId, setPatientId] = useState<number>(201);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    reviews,
    isLoading,
    fetchReviewsByPatient,
    updateReview,
    deleteReview,
  } = useReview();

  useEffect(() => {
    const id = getCurrentPatientId();
    setPatientId(id);
  }, []);

  const loadReviews = useCallback(async () => {
    if (patientId) {
      await fetchReviewsByPatient(patientId);
    }
  }, [patientId, fetchReviewsByPatient]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadReviews();
    setIsRefreshing(false);
    toast.success('Reviews refreshed');
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setIsEditOpen(true);
  };

  const handleUpdateReview = async (rating: number, comment: string) => {
    if (!editingReview) return;
    const success = await updateReview(editingReview.review_id, { rating, comment });
    if (success) {
      toast.success('Review updated successfully');
      await loadReviews();
    } else {
      toast.error('Failed to update review');
    }
    setEditingReview(null);
  };

  const handleDeleteReview = async () => {
    if (!deletingReview) return;
    const success = await deleteReview(deletingReview.review_id);
    if (success) {
      toast.success('Review deleted successfully');
      await loadReviews();
    } else {
      toast.error('Failed to delete review');
    }
    setDeletingReview(null);
  };

  const filteredReviews = useMemo(() => {
    if (!ratingFilter) return reviews;
    return reviews.filter((r: Review) => r.rating === ratingFilter);
  }, [reviews, ratingFilter]);

  const ratingDistribution = useMemo(() => {
    const distribution: RatingDistributionType = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review: Review) => {
      const rating = review.rating as 1 | 2 | 3 | 4 | 5;
      distribution[rating]++;
    });
    return distribution;
  }, [reviews]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc: number, r: Review) => acc + r.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  const positiveCount = useMemo(() => {
    return reviews.filter((r: Review) => r.rating >= 4).length;
  }, [reviews]);

  if (isLoading && reviews.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#008282]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GradientHeader
          title="My Reviews"
          description="View and manage all your reviews for healthcare providers you've visited."
          icon={<MessageSquare className="h-5 w-5" />}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatsCard
            title="Total Reviews"
            value={reviews.length}
            icon={<MessageSquare className="h-5 w-5" />}
            description="Reviews written"
            variant="default"
          />
          <StatsCard
            title="Average Rating"
            value={averageRating.toFixed(1)}
            icon={<Star className="h-5 w-5" />}
            description="Your average rating given"
            variant="primary"
          />
          <StatsCard
            title="Positive Reviews"
            value={positiveCount}
            icon={<ThumbsUp className="h-5 w-5" />}
            description="4-5 star ratings"
            variant="success"
          />
        </div>

        {/* Rating Distribution */}
        {reviews.length > 0 && (
          <Card className="border-slate-200 shadow-sm mb-6">
            <CardHeader>
              <CardTitle className="text-base text-slate-800">Your Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <RatingDistribution distribution={ratingDistribution} totalReviews={reviews.length} />
            </CardContent>
          </Card>
        )}

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-xl border-slate-200"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            {ratingFilter && (
              <Badge className="bg-[#008282] text-white rounded-full">
                {ratingFilter}★
                <button onClick={() => setRatingFilter(null)} className="ml-2 hover:text-white/80">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500">
            Showing {filteredReviews.length} of {reviews.length} reviews
          </p>
        </div>

        {/* Filter Dialog */}
        {showFilters && (
          <Card className="border-slate-200 shadow-sm mb-6">
            <CardHeader>
              <CardTitle className="text-sm text-slate-800">Filter by Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {[5, 4, 3, 2, 1].map(star => (
                  <Button
                    key={star}
                    variant={ratingFilter === star ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setRatingFilter(ratingFilter === star ? null : star)}
                    className={cn(
                      'rounded-xl',
                      ratingFilter === star && 'bg-[#008282] hover:bg-[#00a0a0]'
                    )}
                  >
                    {star} ★ ({ratingDistribution[star as keyof RatingDistributionType] || 0})
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRatingFilter(null)}
                  className="rounded-xl"
                >
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review: Review) => (
              <ProviderReviewCard
                key={review.review_id}
                review={review}
                variant="patient"
                showActions={true}
                onEdit={handleEdit}
                onDelete={(review) => {
                  setDeletingReview(review);
                  setIsDeleteOpen(true);
                }}
              />
            ))
          ) : (
            <EmptyState
              variant="review"
              title="No Reviews Yet"
              message={ratingFilter ? `No ${ratingFilter}-star reviews` : "You haven't written any reviews"}
              submessage={
                ratingFilter
                  ? `You haven't written any ${ratingFilter}-star reviews yet`
                  : "Share your experience with healthcare providers you've visited"
              }
              actionLabel="Find Providers"
              actionHref="/patient/providers"
            />
          )}
        </div>

        {/* Info Card */}
        <Card className="mt-6 bg-[#008282]/5 border-[#008282]/10">
          <CardContent className="p-5">
            <h3 className="font-semibold text-slate-800 text-sm mb-2">Why Your Reviews Matter</h3>
            <div className="space-y-1.5 text-xs text-slate-600">
              <p>Your feedback helps other patients make informed decisions about their healthcare.</p>
              <p>Reviews also help providers improve their services and patient care quality.</p>
              <p>You can only review providers you've had appointments with.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <EditReviewDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        review={editingReview}
        onSave={handleUpdateReview}
      />

      {/* Delete Dialog */}
      <DeleteReviewDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        review={deletingReview}
        onConfirm={handleDeleteReview}
      />
    </div>
  );
}