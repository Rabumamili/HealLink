// app/(dashboard)/clinic/profile/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "@/components/ui/alert-dialog";
import {
  Building2,
  Save,
  Camera,
  Key,
  Trash2,
  Shield,
  Eye,
  EyeOff,
  Users,
  Calendar,
  BadgeCheck,
  LogOut,
  Upload,
  Clock,
  MapPin,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { ClinicProfile, ClinicProfileUpdate } from "@/types/entities/profile.types";

export default function ClinicProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const registrationInputRef = useRef<HTMLInputElement>(null);

  const {
    profile,
    statistics,
    loading,
    uploadLoading,
    passwordLoading,
    deleteLoading: storeDeleteLoading,
    loadClinicProfile,
    updateClinic,
    uploadPhoto,
    uploadRegistration,
    updatePassword,
    loadClinicStatistics,
    removeAccount,
  } = useProfile();

  const { logout } = useAuth();

  const [formData, setFormData] = useState<ClinicProfileUpdate>({});
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    loadClinicProfile();
    loadClinicStatistics();
  }, []);

  useEffect(() => {
    if (profile && "role" in profile && profile.role === "clinic") {
      const p = profile as ClinicProfile;
      setFormData({
        full_name: p.full_name,
        address: p.address,
        phone_number: p.phone_number,
        license_number: p.license_number,
        tin_number: p.tin_number,
        operating_hours: p.operating_hours,
        description: p.description,
        established_year: p.established_year,
        location: p.location,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    const updated = await updateClinic(formData);
    if (updated) {
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } else {
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("New password and confirm password do not match");
      return;
    }
    if (passwordData.new_password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    const success = await updatePassword(passwordData);
    if (success) {
      setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
      toast.success("Password changed successfully");
    } else {
      toast.error("Failed to change password");
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadPhoto(file);
      if (url) {
        await loadClinicProfile();
        toast.success("Profile photo updated");
      } else {
        toast.error("Failed to upload photo");
      }
    }
  };

  const handleRegistrationUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadRegistration(file);
      if (url) {
        await loadClinicProfile();
        toast.success("Registration document uploaded");
      } else {
        toast.error("Failed to upload document");
      }
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const success = await removeAccount();
      if (success) {
        toast.success("Account deleted successfully");
        logout();
      } else {
        toast.error("Failed to delete account");
      }
    } catch (error) {
      toast.error("An error occurred while deleting account");
    } finally {
      setIsDeleting(false);
    }
  };

  const clinicProfile = profile as ClinicProfile | null;

  const statsData = [
    {
      icon: Users,
      label: "Doctors",
      value: (statistics as any)?.total_doctors ?? 0,
      detail: `Staff: ${(statistics as any)?.total_staff ?? 0}`,
    },
    {
      icon: Calendar,
      label: "Appointments",
      value: (statistics as any)?.total_appointments ?? 0,
      detail: `This month: ${(statistics as any)?.monthly_appointments ?? 0}`,
    },
    {
      icon: BadgeCheck,
      label: "Patients Served",
      value: (statistics as any)?.total_patients_served ?? 0,
      detail: clinicProfile?.verification_status ?? "Pending",
    },
  ];

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 text-[#006767] mx-auto" />
          <p className="mt-4 text-[#3d4949]">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0b1c30] mb-2">Clinic Profile</h1>
          <p className="text-[#3d4949] text-base">Manage your clinic information and account security.</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Profile Card */}
          <Card className="rounded-xl border-[#E2E8F0] shadow-[0_4px_20px_rgba(11,28,48,0.04)]">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#e5eeff]">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={clinicProfile?.profile_photo} />
                    <AvatarFallback className="bg-[#006767] text-white text-3xl font-semibold">
                      {clinicProfile?.full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() || "C"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <button
                  onClick={() => photoInputRef.current?.click()}
                  disabled={uploadLoading}
                  className="absolute bottom-1 right-1 bg-[#006767] text-white p-2 rounded-full shadow-lg border-2 border-white hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </button>
                <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </div>
              <h3 className="text-2xl font-semibold text-[#0b1c30]">{clinicProfile?.full_name}</h3>
              <p className="text-[#3d4949] text-sm mb-6">Clinic ID: #{clinicProfile?.id}</p>
              <div className="w-full space-y-4 pt-6 border-t border-[#bcc9c8]/20">
                <div className="flex items-center justify-between">
                  <span className="text-[#3d4949] text-sm font-medium">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      clinicProfile?.is_active
                        ? "bg-[#8cf3f3] text-[#002020]"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {clinicProfile?.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#3d4949] text-sm font-medium">Verification</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      clinicProfile?.verification_status === "verified"
                        ? "bg-green-100 text-green-700"
                        : clinicProfile?.verification_status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {clinicProfile?.verification_status === "verified" 
                      ? "Verified" 
                      : clinicProfile?.verification_status === "rejected"
                      ? "Rejected"
                      : "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#3d4949] text-sm font-medium">Joined</span>
                  <span className="text-[#0b1c30] text-sm">
                    {clinicProfile?.joined_date
                      ? new Date(clinicProfile.joined_date).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Overview */}
          <Card className="rounded-xl border-[#E2E8F0] shadow-[0_4px_20px_rgba(11,28,48,0.04)]">
            <CardHeader>
              <CardTitle className="text-[#006767] text-sm font-bold uppercase tracking-wider">
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {statsData.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#515f78]">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0b1c30]">{stat.value} {stat.label}</p>
                    <p className="text-xs text-[#3d4949]">{stat.detail}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Clinic Information */}
          <Card className="rounded-xl border-[#E2E8F0] shadow-[0_4px_20px_rgba(11,28,48,0.04)]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-[#006767]" />
                <CardTitle className="text-2xl font-semibold text-[#0b1c30]">Clinic Information</CardTitle>
              </div>
              <CardDescription>Your clinic's basic details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Clinic Name</Label>
                  <Input
                    value={formData.full_name || ""}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    disabled={!isEditing}
                    className="bg-[#F1F5F9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006767]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Email Address</Label>
                  <Input
                    value={clinicProfile?.email || ""}
                    disabled
                    className="bg-[#F1F5F9] border-none rounded-xl px-4 py-3 opacity-70"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Phone Number</Label>
                  <Input
                    value={formData.phone_number || ""}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    disabled={!isEditing}
                    className="bg-[#F1F5F9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006767]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">License Number</Label>
                  <Input
                    value={formData.license_number || ""}
                    onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                    disabled={!isEditing}
                    className="bg-[#F1F5F9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006767]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">TIN Number</Label>
                  <Input
                    value={formData.tin_number || ""}
                    onChange={(e) => setFormData({ ...formData, tin_number: e.target.value })}
                    disabled={!isEditing}
                    className="bg-[#F1F5F9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006767]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Established Year</Label>
                  <Input
                    value={formData.established_year || ""}
                    onChange={(e) => setFormData({ ...formData, established_year: e.target.value })}
                    disabled={!isEditing}
                    placeholder="e.g. 2010"
                    className="bg-[#F1F5F9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006767]"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">
                    <MapPin className="inline h-3 w-3 mr-1" />
                    Location
                  </Label>
                  <Input
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    disabled={!isEditing}
                    className="bg-[#F1F5F9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006767]"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Address</Label>
                  <Input
                    value={formData.address || ""}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!isEditing}
                    className="bg-[#F1F5F9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006767]"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">
                    <Clock className="inline h-3 w-3 mr-1" />
                    Operating Hours
                  </Label>
                  <Input
                    value={formData.operating_hours || ""}
                    onChange={(e) => setFormData({ ...formData, operating_hours: e.target.value })}
                    disabled={!isEditing}
                    placeholder="e.g. Mon–Fri: 8am–6pm"
                    className="bg-[#F1F5F9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006767]"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Description</Label>
                  <Textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                    className="bg-[#F1F5F9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006767]"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  className="bg-[#006767] text-white px-8 py-3 rounded-xl hover:bg-[#005555] hover:shadow-lg transition-all"
                  disabled={isEditing && passwordLoading}
                >
                  {isEditing ? (
                    <>
                      {passwordLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Changes
                    </>
                  ) : (
                    "Edit Profile"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="rounded-xl border-[#E2E8F0] shadow-[0_4px_20px_rgba(11,28,48,0.04)]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Upload className="h-5 w-5 text-[#006767]" />
                <CardTitle className="text-2xl font-semibold text-[#0b1c30]">Documents</CardTitle>
              </div>
              <CardDescription>Upload your registration documents for verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-[#F1F5F9] rounded-xl">
                <div>
                  <p className="text-sm font-medium text-[#0b1c30]">Registration Document</p>
                  <p className="text-xs text-[#3d4949]">
                    {clinicProfile?.license_document ? "Uploaded" : "Not uploaded"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={uploadLoading}
                  onClick={() => registrationInputRef.current?.click()}
                  className="border-[#006767] text-[#006767] hover:bg-[#006767] hover:text-white transition-colors"
                >
                  {uploadLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Upload
                </Button>
                <input
                  ref={registrationInputRef}
                  type="file"
                  accept=".pdf,.jpg,.png"
                  className="hidden"
                  onChange={handleRegistrationUpload}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card className="rounded-xl border-[#E2E8F0] shadow-[0_4px_20px_rgba(11,28,48,0.04)]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-[#006767]" />
                <CardTitle className="text-2xl font-semibold text-[#0b1c30]">Account Security</CardTitle>
              </div>
              <CardDescription>Manage your password and security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-[#eff4ff] rounded-xl p-6 mb-8 border border-[#bcc9c8]/30">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#008282] text-white rounded-lg">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0b1c30] mb-1">Update Password</h4>
                    <p className="text-[#3d4949] text-sm">
                      Ensure your account is using a long, random password to stay secure.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[#3d4949] text-sm font-medium ml-1">Current Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                        className="bg-[#F1F5F9] border-none rounded-xl pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d4949] hover:text-[#006767] transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div />
                  <div className="space-y-2">
                    <Label className="text-[#3d4949] text-sm font-medium ml-1">New Password</Label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                        className="bg-[#F1F5F9] border-none rounded-xl pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d4949] hover:text-[#006767] transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#3d4949] text-sm font-medium ml-1">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={passwordData.confirm_password}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirm_password: e.target.value })
                        }
                        className="bg-[#F1F5F9] border-none rounded-xl pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d4949] hover:text-[#006767] transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handlePasswordChange}
                    disabled={passwordLoading}
                    variant="outline"
                    className="border-2 border-[#006767] text-[#006767] px-8 py-3 rounded-xl hover:bg-[#006767] hover:text-white transition-all"
                  >
                    {passwordLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Key className="h-4 w-4 mr-2" />
                    )}
                    Update Security
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-red-50/20 border border-red-200 rounded-xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-red-600 mb-1">Delete Account</h3>
                  <p className="text-[#3d4949] text-sm">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      disabled={isDeleting || storeDeleteLoading}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg transition-all"
                    >
                      {isDeleting || storeDeleteLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-red-600">Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove all
                        your data from our servers. All your patients, appointments, and staff data will be lost forever.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-gray-300 hover:bg-gray-100">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAccount} 
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Yes, delete my account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}