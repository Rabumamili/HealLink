"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
} from "@/components/ui/alert-dialog"
import { 
  User, 
  Droplets,
  Heart,
  Pill,
  UserPlus,
  Save,
  Camera,
  Key,
  LogOut,
  Trash2,
  Shield,
  Eye,
  EyeOff,
  Activity,
  FileText,
  Calendar as CalendarIcon
} from "lucide-react"
import { toast } from "sonner"

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

export default function HealthProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  
  const [profile, setProfile] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 000-0000",
    dateOfBirth: "1992-03-14",
    gender: "Female",
    address: "123 Wellness Way, Apt 4B, San Francisco, CA 94103",
    bloodType: "O+",
    height: "165",
    weight: "62",
    allergies: ["Penicillin", "Pollen"],
    chronicConditions: [] as string[],
    currentMedications: [] as string[],
    emergencyContact: {
      name: "Michael Johnson",
      relationship: "Spouse",
      phone: "+1 (555) 111-2222",
    },
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [newAllergy, setNewAllergy] = useState("")
  const [newCondition, setNewCondition] = useState("")
  const [newMedication, setNewMedication] = useState("")

  const statsData = [
    { icon: CalendarIcon, label: "Appointments", value: "12", detail: "Last visit: 3 days ago" },
    { icon: FileText, label: "Lab Reports", value: "04", detail: "Pending review: 01" },
    { icon: Activity, label: "Health Score", value: "92", detail: "Excellent" },
  ]

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setProfile({ ...profile, allergies: [...profile.allergies, newAllergy.trim()] })
      setNewAllergy("")
      toast.success(`${newAllergy} has been added to your profile`, {
        description: "Allergy added successfully",
      })
    }
  }

  const removeAllergy = (index: number) => {
    const removed = profile.allergies[index]
    setProfile({ ...profile, allergies: profile.allergies.filter((_, i) => i !== index) })
    toast.info(`${removed} has been removed from your profile`, {
      description: "Allergy removed",
    })
  }

  const addCondition = () => {
    if (newCondition.trim()) {
      setProfile({ ...profile, chronicConditions: [...profile.chronicConditions, newCondition.trim()] })
      setNewCondition("")
      toast.success(`${newCondition} has been added to your profile`, {
        description: "Condition added successfully",
      })
    }
  }

  const removeCondition = (index: number) => {
    const removed = profile.chronicConditions[index]
    setProfile({ ...profile, chronicConditions: profile.chronicConditions.filter((_, i) => i !== index) })
    toast.info(`${removed} has been removed from your profile`, {
      description: "Condition removed",
    })
  }

  const addMedication = () => {
    if (newMedication.trim()) {
      setProfile({ ...profile, currentMedications: [...profile.currentMedications, newMedication.trim()] })
      setNewMedication("")
      toast.success(`${newMedication} has been added to your profile`, {
        description: "Medication added successfully",
      })
    }
  }

  const removeMedication = (index: number) => {
    const removed = profile.currentMedications[index]
    setProfile({ ...profile, currentMedications: profile.currentMedications.filter((_, i) => i !== index) })
    toast.info(`${removed} has been removed from your profile`, {
      description: "Medication removed",
    })
  }

  const handleSave = () => {
    setIsEditing(false)
    toast.success("Your health profile has been successfully updated", {
      description: "Profile updated",
    })
  }

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match", {
        description: "Password mismatch",
      })
      return
    }
    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long", {
        description: "Password too short",
      })
      return
    }
    toast.success("Your password has been successfully updated", {
      description: "Password changed",
    })
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
        toast.success("Your profile picture has been changed", {
          description: "Profile picture updated",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteAccount = () => {
    toast.error("Your account has been permanently deleted", {
      description: "Account deleted",
    })
    setTimeout(() => {
      window.location.href = "/login"
    }, 2000)
  }

  const handleExportData = () => {
    const data = JSON.stringify(profile, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `health-profile-${profile.firstName}-${profile.lastName}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Your health data has been downloaded", {
      description: "Data exported",
    })
  }

  return (
    <div className="max-w-[1280px] mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0b1c30] mb-2">Patient Profile</h1>
          <p className="text-[#3d4949] text-base">Manage your personal information and account security.</p>
        </div>
        <Button variant="destructive" className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Profile Summary */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Profile Card */}
          <Card className="rounded-xl border-[#E2E8F0] shadow-[0_4px_20px_rgba(11,28,48,0.04)]">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#e5eeff]">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={profileImage || undefined} />
                    <AvatarFallback className="bg-[#006767] text-white text-3xl font-semibold">
                      {profile.firstName[0]}{profile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
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
              <h3 className="text-2xl font-semibold text-[#0b1c30]">{profile.firstName} {profile.lastName}</h3>
              <p className="text-[#3d4949] text-sm font-medium mb-6">Patient ID: #HL-88291</p>
              <div className="w-full space-y-4 pt-6 border-t border-[#bcc9c8]/20">
                <div className="flex items-center justify-between">
                  <span className="text-[#3d4949] text-sm font-medium">Status</span>
                  <span className="bg-[#8cf3f3] text-[#002020] px-3 py-1 rounded-full text-xs font-bold">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#3d4949] text-sm font-medium">Member Since</span>
                  <span className="text-[#0b1c30] text-sm">Jan 2023</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Overview Card */}
          <Card className="rounded-xl border-[#E2E8F0] shadow-[0_4px_20px_rgba(11,28,48,0.04)]">
            <CardHeader>
              <CardTitle className="text-[#006767] text-sm font-bold uppercase tracking-wider">Activity Overview</CardTitle>
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

        {/* Right Column - Forms */}
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
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Full Name</Label>
                  <Input 
                    value={`${profile.firstName} ${profile.lastName}`}
                    onChange={(e) => {
                      const names = e.target.value.split(' ')
                      setProfile({ ...profile, firstName: names[0] || '', lastName: names[1] || '' })
                    }}
                    disabled={!isEditing}
                    className="bg-[#F1F5F9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006767]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Email Address</Label>
                  <Input 
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                    className="bg-[#F1F5F9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006767]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Phone Number</Label>
                  <Input 
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                    className="bg-[#F1F5F9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006767]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Date of Birth</Label>
                  <Input 
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                    disabled={!isEditing}
                    className="bg-[#F1F5F9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006767]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Gender</Label>
                  <Select 
                    value={profile.gender} 
                    onValueChange={(value) => setProfile({ ...profile, gender: value })}
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
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Residential Address</Label>
                  <Textarea 
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    disabled={!isEditing}
                    rows={2}
                    className="bg-[#F1F5F9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006767]"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
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

          {/* Medical Information */}
          <Card className="rounded-xl border-[#E2E8F0] shadow-[0_4px_20px_rgba(11,28,48,0.04)]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-[#006767]" />
                <CardTitle className="text-2xl font-semibold text-[#0b1c30]">Medical Information</CardTitle>
              </div>
              <CardDescription>Your health and medical details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Blood Type</Label>
                  <Select 
                    value={profile.bloodType} 
                    onValueChange={(value) => setProfile({ ...profile, bloodType: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="bg-[#F1F5F9] border-none rounded-xl">
                      <Droplets className="h-4 w-4 mr-2 text-red-500" />
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Height (cm)</Label>
                  <Input 
                    type="number"
                    value={profile.height}
                    onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                    disabled={!isEditing}
                    className="bg-[#F1F5F9] border-none rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Weight (kg)</Label>
                  <Input 
                    type="number"
                    value={profile.weight}
                    onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                    disabled={!isEditing}
                    className="bg-[#F1F5F9] border-none rounded-xl"
                  />
                </div>
              </div>

              {/* Allergies */}
              <div className="space-y-3">
                <Label className="text-[#3d4949] text-sm font-medium">Allergies</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.allergies.map((allergy, index) => (
                    <Badge key={index} className="bg-[#8cf3f3] text-[#002020] hover:bg-[#8cf3f3]/80">
                      {allergy}
                      {isEditing && (
                        <button onClick={() => removeAllergy(index)} className="ml-2 hover:text-red-600">×</button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2 mt-2">
                    <Input 
                      placeholder="Add allergy..."
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addAllergy()}
                      className="bg-[#F1F5F9] border-none rounded-xl"
                    />
                    <Button variant="outline" onClick={addAllergy}>Add</Button>
                  </div>
                )}
              </div>

              {/* Chronic Conditions */}
              <div className="space-y-3">
                <Label className="text-[#3d4949] text-sm font-medium">Chronic Conditions</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.chronicConditions.map((condition, index) => (
                    <Badge key={index} variant="secondary" className="bg-red-100 text-red-700">
                      {condition}
                      {isEditing && (
                        <button onClick={() => removeCondition(index)} className="ml-2 hover:text-red-600">×</button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2 mt-2">
                    <Input 
                      placeholder="Add condition..."
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addCondition()}
                      className="bg-[#F1F5F9] border-none rounded-xl"
                    />
                    <Button variant="outline" onClick={addCondition}>Add</Button>
                  </div>
                )}
              </div>

              {/* Current Medications */}
              <div className="space-y-3">
                <Label className="text-[#3d4949] text-sm font-medium">Current Medications</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.currentMedications.map((medication, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
                      {medication}
                      {isEditing && (
                        <button onClick={() => removeMedication(index)} className="ml-2 hover:text-red-600">×</button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2 mt-2">
                    <Input 
                      placeholder="Add medication..."
                      value={newMedication}
                      onChange={(e) => setNewMedication(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addMedication()}
                      className="bg-[#F1F5F9] border-none rounded-xl"
                    />
                    <Button variant="outline" onClick={addMedication}>Add</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="rounded-xl border-[#E2E8F0] shadow-[0_4px_20px_rgba(11,28,48,0.04)]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <UserPlus className="h-5 w-5 text-[#006767]" />
                <CardTitle className="text-2xl font-semibold text-[#0b1c30]">Emergency Contact</CardTitle>
              </div>
              <CardDescription>Person to contact in case of emergency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Full Name</Label>
                  <Input 
                    value={profile.emergencyContact.name}
                    onChange={(e) => setProfile({ 
                      ...profile, 
                      emergencyContact: { ...profile.emergencyContact, name: e.target.value }
                    })}
                    disabled={!isEditing}
                    className="bg-[#F1F5F9] border-none rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Relationship</Label>
                  <Select 
                    value={profile.emergencyContact.relationship} 
                    onValueChange={(value) => setProfile({ 
                      ...profile, 
                      emergencyContact: { ...profile.emergencyContact, relationship: value }
                    })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="bg-[#F1F5F9] border-none rounded-xl">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Spouse">Spouse</SelectItem>
                      <SelectItem value="Parent">Parent</SelectItem>
                      <SelectItem value="Child">Child</SelectItem>
                      <SelectItem value="Sibling">Sibling</SelectItem>
                      <SelectItem value="Friend">Friend</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[#3d4949] text-sm font-medium ml-1">Phone Number</Label>
                  <Input 
                    value={profile.emergencyContact.phone}
                    onChange={(e) => setProfile({ 
                      ...profile, 
                      emergencyContact: { ...profile.emergencyContact, phone: e.target.value }
                    })}
                    disabled={!isEditing}
                    className="bg-[#F1F5F9] border-none rounded-xl"
                  />
                </div>
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
                    <p className="text-[#3d4949] text-sm">Ensure your account is using a long, random password to stay secure.</p>
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
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
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
                  <div></div>
                  <div className="space-y-2">
                    <Label className="text-[#3d4949] text-sm font-medium ml-1">New Password</Label>
                    <div className="relative">
                      <Input 
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
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
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
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
                  <p className="text-[#3d4949] text-sm">Once you delete your account, there is no going back. Please be certain.</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Deactivate
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove all your data from our servers.
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
  )
}