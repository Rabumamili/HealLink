// app/diagnosticCenter/staff/page.tsx
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
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StaffMember {
  id: number
  fullName: string
  email: string
  phoneNumber: string
  role: "Lab Technician" | "Phlebotomist" | "Pathologist" | "Admin"
  status: "Active" | "Invited" | "Inactive"
  addedDate: string
}

const mockStaff: StaffMember[] = [
  {
    id: 1,
    fullName: "Sarah Chen",
    email: "sarah.chen@healink.com",
    phoneNumber: "+251 911 223 344",
    role: "Lab Technician",
    status: "Active",
    addedDate: "Oct 12, 2023",
  },
  {
    id: 2,
    fullName: "Michael Rodriguez",
    email: "michael.r@healink.com",
    phoneNumber: "+251 922 556 677",
    role: "Phlebotomist",
    status: "Active",
    addedDate: "Mar 05, 2024",
  },
  {
    id: 3,
    fullName: "Dr. Emily Watson",
    email: "emily.w@healink.com",
    phoneNumber: "+251 933 889 900",
    role: "Pathologist",
    status: "Active",
    addedDate: "Jan 20, 2024",
  },
  {
    id: 4,
    fullName: "David Kim",
    email: "david.kim@healink.com",
    phoneNumber: "+251 944 112 233",
    role: "Lab Technician",
    status: "Invited",
    addedDate: "Feb 15, 2024",
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
    role: "Lab Technician" as StaffMember["role"],
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
    }
    setStaff([...staff, newMember])
    setNewStaff({ fullName: "", email: "", phoneNumber: "", role: "Lab Technician" })
    setIsAddModalOpen(false)
  }

  const handleRemoveStaff = (id: number, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the staff list? This action cannot be undone.`)) {
      setStaff(staff.filter(m => m.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">Staff Management</h1>
          <p className="text-body-md text-secondary mt-1">Manage and monitor laboratory staff for your facility.</p>
        </div>
        <Button 
          className="flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-xl shadow-md transition-all duration-300"
          onClick={() => setIsAddModalOpen(true)}
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Add Staff Member
        </Button>
      </div>

      {/* Filter & Search */}
      <div className="bg-surface-container-lowest rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center border border-outline-variant/30 shadow-sm">
        <div className="relative flex-grow w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
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
            <option value="Phlebotomist">Phlebotomist</option>
            <option value="Pathologist">Pathologist</option>
            <option value="Admin">Admin</option>
          </select>
          <Button variant="outline" className="p-3 bg-surface-container-low rounded-lg">
            <span className="material-symbols-outlined">filter_list</span>
          </Button>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStaff.map((member) => (
          <div 
            key={member.id} 
            className="bg-surface-container-lowest rounded-xl p-6 flex flex-col relative group overflow-hidden border border-outline-variant/30 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-[18px] text-on-surface font-semibold">{member.fullName}</h3>
                  <p className="text-label-md text-primary">{member.role}</p>
                </div>
              </div>
              <Badge className={cn(
                "px-3 py-1 rounded-full text-[12px] uppercase tracking-wider",
                member.status === "Active" ? "bg-primary/10 text-primary" : "bg-surface-variant text-on-surface-variant"
              )}>
                {member.status}
              </Badge>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">mail</span>
                <span className="text-body-md">{member.email}</span>
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">call</span>
                <span className="text-body-md">{member.phoneNumber}</span>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-outline-variant/30 flex justify-between items-center">
              <p className="text-xs text-secondary">Added: {member.addedDate}</p>
              <div className="flex gap-2">
                {member.status === "Invited" && (
                  <button className="p-2 text-secondary hover:text-primary rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[20px]">forward_to_inbox</span>
                  </button>
                )}
                <button 
                  className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                  onClick={() => handleRemoveStaff(member.id, member.fullName)}
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
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
            <span className="material-symbols-outlined text-[32px]">add</span>
          </div>
          <div className="text-center">
            <p className="font-headline-md text-[18px] text-secondary font-semibold group-hover:text-primary transition-colors">Add New Member</p>
            <p className="text-body-md text-secondary">Register a new staff member</p>
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Add Staff Member</DialogTitle>
            <DialogDescription>Add a new staff member to your diagnostic center</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div>
              <Label className="text-secondary mb-2 block">Full Name</Label>
              <Input
                placeholder="e.g., John Doe"
                value={newStaff.fullName}
                onChange={(e) => setNewStaff({ ...newStaff, fullName: e.target.value })}
                className="bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-xl py-4"
              />
            </div>
            <div>
              <Label className="text-secondary mb-2 block">Email Address</Label>
              <Input
                type="email"
                placeholder="john@example.com"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                className="bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-xl py-4"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-secondary mb-2 block">Phone Number</Label>
                <Input
                  placeholder="+251 ..."
                  value={newStaff.phoneNumber}
                  onChange={(e) => setNewStaff({ ...newStaff, phoneNumber: e.target.value })}
                  className="bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-xl py-4"
                />
              </div>
              <div>
                <Label className="text-secondary mb-2 block">Role</Label>
                <select 
                  className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-xl py-4 px-4 outline-none"
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as StaffMember["role"] })}
                >
                  <option value="Lab Technician">Lab Technician</option>
                  <option value="Phlebotomist">Phlebotomist</option>
                  <option value="Pathologist">Pathologist</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter className="flex gap-3">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4">
              Cancel
            </Button>
            <Button onClick={handleAddStaff} className="flex-1 py-4 bg-primary hover:bg-primary-container text-white shadow-lg">
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}