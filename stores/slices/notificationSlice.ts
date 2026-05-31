// stores/slices/notificationSlice.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import {
  Notification,
  NotificationQueryFilters,
  NotificationStats,
  NotificationPreferences,
  NotificationSummary,
  CreateNotificationDTO,
  UpdateNotificationDTO,
  NotificationRecipientType,
  NotificationRecipientContext,
} from '@/types/entities/notification.types';
import { notificationService } from '@/services/notification.service';

interface NotificationState {
  notifications: Notification[];
  currentNotification: Notification | null;
  unreadCount: number;
  urgentCount: number;
  stats: NotificationStats | null;
  preferences: NotificationPreferences | null;
  summary: NotificationSummary | null;
  recipient: NotificationRecipientContext | null;

  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  total: number;
  currentPage: number;
  pageSize: number;
  filters: NotificationQueryFilters;

  setRecipient: (recipient: NotificationRecipientContext | null) => void;
  fetchNotifications: (filters?: NotificationQueryFilters) => Promise<void>;
  fetchNotificationById: (id: number) => Promise<void>;
  fetchRecipientNotifications: (
    recipientId: number,
    recipientType: NotificationRecipientType,
    limit?: number,
    offset?: number
  ) => Promise<void>;
  createNotification: (data: CreateNotificationDTO) => Promise<Notification>;
  updateNotification: (
    id: number,
    data: UpdateNotificationDTO
  ) => Promise<Notification>;
  deleteNotification: (id: number) => Promise<void>;
  deleteNotifications: (ids: number[]) => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAsUnread: (id: number) => Promise<void>;
  markAllAsRead: (
    recipientId: number,
    recipientType?: NotificationRecipientType
  ) => Promise<void>;
  markManyAsRead: (ids: number[]) => Promise<void>;
  fetchStats: (recipientId?: number) => Promise<void>;
  fetchBadge: (recipientId: number) => Promise<void>;
  fetchSummary: (
    recipientId: number,
    recipientType?: NotificationRecipientType
  ) => Promise<void>;
  fetchPreferences: (
    recipientId: number,
    recipientType: NotificationRecipientType
  ) => Promise<void>;
  updatePreferences: (
    recipientId: number,
    recipientType: NotificationRecipientType,
    preferences: Partial<NotificationPreferences>
  ) => Promise<void>;
  setFilters: (filters: Partial<NotificationQueryFilters>) => void;
  resetFilters: () => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  clearError: () => void;
  clearCurrentNotification: () => void;
  clearNotifications: () => void;
  optimisticMarkAsRead: (id: number) => void;
  optimisticMarkAsUnread: (id: number) => void;
}

const initialState = {
  notifications: [] as Notification[],
  currentNotification: null as Notification | null,
  unreadCount: 0,
  urgentCount: 0,
  stats: null as NotificationStats | null,
  preferences: null as NotificationPreferences | null,
  summary: null as NotificationSummary | null,
  recipient: null as NotificationRecipientContext | null,
  isLoading: false,
  isSubmitting: false,
  error: null as string | null,
  total: 0,
  currentPage: 1,
  pageSize: 20,
  filters: {} as NotificationQueryFilters,
};

export const useNotificationStore = create<NotificationState>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      setRecipient: (recipient) => {
        set({ recipient });
      },

      fetchNotifications: async (filters) => {
        set({ isLoading: true, error: null });
        try {
          const merged = { ...get().filters, ...filters };
          const response = await notificationService.getNotifications(merged);
          set({
            notifications: response.data,
            unreadCount: response.unreadCount,
            total: response.total,
            filters: merged,
            isLoading: false,
          });
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Failed to load notifications';
          set({ error: message, isLoading: false });
        }
      },

      fetchNotificationById: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const notification = await notificationService.getNotificationById(id);
          set({ currentNotification: notification, isLoading: false });
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Failed to load notification';
          set({ error: message, isLoading: false });
        }
      },

      fetchRecipientNotifications: async (recipientId, recipientType, limit, offset) => {
        set({ isLoading: true, error: null });
        try {
          const mergedFilters: NotificationQueryFilters = {
            ...get().filters,
            recipientId,
            recipientType,
          };
          const response = await notificationService.getRecipientNotifications(
            recipientId,
            recipientType,
            limit,
            offset,
            mergedFilters
          );
          set({
            notifications: response.data,
            unreadCount: response.unreadCount,
            total: response.total,
            filters: mergedFilters,
            recipient: { recipientId, recipientType },
            isLoading: false,
          });
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Failed to load notifications';
          set({ error: message, isLoading: false });
        }
      },

      createNotification: async (data) => {
        set({ isSubmitting: true, error: null });
        try {
          const notification = await notificationService.createNotification(data);
          set((state) => {
            state.notifications = [notification, ...state.notifications];
            state.total += 1;
            if (!notification.isRead) {
              state.unreadCount += 1;
            }
            state.isSubmitting = false;
          });
          return notification;
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Failed to create notification';
          set({ error: message, isSubmitting: false });
          throw error;
        }
      },

      updateNotification: async (id, data) => {
        set({ isSubmitting: true, error: null });
        try {
          const notification = await notificationService.updateNotification(id, data);
          set((state) => {
            const index = state.notifications.findIndex((n) => n.id === id);
            if (index !== -1) {
              state.notifications[index] = notification;
            }
            if (state.currentNotification?.id === id) {
              state.currentNotification = notification;
            }
            state.isSubmitting = false;
          });
          return notification;
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Failed to update notification';
          set({ error: message, isSubmitting: false });
          throw error;
        }
      },

      deleteNotification: async (id) => {
        set({ isSubmitting: true, error: null });
        try {
          await notificationService.deleteNotification(id);
          set((state) => {
            const deletedNotification = state.notifications.find((n) => n.id === id);
            if (deletedNotification && !deletedNotification.isRead) {
              state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
            state.notifications = state.notifications.filter((n) => n.id !== id);
            state.total = Math.max(0, state.total - 1);
            state.isSubmitting = false;
          });
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Failed to delete notification';
          set({ error: message, isSubmitting: false });
          throw error;
        }
      },

      deleteNotifications: async (ids) => {
        set({ isSubmitting: true, error: null });
        try {
          await notificationService.deleteNotifications(ids);
          set((state) => {
            const deletedUnreadCount = state.notifications.filter(
              (n) => ids.includes(n.id) && !n.isRead
            ).length;
            state.unreadCount = Math.max(0, state.unreadCount - deletedUnreadCount);
            state.notifications = state.notifications.filter((n) => !ids.includes(n.id));
            state.total = Math.max(0, state.total - ids.length);
            state.isSubmitting = false;
          });
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Failed to delete notifications';
          set({ error: message, isSubmitting: false });
          throw error;
        }
      },

      markAsRead: async (id) => {
        try {
          const notification = await notificationService.markAsRead(id);
          set((state) => {
            const index = state.notifications.findIndex((n) => n.id === id);
            if (index !== -1) {
              const wasUnread = !state.notifications[index].isRead;
              state.notifications[index] = notification;
              if (wasUnread) {
                state.unreadCount = Math.max(0, state.unreadCount - 1);
              }
            }
            if (state.currentNotification?.id === id) {
              state.currentNotification = notification;
            }
          });
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Failed to mark as read';
          set({ error: message });
          throw error;
        }
      },

      markAsUnread: async (id) => {
        try {
          const notification = await notificationService.markAsUnread(id);
          set((state) => {
            const index = state.notifications.findIndex((n) => n.id === id);
            if (index !== -1) {
              const wasRead = state.notifications[index].isRead;
              state.notifications[index] = notification;
              if (wasRead) {
                state.unreadCount += 1;
              }
            }
            if (state.currentNotification?.id === id) {
              state.currentNotification = notification;
            }
          });
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Failed to mark as unread';
          set({ error: message });
          throw error;
        }
      },

      markAllAsRead: async (recipientId, recipientType) => {
        try {
          await notificationService.markAllAsRead(recipientId, recipientType);
          set((state) => {
            state.notifications = state.notifications.map((n) => ({
              ...n,
              isRead: true,
              readAt: new Date().toISOString(),
            }));
            state.unreadCount = 0;
          });
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Failed to mark all as read';
          set({ error: message });
          throw error;
        }
      },

      markManyAsRead: async (ids) => {
        try {
          await notificationService.markManyAsRead(ids);
          set((state) => {
            let updatedCount = 0;
            state.notifications = state.notifications.map((n) => {
              if (ids.includes(n.id) && !n.isRead) {
                updatedCount++;
                return { ...n, isRead: true, readAt: new Date().toISOString() };
              }
              return n;
            });
            state.unreadCount = Math.max(0, state.unreadCount - updatedCount);
          });
        } catch (error: unknown) {
          const message =
            error instanceof Error
              ? error.message
              : 'Failed to mark notifications as read';
          set({ error: message });
          throw error;
        }
      },

      fetchStats: async (recipientId) => {
        set({ isLoading: true, error: null });
        try {
          const stats = await notificationService.getNotificationStats(recipientId);
          set({ stats, isLoading: false });
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Failed to load stats';
          set({ error: message, isLoading: false });
        }
      },

      fetchBadge: async (recipientId) => {
        try {
          const badge = await notificationService.getNotificationBadge(recipientId);
          set({
            unreadCount: badge.unreadCount,
            urgentCount: badge.urgentCount,
          });
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Failed to load badge';
          set({ error: message });
        }
      },

      fetchSummary: async (recipientId, recipientType) => {
        set({ isLoading: true, error: null });
        try {
          const summary = await notificationService.getNotificationSummary(
            recipientId,
            recipientType
          );
          set({
            summary,
            unreadCount: summary.unreadNotifications,
            isLoading: false,
          });
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Failed to load summary';
          set({ error: message, isLoading: false });
        }
      },

      fetchPreferences: async (recipientId, recipientType) => {
        set({ isLoading: true, error: null });
        try {
          const preferences = await notificationService.getNotificationPreferences(
            recipientId,
            recipientType
          );
          set({ preferences, isLoading: false });
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Failed to load preferences';
          set({ error: message, isLoading: false });
        }
      },

      updatePreferences: async (recipientId, recipientType, preferences) => {
        set({ isSubmitting: true, error: null });
        try {
          const updatedPreferences =
            await notificationService.updateNotificationPreferences(
              recipientId,
              recipientType,
              preferences
            );
          set({ preferences: updatedPreferences, isSubmitting: false });
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Failed to update preferences';
          set({ error: message, isSubmitting: false });
          throw error;
        }
      },

      setFilters: (filters) => {
        set((state) => {
          state.filters = { ...state.filters, ...filters };
          state.currentPage = 1;
        });
      },

      resetFilters: () => {
        const recipient = get().recipient;
        set({
          filters: recipient
            ? {
                recipientId: recipient.recipientId,
                recipientType: recipient.recipientType,
              }
            : {},
          currentPage: 1,
        });
      },

      setCurrentPage: (page) => {
        set({ currentPage: page });
      },

      setPageSize: (size) => {
        set({ pageSize: size, currentPage: 1 });
      },

      clearError: () => {
        set({ error: null });
      },

      clearCurrentNotification: () => {
        set({ currentNotification: null });
      },

      clearNotifications: () => {
        set({ notifications: [], total: 0 });
      },

      optimisticMarkAsRead: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          if (notification && !notification.isRead) {
            notification.isRead = true;
            notification.readAt = new Date().toISOString();
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        });
      },

      optimisticMarkAsUnread: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          if (notification && notification.isRead) {
            notification.isRead = false;
            notification.readAt = null;
            state.unreadCount += 1;
          }
        });
      },
    })),
    {
      name: 'notification-storage',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);
