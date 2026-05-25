//components/common/TabsFilter.tsx
'use client';
// components/common/TabsFilter.tsx
'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TabOption {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
  disabled?: boolean;
}

interface TabsFilterProps {
  tabs: TabOption[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'rounded';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullWidth?: boolean;
}

const variantStyles = {
  default: {
    container: "bg-[#EFF4FF] p-1.5 rounded-xl",
    tab: (isActive: boolean) => cn(
      "px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
      isActive
        ? "bg-white shadow-sm text-[#006767]"
        : "text-[#6d7979] hover:text-[#0b1c30] hover:bg-white/50"
    ),
  },
  pills: {
    container: "bg-transparent flex gap-2",
    tab: (isActive: boolean) => cn(
      "px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2",
      isActive
        ? "bg-[#006767] text-white shadow-sm"
        : "bg-[#EFF4FF] text-[#6d7979] hover:bg-[#EFF4FF]/80 hover:text-[#0b1c30]"
    ),
  },
  underline: {
    container: "bg-transparent border-b border-[#E0E7FF]",
    tab: (isActive: boolean) => cn(
      "px-4 py-2 text-sm font-semibold transition-all flex items-center gap-2 border-b-2",
      isActive
        ? "border-[#006767] text-[#006767]"
        : "border-transparent text-[#6d7979] hover:text-[#0b1c30] hover:border-[#BCC9C8]"
    ),
  },
  rounded: {
    container: "bg-white border border-[#E0E7FF] p-1 rounded-xl shadow-sm",
    tab: (isActive: boolean) => cn(
      "px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
      isActive
        ? "bg-[#006767] text-white shadow-sm"
        : "text-[#6d7979] hover:bg-[#EFF4FF] hover:text-[#0b1c30]"
    ),
  },
};

const sizeStyles = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-5 py-2",
  lg: "text-base px-6 py-2.5",
};

export function TabsFilter({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  className,
  fullWidth = false,
}: TabsFilterProps) {
  const styles = variantStyles[variant];

  return (
    <div className={cn(styles.container, fullWidth && "w-full", className)}>
      <div className={cn("flex", fullWidth ? "w-full" : "w-fit", variant === 'pills' ? "flex-wrap gap-2" : "gap-1")}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            disabled={tab.disabled}
            className={cn(
              styles.tab(activeTab === tab.id),
              sizeStyles[size],
              fullWidth && "flex-1 justify-center",
              tab.disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={cn(
                "text-xs ml-1 px-1.5 py-0.5 rounded-full",
                activeTab === tab.id
                  ? variant === 'underline'
                    ? "bg-[#006767]/10 text-[#006767]"
                    : "bg-white/20 text-current"
                  : "bg-[#E0E7FF] text-[#6d7979]"
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}