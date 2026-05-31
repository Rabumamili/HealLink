'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { StatsCard } from '@/components/common/StatsCard';
import { GradientHeader } from '@/components/common/GradientHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { FlaskConical, Clock, CheckCircle, AlertCircle, Search, Loader2, RefreshCw, Eye, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DiagnosticResult {
  id: number;
  patientName: string;
  patientId: number;
  testName: string;
  testType: string;
  appointmentDate: string;
  status: 'Pending' | 'in_progress' | 'Ready' | 'Collected';
  notes?: string;
  resultFile?: string;
  updatedAt: string;
  updatedBy?: string;
}

const resultStatusConfig = {
  Pending: {
    label: 'Pending',
    color: 'bg-amber-100 text-amber-700',
    icon: Clock,
    nextStatus: 'in_progress',
    nextLabel: 'Start Processing',
    order: 1
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-700',
    icon: AlertCircle,
    nextStatus: 'Ready',
    nextLabel: 'Mark as Ready',
    order: 2
  },
  Ready: {
    label: 'Ready for Collection',
    color: 'bg-emerald-100 text-emerald-700',
    icon: CheckCircle,
    nextStatus: 'Collected',
    nextLabel: 'Mark as Collected',
    order: 3
  },
  Collected: {
    label: 'Collected',
    color: 'bg-slate-100 text-slate-600',
    icon: CheckCircle,
    nextStatus: null,
    nextLabel: null,
    order: 4
  },
};

export default function StaffDiagnosticResultsPage() {
  const { user, hasStaffRole } = useAuth({
    requireAuth: true,
    allowedRoles: ['staff']
  });

  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'Pending' | 'in_progress' | 'Ready' | 'Collected' | 'all'>('all');
  const [selectedResult, setSelectedResult] = useState<DiagnosticResult | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [resultNotes, setResultNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [resultFile, setResultFile] = useState<File | null>(null);

  const employerId = user?.employer_id;

  // Check if user is lab assistant (only they can update results)
  const canUpdateResults = hasStaffRole('lab assistant');

  const loadResults = useCallback(async () => {
    if (!employerId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/diagnostic/results?employerId=${employerId}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error loading results:', error);
      toast.error('Failed to load diagnostic results');
    } finally {
      setIsLoading(false);
    }
  }, [employerId]);

  useEffect(() => {
    loadResults();
    
    // Set up polling every 30 seconds for real-time updates
    const interval = setInterval(loadResults, 30000);
    return () => clearInterval(interval);
  }, [loadResults]);

  const handleUpdateStatus = (result: DiagnosticResult) => {
    if (!canUpdateResults) {
      toast.error('You don\'t have permission to update results');
      return;
    }
    
    setSelectedResult(result);
    const config = resultStatusConfig[result.status];
    setNewStatus(config.nextStatus || '');
    setResultNotes(result.notes || '');
    setResultFile(null);
    setIsStatusDialogOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResultFile(e.target.files[0]);
    }
  };

  const confirmStatusUpdate = async () => {
    if (!selectedResult || !newStatus) return;

    try {
      const formData = new FormData();
      formData.append('status', newStatus);
      formData.append('notes', resultNotes);
      formData.append('updatedBy', user?.id?.toString() || '');
      if (resultFile) {
        formData.append('resultFile', resultFile);
      }

      const response = await fetch(`/api/diagnostic/results/${selectedResult.id}/status`, {
        method: 'PATCH',
        body: formData
      });
      
      const result = await response.json();

      if (result.success) {
        // Update local state
        setResults(prev =>
          prev.map(r =>
            r.id === selectedResult.id
              ? { ...r, status: newStatus as any, notes: resultNotes, updatedAt: new Date().toISOString() }
              : r
          )
        );

        toast.success(`Result status updated to ${resultStatusConfig[newStatus as keyof typeof resultStatusConfig]?.label}`);
        setIsStatusDialogOpen(false);
        setSelectedResult(null);
        setResultNotes('');
        setResultFile(null);
        
        // Refresh results
        await loadResults();
      } else {
        throw new Error(result.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update result status');
    }
  };

  const getFilteredResults = () => {
    let filtered = results;

    if (activeTab !== 'all') {
      filtered = filtered.filter(r => r.status === activeTab);
    }

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.patientId.toString().includes(searchTerm) ||
        r.testName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by status order
    return filtered.sort((a, b) => {
      const orderA = resultStatusConfig[a.status]?.order || 99;
      const orderB = resultStatusConfig[b.status]?.order || 99;
      return orderA - orderB;
    });
  };

  const filteredResults = getFilteredResults();

  const displayStats = {
    pending: results.filter(r => r.status === 'Pending').length,
    in_progress: results.filter(r => r.status === 'in_progress').length,
    ready: results.filter(r => r.status === 'Ready').length,
    collected: results.filter(r => r.status === 'Collected').length,
    total: results.length,
  };

  if (isLoading && results.length === 0) {
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
          title="Diagnostic Results Management"
          description={
            canUpdateResults 
              ? "Update and track diagnostic test results status for patients."
              : "View diagnostic test results for patients."
          }
          icon={<FlaskConical className="h-5 w-5" />}
          onRefresh={loadResults}
          isRefreshing={isLoading}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatsCard
            title="Total Tests"
            value={displayStats.total}
            icon={<FlaskConical className="h-5 w-5" />}
            variant="default"
          />
          <StatsCard
            title="Pending"
            value={displayStats.pending}
            icon={<Clock className="h-5 w-5" />}
            variant="warning"
          />
          <StatsCard
            title="In Progress"
            value={displayStats.in_progress}
            icon={<AlertCircle className="h-5 w-5" />}
            variant="info"
          />
          <StatsCard
            title="Ready"
            value={displayStats.ready}
            icon={<CheckCircle className="h-5 w-5" />}
            variant="success"
          />
          <StatsCard
            title="Collected"
            value={displayStats.collected}
            icon={<CheckCircle className="h-5 w-5" />}
            variant="default"
          />
        </div>

        {/* Search and Filter */}
        <Card className="border-slate-200 shadow-sm mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by patient name, ID, or test name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl border-slate-200 focus:ring-[#008282]"
                />
              </div>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full md:w-auto">
                <TabsList className="bg-slate-100 rounded-xl">
                  <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-[#008282] rounded-lg">
                    All ({displayStats.total})
                  </TabsTrigger>
                  <TabsTrigger value="Pending" className="data-[state=active]:bg-white data-[state=active]:text-[#008282] rounded-lg">
                    Pending ({displayStats.pending})
                  </TabsTrigger>
                  <TabsTrigger value="in_progress" className="data-[state=active]:bg-white data-[state=active]:text-[#008282] rounded-lg">
                    In Progress ({displayStats.in_progress})
                  </TabsTrigger>
                  <TabsTrigger value="Ready" className="data-[state=active]:bg-white data-[state=active]:text-[#008282] rounded-lg">
                    Ready ({displayStats.ready})
                  </TabsTrigger>
                  <TabsTrigger value="Collected" className="data-[state=active]:bg-white data-[state=active]:text-[#008282] rounded-lg">
                    Collected ({displayStats.collected})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-slate-800">Diagnostic Results</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredResults.length === 0 ? (
              <div className="text-center py-12">
                <FlaskConical className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">No diagnostic results found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 border-b border-slate-100">
                      <TableHead className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</TableHead>
                      <TableHead className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Test Name</TableHead>
                      <TableHead className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</TableHead>
                      <TableHead className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</TableHead>
                      <TableHead className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-slate-100">
                    {filteredResults.map((result) => {
                      const status = resultStatusConfig[result.status];
                      const StatusIcon = status?.icon || Clock;
                      
                      return (
                        <TableRow key={result.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="px-6 py-4">
                            <div>
                              <p className="font-medium text-slate-800">{result.patientName}</p>
                              <p className="text-xs text-slate-500">ID: {result.patientId}</p>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <p className="text-slate-700 font-medium">{result.testName}</p>
                            <p className="text-xs text-slate-400">{result.testType}</p>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <p className="text-slate-600">
                              {new Date(result.appointmentDate).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-slate-400">
                              {new Date(result.updatedAt).toLocaleTimeString()}
                            </p>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            {status && (
                              <Badge className={cn("rounded-full flex items-center gap-1 w-fit", status.color)}>
                                <StatusIcon className="h-3 w-3" />
                                {status.label}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-right">
                            {canUpdateResults && result.status !== 'Collected' && status?.nextStatus && (
                              <Button
                                size="sm"
                                onClick={() => handleUpdateStatus(result)}
                                className="bg-[#008282] hover:bg-[#00a0a0] rounded-xl"
                              >
                                {status.nextLabel || 'Update Status'}
                              </Button>
                            )}
                            {result.status === 'Collected' && (
                              <Badge variant="outline" className="text-slate-500">
                                Completed
                              </Badge>
                            )}
                            {result.resultFile && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="ml-2 rounded-xl"
                                onClick={() => window.open(result.resultFile, '_blank')}
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Update Status Dialog */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-800">Update Result Status</DialogTitle>
              <DialogDescription className="text-slate-500">
                Update the diagnostic result status for {selectedResult?.patientName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-slate-700">Test</Label>
                <p className="text-sm font-medium text-slate-800 bg-slate-50 p-2 rounded-lg">
                  {selectedResult?.testName}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Current Status</Label>
                {selectedResult && resultStatusConfig[selectedResult.status] && (
                  <Badge className={cn("rounded-full", resultStatusConfig[selectedResult.status].color)}>
                    {resultStatusConfig[selectedResult.status].label}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">New Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedResult && resultStatusConfig[selectedResult.status]?.nextStatus && (
                      <SelectItem value={resultStatusConfig[selectedResult.status].nextStatus!}>
                        {resultStatusConfig[selectedResult.status].nextLabel}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-slate-700">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about the test results..."
                  value={resultNotes}
                  onChange={(e) => setResultNotes(e.target.value)}
                  rows={3}
                  className="rounded-xl border-slate-200 focus:ring-[#008282]"
                />
              </div>

              {newStatus === 'Ready' && (
                <div className="space-y-2">
                  <Label htmlFor="resultFile" className="text-slate-700">Upload Result File (Optional)</Label>
                  <Input
                    id="resultFile"
                    type="file"
                    accept=".pdf,.jpg,.png,.docx"
                    onChange={handleFileUpload}
                    className="rounded-xl border-slate-200 focus:ring-[#008282]"
                  />
                  <p className="text-xs text-slate-400">Upload PDF, image, or document with test results</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button
                onClick={confirmStatusUpdate}
                disabled={!newStatus}
                className="bg-[#008282] hover:bg-[#00a0a0] rounded-xl"
              >
                Confirm Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}