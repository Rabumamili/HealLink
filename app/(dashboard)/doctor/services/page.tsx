"use client"

import { useState } from "react"
import { TopHeader } from "@/components/doctor/top-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Clock,
  DollarSign,
  Activity,
  Calendar,
  CheckCircle,
  XCircle,
  Stethoscope
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Service {
  id: string
  name: string
  description: string
  duration: number
  fee: number
  category: "consultation" | "followup" | "procedure" | "review"
  status: "active" | "inactive"
  appointmentsCount: number
  revenue: number
}

const initialServices: Service[] = [
  {
    id: "1",
    name: "General Consultation",
    description: "Initial consultation for new patients including full medical history review",
    duration: 30,
    fee: 500,
    category: "consultation",
    status: "active",
    appointmentsCount: 144,
    revenue: 72000
  },
  {
    id: "2",
    name: "Cardiology Review",
    description: "Specialized cardiology consultation for heart-related concerns",
    duration: 45,
    fee: 750,
    category: "consultation",
    status: "active",
    appointmentsCount: 86,
    revenue: 64500
  },
  {
    id: "3",
    name: "Follow-up Visit",
    description: "Follow-up consultation for existing patients",
    duration: 20,
    fee: 300,
    category: "followup",
    status: "active",
    appointmentsCount: 62,
    revenue: 18600
  },
  {
    id: "4",
    name: "Emergency Consult",
    description: "Urgent consultation for emergency cases",
    duration: 60,
    fee: 1000,
    category: "procedure",
    status: "active",
    appointmentsCount: 34,
    revenue: 34000
  }
]

const categoryColors = {
  consultation: "bg-blue-100 text-blue-700",
  followup: "bg-green-100 text-green-700",
  procedure: "bg-purple-100 text-purple-700",
  review: "bg-orange-100 text-orange-700"
}

export default function DoctorServices() {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    duration: 30,
    fee: 0,
    category: "consultation" as const
  })

  const handleAddService = () => {
    if (!newService.name || !newService.fee) {
      toast.error("Please fill in all required fields")
      return
    }

    // Fixed: Create service object with all required properties
    const service: Service = {
      id: Date.now().toString(),
      name: newService.name,
      description: newService.description,
      duration: newService.duration,
      fee: newService.fee,
      category: newService.category,
      status: "active",
      appointmentsCount: 0,
      revenue: 0
    }

    setServices([...services, service])
    setIsAddDialogOpen(false)
    setNewService({
      name: "",
      description: "",
      duration: 30,
      fee: 0,
      category: "consultation"
    })
    toast.success("Service added successfully")
  }

  const handleEditService = () => {
    if (!editingService) return
    
    setServices(services.map(s => s.id === editingService.id ? editingService : s))
    setEditingService(null)
    toast.success("Service updated successfully")
  }

  const handleDeleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id))
    toast.success("Service deleted successfully")
  }

  const toggleServiceStatus = (id: string) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, status: s.status === "active" ? "inactive" : "active" } : s
    ))
    toast.success("Service status updated")
  }

  const totalRevenue = services.reduce((sum, s) => sum + s.revenue, 0)
  const totalAppointments = services.reduce((sum, s) => sum + s.appointmentsCount, 0)
  const activeServices = services.filter(s => s.status === "active").length

  return (
    <>
      
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-on-surface-variant">Manage your consultation services and pricing</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Add New Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
                <DialogDescription>
                  Create a new consultation or medical service
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., General Consultation"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the service..."
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="30"
                      value={newService.duration}
                      onChange={(e) => setNewService({ ...newService, duration: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fee">Fee (ETB) *</Label>
                    <Input
                      id="fee"
                      type="number"
                      placeholder="500"
                      value={newService.fee}
                      onChange={(e) => setNewService({ ...newService, fee: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newService.category} 
                    onValueChange={(value) => setNewService({ ...newService, category: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="followup">Follow-up</SelectItem>
                      <SelectItem value="procedure">Procedure</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddService} className="bg-primary hover:bg-primary/90">
                  Add Service
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
                  <Stethoscope className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase">Active Services</p>
                  <p className="text-2xl font-bold text-on-surface">{activeServices}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-outline-variant shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase">Total Appointments</p>
                  <p className="text-2xl font-bold text-on-surface">{totalAppointments.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-outline-variant shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase">Total Revenue (ETB)</p>
                  <p className="text-2xl font-bold text-on-surface">{totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-outline-variant shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Activity className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase">Avg. Consultation Fee</p>
                  <p className="text-2xl font-bold text-on-surface">
                    ETB {Math.round(services.reduce((sum, s) => sum + s.fee, 0) / services.length)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Table */}
        <Card className="border border-outline-variant shadow-sm">
          <CardHeader>
            <CardTitle className="text-on-surface">All Services</CardTitle>
            <CardDescription>Manage your consultation services</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Fee (ETB)</TableHead>
                  <TableHead>Appointments</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">
                      {service.name}
                      <p className="text-xs text-muted-foreground line-clamp-1">{service.description}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={categoryColors[service.category]}>
                        {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{service.duration} min</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      ETB {service.fee.toLocaleString()}
                    </TableCell>
                    <TableCell>{service.appointmentsCount}</TableCell>
                    <TableCell>ETB {service.revenue.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={service.status === "active" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-gray-100 text-gray-700"
                      }>
                        {service.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingService(service)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleServiceStatus(service.id)}>
                            {service.status === "active" ? (
                              <>
                                <XCircle className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteService(service.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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

        {/* Edit Service Dialog */}
        <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
              <DialogDescription>
                Update your service details
              </DialogDescription>
            </DialogHeader>
            {editingService && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Service Name</Label>
                  <Input
                    id="edit-name"
                    value={editingService.name}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingService.description}
                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-duration">Duration (minutes)</Label>
                    <Input
                      id="edit-duration"
                      type="number"
                      value={editingService.duration}
                      onChange={(e) => setEditingService({ ...editingService, duration: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-fee">Fee (ETB)</Label>
                    <Input
                      id="edit-fee"
                      type="number"
                      value={editingService.fee}
                      onChange={(e) => setEditingService({ ...editingService, fee: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select 
                    value={editingService.category} 
                    onValueChange={(value) => setEditingService({ ...editingService, category: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="followup">Follow-up</SelectItem>
                      <SelectItem value="procedure">Procedure</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingService(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditService} className="bg-primary hover:bg-primary/90">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}