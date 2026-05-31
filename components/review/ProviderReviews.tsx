// components/reviews/ProviderReviewCard.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from './StarRating';
import { Calendar, MessageSquare, Building2, Stethoscope, FlaskConical, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProviderReviewCardProps {
  review: {
    review_id?: number;
    id?: number;
    rating: number;
    comment?: string;
    created_at: string;
    provider?: {
      name: string;
      provider_type: string;
    };
    patient?: {
      first_name: string;
      last_name: string;
    };
    service_name?: string;
  };
  variant?: 'clinic' | 'diagnostic' | 'doctor' | 'patient';
  showActions?: boolean;
  onEdit?: (review: any) => void;
  onDelete?: (review: any) => void;
  isPast?: boolean;
}

const providerIcons = {
  doctor: Stethoscope,
  clinic: Building2,
  diagnostic_center: FlaskConical,
};

const providerColors = {
  doctor: 'from-teal-500 to-cyan-500',
  clinic: 'from-[#008282] to-[#00a0a0]',
  diagnostic_center: 'from-violet-500 to-indigo-500',
  patient: 'from-blue-500 to-cyan-500',
};

export function ProviderReviewCard({ review, variant = 'clinic', showActions = false, onEdit, onDelete, isPast = false }: ProviderReviewCardProps) {
  const formattedDate = new Date(review.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getInitials = () => {
    if (variant === 'patient' && review.provider) {
      return review.provider.name?.charAt(0) || 'P';
    }
    if (review.patient) {
      return `${review.patient.first_name?.charAt(0) || ''}${review.patient.last_name?.charAt(0) || ''}`.toUpperCase();
    }
    return 'U';
  };

  const getName = () => {
    if (variant === 'patient' && review.provider) {
      return review.provider.name;
    }
    if (review.patient) {
      return `${review.patient.first_name} ${review.patient.last_name}`;
    }
    return 'Anonymous';
  };

  const getProviderTypeLabel = () => {
    if (variant === 'patient' && review.provider) {
      const types: Record<string, string> = {
        doctor: 'Doctor',
        clinic: 'Clinic',
        diagnostic_center: 'Diagnostic Center'
      };
      return types[review.provider.provider_type] || 'Provider';
    }
    return null;
  };

  const Icon = variant !== 'patient' && review.provider ? providerIcons[review.provider.provider_type as keyof typeof providerIcons] : null;
  const gradient = variant !== 'patient' && review.provider ? providerColors[review.provider.provider_type as keyof typeof providerColors] : providerColors.patient;

  return (
    <Card className={cn(
      "border-slate-200 shadow-sm hover:shadow-md transition-all duration-200",
      isPast && "opacity-75"
    )}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 rounded-xl">
            <AvatarFallback className={cn('bg-gradient-to-br text-white text-lg', gradient)}>
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 className="font-semibold text-slate-800 text-lg">{getName()}</h4>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <StarRating rating={review.rating} size="sm" readonly />
                  <span className="text-xs text-slate-400">{formattedDate}</span>
                  {getProviderTypeLabel() && (
                    <>
                      <span className="text-xs text-slate-300">•</span>
                      <Badge variant="outline" className="text-xs bg-[#008282]/5 text-[#008282] border-[#008282]/10">
                        {getProviderTypeLabel()}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
              {showActions && (
                <div className="flex gap-2">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(review)}
                      className="h-8 w-8 p-0 text-slate-500 hover:text-[#008282]"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(review)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {review.comment && (
              <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-100">
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-700 text-sm leading-relaxed">{review.comment}</p>
                </div>
              </div>
            )}

            {review.service_name && (
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="h-3 w-3" />
                <span>Service: {review.service_name}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}