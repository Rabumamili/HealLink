// app/diagnosticCenter/services/page.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
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
import { cn } from "@/lib/utils"

interface TestService {
  id: number
  name: string
  description: string
  durationMinutes: number
  standardFee: number
  status: "Active" | "Inactive"
  category: string
  preparationInstructions?: string
}

const mockServices: TestService[] = [
  {
    id: 1,
    name: "Lipid Profile",
    description: "Complete cholesterol and triglyceride panel",
    durationMinutes: 15,
    standardFee: 1200,
    status: "Active",
    category: "Cardiology",
    preparationInstructions: "Fast for 10-12 hours before the test",
  },
  {
    id: 2,
    name: "Thyroid Panel",
    description: "TSH, T3, and T4 comprehensive testing",
    durationMinutes: 20,
    standardFee: 1800,
    status: "Active",
    category: "Endocrinology",
  },
  {
    id: 3,
    name: "Diabetes HbA1c",
    description: "3-month blood sugar average measurement",
    durationMinutes: 10,
    standardFee: 950,
    status: "Active",
    category: "Endocrinology",
  },
  {
    id: 4,
    name: "Complete Blood Count",
    description: "Full blood cell analysis",
    durationMinutes: 10,
    standardFee: 650,
    status: "Active",
    category: "Hematology",
  },
  {
    id: 5,
    name: "Vitamin D, 25-Hydroxy",
    description: "Vitamin D deficiency screening",
    durationMinutes: 15,
    standardFee: 1400,
    status: "Inactive",
    category: "Nutrition",
  },
]

export default function ServicesPage() {
  const [services, setServices] = useState<TestService[]>(mockServices)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<TestService | null>(null)
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    durationMinutes: 30,
    standardFee: 0,
    status: "Active" as "Active" | "Inactive",
    category: "Cardiology",
    preparationInstructions: "",
  })

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || service.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddService = () => {
    if (!newService.name || !newService.standardFee) return
    
    const newId = Math.max(...services.map(s => s.id), 0) + 1
    setServices([...services, { ...newService, id: newId }])
    setNewService({
      name: "",
      description: "",
      durationMinutes: 30,
      standardFee: 0,
      status: "Active",
      category: "Cardiology",
      preparationInstructions: "",
    })
    setIsAddModalOpen(false)
  }

  const handleEditService = () => {
    if (!selectedService) return
    setServices(services.map(s => s.id === selectedService.id ? selectedService : s))
    setIsEditModalOpen(false)
    setSelectedService(null)
  }

  const handleDeleteService = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      setServices(services.filter(s => s.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">Test Services Management</h1>
          <p className="text-body-md text-secondary mt-1">Configure your facility's medical services and pricing.</p>
        </div>
        <Button 
          className="flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-xl shadow-md transition-all duration-300"
          onClick={() => setIsAddModalOpen(true)}
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add New Test
        </Button>
      </div>

      {/* Filter & Search */}
      <div className="bg-surface-container-lowest rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center border border-outline-variant/30 shadow-sm">
        <div className="relative flex-grow w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-lg pl-12 py-3 text-body-md outline-none"
            placeholder="Search tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            className="w-full md:w-[160px] bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-lg py-3 px-4 outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <Button variant="outline" className="p-3 bg-surface-container-low rounded-lg">
            <span className="material-symbols-outlined">filter_list</span>
          </Button>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low/50">
              <tr>
                <th className="px-6 py-4 font-label-md text-label-md text-secondary">Test Name</th>
                <th className="px-6 py-4 font-label-md text-label-md text-secondary">Duration</th>
                <th className="px-6 py-4 font-label-md text-label-md text-secondary text-right">Fee (ETB)</th>
                <th className="px-6 py-4 font-label-md text-label-md text-secondary">Status</th>
                <th className="px-6 py-4 font-label-md text-label-md text-secondary text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="px-6 py-5">
                    <div>
                      <p className="text-body-md font-medium text-on-surface">{service.name}</p>
                      <p className="text-xs text-secondary mt-0.5 line-clamp-1">{service.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
                      <span className="text-sm">{service.durationMinutes} min</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right font-medium">{service.standardFee.toLocaleString()}</td>
                  <td className="px-6 py-5">
                    <Badge className={cn(
                      service.status === "Active" 
                        ? "bg-primary/10 text-primary" 
                        : "bg-outline-variant/30 text-secondary"
                    )}>
                      {service.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-secondary hover:text-primary"
                        onClick={() => {
                          setSelectedService(service)
                          setIsEditModalOpen(true)
                        }}
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-error hover:bg-error/10"
                        onClick={() => handleDeleteService(service.id, service.name)}
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-outline-variant/20 flex items-center justify-between">
          <span className="text-sm text-secondary">Showing {filteredServices.length} services</span>
          <div className="flex gap-2">
            <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-outline-variant text-secondary disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="h-9 w-9 flex items-center justify-center rounded-lg bg-primary text-white font-label-md">1</button>
            <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-outline-variant text-secondary">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Service Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Test Service</DialogTitle>
            <DialogDescription>Add a medical test to your diagnostic center's catalog</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div>
              <Label className="text-secondary mb-2 block">Test Name</Label>
              <Input
                placeholder="e.g., Comprehensive Metabolic Panel"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                className="bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-xl py-4"
              />
            </div>
            <div>
              <Label className="text-secondary mb-2 block">Description</Label>
              <Textarea
                placeholder="Describe the test..."
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                className="bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-xl"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-secondary mb-2 block">Duration (minutes)</Label>
                <Input
                  type="number"
                  placeholder="30"
                  value={newService.durationMinutes}
                  onChange={(e) => setNewService({ ...newService, durationMinutes: parseInt(e.target.value) })}
                  className="bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-xl py-4"
                />
              </div>
              <div>
                <Label className="text-secondary mb-2 block">Fee (ETB)</Label>
                <Input
                  type="number"
                  placeholder="500"
                  value={newService.standardFee}
                  onChange={(e) => setNewService({ ...newService, standardFee: parseInt(e.target.value) })}
                  className="bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-xl py-4"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-secondary mb-2 block">Category</Label>
                <Select value={newService.category} onValueChange={(value) => setNewService({ ...newService, category: value })}>
                  <SelectTrigger className="bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-xl py-4">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                    <SelectItem value="Hematology">Hematology</SelectItem>
                    <SelectItem value="Nutrition">Nutrition</SelectItem>
                    <SelectItem value="Infectious Diseases">Infectious Diseases</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-secondary mb-2 block">Status</Label>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm">Active</span>
                  <Switch 
                    checked={newService.status === "Active"}
                    onCheckedChange={(checked) => setNewService({ ...newService, status: checked ? "Active" : "Inactive" })}
                  />
                </div>
              </div>
            </div>
            <div>
              <Label className="text-secondary mb-2 block">Preparation Instructions (Optional)</Label>
              <Textarea
                placeholder="e.g., Fast for 8-12 hours before the test"
                value={newService.preparationInstructions}
                onChange={(e) => setNewService({ ...newService, preparationInstructions: e.target.value })}
                className="bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-xl"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-3">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4">
              Cancel
            </Button>
            <Button onClick={handleAddService} className="flex-1 py-4 bg-primary hover:bg-primary-container text-white shadow-lg">
              Create Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Service Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Test Service</DialogTitle>
            <DialogDescription>Update test information</DialogDescription>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-5 py-4">
              <div>
                <Label className="text-secondary mb-2 block">Test Name</Label>
                <Input
                  value={selectedService.name}
                  onChange={(e) => setSelectedService({ ...selectedService, name: e.target.value })}
                  className="bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-xl py-4"
                />
              </div>
              <div>
                <Label className="text-secondary mb-2 block">Description</Label>
                <Textarea
                  value={selectedService.description}
                  onChange={(e) => setSelectedService({ ...selectedService, description: e.target.value })}
                  className="bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-xl"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-secondary mb-2 block">Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={selectedService.durationMinutes}
                    onChange={(e) => setSelectedService({ ...selectedService, durationMinutes: parseInt(e.target.value) })}
                    className="bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-xl py-4"
                  />
                </div>
                <div>
                  <Label className="text-secondary mb-2 block">Fee (ETB)</Label>
                  <Input
                    type="number"
                    value={selectedService.standardFee}
                    onChange={(e) => setSelectedService({ ...selectedService, standardFee: parseInt(e.target.value) })}
                    className="bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-xl py-4"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-secondary mb-2 block">Category</Label>
                  <Select value={selectedService.category} onValueChange={(value) => setSelectedService({ ...selectedService, category: value })}>
                    <SelectTrigger className="bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-xl py-4">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                      <SelectItem value="Hematology">Hematology</SelectItem>
                      <SelectItem value="Nutrition">Nutrition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-secondary mb-2 block">Status</Label>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm">Active</span>
                    <Switch 
                      checked={selectedService.status === "Active"}
                      onCheckedChange={(checked) => setSelectedService({ ...selectedService, status: checked ? "Active" : "Inactive" })}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-secondary mb-2 block">Preparation Instructions (Optional)</Label>
                <Textarea
                  value={selectedService.preparationInstructions || ""}
                  onChange={(e) => setSelectedService({ ...selectedService, preparationInstructions: e.target.value })}
                  className="bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-xl"
                  rows={2}
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-3">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4">
              Cancel
            </Button>
            <Button onClick={handleEditService} className="flex-1 py-4 bg-primary hover:bg-primary-container text-white shadow-lg">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}