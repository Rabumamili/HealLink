"use client"

import { useState } from "react"
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
  DialogTrigger,
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
  XCircle,
  Users
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface StaffMember {
  id: string
  name: string
  email: string
  phone: string
  role: "receptionist" | "nurse" | "assistant"
  status: "active" | "inactive"
  permissions: string[]
  createdAt: string
  lastLogin?: string
}

const initialStaff: StaffMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@heallink.com",
    phone: "+251 911 234 567",
    role: "receptionist",
    status: "active",
    permissions: ["check-in", "view-schedule", "view-patients"],
    createdAt: "2024-01-15",
    lastLogin: "2024-01-27 09:30 AM"
  },
  {
    id: "2",
    name: "Michael Tekle",
    email: "michael@heallink.com",
    phone: "+251 922 345 678",
    role: "nurse",
    status: "active",
    permissions: ["check-in", "view-patients", "update-status", "record-vitals"],
    createdAt: "2024-02-10",
    lastLogin: "2024-01-27 08:45 AM"
  },
  {
    id: "3",
    name: "Helen Desta",
    email: "helen@heallink.com",
    phone: "+251 933 456 789",
    role: "assistant",
    status: "inactive",
    permissions: ["check-in"],
    createdAt: "2024-01-20",
    lastLogin: "2024-01-15 11:00 AM"
  },
]

const rolePermissions = {
  receptionist: ["check-in", "view-schedule", "view-patients"],
  nurse: ["check-in", "view-patients", "update-status", "record-vitals"],
  assistant: ["check-in"]
}

const roleColors = {
  receptionist: "bg-blue-100 text-blue-700",
  nurse: "bg-green-100 text-green-700",
  assistant: "bg-purple-100 text-purple-700"
}

export default function DoctorStaff() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phone: "",
    role: "receptionist",
    password: ""
  })

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.email || !newStaff.password) {
      toast.error("Please fill in all required fields")
      return
    }

    const staffMember: StaffMember = {
      id: Date.now().toString(),
      name: newStaff.name,
      email: newStaff.email,
      phone: newStaff.phone,
      role: newStaff.role as any,
      status: "active",
      permissions: rolePermissions[newStaff.role as keyof typeof rolePermissions],
      createdAt: new Date().toISOString().split('T')[0]
    }

    setStaff([...staff, staffMember])
    setIsAddDialogOpen(false)
    setNewStaff({
      name: "",
      email: "",
      phone: "",
      role: "receptionist",
      password: ""
    })
    toast.success(`Staff member ${staffMember.name} added successfully`)
  }

  const handleEditStaff = () => {
    if (!editingStaff) return
    
    setStaff(staff.map(s => s.id === editingStaff.id ? editingStaff : s))
    setEditingStaff(null)
    toast.success("Staff member updated successfully")
  }

  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter(s => s.id !== id))
    toast.success("Staff member removed successfully")
  }

  const toggleStaffStatus = (id: string) => {
    setStaff(staff.map(s => 
      s.id === id ? { ...s, status: s.status === "active" ? "inactive" : "active" } : s
    ))
    toast.success(`Staff status updated`)
  }

  const handleResendInvite = (email: string) => {
    toast.success(`Invitation resent to ${email}`)
  }

  const activeStaff = staff.filter(s => s.status === "active").length

  return (
    <>
      
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-on-surface-variant">Manage your clinic staff and their permissions</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Invite Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Invite Staff Member</DialogTitle>
                <DialogDescription>
                  Add a new staff member to help manage patient check-ins and appointments
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Sarah Johnson"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="staff@heallink.com"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+251 911 234 567"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select 
                    value={newStaff.role} 
                    onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receptionist">Receptionist</SelectItem>
                      <SelectItem value="nurse">Nurse</SelectItem>
                      <SelectItem value="assistant">Medical Assistant</SelectItem>
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
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddStaff} className="bg-primary hover:bg-primary/90">
                  Send Invitation
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
                  <p className="text-2xl font-bold text-on-surface">3</p>
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
                  <p className="text-sm font-medium text-muted-foreground uppercase">Permissions</p>
                  <p className="text-2xl font-bold text-on-surface">4</p>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-on-surface">{member.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{member.email}</span>
                          <Phone className="h-3 w-3 ml-2" />
                          <span>{member.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={roleColors[member.role]}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {member.permissions.map((perm, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {perm.replace("-", " ")}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={member.status === "active" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-gray-100 text-gray-700"
                      }>
                        {member.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {member.lastLogin || "Never"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingStaff(member)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResendInvite(member.email)}>
                            <Key className="mr-2 h-4 w-4" />
                            Resend Invite
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleStaffStatus(member.id)}>
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
                            onClick={() => handleDeleteStaff(member.id)}
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
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={editingStaff.name}
                    onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingStaff.email}
                    onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={editingStaff.phone}
                    onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select 
                    value={editingStaff.role} 
                    onValueChange={(value) => setEditingStaff({ 
                      ...editingStaff, 
                      role: value as any,
                      permissions: rolePermissions[value as keyof typeof rolePermissions]
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receptionist">Receptionist</SelectItem>
                      <SelectItem value="nurse">Nurse</SelectItem>
                      <SelectItem value="assistant">Medical Assistant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="space-y-1">
                    {editingStaff.permissions.map((perm, i) => (
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
              <Button variant="outline" onClick={() => setEditingStaff(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditStaff} className="bg-primary hover:bg-primary/90">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}