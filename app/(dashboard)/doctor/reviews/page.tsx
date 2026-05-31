// app/(dashboard)/doctor/reviews/page.tsx
'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Star,
  ChevronLeft,
  Filter,
  X,
  MessageSquare,
  ThumbsUp,
  Stethoscope,
  TrendingUp,
  Award,
  Users,
  Calendar,
  ThumbsDown
} from 'lucide-react';
import { useReview } from '@/hooks/useReview';
import { ReviewHeader } from '@/components/review/ReviewHeader';
import { StarRating } from '@/components/review/StarRating';
import { RatingDistribution } from '@/components/review/RatingDistribution';
import { ProviderReviewCard } from '@/components/review/ProviderReviews';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Types
interface Review {
  review_id: number;
  rating: number;
  comment: string;
  created_at: string;
  patient?: {
    first_name: string;
    last_name: string;
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

interface ProviderStats {
  provider_name: string;
  average_rating: number;
  total_reviews: number;
}

const getCurrentDoctorId = (): number => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('currentDoctorId');
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) return parsed;
    }
  }
  return 101;
};

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

  useEffect(() => {
    const id = getCurrentDoctorId();
    setDoctorId(id);
  }, []);

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

  const filteredReviews = useMemo(() => {
    let filtered = [...reviews] as Review[];
    
    if (ratingFilter) {
      filtered = filtered.filter(r => r.rating === ratingFilter);
    }
    
    if (activeTab === 'positive') {
      filtered = filtered.filter(r => r.rating >= 4);
    } else if (activeTab === 'critical') {
      filtered = filtered.filter(r => r.rating <= 3);
    }
    
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

  const ratingDistribution = useMemo(() => {
    const distribution: RatingDistributionType = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review: Review) => {
      const rating = review.rating as 1 | 2 | 3 | 4 | 5;
      distribution[rating]++;
    });
    return distribution;
  }, [reviews]);

  const averageRating = (providerStats as ProviderStats)?.average_rating || 0;
  const totalReviews = (providerStats as ProviderStats)?.total_reviews || 0;
  const positiveReviews = reviews.filter((r: Review) => r.rating >= 4).length;
  const neutralReviews = reviews.filter((r: Review) => r.rating === 3).length;
  const negativeReviews = reviews.filter((r: Review) => r.rating <= 2).length;
  const positivePercentage = totalReviews > 0 ? (positiveReviews / totalReviews) * 100 : 0;

  if (isLoading && reviews.length === 0) {
    return <LoadingState message="Loading your reviews..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 -ml-2 text-slate-600 hover:text-slate-900"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <ReviewHeader
          title="Patient Reviews"
          description="See what your patients are saying about your care, professionalism, and bedside manner."
          icon={<Stethoscope className="h-5 w-5" />}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        {/* Doctor Info Card */}
        <Card className="mb-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{(providerStats as ProviderStats)?.provider_name || 'Doctor'}</h2>
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
                    <StarRating rating={averageRating} size="md" readonly />
                  </div>
                  <p className="text-teal-100 text-sm">Average Rating</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Recommendation Rate</p>
                  <p className="text-2xl font-bold text-slate-800">{positivePercentage.toFixed(0)}%</p>
                </div>
                <ThumbsUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Positive Reviews</p>
                  <p className="text-2xl font-bold text-green-600">{positiveReviews}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <ThumbsUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Neutral Reviews</p>
                  <p className="text-2xl font-bold text-yellow-600">{neutralReviews}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Needs Improvement</p>
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
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-slate-800">Rating Distribution</CardTitle>
              <CardDescription className="text-slate-500">Breakdown of all patient ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <RatingDistribution distribution={ratingDistribution} totalReviews={totalReviews} />
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-slate-800">Key Insights</CardTitle>
              <CardDescription className="text-slate-500">Summary of patient feedback</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Patient Satisfaction</span>
                  <span className="font-medium text-slate-800">{positivePercentage.toFixed(0)}%</span>
                </div>
                <Progress value={positivePercentage} className="h-2 bg-slate-100" />
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-yellow-500" />
                <span className="text-slate-600">
                  {averageRating >= 4.8 ? 'Exceptional Care Provider' :
                   averageRating >= 4.5 ? 'Highly Rated by Patients' :
                   averageRating >= 4.0 ? 'Trusted Healthcare Professional' :
                   'Building Patient Trust'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Bar */}
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
              <Badge className="bg-teal-600 text-white rounded-full">
                {ratingFilter}★
                <button onClick={() => setRatingFilter(null)} className="ml-2 hover:text-white/80">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>

          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-[180px] rounded-xl border-slate-200">
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
                      ratingFilter === star && 'bg-teal-600 hover:bg-teal-700'
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-6">
          <TabsList className="bg-slate-100 rounded-xl">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-white data-[state=active]:text-teal-600 rounded-lg"
            >
              All Reviews ({filteredReviews.length})
            </TabsTrigger>
            <TabsTrigger 
              value="positive" 
              className="data-[state=active]:bg-white data-[state=active]:text-teal-600 rounded-lg"
            >
              Positive (4-5★)
            </TabsTrigger>
            <TabsTrigger 
              value="critical" 
              className="data-[state=active]:bg-white data-[state=active]:text-teal-600 rounded-lg"
            >
              Critical (1-3★)
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review: Review) => (
              <ProviderReviewCard
                key={review.review_id}
                review={review}
                variant="doctor"
              />
            ))
          ) : (
            <EmptyState
              variant="review"
              title="No Reviews Yet"
              message={ratingFilter ? `No ${ratingFilter}-star reviews` : "No patient reviews found"}
              submessage={
                ratingFilter
                  ? `No ${ratingFilter}-star reviews available`
                  : activeTab === 'positive'
                  ? "No positive reviews yet"
                  : activeTab === 'critical'
                  ? "No critical reviews"
                  : "You haven't received any patient reviews yet"
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