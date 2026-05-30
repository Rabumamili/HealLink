// hooks/useNotifications.ts (Complete fixed version)

import { useEffect, useCallback, useMemo } from 'react';
import { useNotificationStore } from '@/stores/slices/notificationSlice';
import {
  NotificationFilters,
  CreateNotificationDTO,
  UpdateNotificationDTO,
  NotificationPreferences,
} from '../types/entities/notification.types';

export const useNotifications = () => {
  const {
    // Data
    notifications,
    currentNotification,
    unreadCount,
    urgentCount,
    stats,
    preferences,
    summary,
    total,
    currentPage,
    pageSize,
    filters,
    
    // UI State
    isLoading,
    isSubmitting,
    error,
    
    // Actions
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
  } = useNotificationStore();

  // Load notifications with current filters
  const loadNotifications = useCallback((customFilters?: NotificationFilters) => {
    const finalFilters = customFilters || filters;
    fetchNotifications(finalFilters);
  }, [fetchNotifications, filters]);

  // Load notifications for a specific recipient
  const loadRecipientNotifications = useCallback((
    recipientId: number,
    recipientType: string,
    limit?: number,
    offset?: number
  ) => {
    fetchRecipientNotifications(recipientId, recipientType, limit, offset);
  }, [fetchRecipientNotifications]);

  // Load single notification
  const loadNotificationById = useCallback((id: number) => {
    fetchNotificationById(id);
  }, [fetchNotificationById]);

  // Add new notification
  const addNotification = useCallback((data: CreateNotificationDTO) => {
    return createNotification(data);
  }, [createNotification]);

  // Edit notification
  const editNotification = useCallback((id: number, data: UpdateNotificationDTO) => {
    return updateNotification(id, data);
  }, [updateNotification]);

  // Remove notification
  const removeNotification = useCallback((id: number) => {
    return deleteNotification(id);
  }, [deleteNotification]);

  // Remove multiple notifications
  const removeNotifications = useCallback((ids: number[]) => {
    return deleteNotifications(ids);
  }, [deleteNotifications]);

  // Mark as read with optimistic update
  const markRead = useCallback((id: number) => {
    optimisticMarkAsRead(id);
    return markAsRead(id).catch((error) => {
      // Revert optimistic update on error
      optimisticMarkAsUnread(id);
      throw error;
    });
  }, [markAsRead, optimisticMarkAsRead, optimisticMarkAsUnread]);

  // Mark as unread with optimistic update
  const markUnread = useCallback((id: number) => {
    optimisticMarkAsUnread(id);
    return markAsUnread(id).catch((error) => {
      // Revert optimistic update on error
      optimisticMarkAsRead(id);
      throw error;
    });
  }, [markAsUnread, optimisticMarkAsUnread, optimisticMarkAsRead]);

  // Mark all as read
  const markAllRead = useCallback((recipientId: number) => {
    return markAllAsRead(recipientId);
  }, [markAllAsRead]);

  // Mark many as read
  const markManyRead = useCallback((ids: number[]) => {
    return markManyAsRead(ids);
  }, [markManyAsRead]);

  // Load statistics
  const loadStats = useCallback((recipientId?: number) => {
    fetchStats(recipientId);
  }, [fetchStats]);

  // Load badge
  const loadBadge = useCallback((recipientId: number) => {
    fetchBadge(recipientId);
  }, [fetchBadge]);

  // Load summary
  const loadSummary = useCallback((recipientId: number) => {
    fetchSummary(recipientId);
  }, [fetchSummary]);

  // Load preferences
  const loadPreferences = useCallback((recipientId: number, recipientType: string) => {
    fetchPreferences(recipientId, recipientType);
  }, [fetchPreferences]);

  // Edit preferences
  const editPreferences = useCallback((
    recipientId: number,
    recipientType: string,
    preferences: Partial<NotificationPreferences>
  ) => {
    return updatePreferences(recipientId, recipientType, preferences);
  }, [updatePreferences]);

  // Filter management
  const updateFilters = useCallback((newFilters: NotificationFilters) => {
    setFilters(newFilters);
  }, [setFilters]);

  const clearFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  // Pagination
  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, [setCurrentPage]);

  const changePageSize = useCallback((size: number) => {
    setPageSize(size);
  }, [setPageSize]);

  // Clear operations
  const clearNotificationError = useCallback(() => {
    clearError();
  }, [clearError]);

  const clearCurrent = useCallback(() => {
    clearCurrentNotification();
  }, [clearCurrentNotification]);

  const clearAllNotifications = useCallback(() => {
    clearNotifications();
  }, [clearNotifications]);

  // Memoized values
  const hasUnread = useMemo(() => unreadCount > 0, [unreadCount]);
  const hasUrgent = useMemo(() => urgentCount > 0, [urgentCount]);
  const unreadNotifications = useMemo(() => 
    notifications.filter(n => !n.isRead), 
    [notifications]
  );
  const urgentNotifications = useMemo(() => 
    notifications.filter(n => n.priority === 'URGENT'), 
    [notifications]
  );
  const todayNotifications = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return notifications.filter(n => n.createdAt.split('T')[0] === today);
  }, [notifications]);

  // Initialize badge
  const initializeBadge = useCallback((recipientId: number) => {
    loadBadge(recipientId);
  }, [loadBadge]);

  // Initialize summary
  const initializeSummary = useCallback((recipientId: number) => {
    loadSummary(recipientId);
  }, [loadSummary]);

  // Auto-refresh badge every 30 seconds when initialized
  const startBadgeAutoRefresh = useCallback((recipientId: number, intervalMs: number = 30000) => {
    loadBadge(recipientId);
    const interval = setInterval(() => {
      loadBadge(recipientId);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [loadBadge]);

  return {
    // Data
    notifications,
    currentNotification,
    unreadCount,
    urgentCount,
    stats,
    preferences,
    summary,
    total,
    currentPage,
    pageSize,
    filters,
    
    // UI State
    isLoading,
    isSubmitting,
    error,
    
    // Computed values
    hasUnread,
    hasUrgent,
    unreadNotifications,
    urgentNotifications,
    todayNotifications,
    
    // Actions - Fetch operations
    loadNotifications,
    loadRecipientNotifications,
    loadNotificationById,
    
    // Actions - CRUD operations
    addNotification,
    editNotification,
    deleteNotification: removeNotification,
    deleteNotifications: removeNotifications,
    
    // Actions - Read/Unread operations
    markRead,
    markUnread,
    markAllRead,
    markManyRead,
    
    // Actions - Statistics
    loadStats,
    loadBadge,
    loadSummary,
    
    // Actions - Preferences
    loadPreferences,
    editPreferences,
    
    // Actions - UI
    updateFilters,
    resetFilters,  // Now explicitly exported
    clearFilters,  // Alias for resetFilters
    goToPage,
    changePageSize,
    clearNotificationError,
    clearCurrent,
    clearAllNotifications,
    
    // Actions - Initialization
    initializeBadge,
    initializeSummary,
    startBadgeAutoRefresh,
  };
};

// hooks/useNotifications.ts - Fix the updatePreference function

export const useNotificationPreferences = (recipientId: number, recipientType: string) => {
  const { preferences, loadPreferences, editPreferences, isLoading } = useNotifications();

  useEffect(() => {
    if (recipientId && recipientType) {
      loadPreferences(recipientId, recipientType);
    }
  }, [recipientId, recipientType, loadPreferences]);

  // Fix: Change this to accept a partial preferences object
  const updatePreference = useCallback((
    preferencesUpdate: Partial<NotificationPreferences>
  ) => {
    if (preferences) {
      editPreferences(recipientId, recipientType, preferencesUpdate);
    }
  }, [preferences, recipientId, recipientType, editPreferences]);

  // Keep the individual key-value update as a separate helper
  const togglePreference = useCallback((
    key: keyof NotificationPreferences,
    value: boolean
  ) => {
    if (preferences) {
      editPreferences(recipientId, recipientType, { [key]: value });
    }
  }, [preferences, recipientId, recipientType, editPreferences]);

  const enableAll = useCallback(() => {
    if (preferences) {
      const allEnabled = Object.keys(preferences).reduce((acc, key) => {
        acc[key as keyof NotificationPreferences] = true;
        return acc;
      }, {} as NotificationPreferences);
      editPreferences(recipientId, recipientType, allEnabled);
    }
  }, [preferences, recipientId, recipientType, editPreferences]);

  const disableAll = useCallback(() => {
    if (preferences) {
      const allDisabled = Object.keys(preferences).reduce((acc, key) => {
        acc[key as keyof NotificationPreferences] = false;
        return acc;
      }, {} as NotificationPreferences);
      editPreferences(recipientId, recipientType, allDisabled);
    }
  }, [preferences, recipientId, recipientType, editPreferences]);

  return {
    preferences,
    isLoading,
    updatePreference,  // Now accepts Partial<NotificationPreferences>
    togglePreference,  // Helper for individual toggles
    enableAll,
    disableAll,
  };
};