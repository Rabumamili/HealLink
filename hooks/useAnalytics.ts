// hooks/useAnalytics.ts
import { useEffect, useMemo, useCallback, useState } from 'react';
import { useAnalyticsStore } from '@/stores/slices/analyticsSlice'; // Fixed import path - changed from slices/analyticsSlice
import { analyticsService } from '@/services/analytics.service';
import { AnalyticsQueryParams } from '@/types/entities/analytics.types'; // Fixed import path

// Main analytics hook
export const useAnalytics = (type: 'clinic' | 'diagnostic' | 'doctor') => {
  const {
    clinicData,
    diagnosticData,
    doctorData,
    isLoading,
    error,
    period,
    selectedDoctorId,
    fetchClinicAnalytics,
    fetchDiagnosticAnalytics,
    fetchDoctorAnalytics,
    setPeriod,
    setSelectedDoctor, // This is being destructured
    clearError,
  } = useAnalyticsStore();

  // Get the specific loading and error states for this type
  const typeIsLoading = isLoading[type];
  const typeError = error[type];

  useEffect(() => {
    if (type === 'clinic' && !clinicData) {
      fetchClinicAnalytics({ period });
    } else if (type === 'diagnostic' && !diagnosticData) {
      fetchDiagnosticAnalytics({ period });
    } else if (type === 'doctor' && !doctorData && selectedDoctorId) {
      fetchDoctorAnalytics(selectedDoctorId, { period });
    }
  }, [type, clinicData, diagnosticData, doctorData, selectedDoctorId, period, 
      fetchClinicAnalytics, fetchDiagnosticAnalytics, fetchDoctorAnalytics]);

  const data = useMemo(() => {
    switch (type) {
      case 'clinic': return clinicData;
      case 'diagnostic': return diagnosticData;
      case 'doctor': return doctorData;
      default: return null;
    }
  }, [type, clinicData, diagnosticData, doctorData]);

  const refetch = useCallback((params?: AnalyticsQueryParams) => {
    const queryParams = { period, ...params };
    
    if (type === 'clinic') {
      fetchClinicAnalytics(queryParams);
    } else if (type === 'diagnostic') {
      fetchDiagnosticAnalytics(queryParams);
    } else if (type === 'doctor' && selectedDoctorId) {
      fetchDoctorAnalytics(selectedDoctorId, queryParams);
    }
  }, [type, period, selectedDoctorId, fetchClinicAnalytics, fetchDiagnosticAnalytics, fetchDoctorAnalytics]);

  const handleSetPeriod = useCallback((newPeriod: typeof period) => {
    setPeriod(newPeriod);
  }, [setPeriod]);

  const handleClearError = useCallback(() => {
    clearError(type);
  }, [clearError, type]);

  const handleSetSelectedDoctor = useCallback((doctorId: string | null) => {
    setSelectedDoctor(doctorId);
  }, [setSelectedDoctor]);

  return {
    data,
    isLoading: typeIsLoading,
    error: typeError,
    period,
    selectedDoctorId,
    setPeriod: handleSetPeriod,
    setSelectedDoctor: handleSetSelectedDoctor, // Add this to the return object
    refetch,
    clearError: handleClearError,
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
        series: clinicData.revenue.series || [],
        trend: clinicData.revenue.trend,
      };
    }
    if (diagnosticData?.revenue) {
      return {
        total: diagnosticData.revenue.total,
        change: diagnosticData.revenue.change,
        series: diagnosticData.revenue.series || [],
        trend: diagnosticData.revenue.trend,
      };
    }
    return null;
  }, [clinicData, diagnosticData]);

  const isLoadingRevenue = isLoading.clinic || isLoading.diagnostic;

  return { revenueData, isLoading: isLoadingRevenue };
};

// Hook for appointment analytics
export const useAppointmentAnalytics = () => {
  const { clinicData, isLoading } = useAnalyticsStore();
  
  const appointmentData = useMemo(() => {
    if (clinicData?.appointments) {
      const appointments = clinicData.appointments;
      return {
        total: appointments.total,
        change: appointments.change,
        completed: appointments.completed,
        cancelled: appointments.cancelled,
        noShow: appointments.noShowCount,
        completionRate: appointments.total > 0 
          ? (appointments.completed / appointments.total) * 100 
          : 0,
        cancellationRate: appointments.total > 0
          ? (appointments.cancelled / appointments.total) * 100
          : 0,
        noShowRate: appointments.total > 0
          ? (appointments.noShowCount / appointments.total) * 100
          : 0,
      };
    }
    return null;
  }, [clinicData]);

  return { appointmentData, isLoading: isLoading.clinic };
};

// Hook for service breakdown
export const useServiceBreakdown = () => {
  const { clinicData, diagnosticData, isLoading } = useAnalyticsStore();
  
  const services = useMemo(() => {
    if (clinicData?.serviceBreakdown && clinicData.serviceBreakdown.length > 0) {
      return clinicData.serviceBreakdown;
    }
    if (diagnosticData?.serviceBreakdown && diagnosticData.serviceBreakdown.length > 0) {
      return diagnosticData.serviceBreakdown;
    }
    // Handle popularTests if available in diagnostic data
    if (diagnosticData?.popularTests) {
      return diagnosticData.popularTests.map((test: any, index: number) => ({
        id: test.id || `test-${index}`,
        name: test.name,
        count: test.count || 0,
        percentage: test.percentage || 0,
        revenue: test.revenue || 0,
      }));
    }
    return [];
  }, [clinicData, diagnosticData]);

  const isLoadingServices = isLoading.clinic || isLoading.diagnostic;

  return { services, isLoading: isLoadingServices };
};

// Hook for monthly/trend data
export const useMonthlyTrends = () => {
  const { clinicData, diagnosticData, isLoading } = useAnalyticsStore();
  
  const monthlyData = useMemo(() => {
    const data = clinicData?.monthlyData?.data || diagnosticData?.monthlyData?.data;
    
    if (data && data.length > 0) {
      return {
        labels: data.map((item: any) => item.label),
        appointments: data.map((item: any) => item.appointments),
        revenue: data.map((item: any) => item.revenue),
        rawData: data,
      };
    }
    return null;
  }, [clinicData, diagnosticData]);

  const peakHours = useMemo(() => {
    return clinicData?.peakHours || diagnosticData?.peakHours || [];
  }, [clinicData, diagnosticData]);

  const noShowRate = useMemo(() => {
    return clinicData?.noShowRate || diagnosticData?.noShowRate || null;
  }, [clinicData, diagnosticData]);

  return { 
    monthlyData, 
    peakHours, 
    noShowRate, 
    isLoading: isLoading.clinic || isLoading.diagnostic 
  };
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
      // TODO: Implement downloadReport method in AnalyticsService
      console.log('Export feature coming soon:', type, format, params);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to export data';
      setExportError(errorMessage);
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let isMounted = true;
    
    const fetchRealTimeData = async () => {
      try {
        // TODO: Implement getRealTimeAnalytics method in AnalyticsService
        // const data = await analyticsService.getRealTimeAnalytics();
        if (isMounted) {
          setRealTimeData(null);
          setIsConnected(false);
          setError('Real-time analytics feature coming soon');
        }
      } catch (error) {
        if (isMounted) {
          setIsConnected(false);
          setError('Failed to fetch real-time data');
          console.error('Error fetching real-time data:', error);
        }
      }
    };

    fetchRealTimeData();
    intervalId = setInterval(fetchRealTimeData, refreshInterval);

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [refreshInterval]);

  return { realTimeData, isConnected, error };
};

// Hook for comparative analytics
export const useComparativeAnalytics = () => {
  const [comparison, setComparison] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const comparePeriods = useCallback(async (
    currentPeriod: AnalyticsQueryParams,
    previousPeriod: AnalyticsQueryParams,
    type: string = 'clinic',
    doctorId?: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement getComparativeAnalytics method in AnalyticsService
      // const data = await analyticsService.getComparativeAnalytics(
      //   currentPeriod, 
      //   previousPeriod, 
      //   type, 
      //   doctorId
      // );
      const data = null;
      setComparison(data);
      return data;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to compare periods';
      setError(errorMessage);
      console.error('Failed to compare periods:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearComparison = useCallback(() => {
    setComparison(null);
    setError(null);
  }, []);

  return { comparison, isLoading, error, comparePeriods, clearComparison };
};