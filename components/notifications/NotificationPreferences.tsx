// components/notifications/NotificationPreferences.tsx
import React from 'react';
import { NotificationPreferences as PreferencesType } from '../../types/entities/notification.types';

interface NotificationPreferencesProps {
  preferences: PreferencesType;
  onUpdate: (preferences: Partial<PreferencesType>) => void;
  isLoading?: boolean;
}

export const NotificationPreferencesComponent: React.FC<NotificationPreferencesProps> = ({
  preferences,
  onUpdate,
  isLoading,
}) => {
  const preferenceSections = [
    {
      title: 'Appointment Notifications',
      items: [
        { key: 'appointmentBooked', label: 'Appointment Booked' },
        { key: 'appointmentReminder', label: 'Appointment Reminders' },
        { key: 'appointmentCancelled', label: 'Appointment Cancelled' },
        { key: 'appointmentRescheduled', label: 'Appointment Rescheduled' },
        { key: 'checkInConfirmed', label: 'Check-in Confirmed' },
        { key: 'queueUpdates', label: 'Queue Updates' },
      ] as const,
    },
    {
      title: 'Payment Notifications',
      items: [
        { key: 'paymentSuccess', label: 'Payment Success' },
        { key: 'paymentFailed', label: 'Payment Failed' },
        { key: 'refundProcessed', label: 'Refund Processed' },
      ] as const,
    },
    {
      title: 'Medical Notifications',
      items: [
        { key: 'preparationInstruction', label: 'Preparation Instructions' },
        { key: 'resultReady', label: 'Results Ready' },
      ] as const,
    },
    {
      title: 'Other Notifications',
      items: [
        { key: 'newReview', label: 'New Reviews' },
        { key: 'systemAlerts', label: 'System Alerts' },
      ] as const,
    },
  ];

  const handleToggleAll = (enabled: boolean) => {
    const updates: Partial<PreferencesType> = {};
    Object.keys(preferences).forEach((key) => {
      updates[key as keyof PreferencesType] = enabled;
    });
    onUpdate(updates);
  };

  const handleToggleItem = (key: keyof PreferencesType, value: boolean) => {
    onUpdate({ [key]: value });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
        <div className="space-x-2">
          <button
            onClick={() => handleToggleAll(true)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Enable All
          </button>
          <button
            onClick={() => handleToggleAll(false)}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Disable All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {preferenceSections.map((section) => (
          <div key={section.title} className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">{section.title}</h3>
            <div className="space-y-2">
              {section.items.map((item) => (
                <label key={item.key} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={preferences[item.key]}
                    onChange={(e) => handleToggleItem(item.key, e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};