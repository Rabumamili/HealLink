// app/diagnostic-center/dashboard/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  Activity,
  Microscope,
  FileText,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Timer,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  FlaskConical,
  Syringe,
  Beaker,
  TestTube,
  AlertTriangle,
  Bell,
  Printer,
  Send,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Types
interface TestResult {
  id: string
  patientName: string
  patientId: string
  testName: string
  category: string
  date: string
  time: string
  status: "Completed" | "In Progress" | "Pending" | "Ready" | "Collected"
  urgency: "High" | "Medium" | "Low"
  fee: number
  technician?: string
}

interface Alert {
  id: string
  type: "Critical Result" | "Quality Check" | "Equipment Alert" | "Pending Review"
  patientName: string
  testName: string
  urgency: "High" | "Medium" | "Low"
  time: string
  message: string
}

const statusColors: Record<string, string> = {
  "Completed": "bg-green-100 text-green-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Pending": "bg-yellow-100 text-yellow-700",
  "Ready": "bg-teal-100 text-teal-700",
  "Collected": "bg-gray-100 text-gray-700",
}

const urgencyColors: Record<string, string> = {
  "High": "bg-red-100 text-red-700",
  "Medium": "bg-yellow-100 text-yellow-700",
  "Low": "bg-gray-100 text-gray-700",
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Biochemistry": FlaskConical,
  "Hematology": Syringe,
  "Endocrinology": Activity,
  "Diabetes": Activity,
  "Nutrition": Beaker,
}

export default function DiagnosticCenterDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [alerts] = useState<Alert[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddingTest, setIsAddingTest] = useState(false)

  const completedCount = testResults.filter(t => t.status === "Completed").length
  const pendingCount = testResults.filter(t => t.status === "Pending").length
  const inProgressCount = testResults.filter(t => t.status === "In Progress").length
  const readyCount = testResults.filter(t => t.status === "Ready").length
  const highUrgencyCount = alerts.filter(a => a.urgency === "High").length

  const stats = [
    { title: "Total Tests", value: testResults.length.toString(), icon: Microscope, color: "bg-blue-50 text-blue-600", trend: "+12%", trendUp: true },
    { title: "Completed", value: completedCount.toString(), icon: CheckCircle, color: "bg-green-50 text-green-600", trend: "+8%", trendUp: true },
    { title: "Pending", value: pendingCount.toString(), icon: Clock, color: "bg-yellow-50 text-yellow-600", trend: "-3%", trendUp: false },
    { title: "Ready for Review", value: readyCount.toString(), icon: FileText, color: "bg-teal-50 text-teal-600", trend: "+2", trendUp: true },
  ]

  const filteredTests = testResults.filter(t =>
    t.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.patientId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 p-6 md:p-8 shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -ml-24 -mb-24"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-white/80" />
              <span className="text-white/80 text-sm font-medium">Welcome</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Addis Diagnostic Center</h2>
            <p className="text-teal-50 text-base">{pendingCount} tests pending, {highUrgencyCount} high priority alerts</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Timer className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wide">Avg. Turnaround</p>
                <p className="text-lg font-bold text-white">3.4 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.title}</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={cn(
                  "text-xs font-semibold",
                  stat.trendUp ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                )}>
                  {stat.trend}
                  {stat.trendUp ? <TrendingUp className="ml-1 h-3 w-3" /> : <TrendingDown className="ml-1 h-3 w-3" />}
                </Badge>
                <span className="text-xs text-gray-500">vs yesterday</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="tests" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm">
            Test Results
          </TabsTrigger>
          <TabsTrigger value="alerts" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm">
            Alerts
          </TabsTrigger>
          <TabsTrigger value="reports" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm">
            Reports
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Tests - Left Column */}
            <div className="lg:col-span-2">
              <Card className="border shadow-sm overflow-hidden">
                <div className="bg-gray-50/50 px-6 py-4 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Recent Tests</h3>
                      <p className="text-sm text-gray-500 mt-1">Today's test queue and status</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-teal-200 text-teal-600 hover:bg-teal-50">
                      View All
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {filteredTests.slice(0, 5).map((test) => {
                      const CategoryIcon = categoryIcons[test.category] || FlaskConical
                      return (
                        <div key={test.id} className="group bg-white rounded-xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all duration-300 overflow-hidden">
                          <div className="p-4">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                              <div className="flex items-center gap-4 flex-1">
                                <Avatar className="h-12 w-12 rounded-xl">
                                  <AvatarFallback className="bg-teal-50 text-teal-600 font-bold">
                                    {test.patientName.split(" ").map(n => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-bold text-gray-800">{test.patientName}</h4>
                                    <Badge className={statusColors[test.status]}>{test.status}</Badge>
                                    {test.urgency === "High" && (
                                      <Badge className="bg-red-100 text-red-700">
                                        <AlertTriangle className="mr-1 h-3 w-3" />
                                        Urgent
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <CategoryIcon className="h-3.5 w-3.5 text-teal-600" />
                                      {test.testName}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3.5 w-3.5 text-teal-600" />
                                      {test.time}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <DollarSign className="h-3.5 w-3.5 text-teal-600" />
                                      ETB {test.fee}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {test.status === "Ready" && (
                                <Button className="bg-teal-600 hover:bg-teal-700 rounded-lg px-4 shadow-sm hover:shadow transition-all">
                                  <Eye className="mr-2 h-4 w-4" />
                                  Review Results
                                </Button>
                              )}
                              {test.status === "In Progress" && (
                                <Button variant="outline" className="border-teal-200 text-teal-600 hover:bg-teal-50 rounded-lg">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Update
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alerts & Quick Actions - Right Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Alerts Section */}
              <Card className="border shadow-sm overflow-hidden">
                <div className="bg-gray-50/50 px-6 py-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Bell className="h-5 w-5 text-teal-600" />
                        Alerts
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Pending actions and notifications</p>
                    </div>
                    {highUrgencyCount > 0 && (
                      <Badge className="bg-red-100 text-red-700">
                        {highUrgencyCount} High Priority
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {alerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className="p-3 rounded-lg border border-gray-100 hover:border-teal-200 hover:shadow-sm transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-2">
                            {alert.type === "Critical Result" && <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />}
                            {alert.type === "Quality Check" && <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />}
                            {alert.type === "Equipment Alert" && <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />}
                            {alert.type === "Pending Review" && <Clock className="h-4 w-4 text-teal-500 mt-0.5" />}
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{alert.type}</p>
                              <p className="text-xs text-gray-600">{alert.patientName !== "-" ? `${alert.patientName} - ` : ""}{alert.testName}</p>
                              <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                            </div>
                          </div>
                          <Badge className={urgencyColors[alert.urgency]}>{alert.urgency}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-gray-800">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start gap-3 bg-teal-600 hover:bg-teal-700" onClick={() => setIsAddingTest(true)}>
                    <Plus className="h-4 w-4" />
                    New Test Order
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3 border-teal-200 text-teal-600 hover:bg-teal-50">
                    <Upload className="h-4 w-4" />
                    Upload Results
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3 border-teal-200 text-teal-600 hover:bg-teal-50">
                    <Download className="h-4 w-4" />
                    Export Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3 border-teal-200 text-teal-600 hover:bg-teal-50">
                    <Printer className="h-4 w-4" />
                    Print Labels
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Test Results Tab */}
        <TabsContent value="tests" className="space-y-4">
          <Card className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4 border-b bg-gray-50/50">
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">Test Results</CardTitle>
                <CardDescription>Manage and review patient test results</CardDescription>
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setIsAddingTest(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Test Order
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by patient name, test name, or patient ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 rounded-lg border-gray-200 focus:border-teal-300 focus:ring-teal-200"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="cursor-pointer bg-gray-100 text-gray-700 hover:bg-teal-100 hover:text-teal-700 px-3 py-1.5">All</Badge>
                <Badge className="cursor-pointer bg-gray-100 text-gray-700 hover:bg-teal-100 hover:text-teal-700 px-3 py-1.5">Pending</Badge>
                <Badge className="cursor-pointer bg-gray-100 text-gray-700 hover:bg-teal-100 hover:text-teal-700 px-3 py-1.5">In Progress</Badge>
                <Badge className="cursor-pointer bg-gray-100 text-gray-700 hover:bg-teal-100 hover:text-teal-700 px-3 py-1.5">Ready</Badge>
                <Badge className="cursor-pointer bg-gray-100 text-gray-700 hover:bg-teal-100 hover:text-teal-700 px-3 py-1.5">Completed</Badge>
              </div>

              {/* Tests Table */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-700">Patient</TableHead>
                      <TableHead className="font-semibold text-gray-700">Test Name</TableHead>
                      <TableHead className="font-semibold text-gray-700">Category</TableHead>
                      <TableHead className="font-semibold text-gray-700">Date</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTests.map((test) => {
                      const CategoryIcon = categoryIcons[test.category] || FlaskConical
                      return (
                        <TableRow key={test.id} className="hover:bg-teal-50/30 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarFallback className="bg-teal-50 text-teal-600 text-xs">
                                  {test.patientName.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-800">{test.patientName}</p>
                                <p className="text-xs text-gray-500">{test.patientId}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-gray-800">{test.testName}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <CategoryIcon className="h-3.5 w-3.5 text-teal-600" />
                              <span className="text-sm text-gray-600">{test.category}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600">{test.date}</TableCell>
                          <TableCell>
                            <Badge className={statusColors[test.status]}>{test.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-teal-600">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {test.status !== "Completed" && (
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-teal-600">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              {test.status === "Ready" && (
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-teal-600">
                                  <Send className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card className="border shadow-sm">
            <CardHeader className="border-b bg-gray-50/50">
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Bell className="h-5 w-5 text-teal-600" />
                All Alerts & Notifications
              </CardTitle>
              <CardDescription>Review and manage all system alerts</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-4 rounded-xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          alert.urgency === "High" ? "bg-red-50" : alert.urgency === "Medium" ? "bg-yellow-50" : "bg-gray-50"
                        )}>
                          {alert.type === "Critical Result" && <AlertCircle className={cn("h-5 w-5", alert.urgency === "High" ? "text-red-500" : "text-yellow-500")} />}
                          {alert.type === "Quality Check" && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                          {alert.type === "Equipment Alert" && <AlertCircle className="h-5 w-5 text-blue-500" />}
                          {alert.type === "Pending Review" && <Clock className="h-5 w-5 text-teal-500" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-gray-800">{alert.type}</h4>
                            <Badge className={urgencyColors[alert.urgency]}>{alert.urgency} Priority</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {alert.patientName !== "-" ? `Patient: ${alert.patientName} - ` : ""}{alert.testName}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">{alert.message}</p>
                          <p className="text-xs text-gray-400 mt-2">{alert.time}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">Review</Button>
                        <Button variant="outline" size="sm" className="border-teal-200 text-teal-600 hover:bg-teal-50">Dismiss</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800">Daily Report</CardTitle>
                <CardDescription>Generate daily test summary report</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label className="text-gray-700">Report Date</Label>
                    <Input type="date" className="rounded-lg" />
                  </div>
                  <div>
                    <Label className="text-gray-700">Report Type</Label>
                    <Select>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">Summary Report</SelectItem>
                        <SelectItem value="detailed">Detailed Report</SelectItem>
                        <SelectItem value="financial">Financial Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800">Performance Metrics</CardTitle>
                <CardDescription>Center performance statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm text-gray-600">Average Turnaround Time</span>
                    <span className="text-lg font-bold text-teal-600">3.4 hours</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm text-gray-600">Tests Completed Today</span>
                    <span className="text-lg font-bold text-teal-600">{completedCount}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm text-gray-600">Pending Tests</span>
                    <span className="text-lg font-bold text-yellow-600">{pendingCount}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm text-gray-600">On-Time Delivery Rate</span>
                    <span className="text-lg font-bold text-green-600">94%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Test Dialog */}
      <Dialog open={isAddingTest} onOpenChange={setIsAddingTest}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">New Test Order</DialogTitle>
            <DialogDescription>Create a new laboratory test order</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-gray-700">Patient Name</Label>
                <Input placeholder="Full name" className="rounded-lg" />
              </div>
              <div>
                <Label className="text-gray-700">Patient ID</Label>
                <Input placeholder="Patient ID" className="rounded-lg" />
              </div>
              <div>
                <Label className="text-gray-700">Test Name</Label>
                <Select>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select test" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cbc">Complete Blood Count</SelectItem>
                    <SelectItem value="lipid">Lipid Profile</SelectItem>
                    <SelectItem value="thyroid">Thyroid Panel</SelectItem>
                    <SelectItem value="liver">Liver Function Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-700">Category</Label>
                <Select>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hematology">Hematology</SelectItem>
                    <SelectItem value="biochemistry">Biochemistry</SelectItem>
                    <SelectItem value="endocrinology">Endocrinology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-700">Urgency</Label>
                <Select>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-700">Fee (ETB)</Label>
                <Input type="number" placeholder="0.00" className="rounded-lg" />
              </div>
            </div>
            <div>
              <Label className="text-gray-700">Notes / Instructions</Label>
              <Textarea placeholder="Any special notes or instructions for this test..." rows={3} className="rounded-lg" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingTest(false)}>Cancel</Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setIsAddingTest(false)}>Create Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}