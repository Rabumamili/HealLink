// components/profile/DangerZone.tsx
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DangerZoneProps {
  title?: string;
  description?: string;
  onDeleteAccount: () => Promise<boolean>;
  onExportData?: () => Promise<void>;
  isDeleting?: boolean;
  isExporting?: boolean;
  extraActions?: ReactNode;
}

export const DangerZone = ({
  title = 'Danger Zone',
  description = 'Irreversible actions for your account',
  onDeleteAccount,
  onExportData,
  isDeleting,
  isExporting,
  extraActions,
}: DangerZoneProps) => {
  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 flex-wrap">
          {onExportData && (
            <Button
              variant="outline"
              onClick={onExportData}
              disabled={isExporting}
            >
              Export Data
            </Button>
          )}

          {extraActions}
        </div>

        <Button
          variant="destructive"
          onClick={onDeleteAccount}
          disabled={isDeleting}
        >
          Delete Account
        </Button>
      </CardContent>
    </Card>
  );
};