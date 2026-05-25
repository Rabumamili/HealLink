// components/common/DangerZone.tsx
'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Trash2, AlertCircle, Download, Archive, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface DangerAction {
  id: string;
  label: string;
  description: string;
  variant: 'delete' | 'archive' | 'reset' | 'clear' | 'deactivate';
  dangerLevel: 'low' | 'medium' | 'high' | 'critical';
  requiresConfirmation?: boolean;
  confirmationText?: string;
  requireTyping?: boolean;
  onAction: () => Promise<void> | void;
}

interface DangerZoneProps {
  title?: string;
  description?: string;
  actions?: DangerAction[];
  showDefaultActions?: boolean;
  entityName?: string;
  entityType?: 'account' | 'profile' | 'data' | 'appointment' | 'service' | 'schedule';
  className?: string;
  onDelete?: () => Promise<void>;
  onArchive?: () => Promise<void>;
  onReset?: () => Promise<void>;
  onClear?: () => Promise<void>;
  onDeactivate?: () => Promise<void>;
}

const actionConfig = {
  delete: {
    icon: Trash2,
    color: 'red',
    defaultLabel: 'Delete',
    defaultDescription: 'This action cannot be undone. This will permanently remove the item.',
  },
  archive: {
    icon: Archive,
    color: 'yellow',
    defaultLabel: 'Archive',
    defaultDescription: 'This item will be moved to archive. You can restore it later.',
  },
  reset: {
    icon: RefreshCw,
    color: 'orange',
    defaultLabel: 'Reset',
    defaultDescription: 'This will reset all settings to their default values.',
  },
  clear: {
    icon: AlertTriangle,
    color: 'red',
    defaultLabel: 'Clear All',
    defaultDescription: 'This will permanently clear all data.',
  },
  deactivate: {
    icon: AlertCircle,
    color: 'orange',
    defaultLabel: 'Deactivate',
    defaultDescription: 'This account will be deactivated and cannot be used until reactivated.',
  },
};

const colorStyles = {
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-600',
    button: 'bg-red-600 hover:bg-red-700 focus:ring-red-600',
    icon: 'text-red-500',
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-600',
    button: 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-600',
    icon: 'text-orange-500',
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-600',
    button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-600',
    icon: 'text-yellow-500',
  },
};

export function DangerZone({
  title = "Danger Zone",
  description = "Irreversible actions that can affect your data",
  actions = [],
  showDefaultActions = false,
  entityName,
  entityType = 'data',
  className,
  onDelete,
  onArchive,
  onReset,
  onClear,
  onDeactivate,
}: DangerZoneProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState('');
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  // Default actions
  const defaultActions: DangerAction[] = [];
  
  if (showDefaultActions) {
    if (onDelete) {
      defaultActions.push({
        id: 'delete',
        label: `Delete ${entityName || entityType}`,
        description: `Permanently remove this ${entityName || entityType}. This action cannot be undone.`,
        variant: 'delete',
        dangerLevel: 'critical',
        requiresConfirmation: true,
        confirmationText: `delete ${entityName || entityType}`,
        requireTyping: true,
        onAction: onDelete,
      });
    }
    if (onArchive) {
      defaultActions.push({
        id: 'archive',
        label: `Archive ${entityName || entityType}`,
        description: `Move this ${entityName || entityType} to archive. You can restore it later.`,
        variant: 'archive',
        dangerLevel: 'medium',
        requiresConfirmation: true,
        onAction: onArchive,
      });
    }
    if (onReset) {
      defaultActions.push({
        id: 'reset',
        label: 'Reset Settings',
        description: 'Reset all settings to their default values.',
        variant: 'reset',
        dangerLevel: 'high',
        requiresConfirmation: true,
        confirmationText: 'reset',
        requireTyping: true,
        onAction: onReset,
      });
    }
    if (onClear) {
      defaultActions.push({
        id: 'clear',
        label: 'Clear All Data',
        description: 'Permanently clear all your data. This action cannot be undone.',
        variant: 'clear',
        dangerLevel: 'critical',
        requiresConfirmation: true,
        confirmationText: 'clear all',
        requireTyping: true,
        onAction: onClear,
      });
    }
    if (onDeactivate) {
      defaultActions.push({
        id: 'deactivate',
        label: `Deactivate ${entityName || 'Account'}`,
        description: `Deactivate this ${entityName || 'account'}. You can reactivate it later by contacting support.`,
        variant: 'deactivate',
        dangerLevel: 'high',
        requiresConfirmation: true,
        onAction: onDeactivate,
      });
    }
  }

  const allActions = [...defaultActions, ...actions];

  if (allActions.length === 0) {
    return null;
  }

  const handleAction = async (action: DangerAction) => {
    if (action.requiresConfirmation && action.confirmationText && action.requireTyping) {
      if (confirmText !== action.confirmationText) {
        toast.error(`Please type "${action.confirmationText}" to confirm`);
        return;
      }
    }

    setIsLoading(action.id);
    try {
      await action.onAction();
      toast.success(`${action.label} completed successfully`);
      setOpenDialog(null);
      setConfirmText('');
    } catch (error) {
      toast.error(`Failed to ${action.label.toLowerCase()}. Please try again.`);
    } finally {
      setIsLoading(null);
    }
  };

  const getDangerLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <Card className={cn("border-2 border-red-200 bg-red-50/30", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {allActions.map((action) => {
          const config = actionConfig[action.variant];
          const Icon = config.icon;
          const colors = colorStyles[config.color as keyof typeof colorStyles];

          return (
            <div
              key={action.id}
              className={cn(
                "p-4 rounded-lg border",
                colors.bg,
                colors.border
              )}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex gap-3">
                  <div className={cn("flex-shrink-0", colors.icon)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className={cn("font-semibold", colors.text)}>
                      {action.label}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {action.description}
                    </p>
                    {action.dangerLevel === 'critical' && (
                      <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Critical action - Cannot be undone
                      </p>
                    )}
                  </div>
                </div>

                <AlertDialog
                  open={openDialog === action.id}
                  onOpenChange={(open) => {
                    setOpenDialog(open ? action.id : null);
                    if (!open) setConfirmText('');
                  }}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className={cn(
                        "shrink-0",
                        action.variant === 'archive' && "bg-yellow-600 hover:bg-yellow-700",
                        action.variant === 'reset' && "bg-orange-600 hover:bg-orange-700"
                      )}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {action.label}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        {action.label}
                      </AlertDialogTitle>
                      <AlertDialogDescription className="space-y-3">
                        <p>{action.description}</p>
                        {action.requiresConfirmation && (
                          <div className={cn(
                            "p-3 rounded-lg border",
                            getDangerLevelColor(action.dangerLevel)
                          )}>
                            <p className="text-sm font-semibold mb-2">
                              ⚠️ Warning: This action is {action.dangerLevel === 'critical' ? 'irreversible' : action.dangerLevel === 'high' ? 'permanent' : 'significant'}
                            </p>
                            {action.confirmationText && action.requireTyping && (
                              <>
                                <Label htmlFor="confirm" className="text-sm">
                                  Type <span className="font-mono font-bold">{action.confirmationText}</span> to confirm:
                                </Label>
                                <Input
                                  id="confirm"
                                  type="text"
                                  value={confirmText}
                                  onChange={(e) => setConfirmText(e.target.value)}
                                  placeholder={`Type "${action.confirmationText}"`}
                                  className="mt-2"
                                  autoFocus
                                />
                              </>
                            )}
                            {!action.requireTyping && (
                              <p className="text-sm mt-2">
                                Are you absolutely sure you want to proceed?
                              </p>
                            )}
                          </div>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleAction(action)}
                        disabled={isLoading === action.id || (action.requireTyping && confirmText !== action.confirmationText)}
                        className={cn(
                          "text-white",
                          action.variant === 'delete' && "bg-red-600 hover:bg-red-700",
                          action.variant === 'archive' && "bg-yellow-600 hover:bg-yellow-700",
                          action.variant === 'reset' && "bg-orange-600 hover:bg-orange-700",
                          action.variant === 'clear' && "bg-red-600 hover:bg-red-700",
                          action.variant === 'deactivate' && "bg-orange-600 hover:bg-orange-700"
                        )}
                      >
                        {isLoading === action.id ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Processing...
                          </div>
                        ) : (
                          action.label
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          );
        })}
      </CardContent>
      <CardFooter className="border-t border-red-100 pt-4">
        <p className="text-xs text-gray-500">
          ⚠️ Please be careful with these actions. Some changes cannot be reversed.
        </p>
      </CardFooter>
    </Card>
  );
}

// Export a simplified version for common use cases
export function SimpleDangerZone({
  onDelete,
  entityName = "item",
  className,
}: {
  onDelete: () => Promise<void>;
  entityName?: string;
  className?: string;
}) {
  return (
    <DangerZone
      title="Delete Item"
      description={`Permanently delete this ${entityName}`}
      actions={[
        {
          id: 'delete',
          label: `Delete ${entityName}`,
          description: `This will permanently remove this ${entityName}. This action cannot be undone.`,
          variant: 'delete',
          dangerLevel: 'critical',
          requiresConfirmation: true,
          confirmationText: `delete ${entityName}`,
          requireTyping: true,
          onAction: onDelete,
        },
      ]}
      className={className}
    />
  );
}