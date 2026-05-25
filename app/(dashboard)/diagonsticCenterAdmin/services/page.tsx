// app/diagnostic-center/services/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import { ServiceSearchFilter } from '@/components/services/service-search-filter';
import { ServiceFormModal } from '@/components/services/service-form-modal';
import { useServices } from '@/hooks/useService';
import { Service } from '@/types/entities/service.types';

const DIAGNOSTIC_PROVIDER_ID = 104;

export default function DiagnosticCenterServicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const {
    services,
    stats,
    createService,
    updateService,
    deleteService,
  } = useServices({ providerId: DIAGNOSTIC_PROVIDER_ID, autoFetch: true });

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeServicesCount = services.filter(s => s.status === 'Active').length;

  const handleAddService = async (data: any) => {
    const result = await createService({
      ...data,
      providerId: DIAGNOSTIC_PROVIDER_ID,
      serviceType: 'Diagnostic'
    });
    if (result) {
      setIsAddModalOpen(false);
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
          <Plus className="h-5 w-5" />
          Add New Test
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <div className="h-5 w-5 text-primary">🔬</div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase">Active Tests</p>
              <p className="text-2xl font-bold text-on-surface">{activeServicesCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <div className="h-5 w-5 text-green-600">📋</div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase">Total Tests</p>
              <p className="text-2xl font-bold text-on-surface">{services.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <div className="h-5 w-5 text-blue-600">💰</div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase">Total Revenue (ETB)</p>
              <p className="text-2xl font-bold text-on-surface">{stats?.totalRevenue.toLocaleString() || '0'}</p>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <div className="h-5 w-5 text-purple-600">📊</div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase">Avg. Test Fee</p>
              <p className="text-2xl font-bold text-on-surface">ETB {stats?.averageFee || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-surface-container-lowest rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center border border-outline-variant/30 shadow-sm">
        <div className="relative flex-grow w-full">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-outline">🔍</div>
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
            <div className="h-5 w-5">🔽</div>
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
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
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
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-primary border-primary/30 hover:bg-primary/10 hover:text-primary"
                        onClick={() => setEditingService(service)}
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-red-600 border-red-600/30 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleDeleteService(service.id, service.name)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Delete
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
            <Button variant="outline" size="sm" disabled className="h-9 w-9 p-0">
              ←
            </Button>
            <Button className="h-9 w-9 p-0 bg-primary text-white">1</Button>
            <Button variant="outline" size="sm" className="h-9 w-9 p-0">
              →
            </Button>
          </div>
        </div>
      </div>

      {/* Add Service Modal */}
      <ServiceFormModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={handleAddService}
        providerId={DIAGNOSTIC_PROVIDER_ID}
        title="Add New Test Service"
        description="Add a medical test to your diagnostic center's catalog"
        showTypeField={false}
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
          title="Edit Test Service"
          description="Update test information"
          showTypeField={false}
        />
      )}
    </div>
  );
}