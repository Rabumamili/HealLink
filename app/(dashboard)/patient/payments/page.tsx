"use client"

import { useState } from "react"
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
  Printer
} from "lucide-react"

interface Payment {
  id: string
  date: string
  provider: string
  providerType: "doctor" | "clinic" | "diagnostic"
  service: string
  amount: number
  status: "Completed" | "Failed" | "Pending" | "Refunded"
  method: "Chapa"
  transactionId: string
  chapaReference?: string
}

const paymentHistory: Payment[] = [
  {
    id: "PAY-001",
    date: "May 10, 2026",
    provider: "Dr. Sara Tesfaye",
    providerType: "doctor",
    service: "Initial Consultation",
    amount: 500,
    status: "Completed",
    method: "Chapa",
    transactionId: "TX-78234981",
    chapaReference: "CH-20260510-001234",
  },
  {
    id: "PAY-002",
    date: "May 5, 2026",
    provider: "Addis Diagnostic Center",
    providerType: "diagnostic",
    service: "Blood Test Panel",
    amount: 1200,
    status: "Completed",
    method: "Chapa",
    transactionId: "TX-78234567",
    chapaReference: "CH-20260505-005678",
  },
  {
    id: "PAY-003",
    date: "April 28, 2026",
    provider: "Bethel Clinic",
    providerType: "clinic",
    service: "General Checkup",
    amount: 300,
    status: "Completed",
    method: "Chapa",
    transactionId: "TX-78234123",
    chapaReference: "CH-20260428-009012",
  },
  {
    id: "PAY-004",
    date: "April 20, 2026",
    provider: "Dr. Yonas Bekele",
    providerType: "doctor",
    service: "Follow-up Visit",
    amount: 300,
    status: "Completed",
    method: "Chapa",
    transactionId: "TX-78233789",
    chapaReference: "CH-20260420-003456",
  },
  {
    id: "PAY-005",
    date: "April 15, 2026",
    provider: "St. Gabriel Hospital",
    providerType: "clinic",
    service: "X-Ray",
    amount: 800,
    status: "Refunded",
    method: "Chapa",
    transactionId: "TX-78233456",
    chapaReference: "CH-20260415-007890",
  },
  {
    id: "PAY-006",
    date: "April 10, 2026",
    provider: "Dr. Meron Hailu",
    providerType: "doctor",
    service: "Pediatric Consultation",
    amount: 400,
    status: "Failed",
    method: "Chapa",
    transactionId: "TX-78233123",
  },
]

const statusConfig: Record<string, {
  icon: React.ComponentType<{ className?: string }>
  color: string
}> = {
  Completed: { icon: CheckCircle, color: "bg-green-100 text-green-700" },
  Failed: { icon: XCircle, color: "bg-red-100 text-red-700" },
  Pending: { icon: Clock, color: "bg-yellow-100 text-yellow-700" },
  Refunded: { icon: Receipt, color: "bg-blue-100 text-blue-700" },
}

function ReceiptDialog({ payment }: { payment: Payment }) {
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Payment Receipt</DialogTitle>
        <DialogDescription>
          Transaction ID: {payment.transactionId}
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6 py-4">
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
            <span className="font-medium">{payment.id}</span>
          </div>
          <div className="flex justify-between flex-wrap gap-2">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">{payment.date}</span>
          </div>
          <div className="flex justify-between flex-wrap gap-2">
            <span className="text-muted-foreground">Provider</span>
            <span className="font-medium">{payment.provider}</span>
          </div>
          <div className="flex justify-between flex-wrap gap-2">
            <span className="text-muted-foreground">Service</span>
            <span className="font-medium">{payment.service}</span>
          </div>
          <div className="flex justify-between flex-wrap gap-2">
            <span className="text-muted-foreground">Payment Method</span>
            <span className="font-medium flex items-center gap-1">
              <CreditCard className="h-3 w-3" />
              {payment.method}
            </span>
          </div>
          <div className="flex justify-between flex-wrap gap-2">
            <span className="text-muted-foreground">Transaction ID</span>
            <span className="font-mono text-xs break-all">{payment.transactionId}</span>
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

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button className="flex-1">
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

  const totalSpent = paymentHistory
    .filter(p => p.status === "Completed")
    .reduce((sum, p) => sum + p.amount, 0)

  const thisMonth = paymentHistory
    .filter(p => p.status === "Completed" && p.date.includes("May"))
    .reduce((sum, p) => sum + p.amount, 0)

  const filteredPayments = paymentHistory.filter(
    payment => 
      payment.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
                <p className="text-xl font-bold">{paymentHistory.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Providers</p>
                <p className="text-xl font-bold">
                  {new Set(paymentHistory.map(p => p.provider)).size}
                </p>
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
                placeholder="Search payments..."
                className="pl-10 w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="flex flex-wrap h-auto gap-1 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
              <TabsTrigger value="refunded">Refunded</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction</TableHead>
                      <TableHead className="hidden sm:table-cell">Provider</TableHead>
                      <TableHead className="hidden md:table-cell">Service</TableHead>
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
                      return (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{payment.id}</p>
                              <p className="text-sm text-muted-foreground">{payment.date}</p>
                              <p className="text-sm text-muted-foreground sm:hidden">{payment.provider}</p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell whitespace-normal break-words">
                            {payment.provider}
                          </TableCell>
                          <TableCell className="hidden md:table-cell whitespace-normal break-words">
                            {payment.service}
                          </TableCell>
                          <TableCell className="whitespace-nowrap font-semibold">
                            ETB {payment.amount}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell whitespace-nowrap">
                            <Badge variant="outline" className="gap-1">
                              <CreditCard className="h-3 w-3" />
                              {payment.method}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell whitespace-nowrap">
                            <Badge className={statusColor}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right whitespace-nowrap">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Receipt className="h-4 w-4 mr-2" />
                                  <span className="hidden sm:inline">Receipt</span>
                                </Button>
                              </DialogTrigger>
                              <ReceiptDialog payment={payment} />
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {filteredPayments.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-semibold text-lg">No payments found</h3>
                  <p className="text-muted-foreground mt-1">
                    Try adjusting your search query
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Other tabs simplified for brevity - same overflow-x-auto wrapper */}
            <TabsContent value="completed">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction</TableHead>
                      <TableHead className="hidden sm:table-cell">Provider</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.filter(p => p.status === "Completed").map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payment.id}</p>
                            <p className="text-sm text-muted-foreground">{payment.date}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell whitespace-normal break-words">
                          {payment.provider}
                        </TableCell>
                        <TableCell className="whitespace-nowrap font-semibold">
                          ETB {payment.amount}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="outline" className="gap-1">
                            <CreditCard className="h-3 w-3" />
                            {payment.method}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Receipt className="h-4 w-4 mr-2" />
                                Receipt
                              </Button>
                            </DialogTrigger>
                            <ReceiptDialog payment={payment} />
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="failed">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction</TableHead>
                      <TableHead className="hidden sm:table-cell">Provider</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.filter(p => p.status === "Failed").map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payment.id}</p>
                            <p className="text-sm text-muted-foreground">{payment.date}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell whitespace-normal break-words">
                          {payment.provider}
                        </TableCell>
                        <TableCell className="whitespace-nowrap font-semibold">
                          ETB {payment.amount}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="outline" className="gap-1">
                            <CreditCard className="h-3 w-3" />
                            {payment.method}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <Button variant="outline" size="sm" asChild>
                            <Link href="/patient/bookings">Retry Payment</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="refunded">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction</TableHead>
                      <TableHead className="hidden sm:table-cell">Provider</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.filter(p => p.status === "Refunded").map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payment.id}</p>
                            <p className="text-sm text-muted-foreground">{payment.date}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell whitespace-normal break-words">
                          {payment.provider}
                        </TableCell>
                        <TableCell className="whitespace-nowrap font-semibold">
                          ETB {payment.amount}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="outline" className="gap-1">
                            <CreditCard className="h-3 w-3" />
                            {payment.method}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Receipt className="h-4 w-4 mr-2" />
                                Details
                              </Button>
                            </DialogTrigger>
                            <ReceiptDialog payment={payment} />
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}