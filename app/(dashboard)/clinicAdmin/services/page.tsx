// app/clinic-admin/services/page.tsx (updated version)
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ServiceTable } from '@/components/services/service-table';
import { ServiceSearchFilter } from '@/components/services/service-search-filter';
import { ServiceFormModal } from '@/components/services/service-form-modal';
import { useServices } from '@/hooks/useService';
import { Service } from '@/types/entities/service.types';

const CLINIC_PROVIDER_ID = 103;

export default function ClinicAdminServicesPage() {
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
    toggleServiceStatus
  } = useServices({ providerId: CLINIC_PROVIDER_ID, autoFetch: true });

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeServicesCount = services.filter(s => s.status === 'Active').length;

  const handleAddService = async (data: any) => {
    const result = await createService({
      ...data,
      providerId: CLINIC_PROVIDER_ID
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
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-teal-600">Services Management</h1>
          <p className="text-gray-600 mt-1">Configure your facility's medical services and pricing.</p>
        </div>
        <Button 
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-xl shadow-md transition-all duration-300 w-full sm:w-auto"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-5 w-5" />
          Add New Service
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-50 rounded-xl">
              <span className="text-2xl">🏥</span>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Services</p>
              <p className="text-2xl font-bold text-gray-900">{activeServicesCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Services</p>
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-50 rounded-xl">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue (ETB)</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalRevenue.toLocaleString() || '0'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Service Fee</p>
              <p className="text-2xl font-bold text-gray-900">ETB {stats?.averageFee || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center border border-gray-200 shadow-sm">
        <div className="relative flex-grow w-full">
          <input
            className="w-full border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 rounded-lg pl-10 py-3 text-gray-900 outline-none"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select 
            className="flex-1 sm:w-[160px] border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 rounded-lg py-3 px-4 text-gray-900 outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Services Table */}
      <ServiceTable
        services={filteredServices}
        onEdit={setEditingService}
        onDelete={handleDeleteService}
      />

      {/* Add Service Modal */}
      <ServiceFormModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={handleAddService}
        providerId={CLINIC_PROVIDER_ID}
        title="Add New Service"
        description="Add a medical service to your clinic's catalog"
        showTypeField={true}
        typeOptions={[
          { value: 'Vaccination', label: 'Vaccination' },
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
          description="Update service information"
          showTypeField={true}
          typeOptions={[
            { value: 'Vaccination', label: 'Vaccination' },
            { value: 'Procedure', label: 'Procedure' }
          ]}
        />
      )}
    </div>
  );
}