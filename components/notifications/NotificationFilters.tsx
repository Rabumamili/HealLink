// components/notifications/NotificationFilters.tsx
import React from 'react';
import { NotificationFilters, NotificationType, NotificationPriority } from '../../types/entities/notification.types';

interface NotificationFiltersProps {
  filters: NotificationFilters;
  onFilterChange: (filters: NotificationFilters) => void;
  onReset: () => void;
}

export const NotificationFiltersComponent: React.FC<NotificationFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const notificationTypes: { value: NotificationType | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'APPOINTMENT_BOOKED', label: 'Appointment Booked' },
    { value: 'APPOINTMENT_REMINDER', label: 'Reminders' },
    { value: 'APPOINTMENT_CANCELLED', label: 'Cancelled' },
    { value: 'APPOINTMENT_RESCHEDULED', label: 'Rescheduled' },
    { value: 'CHECK_IN_CONFIRMED', label: 'Check-ins' },
    { value: 'PAYMENT_SUCCESS', label: 'Payments' },
    { value: 'RESULT_READY', label: 'Results' },
    { value: 'SYSTEM_ALERT', label: 'System Alerts' },
  ];

  const priorities: { value: NotificationPriority | 'all'; label: string }[] = [
    { value: 'all', label: 'All Priorities' },
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'URGENT', label: 'Urgent' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button
          onClick={onReset}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Reset All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notification Type
          </label>
          <select
            value={filters.type || 'all'}
            onChange={(e) => onFilterChange({ type: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {notificationTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            value={filters.priority || 'all'}
            onChange={(e) => onFilterChange({ priority: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {priorities.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.isRead === undefined ? 'all' : filters.isRead ? 'read' : 'unread'}
            onChange={(e) => {
              const value = e.target.value;
              onFilterChange({
                isRead: value === 'all' ? undefined : value === 'read',
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => onFilterChange({ startDate: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => onFilterChange({ endDate: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Search notifications..."
            value={filters.searchTerm || ''}
            onChange={(e) => onFilterChange({ searchTerm: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};