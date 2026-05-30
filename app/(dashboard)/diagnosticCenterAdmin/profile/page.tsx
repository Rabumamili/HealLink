"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  FlaskConical,
  Save,
  Camera,
  Key,
  Trash2,
  Shield,
  Eye,
  EyeOff,
  Users,
  BadgeCheck,
  LogOut,
  Upload,
  Clock,
  MapPin,
  Activity,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { DiagnosticCenterProfile, DiagnosticCenterProfileUpdate } from "@/types/entities/profile.types";

export default function DiagnosticProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const registrationInputRef = useRef<HTMLInputElement>(null);
  const [newService, setNewService] = useState("");
  const [servicesOffered, setServicesOffered] = useState<string[]>([]);

  const {
    profile,
    statistics,
    loading,
    uploadLoading,
    passwordLoading,
    deleteLoading,
    loadDiagnosticCenterProfile,
    updateDiagnosticCenter,
    uploadPhoto,
    uploadRegistration,
    updatePassword,
    loadDiagnosticStatistics,
    removeAccount,
  } = useProfile();

  const { logout } = useAuth();

  const [formData, setFormData] = useState<DiagnosticCenterProfileUpdate>({});
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    loadDiagnosticCenterProfile();
    loadDiagnosticStatistics();
  }, [loadDiagnosticCenterProfile, loadDiagnosticStatistics]);

  useEffect(() => {
    if (profile && "role" in profile && profile.role === "diagnostic_center") {
      const p = profile as DiagnosticCenterProfile;
      setFormData({
        full_name: p.full_name,
        address: p.address,
        phone_number: p.phone_number,
        license_number: p.license_number,
        tin_number: p.tin_number,
        accreditation: p.accreditation,
        services_description: p.services_description,
        operating_hours: p.operating_hours,
        established_year: p.established_year,
        location: p.location,
        services_offered: p.services_offered,
      });
      setServicesOffered(p.services_offered ?? []);
    }
  }, [profile]);

  const handleSave = async () => {
    const updated = await updateDiagnosticCenter({ ...formData, services_offered: servicesOffered });
    if (updated) setIsEditing(false);
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
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadPhoto(file);
      await loadDiagnosticCenterProfile();
    }
  };

  const handleRegistrationUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadRegistration(file);
      await loadDiagnosticCenterProfile();
    }
  };

  const handleDeleteAccount = async () => {
    const success = await removeAccount();
    if (success) logout();
  };

  const addService = () => {
    if (newService.trim()) {
      setServicesOffered([...servicesOffered, newService.trim()]);
      setNewService("");
      toast.success(`${newService} added to services`);
    }
  };

  const removeService = (index: number) => {
    setServicesOffered(servicesOffered.filter((_, i) => i !== index));
    toast.info("Service removed");
  };

  const diagnosticProfile = profile as DiagnosticCenterProfile | null;

  const statsData = [
    {
      icon: Activity,
      label: "Tests Performed",
      value: (statistics as any)?.total_tests_performed ?? 0,
      detail: `This month: ${(statistics as any)?.monthly_tests ?? 0}`,
    },
    {
      icon: Users,
      label: "Patients Served",
      value: (statistics as any)?.total_patients_served ?? 0,
      detail: `Staff: ${(statistics as any)?.total_staff ?? 0}`,
    },
    {
      icon: BadgeCheck,
      label: "Satisfaction",
      value: `${(statistics as any)?.patient_satisfaction_rate ?? 0}%`,
      detail: diagnosticProfile?.verification_status ?? "Pending",
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
          <h1 className="text-3xl font-bold tracking-tight text-[#0b1c30] mb-2">Diagnostic Center Profile</h1>
          <p className="text-[#3d4949] text-base">Manage your center's information and account security.</p>
        </div>
        <Button variant="destructive" onClick={logout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
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
                    <AvatarImage src={diagnosticProfile?.profile_photo} />
                    <AvatarFallback className="bg-[#006767] text-white text-3xl font-semibold">
                      {diagnosticProfile?.full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <button
                  onClick={() => photoInputRef.current?.click()}
                  disabled={uploadLoading}
                  className="absolute bottom-1 right-1 bg-[#006767] text-white p-2 rounded-full shadow-lg border-2 border-white hover:scale-105 transition-transform"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </div>
              <h3 className="text-2xl font-semibold text-[#0b1c30]">{diagnosticProfile?.full_name}</h3>
              <p className="text-[#3d4949] text-sm mb-6">Center ID: #{diagnosticProfile?.id}</p>
              <div className="w-full space-y-4 pt-6 border-t border-[#bcc9c8]/20">
                <div className="flex items-center justify-between">
                  <span className="text-[#3d4949] text-sm font-medium">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      diagnosticProfile?.is_active
                        ? "bg-[#8cf3f3] text-[#002020]"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {diagnosticProfile?.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#3d4949] text-sm font-medium">Verification</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      diagnosticProfile?.verification_status === "verified"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {diagnosticProfile?.verification_status ?? "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#3d4949] text-sm font-medium">Joined</span>
                  <span className="text-[#0b1c30] text-sm">
                    {diagnosticProfile?.joined_date
                      ? new Date(diagnosticProfile.joined_date).toLocaleDateString()
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
          {/* Center Information */}
          <Card className="rounded-xl border-[#E2E8F0] shadow-[0_4px_20px_rgba(11,28,48,0.04)]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <FlaskConical className="h-5 w-5 text-[#006767]" />
                <CardTitle className="text-2xl font-semibold text-[#0b1c30]">Center Information</CardTitle>
              </div>
              <CardDescription>Your diagnostic center's basic details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Center Name</Label>
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
                    value={diagnosticProfile?.email || ""}
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
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Accreditation</Label>
                  <Input
                    value={formData.accreditation || ""}
                    onChange={(e) => setFormData({ ...formData, accreditation: e.target.value })}
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
                    placeholder="e.g. Mon–Fri: 7am–8pm"
                    className="bg-[#F1F5F9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006767]"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Services Description</Label>
                  <Textarea
                    value={formData.services_description || ""}
                    onChange={(e) => setFormData({ ...formData, services_description: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                    className="bg-[#F1F5F9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006767]"
                  />
                </div>

                {/* Services Offered */}
                <div className="space-y-3 md:col-span-2">
                  <Label className="text-[#3d4949] text-sm font-medium">Services Offered</Label>
                  <div className="flex flex-wrap gap-2">
                    {servicesOffered.length > 0 ? (
                      servicesOffered.map((service, index) => (
                        <Badge key={index} className="bg-[#e5eeff] text-[#515f78] hover:bg-[#e5eeff]/80">
                          {service}
                          {isEditing && (
                            <button onClick={() => removeService(index)} className="ml-2 hover:text-red-600">
                              ×
                            </button>
                          )}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-[#3d4949]">No services listed yet.</p>
                    )}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Add service..."
                        value={newService}
                        onChange={(e) => setNewService(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addService()}
                        className="bg-[#F1F5F9] border-none rounded-xl"
                      />
                      <Button variant="outline" onClick={addService}>
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                  )}
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
                    {diagnosticProfile?.registration_document_url ? "Uploaded" : "Not uploaded"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={uploadLoading}
                  onClick={() => registrationInputRef.current?.click()}
                  className="border-[#006767] text-[#006767]"
                >
                  <Upload className="h-4 w-4 mr-2" />
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