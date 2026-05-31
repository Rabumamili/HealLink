// components/reviews/WriteReviewDialog.tsx - Create this new file
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface WriteReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providerName: string;
  serviceName?: string;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className="transition-all hover:scale-110 focus:outline-none"
        >
          <Star
            className={cn(
              'h-8 w-8 transition-all',
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-300 hover:fill-yellow-200 hover:text-yellow-200'
            )}
          />
        </button>
      ))}
    </div>
  );
};

const ratingLabels: Record<number, string> = {
  1: 'Poor - Unsatisfactory experience',
  2: 'Fair - Needs improvement',
  3: 'Good - Average experience',
  4: 'Very Good - Satisfied with service',
  5: 'Excellent - Great experience!',
};

export function WriteReviewDialog({ open, onOpenChange, providerName, serviceName, onSubmit }: WriteReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    setIsSubmitting(true);
    await onSubmit(rating, comment);
    setIsSubmitting(false);
    setRating(0);
    setComment('');
  };

  const handleClose = () => {
    onOpenChange(false);
    setRating(0);
    setComment('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">Write a Review</DialogTitle>
          <DialogDescription className="text-slate-500">
            Share your experience with {providerName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {serviceName && (
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <p className="text-sm text-slate-600">
                Service: <span className="font-medium text-slate-800">{serviceName}</span>
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Your Rating</Label>
            <StarRating rating={rating} onRatingChange={setRating} />
            {rating > 0 && (
              <p className="text-xs text-slate-500 mt-1">
                {ratingLabels[rating]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment" className="text-slate-700 font-medium">Your Review (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="What was your experience like? What did you like or dislike?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="rounded-xl border-slate-200 focus:border-[#008282] focus:ring-[#008282] resize-none"
            />
            <p className="text-xs text-slate-400">
              Your feedback helps other patients make informed decisions about their healthcare.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={handleClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="bg-[#008282] hover:bg-[#00a0a0] rounded-xl"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}