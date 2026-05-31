// components/reviews/StarRating.tsx
'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5'
};

const ratingLabels: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
};

export function StarRating({ rating, onRatingChange, readonly = false, size = 'md', showLabel = false }: StarRatingProps) {
  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
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
      {showLabel && rating > 0 && (
        <span className="text-sm font-medium text-gray-700">
          {ratingLabels[rating]}
        </span>
      )}
    </div>
  );
}