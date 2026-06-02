// hooks/useQr.ts
import { useCallback, useEffect, useMemo } from 'react';
import { useQrStore } from '@/stores/slices/qrSlice';
import { QrAppointmentResponse, VerifyCheckinRequest, VerifyCheckinResponse } from '@/services/qr.service';

interface UseQrOptions {
  autoFetch?: boolean;
  appointmentId?: number;
}

export const useQr = (options: UseQrOptions = {}) => {
  const {
    qrCodes,
    currentQr,
    checkInResult,
    isLoading,
    error,
    fetchQrByAppointmentId,
    verifyCheckin,
    clearCurrentQr,
    clearCheckInResult,
    clearError,
  } = useQrStore();

  const { autoFetch = true, appointmentId } = options;

  useEffect(() => {
    if (autoFetch && appointmentId) {
      fetchQrByAppointmentId(appointmentId);
    }
  }, [autoFetch, appointmentId, fetchQrByAppointmentId]);

  const verifyAndCheckIn = useCallback(async (
    request: VerifyCheckinRequest
  ): Promise<VerifyCheckinResponse> => {
    return await verifyCheckin(request);
  }, [verifyCheckin]);

  const activeQrCodes = useMemo((): QrAppointmentResponse[] => 
    qrCodes.filter((qr: QrAppointmentResponse) => qr.status === 'active'), 
    [qrCodes]
  );

  const usedQrCodes = useMemo((): QrAppointmentResponse[] => 
    qrCodes.filter((qr: QrAppointmentResponse) => qr.status === 'used'), 
    [qrCodes]
  );

  const expiredQrCodes = useMemo((): QrAppointmentResponse[] => 
    qrCodes.filter((qr: QrAppointmentResponse) => qr.is_expired), 
    [qrCodes]
  );

  // Compatibility methods for existing pages
  const fetchQrCodes = useCallback(async () => {
    // Since the new service doesn't have a general fetch method, we'll just log a warning
    console.warn('fetchQrCodes not available in new API');
  }, []);

  const validateQr = useCallback(async (cardNumber: string) => {
    // Use verifyCheckin as a compatibility layer
    return await verifyCheckin({ card_number: cardNumber });
  }, [verifyCheckin]);

  return {
    qrCodes,
    currentQr,
    checkInResult,
    isLoading,
    error,
    fetchQrByAppointmentId,
    verifyCheckin: verifyAndCheckIn,
    clearCurrentQr,
    clearCheckInResult,
    clearError,
    activeQrCodes,
    usedQrCodes,
    expiredQrCodes,
    // Compatibility methods
    fetchQrCodes,
    validateQr,
  };
};

export const useQrCheckIn = () => {
  const { verifyCheckin, checkInResult, isLoading, clearCheckInResult } = useQrStore();
  
  return {
    verifyCheckin,
    checkIn: verifyCheckin, // Alias for compatibility
    checkInResult,
    isLoading,
    clearCheckInResult,
  };
};

export const useQrValidation = () => {
  const { verifyCheckin, checkInResult, isLoading, clearCheckInResult } = useQrStore();
  
  return {
    validateQr: verifyCheckin,
    validationResult: checkInResult,
    isLoading,
    clearValidationResult: clearCheckInResult,
  };
};

export const useQrStats = () => {
  const { qrCodes } = useQrStore();
  
  const qrStats = useMemo(() => {
    if (!qrCodes || qrCodes.length === 0) {
      return {
        active: 0,
        used: 0,
        expired: 0,
        utilizationRate: 0,
      };
    }
    
    const active = qrCodes.filter((qr: any) => qr.status === 'active').length;
    const used = qrCodes.filter((qr: any) => qr.status === 'used').length;
    const expired = qrCodes.filter((qr: any) => qr.is_expired).length;
    const total = qrCodes.length;
    const utilizationRate = total > 0 ? Math.round((used / total) * 100) : 0;
    
    return {
      active,
      used,
      expired,
      utilizationRate,
    };
  }, [qrCodes]);
  
  return {
    qrStats,
    isLoading: false,
    refresh: () => Promise.resolve(),
  };
};
