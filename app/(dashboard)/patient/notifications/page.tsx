// app/patient/notifications/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useNotifications, useNotificationPreferences } from '@/hooks/useNotifications';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { NotificationFiltersComponent } from '@/components/notifications/NotificationFilters';
import { NotificationPreferencesComponent } from '@/components/notifications/NotificationPreferences';
import { Bell, Settings, Filter, RefreshCw } from 'lucide-react';

export default function PatientNotificationsPage() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'preferences'>('inbox');
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    notifications,
    isLoading,
    total,
    filters,
    unreadCount,
    markRead,
    markUnread,
    deleteNotification,
    loadRecipientNotifications,
    updateFilters,
    resetFilters,
    loadBadge,
  } = useNotifications();

  const {
    preferences,
    isLoading: preferencesLoading,
    updatePreference,
  } = useNotificationPreferences(1, 'patient'); // Replace 1 with actual patient ID

  useEffect(() => {
    // Load notifications for patient with ID 1
    loadRecipientNotifications(1, 'patient', 20, 0);
    loadBadge(1);
  }, [loadRecipientNotifications, loadBadge]);

  const handleRefresh = () => {
    loadRecipientNotifications(1, 'patient', 20, 0);
    loadBadge(1);
  };

  const handleMarkAllRead = async () => {
    // Implement mark all as read
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 transition-colors ${
                  showFilters ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Filters"
              >
                <Filter className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveTab(activeTab === 'inbox' ? 'preferences' : 'inbox')}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'inbox'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Inbox
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'preferences'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Preferences
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'inbox' ? (
          <>
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

            {/* Quick Actions */}
            {unreadCount > 0 && (
              <div className="mb-4 flex justify-end">
                <button
                  onClick={handleMarkAllRead}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark all as read
                </button>
              </div>
            )}

            {/* Notifications List */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
                <p className="text-gray-500 mt-1">You're all caught up!</p>
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

            {/* Pagination */}
            {total > 20 && (
              <div className="mt-6 flex justify-center">
                <div className="flex gap-2">
                  <button className="px-3 py-1 border rounded-md hover:bg-gray-50">Previous</button>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
                  <button className="px-3 py-1 border rounded-md hover:bg-gray-50">2</button>
                  <button className="px-3 py-1 border rounded-md hover:bg-gray-50">3</button>
                  <button className="px-3 py-1 border rounded-md hover:bg-gray-50">Next</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <NotificationPreferencesComponent
            preferences={preferences!}
            onUpdate={updatePreference}
            isLoading={preferencesLoading}
          />
        )}
      </div>
    </div>
  );
}