'use client';

import { NotificationsPage } from '@/components/notifications/NotificationsPage';

export default function PatientNotificationsPage() {
  return (
    <NotificationsPage
      layoutRole="patient"
      title="Notifications"
      showPreferences
    />
  );
}
