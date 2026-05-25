"use client"

import { useState } from "react"
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
import { Search, Filter, Mail, Phone, Trash2, UserPlus, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface StaffMember {
  id: number
  fullName: string
  email: string
  phoneNumber: string
  role: "Check-in Officer" | "Lead Admin" | "Nurse" | "Receptionist"
  status: "Active" | "Invited" | "Inactive"
  addedDate: string
  initials: string
}

const mockStaff: StaffMember[] = [
  {
    id: 1,
    fullName: "Abebe Kebede",
    email: "abebe.k@heallink.et",
    phoneNumber: "+251 911 223 344",
    role: "Check-in Officer",
    status: "Active",
    addedDate: "Oct 12, 2023",
    initials: "AK",
  },
  {
    id: 2,
    fullName: "Sara Tadesse",
    email: "sara.t@heallink.et",
    phoneNumber: "+251 922 556 677",
    role: "Check-in Officer",
    status: "Invited",
    addedDate: "Mar 05, 2024",
    initials: "ST",
  },
  {
    id: 3,
    fullName: "Samuel Bekele",
    email: "samuel.b@heallink.et",
    phoneNumber: "+251 933 889 900",
    role: "Check-in Officer",
    status: "Active",
    addedDate: "Jan 20, 2024",
    initials: "SB",
  },
]

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newStaff, setNewStaff] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "Check-in Officer" as const,
  })

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || member.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleAddStaff = () => {
    if (!newStaff.fullName || !newStaff.email || !newStaff.phoneNumber) return
    
    const newMember: StaffMember = {
      id: staff.length + 1,
      fullName: newStaff.fullName,
      email: newStaff.email,
      phoneNumber: newStaff.phoneNumber,
      role: newStaff.role,
      status: "Invited",
      addedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      initials: newStaff.fullName.split(" ").map(n => n[0]).join(""),
    }
    setStaff([...staff, newMember])
    setNewStaff({ fullName: "", email: "", phoneNumber: "", role: "Check-in Officer" })
    setIsAddModalOpen(false)
  }

  const handleRemoveStaff = (id: number, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the staff list? This action cannot be undone.`)) {
      setStaff(staff.filter(m => m.id !== id))
    }
  }

  const handleResendInvite = (email: string) => {
    alert(`Invitation resent to ${email}`)
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Staff Management</h1>
          <p className="text-gray-500 mt-1">Manage and monitor Check-in Officers for your facility.</p>
        </div>
        <Button 
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-300 hover:-translate-y-0.5"
          onClick={() => setIsAddModalOpen(true)}
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
            <option value="Check-in Officer">Check-in Officer</option>
            <option value="Lead Admin">Lead Admin</option>
            <option value="Nurse">Nurse</option>
            <option value="Receptionist">Receptionist</option>
          </select>
          <Button variant="outline" className="p-3 bg-white rounded-lg border border-gray-200">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Staff List */}
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
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{member.fullName}</h3>
                  <p className="text-sm text-teal-600 font-medium">{member.role}</p>
                </div>
              </div>
              <Badge className={cn(
                "px-3 py-1 rounded-full text-xs uppercase tracking-wider",
                member.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
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
                <span className="text-sm">{member.phoneNumber}</span>
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
                    onClick={() => handleResendInvite(member.email)}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                  onClick={() => handleRemoveStaff(member.id, member.fullName)}
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
            <p className="text-sm text-gray-400">Register a new officer</p>
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Add Staff Member</DialogTitle>
            <DialogDescription>Add a new staff member to your clinic</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div>
              <Label className="text-gray-600 mb-2 block">Full Name</Label>
              <Input
                placeholder="e.g. Dawit Yohannes"
                value={newStaff.fullName}
                onChange={(e) => setNewStaff({ ...newStaff, fullName: e.target.value })}
                className="bg-gray-50 border-gray-200 focus:ring-1 focus:ring-teal-500 rounded-xl py-4"
              />
            </div>
            <div>
              <Label className="text-gray-600 mb-2 block">Email Address</Label>
              <Input
                type="email"
                placeholder="dawit@example.com"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                className="bg-gray-50 border-gray-200 focus:ring-1 focus:ring-teal-500 rounded-xl py-4"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-600 mb-2 block">Phone Number</Label>
                <Input
                  placeholder="+251 ..."
                  value={newStaff.phoneNumber}
                  onChange={(e) => setNewStaff({ ...newStaff, phoneNumber: e.target.value })}
                  className="bg-gray-50 border-gray-200 focus:ring-1 focus:ring-teal-500 rounded-xl py-4"
                />
              </div>
              <div>
                <Label className="text-gray-600 mb-2 block">Role</Label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 focus:ring-1 focus:ring-teal-500 rounded-xl py-4 px-4 outline-none"
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as any })}
                >
                  <option value="Check-in Officer">Check-in Officer</option>
                  <option value="Lead Admin">Lead Admin</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Receptionist">Receptionist</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter className="flex gap-3">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4">
              Cancel
            </Button>
            <Button onClick={handleAddStaff} className="flex-1 py-4 bg-teal-600 hover:bg-teal-700 text-white shadow-lg">
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}