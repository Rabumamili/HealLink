// repositories/notification.repository.ts

import {
  Notification,
  CreateNotificationDTO,
  UpdateNotificationDTO,
  NotificationFilters,
  NotificationStats,
  NotificationPreferences,
  NotificationBadge,
  NotificationSummary,
} from '../../types/entities/notification.types';

export interface INotificationRepository {
  // CRUD Operations
  create(data: CreateNotificationDTO): Promise<Notification>;
  findById(id: number): Promise<Notification | null>;
  findAll(filters?: NotificationFilters): Promise<Notification[]>;
  update(id: number, data: UpdateNotificationDTO): Promise<Notification>;
  delete(id: number): Promise<boolean>;
  deleteMany(ids: number[]): Promise<number>;

  // Read/Unread Operations
  markAsRead(id: number): Promise<Notification>;
  markAsUnread(id: number): Promise<Notification>;
  markAllAsRead(recipientId: number): Promise<number>;
  markManyAsRead(ids: number[]): Promise<number>;

  // Bulk Operations
  createMany(data: CreateNotificationDTO[]): Promise<Notification[]>;
  updateMany(ids: number[], data: UpdateNotificationDTO): Promise<number>;

  // Query Operations
  findByRecipient(
    recipientId: number,
    recipientType: string,
    limit?: number,
    offset?: number
  ): Promise<Notification[]>;
  
  findByType(type: string, limit?: number): Promise<Notification[]>;
  findByPriority(priority: string, limit?: number): Promise<Notification[]>;
  findUnreadByRecipient(recipientId: number): Promise<Notification[]>;
  findUrgentByRecipient(recipientId: number): Promise<Notification[]>;
  
  // Statistics & Analytics
  getStats(recipientId?: number): Promise<NotificationStats>;
  getBadge(recipientId: number): Promise<NotificationBadge>;
  getSummary(recipientId: number): Promise<NotificationSummary>;
  
  // Preferences
  getPreferences(recipientId: number, recipientType: string): Promise<NotificationPreferences>;
  updatePreferences(
    recipientId: number,
    recipientType: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences>;
  
  // Cleanup Operations
  deleteOldNotifications(daysOld: number): Promise<number>;
  archiveOldNotifications(daysOld: number): Promise<number>;
}

// In-memory implementation for testing/development
export class InMemoryNotificationRepository implements INotificationRepository {
  private notifications: Map<number, Notification> = new Map();
  private preferences: Map<string, NotificationPreferences> = new Map();
  private currentId = 1;

  async create(data: CreateNotificationDTO): Promise<Notification> {
    const now = new Date().toISOString();
    const notification: Notification = {
      id: this.currentId++,
      recipientId: data.recipientId,
      recipientType: data.recipientType,
      title: data.title,
      message: data.message,
      type: data.type,
      channel: 'IN_APP',
      priority: data.priority || 'MEDIUM',
      isRead: false,
      relatedAppointmentId: data.relatedAppointmentId || null,
      relatedPaymentId: data.relatedPaymentId || null,
      relatedResultId: data.relatedResultId || null,
      relatedReviewId: data.relatedReviewId || null,
      actionUrl: data.actionUrl || null,
      createdAt: now,
      updatedAt: now,
      readAt: null,
    };

    this.notifications.set(notification.id, notification);
    return notification;
  }

  async findById(id: number): Promise<Notification | null> {
    return this.notifications.get(id) || null;
  }

  async findAll(filters?: NotificationFilters): Promise<Notification[]> {
    let notifications = Array.from(this.notifications.values());

    if (filters) {
      if (filters.recipientId) {
        notifications = notifications.filter(n => n.recipientId === filters.recipientId);
      }
      if (filters.recipientType) {
        notifications = notifications.filter(n => n.recipientType === filters.recipientType);
      }
      if (filters.type && filters.type !== 'all') {
        notifications = notifications.filter(n => n.type === filters.type);
      }
      if (filters.isRead !== undefined) {
        notifications = notifications.filter(n => n.isRead === filters.isRead);
      }
      if (filters.priority && filters.priority !== 'all') {
        notifications = notifications.filter(n => n.priority === filters.priority);
      }
      if (filters.startDate) {
        notifications = notifications.filter(n => n.createdAt >= filters.startDate!);
      }
      if (filters.endDate) {
        notifications = notifications.filter(n => n.createdAt <= filters.endDate!);
      }
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        notifications = notifications.filter(n =>
          n.title.toLowerCase().includes(term) ||
          n.message.toLowerCase().includes(term)
        );
      }
    }

    return notifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async update(id: number, data: UpdateNotificationDTO): Promise<Notification> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error(`Notification with id ${id} not found`);
    }

    const updated: Notification = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.notifications.set(id, updated);
    return updated;
  }

  async delete(id: number): Promise<boolean> {
    return this.notifications.delete(id);
  }

  async deleteMany(ids: number[]): Promise<number> {
    let deletedCount = 0;
    for (const id of ids) {
      if (this.notifications.delete(id)) {
        deletedCount++;
      }
    }
    return deletedCount;
  }

  async markAsRead(id: number): Promise<Notification> {
    const notification = await this.findById(id);
    if (!notification) {
      throw new Error(`Notification with id ${id} not found`);
    }

    const updated: Notification = {
      ...notification,
      isRead: true,
      readAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.notifications.set(id, updated);
    return updated;
  }

  async markAsUnread(id: number): Promise<Notification> {
    const notification = await this.findById(id);
    if (!notification) {
      throw new Error(`Notification with id ${id} not found`);
    }

    const updated: Notification = {
      ...notification,
      isRead: false,
      readAt: null,
      updatedAt: new Date().toISOString(),
    };

    this.notifications.set(id, updated);
    return updated;
  }

  async markAllAsRead(recipientId: number): Promise<number> {
    const notifications = await this.findByRecipient(recipientId, 'patient');
    let updatedCount = 0;

    for (const notification of notifications) {
      if (!notification.isRead) {
        await this.markAsRead(notification.id);
        updatedCount++;
      }
    }

    return updatedCount;
  }

  async markManyAsRead(ids: number[]): Promise<number> {
    let updatedCount = 0;
    for (const id of ids) {
      await this.markAsRead(id);
      updatedCount++;
    }
    return updatedCount;
  }

  async createMany(data: CreateNotificationDTO[]): Promise<Notification[]> {
    const notifications: Notification[] = [];
    for (const dto of data) {
      notifications.push(await this.create(dto));
    }
    return notifications;
  }

  async updateMany(ids: number[], data: UpdateNotificationDTO): Promise<number> {
    let updatedCount = 0;
    for (const id of ids) {
      await this.update(id, data);
      updatedCount++;
    }
    return updatedCount;
  }

  async findByRecipient(
    recipientId: number,
    recipientType: string,
    limit?: number,
    offset?: number
  ): Promise<Notification[]> {
    let notifications = Array.from(this.notifications.values())
      .filter(n => n.recipientId === recipientId && n.recipientType === recipientType)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (offset !== undefined) {
      notifications = notifications.slice(offset);
    }
    if (limit !== undefined) {
      notifications = notifications.slice(0, limit);
    }

    return notifications;
  }

  async findByType(type: string, limit?: number): Promise<Notification[]> {
    let notifications = Array.from(this.notifications.values())
      .filter(n => n.type === type)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (limit) {
      notifications = notifications.slice(0, limit);
    }

    return notifications;
  }

  async findByPriority(priority: string, limit?: number): Promise<Notification[]> {
    let notifications = Array.from(this.notifications.values())
      .filter(n => n.priority === priority)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (limit) {
      notifications = notifications.slice(0, limit);
    }

    return notifications;
  }

  async findUnreadByRecipient(recipientId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.recipientId === recipientId && !n.isRead)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findUrgentByRecipient(recipientId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.recipientId === recipientId && n.priority === 'URGENT')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getStats(recipientId?: number): Promise<NotificationStats> {
    let notifications = Array.from(this.notifications.values());
    
    if (recipientId) {
      notifications = notifications.filter(n => n.recipientId === recipientId);
    }

    const stats: NotificationStats = {
      total: notifications.length,
      unread: notifications.filter(n => !n.isRead).length,
      read: notifications.filter(n => n.isRead).length,
      lowPriority: notifications.filter(n => n.priority === 'LOW').length,
      mediumPriority: notifications.filter(n => n.priority === 'MEDIUM').length,
      highPriority: notifications.filter(n => n.priority === 'HIGH').length,
      urgentPriority: notifications.filter(n => n.priority === 'URGENT').length,
      appointmentNotifications: notifications.filter(n => 
        n.type.startsWith('APPOINTMENT_') || n.type === 'CHECK_IN_CONFIRMED'
      ).length,
      paymentNotifications: notifications.filter(n => 
        n.type.startsWith('PAYMENT_') || n.type === 'REFUND_PROCESSED'
      ).length,
      diagnosticNotifications: notifications.filter(n => 
        n.type === 'PREPARATION_INSTRUCTION' || n.type === 'RESULT_READY'
      ).length,
      reviewNotifications: notifications.filter(n => n.type === 'NEW_REVIEW').length,
      systemNotifications: notifications.filter(n => n.type === 'SYSTEM_ALERT').length,
    };

    return stats;
  }

  async getBadge(recipientId: number): Promise<NotificationBadge> {
    const unread = await this.findUnreadByRecipient(recipientId);
    const urgent = await this.findUrgentByRecipient(recipientId);

    return {
      unreadCount: unread.length,
      urgentCount: urgent.length,
    };
  }

  async getSummary(recipientId: number): Promise<NotificationSummary> {
    const notifications = await this.findByRecipient(recipientId, 'patient');
    const today = new Date().toISOString().split('T')[0];
    
    const todayNotifications = notifications.filter(n => 
      n.createdAt.split('T')[0] === today
    );

    const urgentNotifications = notifications.filter(n => n.priority === 'URGENT');

    return {
      totalNotifications: notifications.length,
      unreadNotifications: notifications.filter(n => !n.isRead).length,
      latestNotification: notifications[0] || undefined,
      todayNotifications: todayNotifications.length,
      urgentNotifications: urgentNotifications.length,
    };
  }

  async getPreferences(recipientId: number, recipientType: string): Promise<NotificationPreferences> {
    const key = `${recipientType}_${recipientId}`;
    const existing = this.preferences.get(key);
    
    if (existing) {
      return existing;
    }

    // Return default preferences
    const defaultPreferences: NotificationPreferences = {
      appointmentBooked: true,
      appointmentReminder: true,
      appointmentCancelled: true,
      appointmentRescheduled: true,
      checkInConfirmed: true,
      queueUpdates: true,
      paymentSuccess: true,
      paymentFailed: true,
      refundProcessed: true,
      preparationInstruction: true,
      resultReady: true,
      newReview: true,
      systemAlerts: true,
    };

    this.preferences.set(key, defaultPreferences);
    return defaultPreferences;
  }

  async updatePreferences(
    recipientId: number,
    recipientType: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const current = await this.getPreferences(recipientId, recipientType);
    const updated = { ...current, ...preferences };
    const key = `${recipientType}_${recipientId}`;
    this.preferences.set(key, updated);
    return updated;
  }

  async deleteOldNotifications(daysOld: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const cutoffString = cutoffDate.toISOString();

    let deletedCount = 0;
    for (const [id, notification] of this.notifications.entries()) {
      if (notification.createdAt < cutoffString) {
        this.notifications.delete(id);
        deletedCount++;
      }
    }

    return deletedCount;
  }

  async archiveOldNotifications(daysOld: number): Promise<number> {
    // In a real implementation, this would move old notifications to an archive table
    // For in-memory implementation, we'll just count how many would be archived
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const cutoffString = cutoffDate.toISOString();

    let archiveCount = 0;
    for (const notification of this.notifications.values()) {
      if (notification.createdAt < cutoffString) {
        archiveCount++;
      }
    }

    return archiveCount;
  }
}

// Export a singleton instance for use across the application
export const notificationRepository = new InMemoryNotificationRepository();