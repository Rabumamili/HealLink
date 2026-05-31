// app/diagnostic-center/notifications/page.tsx (Fixed imports)
'use client';

import React, { useEffect, useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { NotificationFiltersComponent } from '@/components/notifications/NotificationFilters'; // Add this import
import { FlaskConical, FileText, Calendar, DollarSign, Bell, Filter, RefreshCw, AlertTriangle } from 'lucide-react';

export default function DiagnosticCenterNotificationsPage() {
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
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
    loadRecipientNotifications(1, 'diagnostic_center', 20, 0); // Replace 1 with actual diagnostic center ID
    loadStats(1);
    loadBadge(1);
  }, [loadRecipientNotifications, loadStats, loadBadge]);

  const priorityNotifications = {
    urgent: notifications.filter(n => n.priority === 'URGENT'),
    high: notifications.filter(n => n.priority === 'HIGH'),
    medium: notifications.filter(n => n.priority === 'MEDIUM'),
    low: notifications.filter(n => n.priority === 'LOW'),
  };

  const quickActions = [
    { label: 'Results Ready', count: notifications.filter(n => n.type === 'RESULT_READY').length, icon: FileText, color: 'green' },
    { label: 'Preparation Instructions', count: notifications.filter(n => n.type === 'PREPARATION_INSTRUCTION').length, icon: Calendar, color: 'blue' },
    { label: 'Urgent Results', count: notifications.filter(n => n.priority === 'URGENT' && n.type === 'RESULT_READY').length, icon: AlertTriangle, color: 'red' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FlaskConical className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Diagnostic Center Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => loadRecipientNotifications(1, 'diagnostic_center', 20, 0)}
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
                <p className="text-sm text-gray-600">Results Ready</p>
                <p className="text-2xl font-bold text-green-600">{stats?.diagnosticNotifications || 0}</p>
              </div>
              <FileText className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-red-600">{stats?.urgentPriority || 0}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Payments</p>
                <p className="text-2xl font-bold text-purple-600">{stats?.paymentNotifications || 0}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {quickActions.map((action) => (
            <button
              key={action.label}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{action.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{action.count}</p>
                </div>
                <action.icon className={`w-8 h-8 text-${action.color}-500`} />
              </div>
            </button>
          ))}
        </div>

        {/* Priority Sections */}
        <div className="space-y-6">
          {/* Urgent Section */}
          {priorityNotifications.urgent.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h2 className="text-lg font-semibold text-gray-900">Urgent</h2>
                <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  {priorityNotifications.urgent.length}
                </span>
              </div>
              <div className="space-y-3">
                {priorityNotifications.urgent.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markRead}
                    onMarkAsUnread={markUnread}
                    onDelete={deleteNotification}
                  />
                ))}
              </div>
            </div>
          )}

          {/* High Priority Section */}
          {priorityNotifications.high.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-gray-900">High Priority</h2>
                <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                  {priorityNotifications.high.length}
                </span>
              </div>
              <div className="space-y-3">
                {priorityNotifications.high.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markRead}
                    onMarkAsUnread={markUnread}
                    onDelete={deleteNotification}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other Notifications */}
          {(priorityNotifications.medium.length > 0 || priorityNotifications.low.length > 0) && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Other Notifications</h2>
              </div>
              <div className="space-y-3">
                {[...priorityNotifications.medium, ...priorityNotifications.low].map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markRead}
                    onMarkAsUnread={markUnread}
                    onDelete={deleteNotification}
                  />
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {!isLoading && notifications.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
              <p className="text-gray-500 mt-1">All caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}