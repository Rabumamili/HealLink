// app/clinic-admin/services/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import { ServiceTable } from '@/components/services/service-table';
import { ServiceSearchFilter } from '@/components/services/service-search-filter';
import { ServiceFormModal } from '@/components/services/service-form-modal';
import { StatsCard } from '@/components/common/StatsCard';
import { useServices } from '@/hooks/useService';

const PROVIDER_ID = 103;

export default function ClinicServicesPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<any>(null);

  const { services, stats, createService, updateService, deleteService } =
    useServices({ providerId: PROVIDER_ID, autoFetch: true });

  const filtered = useMemo(() => {
    return services.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) &&
      (status === 'all' || s.status === status)
    );
  }, [services, search, status]);

  const active = services.filter(s => s.status === 'Active').length;

  return (
    <div className="w-full max-w-full overflow-x-hidden p-4 sm:p-6 lg:p-8 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-teal-600">Services</h1>
          <p className="text-gray-600 text-sm">Manage clinic services</p>
        </div>

        <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Active" value={active} icon={<span>🏥</span>} />
        <StatsCard title="Total" value={services.length} icon={<span>📋</span>} />
        <StatsCard title="Revenue" value={`ETB ${stats?.totalRevenue || 0}`} icon={<span>💰</span>} />
        <StatsCard title="Avg" value={`ETB ${stats?.averageFee || 0}`} icon={<span>📊</span>} />
      </div>

      {/* FILTER */}
      <ServiceSearchFilter
        searchTerm={search}
        onSearchChange={setSearch}
        statusFilter={status}
        onStatusFilterChange={setStatus}
      />

      {/* TABLE */}
      <div className="w-full overflow-x-auto">
        <ServiceTable
          services={filtered}
          onEdit={setEdit}
          onDelete={(id, name) => {
            if (confirm(`Delete "${name}"?`)) deleteService(id);
          }}
        />
      </div>

      {/* ADD MODAL */}
      <ServiceFormModal
        open={open}
        onOpenChange={setOpen}
        onSave={(d) => createService({ ...d, providerId: PROVIDER_ID })}
        providerId={PROVIDER_ID}
        title="Add Service"
        description="Create service"
      />

      {/* EDIT MODAL */}
      {edit && (
        <ServiceFormModal
          open={!!edit}
          onOpenChange={() => setEdit(null)}
          onSave={(d) => updateService(edit.id, d)}
          initialData={edit}
          title="Edit Service"
          description="Update service"
        />
      )}
    </div>
  );
}