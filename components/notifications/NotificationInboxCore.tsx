'use client';

import React from 'react';
import { Bell, RefreshCw, Filter, AlertCircle } from 'lucide-react';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { NotificationFiltersComponent } from '@/components/notifications/NotificationFilters';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type {
  Notification,
  NotificationQueryFilters,
  NotificationRecipientContext,
} from '@/types/entities/notification.types';

export interface NotificationInboxCoreProps {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  total: number;
  unreadCount: number;
  filters: NotificationQueryFilters;
  recipient: NotificationRecipientContext | null;
  showFilters: boolean;
  onToggleFilters: () => void;
  updateFilters: (filters: Partial<NotificationQueryFilters>) => void;
  resetFilters: () => void;
  markRead: (id: number) => void | Promise<unknown>;
  markUnread: (id: number) => void | Promise<unknown>;
  deleteNotification: (id: number) => void | Promise<unknown>;
  markAllRead: (
    recipientId: number,
    recipientType?: NotificationRecipientContext['recipientType']
  ) => void | Promise<unknown>;
  reloadInbox: () => void | Promise<unknown>;
  clearNotificationError: () => void;
  filterNotifications?: (notifications: Notification[]) => Notification[];
  emptyTitle?: string;
  emptyDescription?: string;
  showFilterToggle?: boolean;
  showMarkAllRead?: boolean;
  showRefresh?: boolean;
}

export function NotificationInboxCore({
  notifications,
  isLoading,
  error,
  total,
  unreadCount,
  filters,
  recipient,
  showFilters,
  onToggleFilters,
  updateFilters,
  resetFilters,
  markRead,
  markUnread,
  deleteNotification,
  markAllRead,
  reloadInbox,
  clearNotificationError,
  filterNotifications,
  emptyTitle = 'No notifications',
  emptyDescription = "You're all caught up!",
  showFilterToggle = true,
  showMarkAllRead = true,
  showRefresh = true,
}: NotificationInboxCoreProps) {
  const displayed = filterNotifications
    ? filterNotifications(notifications)
    : notifications;

  const handleMarkAllRead = () => {
    if (!recipient) return;
    void markAllRead(recipient.recipientId, recipient.recipientType);
  };

  return (
    <>
      {(showRefresh || showFilterToggle) && (
        <div className="mb-4 flex justify-end gap-2">
          {showRefresh && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void reloadInbox()}
              disabled={isLoading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          )}
          {showFilterToggle && (
            <Button
              type="button"
              variant={showFilters ? 'secondary' : 'outline'}
              size="sm"
              onClick={onToggleFilters}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          )}
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
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

      {showFilters && (
        <div className="mb-6">
          <NotificationFiltersComponent
            filters={filters}
            onFilterChange={updateFilters}
            onReset={resetFilters}
          />
        </div>
      )}

      {showMarkAllRead && unreadCount > 0 && !error && (
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={!recipient || isLoading}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            Mark all as read
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      ) : displayed.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white py-12 text-center">
          <Bell className="mx-auto mb-3 h-12 w-12 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">{emptyTitle}</h3>
          <p className="mt-1 text-gray-500">{emptyDescription}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((notification) => (
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

      {!isLoading && total > displayed.length && displayed.length > 0 && (
        <div className="mt-6 flex justify-center">
          <p className="text-sm text-gray-500">
            Showing {displayed.length} of {total}
          </p>
        </div>
      )}
    </>
  );
}
