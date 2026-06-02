// hooks/useNotifications.ts

'use client';

import { useEffect, useCallback } from 'react';
import { useNotificationStore } from '@/stores/slices/notificationSlice';

export const useNotifications = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchMyNotifications,
    markNotificationRead,
    clearError,
  } = useNotificationStore();

  const loadNotifications = useCallback(
    (includeRead: boolean = true, limit: number = 50) => {
      return fetchMyNotifications(includeRead, limit);
    },
    [fetchMyNotifications]
  );

  const markRead = useCallback(
    (id: number) => {
      return markNotificationRead(id);
    },
    [markNotificationRead]
  );

  const unreadNotifications = notifications.filter((n) => !n.isRead);

  const startBadgeAutoRefresh = useCallback(
    (recipientId: string | null) => {
      if (!recipientId) return;
      const interval = setInterval(() => {
        void loadNotifications(false, 10); // Only fetch unread, limit to 10 for badge
      }, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    },
    [loadNotifications]
  );

  return {
    notifications,
    unreadCount,
    unreadNotifications,
    isLoading,
    error,
    loadNotifications,
    markRead,
    clearError,
    startBadgeAutoRefresh,
  };
};

export const useNotificationInbox = (layoutRole: string = 'patient', options: { autoFetch?: boolean; loadStats?: boolean; loadSummary?: boolean } = {}) => {
  const inbox = useNotifications();
  const { autoFetch = true } = options;

  useEffect(() => {
    if (autoFetch) {
      void inbox.loadNotifications();
    }
  }, [autoFetch, inbox.loadNotifications]);

  // Derive recipient info from layout role
  const recipient = {
    recipientId: layoutRole === 'patient' ? 0 : 1,
    recipientType: (layoutRole === 'diagnosticCenter' ? 'diagnostic_center' : layoutRole) as 'patient' | 'doctor' | 'clinic' | 'diagnostic_center' | 'staff',
  };

  return {
    ...inbox,
    recipient,
    total: inbox.notifications.length,
    filters: {},
    stats: null,
    summary: null,
    markUnread: async () => {},
    deleteNotification: async () => {},
    updateFilters: () => {},
    resetFilters: () => {},
    reloadInbox: () => inbox.loadNotifications(),
    markAllRead: async () => {},
    clearNotificationError: () => inbox.clearError(),
  };
};

export const useNotificationRecipient = (layoutRole: string) => {
  // This is a compatibility stub for existing components
  // In a real implementation, this would determine the recipient ID based on the layout role
  return {
    recipientId: null,
  };
};

export const useNotificationPreferences = () => {
  // This is a compatibility stub for existing components
  // In a real implementation, this would manage notification preferences
  return {
    preferences: null,
    updatePreferences: async () => {},
  };
};
