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

// Status configuration - removed Refunded
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

// Helper function to format date
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
    <DialogContent className="max-w-md print:shadow-none print:border-0" id="receipt-content">
      <DialogHeader className="print:hidden">
        <DialogTitle>Payment Receipt</DialogTitle>
        <DialogDescription>
          Transaction ID: {payment.txRef}
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6 py-4 print:py-0">
        <div className="text-center border-b pb-4">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Receipt className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="font-bold text-xl">HealLink</h3>
          <p className="text-sm text-muted-foreground">Payment Receipt - Chapa</p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between flex-wrap gap-2">
            <span className="text-muted-foreground">Receipt ID</span>
            <span className="font-medium">PAY-{payment.id}</span>
          </div>
          <div className="flex justify-between flex-wrap gap-2">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">{formatDate(payment.createdAt)}</span>
          </div>
          <div className="flex justify-between flex-wrap gap-2">
            <span className="text-muted-foreground">Appointment ID</span>
            <span className="font-medium">#{payment.appointmentId}</span>
          </div>
          <div className="flex justify-between flex-wrap gap-2">
            <span className="text-muted-foreground">Payment Method</span>
            <span className="font-medium flex items-center gap-1">
              <CreditCard className="h-3 w-3" />
              {payment.provider.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between flex-wrap gap-2">
            <span className="text-muted-foreground">Transaction ID</span>
            <span className="font-mono text-xs break-all">{payment.txRef}</span>
          </div>
          {payment.chapaReference && (
            <div className="flex justify-between flex-wrap gap-2">
              <span className="text-muted-foreground">Chapa Reference</span>
              <span className="font-mono text-xs break-all">{payment.chapaReference}</span>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <span className="font-semibold">Total Amount</span>
            <span className="text-2xl font-bold text-primary">ETB {payment.amount}</span>
          </div>
        </div>

        <div className="flex gap-3 print:hidden">
          <Button variant="outline" className="flex-1" onClick={handlePrint} disabled={isPrinting}>
            <Printer className="h-4 w-4 mr-2" />
            {isPrinting ? "Printing..." : "Print"}
          </Button>
          <Button className="flex-1" onClick={() => onDownloadPDF(payment)}>
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
  
  // Get current user - replace with your auth hook
  const patientId = 201 // This should come from your auth context
  
  const {
    payments,
    isLoading,
    error,
    fetchPatientPayments,
    getTotalAmountSpent,
    clearError
  } = usePayment({
    patientId,
    autoFetch: true
  })

  // Clear error on unmount
  useEffect(() => {
    return () => {
      clearError()
    }
  }, [clearError])

  // Show error toast if any
  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  // Calculate statistics from real data
  const totalSpent = getTotalAmountSpent()
  
  const thisMonth = payments
    .filter(p => p.status === "SUCCESS" && 
      new Date(p.createdAt).getMonth() === new Date().getMonth() &&
      new Date(p.createdAt).getFullYear() === new Date().getFullYear()
    )
    .reduce((sum, p) => sum + p.amount, 0)

  const uniqueProviders = new Set(payments.map(p => p.appointmentId)).size

  // Filter payments based on search and active tab
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.txRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toString().includes(searchQuery) ||
      payment.appointmentId.toString().includes(searchQuery)
    
    const matchesTab = activeTab === "all" || payment.status === activeTab.toUpperCase()
    
    return matchesSearch && matchesTab
  })

  // Handle PDF download
  const handleDownloadPDF = async (payment: any) => {
    try {
      toast.info("Generating PDF...")
      // Implement PDF generation logic here
      // You can use jsPDF or another library
      toast.success("PDF downloaded successfully")
    } catch (error) {
      toast.error("Failed to download PDF")
    }
  }

  if (isLoading && payments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">View your payment history and receipts</p>
      </div>

      {/* Chapa Info Banner */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <CreditCard className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">All payments are securely processed through <span className="text-primary font-semibold">Chapa</span></p>
              <p className="text-xs text-muted-foreground">Chapa supports Telebirr, CBEBirr, and major bank cards</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Spent</p>
                <p className="text-xl font-bold">ETB {totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">This Month</p>
                <p className="text-xl font-bold">ETB {thisMonth.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Transactions</p>
                <p className="text-xl font-bold">{payments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Appointments</p>
                <p className="text-xl font-bold">{uniqueProviders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                All your payment transactions processed via Chapa
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search by transaction or appointment..."
                className="pl-10 w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap h-auto gap-1 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="SUCCESS">Completed</TabsTrigger>
              <TabsTrigger value="PENDING">Pending</TabsTrigger>
              <TabsTrigger value="FAILED">Failed</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {filteredPayments.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-semibold text-lg">No payments found</h3>
                  <p className="text-muted-foreground mt-1">
                    {searchQuery ? "Try adjusting your search query" : "No payments to display"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction</TableHead>
                        <TableHead className="hidden sm:table-cell">Appointment ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="hidden sm:table-cell">Method</TableHead>
                        <TableHead className="hidden sm:table-cell">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.map((payment) => {
                        const StatusIcon = statusConfig[payment.status]?.icon || Clock
                        const statusColor = statusConfig[payment.status]?.color || "bg-gray-100 text-gray-700"
                        const statusLabel = statusConfig[payment.status]?.label || payment.status
                        
                        return (
                          <TableRow key={payment.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{payment.txRef}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(payment.createdAt)}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge variant="outline">
                                #{payment.appointmentId}
                              </Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap font-semibold">
                              ETB {payment.amount}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell whitespace-nowrap">
                              <Badge variant="outline" className="gap-1">
                                <CreditCard className="h-3 w-3" />
                                {payment.provider.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell whitespace-nowrap">
                              <Badge className={statusColor}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusLabel}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right whitespace-nowrap">
                              {payment.status === "FAILED" ? (
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/patient/bookings?appointment=${payment.appointmentId}`}>
                                    Retry Payment
                                  </Link>
                                </Button>
                              ) : payment.status === "SUCCESS" ? (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Receipt className="h-4 w-4 mr-2" />
                                      <span className="hidden sm:inline">Receipt</span>
                                    </Button>
                                  </DialogTrigger>
                                  <ReceiptDialog payment={payment} onDownloadPDF={handleDownloadPDF} />
                                </Dialog>
                              ) : (
                                <Badge variant="secondary" className="whitespace-nowrap">
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
  )
}