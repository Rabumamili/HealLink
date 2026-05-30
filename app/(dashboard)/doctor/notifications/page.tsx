// app/doctor/notifications/page.tsx (Fixed imports)
'use client';

import React, { useEffect, useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { NotificationFiltersComponent } from '@/components/notifications/NotificationFilters'; // Add this import
import { Calendar, Users, DollarSign, FileText, Bell, Filter, RefreshCw } from 'lucide-react';

export default function DoctorNotificationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    notifications,
    isLoading,
    total,
    filters,
    unreadCount,
    stats,
    markRead,
    markUnread,
    deleteNotification,
    loadRecipientNotifications,
    loadStats,
    updateFilters,
    resetFilters,
    loadBadge,
  } = useNotifications();

  useEffect(() => {
    loadRecipientNotifications(1, 'doctor', 20, 0); // Replace 1 with actual doctor ID
    loadStats(1);
    loadBadge(1);
  }, [loadRecipientNotifications, loadStats, loadBadge]);

  const categories = [
    { id: 'all', name: 'All', icon: Bell, count: total },
    { id: 'appointments', name: 'Appointments', icon: Calendar, count: stats?.appointmentNotifications || 0 },
    { id: 'patients', name: 'Patients', icon: Users, count: 0 },
    { id: 'payments', name: 'Payments', icon: DollarSign, count: stats?.paymentNotifications || 0 },
    { id: 'results', name: 'Results', icon: FileText, count: stats?.diagnosticNotifications || 0 },
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'appointments') return notification.type.includes('APPOINTMENT');
    if (selectedCategory === 'payments') return notification.type.includes('PAYMENT');
    if (selectedCategory === 'results') return notification.type === 'RESULT_READY';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Doctor Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => loadRecipientNotifications(1, 'doctor', 20, 0)}
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Notifications</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-red-600">{stats?.unread || 0}</p>
              </div>
              <Bell className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.appointmentNotifications || 0}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-orange-600">{stats?.urgentPriority || 0}</p>
              </div>
              <Bell className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span>{category.name}</span>
              {category.count !== undefined && category.count > 0 && (
                <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                  selectedCategory === category.id
                    ? 'bg-white text-blue-600'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {category.count}
                </span>
              )}
            </button>
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
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
            <p className="text-gray-500 mt-1">No notifications in this category</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
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