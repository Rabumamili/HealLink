// stores/slices/notificationSlice.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Notification } from '@/services/notification.service';
import { notificationService } from '@/services/notification.service';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  fetchMyNotifications: (includeRead?: boolean, limit?: number) => Promise<void>;
  markNotificationRead: (notificationId: number) => Promise<void>;
  clearError: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,

      fetchMyNotifications: async (includeRead: boolean = true, limit: number = 50) => {
        set({ isLoading: true, error: null });
        try {
          const notifications = await notificationService.listMyNotifications(includeRead, limit);
          set({
            notifications,
            unreadCount: notifications.filter((n) => !n.isRead).length,
            isLoading: false,
          });
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Failed to load notifications';
          set({ error: message, isLoading: false });
        }
      },

      markNotificationRead: async (notificationId: number) => {
        try {
          const notification = await notificationService.markNotificationRead(notificationId);
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === notificationId ? notification : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
          }));
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Failed to mark as read';
          set({ error: message });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'notification-storage',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);
