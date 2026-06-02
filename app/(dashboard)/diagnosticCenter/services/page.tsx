// app/diagnostic-center/services/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { FlaskConical, ClipboardList, DollarSign, TrendingUp, Loader2 } from 'lucide-react';

import { ServiceTable } from '@/components/services/service-table';
import { ServiceSearchFilter } from '@/components/services/service-search-filter';
import { ServiceFormModal } from '@/components/services/service-form-modal';
import { ServicePageHeader } from '@/components/services/ServicePageHeader';
import { StatsCard } from '@/components/common/StatsCard';
import { useServices } from '@/hooks/useService';
import { useAuth } from '@/hooks/useAuth';

export default function DiagnosticServicesPage() {
  const { user, isLoading: isAuthLoading } = useAuth({ requireAuth: true });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [open, setOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const { services, stats, createService, isLoading } =
    useServices({ autoFetch: true });

  const handleEdit = (service: any) => {
    setEditingService(service);
    setOpen(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      // TODO: Implement delete functionality
      console.log('Delete service:', id);
    }
  };

  const filtered = useMemo(() => {
    return services.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) &&
      (status === 'all' || s.status === status)
    );
  }, [services, search, status]);

  const activeCount = services.filter(s => s.status === 'Active').length;

  if (isAuthLoading || !user?.provider_id) {
    return <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-[#008282]" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header */}
        <ServicePageHeader
          title="Diagnostic Tests"
          description="Manage all diagnostic tests, set fees, and track performance metrics for your laboratory services."
          icon={<FlaskConical className="h-5 w-5" />}
          onAddClick={() => setOpen(true)}
          addButtonLabel="Add Test"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Active Tests"
            value={activeCount}
            icon={<FlaskConical className="h-5 w-5" />}
            description="Currently available"
            variant="primary"
          />
          <StatsCard
            title="Total Tests"
            value={services.length}
            icon={<ClipboardList className="h-5 w-5" />}
            description="All time"
            variant="default"
          />
          <StatsCard
            title="Total Revenue"
            value={`ETB ${stats?.totalRevenue?.toLocaleString() || 0}`}
            icon={<DollarSign className="h-5 w-5" />}
            description="From all tests"
            variant="success"
          />
          <StatsCard
            title="Average Fee"
            value={`ETB ${stats?.averageFee?.toLocaleString() || 0}`}
            icon={<TrendingUp className="h-5 w-5" />}
            description="Per test"
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
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Add Modal */}
        <ServiceFormModal
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) setEditingService(null);
          }}
          onSave={(d) => createService(d)}
          title={editingService ? "Edit Test" : "Add Test"}
          description={editingService ? "Update your diagnostic test details" : "Create a new diagnostic test"}
          initialData={editingService}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}