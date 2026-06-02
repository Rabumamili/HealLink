// stores/qrStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  QrAppointmentResponse,
  VerifyCheckinRequest,
  VerifyCheckinResponse,
} from '@/services/qr.service';
import { qrService } from '@/services/qr.service';

interface QrState {
  qrCodes: QrAppointmentResponse[];
  currentQr: QrAppointmentResponse | null;
  checkInResult: VerifyCheckinResponse | null;
  isLoading: boolean;
  error: string | null;
  
  fetchQrByAppointmentId: (appointmentId: number) => Promise<void>;
  verifyCheckin: (request: VerifyCheckinRequest) => Promise<VerifyCheckinResponse>;
  clearCurrentQr: () => void;
  clearCheckInResult: () => void;
  clearError: () => void;
}

const initialState = {
  qrCodes: [],
  currentQr: null,
  checkInResult: null,
  isLoading: false,
  error: null,
};

export const useQrStore = create<QrState>()(
  devtools(
    (set) => ({
      ...initialState,

      fetchQrByAppointmentId: async (appointmentId: number) => {
        set({ isLoading: true, error: null });
        try {
          const qr = await qrService.getQrByAppointmentId(appointmentId);
          set({ currentQr: qr, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch QR code', 
            isLoading: false 
          });
        }
      },

      verifyCheckin: async (request: VerifyCheckinRequest) => {
        set({ isLoading: true, error: null, checkInResult: null });
        try {
          const result = await qrService.verifyCheckin(request);
          set({ checkInResult: result, isLoading: false });
          return result;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to verify QR';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      clearCurrentQr: () => {
        set({ currentQr: null });
      },

      clearCheckInResult: () => {
        set({ checkInResult: null });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    { name: 'QrStore' }
  )
);