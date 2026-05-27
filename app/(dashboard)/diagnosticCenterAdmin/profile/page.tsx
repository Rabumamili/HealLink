// app/diagnosticCenter/profile/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
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
  TrendingUp,
  AlertCircle,
  Upload,
  Phone,
  Mail,
  Globe,
  Star,
  FlaskConical,
  Microscope,
  Activity
} from "lucide-react"

interface DiagnosticCenterProfile {
  // Center Information
  center_name: string
  center_address: string
  center_phone: string
  center_email: string
  center_website?: string
  center_license_number: string
  center_tin_number: string
  center_accreditation: string
  services_description: string
  operating_hours: string
  established_year?: string
  emergency_contact?: string
  
  // Images
  logo_url?: string
  cover_image_url?: string
  
  // Statistics
  total_tests_performed: number
  total_doctors: number
  total_staff: number
  total_patients_served: number
  rating: number
  total_reviews: number
  
  // Services Offered
  services_offered: string[]
  
  // Status
  status: "active" | "pending" | "suspended"
  verification_status: "verified" | "pending" | "unverified"
  joined_date: string
}

// Mock diagnostic center data based on registration form
const mockDiagnosticCenterProfile: DiagnosticCenterProfile = {
  // Center Information
  center_name: "Addis Diagnostic Center",
  center_address: "Bole Road, Behind Bole Medhanialem Church, Addis Ababa, Ethiopia",
  center_phone: "+251-911-890-123",
  center_email: "info@addisdiagnostic.com",
  center_website: "www.addisdiagnostic.com",
  center_license_number: "DCL-2024-00123",
  center_tin_number: "123456789",
  center_accreditation: "ISO 15189, CLIA Certified",
  services_description: "State-of-the-art diagnostic center providing accurate laboratory and imaging services with modern equipment and experienced technicians. We offer comprehensive diagnostic services including clinical laboratory tests, medical imaging, and specialized diagnostic procedures.",
  operating_hours: "Monday - Friday: 7:00 AM - 9:00 PM\nSaturday: 8:00 AM - 6:00 PM\nSunday: 9:00 AM - 4:00 PM",
  established_year: "2018",
  emergency_contact: "+251-911-000-000",
  
  // Images
  logo_url: "",
  cover_image_url: "",
  
  // Statistics
  total_tests_performed: 50000,
  total_doctors: 12,
  total_staff: 35,
  total_patients_served: 25000,
  rating: 4.9,
  total_reviews: 892,
  
  // Services Offered
  services_offered: [
    "Complete Blood Count (CBC)",
    "Lipid Panel",
    "Thyroid Function Test",
    "Liver Function Test",
    "Kidney Function Test",
    "Urinalysis",
    "X-Ray",
    "Ultrasound",
    "CT Scan",
    "MRI"
  ],
  
  // Status
  status: "active",
  verification_status: "verified",
  joined_date: "2023-10-12"
}

export default function DiagnosticCenterProfilePage() {
  const [profile, setProfile] = useState<DiagnosticCenterProfile>(mockDiagnosticCenterProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [editForm, setEditForm] = useState<DiagnosticCenterProfile>(profile)
  const [activeTab, setActiveTab] = useState("overview")
  const [logoPreview, setLogoPreview] = useState<string | null>(profile.logo_url || null)
  const [coverPreview, setCoverPreview] = useState<string | null>(profile.cover_image_url || null)

  useEffect(() => {
    // Load from localStorage if exists
    const savedCenter = localStorage.getItem('diagnosticRegistration')
    if (savedCenter) {
      const centerData = JSON.parse(savedCenter)
      setProfile(prev => ({
        ...prev,
        center_name: centerData.center_name || prev.center_name,
        center_address: centerData.center_address || prev.center_address,
        center_phone: centerData.center_phone || prev.center_phone,
        center_email: centerData.email || prev.center_email,
        center_license_number: centerData.center_license_number || prev.center_license_number,
        center_tin_number: centerData.center_tin_number || prev.center_tin_number,
        center_accreditation: centerData.center_accreditation || prev.center_accreditation,
        services_description: centerData.services_description || prev.services_description,
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
    toast.success("Diagnostic center profile updated successfully!")
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
    { title: "Tests Performed", value: profile.total_tests_performed.toLocaleString(), icon: FlaskConical, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Doctors", value: profile.total_doctors, icon: Users, color: "text-green-600", bg: "bg-green-50" },
    { title: "Total Staff", value: profile.total_staff, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Patients Served", value: profile.total_patients_served.toLocaleString(), icon: Activity, color: "text-orange-600", bg: "bg-orange-50" },
    { title: "Rating", value: `${profile.rating} ★`, icon: Star, color: "text-yellow-600", bg: "bg-yellow-50" },
  ]

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Diagnostic Center Profile</h1>
          <p className="text-muted-foreground">Manage your diagnostic center information and settings</p>
        </div>
        {!isEditing ? (
          <Button onClick={handleEdit} className="bg-primary hover:bg-primary/90">
            Edit Center Info
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
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
              <p>Diagnostic center profile updated successfully!</p>
            </div>
          </div>
        </div>
      )}

      {/* Cover Image Section */}
      <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-primary/70">
        {coverPreview ? (
          <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/50">
            <Microscope className="h-20 w-20" />
          </div>
        )}
        {isEditing && (
          <div className="absolute bottom-4 right-4">
            <label className="cursor-pointer bg-white/90 hover:bg-white rounded-lg px-3 py-2 text-sm font-medium text-primary shadow-md transition-all">
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
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                  <FlaskConical className="h-10 w-10 text-primary" />
                </div>
              )}
            </div>
            {isEditing && (
              <label className="absolute -bottom-2 -right-2 cursor-pointer bg-primary hover:bg-primary/90 rounded-full p-1.5 shadow-md transition-all">
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
          <TabsTrigger value="details">Center Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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

          {/* Center Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Center Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-gray-800">{profile.center_address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-gray-800">{profile.center_phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-800">{profile.center_email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Website</p>
                    <p className="text-gray-800">{profile.center_website || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Operating Hours</p>
                    <p className="text-gray-800 whitespace-pre-line">{profile.operating_hours}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Accreditation</p>
                    <p className="text-gray-800">{profile.center_accreditation}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-500 mb-2">About the Center</p>
                <p className="text-gray-700 leading-relaxed">{profile.services_description}</p>
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

          {/* Services Offered */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-primary" />
                Services Offered
              </CardTitle>
              <CardDescription>Available diagnostic services at this center</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.services_offered.map((service, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-primary/10 text-primary">
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Center Details Tab - Editable */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Center Details</CardTitle>
              <CardDescription>Complete diagnostic center information and credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Center Name */}
                <div className="md:col-span-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Diagnostic Center Name
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editForm.center_name}
                      onChange={(e) => setEditForm({ ...editForm, center_name: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 font-medium text-lg">{profile.center_name}</p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Center Address
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={editForm.center_address}
                      onChange={(e) => setEditForm({ ...editForm, center_address: e.target.value })}
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-1">{profile.center_address}</p>
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
                      value={editForm.center_phone}
                      onChange={(e) => setEditForm({ ...editForm, center_phone: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1">{profile.center_phone}</p>
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
                      value={editForm.center_email}
                      onChange={(e) => setEditForm({ ...editForm, center_email: e.target.value })}
                      className="mt-1"
                      type="email"
                    />
                  ) : (
                    <p className="mt-1">{profile.center_email}</p>
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
                      value={editForm.center_website || ""}
                      onChange={(e) => setEditForm({ ...editForm, center_website: e.target.value })}
                      className="mt-1"
                      placeholder="www.example.com"
                    />
                  ) : (
                    <p className="mt-1">{profile.center_website || "Not provided"}</p>
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
                      value={editForm.center_license_number}
                      onChange={(e) => setEditForm({ ...editForm, center_license_number: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 font-mono">{profile.center_license_number}</p>
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
                      value={editForm.center_tin_number}
                      onChange={(e) => setEditForm({ ...editForm, center_tin_number: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 font-mono">{profile.center_tin_number}</p>
                  )}
                </div>

                {/* Accreditation */}
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Accreditation / Certification
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editForm.center_accreditation}
                      onChange={(e) => setEditForm({ ...editForm, center_accreditation: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1">{profile.center_accreditation}</p>
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

                {/* Services Description */}
                <div className="md:col-span-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <FlaskConical className="h-4 w-4" />
                    Services Description
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={editForm.services_description}
                      onChange={(e) => setEditForm({ ...editForm, services_description: e.target.value })}
                      className="mt-1"
                      rows={6}
                    />
                  ) : (
                    <p className="mt-1 leading-relaxed">{profile.services_description}</p>
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
              <CardDescription>Upload and manage diagnostic center registration documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Registration Certificate / Business License</p>
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
                      <p className="font-medium">Diagnostic Center License Certificate</p>
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
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Accreditation Certificate (ISO 15189)</p>
                      <p className="text-xs text-gray-500">Uploaded on Nov 5, 2023</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">Pending Review</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}