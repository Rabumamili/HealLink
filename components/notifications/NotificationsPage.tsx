'use client';

import React, { useEffect, useState } from 'react';
import {
  useNotificationInbox,
  useNotificationPreferences,
} from '@/hooks/useNotifications';
import { NotificationInboxCore } from '@/components/notifications/NotificationInboxCore';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { NotificationPreferencesComponent } from '@/components/notifications/NotificationPreferences';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { Notification, PortalLayoutRole } from '@/types/entities/notification.types';
import {
  Bell,
  Settings,
  Calendar,
  Users,
  DollarSign,
  FileText,
  TrendingUp,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react';

export type NotificationsPageVariant = 'standard' | 'doctor' | 'clinic' | 'diagnostic';

export interface NotificationsPageProps {
  layoutRole: PortalLayoutRole;
  title?: string;
  headerIcon?: LucideIcon;
  variant?: NotificationsPageVariant;
  showPreferences?: boolean;
  inboxOptions?: any;
}

export function NotificationsPage({
  layoutRole,
  title = 'Notifications',
  headerIcon: HeaderIcon = Bell,
  variant = 'standard',
  showPreferences = false,
  inboxOptions = {},
}: NotificationsPageProps) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'preferences'>('inbox');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  const loadStats = variant === 'doctor' || variant === 'clinic' || variant === 'diagnostic';
  const loadSummary = variant === 'clinic';

  const {
    recipient,
    notifications,
    isLoading,
    total,
    filters,
    unreadCount,
    stats,
    summary,
    error,
    markRead,
    markUnread,
    deleteNotification,
    updateFilters,
    resetFilters,
    reloadInbox,
    markAllRead,
    clearNotificationError,
  } = useNotificationInbox(layoutRole, {
    ...inboxOptions,
    loadStats: inboxOptions.loadStats ?? loadStats,
    loadSummary: inboxOptions.loadSummary ?? loadSummary,
  });

  const {
    preferences,
    updatePreferences: updatePreference,
  } = useNotificationPreferences();

  useEffect(() => {
    if (variant !== 'clinic') return;
    // Filter logic commented out - updateFilters is a stub in useNotificationInbox
    // const now = new Date();
    // if (timeRange === 'week') {
    //   const weekAgo = new Date(now);
    //   weekAgo.setDate(weekAgo.getDate() - 7);
    //   updateFilters({ startDate: weekAgo.toISOString().split('T')[0] });
    //   return;
    // }
    // if (timeRange === 'month') {
    //   const monthAgo = new Date(now);
    //   monthAgo.setMonth(monthAgo.getMonth() - 1);
    //   updateFilters({ startDate: monthAgo.toISOString().split('T')[0] });
    //   return;
    // }
    // updateFilters({ startDate: undefined });
  }, [timeRange, variant]);

  const filterByCategory = (list: Notification[]) => {
    // Service Notification type doesn't have 'type' property
    return list;
  };

  const priorityGroups = {
    urgent: [] as Notification[],
    high: [] as Notification[],
    medium: [] as Notification[],
    low: [] as Notification[],
  };

  const doctorCategories = [
    { id: 'all', name: 'All', icon: Bell, count: total },
    {
      id: 'appointments',
      name: 'Appointments',
      icon: Calendar,
      count: 0,
    },
    { id: 'patients', name: 'Patients', icon: Users, count: 0 },
    {
      id: 'payments',
      name: 'Payments',
      icon: DollarSign,
      count: 0,
    },
    {
      id: 'results',
      name: 'Results',
      icon: FileText,
      count: 0,
    },
  ];

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

  const clinicStatsCards = [
    { label: 'Total', value: 0, icon: Bell, color: 'blue' },
    { label: 'Unread', value: 0, icon: Bell, color: 'red' },
    {
      label: 'Appointments',
      value: 0,
      icon: Calendar,
      color: 'green',
    },
    {
      label: 'Payments',
      value: 0,
      icon: DollarSign,
      color: 'purple',
    },
    {
      label: 'Patients',
      value: 0,
      icon: Users,
      color: 'orange',
    },
    { label: 'Urgent', value: 0, icon: TrendingUp, color: 'yellow' },
  ];

  const renderPrioritySection = (
    label: string,
    items: Notification[],
    icon: LucideIcon,
    iconClass: string,
    badgeClass: string
  ) => {
    if (items.length === 0) return null;
    const Icon = icon;
    return (
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Icon className={`h-5 w-5 ${iconClass}`} />
          <h2 className="text-lg font-semibold text-gray-900">{label}</h2>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeClass}`}>
            {items.length}
          </span>
        </div>
        <div className="space-y-3">
          {items.map((notification) => (
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
    );
  };

  const inboxEmpty =
    variant === 'doctor'
      ? { title: 'No notifications', description: 'No notifications in this category' }
      : variant === 'clinic'
        ? { title: 'No notifications', description: 'No notifications for this time period' }
        : { title: 'No notifications', description: "You're all caught up!" };

  return (
    <div className="-m-4 min-h-[calc(100vh-4rem)] bg-gray-50 md:-m-6">
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <HeaderIcon className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {unreadCount > 0 && (
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {showPreferences && (
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'inbox' ? 'preferences' : 'inbox')}
                className="p-2 text-gray-600 transition-colors hover:text-gray-900"
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
            )}
          </div>

          {showPreferences && (
            <div className="flex gap-6">
              <button
                type="button"
                onClick={() => setActiveTab('inbox')}
                className={`px-1 pb-3 font-medium transition-colors ${
                  activeTab === 'inbox'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Inbox
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preferences')}
                className={`px-1 pb-3 font-medium transition-colors ${
                  activeTab === 'preferences'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Preferences
              </button>
            </div>
          )}

          {variant === 'clinic' && (
            <div className="flex justify-end gap-1 pb-4">
              {(['week', 'month', 'all'] as const).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setTimeRange(range)}
                  className={`rounded-md px-3 py-1 text-sm capitalize transition-colors ${
                    timeRange === range ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}

          {variant === 'clinic' && false && (
            <div className="mb-4 rounded-lg bg-blue-50 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-800">Today&apos;s Notifications</p>
                  <p className="text-2xl font-bold text-blue-900">0</p>
                </div>
                <div>
                  <p className="text-sm text-blue-800">Urgent</p>
                  <p className="text-2xl font-bold text-red-600">0</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === 'preferences' && showPreferences ? (
          preferences ? (
            <NotificationPreferencesComponent
              preferences={preferences}
              onUpdate={updatePreference}
            />
          ) : (
            <div className="flex h-64 items-center justify-center">
            </div>
          )
        ) : (
          <>
            {variant === 'doctor' && (
              <>
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                  <StatCard label="Total Notifications" value={0} icon={Bell} iconClass="text-blue-500" />
                  <StatCard label="Unread" value={0} icon={Bell} iconClass="text-red-500" valueClass="text-red-600" />
                  <StatCard label="Appointments" value={0} icon={Calendar} iconClass="text-green-500" />
                  <StatCard label="Urgent" value={0} icon={Bell} iconClass="text-orange-500" valueClass="text-orange-600" />
                </div>
                <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                  {doctorCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <category.icon className="h-4 w-4" />
                      <span>{category.name}</span>
                      {category.count > 0 && (
                        <span
                          className={`ml-1 rounded-full px-1.5 py-0.5 text-xs ${
                            selectedCategory === category.id
                              ? 'bg-white text-blue-600'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {category.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}

            {variant === 'clinic' && (
              <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {clinicStatsCards.map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600">{stat.label}</p>
                        <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <stat.icon className={`h-6 w-6 ${getIconColor(stat.color)}`} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {variant === 'diagnostic' && (
              <>
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                  <StatCard label="Total Notifications" value={0} icon={Bell} iconClass="text-blue-500" />
                  <StatCard label="Results Ready" value={0} icon={FileText} iconClass="text-green-500" valueClass="text-green-600" />
                  <StatCard label="Urgent" value={0} icon={AlertTriangle} iconClass="text-red-500" valueClass="text-red-600" />
                  <StatCard label="Payments" value={0} icon={DollarSign} iconClass="text-purple-500" valueClass="text-purple-600" />
                </div>
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <StatCard
                    label="Results Ready"
                    value={notifications.filter((n) => n.type === 'RESULT_READY').length}
                    icon={FileText}
                    iconClass="text-green-500"
                  />
                  <StatCard
                    label="Preparation Instructions"
                    value={notifications.filter((n) => n.type === 'PREPARATION_INSTRUCTION').length}
                    icon={Calendar}
                    iconClass="text-blue-500"
                  />
                  <StatCard
                    label="Urgent Results"
                    value={notifications.filter((n) => n.priority === 'URGENT' && n.type === 'RESULT_READY').length}
                    icon={AlertTriangle}
                    iconClass="text-red-500"
                  />
                </div>
              </>
            )}

            {variant === 'diagnostic' ? (
              <div className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Could not load notifications</AlertTitle>
                    <AlertDescription className="flex flex-wrap items-center gap-3">
                      <span>{error}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          clearNotificationError();
                          void reloadInbox();
                        }}
                      >
                        Try again
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
                {renderPrioritySection(
                  'Urgent',
                  priorityGroups.urgent,
                  AlertTriangle,
                  'text-red-600',
                  'bg-red-100 text-red-800'
                )}
                {renderPrioritySection(
                  'High Priority',
                  priorityGroups.high,
                  Bell,
                  'text-orange-600',
                  'bg-orange-100 text-orange-800'
                )}
                {(priorityGroups.medium.length > 0 || priorityGroups.low.length > 0) &&
                  renderPrioritySection(
                    'Other Notifications',
                    [...priorityGroups.medium, ...priorityGroups.low],
                    Bell,
                    'text-gray-600',
                    'bg-gray-100 text-gray-800'
                  )}
                {isLoading && (
                  <div className="flex h-32 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
                  </div>
                )}
                {!isLoading && !error && notifications.length === 0 && (
                  <div className="rounded-lg border border-gray-200 bg-white py-12 text-center">
                    <Bell className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
                    <p className="mt-1 text-gray-500">All caught up!</p>
                  </div>
                )}
                {!isLoading && unreadCount > 0 && recipient && !error && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => void markAllRead()}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Mark all as read
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NotificationInboxCore
                notifications={notifications}
                isLoading={isLoading}
                error={error}
                total={total}
                unreadCount={unreadCount}
                filters={filters}
                recipient={recipient}
                showFilters={showFilters}
                onToggleFilters={() => setShowFilters((v) => !v)}
                updateFilters={updateFilters}
                resetFilters={resetFilters}
                markRead={markRead}
                markUnread={markUnread}
                deleteNotification={deleteNotification}
                markAllRead={markAllRead}
                reloadInbox={reloadInbox}
                clearNotificationError={clearNotificationError}
                filterNotifications={variant === 'doctor' ? filterByCategory : undefined}
                emptyTitle={inboxEmpty.title}
                emptyDescription={inboxEmpty.description}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconClass,
  valueClass = 'text-gray-900',
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  iconClass: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${iconClass}`} />
      </div>
    </div>
  );
}
