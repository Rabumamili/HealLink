// hooks/useAnalytics.ts
import { useEffect, useMemo, useCallback, useState } from 'react';
import { useAnalyticsStore } from '@/stores/slices/analyticsSlice'; // Fixed import path
import { analyticsService } from '@/services/analytics.service';
import { AnalyticsQueryParams } from '@/types/entities/analytics.types';

// Main analytics hook
export const useAnalytics = (type: 'clinic' | 'diagnostic' | 'doctor') => {
  const {
    clinicData,
    diagnosticData,
    doctorData,
    isLoading,
    error,
    period,
    fetchClinicAnalytics,
    fetchDiagnosticAnalytics,
    fetchDoctorAnalytics,
    setPeriod,
    clearError,
  } = useAnalyticsStore();

  useEffect(() => {
    if (type === 'clinic' && !clinicData) {
      fetchClinicAnalytics();
    } else if (type === 'diagnostic' && !diagnosticData) {
      fetchDiagnosticAnalytics();
    } else if (type === 'doctor' && !doctorData) {
      fetchDoctorAnalytics();
    }
  }, [type, clinicData, diagnosticData, doctorData, fetchClinicAnalytics, fetchDiagnosticAnalytics, fetchDoctorAnalytics]); // Fixed dependencies

  const data = useMemo(() => {
    switch (type) {
      case 'clinic': return clinicData;
      case 'diagnostic': return diagnosticData;
      case 'doctor': return doctorData;
      default: return null;
    }
  }, [type, clinicData, diagnosticData, doctorData]);

  const refetch = useCallback((params?: AnalyticsQueryParams) => {
    if (type === 'clinic') {
      fetchClinicAnalytics(params);
    } else if (type === 'diagnostic') {
      fetchDiagnosticAnalytics(params);
    } else if (type === 'doctor') {
      fetchDoctorAnalytics(undefined, params);
    }
  }, [type, fetchClinicAnalytics, fetchDiagnosticAnalytics, fetchDoctorAnalytics]);

  return {
    data,
    isLoading,
    error,
    period,
    setPeriod,
    refetch,
    clearError,
  };
};

// Hook for revenue analytics
export const useRevenueAnalytics = () => {
  const { clinicData, diagnosticData, isLoading } = useAnalyticsStore();
  
  const revenueData = useMemo(() => {
    if (clinicData?.revenue) {
      return {
        total: clinicData.revenue.total,
        change: clinicData.revenue.change,
        trend: clinicData.revenue.trend,
        data: clinicData.revenue.data || clinicData.monthlyData?.revenue || [],
      };
    }
    if (diagnosticData?.revenue) {
      return {
        total: diagnosticData.revenue.total,
        change: diagnosticData.revenue.change,
        trend: diagnosticData.revenue.trend,
        data: diagnosticData.revenue.weeklyData || [],
      };
    }
    return null;
  }, [clinicData, diagnosticData]);

  return { revenueData, isLoading };
};

// Hook for appointment analytics
export const useAppointmentAnalytics = () => {
  const { clinicData, isLoading } = useAnalyticsStore();
  
  const appointmentData = useMemo(() => {
    if (clinicData?.appointments) {
      return {
        total: clinicData.appointments.total,
        change: clinicData.appointments.change,
        trend: clinicData.appointments.trend,
        completed: clinicData.appointments.completed,
        cancelled: clinicData.appointments.cancelled,
        noShow: clinicData.appointments.noShow,
        completionRate: (clinicData.appointments.completed / clinicData.appointments.total) * 100,
      };
    }
    return null;
  }, [clinicData]);

  return { appointmentData, isLoading };
};

// Hook for service breakdown
export const useServiceBreakdown = () => {
  const { clinicData, diagnosticData, isLoading } = useAnalyticsStore();
  
  const services = useMemo(() => {
    if (clinicData?.serviceBreakdown) {
      return clinicData.serviceBreakdown;
    }
    if (diagnosticData?.popularTests) {
      return diagnosticData.popularTests.map(test => ({
        name: test.name,
        count: 0, // Popular tests might not have count
        percentage: test.percentage,
        revenue: test.revenue,
      }));
    }
    return [];
  }, [clinicData, diagnosticData]);

  return { services, isLoading };
};

// Hook for export functionality
export const useAnalyticsExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportData = useCallback(async (
    type: 'clinic' | 'diagnostic' | 'doctor',
    format: 'pdf' | 'csv' | 'excel',
    params?: AnalyticsQueryParams
  ) => {
    setIsExporting(true);
    setExportError(null);
    try {
      await analyticsService.downloadReport(type, format as 'pdf' | 'csv', params);
    } catch (error: any) {
      setExportError(error.message || 'Failed to export data');
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { exportData, isExporting, exportError };
};

// Hook for real-time analytics
export const useRealTimeAnalytics = (refreshInterval: number = 30000) => {
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    const fetchRealTimeData = async () => {
      try {
        const data = await analyticsService.getRealTimeAnalytics();
        setRealTimeData(data);
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);
        console.error('Error fetching real-time data:', error);
      }
    };

    fetchRealTimeData();
    intervalId = setInterval(fetchRealTimeData, refreshInterval);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [refreshInterval]);

  return { realTimeData, isConnected };
};

// Hook for comparative analytics
export const useComparativeAnalytics = () => {
  const [comparison, setComparison] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const comparePeriods = useCallback(async (
    currentPeriod: AnalyticsQueryParams,
    previousPeriod: AnalyticsQueryParams
  ) => {
    setIsLoading(true);
    try {
      const data = await analyticsService.getComparativeAnalytics(currentPeriod, previousPeriod);
      setComparison(data);
      return data;
    } catch (error) {
      console.error('Failed to compare periods:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { comparison, isLoading, comparePeriods };
};