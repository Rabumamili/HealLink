// components/services/service-search-filter.tsx
'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ServiceSearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  serviceTypeFilter?: string;
  onServiceTypeFilterChange?: (value: string) => void;
  serviceTypeOptions?: { value: string; label: string }[];
  statusOptions?: { value: string; label: string }[];
  placeholder?: string;
  showAdvancedFilters?: boolean;
}

export function ServiceSearchFilter({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  serviceTypeFilter,
  onServiceTypeFilterChange,
  serviceTypeOptions = [],
  statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ],
  placeholder = 'Search services...',
  showAdvancedFilters = false
}: ServiceSearchFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempStatusFilter, setTempStatusFilter] = useState(statusFilter);
  const [tempServiceTypeFilter, setTempServiceTypeFilter] = useState(serviceTypeFilter || 'all');

  const hasActiveFilters = statusFilter !== 'all' || (serviceTypeFilter && serviceTypeFilter !== 'all');

  const handleApplyFilters = () => {
    onStatusFilterChange(tempStatusFilter);
    if (onServiceTypeFilterChange && tempServiceTypeFilter) {
      onServiceTypeFilterChange(tempServiceTypeFilter);
    }
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setTempStatusFilter('all');
    setTempServiceTypeFilter('all');
    onStatusFilterChange('all');
    if (onServiceTypeFilterChange) {
      onServiceTypeFilterChange('all');
    }
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setTempStatusFilter('all');
    setTempServiceTypeFilter('all');
    onStatusFilterChange('all');
    if (onServiceTypeFilterChange) {
      onServiceTypeFilterChange('all');
    }
    onSearchChange('');
  };

  return (
    <div className="bg-white rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center border border-gray-200 shadow-sm">
      {/* Search Input */}
      <div className="relative flex-grow w-full">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          className="w-full bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent rounded-lg pl-12 pr-4 py-3 text-base outline-none transition-all"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Status Select */}
      <div className="flex gap-2 w-full md:w-auto">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full md:w-[160px] bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-teal-500 rounded-lg py-3">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Advanced Filters Popover */}
        {(showAdvancedFilters || serviceTypeOptions.length > 0) && (
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "p-3 bg-gray-50 rounded-lg relative",
                  hasActiveFilters && "border-teal-500 bg-teal-50"
                )}
              >
                <Filter className="h-5 w-5" />
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-teal-500 rounded-full"></span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Advanced Filters</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClearFilters}
                    className="text-sm text-gray-500"
                  >
                    Clear all
                  </Button>
                </div>

                {/* Service Type Filter */}
                {serviceTypeOptions.length > 0 && onServiceTypeFilterChange && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Service Type</label>
                    <Select 
                      value={tempServiceTypeFilter} 
                      onValueChange={setTempServiceTypeFilter}
                    >
                      <SelectTrigger className="w-full bg-gray-50 border border-gray-200">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {serviceTypeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Status Filter (additional) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <Select value={tempStatusFilter} onValueChange={setTempStatusFilter}>
                    <SelectTrigger className="w-full bg-gray-50 border border-gray-200">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={handleClearFilters}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleApplyFilters}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Reset All Button */}
        {(searchTerm || statusFilter !== 'all' || (serviceTypeFilter && serviceTypeFilter !== 'all')) && (
          <Button 
            variant="ghost" 
            onClick={handleResetFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            Reset
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          {statusFilter !== 'all' && (
            <Badge className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full">
              Status: {statusFilter}
              <button
                onClick={() => onStatusFilterChange('all')}
                className="ml-2 hover:text-teal-900"
              >
                ×
              </button>
            </Badge>
          )}
          {serviceTypeFilter && serviceTypeFilter !== 'all' && onServiceTypeFilterChange && (
            <Badge className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full">
              Type: {serviceTypeOptions.find(opt => opt.value === serviceTypeFilter)?.label || serviceTypeFilter}
              <button
                onClick={() => onServiceTypeFilterChange('all')}
                className="ml-2 hover:text-teal-900"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}