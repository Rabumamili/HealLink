// services/notification.service.ts
import { ApiService } from './api.service';
import type { Notification } from '@/types/entities/notification.types';

// Re-export the Notification type from the types file
export type { Notification };

class NotificationService extends ApiService {
  private readonly basePath = '/notifications';

  async listMyNotifications(includeRead: boolean = true, limit: number = 50): Promise<Notification[]> {
    const queryParams = new URLSearchParams();
    queryParams.append('include_read', includeRead.toString());
    queryParams.append('limit', limit.toString());

    return this.get<Notification[]>(`${this.basePath}/mine?${queryParams.toString()}`, undefined, false);
  }

  async markNotificationRead(notificationId: number): Promise<Notification> {
    return this.post<Notification>(`${this.basePath}/${notificationId}/read`, {}, undefined, false);
  }
}

export const notificationService = new NotificationService();
