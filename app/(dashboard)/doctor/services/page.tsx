// app/doctor/services/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus,
  Edit,
  Trash2,
  Clock,
  DollarSign,
  Activity,
  Calendar,
  Stethoscope
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { ServiceFormModal } from '@/components/services/service-form-modal';
import { useServices } from '@/hooks/useService';
import { Service } from '@/types/entities/service.types';

const DOCTOR_PROVIDER_ID = 101;

const categoryColors = {
  Consultation: "bg-blue-100 text-blue-700",
  Diagnostic: "bg-purple-100 text-purple-700",
  Vaccination: "bg-green-100 text-green-700",
  Procedure: "bg-orange-100 text-orange-700"
};

export default function DoctorServicesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const {
    services,
    stats,
    createService,
    updateService,
    deleteService,
    toggleServiceStatus
  } = useServices({ providerId: DOCTOR_PROVIDER_ID, autoFetch: true });

  const totalRevenue = stats?.totalRevenue || 0;
  const activeServices = services.filter(s => s.status === 'Active').length;

  const handleAddService = async (data: any) => {
    const result = await createService({
      ...data,
      providerId: DOCTOR_PROVIDER_ID,
      serviceType: 'Consultation'
    });
    if (result) {
      setIsAddDialogOpen(false);
    }
  };

  const handleEditService = async (data: any) => {
    if (editingService) {
      const result = await updateService(editingService.id, data);
      if (result) {
        setEditingService(null);
      }
    }
  };

  const handleDeleteService = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      await deleteService(id);
    }
  };

  const handleToggleStatus = async (id: number) => {
    await toggleServiceStatus(id);
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface">My Services</h1>
          <p className="text-on-surface-variant">Manage your consultation services and pricing</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Service
        </Button>
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
                <p className="text-2xl font-bold text-on-surface">0</p>
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
                  ETB {stats?.averageFee || 0}
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
                    <Badge className={categoryColors[service.serviceType as keyof typeof categoryColors] || "bg-gray-100"}>
                      {service.serviceType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{service.durationMinutes} min</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-primary">
                    ETB {service.standardFee.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={service.status === "Active" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-gray-100 text-gray-700"
                      }>
                        {service.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleToggleStatus(service.id)}
                      >
                        {service.status === "Active" ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-primary border-primary/30 hover:bg-primary/10"
                        onClick={() => setEditingService(service)}
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-red-600 border-red-600/30 hover:bg-red-50"
                        onClick={() => handleDeleteService(service.id, service.name)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Service Modal */}
      <ServiceFormModal
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddService}
        providerId={DOCTOR_PROVIDER_ID}
        title="Add New Service"
        description="Create a new consultation or medical service"
        showTypeField={true}
        typeOptions={[
          { value: 'Consultation', label: 'Consultation' },
          { value: 'Procedure', label: 'Procedure' }
        ]}
      />

      {/* Edit Service Modal */}
      {editingService && (
        <ServiceFormModal
          open={!!editingService}
          onOpenChange={() => setEditingService(null)}
          onSave={handleEditService}
          initialData={{
            providerId: editingService.providerId,
            name: editingService.name,
            description: editingService.description,
            durationMinutes: editingService.durationMinutes,
            standardFee: editingService.standardFee,
            serviceType: editingService.serviceType,
            status: editingService.status,
            preparationInstructions: editingService.preparationInstructions || ''
          }}
          title="Edit Service"
          description="Update your service details"
          showTypeField={true}
          typeOptions={[
            { value: 'Consultation', label: 'Consultation' },
            { value: 'Procedure', label: 'Procedure' }
          ]}
        />
      )}
    </div>
  );
}