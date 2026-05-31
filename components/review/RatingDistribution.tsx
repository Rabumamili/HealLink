// components/review/RatingDistribution.tsx (fixed)
'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingDistributionProps {
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  totalReviews: number;
}

const ratingColors: Record<number, string> = {
  5: 'bg-emerald-500',
  4: 'bg-green-500',
  3: 'bg-yellow-500',
  2: 'bg-orange-500',
  1: 'bg-red-500'
};

export function RatingDistribution({ distribution, totalReviews }: RatingDistributionProps) {
  // Convert to array for easier iteration
  const stars = [5, 4, 3, 2, 1] as const;
  
  return (
    <div className="space-y-3">
      {stars.map((star) => {
        const count = distribution[star] || 0;
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        
        return (
          <div key={star} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-16">
              <span className="text-sm font-medium text-slate-700">{star}</span>
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="flex-1">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-300", ratingColors[star])}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            <div className="w-12 text-sm font-medium text-slate-600">{count}</div>
            <div className="w-12 text-xs text-slate-400">{percentage.toFixed(0)}%</div>
          </div>
        );
      })}
    </div>
  );
}