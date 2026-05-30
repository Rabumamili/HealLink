// components/notifications/NotificationCard.tsx
import React from 'react';
import { Notification, NotificationTypeLabels, NotificationPriorityConfig } from '../../types/entities/notification.types';
import { Bell, CheckCircle, XCircle, Calendar, DollarSign, FileText, Star, AlertCircle, ChevronRight } from 'lucide-react';

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead?: (id: number) => void;
  onMarkAsUnread?: (id: number) => void;
  onDelete?: (id: number) => void;
  onClick?: (notification: Notification) => void;
  showActions?: boolean;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  onClick,
  showActions = true,
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'APPOINTMENT_BOOKED':
      case 'APPOINTMENT_REMINDER':
      case 'APPOINTMENT_CANCELLED':
      case 'APPOINTMENT_RESCHEDULED':
      case 'CHECK_IN_CONFIRMED':
        return <Calendar className="w-5 h-5" />;
      case 'PAYMENT_SUCCESS':
      case 'PAYMENT_FAILED':
      case 'REFUND_PROCESSED':
        return <DollarSign className="w-5 h-5" />;
      case 'RESULT_READY':
      case 'PREPARATION_INSTRUCTION':
        return <FileText className="w-5 h-5" />;
      case 'NEW_REVIEW':
        return <Star className="w-5 h-5" />;
      case 'SYSTEM_ALERT':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const priorityConfig = NotificationPriorityConfig[notification.priority];
  const typeLabel = NotificationTypeLabels[notification.type];

  return (
    <div
      className={`relative p-4 border rounded-lg transition-all cursor-pointer hover:shadow-md ${
        !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
      }`}
      onClick={() => onClick?.(notification)}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`p-2 rounded-full ${
          !notification.isRead ? 'bg-blue-100' : 'bg-gray-100'
        }`}>
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <h3 className={`text-sm font-semibold ${
                !notification.isRead ? 'text-gray-900' : 'text-gray-700'
              }`}>
                {notification.title}
              </h3>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                priorityConfig.color === 'error' ? 'bg-red-100 text-red-800' :
                priorityConfig.color === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                priorityConfig.color === 'info' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {priorityConfig.label}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(notification.createdAt).toLocaleDateString()} at{' '}
              {new Date(notification.createdAt).toLocaleTimeString()}
            </span>
          </div>

          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500">{typeLabel}</span>
            {!notification.isRead && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                New
              </span>
            )}
          </div>

          {notification.actionUrl && (
            <div className="mt-2">
              <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                View Details <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-1">
            {!notification.isRead && onMarkAsRead && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(notification.id);
                }}
                className="p-1 text-green-600 hover:text-green-800 transition-colors"
                title="Mark as read"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
            {notification.isRead && onMarkAsUnread && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsUnread(notification.id);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Mark as unread"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
                className="p-1 text-red-600 hover:text-red-800 transition-colors"
                title="Delete"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};