// app/clinic/notifications/page.tsx (Fixed version)
'use client';

import React, { useEffect, useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { NotificationFiltersComponent } from '@/components/notifications/NotificationFilters'; // Add this import
import { Building2, Calendar, DollarSign, Users, Bell, Filter, RefreshCw, TrendingUp } from 'lucide-react';

export default function ClinicNotificationsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    notifications,
    isLoading,
    total,
    filters,
    unreadCount,
    stats,
    summary,
    markRead,
    markUnread,
    deleteNotification,
    loadRecipientNotifications,
    loadStats,
    loadSummary,
    updateFilters,
    resetFilters,
    loadBadge,
  } = useNotifications();

  useEffect(() => {
    loadRecipientNotifications(1, 'clinic', 20, 0); // Replace 1 with actual clinic ID
    loadStats(1);
    loadSummary(1);
    loadBadge(1);
  }, [loadRecipientNotifications, loadStats, loadSummary, loadBadge]);

  const getTimeRangeFilter = () => {
    const now = new Date();
    if (timeRange === 'week') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      return { startDate: weekAgo.toISOString().split('T')[0] };
    }
    if (timeRange === 'month') {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      return { startDate: monthAgo.toISOString().split('T')[0] };
    }
    return {};
  };

  useEffect(() => {
    updateFilters(getTimeRangeFilter());
  }, [timeRange, updateFilters]); // Add updateFilters to dependency array

  const getIconColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'text-blue-500',
      red: 'text-red-500',
      green: 'text-green-500',
      purple: 'text-purple-500',
      orange: 'text-orange-500',
      yellow: 'text-yellow-500',
    };
    return colors[color] || 'text-gray-500';
  };

  const statsCards = [
    { label: 'Total', value: stats?.total || 0, icon: Bell, color: 'blue' },
    { label: 'Unread', value: stats?.unread || 0, icon: Bell, color: 'red' },
    { label: 'Appointments', value: stats?.appointmentNotifications || 0, icon: Calendar, color: 'green' },
    { label: 'Payments', value: stats?.paymentNotifications || 0, icon: DollarSign, color: 'purple' },
    { label: 'Patients', value: stats?.reviewNotifications || 0, icon: Users, color: 'orange' },
    { label: 'Urgent', value: stats?.urgentPriority || 0, icon: TrendingUp, color: 'yellow' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Clinic Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setTimeRange('week')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    timeRange === 'week' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setTimeRange('month')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    timeRange === 'month' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setTimeRange('all')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    timeRange === 'all' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
              </div>
              <button
                onClick={() => loadRecipientNotifications(1, 'clinic', 20, 0)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 transition-colors ${
                  showFilters ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Summary Banner */}
          {summary && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-blue-800">Today's Notifications</p>
                  <p className="text-2xl font-bold text-blue-900">{summary.todayNotifications}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-800">Urgent</p>
                  <p className="text-2xl font-bold text-red-600">{summary.urgentNotifications}</p>
                </div>
                {summary.latestNotification && (
                  <div className="text-right">
                    <p className="text-sm text-blue-800">Latest</p>
                    <p className="text-sm text-blue-900 truncate max-w-xs">
                      {summary.latestNotification.title}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {statsCards.map((stat) => (
            <div key={stat.label} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`w-6 h-6 ${getIconColor(stat.color)}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-6">
            <NotificationFiltersComponent
              filters={filters}
              onFilterChange={updateFilters}
              onReset={resetFilters}
            />
          </div>
        )}

        {/* Notifications List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
            <p className="text-gray-500 mt-1">No notifications for this time period</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={markRead}
                onMarkAsUnread={markUnread}
                onDelete={deleteNotification}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}