// app/(dashboard)/patient/profile/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  User,
  Droplets,
  Heart,
  UserPlus,
  Save,
  Camera,
  Key,
  Trash2,
  Shield,
  Eye,
  EyeOff,
  Activity,
  FileText,
  Calendar,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { PatientProfile, PatientProfileUpdate } from "@/types/entities/profile.types";

export default function PatientProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    profile,
    loading,
    uploadLoading,
    passwordLoading,
    deleteLoading,
    loadPatientProfile,
    updatePatient,
    uploadPhoto,
    updatePassword,
    removeAccount,
  } = useProfile();

  const { logout } = useAuth();

  const [formData, setFormData] = useState<PatientProfileUpdate>({});
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    loadPatientProfile();
  }, []);

  useEffect(() => {
    if (profile && "first_name" in profile) {
      const p = profile as PatientProfile;
      setFormData({
        first_name: p.first_name,
        last_name: p.last_name,
        phone_number: p.phone_number,
        date_of_birth: p.date_of_birth,
        gender: p.gender,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    const formDataToSend = new FormData();
    if (formData.first_name !== undefined && formData.first_name !== null) formDataToSend.append('first_name', formData.first_name);
    if (formData.last_name !== undefined && formData.last_name !== null) formDataToSend.append('last_name', formData.last_name);
    if (formData.phone_number !== undefined && formData.phone_number !== null) formDataToSend.append('phone_number', formData.phone_number);
    if (formData.date_of_birth !== undefined && formData.date_of_birth !== null) formDataToSend.append('date_of_birth', formData.date_of_birth);
    if (formData.gender !== undefined && formData.gender !== null) formDataToSend.append('gender', formData.gender);
    if (profilePicture) formDataToSend.append('profile_picture', profilePicture);

    const updated = await updatePatient(formDataToSend);
    if (updated) {
      setIsEditing(false);
      setProfilePicture(null);
      toast.success("Profile updated successfully");
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
    }
  };

  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadPhoto(file);
      await loadPatientProfile();
      toast.success("Profile photo updated");
    }
  };

  const handleDeleteAccount = async () => {
    const success = await removeAccount();
    if (success) logout();
  };

  const patientProfile = profile as PatientProfile | null;

  const statsData = [
    {
      icon: Calendar,
      label: "Appointments",
      value: 0,
      detail: "Upcoming: 0",
    },
    {
      icon: FileText,
      label: "Lab Results",
      value: 0,
      detail: "Pending review",
    },
    {
      icon: Activity,
      label: "Health Score",
      value: 0,
      detail: "Good",
    },
  ];

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006767] mx-auto" />
          <p className="mt-4 text-[#3d4949]">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0b1c30] mb-2">Patient Profile</h1>
          <p className="text-[#3d4949] text-base">Manage your personal information and account security.</p>
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
                    <AvatarImage src={patientProfile?.profile_photo} />
                    <AvatarFallback className="bg-[#006767] text-white text-3xl font-semibold">
                      {patientProfile?.first_name?.[0]}{patientProfile?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadLoading}
                  className="absolute bottom-1 right-1 bg-[#006767] text-white p-2 rounded-full shadow-lg border-2 border-white hover:scale-105 transition-transform"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageUpload}
                />
              </div>
              <h3 className="text-2xl font-semibold text-[#0b1c30]">
                {patientProfile?.first_name} {patientProfile?.last_name}
              </h3>
              <p className="text-[#3d4949] text-sm font-medium mb-6">Patient ID: #{patientProfile?.id}</p>
              <div className="w-full space-y-4 pt-6 border-t border-[#bcc9c8]/20">
                <div className="flex items-center justify-between">
                  <span className="text-[#3d4949] text-sm font-medium">Status</span>
                  <span className="bg-[#8cf3f3] text-[#002020] px-3 py-1 rounded-full text-xs font-bold">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#3d4949] text-sm font-medium">Member Since</span>
                  <span className="text-[#0b1c30] text-sm">
                    {patientProfile?.created_at
                      ? new Date(patientProfile.created_at).toLocaleDateString()
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
          {/* Personal Information */}
          <Card className="rounded-xl border-[#E2E8F0] shadow-[0_4px_20px_rgba(11,28,48,0.04)]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-[#006767]" />
                <CardTitle className="text-2xl font-semibold text-[#0b1c30]">Personal Information</CardTitle>
              </div>
              <CardDescription>Your basic personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">First Name</Label>
                  <Input
                    value={formData.first_name || ""}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    disabled={!isEditing}
                    className="bg-[#F1F5F9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006767]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Last Name</Label>
                  <Input
                    value={formData.last_name || ""}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    disabled={!isEditing}
                    className="bg-[#F1F5F9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006767]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Email Address</Label>
                  <Input
                    value={patientProfile?.email || ""}
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
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Date of Birth</Label>
                  <Input
                    type="date"
                    value={formData.date_of_birth?.split("T")[0] || ""}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    disabled={!isEditing}
                    className="bg-[#F1F5F9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006767]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Gender</Label>
                  <Select
                    value={formData.gender || undefined}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="bg-[#F1F5F9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006767]">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  className="bg-[#006767] text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all"
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    "Edit Profile"
                  )}
                </Button>
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d4949]"
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d4949]"
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d4949]"
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
                    className="border-2 border-[#006767] text-[#006767] px-8 py-3 rounded-xl hover:bg-[#006767]/5"
                  >
                    <Key className="h-4 w-4 mr-2" />
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
                    <Button variant="destructive" disabled={deleteLoading} className="bg-red-600 hover:bg-red-700">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove all
                        your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600">
                        Delete Account
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