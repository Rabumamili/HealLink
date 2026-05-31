// app/diagnosticCenter/staff/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Trash2, 
  UserPlus, 
  Send, 
  Loader2,
  Ban,
  CheckCircle,
  Users,
  UserCheck,
  Shield,
  Key,
  MoreVertical,
  Edit,
  Eye,
  EyeOff
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import { StaffSubRole, ProviderType, AuthUser } from "@/types/entities/auth.types"

// Map staff sub-roles to display names for diagnostic center
const staffRoleDisplay: Record<StaffSubRole, string> = {
  'lab assistant': 'Lab Technician',
  'card_checker': 'Card Checker'
}

// Reverse map for display to actual role
const displayToStaffRole: Record<string, StaffSubRole> = {
  'Lab Technician': 'lab assistant',
  'Card Checker': 'card_checker'
}

interface StaffMemberWithStatus extends AuthUser {
  status: 'Active' | 'Invited' | 'Inactive'
  addedDate: string
}

export default function DiagnosticCenterStaffPage() {
  const { 
    user: currentUser, 
    getStaffMembers, 
    registerStaff, 
    resendStaffInvitation,
    deactivateStaff,
    activateStaff,
    deleteStaff,
    isLoading: authLoading 
  } = useAuth({
    requireAuth: true,
    allowedRoles: ['diagnostic_center']
  })

  const [staff, setStaff] = useState<StaffMemberWithStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [newStaff, setNewStaff] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "Lab Technician" as string,
    password: ""
  })

  const employerId = currentUser?.provider_id || currentUser?.id
  const employerType = currentUser?.role as ProviderType

  // Load staff members
  const loadStaffMembers = async () => {
    if (!employerId || !employerType) return
    
    setIsLoading(true)
    try {
      const staffMembers = await getStaffMembers(employerId, employerType)
      
      // Transform API response to include status and addedDate
      const formattedStaff: StaffMemberWithStatus[] = staffMembers.map(member => ({
        ...member,
        status: member.is_active ? 'Active' : 'Inactive',
        addedDate: new Date(member.created_at).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
      }))
      
      setStaff(formattedStaff)
    } catch (error) {
      console.error('Failed to load staff:', error)
      toast.error('Failed to load staff members')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (employerId && employerType) {
      loadStaffMembers()
    }
  }, [employerId, employerType])

  const filteredStaff = staff.filter(member => {
    const fullName = `${member.first_name || ''} ${member.last_name || ''}`.toLowerCase()
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || 
                       staffRoleDisplay[member.staff_sub_role!] === roleFilter
    return matchesSearch && matchesRole
  })

  const handleAddStaff = async () => {
    if (!newStaff.firstName || !newStaff.lastName || !newStaff.email || !newStaff.password) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!employerId || !employerType) {
      toast.error('No employer information found')
      return
    }

    setIsProcessing(true)
    try {
      const result = await registerStaff({
        employer_id: employerId,
        employer_type: employerType,
        email: newStaff.email,
        first_name: newStaff.firstName,
        last_name: newStaff.lastName,
        phone_number: newStaff.phoneNumber,
        role: displayToStaffRole[newStaff.role],
        send_invitation: true
      })

      if (result.success && result.data) {
        toast.success(result.data.message || `Invitation sent to ${newStaff.firstName} ${newStaff.lastName}`)
        setNewStaff({ 
          firstName: "", 
          lastName: "", 
          email: "", 
          phoneNumber: "", 
          role: "Lab Technician",
          password: "" 
        })
        setIsAddModalOpen(false)
        await loadStaffMembers()
      } else if (result.error) {
        toast.error((result.error as any)?.message || 'Failed to add staff member')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to add staff member')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRemoveStaff = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the staff list? This action cannot be undone.`)) {
      setIsProcessing(true)
      try {
        const response = await deleteStaff(id)
        toast.success(response.message || `${name} has been removed`)
        await loadStaffMembers()
      } catch (error: any) {
        toast.error(error.message || 'Failed to remove staff member')
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleDeactivateStaff = async (id: number, name: string, currentStatus: string) => {
    if (currentStatus === 'Active') {
      if (confirm(`Are you sure you want to deactivate ${name}?`)) {
        setIsProcessing(true)
        try {
          const response = await deactivateStaff(id)
          toast.success(response.message || `${name} has been deactivated`)
          await loadStaffMembers()
        } catch (error: any) {
          toast.error(error.message || 'Failed to deactivate staff member')
        } finally {
          setIsProcessing(false)
        }
      }
    } else if (currentStatus === 'Inactive') {
      if (confirm(`Are you sure you want to activate ${name}?`)) {
        setIsProcessing(true)
        try {
          const response = await activateStaff(id)
          toast.success(response.message || `${name} has been activated`)
          await loadStaffMembers()
        } catch (error: any) {
          toast.error(error.message || 'Failed to activate staff member')
        } finally {
          setIsProcessing(false)
        }
      }
    }
  }

  const handleResendInvite = async (email: string, name: string) => {
    setIsProcessing(true)
    try {
      const response = await resendStaffInvitation(email)
      toast.success(response.message || `Invitation resent to ${name}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend invitation')
    } finally {
      setIsProcessing(false)
    }
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'ST'
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  const activeStaff = staff.filter(s => s.status === 'Active').length

  if (authLoading || (isLoading && staff.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">Staff Management</h1>
          <p className="text-body-md text-secondary mt-1">
            Manage and monitor laboratory staff for your diagnostic center.
          </p>
        </div>
        <Button 
          className="flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-xl shadow-md transition-all duration-300"
          onClick={() => setIsAddModalOpen(true)}
          disabled={isProcessing}
        >
          <UserPlus className="h-5 w-5" />
          Add Staff Member
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-outline-variant shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase">Total Staff</p>
                <p className="text-2xl font-bold text-on-surface">{staff.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-outline-variant shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase">Active Staff</p>
                <p className="text-2xl font-bold text-on-surface">{activeStaff}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-outline-variant shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase">Roles</p>
                <p className="text-2xl font-bold text-on-surface">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-outline-variant shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Key className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase">Invited Pending</p>
                <p className="text-2xl font-bold text-on-surface">
                  {staff.filter(s => s.status === 'Invited').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-surface-container-lowest rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center border border-outline-variant/30 shadow-sm">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-outline" />
          <input
            className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-lg pl-12 py-3 text-body-md outline-none"
            placeholder="Search staff by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            className="w-full md:w-[180px] bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-lg py-3 px-4 outline-none"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="Lab Technician">Lab Technician</option>
            <option value="Card Checker">Card Checker</option>
          </select>
          <Button variant="outline" className="p-3 bg-surface-container-low rounded-lg">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Staff Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredStaff.length === 0 ? (
        <div className="text-center py-12 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
          <Users className="h-12 w-12 mx-auto text-outline mb-3" />
          <p className="text-secondary">No staff members found</p>
          <p className="text-sm text-secondary mt-1">Click "Add Staff Member" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStaff.map((member) => (
            <div 
              key={member.id} 
              className="bg-surface-container-lowest rounded-xl p-6 flex flex-col relative group overflow-hidden border border-outline-variant/30 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 bg-secondary-container">
                    <AvatarFallback className="bg-secondary-container text-on-secondary-container text-lg font-semibold">
                      {getInitials(member.first_name, member.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-headline-md text-[18px] text-on-surface font-semibold">
                      {member.first_name} {member.last_name}
                    </h3>
                    <p className="text-label-md text-primary">
                      {staffRoleDisplay[member.staff_sub_role!]}
                    </p>
                  </div>
                </div>
                <Badge className={cn(
                  "px-3 py-1 rounded-full text-[12px] uppercase tracking-wider",
                  member.status === "Active" ? "bg-primary/10 text-primary" : 
                  member.status === "Invited" ? "bg-yellow-100 text-yellow-700" :
                  "bg-surface-variant text-on-surface-variant"
                )}>
                  {member.status}
                </Badge>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <Mail className="h-5 w-5" />
                  <span className="text-body-md">{member.email}</span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <Phone className="h-5 w-5" />
                  <span className="text-body-md">{member.phone_number}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-outline-variant/30 flex justify-between items-center">
                <p className="text-xs text-secondary">Added: {member.addedDate}</p>
                <div className="flex gap-1">
                  {member.status === "Invited" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-secondary hover:text-primary"
                      onClick={() => handleResendInvite(member.email, `${member.first_name} ${member.last_name}`)}
                      disabled={isProcessing}
                      title="Resend invitation"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  )}
                  {member.status === "Active" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-amber-500 hover:bg-amber-50"
                      onClick={() => handleDeactivateStaff(member.id, `${member.first_name} ${member.last_name}`, member.status)}
                      disabled={isProcessing}
                      title="Deactivate"
                    >
                      <Ban className="h-5 w-5" />
                    </Button>
                  )}
                  {member.status === "Inactive" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-green-500 hover:bg-green-50"
                      onClick={() => handleDeactivateStaff(member.id, `${member.first_name} ${member.last_name}`, member.status)}
                      disabled={isProcessing}
                      title="Activate"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                    onClick={() => handleRemoveStaff(member.id, `${member.first_name} ${member.last_name}`)}
                    disabled={isProcessing}
                    title="Remove"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Card */}
          <div 
            className="border-2 border-dashed border-outline-variant/50 rounded-xl p-6 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-surface-container-low transition-all duration-300 group min-h-[280px]"
            onClick={() => setIsAddModalOpen(true)}
          >
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-outline group-hover:scale-110 group-hover:bg-primary-container/20 group-hover:text-primary transition-all duration-300">
              <UserPlus className="h-8 w-8" />
            </div>
            <div className="text-center">
              <p className="font-headline-md text-[18px] text-secondary font-semibold group-hover:text-primary transition-colors">Add New Member</p>
              <p className="text-body-md text-secondary">Register a new staff member</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Add Staff Member</DialogTitle>
            <DialogDescription>
              Add a new staff member to your diagnostic center. They will receive an invitation email to set up their account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-secondary mb-2 block">First Name *</Label>
                <Input
                  placeholder="e.g., Sarah"
                  value={newStaff.firstName}
                  onChange={(e) => setNewStaff({ ...newStaff, firstName: e.target.value })}
                  className="bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-xl"
                  disabled={isProcessing}
                />
              </div>
              <div>
                <Label className="text-secondary mb-2 block">Last Name *</Label>
                <Input
                  placeholder="e.g., Chen"
                  value={newStaff.lastName}
                  onChange={(e) => setNewStaff({ ...newStaff, lastName: e.target.value })}
                  className="bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-xl"
                  disabled={isProcessing}
                />
              </div>
            </div>
            <div>
              <Label className="text-secondary mb-2 block">Email Address *</Label>
              <Input
                type="email"
                placeholder="staff@example.com"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                className="bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-xl"
                disabled={isProcessing}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-secondary mb-2 block">Phone Number</Label>
                <Input
                  placeholder="+251 912 345 678"
                  value={newStaff.phoneNumber}
                  onChange={(e) => setNewStaff({ ...newStaff, phoneNumber: e.target.value })}
                  className="bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-xl"
                  disabled={isProcessing}
                />
              </div>
              <div>
                <Label className="text-secondary mb-2 block">Role *</Label>
                <Select 
                  value={newStaff.role} 
                  onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}
                  disabled={isProcessing}
                >
                  <SelectTrigger className="bg-surface-container-low border-none rounded-xl">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lab Technician">Lab Technician</SelectItem>
                    <SelectItem value="Card Checker">Card Checker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-secondary mb-2 block">Temporary Password *</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter temporary password"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  className="bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-xl pr-10"
                  disabled={isProcessing}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-secondary mt-1">
                Staff member will need to change this password on first login
              </p>
            </div>
          </div>
          <DialogFooter className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsAddModalOpen(false)} 
              className="flex-1 py-4"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddStaff} 
              className="flex-1 py-4 bg-primary hover:bg-primary-container text-white shadow-lg"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Invitation'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}