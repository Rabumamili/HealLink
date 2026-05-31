'use client';

import { useEffect } from 'react';
import {
  useNotificationRecipient,
  useNotifications,
} from '@/hooks/useNotifications';
import type { PortalLayoutRole } from '@/types/entities/notification.types';

interface NotificationBellBadgeProps {
  layoutRole: PortalLayoutRole;
}

/** Subscribes to unread badge for the header bell; no UI of its own. */
export function NotificationBellBadge({ layoutRole }: NotificationBellBadgeProps) {
  const recipient = useNotificationRecipient(layoutRole);
  const { startBadgeAutoRefresh } = useNotifications();

  useEffect(() => {
    if (!recipient) return;
    return startBadgeAutoRefresh(recipient.recipientId);
  }, [recipient, startBadgeAutoRefresh]);

  return null;
}
