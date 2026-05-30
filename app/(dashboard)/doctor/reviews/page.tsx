'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Star,
  StarHalf,
  Calendar,
  User,
  MessageSquare,
  ChevronLeft,
  RefreshCw,
  Filter,
  X,
  TrendingUp,
  Award,
  Stethoscope,
  Clock,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { useReview } from '@/hooks/useReview';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getRatingLabel, getRatingColor } from '@/types/entities/review.types';

// Get current doctor ID
const getCurrentDoctorId = (): number => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('currentDoctorId');
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) return parsed;
    }
  }
  return 101; // Default doctor ID
};

// Star Rating Display
const StarRatingDisplay = ({ rating, size = 'md', showCount = false, totalReviews = 0 }: {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  totalReviews?: number;
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={cn(sizeClasses[size], 'fill-yellow-400 text-yellow-400')} />
        ))}
        {hasHalfStar && (
          <StarHalf className={cn(sizeClasses[size], 'fill-yellow-400 text-yellow-400')} />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={cn(sizeClasses[size], 'text-gray-300')} />
        ))}
      </div>
      <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
      {showCount && totalReviews > 0 && (
        <span className="text-sm text-gray-500">({totalReviews} reviews)</span>
      )}
    </div>
  );
};

// Review Card for Doctor View
const DoctorReviewCard = ({ review }: { review: any }) => {
  const formattedDate = new Date(review.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {/* Patient Avatar */}
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white text-lg">
              {getInitials(review.patient?.first_name || '', review.patient?.last_name || '')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 className="font-semibold text-gray-900 text-lg">
                  {review.patient?.first_name} {review.patient?.last_name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <StarRatingDisplay rating={review.rating} size="sm" />
                  <span className="text-xs text-gray-500">{formattedDate}</span>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                Verified Patient
              </Badge>
            </div>

            {review.comment && (
              <div className="mt-4 rounded-lg bg-gray-50 p-4">
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Rating Distribution Component
const RatingDistribution = ({ distribution, totalReviews }: {
  distribution: Record<number, number>;
  totalReviews: number;
}) => {
  return (
    <div className="space-y-3">
      {[5, 4, 3, 2, 1].map(star => {
        const count = distribution[star] || 0;
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        
        return (
          <div key={star} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-16">
              <span className="text-sm font-medium">{star}</span>
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="flex-1">
              <Progress value={percentage} className="h-2 bg-gray-100" />
            </div>
            <div className="w-12 text-sm text-gray-600">{count}</div>
            <div className="w-12 text-xs text-gray-400">{percentage.toFixed(0)}%</div>
          </div>
        );
      })}
    </div>
  );
};

// Main Page Component
export default function DoctorReviewsPage() {
  const router = useRouter();
  const [doctorId, setDoctorId] = useState<number>(101);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'positive' | 'critical'>('all');

  const {
    fetchReviewsByProvider,
    fetchProviderStats,
    providerStats,
    reviews,
    isLoading
  } = useReview();

  // Load doctor ID
  useEffect(() => {
    const id = getCurrentDoctorId();
    setDoctorId(id);
  }, []);

  // Fetch reviews for this doctor
  const loadData = useCallback(async () => {
    if (doctorId) {
      await Promise.all([
        fetchReviewsByProvider(doctorId),
        fetchProviderStats(doctorId)
      ]);
    }
  }, [doctorId, fetchReviewsByProvider, fetchProviderStats]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
    toast.success('Reviews refreshed');
  };

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    let filtered = [...reviews];
    
    // Apply rating filter
    if (ratingFilter) {
      filtered = filtered.filter(r => r.rating === ratingFilter);
    }
    
    // Apply tab filter
    if (activeTab === 'positive') {
      filtered = filtered.filter(r => r.rating >= 4);
    } else if (activeTab === 'critical') {
      filtered = filtered.filter(r => r.rating <= 3);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
    }
    
    return filtered;
  }, [reviews, ratingFilter, sortBy, activeTab]);

  // Calculate rating distribution
  const ratingDistribution = useMemo(() => {
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  }, [reviews]);

  const averageRating = providerStats?.average_rating || 0;
  const totalReviews = providerStats?.total_reviews || 0;

  // Sentiment analysis
  const positiveReviews = reviews.filter(r => r.rating >= 4).length;
  const neutralReviews = reviews.filter(r => r.rating === 3).length;
  const negativeReviews = reviews.filter(r => r.rating <= 2).length;
  
  const positivePercentage = totalReviews > 0 ? (positiveReviews / totalReviews) * 100 : 0;
  const recommendationRate = totalReviews > 0 ? (positiveReviews / totalReviews) * 100 : 0;

  if (isLoading && reviews.length === 0) {
    return <LoadingState message="Loading your reviews..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 -ml-2 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <PageHeader
          title="Patient Reviews"
          subtitle={`See what your patients are saying about your care`}
          actions={
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="rounded-xl border-gray-200"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          }
        />

        {/* Doctor Info Card */}
        <Card className="mb-6 bg-gradient-to-r from-teal-600 to-cyan-600 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{providerStats?.provider_name || 'Doctor'}</h2>
                  <p className="text-teal-100 text-sm">Medical Professional</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{totalReviews}</p>
                  <p className="text-teal-100 text-sm">Total Reviews</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <StarRatingDisplay rating={averageRating} size="md" />
                  </div>
                  <p className="text-teal-100 text-sm">Average Rating</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Recommendation Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{recommendationRate.toFixed(0)}%</p>
                </div>
                <ThumbsUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Positive Reviews</p>
                  <p className="text-2xl font-bold text-green-600">{positiveReviews}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <ThumbsUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Neutral Reviews</p>
                  <p className="text-2xl font-bold text-yellow-600">{neutralReviews}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Needs Improvement</p>
                  <p className="text-2xl font-bold text-red-600">{negativeReviews}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <ThumbsDown className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Distribution & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Rating Distribution</CardTitle>
              <CardDescription>Breakdown of all patient ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <RatingDistribution distribution={ratingDistribution} totalReviews={totalReviews} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Key Insights</CardTitle>
              <CardDescription>Summary of patient feedback</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Patient Satisfaction</span>
                  <span className="font-medium">{positivePercentage.toFixed(0)}%</span>
                </div>
                <Progress value={positivePercentage} className="h-2 bg-gray-100" />
              </div>
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span className="text-gray-600">
                    {averageRating >= 4.8 ? 'Exceptional Care Provider' :
                     averageRating >= 4.5 ? 'Highly Rated by Patients' :
                     averageRating >= 4.0 ? 'Trusted Healthcare Professional' :
                     'Building Patient Trust'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-lg border-gray-200"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            {ratingFilter && (
              <Badge className="bg-teal-600 text-white">
                Rating: {ratingFilter}★
                <button
                  onClick={() => setRatingFilter(null)}
                  className="ml-2 hover:text-gray-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>

          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-[180px] rounded-lg border-gray-200">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Rated</SelectItem>
              <SelectItem value="lowest">Lowest Rated</SelectItem>
            </SelectContent>
          </Select>
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
                    variant={ratingFilter === star ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setRatingFilter(ratingFilter === star ? null : star)}
                    className={ratingFilter === star ? 'bg-teal-600 hover:bg-teal-700' : 'border-gray-200'}
                  >
                    {star} ★ ({ratingDistribution[star] || 0})
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRatingFilter(null)}
                  className="text-gray-500"
                >
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-6">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="all" className="data-[state=active]:bg-white">
              All Reviews ({filteredReviews.length})
            </TabsTrigger>
            <TabsTrigger value="positive" className="data-[state=active]:bg-white">
              Positive (4-5★)
            </TabsTrigger>
            <TabsTrigger value="critical" className="data-[state=active]:bg-white">
              Critical (1-3★)
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <DoctorReviewCard key={review.review_id} review={review} />
            ))
          ) : (
            <EmptyState
              variant="review"
              message="No reviews found"
              submessage={
                ratingFilter 
                  ? `No ${ratingFilter}-star reviews available`
                  : activeTab === 'positive'
                  ? "No positive reviews yet"
                  : activeTab === 'critical'
                  ? "No critical reviews"
                  : "You don't have any patient reviews yet"
              }
              actionLabel="Share Profile"
              actionHref="/doctor/profile"
            />
          )}
        </div>
      </div>
    </div>
  );
}