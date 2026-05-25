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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Plus, Edit, Trash2, Clock, DollarSign, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

interface Service {
  id: number
  name: string
  description: string
  durationMinutes: number
  standardFee: number
  status: "Active" | "Inactive"
  serviceType: string
  preparationInstructions?: string
}

const mockServices: Service[] = [
  {
    id: 1,
    name: "General Consultation",
    description: "Standard medical consultation with a general practitioner",
    durationMinutes: 30,
    standardFee: 850,
    status: "Active",
    serviceType: "Consultation",
  },
  {
    id: 2,
    name: "Pediatric Checkup",
    description: "Comprehensive health checkup for children",
    durationMinutes: 45,
    standardFee: 650,
    status: "Active",
    serviceType: "Consultation",
  },
  {
    id: 3,
    name: "Full Lab Panel",
    description: "Complete blood count and comprehensive metabolic panel",
    durationMinutes: 15,
    standardFee: 2400,
    status: "Active",
    serviceType: "Diagnostic",
    preparationInstructions: "Fast for 8-12 hours before the test",
  },
  {
    id: 4,
    name: "Influenza Vaccination",
    description: "Annual flu vaccination",
    durationMinutes: 20,
    standardFee: 600,
    status: "Inactive",
    serviceType: "Vaccination",
  },
]

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(mockServices)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    durationMinutes: 30,
    standardFee: 0,
    status: "Active" as "Active" | "Inactive",
    serviceType: "Consultation",
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
      serviceType: "Consultation",
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

  const openEditModal = (service: Service) => {
    setSelectedService(service)
    setIsEditModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Services Management</h1>
          <p className="text-body-md text-secondary mt-1">Configure your facility's medical services and pricing.</p>
        </div>
        <Button 
          className="flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-xl shadow-md transition-all duration-300 hover:-translate-y-0.5"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-5 w-5" />
          Add New Service
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center bg-white/80 backdrop-blur-xl border border-outline-variant/30 shadow-sm">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-outline" />
          <input
            className="w-full bg-surface-container-lowest border-none focus:ring-1 focus:ring-primary rounded-lg pl-12 py-3 font-body-md placeholder:text-outline/60 outline-none"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[160px] bg-surface-container-lowest border-none focus:ring-1 focus:ring-primary rounded-lg py-3">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="p-3 bg-surface-container-lowest rounded-lg">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-surface-container-low/50">
              <TableRow>
                <TableHead className="px-6 py-4 font-label-md text-secondary">Service Name</TableHead>
                <TableHead className="px-6 py-4 font-label-md text-secondary">Duration</TableHead>
                <TableHead className="px-6 py-4 font-label-md text-secondary text-right">Fee (ETB)</TableHead>
                <TableHead className="px-6 py-4 font-label-md text-secondary">Status</TableHead>
                <TableHead className="px-6 py-4 font-label-md text-secondary text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-outline-variant/10">
              {filteredServices.map((service) => (
                <TableRow key={service.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <TableCell className="px-6 py-5">
                    <div>
                      <p className="font-body-md font-medium text-on-surface">{service.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{service.description}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">{service.durationMinutes} min</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-right font-medium">
                    {service.standardFee.toFixed(2)}
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <Badge className={cn(
                      service.status === "Active" 
                        ? "bg-primary/10 text-primary" 
                        : "bg-outline-variant/30 text-secondary"
                    )}>
                      {service.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-secondary hover:text-primary"
                        onClick={() => openEditModal(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-error hover:bg-error/10"
                        onClick={() => handleDeleteService(service.id, service.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-outline-variant/20 flex items-center justify-between">
          <span className="text-sm text-secondary">Showing {filteredServices.length} services</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="h-9 w-9 p-0">
              ←
            </Button>
            <Button className="h-9 w-9 p-0 bg-primary text-white">1</Button>
            <Button variant="outline" size="sm" disabled className="h-9 w-9 p-0">
              →
            </Button>
          </div>
        </div>
      </div>

      {/* Add Service Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Service</DialogTitle>
            <DialogDescription>Add a medical service to your clinic's catalog</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div>
              <Label className="text-secondary mb-2 block">Service Name</Label>
              <Input
                placeholder="e.g., Specialized Consultation"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                className="bg-[#F1F5F9] border-none focus:ring-1 focus:ring-primary rounded-xl py-4"
              />
            </div>
            <div>
              <Label className="text-secondary mb-2 block">Description</Label>
              <Textarea
                placeholder="Describe the service..."
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                className="bg-[#F1F5F9] border-none focus:ring-1 focus:ring-primary rounded-xl"
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
                  className="bg-[#F1F5F9] border-none focus:ring-1 focus:ring-primary rounded-xl py-4"
                />
              </div>
              <div>
                <Label className="text-secondary mb-2 block">Fee (ETB)</Label>
                <Input
                  type="number"
                  placeholder="500"
                  value={newService.standardFee}
                  onChange={(e) => setNewService({ ...newService, standardFee: parseInt(e.target.value) })}
                  className="bg-[#F1F5F9] border-none focus:ring-1 focus:ring-primary rounded-xl py-4"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-secondary mb-2 block">Service Type</Label>
                <Select value={newService.serviceType} onValueChange={(value) => setNewService({ ...newService, serviceType: value })}>
                  <SelectTrigger className="bg-[#F1F5F9] border-none focus:ring-1 focus:ring-primary rounded-xl py-4">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consultation">Consultation</SelectItem>
                    <SelectItem value="Diagnostic">Diagnostic</SelectItem>
                    <SelectItem value="Vaccination">Vaccination</SelectItem>
                    <SelectItem value="Procedure">Procedure</SelectItem>
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
                placeholder="e.g., Fast for 8 hours before the test"
                value={newService.preparationInstructions}
                onChange={(e) => setNewService({ ...newService, preparationInstructions: e.target.value })}
                className="bg-[#F1F5F9] border-none focus:ring-1 focus:ring-primary rounded-xl"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-3">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4">
              Cancel
            </Button>
            <Button onClick={handleAddService} className="flex-1 py-4 bg-primary hover:bg-primary-container text-white shadow-lg">
              Create Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Service Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Service</DialogTitle>
            <DialogDescription>Update service information</DialogDescription>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-5 py-4">
              <div>
                <Label className="text-secondary mb-2 block">Service Name</Label>
                <Input
                  value={selectedService.name}
                  onChange={(e) => setSelectedService({ ...selectedService, name: e.target.value })}
                  className="bg-[#F1F5F9] border-none focus:ring-1 focus:ring-primary rounded-xl py-4"
                />
              </div>
              <div>
                <Label className="text-secondary mb-2 block">Description</Label>
                <Textarea
                  value={selectedService.description}
                  onChange={(e) => setSelectedService({ ...selectedService, description: e.target.value })}
                  className="bg-[#F1F5F9] border-none focus:ring-1 focus:ring-primary rounded-xl"
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
                    className="bg-[#F1F5F9] border-none focus:ring-1 focus:ring-primary rounded-xl py-4"
                  />
                </div>
                <div>
                  <Label className="text-secondary mb-2 block">Fee (ETB)</Label>
                  <Input
                    type="number"
                    value={selectedService.standardFee}
                    onChange={(e) => setSelectedService({ ...selectedService, standardFee: parseInt(e.target.value) })}
                    className="bg-[#F1F5F9] border-none focus:ring-1 focus:ring-primary rounded-xl py-4"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-secondary mb-2 block">Service Type</Label>
                  <Select value={selectedService.serviceType} onValueChange={(value) => setSelectedService({ ...selectedService, serviceType: value })}>
                    <SelectTrigger className="bg-[#F1F5F9] border-none focus:ring-1 focus:ring-primary rounded-xl py-4">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consultation">Consultation</SelectItem>
                      <SelectItem value="Diagnostic">Diagnostic</SelectItem>
                      <SelectItem value="Vaccination">Vaccination</SelectItem>
                      <SelectItem value="Procedure">Procedure</SelectItem>
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
                  className="bg-[#F1F5F9] border-none focus:ring-1 focus:ring-primary rounded-xl"
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