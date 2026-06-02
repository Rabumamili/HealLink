// app/(routes)/patient/diagnostic-results/page.tsx

'use client';

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  FileCheck, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Package,
  Info,
  Building2,
  Search,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  ShieldCheck,
  Droplets,
  Microscope,
  Activity,
  Pill,
  Calendar,
  Loader2,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatsCard } from "@/components/common/StatsCard";
import { EmptyState } from "@/components/common/EmptyState";
import { useResults } from "@/hooks/useResults";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ResultWithDetails } from "@/types/entities/result.types";

interface DiagnosticResult {
  id: number;
  resultId: number;
  testName: string;
  provider: string;
  providerAddress: string;
  providerId: number;
  orderedDate: string;
  status: "Pending" | "in progress" | "Ready" | "Collected";
  notes?: string;
  changedAt: string;
  appointmentId?: number;
}

const statusConfig: Record<string, {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  description: string;
  displayName: string;
}> = {
  "Pending": {
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50 text-amber-700",
    description: "Test is scheduled and awaiting completion",
    displayName: "Pending"
  },
  "in progress": {
    icon: AlertCircle,
    color: "text-blue-600",
    bgColor: "bg-blue-50 text-blue-700",
    description: "Sample received and being processed at the center",
    displayName: "In Progress"
  },
  "Ready": {
    icon: CheckCircle,
    color: "text-[#008282]",
    bgColor: "bg-[#008282]/10 text-[#008282]",
    description: "Results are ready for physical collection at the diagnostic center",
    displayName: "Ready"
  },
  "Collected": {
    icon: Package,
    color: "text-slate-500",
    bgColor: "bg-slate-100 text-slate-600",
    description: "Results have been collected from the center",
    displayName: "Collected"
  },
};

const getTestIcon = (testName: string) => {
  const testNameLower = testName.toLowerCase();
  if (testNameLower.includes('blood') || testNameLower.includes('cbc') || testNameLower.includes('hb')) {
    return Droplets;
  }
  if (testNameLower.includes('x-ray') || testNameLower.includes('radiology')) {
    return Activity;
  }
  if (testNameLower.includes('thyroid') || testNameLower.includes('metabolic')) {
    return Pill;
  }
  if (testNameLower.includes('microscope') || testNameLower.includes('pathology')) {
    return Microscope;
  }
  return FlaskConical;
};

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status];
  const StatusIcon = config?.icon || Clock;
  const displayName = config?.displayName || status;
  
  if (!config) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-gray-100 text-gray-700">
        <StatusIcon className="h-3 w-3" />
        {status}
      </span>
    );
  }
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap",
      config.bgColor
    )}>
      <StatusIcon className="h-3 w-3" />
      {displayName}
    </span>
  );
}

// Tab Button Component
function TabButton({ active, onClick, children }: { 
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap",
        active 
          ? "bg-white shadow-sm text-[#008282]" 
          : "text-slate-500 hover:bg-slate-100"
      )}
    >
      {children}
    </button>
  );
}

// Gradient Header Component
function GradientHeader({ title, description, icon, onRefresh, isRefreshing }: { 
  title: string; 
  description: string; 
  icon?: React.ReactNode;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#008282] to-[#00a0a0] mb-8">
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
      <div className="absolute right-10 top-10 h-32 w-32 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-white/50 to-white/20" />
      
      <div className="relative px-6 py-6 md:px-8 md:py-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
                  <div className="h-5 w-5 text-white">
                    {icon}
                  </div>
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                {title}
              </h1>
            </div>
            <p className="text-white/80 text-sm md:text-base max-w-2xl ml-12">
              {description}
            </p>
          </div>
          {onRefresh && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="bg-white/20 text-white hover:bg-white/30 border-0"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DiagnosticResultsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([]);
  
  const {
    results,
    isLoading,
    getMyResults,
  } = useResults({
    autoFetch: false,
  });

  // Transform results to diagnostic results format
  const transformResults = useCallback((resultsData: ResultWithDetails[]) => {
    return resultsData.map(result => ({
      id: result.id,
      resultId: result.result_id,
      testName: result.appointment?.serviceName || 'Diagnostic Test',
      provider: result.changedByStaff?.employer?.full_name || result.changedByStaff?.employer?.full_name || 'Diagnostic Center',
      providerAddress: result.changedByStaff?.employer?.address || 'Address not available',
      providerId: result.changedByStaff?.employer?.id || 0,
      orderedDate: new Date(result.changed_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      status: result.status as any,
      notes: '',
      changedAt: result.changed_at,
      appointmentId: result.appointment_id || result.appointment?.id,
    }));
  }, []);

  // Fetch results for the patient
  const loadResults = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      // Fetch results
      await getMyResults();
      
      // Transform the results
      const transformed = transformResults(results as any);
      setDiagnosticResults(transformed);
    } catch (error) {
      console.error('Error loading results:', error);
      toast.error('Failed to load diagnostic results');
    }
  }, [user?.id, getMyResults, transformResults, results]);

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  const handleRefresh = async () => {
    await loadResults();
    toast.success('Results refreshed');
  };

  const pendingCount = diagnosticResults.filter(r => r.status === "Pending").length;
  const inProgressCount = diagnosticResults.filter(r => r.status === "in progress").length;
  const readyCount = diagnosticResults.filter(r => r.status === "Ready").length;
  const collectedCount = diagnosticResults.filter(r => r.status === "Collected").length;

  const getFilteredResults = () => {
    let filtered = diagnosticResults;
    
    if (activeTab !== "all") {
      const statusMap: Record<string, string> = {
        "pending": "Pending",
        "in-progress": "in progress",
        "ready": "Ready",
        "collected": "Collected"
      };
      filtered = filtered.filter(r => r.status === statusMap[activeTab]);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.provider.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredResults = getFilteredResults();

  if (isLoading && diagnosticResults.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#008282]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GradientHeader
          title="Diagnostic Results"
          description="View and track your laboratory and diagnostic reports. Results are available for physical collection only."
          icon={<FlaskConical className="h-5 w-5" />}
          onRefresh={handleRefresh}
          isRefreshing={isLoading}
        />

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Pending"
            value={pendingCount}
            icon={<Clock className="h-5 w-5" />}
            description="Awaiting processing"
            variant="warning"
          />
          <StatsCard
            title="In Progress"
            value={inProgressCount}
            icon={<AlertCircle className="h-5 w-5" />}
            description="Being processed"
            variant="info"
          />
          <StatsCard
            title="Ready for Collection"
            value={readyCount}
            icon={<CheckCircle className="h-5 w-5" />}
            description="Ready to pick up"
            variant="success"
          />
          <StatsCard
            title="Collected"
            value={collectedCount}
            icon={<Package className="h-5 w-5" />}
            description="Already collected"
            variant="default"
          />
        </div>

        {/* Active Orders Summary Card */}
        <Card className="mb-8 border-slate-200 shadow-sm overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#008282]/5 to-transparent" />
          <CardContent className="relative p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#008282]/10 flex items-center justify-center">
                  <FlaskConical className="h-6 w-6 text-[#008282]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Active Lab Orders</h3>
                  <p className="text-sm text-slate-500 max-w-md">
                    You have {pendingCount + inProgressCount} pending reports. 
                    Notifications will be sent once the results are ready.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-8 w-8 text-[#008282]/20" />
                <span className="text-3xl font-bold text-[#008282]">
                  {diagnosticResults.length}
                </span>
                <span className="text-sm text-slate-500">Total Results</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Results Card */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-lg text-slate-800">Test Status</CardTitle>
            <CardDescription className="text-slate-500">
              Monitor the status of your diagnostic tests. Results are available for physical collection only.
            </CardDescription>
          </CardHeader>

          {/* Tabs and Search */}
          <div className="px-6 pt-4 pb-3 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap items-center gap-1 bg-slate-100 rounded-xl p-1">
              <TabButton active={activeTab === "all"} onClick={() => setActiveTab("all")}>
                All ({diagnosticResults.length})
              </TabButton>
              <TabButton active={activeTab === "pending"} onClick={() => setActiveTab("pending")}>
                Pending ({pendingCount})
              </TabButton>
              <TabButton active={activeTab === "in-progress"} onClick={() => setActiveTab("in-progress")}>
                In Progress ({inProgressCount})
              </TabButton>
              <TabButton active={activeTab === "ready"} onClick={() => setActiveTab("ready")}>
                Ready ({readyCount})
              </TabButton>
              <TabButton active={activeTab === "collected"} onClick={() => setActiveTab("collected")}>
                Collected ({collectedCount})
              </TabButton>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by test name or provider..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-2 bg-white border-slate-200 rounded-xl focus:ring-[#008282]/20 text-sm"
              />
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            {filteredResults.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 border-b border-slate-100">
                    <TableHead className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Test Name
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Provider
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Date
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100">
                  {filteredResults.map((result) => {
                    const ItemIcon = getTestIcon(result.testName);
                    
                    return (
                      <TableRow key={result.id} className="hover:bg-slate-50/50 transition-colors group">
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#008282]/10 flex items-center justify-center">
                              <ItemIcon className="h-5 w-5 text-[#008282]" />
                            </div>
                            <span className="font-semibold text-slate-800 text-sm">
                              {result.testName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div>
                            <p className="font-medium text-slate-800 text-sm">{result.provider}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Building2 className="h-3 w-3 text-slate-400" />
                              <span className="text-xs text-slate-500">{result.providerAddress}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-slate-600 text-sm">{result.orderedDate}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <StatusBadge status={result.status} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <EmptyState
                variant="appointment"
                title="No Results Found"
                message={searchQuery ? "No matching diagnostic results" : "No diagnostic results available"}
                submessage={
                  searchQuery 
                    ? "Try adjusting your search or filter criteria"
                    : "Book a diagnostic test to see your results here"
                }
                actionLabel="Book a Diagnostic Test"
                actionHref="/patient/bookings"
                icon={<FileCheck className="h-12 w-12" />}
              />
            )}
          </div>

          {/* Pagination */}
          {filteredResults.length > 0 && (
            <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-sm text-slate-500">
                Showing {filteredResults.length} of {diagnosticResults.length} results
              </span>
              <div className="flex gap-2">
                <button 
                  className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 transition-all" 
                  disabled
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="p-2 rounded-lg border border-slate-200 hover:bg-white transition-all">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* Important Information Card */}
        <Card className="mt-6 bg-[#008282]/5 border-[#008282]/10">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#008282]/10 flex items-center justify-center flex-shrink-0">
                <Info className="h-5 w-5 text-[#008282]" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-2 text-sm">How to Get Your Results</h4>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>Results are only available for physical collection at the diagnostic center.</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>
                      When status shows <StatusBadge status="Ready" />, visit the diagnostic 
                      center to collect your results
                    </li>
                    <li>Bring your ID and appointment card number for verification</li>
                    <li>Results cannot be viewed or downloaded online for security and privacy reasons</li>
                    <li>You will receive an SMS/Email notification when your results are ready</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}