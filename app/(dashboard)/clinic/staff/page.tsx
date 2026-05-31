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
import { Search, Filter, Mail, Phone, Trash2, UserPlus, Send, Loader2, Ban, CheckCircle, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import { StaffSubRole, ProviderType, AuthUser } from "@/types/entities/auth.types"

// Map staff sub-roles to display names
const staffRoleDisplay: Record<StaffSubRole, string> = {
  'lab assistant': 'Lab Assistant',
  'card_checker': 'Card Checker'
}

// Reverse map for display to actual role
const displayToStaffRole: Record<string, StaffSubRole> = {
  'Lab Assistant': 'lab assistant',
  'Card Checker': 'card_checker'
}

interface StaffMemberWithStatus extends AuthUser {
  status: 'Active' | 'Invited' | 'Inactive'
  addedDate: string
}

export default function StaffManagementPage() {
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
    allowedRoles: ['doctor', 'clinic', 'diagnostic_center']
  })

  const [staff, setStaff] = useState<StaffMemberWithStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [newStaff, setNewStaff] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "Lab Assistant" as string,
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
    if (!newStaff.firstName || !newStaff.lastName || !newStaff.email || !newStaff.phoneNumber) {
      toast.error('Please fill in all fields')
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

      // Handle the wrapped response from useAuth
      if (result.success && result.data) {
        toast.success(result.data.message || `Invitation sent to ${newStaff.firstName} ${newStaff.lastName}`)
        setNewStaff({ firstName: "", lastName: "", email: "", phoneNumber: "", role: "Lab Assistant" })
        setIsAddModalOpen(false)
        await loadStaffMembers() // Refresh the list
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

  if (authLoading || (isLoading && staff.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Staff Management</h1>
          <p className="text-gray-500 mt-1">
            Manage and monitor staff members for your {employerType?.replace('_', ' ')}.
          </p>
        </div>
        <Button 
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-300 hover:-translate-y-0.5"
          onClick={() => setIsAddModalOpen(true)}
          disabled={isProcessing}
        >
          <UserPlus className="h-5 w-5" />
          Add Staff Member
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center bg-white border border-gray-200 shadow-sm">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            className="w-full bg-white border border-gray-200 focus:ring-1 focus:ring-teal-500 rounded-lg pl-12 py-3 outline-none"
            placeholder="Search staff by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            className="w-full md:w-[180px] bg-white border border-gray-200 focus:ring-1 focus:ring-teal-500 rounded-lg py-3 px-4 outline-none"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="Lab Assistant">Lab Assistant</option>
            <option value="Card Checker">Card Checker</option>
          </select>
          <Button variant="outline" className="p-3 bg-white rounded-lg border border-gray-200">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Staff List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        </div>
      ) : filteredStaff.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No staff members found</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Staff Member" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStaff.map((member) => (
            <div 
              key={member.id} 
              className="rounded-xl p-6 flex flex-col relative group overflow-hidden bg-white border border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-teal-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 bg-teal-50">
                    <AvatarFallback className="bg-teal-50 text-teal-600 text-lg font-semibold">
                      {getInitials(member.first_name, member.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {member.first_name} {member.last_name}
                    </h3>
                    <p className="text-sm text-teal-600 font-medium">
                      {staffRoleDisplay[member.staff_sub_role!]}
                    </p>
                  </div>
                </div>
                <Badge className={cn(
                  "px-3 py-1 rounded-full text-xs uppercase tracking-wider",
                  member.status === "Active" ? "bg-green-100 text-green-700" : 
                  member.status === "Invited" ? "bg-yellow-100 text-yellow-700" :
                  "bg-gray-100 text-gray-700"
                )}>
                  {member.status}
                </Badge>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="h-5 w-5" />
                  <span className="text-sm">{member.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="h-5 w-5" />
                  <span className="text-sm">{member.phone_number}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                <p className="text-xs text-gray-400">Added: {member.addedDate}</p>
                <div className="flex gap-1">
                  {member.status === "Invited" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-500 hover:text-teal-600"
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
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-gray-50 transition-all duration-300 group min-h-[280px]"
            onClick={() => setIsAddModalOpen(true)}
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:scale-110 group-hover:bg-teal-50 group-hover:text-teal-600 transition-all duration-300">
              <UserPlus className="h-8 w-8" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-500 group-hover:text-teal-600 transition-colors">Add New Member</p>
              <p className="text-sm text-gray-400">Register a new staff member</p>
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
              Add a new staff member to your {employerType?.replace('_', ' ')}. They will receive an invitation email to set up their account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-600 mb-2 block">First Name</Label>
                <Input
                  placeholder="e.g., Dawit"
                  value={newStaff.firstName}
                  onChange={(e) => setNewStaff({ ...newStaff, firstName: e.target.value })}
                  className="bg-gray-50 border-gray-200 focus:ring-1 focus:ring-teal-500 rounded-xl"
                  disabled={isProcessing}
                />
              </div>
              <div>
                <Label className="text-gray-600 mb-2 block">Last Name</Label>
                <Input
                  placeholder="e.g., Yohannes"
                  value={newStaff.lastName}
                  onChange={(e) => setNewStaff({ ...newStaff, lastName: e.target.value })}
                  className="bg-gray-50 border-gray-200 focus:ring-1 focus:ring-teal-500 rounded-xl"
                  disabled={isProcessing}
                />
              </div>
            </div>
            <div>
              <Label className="text-gray-600 mb-2 block">Email Address</Label>
              <Input
                type="email"
                placeholder="staff@example.com"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                className="bg-gray-50 border-gray-200 focus:ring-1 focus:ring-teal-500 rounded-xl"
                disabled={isProcessing}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-600 mb-2 block">Phone Number</Label>
                <Input
                  placeholder="+251 912 345 678"
                  value={newStaff.phoneNumber}
                  onChange={(e) => setNewStaff({ ...newStaff, phoneNumber: e.target.value })}
                  className="bg-gray-50 border-gray-200 focus:ring-1 focus:ring-teal-500 rounded-xl"
                  disabled={isProcessing}
                />
              </div>
              <div>
                <Label className="text-gray-600 mb-2 block">Role</Label>
                <Select 
                  value={newStaff.role} 
                  onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}
                  disabled={isProcessing}
                >
                  <SelectTrigger className="bg-gray-50 border-gray-200 rounded-xl">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lab Assistant">Lab Assistant</SelectItem>
                    <SelectItem value="Card Checker">Card Checker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              className="flex-1 py-4 bg-teal-600 hover:bg-teal-700 text-white shadow-lg"
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