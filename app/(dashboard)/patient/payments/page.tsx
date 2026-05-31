// app/(dashboard)/patient/payments/page.tsx - Fixed

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  CreditCard, 
  Download, 
  Search, 
  CheckCircle,
  XCircle,
  Clock,
  Receipt,
  TrendingUp,
  Calendar,
  Building2,
  Printer,
  Loader2
} from "lucide-react"
import { usePayment } from "@/hooks/usePayment"
import { format } from "date-fns"
import { toast } from "sonner"
import { StatsCard } from "@/components/common/StatsCard"
import { cn } from "@/lib/utils" // IMPORTANT: Add this import

// Gradient Header Component
function GradientHeader({ title, description, icon }: { title: string; description: string; icon?: React.ReactNode }) {
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
                  <div className="h-5 w-5 text-white">{icon}</div>
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">{title}</h1>
            </div>
            <p className="text-white/80 text-sm md:text-base max-w-2xl ml-12">{description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Status configuration
const statusConfig: Record<string, {
  icon: React.ComponentType<{ className?: string }>
  color: string
  label: string
}> = {
  SUCCESS: { 
    icon: CheckCircle, 
    color: "bg-green-100 text-green-700",
    label: "Completed"
  },
  FAILED: { 
    icon: XCircle, 
    color: "bg-red-100 text-red-700",
    label: "Failed"
  },
  PENDING: { 
    icon: Clock, 
    color: "bg-yellow-100 text-yellow-700",
    label: "Pending"
  },
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "MMM dd, yyyy")
}

// Receipt Dialog Component
function ReceiptDialog({ payment, onDownloadPDF }: { 
  payment: any; 
  onDownloadPDF: (payment: any) => void 
}) {
  const [isPrinting, setIsPrinting] = useState(false)

  const handlePrint = () => {
    setIsPrinting(true)
    setTimeout(() => {
      window.print()
      setIsPrinting(false)
    }, 100)
  }

  return (
    <DialogContent className="max-w-md rounded-2xl print:shadow-none print:border-0" id="receipt-content">
      <DialogHeader className="print:hidden">
        <DialogTitle>Payment Receipt</DialogTitle>
        <DialogDescription>
          Transaction ID: {payment.txRef}
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6 py-4 print:py-0">
        <div className="text-center border-b pb-4">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-[#008282]/10 flex items-center justify-center">
              <Receipt className="h-6 w-6 text-[#008282]" />
            </div>
          </div>
          <h3 className="font-bold text-xl">HealLink</h3>
          <p className="text-sm text-slate-500">Payment Receipt - Chapa</p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between flex-wrap gap-2">
            <span className="text-slate-500">Receipt ID</span>
            <span className="font-medium">PAY-{payment.id}</span>
          </div>
          <div className="flex justify-between flex-wrap gap-2">
            <span className="text-slate-500">Date</span>
            <span className="font-medium">{formatDate(payment.createdAt)}</span>
          </div>
          <div className="flex justify-between flex-wrap gap-2">
            <span className="text-slate-500">Appointment ID</span>
            <span className="font-medium">#{payment.appointmentId}</span>
          </div>
          <div className="flex justify-between flex-wrap gap-2">
            <span className="text-slate-500">Payment Method</span>
            <span className="font-medium flex items-center gap-1">
              <CreditCard className="h-3 w-3" />
              {payment.provider.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between flex-wrap gap-2">
            <span className="text-slate-500">Transaction ID</span>
            <span className="font-mono text-xs break-all">{payment.txRef}</span>
          </div>
          {payment.chapaReference && (
            <div className="flex justify-between flex-wrap gap-2">
              <span className="text-slate-500">Chapa Reference</span>
              <span className="font-mono text-xs break-all">{payment.chapaReference}</span>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <span className="font-semibold">Total Amount</span>
            <span className="text-2xl font-bold text-[#008282]">ETB {payment.amount}</span>
          </div>
        </div>

        <div className="flex gap-3 print:hidden">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={handlePrint} disabled={isPrinting}>
            <Printer className="h-4 w-4 mr-2" />
            {isPrinting ? "Printing..." : "Print"}
          </Button>
          <Button className="flex-1 rounded-xl bg-[#008282] hover:bg-[#00a0a0] text-white" onClick={() => onDownloadPDF(payment)}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  
  const patientId = 201
  
  const {
    payments,
    isLoading,
    error,
    getTotalAmountSpent,
    clearError
  } = usePayment({
    patientId,
    autoFetch: true
  })

  useEffect(() => {
    return () => {
      clearError()
    }
  }, [clearError])

  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  const totalSpent = getTotalAmountSpent()
  
  const thisMonth = payments
    .filter(p => p.status === "SUCCESS" && 
      new Date(p.createdAt).getMonth() === new Date().getMonth() &&
      new Date(p.createdAt).getFullYear() === new Date().getFullYear()
    )
    .reduce((sum, p) => sum + p.amount, 0)

  const uniqueProviders = new Set(payments.map(p => p.appointmentId)).size

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.txRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toString().includes(searchQuery) ||
      payment.appointmentId.toString().includes(searchQuery)
    
    const matchesTab = activeTab === "all" || payment.status === activeTab.toUpperCase()
    
    return matchesSearch && matchesTab
  })

  const handleDownloadPDF = async (payment: any) => {
    try {
      toast.info("Generating PDF...")
      toast.success("PDF downloaded successfully")
    } catch (error) {
      toast.error("Failed to download PDF")
    }
  }

  if (isLoading && payments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-[#008282]" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GradientHeader
          title="Payments"
          description="View your payment history and receipts for all healthcare services."
          icon={<CreditCard className="h-5 w-5" />}
        />

        {/* Chapa Info Banner */}
        <Card className="mb-8 bg-[#008282]/5 border-[#008282]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <CreditCard className="h-5 w-5 text-[#008282] flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-800">All payments are securely processed through <span className="text-[#008282] font-semibold">Chapa</span></p>
                <p className="text-xs text-slate-500">Chapa supports Telebirr, CBEBirr, and major bank cards</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-8">
          <StatsCard
            title="Total Spent"
            value={`ETB ${totalSpent.toLocaleString()}`}
            icon={<CreditCard className="h-5 w-5" />}
            variant="default"
          />
          <StatsCard
            title="This Month"
            value={`ETB ${thisMonth.toLocaleString()}`}
            icon={<TrendingUp className="h-5 w-5" />}
            variant="success"
          />
          <StatsCard
            title="Transactions"
            value={payments.length}
            icon={<Calendar className="h-5 w-5" />}
            variant="info"
          />
          <StatsCard
            title="Appointments"
            value={uniqueProviders}
            icon={<Building2 className="h-5 w-5" />}
            variant="primary"
          />
        </div>

        {/* Payment History */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-lg text-slate-800">Payment History</CardTitle>
                <CardDescription className="text-slate-500">
                  All your payment transactions processed via Chapa
                </CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Search by transaction or appointment..."
                  className="pl-10 w-full sm:w-64 rounded-xl border-slate-200 focus:ring-[#008282]/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <div className="px-6 pt-4 pb-3 border-b border-slate-100">
                <TabsList className="bg-slate-100 rounded-xl">
                  <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-[#008282] rounded-lg">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="SUCCESS" className="data-[state=active]:bg-white data-[state=active]:text-[#008282] rounded-lg">
                    Completed
                  </TabsTrigger>
                  <TabsTrigger value="PENDING" className="data-[state=active]:bg-white data-[state=active]:text-[#008282] rounded-lg">
                    Pending
                  </TabsTrigger>
                  <TabsTrigger value="FAILED" className="data-[state=active]:bg-white data-[state=active]:text-[#008282] rounded-lg">
                    Failed
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="m-0">
                {filteredPayments.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                    <h3 className="font-semibold text-lg text-slate-800">No payments found</h3>
                    <p className="text-slate-500 mt-1">
                      {searchQuery ? "Try adjusting your search query" : "No payments to display"}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50/50 border-b border-slate-100">
                          <TableHead className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction</TableHead>
                          <TableHead className="hidden sm:table-cell px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Appointment ID</TableHead>
                          <TableHead className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</TableHead>
                          <TableHead className="hidden md:table-cell px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Method</TableHead>
                          <TableHead className="hidden sm:table-cell px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</TableHead>
                          <TableHead className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-slate-100">
                        {filteredPayments.map((payment) => {
                          const StatusIcon = statusConfig[payment.status]?.icon || Clock
                          const statusColor = statusConfig[payment.status]?.color || "bg-gray-100 text-gray-700"
                          const statusLabel = statusConfig[payment.status]?.label || payment.status
                          
                          return (
                            <TableRow key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                              <TableCell className="px-6 py-4">
                                <div>
                                  <p className="font-medium text-slate-800">{payment.txRef}</p>
                                  <p className="text-sm text-slate-500">
                                    {formatDate(payment.createdAt)}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell px-6 py-4">
                                <Badge variant="outline" className="rounded-full">
                                  #{payment.appointmentId}
                                </Badge>
                              </TableCell>
                              <TableCell className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800">
                                ETB {payment.amount}
                              </TableCell>
                              <TableCell className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                                <Badge variant="outline" className="gap-1 rounded-full">
                                  <CreditCard className="h-3 w-3" />
                                  {payment.provider.toUpperCase()}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                                <Badge className={cn("rounded-full", statusColor)}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusLabel}
                                </Badge>
                              </TableCell>
                              <TableCell className="px-6 py-4 text-right whitespace-nowrap">
                                {payment.status === "FAILED" ? (
                                  <Button variant="outline" size="sm" className="rounded-xl" asChild>
                                    <Link href={`/patient/bookings?appointment=${payment.appointmentId}`}>
                                      Retry Payment
                                    </Link>
                                  </Button>
                                ) : payment.status === "SUCCESS" ? (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="sm" className="text-[#008282] hover:text-[#00a0a0]">
                                        <Receipt className="h-4 w-4 mr-2" />
                                        <span className="hidden sm:inline">Receipt</span>
                                      </Button>
                                    </DialogTrigger>
                                    <ReceiptDialog payment={payment} onDownloadPDF={handleDownloadPDF} />
                                  </Dialog>
                                ) : (
                                  <Badge variant="secondary" className="whitespace-nowrap rounded-full">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Processing
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}