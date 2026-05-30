'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Star,
  StarOff,
  ThumbsUp,
  Calendar,
  MessageSquare,
  ChevronRight,
  Edit2,
  Trash2,
  FileText,
  RefreshCw,
  Filter,
  X
} from 'lucide-react';
import { useReview } from '@/hooks/useReview';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getRatingLabel, getRatingColor } from '@/types/entities/review.types';

// Get current patient ID
const getCurrentPatientId = (): number => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('currentPatientId');
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) return parsed;
    }
  }
  return 201; // Default patient ID
};

// Star Rating Component
const StarRating = ({ rating, onRatingChange, readonly = false, size = 'md' }: {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          className={cn(
            'transition-all',
            !readonly && 'cursor-pointer hover:scale-110',
            readonly && 'cursor-default'
          )}
          disabled={readonly}
        >
          <Star
            className={cn(
              sizeClasses[size],
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-300',
              !readonly && 'hover:text-yellow-400'
            )}
          />
        </button>
      ))}
    </div>
  );
};

// Review Card Component
const ReviewCard = ({
  review,
  onEdit,
  onDelete
}: {
  review: any;
  onEdit: (review: any) => void;
  onDelete: (review: any) => void;
}) => {
  const formattedDate = new Date(review.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const providerTypeLabels: Record<string, string> = {
    doctor: 'Doctor',
    clinic: 'Clinic',
    diagnostic_center: 'Diagnostic Center'
  };

  return (
    <Card className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {/* Provider Avatar */}
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#006767] to-[#008282] flex items-center justify-center text-white font-bold text-lg">
              {review.provider?.name?.charAt(0) || 'P'}
            </div>

            <div>
              <CardTitle className="text-lg">
                {review.provider?.name || 'Provider'}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {providerTypeLabels[review.provider?.provider_type] || 'Provider'}
                </Badge>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{formattedDate}</span>
              </CardDescription>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(review)}
              className="h-8 w-8 p-0"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(review)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <StarRating rating={review.rating} readonly size="md" />
          <span className="text-sm font-medium text-gray-700">
            {getRatingLabel(review.rating)}
          </span>
        </div>

        {review.comment && (
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t border-gray-100 pt-3 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3" />
          <span>Reviewed: {formattedDate}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

// Review Form Dialog
const ReviewFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  initialData?: { rating: number; comment: string };
  isEditing: boolean;
}) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [comment, setComment] = useState(initialData?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    await onSubmit(rating, comment);
    setIsSubmitting(false);
    onOpenChange(false);
    setRating(0);
    setComment('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Your Review' : 'Write a Review'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update your rating and feedback for this provider'
              : 'Share your experience with this healthcare provider'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-4">
              <StarRating rating={rating} onRatingChange={setRating} size="lg" />
              {rating > 0 && (
                <span className="text-sm font-medium text-gray-700">
                  {getRatingLabel(rating)}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Your Review (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Share details about your experience with this provider..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="bg-[#006767] hover:bg-[#008282]"
          >
            {isSubmitting
              ? isEditing ? 'Updating...' : 'Submitting...'
              : isEditing ? 'Update Review' : 'Submit Review'
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Delete Confirmation Dialog
const DeleteConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  review
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  review: any;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Review</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete your review for {review?.provider?.name}?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Main Page Component
export default function PatientReviewsPage() {
  const [patientId, setPatientId] = useState<number>(201);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [deletingReview, setDeletingReview] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [tempRatingFilter, setTempRatingFilter] = useState<number | null>(null);

  const {
    reviews,
    patientStats,
    isLoading,
    fetchReviewsByPatient,
    updateReview,
    deleteReview,
  } = useReview();

  // Load patient ID and fetch reviews
  useMemo(() => {
    const id = getCurrentPatientId();
    setPatientId(id);
  }, []);

  // Fetch reviews when patientId changes
  const loadReviews = useCallback(async () => {
    if (patientId) {
      await fetchReviewsByPatient(patientId);
    }
  }, [patientId, fetchReviewsByPatient]);

  // Filter reviews by rating
  const filteredReviews = useMemo(() => {
    if (!tempRatingFilter) return reviews;
    return reviews.filter(r => r.rating === tempRatingFilter);
  }, [reviews, tempRatingFilter]);

  const handleEdit = (review: any) => {
    setEditingReview(review);
    setIsFormOpen(true);
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

  const handleRefresh = async () => {
    await loadReviews();
    toast.success('Reviews refreshed');
  };

  const ratingStats = useMemo(() => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  }, [reviews]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  if (isLoading && reviews.length === 0) {
    return <LoadingState message="Loading your reviews..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <PageHeader
          title="My Reviews"
          subtitle="Manage your reviews for healthcare providers"
          actions={
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="rounded-xl"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          }
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{reviews.length}</p>
                <p className="text-sm text-gray-500">Total Reviews</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <p className="text-3xl font-bold text-gray-900">{averageRating}</p>
                </div>
                <p className="text-sm text-gray-500">Average Rating</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">
                  {patientStats?.average_rating_given?.toFixed(1) || '0.0'}
                </p>
                <p className="text-sm text-gray-500">Your Avg Rating Given</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Distribution */}
        {reviews.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[5, 4, 3, 2, 1].map(star => {
                const count = ratingStats[star as keyof typeof ratingStats];
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium">{star}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', getRatingColor(star))}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm text-gray-500">{count}</div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-lg"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            {tempRatingFilter && (
              <Badge className="bg-[#006767] text-white">
                Rating: {tempRatingFilter}★
                <button
                  onClick={() => setTempRatingFilter(null)}
                  className="ml-2 hover:text-gray-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Showing {filteredReviews.length} of {reviews.length} reviews
          </p>
        </div>

        {/* Rating Filter Dialog */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-sm">Filter by Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {[5, 4, 3, 2, 1].map(star => (
                  <Button
                    key={star}
                    variant={tempRatingFilter === star ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTempRatingFilter(tempRatingFilter === star ? null : star)}
                    className={tempRatingFilter === star ? 'bg-[#006767]' : ''}
                  >
                    {star} ★
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTempRatingFilter(null)}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <ReviewCard
                key={review.review_id}
                review={review}
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
              message={tempRatingFilter ? `No ${tempRatingFilter}-star reviews` : "No reviews yet"}
              submessage={
                tempRatingFilter
                  ? `You haven't written any ${tempRatingFilter}-star reviews`
                  : "You haven't written any reviews yet"
              }
              actionLabel="View Providers"
              actionHref="/patient/providers"
            />
          )}
        </div>
      </div>

      {/* Edit Review Dialog */}
      <ReviewFormDialog
        open={isFormOpen && !!editingReview}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingReview(null);
        }}
        onSubmit={handleUpdateReview}
        initialData={
          editingReview
            ? { rating: editingReview.rating, comment: editingReview.comment }
            : undefined
        }
        isEditing={true}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDeleteReview}
        review={deletingReview}
      />
    </div>
  );
}