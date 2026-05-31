// app/(dashboard)/staff/dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GradientHeader } from '@/components/common/GradientHeader';
import { 
  FlaskConical, 
  Calendar, 
  Users, 
  Activity, 
  ArrowRight, 
  CheckCircle, 
  CreditCard, 
  Clock, 
  FileText,
  Loader2,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

// Mock user data (will be replaced with actual auth)
const MOCK_USER = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  role: 'staff',
  staff_sub_role: 'lab assistant', // or 'card_checker'
  employer_id: 1,
  employer_type: 'clinic',
  profile_photo: null,
  is_active: true
};

export default function StaffDashboardPage() {
  const router = useRouter();
  const { profile, loading: profileLoading, loadStaffProfile } = useProfile({ autoFetch: false });
  
  // Use mock user data (replace with actual auth later)
  const user = MOCK_USER;
  const isLabAssistant = user?.staff_sub_role === 'lab assistant';
  const isCardChecker = user?.staff_sub_role === 'card_checker';

  const [stats, setStats] = useState({
    todayCheckIns: 0,
    pendingResults: 0,
    inProgressResults: 0,
    readyResults: 0,
    collectedResults: 0,
    queueCount: 0,
    totalAppointments: 0,
    completionRate: 0
  });

  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(true);

  // Load profile on mount
  useEffect(() => {
    if (user?.id) {
      loadStaffProfile();
    }
  }, [user?.id]);

  // Get display name (for welcome message only)
  const getDisplayName = () => {
    if (profile && 'first_name' in profile) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return `${user?.first_name} ${user?.last_name}`;
  };

  // Get role display name
  const getRoleDisplayName = () => {
    if (isLabAssistant) return 'Lab Assistant';
    if (isCardChecker) return 'Card Checker';
    return 'Staff Member';
  };

  // Get role-specific welcome message
  const getWelcomeMessage = () => {
    if (isLabAssistant) {
      return 'Manage diagnostic test results and lab operations';
    }
    if (isCardChecker) {
      return 'Verify patient cards and manage check-ins';
    }
    return 'Manage your daily tasks and patient interactions';
  };

  // Get employer display text
  const getEmployerDisplayText = () => {
    const employerTypeMap: Record<string, string> = {
      doctor: "Doctor's Office",
      clinic: 'Clinic',
      diagnostic_center: 'Diagnostic Center'
    };
    return employerTypeMap[user?.employer_type || 'clinic'] || 'Healthcare Facility';
  };

  // Get role-specific metrics
  const getRoleSpecificMetrics = () => {
    if (isLabAssistant) {
      return [
        {
          label: 'Pending Results',
          value: stats.pendingResults,
          icon: Clock,
          color: 'bg-amber-50 text-amber-600',
          change: '+12%',
          trend: 'up'
        },
        {
          label: 'In Progress',
          value: stats.inProgressResults,
          icon: Activity,
          color: 'bg-blue-50 text-blue-600',
          change: '+5%',
          trend: 'up'
        },
        {
          label: 'Ready for Collection',
          value: stats.readyResults,
          icon: CheckCircle,
          color: 'bg-emerald-50 text-emerald-600',
          change: '+8%',
          trend: 'up'
        },
        {
          label: 'Collected',
          value: stats.collectedResults,
          icon: FileText,
          color: 'bg-slate-50 text-slate-600',
          change: '+15%',
          trend: 'up'
        }
      ];
    }
    
    if (isCardChecker) {
      return [
        {
          label: "Today's Check-ins",
          value: stats.todayCheckIns,
          icon: CreditCard,
          color: 'bg-emerald-50 text-emerald-600',
          change: '+18%',
          trend: 'up'
        },
        {
          label: 'Queue Count',
          value: stats.queueCount,
          icon: Users,
          color: 'bg-purple-50 text-purple-600',
          change: '-5%',
          trend: 'down'
        },
        {
          label: 'Total Appointments',
          value: stats.totalAppointments,
          icon: Calendar,
          color: 'bg-blue-50 text-blue-600',
          change: '+10%',
          trend: 'up'
        },
        {
          label: 'Completion Rate',
          value: `${stats.completionRate}%`,
          icon: TrendingUp,
          color: 'bg-green-50 text-green-600',
          change: '+3%',
          trend: 'up'
        }
      ];
    }
    
    return [
      {
        label: 'Total Tasks',
        value: stats.todayCheckIns + stats.pendingResults,
        icon: Activity,
        color: 'bg-slate-50 text-slate-600',
        change: '+8%',
        trend: 'up'
      }
    ];
  };

  // Define quick actions based on staff sub-role
  const getQuickActions = () => {
    if (isLabAssistant) {
      return [
        {
          title: 'Diagnostic Results',
          description: 'Update test result status for patients',
          icon: FlaskConical,
          href: '/staff/results',
          color: 'bg-purple-50 text-purple-600',
          gradient: 'from-purple-50 to-white'
        },
        {
          title: 'Patient Check-in',
          description: 'Verify and check in patients',
          icon: CreditCard,
          href: '/staff/checkin',
          color: 'bg-emerald-50 text-emerald-600',
          gradient: 'from-emerald-50 to-white'
        },
        {
          title: 'Lab Queue',
          description: 'Manage lab tests and processing',
          icon: Activity,
          href: '/staff/lab/queue',
          color: 'bg-indigo-50 text-indigo-600',
          gradient: 'from-indigo-50 to-white'
        },
        {
          title: "Today's Schedule",
          description: 'View all appointments',
          icon: Calendar,
          href: '/staff/schedule',
          color: 'bg-blue-50 text-blue-600',
          gradient: 'from-blue-50 to-white'
        }
      ];
    }
    
    if (isCardChecker) {
      return [
        {
          title: 'Patient Check-in',
          description: 'Enter card numbers to check in patients',
          icon: CreditCard,
          href: '/staff/checkin',
          color: 'bg-emerald-50 text-emerald-600',
          gradient: 'from-emerald-50 to-white'
        },
        {
          title: 'Patient Queue',
          description: 'Manage waiting patients and queue',
          icon: Users,
          href: '/staff/queue',
          color: 'bg-amber-50 text-amber-600',
          gradient: 'from-amber-50 to-white'
        },
        {
          title: "Today's Schedule",
          description: 'View all appointments for today',
          icon: Calendar,
          href: '/staff/schedule',
          color: 'bg-blue-50 text-blue-600',
          gradient: 'from-blue-50 to-white'
        },
        {
          title: 'Verify Documents',
          description: 'Verify patient insurance and documents',
          icon: CheckCircle,
          href: '/staff/verify',
          color: 'bg-green-50 text-green-600',
          gradient: 'from-green-50 to-white'
        }
      ];
    }
    
    return [
      {
        title: 'Dashboard',
        description: 'View your dashboard',
        icon: Activity,
        href: '/staff/dashboard',
        color: 'bg-slate-50 text-slate-600',
        gradient: 'from-slate-50 to-white'
      }
    ];
  };

  const quickActions = getQuickActions();
  const roleSpecificMetrics = getRoleSpecificMetrics();

  // Fetch stats based on role
  useEffect(() => {
    fetchStats();
    fetchRecentActivities();
  }, [isLabAssistant]);

  const fetchStats = async () => {
    setIsStatsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isLabAssistant) {
        setStats({
          ...stats,
          pendingResults: 8,
          inProgressResults: 5,
          readyResults: 12,
          collectedResults: 45,
          queueCount: 3
        });
      } else if (isCardChecker) {
        setStats({
          ...stats,
          todayCheckIns: 28,
          queueCount: 6,
          totalAppointments: 42,
          completionRate: 94
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setIsStatsLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    setIsActivitiesLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (isLabAssistant) {
        setRecentActivities([
          {
            id: 1,
            type: 'result_ready',
            message: 'Blood Test results ready for John Smith',
            timestamp: new Date().toISOString(),
            status: 'ready'
          },
          {
            id: 2,
            type: 'result_updated',
            message: 'Urine Analysis marked as in progress',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            status: 'in_progress'
          },
          {
            id: 3,
            type: 'checkin',
            message: 'Patient checked in for X-Ray',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            status: 'completed'
          }
        ]);
      } else if (isCardChecker) {
        setRecentActivities([
          {
            id: 1,
            type: 'checkin',
            message: 'Sarah Johnson checked in for appointment',
            timestamp: new Date().toISOString(),
            status: 'verified'
          },
          {
            id: 2,
            type: 'checkin',
            message: 'Michael Brown checked in for lab test',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            status: 'verified'
          },
          {
            id: 3,
            type: 'appointment',
            message: 'New appointment scheduled with Dr. Smith',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            status: 'pending'
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setIsActivitiesLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'checkin':
        return { icon: CreditCard, bg: 'bg-emerald-100', color: 'text-emerald-600' };
      case 'result_updated':
        return { icon: FlaskConical, bg: 'bg-purple-100', color: 'text-purple-600' };
      case 'result_ready':
        return { icon: CheckCircle, bg: 'bg-green-100', color: 'text-green-600' };
      case 'appointment':
        return { icon: Calendar, bg: 'bg-blue-100', color: 'text-blue-600' };
      default:
        return { icon: Activity, bg: 'bg-slate-100', color: 'text-slate-600' };
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-amber-100 text-amber-700',
      in_progress: 'bg-blue-100 text-blue-700',
      verified: 'bg-emerald-100 text-emerald-700',
      ready: 'bg-green-100 text-green-700'
    };
    return variants[status] || 'bg-slate-100 text-slate-700';
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-32 w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header - No profile dropdown here anymore */}
        <div className="mb-6">
          <GradientHeader
            title={`Welcome, ${getDisplayName()}!`}
            description={getWelcomeMessage()}
            icon={<Users className="h-5 w-5" />}
          />
        </div>

        {/* Role Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Badge className="bg-[#008282]/10 text-[#008282] border-0 px-3 py-1">
            {getRoleDisplayName()}
          </Badge>
          <Badge variant="outline" className="text-slate-500 px-3 py-1">
            {getEmployerDisplayText()}
          </Badge>
          <Badge variant="outline" className="bg-slate-50 text-slate-500 px-3 py-1">
            ID: {user?.id}
          </Badge>
        </div>

        {/* Role-Specific Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {roleSpecificMetrics.map((metric, index) => (
            <Card key={index} className="border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">{metric.label}</p>
                    {isStatsLoading ? (
                      <Skeleton className="h-8 w-16 mt-1" />
                    ) : (
                      <p className="text-3xl font-bold text-slate-800 mt-1">{metric.value}</p>
                    )}
                    {metric.change && (
                      <p className={cn(
                        "text-xs mt-1 flex items-center gap-1",
                        metric.trend === 'up' ? "text-emerald-600" : "text-red-600"
                      )}>
                        {metric.change} from yesterday
                      </p>
                    )}
                  </div>
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", metric.color)}>
                    <metric.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className={cn(
                  "border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group h-full",
                  "bg-gradient-to-br",
                  action.gradient
                )}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", action.color)}>
                          <action.icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-slate-800">{action.title}</h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{action.description}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-[#008282] transition-colors mt-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-slate-800 flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#008282]" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isActivitiesLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32 mt-2" />
                    </div>
                    <Skeleton className="w-16 h-6 rounded-full" />
                  </div>
                ))}
              </div>
            ) : recentActivities.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">No recent activity</p>
                <p className="text-sm text-slate-400 mt-1">
                  {isLabAssistant 
                    ? "Recent test result updates will appear here"
                    : "Recent check-ins and verifications will appear here"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentActivities.map((activity, index) => {
                  const { icon: Icon, bg, color } = getActivityIcon(activity.type);
                  return (
                    <div key={index} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", bg)}>
                        <Icon className={cn("h-5 w-5", color)} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{activity.message}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {activity.status && (
                        <Badge className={cn("rounded-full", getStatusBadge(activity.status))}>
                          {activity.status.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role-Specific Tips */}
        <Card className="mt-6 bg-gradient-to-r from-[#008282]/5 to-transparent border-[#008282]/10">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#008282]/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-[#008282]" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Quick Tips</h3>
                {isLabAssistant ? (
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Use the Diagnostic Results page to update test statuses</li>
                    <li>• Upload result files when marking tests as "Ready"</li>
                    <li>• Monitor the lab queue for pending tests</li>
                    <li>• Ensure timely processing of urgent tests</li>
                  </ul>
                ) : isCardChecker ? (
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Use the Patient Check-in page to verify and check in patients</li>
                    <li>• Monitor the queue for waiting patients</li>
                    <li>• Verify insurance documents before check-in</li>
                    <li>• Direct patients to their respective service areas</li>
                  </ul>
                ) : (
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Complete your assigned tasks in a timely manner</li>
                    <li>• Communicate with your team for efficient workflow</li>
                    <li>• Update your profile information as needed</li>
                  </ul>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}