// app/doctor/services/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { Stethoscope, ClipboardList, DollarSign, TrendingUp, Loader2 } from 'lucide-react';

import { ServiceTable } from '@/components/services/service-table';
import { ServiceSearchFilter } from '@/components/services/service-search-filter';
import { ServiceFormModal } from '@/components/services/service-form-modal';
import { ServicePageHeader } from '@/components/services/ServicePageHeader';
import { StatsCard } from '@/components/common/StatsCard';
import { useServices } from '@/hooks/useService';
import { useAuth } from '@/hooks/useAuth';

export default function DoctorServicesPage() {
  const { user, isLoading: isAuthLoading } = useAuth({ requireAuth: true });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<any>(null);

  if (isAuthLoading || !user?.provider_id) {
    return <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-[#008282]" />
    </div>;
  }

  const providerId = user.provider_id;
  const { services, stats, createService, updateService, deleteService, isLoading } =
    useServices({ providerId, autoFetch: true });

  const filtered = useMemo(() => {
    return services.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) &&
      (status === 'all' || s.status === status)
    );
  }, [services, search, status]);

  const activeCount = services.filter(s => s.status === 'Active').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header */}
        <ServicePageHeader
          title="My Services"
          description="Manage your consultation services, set fees, and track your professional offerings."
          icon={<Stethoscope className="h-5 w-5" />}
          onAddClick={() => setOpen(true)}
          addButtonLabel="Add Service"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Active Services"
            value={activeCount}
            icon={<Stethoscope className="h-5 w-5" />}
            description="Currently offered"
            variant="primary"
          />
          <StatsCard
            title="Total Services"
            value={services.length}
            icon={<ClipboardList className="h-5 w-5" />}
            description="All time"
            variant="default"
          />
          <StatsCard
            title="Total Revenue"
            value={`ETB ${stats?.totalRevenue?.toLocaleString() || 0}`}
            icon={<DollarSign className="h-5 w-5" />}
            description="From consultations"
            variant="success"
          />
          <StatsCard
            title="Average Fee"
            value={`ETB ${stats?.averageFee?.toLocaleString() || 0}`}
            icon={<TrendingUp className="h-5 w-5" />}
            description="Per consultation"
            variant="info"
          />
        </div>

        {/* Filter */}
        <ServiceSearchFilter
          searchTerm={search}
          onSearchChange={setSearch}
          statusFilter={status}
          onStatusFilterChange={setStatus}
        />

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <ServiceTable
            services={filtered}
            onEdit={setEdit}
            onDelete={(id, name) => {
              if (confirm(`Delete "${name}"? This action cannot be undone.`)) deleteService(id);
            }}
          />
        </div>

        {/* Add Modal */}
        <ServiceFormModal
          open={open}
          onOpenChange={setOpen}
          onSave={(d) => createService(d)}
          title="Add Service"
          description="Create a new consultation service"
          isLoading={isLoading}
        />

        {/* Edit Modal */}
        {edit && (
          <ServiceFormModal
            open={!!edit}
            onOpenChange={() => setEdit(null)}
            onSave={(d) => updateService(edit.id, d)}
            initialData={edit}
            title="Edit Service"
            description="Update service details"
          />
        )}
      </div>
    </div>
  );
}