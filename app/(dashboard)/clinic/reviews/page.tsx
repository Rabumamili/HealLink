// app/(dashboard)/clinic/reviews/page.tsx
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
  Building2,
  TrendingUp,
  Award,
  Users,
  Calendar
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
  id: number;
  patient_id: number;
  provider_id: number;
  appointment_id: number;
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

const getCurrentClinicId = (): number | null => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('currentClinicId');
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) return parsed;
    }
  }
  return null;
};

export default function ClinicReviewsPage() {
  const router = useRouter();
  const [clinicId, setClinicId] = useState<number | null>(null);
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
    const id = getCurrentClinicId();
    if (id !== null) {
      setClinicId(id);
    }
  }, []);

  const loadData = useCallback(async () => {
    if (clinicId) {
      await Promise.all([
        fetchReviewsByProvider(clinicId),
        fetchProviderStats(clinicId)
      ]);
    }
  }, [clinicId, fetchReviewsByProvider, fetchProviderStats]);

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

  const averageRating = (providerStats as any)?.average_rating || 0;
  const totalReviews = (providerStats as any)?.total_reviews || 0;
  const positiveReviews = reviews.filter((r: Review) => r.rating >= 4).length;
  const positivePercentage = totalReviews > 0 ? (positiveReviews / totalReviews) * 100 : 0;

  if (isLoading && reviews.length === 0) {
    return <LoadingState message="Loading clinic reviews..." />;
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
          title="Clinic Reviews"
          description="Patient feedback about your clinic's services and care quality."
          icon={<Building2 className="h-5 w-5" />}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        {/* Clinic Info Card */}
        <Card className="mb-6 bg-gradient-to-r from-[#008282] to-[#00a0a0] text-white border-0">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{(providerStats as any)?.provider_name || 'Clinic'}</h2>
                  <p className="text-[#008282]/20 text-sm">Healthcare Facility</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{totalReviews}</p>
                  <p className="text-white/80 text-sm">Total Reviews</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <StarRating rating={averageRating} size="md" readonly />
                  </div>
                  <p className="text-white/80 text-sm">Average Rating</p>
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
                  <p className="text-sm text-slate-500">Patient Satisfaction</p>
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
                  <p className="text-sm text-slate-500">5-Star Reviews</p>
                  <p className="text-2xl font-bold text-yellow-600">{ratingDistribution[5] || 0}</p>
                </div>
                <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Patients</p>
                  <p className="text-2xl font-bold text-slate-800">{totalReviews}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Recommendation</p>
                  <p className="text-2xl font-bold text-[#008282]">{positivePercentage.toFixed(0)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-[#008282]" />
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
              <CardTitle className="text-base text-slate-800">Service Quality Metrics</CardTitle>
              <CardDescription className="text-slate-500">Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Overall Satisfaction</span>
                  <span className="font-medium text-slate-800">{positivePercentage.toFixed(0)}%</span>
                </div>
                <Progress value={positivePercentage} className="h-2 bg-slate-100" />
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-yellow-500" />
                <span className="text-slate-600">
                  {averageRating >= 4.5 ? 'Top Rated Clinic in the Area' :
                   averageRating >= 4.0 ? 'Highly Recommended by Patients' :
                   'Actively Improving Patient Experience'}
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
              <Badge className="bg-[#008282] text-white rounded-full">
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-6">
          <TabsList className="bg-slate-100 rounded-xl">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#008282] rounded-lg"
            >
              All Reviews ({filteredReviews.length})
            </TabsTrigger>
            <TabsTrigger 
              value="positive" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#008282] rounded-lg"
            >
              Positive (4-5★)
            </TabsTrigger>
            <TabsTrigger 
              value="critical" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#008282] rounded-lg"
            >
              Needs Attention (1-3★)
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review: Review) => (
              <ProviderReviewCard
                key={review.id}
                review={review}
                variant="clinic"
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
                  : "Your clinic hasn't received any patient reviews yet"
              }
              actionLabel="Share Clinic Profile"
              actionHref="/clinic/profile"
            />
          )}
        </div>
      </div>
    </div>
  );
}