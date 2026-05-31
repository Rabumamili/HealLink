'use client';

import { Building2 } from 'lucide-react';
import { NotificationsPage } from '@/components/notifications/NotificationsPage';

export default function ClinicNotificationsPage() {
  return (
    <NotificationsPage
      layoutRole="clinic"
      title="Clinic Notifications"
      headerIcon={Building2}
      variant="clinic"
    />
  );
}
