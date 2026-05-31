'use client';

import { FlaskConical } from 'lucide-react';
import { NotificationsPage } from '@/components/notifications/NotificationsPage';

export default function DiagnosticCenterNotificationsPage() {
  return (
    <NotificationsPage
      layoutRole="diagnosticCenter"
      title="Diagnostic Center Notifications"
      headerIcon={FlaskConical}
      variant="diagnostic"
    />
  );
}
