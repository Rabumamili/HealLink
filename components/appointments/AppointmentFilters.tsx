// components/appointments/AppointmentFilters.tsx
'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AppointmentStatus } from '@/types/entities/appointment.types';
import { cn } from '@/lib/utils';

interface AppointmentFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  dateFilter?: string;
  onDateChange?: (value: string) => void;
  placeholder?: string;
  showDateFilter?: boolean;
  className?: string;
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'Scheduled', label: 'Scheduled' },
  { value: 'Confirmed', label: 'Confirmed' },
  { value: 'Checked-in', label: 'Checked-in' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
  { value: 'No-show', label: 'No-show' },
];

export function AppointmentFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateFilter,
  onDateChange,
  placeholder = "Search by patient name or ID...",
  showDateFilter = false,
  className,
}: AppointmentFiltersProps) {
  return (
    <div className={cn("bg-white rounded-2xl border border-[#bcc9c8]/20 shadow-sm overflow-hidden mb-6", className)}>
      <div className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6d7979]" />
            <Input
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-[#f8fafc] border-0 rounded-xl focus:ring-2 focus:ring-[#006767]/20"
            />
          </div>
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full sm:w-[180px] bg-[#f8fafc] border-0 rounded-xl">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showDateFilter && onDateChange && (
            <Input
              type="date"
              value={dateFilter || ''}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full sm:w-[180px] bg-[#f8fafc] border-0 rounded-xl"
            />
          )}
        </div>
      </div>
    </div>
  );
}