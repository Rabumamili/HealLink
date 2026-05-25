"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Building,
  Save,
  Key,
  Bell,
  CheckCircle,
  Shield,
  Calendar,
  MapPin,
  FileText,
  Clock,
  Award,
  Users,
  DollarSign,
  Phone,
  Mail,
  Globe,
  Star,
  TrendingUp,
  AlertCircle,
  Upload,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ClinicProfile {
  // Clinic Information
  clinic_name: string
  clinic_address: string
  clinic_phone: string
  clinic_email: string
  clinic_website?: string
  clinic_license_number: string
  clinic_tin_number: string
  operating_hours: string
  description: string
  established_year?: string
  emergency_contact?: string
  
  // Images
  logo_url?: string
  cover_image_url?: string
  
  // Statistics
  total_doctors: number
  total_staff: number
  total_patients_served: number
  rating: number
  total_reviews: number
  
  // Status
  status: "active" | "pending" | "suspended"
  verification_status: "verified" | "pending" | "unverified"
  joined_date: string
}

// Mock clinic data based on registration form
const mockClinicProfile: ClinicProfile = {
  // Clinic Information
  clinic_name: "Hayat General Clinic",
  clinic_address: "Bole Road, Near Bole Medhanialem Church, Addis Ababa, Ethiopia",
  clinic_phone: "+251-911-678-901",
  clinic_email: "info@hayatclinic.com",
  clinic_website: "www.hayatclinic.com",
  clinic_license_number: "CL-2024-00123",
  clinic_tin_number: "123456789",
  operating_hours: "Monday - Friday: 8:00 AM - 8:00 PM\nSaturday: 9:00 AM - 5:00 PM\nSunday: Closed",
  description: "Hayat General Clinic is a full-service medical center offering comprehensive healthcare services including general medicine, pediatrics, gynecology, laboratory tests, and specialist referrals. We are committed to providing quality, accessible healthcare to our community with compassion and excellence.",
  established_year: "2015",
  emergency_contact: "+251-911-000-000",
  
  // Images
  logo_url: "",
  cover_image_url: "",
  
  // Statistics
  total_doctors: 8,
  total_staff: 15,
  total_patients_served: 12500,
  rating: 4.8,
  total_reviews: 234,
  
  // Status
  status: "active",
  verification_status: "verified",
  joined_date: "2023-10-12"
}

export default function ClinicProfilePage() {
  const [profile, setProfile] = useState<ClinicProfile>(mockClinicProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [editForm, setEditForm] = useState<ClinicProfile>(profile)
  const [activeTab, setActiveTab] = useState("overview")
  const [logoPreview, setLogoPreview] = useState<string | null>(profile.logo_url || null)
  const [coverPreview, setCoverPreview] = useState<string | null>(profile.cover_image_url || null)

  useEffect(() => {
    // Load from localStorage if exists
    const savedClinic = localStorage.getItem('clinicRegistration')
    if (savedClinic) {
      const clinicData = JSON.parse(savedClinic)
      setProfile(prev => ({
        ...prev,
        clinic_name: clinicData.clinic_name || prev.clinic_name,
        clinic_address: clinicData.clinic_address || prev.clinic_address,
        clinic_phone: clinicData.clinic_phone || prev.clinic_phone,
        clinic_email: clinicData.email || prev.clinic_email,
        clinic_license_number: clinicData.clinic_license_number || prev.clinic_license_number,
        clinic_tin_number: clinicData.clinic_tin_number || prev.clinic_tin_number,
        operating_hours: clinicData.operating_hours || prev.operating_hours,
      }))
    }
  }, [])

  const handleEdit = () => {
    setEditForm(profile)
    setIsEditing(true)
  }

  const handleSave = () => {
    setProfile(editForm)
    setIsEditing(false)
    setShowSaveDialog(true)
    toast.success("Clinic profile updated successfully!")
    setTimeout(() => setShowSaveDialog(false), 3000)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditForm(profile)
    setLogoPreview(profile.logo_url || null)
    setCoverPreview(profile.cover_image_url || null)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setLogoPreview(result)
        setEditForm({ ...editForm, logo_url: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setCoverPreview(result)
        setEditForm({ ...editForm, cover_image_url: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const stats = [
    { title: "Total Doctors", value: profile.total_doctors, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Staff", value: profile.total_staff, icon: Users, color: "text-green-600", bg: "bg-green-50" },
    { title: "Patients Served", value: profile.total_patients_served.toLocaleString(), icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Rating", value: `${profile.rating} ★`, icon: Star, color: "text-yellow-600", bg: "bg-yellow-50" },
  ]

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-teal-600">Clinic Profile</h1>
          <p className="text-muted-foreground">Manage your clinic information and settings</p>
        </div>
        {!isEditing ? (
          <Button onClick={handleEdit} className="bg-teal-600 hover:bg-teal-700">
            Edit Clinic Info
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Save Success Message */}
      {showSaveDialog && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
          <div className="bg-green-100 border border-green-300 rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-3 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <p>Clinic profile updated successfully!</p>
            </div>
          </div>
        </div>
      )}

      {/* Cover Image Section */}
      <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden bg-gradient-to-r from-teal-500 to-teal-700">
        {coverPreview ? (
          <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/50">
            <Building className="h-20 w-20" />
          </div>
        )}
        {isEditing && (
          <div className="absolute bottom-4 right-4">
            <label className="cursor-pointer bg-white/90 hover:bg-white rounded-lg px-3 py-2 text-sm font-medium text-teal-600 shadow-md transition-all">
              <Upload className="h-4 w-4 inline mr-2" />
              Change Cover
              <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
            </label>
          </div>
        )}
        
        {/* Logo */}
        <div className="absolute -bottom-12 left-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-white shadow-lg overflow-hidden border-4 border-white">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                  <Building className="h-10 w-10 text-teal-600" />
                </div>
              )}
            </div>
            {isEditing && (
              <label className="absolute -bottom-2 -right-2 cursor-pointer bg-teal-600 hover:bg-teal-700 rounded-full p-1.5 shadow-md transition-all">
                <Upload className="h-3 w-3 text-white" />
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Spacer for logo */}
      <div className="h-12"></div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Clinic Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 border shadow-sm">
                <div className="flex items-center justify-between">
                  <div className={cn("p-2 rounded-lg", stat.bg)}>
                    <stat.icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{stat.title}</p>
              </div>
            ))}
          </div>

          {/* Clinic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-teal-600" />
                Clinic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-gray-800">{profile.clinic_address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-gray-800">{profile.clinic_phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-800">{profile.clinic_email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Website</p>
                    <p className="text-gray-800">{profile.clinic_website || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Operating Hours</p>
                    <p className="text-gray-800 whitespace-pre-line">{profile.operating_hours}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">License Number</p>
                    <p className="text-gray-800 font-mono">{profile.clinic_license_number}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-500 mb-2">About the Clinic</p>
                <p className="text-gray-700 leading-relaxed">{profile.description}</p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Badge variant={profile.verification_status === "verified" ? "default" : "secondary"} 
                         className={cn(profile.verification_status === "verified" && "bg-green-100 text-green-700")}>
                    {profile.verification_status === "verified" ? "✓ Verified" : "Pending Verification"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Joined: {profile.joined_date}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {profile.rating} ({profile.total_reviews} reviews)
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clinic Details Tab - Editable */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Clinic Details</CardTitle>
              <CardDescription>Complete clinic information and credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Clinic Name */}
                <div className="md:col-span-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Clinic Name
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editForm.clinic_name}
                      onChange={(e) => setEditForm({ ...editForm, clinic_name: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 font-medium text-lg">{profile.clinic_name}</p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Clinic Address
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={editForm.clinic_address}
                      onChange={(e) => setEditForm({ ...editForm, clinic_address: e.target.value })}
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-1">{profile.clinic_address}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editForm.clinic_phone}
                      onChange={(e) => setEditForm({ ...editForm, clinic_phone: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1">{profile.clinic_phone}</p>
                  )}
                </div>

                {/* Emergency Contact */}
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Emergency Contact
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editForm.emergency_contact || ""}
                      onChange={(e) => setEditForm({ ...editForm, emergency_contact: e.target.value })}
                      className="mt-1"
                      placeholder="Emergency phone number"
                    />
                  ) : (
                    <p className="mt-1">{profile.emergency_contact || "Not provided"}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editForm.clinic_email}
                      onChange={(e) => setEditForm({ ...editForm, clinic_email: e.target.value })}
                      className="mt-1"
                      type="email"
                    />
                  ) : (
                    <p className="mt-1">{profile.clinic_email}</p>
                  )}
                </div>

                {/* Website */}
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editForm.clinic_website || ""}
                      onChange={(e) => setEditForm({ ...editForm, clinic_website: e.target.value })}
                      className="mt-1"
                      placeholder="www.example.com"
                    />
                  ) : (
                    <p className="mt-1">{profile.clinic_website || "Not provided"}</p>
                  )}
                </div>

                {/* License Number */}
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    License Number
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editForm.clinic_license_number}
                      onChange={(e) => setEditForm({ ...editForm, clinic_license_number: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 font-mono">{profile.clinic_license_number}</p>
                  )}
                </div>

                {/* TIN Number */}
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    TIN Number
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editForm.clinic_tin_number}
                      onChange={(e) => setEditForm({ ...editForm, clinic_tin_number: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 font-mono">{profile.clinic_tin_number}</p>
                  )}
                </div>

                {/* Established Year */}
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Established Year
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editForm.established_year || ""}
                      onChange={(e) => setEditForm({ ...editForm, established_year: e.target.value })}
                      className="mt-1"
                      placeholder="YYYY"
                    />
                  ) : (
                    <p className="mt-1">{profile.established_year || "Not provided"}</p>
                  )}
                </div>

                {/* Operating Hours */}
                <div className="md:col-span-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Operating Hours
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={editForm.operating_hours}
                      onChange={(e) => setEditForm({ ...editForm, operating_hours: e.target.value })}
                      className="mt-1"
                      rows={4}
                      placeholder="Monday - Friday: 9:00 AM - 6:00 PM&#10;Saturday: 10:00 AM - 4:00 PM&#10;Sunday: Closed"
                    />
                  ) : (
                    <p className="mt-1 whitespace-pre-line">{profile.operating_hours}</p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Clinic Description
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="mt-1"
                      rows={6}
                    />
                  ) : (
                    <p className="mt-1 leading-relaxed">{profile.description}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Legal Documents</CardTitle>
              <CardDescription>Upload and manage clinic registration documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Registration Certificate</p>
                <p className="text-sm text-gray-400 mt-1">PDF, JPG or PNG (Max 5MB)</p>
                <Button variant="outline" className="mt-4">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Uploaded Documents</h3>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Clinic License Certificate</p>
                      <p className="text-xs text-gray-500">Uploaded on Oct 12, 2023</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Verified</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">TIN Certificate</p>
                      <p className="text-xs text-gray-500">Uploaded on Oct 12, 2023</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Verified</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}