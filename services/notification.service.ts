// services/notification.service.ts

import { ApiService } from './api.service';
import {
  Notification,
  CreateNotificationDTO,
  UpdateNotificationDTO,
  NotificationQueryFilters,
  NotificationResponse,
  NotificationListResponse,
  NotificationStats,
  NotificationPreferences,
  NotificationBadge,
  NotificationSummary,
  MarkNotificationReadDTO,
  MarkAllNotificationsReadDTO,
  NotificationRecipientType,
} from '@/types/entities/notification.types';

export interface RecipientNotificationOptions {
  limit?: number;
  offset?: number;
  filters?: NotificationQueryFilters;
}

function appendNotificationFilters(
  queryParams: URLSearchParams,
  filters?: NotificationQueryFilters
): void {
  if (!filters) return;

  if (filters.recipientId !== undefined) {
    queryParams.append('recipientId', filters.recipientId.toString());
  }
  if (filters.recipientType) {
    queryParams.append('recipientType', filters.recipientType);
  }
  if (filters.type && filters.type !== 'all') {
    queryParams.append('type', filters.type);
  }
  if (filters.isRead !== undefined) {
    queryParams.append('isRead', filters.isRead.toString());
  }
  if (filters.priority && filters.priority !== 'all') {
    queryParams.append('priority', filters.priority);
  }
  if (filters.startDate) {
    queryParams.append('startDate', filters.startDate);
  }
  if (filters.endDate) {
    queryParams.append('endDate', filters.endDate);
  }
  if (filters.searchTerm) {
    queryParams.append('searchTerm', filters.searchTerm);
  }
}

class NotificationService extends ApiService {
  private readonly basePath = '/notifications';

  async createNotification(data: CreateNotificationDTO): Promise<Notification> {
    const response = await this.post<NotificationResponse>(this.basePath, data);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create notification');
    }
    return response.data;
  }

  async getNotificationById(id: number): Promise<Notification> {
    const response = await this.get<NotificationResponse>(`${this.basePath}/${id}`);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Notification not found');
    }
    return response.data;
  }

  async getNotifications(
    filters?: NotificationQueryFilters
  ): Promise<NotificationListResponse> {
    const queryParams = new URLSearchParams();
    appendNotificationFilters(queryParams, filters);

    const endpoint = queryParams.toString()
      ? `${this.basePath}?${queryParams.toString()}`
      : this.basePath;

    return this.get<NotificationListResponse>(endpoint);
  }

  async getRecipientNotifications(
    recipientId: number,
    recipientType: NotificationRecipientType,
    limit?: number,
    offset?: number,
    filters?: NotificationQueryFilters
  ): Promise<NotificationListResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('recipientId', recipientId.toString());
    queryParams.append('recipientType', recipientType);
    if (limit !== undefined) queryParams.append('limit', limit.toString());
    if (offset !== undefined) queryParams.append('offset', offset.toString());
    appendNotificationFilters(queryParams, filters);

    return this.get<NotificationListResponse>(
      `${this.basePath}/recipient?${queryParams.toString()}`
    );
  }

  async updateNotification(
    id: number,
    data: UpdateNotificationDTO
  ): Promise<Notification> {
    const response = await this.patch<NotificationResponse>(
      `${this.basePath}/${id}`,
      data
    );
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update notification');
    }
    return response.data;
  }

  async deleteNotification(id: number): Promise<void> {
    const response = await this.delete<NotificationResponse>(
      `${this.basePath}/${id}`
    );
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete notification');
    }
  }

  async deleteNotifications(ids: number[]): Promise<number> {
    const response = await this.post<{
      success: boolean;
      deletedCount: number;
      message?: string;
    }>(`${this.basePath}/bulk-delete`, { ids });
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete notifications');
    }
    return response.deletedCount;
  }

  async markAsRead(notificationId: number): Promise<Notification> {
    const data: MarkNotificationReadDTO = { notificationId };
    const response = await this.post<NotificationResponse>(
      `${this.basePath}/${notificationId}/read`,
      data
    );
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to mark as read');
    }
    return response.data;
  }

  async markAsUnread(notificationId: number): Promise<Notification> {
    const response = await this.post<NotificationResponse>(
      `${this.basePath}/${notificationId}/unread`,
      {}
    );
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to mark as unread');
    }
    return response.data;
  }

  async markAllAsRead(
    recipientId: number,
    recipientType?: NotificationRecipientType
  ): Promise<number> {
    const data: MarkAllNotificationsReadDTO = { recipientId };
    const query = recipientType ? `?recipientType=${recipientType}` : '';
    const response = await this.post<{
      success: boolean;
      updatedCount: number;
      message?: string;
    }>(`${this.basePath}/mark-all-read${query}`, data);
    if (!response.success) {
      throw new Error(response.message || 'Failed to mark all as read');
    }
    return response.updatedCount;
  }

  async markManyAsRead(ids: number[]): Promise<number> {
    const response = await this.post<{
      success: boolean;
      updatedCount: number;
      message?: string;
    }>(`${this.basePath}/mark-many-read`, { ids });
    if (!response.success) {
      throw new Error(
        response.message || 'Failed to mark notifications as read'
      );
    }
    return response.updatedCount;
  }

  async getNotificationStats(recipientId?: number): Promise<NotificationStats> {
    const queryParams = recipientId ? `?recipientId=${recipientId}` : '';
    const response = await this.get<{
      success: boolean;
      data: NotificationStats;
      message?: string;
    }>(`${this.basePath}/stats${queryParams}`);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get notification stats');
    }
    return response.data;
  }

  async getNotificationBadge(recipientId: number): Promise<NotificationBadge> {
    const response = await this.get<{
      success: boolean;
      data: NotificationBadge;
      message?: string;
    }>(`${this.basePath}/${recipientId}/badge`);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get notification badge');
    }
    return response.data;
  }

  async getNotificationSummary(
    recipientId: number,
    recipientType?: NotificationRecipientType
  ): Promise<NotificationSummary> {
    const query = recipientType ? `?recipientType=${recipientType}` : '';
    const response = await this.get<{
      success: boolean;
      data: NotificationSummary;
      message?: string;
    }>(`${this.basePath}/${recipientId}/summary${query}`);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get notification summary');
    }
    return response.data;
  }

  async getNotificationPreferences(
    recipientId: number,
    recipientType: NotificationRecipientType
  ): Promise<NotificationPreferences> {
    const response = await this.get<{
      success: boolean;
      data: NotificationPreferences;
      message?: string;
    }>(`${this.basePath}/preferences/${recipientType}/${recipientId}`);
    if (!response.success || !response.data) {
      throw new Error(
        response.message || 'Failed to get notification preferences'
      );
    }
    return response.data;
  }

  async updateNotificationPreferences(
    recipientId: number,
    recipientType: NotificationRecipientType,
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const response = await this.put<{
      success: boolean;
      data: NotificationPreferences;
      message?: string;
    }>(`${this.basePath}/preferences/${recipientType}/${recipientId}`, preferences);
    if (!response.success || !response.data) {
      throw new Error(
        response.message || 'Failed to update notification preferences'
      );
    }
    return response.data;
  }

  async getUnreadCount(recipientId: number): Promise<number> {
    const badge = await this.getNotificationBadge(recipientId);
    return badge.unreadCount;
  }
}

export const notificationService = new NotificationService();
