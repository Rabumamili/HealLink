// components/common/stats/StatsCard.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info'; // Add variant prop
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const variantStyles = {
  default: "bg-white",
  primary: "bg-blue-50",
  success: "bg-green-50",
  warning: "bg-yellow-50",
  info: "bg-teal-50",
};

const iconVariantStyles = {
  default: "text-gray-600",
  primary: "text-blue-600",
  success: "text-green-600",
  warning: "text-yellow-600",
  info: "text-teal-600",
};

const bgVariantStyles = {
  default: "bg-gray-50",
  primary: "bg-blue-100",
  success: "bg-green-100",
  warning: "bg-yellow-100",
  info: "bg-teal-100",
};

export function StatsCard({ 
  title, 
  value, 
  icon, 
  description, 
  variant = "default",
  trend, 
  className 
}: StatsCardProps) {
  return (
    <Card className={cn("hover:shadow-lg transition-shadow", variantStyles[variant], className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={cn(
              "text-2xl font-bold mt-2",
              variant === "primary" && "text-blue-600",
              variant === "success" && "text-green-600",
              variant === "warning" && "text-yellow-600",
              variant === "info" && "text-teal-600"
            )}>{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {trend && (
              <p className={cn(
                "text-xs mt-2",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
              </p>
            )}
          </div>
          <div className={cn("p-3 rounded-xl", bgVariantStyles[variant])}>
            <div className={cn("h-6 w-6", iconVariantStyles[variant])}>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}