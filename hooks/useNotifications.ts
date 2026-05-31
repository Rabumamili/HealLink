// hooks/useNotifications.ts

'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useNotificationStore } from '@/stores/slices/notificationSlice';
import { useAuthStore } from '@/stores/slices/authSlice';
import {
  NotificationQueryFilters,
  CreateNotificationDTO,
  UpdateNotificationDTO,
  NotificationPreferences,
  NotificationRecipientType,
  NotificationRecipientContext,
  PortalLayoutRole,
  getNotificationRecipientFromAuthUser,
  getNotificationRecipientForLayoutRole,
} from '@/types/entities/notification.types';

export const useNotificationRecipient = (
  layoutRole?: PortalLayoutRole
): NotificationRecipientContext | null => {
  const user = useAuthStore((s) => s.user);

  return useMemo(() => {
    if (!user) return null;
    if (layoutRole) {
      return getNotificationRecipientForLayoutRole(user, layoutRole);
    }
    return getNotificationRecipientFromAuthUser(user);
  }, [user, layoutRole]);
};

export const useNotifications = () => {
  const store = useNotificationStore();

  const {
    notifications,
    currentNotification,
    unreadCount,
    urgentCount,
    stats,
    preferences,
    summary,
    recipient,
    total,
    currentPage,
    pageSize,
    filters,
    isLoading,
    isSubmitting,
    error,
    fetchNotifications,
    fetchNotificationById,
    fetchRecipientNotifications,
    createNotification,
    updateNotification,
    deleteNotification,
    deleteNotifications,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    markManyAsRead,
    fetchStats,
    fetchBadge,
    fetchSummary,
    fetchPreferences,
    updatePreferences,
    setFilters,
    resetFilters,
    setCurrentPage,
    setPageSize,
    clearError,
    clearCurrentNotification,
    clearNotifications,
    optimisticMarkAsRead,
    optimisticMarkAsUnread,
    setRecipient,
  } = store;

  const loadNotifications = useCallback(
    (customFilters?: NotificationQueryFilters) => {
      return fetchNotifications(customFilters);
    },
    [fetchNotifications]
  );

  const loadRecipientNotifications = useCallback(
    (
      recipientId: number,
      recipientType: NotificationRecipientType,
      limit?: number,
      offset?: number
    ) => {
      setRecipient({ recipientId, recipientType });
      return fetchRecipientNotifications(recipientId, recipientType, limit, offset);
    },
    [fetchRecipientNotifications, setRecipient]
  );

  const loadNotificationById = useCallback(
    (id: number) => fetchNotificationById(id),
    [fetchNotificationById]
  );

  const addNotification = useCallback(
    (data: CreateNotificationDTO) => createNotification(data),
    [createNotification]
  );

  const editNotification = useCallback(
    (id: number, data: UpdateNotificationDTO) => updateNotification(id, data),
    [updateNotification]
  );

  const removeNotification = useCallback(
    (id: number) => deleteNotification(id),
    [deleteNotification]
  );

  const removeNotifications = useCallback(
    (ids: number[]) => deleteNotifications(ids),
    [deleteNotifications]
  );

  const markRead = useCallback(
    (id: number) => {
      optimisticMarkAsRead(id);
      return markAsRead(id).catch((err) => {
        optimisticMarkAsUnread(id);
        throw err;
      });
    },
    [markAsRead, optimisticMarkAsRead, optimisticMarkAsUnread]
  );

  const markUnread = useCallback(
    (id: number) => {
      optimisticMarkAsUnread(id);
      return markAsUnread(id).catch((err) => {
        optimisticMarkAsRead(id);
        throw err;
      });
    },
    [markAsUnread, optimisticMarkAsUnread, optimisticMarkAsRead]
  );

  const markAllRead = useCallback(
    (recipientId: number, recipientType?: NotificationRecipientType) =>
      markAllAsRead(recipientId, recipientType),
    [markAllAsRead]
  );

  const markManyRead = useCallback(
    (ids: number[]) => markManyAsRead(ids),
    [markManyAsRead]
  );

  const loadStats = useCallback(
    (recipientId?: number) => fetchStats(recipientId),
    [fetchStats]
  );

  const loadBadge = useCallback(
    (recipientId: number) => fetchBadge(recipientId),
    [fetchBadge]
  );

  const loadSummary = useCallback(
    (recipientId: number, recipientType?: NotificationRecipientType) =>
      fetchSummary(recipientId, recipientType),
    [fetchSummary]
  );

  const loadPreferences = useCallback(
    (recipientId: number, recipientType: NotificationRecipientType) =>
      fetchPreferences(recipientId, recipientType),
    [fetchPreferences]
  );

  const editPreferences = useCallback(
    (
      recipientId: number,
      recipientType: NotificationRecipientType,
      prefs: Partial<NotificationPreferences>
    ) => updatePreferences(recipientId, recipientType, prefs),
    [updatePreferences]
  );

  const updateFilters = useCallback(
    (newFilters: Partial<NotificationQueryFilters>) => {
      setFilters(newFilters);
    },
    [setFilters]
  );

  const clearFilters = useCallback(() => resetFilters(), [resetFilters]);

  const goToPage = useCallback((page: number) => setCurrentPage(page), [setCurrentPage]);

  const changePageSize = useCallback(
    (size: number) => setPageSize(size),
    [setPageSize]
  );

  const clearNotificationError = useCallback(() => clearError(), [clearError]);

  const clearCurrent = useCallback(
    () => clearCurrentNotification(),
    [clearCurrentNotification]
  );

  const clearAllNotifications = useCallback(
    () => clearNotifications(),
    [clearNotifications]
  );

  const hasUnread = useMemo(() => unreadCount > 0, [unreadCount]);
  const hasUrgent = useMemo(() => urgentCount > 0, [urgentCount]);
  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.isRead),
    [notifications]
  );
  const urgentNotifications = useMemo(
    () => notifications.filter((n) => n.priority === 'URGENT'),
    [notifications]
  );
  const todayNotifications = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return notifications.filter((n) => n.createdAt.split('T')[0] === today);
  }, [notifications]);

  const initializeBadge = useCallback(
    (recipientId: number) => loadBadge(recipientId),
    [loadBadge]
  );

  const initializeSummary = useCallback(
    (recipientId: number, recipientType?: NotificationRecipientType) =>
      loadSummary(recipientId, recipientType),
    [loadSummary]
  );

  const startBadgeAutoRefresh = useCallback(
    (recipientId: number, intervalMs = 30000) => {
      loadBadge(recipientId);
      const interval = setInterval(() => loadBadge(recipientId), intervalMs);
      return () => clearInterval(interval);
    },
    [loadBadge]
  );

  const reloadInbox = useCallback(() => {
    if (!recipient) return Promise.resolve();
    const offset = (currentPage - 1) * pageSize;
    return fetchRecipientNotifications(
      recipient.recipientId,
      recipient.recipientType,
      pageSize,
      offset
    );
  }, [recipient, currentPage, pageSize, fetchRecipientNotifications]);

  return {
    notifications,
    currentNotification,
    unreadCount,
    urgentCount,
    stats,
    preferences,
    summary,
    recipient,
    total,
    currentPage,
    pageSize,
    filters,
    isLoading,
    isSubmitting,
    error,
    hasUnread,
    hasUrgent,
    unreadNotifications,
    urgentNotifications,
    todayNotifications,
    loadNotifications,
    loadRecipientNotifications,
    loadNotificationById,
    addNotification,
    editNotification,
    deleteNotification: removeNotification,
    deleteNotifications: removeNotifications,
    markRead,
    markUnread,
    markAllRead,
    markManyRead,
    loadStats,
    loadBadge,
    loadSummary,
    loadPreferences,
    editPreferences,
    updateFilters,
    resetFilters,
    clearFilters,
    goToPage,
    changePageSize,
    clearNotificationError,
    clearCurrent,
    clearAllNotifications,
    initializeBadge,
    initializeSummary,
    startBadgeAutoRefresh,
    reloadInbox,
  };
};

export interface NotificationInboxOptions {
  loadStats?: boolean;
  loadSummary?: boolean;
}

/** Loads inbox + badge for the current portal role; refetches when filters/page change. */
export const useNotificationInbox = (
  layoutRole: PortalLayoutRole,
  options: NotificationInboxOptions = {}
) => {
  const recipient = useNotificationRecipient(layoutRole);
  const inbox = useNotifications();
  const filtersKey = JSON.stringify(inbox.filters);

  useEffect(() => {
    if (!recipient) return;
    const offset = (inbox.currentPage - 1) * inbox.pageSize;
    void inbox.loadRecipientNotifications(
      recipient.recipientId,
      recipient.recipientType,
      inbox.pageSize,
      offset
    );
    void inbox.loadBadge(recipient.recipientId);
    if (options.loadStats) {
      void inbox.loadStats(recipient.recipientId);
    }
    if (options.loadSummary) {
      void inbox.loadSummary(recipient.recipientId, recipient.recipientType);
    }
  }, [
    recipient?.recipientId,
    recipient?.recipientType,
    inbox.currentPage,
    inbox.pageSize,
    filtersKey,
    options.loadStats,
    options.loadSummary,
    inbox.loadRecipientNotifications,
    inbox.loadBadge,
    inbox.loadStats,
    inbox.loadSummary,
  ]);

  return { ...inbox, recipient };
};

export const useNotificationPreferences = (
  recipientId: number,
  recipientType: NotificationRecipientType
) => {
  const { preferences, loadPreferences, editPreferences, isLoading } =
    useNotifications();

  useEffect(() => {
    if (recipientId && recipientType) {
      void loadPreferences(recipientId, recipientType);
    }
  }, [recipientId, recipientType, loadPreferences]);

  const updatePreference = useCallback(
    (preferencesUpdate: Partial<NotificationPreferences>) => {
      return editPreferences(recipientId, recipientType, preferencesUpdate);
    },
    [recipientId, recipientType, editPreferences]
  );

  const togglePreference = useCallback(
    (key: keyof NotificationPreferences, value: boolean) => {
      return editPreferences(recipientId, recipientType, { [key]: value });
    },
    [recipientId, recipientType, editPreferences]
  );

  const enableAll = useCallback(() => {
    if (!preferences) return;
    const allEnabled = Object.keys(preferences).reduce(
      (acc, key) => {
        acc[key as keyof NotificationPreferences] = true;
        return acc;
      },
      {} as NotificationPreferences
    );
    return editPreferences(recipientId, recipientType, allEnabled);
  }, [preferences, recipientId, recipientType, editPreferences]);

  const disableAll = useCallback(() => {
    if (!preferences) return;
    const allDisabled = Object.keys(preferences).reduce(
      (acc, key) => {
        acc[key as keyof NotificationPreferences] = false;
        return acc;
      },
      {} as NotificationPreferences
    );
    return editPreferences(recipientId, recipientType, allDisabled);
  }, [preferences, recipientId, recipientType, editPreferences]);

  return {
    preferences,
    isLoading,
    updatePreference,
    togglePreference,
    enableAll,
    disableAll,
  };
};
