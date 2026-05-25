// store/slices/profileSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { profileService } from '@/services/profile.service';
import {
  PatientProfile,
  PatientProfileUpdate,
  DoctorProfile,
  DoctorProfileUpdate,
  ClinicProfile,
  ClinicProfileUpdate,
  DiagnosticCenterProfile,
  DiagnosticCenterProfileUpdate,
  StaffProfile,
  StaffProfileUpdate,
  ChangePasswordData,
  ChangePasswordResponse,
  ProfileUploadResponse,
  PatientStatistics,
  DoctorStatistics,
  ClinicStatistics,
  DiagnosticCenterStatistics
} from '@/types/entities/profile.types';
import { UserRole } from '@/types/entities/auth.types';

interface ProfileState {
  // Current profile based on role
  profile: PatientProfile | DoctorProfile | ClinicProfile | DiagnosticCenterProfile | StaffProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  error: string | null;
  updateSuccess: boolean;
  
  // Statistics
  patientStats: PatientStatistics | null;
  doctorStats: DoctorStatistics | null;
  clinicStats: ClinicStatistics | null;
  diagnosticCenterStats: DiagnosticCenterStatistics | null;
  
  // Upload states
  isUploading: boolean;
  uploadProgress: number;
  
  // Password change
  isChangingPassword: boolean;
  passwordChangeSuccess: boolean;
}

const initialState: ProfileState = {
  profile: null,
  role: null,
  isLoading: false,
  error: null,
  updateSuccess: false,
  patientStats: null,
  doctorStats: null,
  clinicStats: null,
  diagnosticCenterStats: null,
  isUploading: false,
  uploadProgress: 0,
  isChangingPassword: false,
  passwordChangeSuccess: false,
};

// Async Thunks for Profile Fetching
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (role: UserRole, { rejectWithValue }) => {
    try {
      const profile = await profileService.getProfileByRole(role);
      return { profile, role };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const fetchPatientProfile = createAsyncThunk(
  'profile/fetchPatientProfile',
  async (_, { rejectWithValue }) => {
    try {
      const profile = await profileService.getPatientProfile();
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patient profile');
    }
  }
);

export const fetchDoctorProfile = createAsyncThunk(
  'profile/fetchDoctorProfile',
  async (_, { rejectWithValue }) => {
    try {
      const profile = await profileService.getDoctorProfile();
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch doctor profile');
    }
  }
);

export const fetchClinicProfile = createAsyncThunk(
  'profile/fetchClinicProfile',
  async (_, { rejectWithValue }) => {
    try {
      const profile = await profileService.getClinicProfile();
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch clinic profile');
    }
  }
);

export const fetchDiagnosticCenterProfile = createAsyncThunk(
  'profile/fetchDiagnosticCenterProfile',
  async (_, { rejectWithValue }) => {
    try {
      const profile = await profileService.getDiagnosticCenterProfile();
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch diagnostic center profile');
    }
  }
);

// Update Thunks
export const updatePatientProfile = createAsyncThunk(
  'profile/updatePatientProfile',
  async (data: PatientProfileUpdate, { rejectWithValue }) => {
    try {
      const profile = await profileService.updatePatientProfile(data);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const updateDoctorProfile = createAsyncThunk(
  'profile/updateDoctorProfile',
  async (data: DoctorProfileUpdate, { rejectWithValue }) => {
    try {
      const profile = await profileService.updateDoctorProfile(data);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const updateClinicProfile = createAsyncThunk(
  'profile/updateClinicProfile',
  async (data: ClinicProfileUpdate, { rejectWithValue }) => {
    try {
      const profile = await profileService.updateClinicProfile(data);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const updateDiagnosticCenterProfile = createAsyncThunk(
  'profile/updateDiagnosticCenterProfile',
  async (data: DiagnosticCenterProfileUpdate, { rejectWithValue }) => {
    try {
      const profile = await profileService.updateDiagnosticCenterProfile(data);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

// Statistics Thunks
export const fetchPatientStatistics = createAsyncThunk(
  'profile/fetchPatientStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await profileService.getPatientStatistics();
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch statistics');
    }
  }
);

export const fetchDoctorStatistics = createAsyncThunk(
  'profile/fetchDoctorStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await profileService.getDoctorStatistics();
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch statistics');
    }
  }
);

export const fetchClinicStatistics = createAsyncThunk(
  'profile/fetchClinicStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await profileService.getClinicStatistics();
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch statistics');
    }
  }
);

export const fetchDiagnosticCenterStatistics = createAsyncThunk(
  'profile/fetchDiagnosticCenterStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await profileService.getDiagnosticCenterStatistics();
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch statistics');
    }
  }
);

// Medical History Thunks (Patient specific)
export const addAllergy = createAsyncThunk(
  'profile/addAllergy',
  async (allergy: string, { rejectWithValue }) => {
    try {
      const profile = await profileService.addAllergy(allergy);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add allergy');
    }
  }
);

export const removeAllergy = createAsyncThunk(
  'profile/removeAllergy',
  async (allergy: string, { rejectWithValue }) => {
    try {
      const profile = await profileService.removeAllergy(allergy);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove allergy');
    }
  }
);

export const addChronicCondition = createAsyncThunk(
  'profile/addChronicCondition',
  async (condition: string, { rejectWithValue }) => {
    try {
      const profile = await profileService.addChronicCondition(condition);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add condition');
    }
  }
);

export const removeChronicCondition = createAsyncThunk(
  'profile/removeChronicCondition',
  async (condition: string, { rejectWithValue }) => {
    try {
      const profile = await profileService.removeChronicCondition(condition);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove condition');
    }
  }
);

export const addMedication = createAsyncThunk(
  'profile/addMedication',
  async (medication: string, { rejectWithValue }) => {
    try {
      const profile = await profileService.addMedication(medication);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add medication');
    }
  }
);

export const removeMedication = createAsyncThunk(
  'profile/removeMedication',
  async (medication: string, { rejectWithValue }) => {
    try {
      const profile = await profileService.removeMedication(medication);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove medication');
    }
  }
);

// Upload Thunks
export const uploadProfilePicture = createAsyncThunk(
  'profile/uploadProfilePicture',
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await profileService.uploadProfilePicture(file);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload profile picture');
    }
  }
);

export const uploadCoverImage = createAsyncThunk(
  'profile/uploadCoverImage',
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await profileService.uploadCoverImage(file);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload cover image');
    }
  }
);

export const uploadLicenseDocument = createAsyncThunk(
  'profile/uploadLicenseDocument',
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await profileService.uploadLicenseDocument(file);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload license document');
    }
  }
);

export const uploadRegistrationDocument = createAsyncThunk(
  'profile/uploadRegistrationDocument',
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await profileService.uploadRegistrationDocument(file);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload registration document');
    }
  }
);

// Password Change Thunk
export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async (data: ChangePasswordData, { rejectWithValue }) => {
    try {
      const response = await profileService.changePassword(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

// Delete Account Thunk
export const deleteAccount = createAsyncThunk(
  'profile/deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.deleteAccount();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete account');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
    clearPasswordChangeSuccess: (state) => {
      state.passwordChangeSuccess = false;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    resetProfileState: (state) => {
      state.profile = null;
      state.role = null;
      state.error = null;
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Patient Profile
      .addCase(fetchPatientProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatientProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.role = 'patient';
        state.error = null;
      })
      .addCase(fetchPatientProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Doctor Profile
      .addCase(fetchDoctorProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctorProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.role = 'doctor';
        state.error = null;
      })
      .addCase(fetchDoctorProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Clinic Profile
      .addCase(fetchClinicProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClinicProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.role = 'clinic';
        state.error = null;
      })
      .addCase(fetchClinicProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Diagnostic Center Profile
      .addCase(fetchDiagnosticCenterProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDiagnosticCenterProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.role = 'diagnostic_center';
        state.error = null;
      })
      .addCase(fetchDiagnosticCenterProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Patient Profile
      .addCase(updatePatientProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updatePatientProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.updateSuccess = true;
        state.error = null;
      })
      .addCase(updatePatientProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.updateSuccess = false;
        state.error = action.payload as string;
      })
      // Update Doctor Profile
      .addCase(updateDoctorProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateDoctorProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.updateSuccess = true;
        state.error = null;
      })
      .addCase(updateDoctorProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.updateSuccess = false;
        state.error = action.payload as string;
      })
      // Update Clinic Profile
      .addCase(updateClinicProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateClinicProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.updateSuccess = true;
        state.error = null;
      })
      .addCase(updateClinicProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.updateSuccess = false;
        state.error = action.payload as string;
      })
      // Update Diagnostic Center Profile
      .addCase(updateDiagnosticCenterProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateDiagnosticCenterProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.updateSuccess = true;
        state.error = null;
      })
      .addCase(updateDiagnosticCenterProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.updateSuccess = false;
        state.error = action.payload as string;
      })
      // Add Allergy
      .addCase(addAllergy.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      // Remove Allergy
      .addCase(removeAllergy.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      // Add Chronic Condition
      .addCase(addChronicCondition.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      // Remove Chronic Condition
      .addCase(removeChronicCondition.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      // Add Medication
      .addCase(addMedication.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      // Remove Medication
      .addCase(removeMedication.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      // Statistics
      .addCase(fetchPatientStatistics.fulfilled, (state, action) => {
        state.patientStats = action.payload;
      })
      .addCase(fetchDoctorStatistics.fulfilled, (state, action) => {
        state.doctorStats = action.payload;
      })
      .addCase(fetchClinicStatistics.fulfilled, (state, action) => {
        state.clinicStats = action.payload;
      })
      .addCase(fetchDiagnosticCenterStatistics.fulfilled, (state, action) => {
        state.diagnosticCenterStats = action.payload;
      })
      // Upload Profile Picture
      .addCase(uploadProfilePicture.pending, (state) => {
        state.isUploading = true;
        state.error = null;
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.isUploading = false;
        if (state.profile) {
          state.profile.profile_photo = action.payload.url;
        }
        state.error = null;
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload as string;
      })
      // Upload Cover Image
      .addCase(uploadCoverImage.pending, (state) => {
        state.isUploading = true;
        state.error = null;
      })
      .addCase(uploadCoverImage.fulfilled, (state, action) => {
        state.isUploading = false;
        if (state.profile && 'cover_image_url' in state.profile) {
          (state.profile as any).cover_image_url = action.payload.url;
        }
        state.error = null;
      })
      .addCase(uploadCoverImage.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload as string;
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isChangingPassword = true;
        state.error = null;
        state.passwordChangeSuccess = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isChangingPassword = false;
        state.passwordChangeSuccess = true;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isChangingPassword = false;
        state.passwordChangeSuccess = false;
        state.error = action.payload as string;
      })
      // Delete Account
      .addCase(deleteAccount.fulfilled, (state) => {
        state.profile = null;
        state.role = null;
      });
  },
});

export const {
  clearProfileError,
  clearUpdateSuccess,
  clearPasswordChangeSuccess,
  setUploadProgress,
  resetProfileState,
} = profileSlice.actions;
export default profileSlice.reducer;