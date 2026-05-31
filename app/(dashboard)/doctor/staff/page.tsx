"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Mail,
  Phone,
  Shield,
  UserCheck,
  UserX,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  Users,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
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
  status: 'active' | 'inactive'
  addedDate: string
}

// Permission mapping based on staff role
const getPermissionsForRole = (role: StaffSubRole): string[] => {
  switch (role) {
    case 'lab assistant':
      return ["check-in", "view-patients", "update-status", "record-results"]
    case 'card_checker':
      return ["check-in", "view-patients", "verify-cards"]
    default:
      return ["check-in"]
  }
}

const roleColors = {
  'lab assistant': "bg-blue-100 text-blue-700",
  'card_checker': "bg-purple-100 text-purple-700"
}

export default function DoctorStaffManagementPage() {
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
    allowedRoles: ['doctor'] // Only doctors can access this page
  })

  const [staff, setStaff] = useState<StaffMemberWithStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMemberWithStatus | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [newStaff, setNewStaff] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "Lab Assistant" as string,
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
        status: member.is_active ? 'active' : 'inactive',
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

  const handleAddStaff = async () => {
    if (!newStaff.firstName || !newStaff.lastName || !newStaff.email || !newStaff.password) {
      toast.error("Please fill in all required fields")
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
        phone_number: newStaff.phone,
        role: displayToStaffRole[newStaff.role],
        send_invitation: true
      })

      if (result.success && result.data) {
        toast.success(result.data.message || `Invitation sent to ${newStaff.firstName} ${newStaff.lastName}`)
        setNewStaff({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          role: "Lab Assistant",
          password: ""
        })
        setIsAddDialogOpen(false)
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

  const handleEditStaff = async () => {
    if (!editingStaff) return
    
    setIsProcessing(true)
    try {
      // Update staff role if changed
      if (editingStaff.staff_sub_role) {
        // You might need an API call to update staff role
        // await updateStaffRole(editingStaff.id, editingStaff.staff_sub_role)
      }
      
      toast.success("Staff member updated successfully")
      setEditingStaff(null)
      await loadStaffMembers()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update staff member')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteStaff = async (id: number, name: string) => {
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

  const toggleStaffStatus = async (id: number, name: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const action = newStatus === 'active' ? 'activate' : 'deactivate'
    
    if (confirm(`Are you sure you want to ${action} ${name}?`)) {
      setIsProcessing(true)
      try {
        let response
        if (newStatus === 'active') {
          response = await activateStaff(id)
        } else {
          response = await deactivateStaff(id)
        }
        toast.success(response.message || `${name} has been ${action}d`)
        await loadStaffMembers()
      } catch (error: any) {
        toast.error(error.message || `Failed to ${action} staff member`)
      } finally {
        setIsProcessing(false)
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

  const activeStaff = staff.filter(s => s.status === "active").length

  if (authLoading || (isLoading && staff.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Staff Management</h1>
          <p className="text-on-surface-variant mt-1">Manage your clinic staff and their permissions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Invite Staff
          </Button>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Invite Staff Member</DialogTitle>
              <DialogDescription>
                Add a new staff member to help manage patient check-ins and appointments
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="e.g., Sarah"
                    value={newStaff.firstName}
                    onChange={(e) => setNewStaff({ ...newStaff, firstName: e.target.value })}
                    disabled={isProcessing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    placeholder="e.g., Johnson"
                    value={newStaff.lastName}
                    onChange={(e) => setNewStaff({ ...newStaff, lastName: e.target.value })}
                    disabled={isProcessing}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="staff@heallink.com"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  disabled={isProcessing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+251 911 234 567"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  disabled={isProcessing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select 
                  value={newStaff.role} 
                  onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}
                  disabled={isProcessing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lab Assistant">Lab Assistant</SelectItem>
                    <SelectItem value="Card Checker">Card Checker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter temporary password"
                    value={newStaff.password}
                    onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                    className="pr-10"
                    disabled={isProcessing}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Staff member will need to change this password on first login
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isProcessing}>
                Cancel
              </Button>
              <Button onClick={handleAddStaff} className="bg-primary hover:bg-primary/90" disabled={isProcessing}>
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
                <p className="text-sm font-medium text-muted-foreground uppercase">Invited</p>
                <p className="text-2xl font-bold text-on-surface">
                  {staff.filter(s => !s.is_verified).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Table */}
      <Card className="border border-outline-variant shadow-sm">
        <CardHeader>
          <CardTitle className="text-on-surface">Staff Members</CardTitle>
          <CardDescription>Manage staff access and permissions</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : staff.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No staff members found</p>
              <p className="text-sm text-muted-foreground mt-1">Click "Invite Staff" to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-on-surface">
                          {member.first_name} {member.last_name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{member.email}</span>
                          <Phone className="h-3 w-3 ml-2" />
                          <span>{member.phone_number}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={roleColors[member.staff_sub_role!]}>
                        {staffRoleDisplay[member.staff_sub_role!]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={member.status === "active" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-gray-100 text-gray-700"
                      }>
                        {member.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                      {!member.is_verified && member.status === "active" && (
                        <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(member.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={isProcessing}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingStaff(member)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {!member.is_verified && (
                            <DropdownMenuItem onClick={() => handleResendInvite(member.email, `${member.first_name} ${member.last_name}`)}>
                              <Key className="mr-2 h-4 w-4" />
                              Resend Invite
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => toggleStaffStatus(member.id, `${member.first_name} ${member.last_name}`, member.status)}>
                            {member.status === "active" ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteStaff(member.id, `${member.first_name} ${member.last_name}`)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Staff Dialog */}
      <Dialog open={!!editingStaff} onOpenChange={() => setEditingStaff(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>
              Update staff information and permissions
            </DialogDescription>
          </DialogHeader>
          {editingStaff && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-firstName">First Name</Label>
                  <Input
                    id="edit-firstName"
                    value={editingStaff.first_name || ""}
                    onChange={(e) => setEditingStaff({ ...editingStaff, first_name: e.target.value })}
                    disabled={isProcessing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lastName">Last Name</Label>
                  <Input
                    id="edit-lastName"
                    value={editingStaff.last_name || ""}
                    onChange={(e) => setEditingStaff({ ...editingStaff, last_name: e.target.value })}
                    disabled={isProcessing}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingStaff.email}
                  onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                  disabled={isProcessing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editingStaff.phone_number}
                  onChange={(e) => setEditingStaff({ ...editingStaff, phone_number: e.target.value })}
                  disabled={isProcessing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select 
                  value={staffRoleDisplay[editingStaff.staff_sub_role!]} 
                  onValueChange={(value) => setEditingStaff({ 
                    ...editingStaff, 
                    staff_sub_role: displayToStaffRole[value]
                  })}
                  disabled={isProcessing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lab Assistant">Lab Assistant</SelectItem>
                    <SelectItem value="Card Checker">Card Checker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="space-y-1">
                  {getPermissionsForRole(editingStaff.staff_sub_role!).map((perm, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      {perm.replace("-", " ").toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingStaff(null)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleEditStaff} className="bg-primary hover:bg-primary/90" disabled={isProcessing}>
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}