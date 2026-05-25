"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  FileCheck, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Package,
  Info,
  Building2,
  Search,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  ShieldCheck,
  Droplets,
  Microscope,
  Activity,
  Pill,
  ArrowRight,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface DiagnosticResult {
  id: string
  testName: string
  provider: string
  providerAddress: string
  orderedDate: string
  status: "Pending" | "In Progress" | "Ready" | "Collected"
  notes: string
  icon?: string
}

const diagnosticResults: DiagnosticResult[] = [
  {
    id: "1",
    testName: "Complete Blood Count (CBC)",
    provider: "Addis Diagnostic Center",
    providerAddress: "Bole, Addis Ababa",
    orderedDate: "Oct 24, 2024",
    status: "Ready",
    notes: "Results ready for collection at the center",
    icon: "droplets"
  },
  {
    id: "2",
    testName: "Lipid Panel",
    provider: "Arsho Lab",
    providerAddress: "Kazanchis, Addis Ababa",
    orderedDate: "Oct 26, 2024",
    status: "In Progress",
    notes: "Expected completion by Oct 28, 2024",
    icon: "flask"
  },
  {
    id: "3",
    testName: "Chest X-Ray",
    provider: "Radiology Dept.",
    providerAddress: "Black Lion Hospital",
    orderedDate: "Oct 20, 2024",
    status: "Ready",
    notes: "Results ready for collection",
    icon: "activity"
  },
  {
    id: "4",
    testName: "Metabolic Panel",
    provider: "City Diagnostics",
    providerAddress: "Megenagna, Addis Ababa",
    orderedDate: "Oct 27, 2024",
    status: "Pending",
    notes: "Scheduled for Oct 29, 2024",
    icon: "pill"
  },
  {
    id: "5",
    testName: "Thyroid Function Test",
    provider: "Bethel Diagnostic Lab",
    providerAddress: "Kazanchis, Addis Ababa",
    orderedDate: "Oct 22, 2024",
    status: "Collected",
    notes: "Results collected on Oct 25, 2024",
    icon: "microscope"
  },
  {
    id: "6",
    testName: "HbA1c",
    provider: "Addis Diagnostic Center",
    providerAddress: "Bole, Addis Ababa",
    orderedDate: "Oct 18, 2024",
    status: "Collected",
    notes: "Results collected on Oct 21, 2024",
    icon: "droplets"
  },
]

const statusConfig: Record<string, {
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  description: string
}> = {
  "Pending": {
    icon: Clock,
    color: "text-[#6d7979]",
    bgColor: "bg-[#e5eeff] text-[#515f78]",
    description: "Test is scheduled and awaiting completion",
  },
  "In Progress": {
    icon: AlertCircle,
    color: "text-blue-600",
    bgColor: "bg-blue-50 text-blue-700",
    description: "Sample received and being processed at the center",
  },
  "Ready": {
    icon: CheckCircle,
    color: "text-[#006767]",
    bgColor: "bg-[#006767]/10 text-[#006767]",
    description: "Results are ready for physical collection at the diagnostic center",
  },
  "Collected": {
    icon: Package,
    color: "text-[#6d7979]",
    bgColor: "bg-[#d3e4fe] text-[#39475f]",
    description: "Results have been collected from the center",
  },
}

const getIconComponent = (iconName: string) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    droplets: Droplets,
    flask: FlaskConical,
    activity: Activity,
    pill: Pill,
    microscope: Microscope,
  }
  return icons[iconName] || FlaskConical
}

export default function DiagnosticResultsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  
  const pendingCount = diagnosticResults.filter(r => r.status === "Pending").length
  const inProgressCount = diagnosticResults.filter(r => r.status === "In Progress").length
  const readyCount = diagnosticResults.filter(r => r.status === "Ready").length
  const collectedCount = diagnosticResults.filter(r => r.status === "Collected").length

  const getFilteredResults = () => {
    let filtered = diagnosticResults
    
    if (activeTab !== "all") {
      const statusMap: Record<string, string> = {
        "pending": "Pending",
        "in-progress": "In Progress",
        "ready": "Ready",
        "collected": "Collected"
      }
      filtered = filtered.filter(r => r.status === statusMap[activeTab])
    }
    
    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.provider.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    return filtered
  }

  const filteredResults = getFilteredResults()

  return (
    <div className="min-h-screen bg-[#f8f9ff] pb-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-[32px] font-bold text-[#0b1c30] tracking-tight">Diagnostic Results</h1>
          <p className="text-sm md:text-base text-[#6d7979] mt-1">View and track your laboratory and diagnostic reports</p>
        </div>

        {/* Stats Overview - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-6 md:mb-8">
          {/* Active Orders Card - spans 2 columns */}
          <div className="md:col-span-2 bg-white rounded-2xl p-5 md:p-6 border border-[#bcc9c8]/20 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#006767]/10 flex items-center justify-center">
                  <FlaskConical className="h-5 w-5 text-[#006767]" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#0b1c30]">Active Lab Orders</h3>
              </div>
              <p className="text-sm text-[#6d7979] max-w-md">
                You have {pendingCount + inProgressCount} pending reports. Notifications will be sent once the results are ready.
              </p>
            </div>
            <div className="absolute -right-6 -bottom-6 opacity-5">
              <FlaskConical className="h-40 w-40" />
            </div>
          </div>

          {/* Total Results Card */}
          <div className="bg-[#008282] rounded-2xl p-5 md:p-6 text-white shadow-sm">
            <div className="flex flex-col h-full">
              <ShieldCheck className="h-7 w-7 md:h-8 md:w-8 mb-3 md:mb-4 opacity-80" />
              <div className="text-3xl md:text-4xl font-bold mb-1">{diagnosticResults.length}</div>
              <div className="text-[10px] md:text-xs font-semibold uppercase tracking-wider opacity-80">Total Results</div>
            </div>
          </div>
        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <StatCard 
            title="Pending" 
            count={pendingCount} 
            icon={Clock}
            color="text-[#6d7979]"
            bgColor="bg-[#e5eeff]"
          />
          <StatCard 
            title="In Progress" 
            count={inProgressCount} 
            icon={AlertCircle}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard 
            title="Ready for Collection" 
            count={readyCount} 
            icon={CheckCircle}
            color="text-[#006767]"
            bgColor="bg-[#006767]/10"
          />
          <StatCard 
            title="Collected" 
            count={collectedCount} 
            icon={Package}
            color="text-[#6d7979]"
            bgColor="bg-[#d3e4fe]"
          />
        </div>

        {/* Main Results Card */}
        <div className="bg-white rounded-2xl border border-[#bcc9c8]/20 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="px-4 md:px-6 pt-5 md:pt-6 pb-3 md:pb-4 border-b border-[#bcc9c8]/20">
            <h3 className="text-lg md:text-xl font-bold text-[#0b1c30] mb-1">Test Status</h3>
            <p className="text-xs md:text-sm text-[#6d7979]">
              Monitor the status of your diagnostic tests. Results are available for physical collection only.
            </p>
          </div>

          {/* Tabs and Search */}
          <div className="px-4 md:px-6 pt-4 pb-3 border-b border-[#bcc9c8]/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap items-center gap-2 bg-[#eff4ff] rounded-xl p-1">
              <TabButton active={activeTab === "all"} onClick={() => setActiveTab("all")}>
                All
              </TabButton>
              <TabButton active={activeTab === "pending"} onClick={() => setActiveTab("pending")}>
                Pending
              </TabButton>
              <TabButton active={activeTab === "in-progress"} onClick={() => setActiveTab("in-progress")}>
                In Progress
              </TabButton>
              <TabButton active={activeTab === "ready"} onClick={() => setActiveTab("ready")}>
                Ready
              </TabButton>
              <TabButton active={activeTab === "collected"} onClick={() => setActiveTab("collected")}>
                Collected
              </TabButton>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6d7979]" />
              <Input
                placeholder="Search by test name or provider..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-2 bg-[#f8fafc] border-[#bcc9c8]/30 rounded-xl focus:ring-2 focus:ring-[#006767]/20 text-sm"
              />
            </div>
          </div>

          {/* Results Table - No Action Column */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#eff4ff]/50 border-b border-[#bcc9c8]/20">
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-semibold text-[#6d7979] uppercase tracking-wider">Test Name</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-semibold text-[#6d7979] uppercase tracking-wider">Provider</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-semibold text-[#6d7979] uppercase tracking-wider">Date</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-semibold text-[#6d7979] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bcc9c8]/10">
                {filteredResults.map((result) => {
                  const config = statusConfig[result.status]
                  const StatusIcon = config.icon
                  const ItemIcon = getIconComponent(result.icon || "flask")
                  
                  return (
                    <tr key={result.id} className="hover:bg-[#f8f9ff] transition-colors group">
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#006767]/10 flex items-center justify-center">
                            <ItemIcon className="h-4 w-4 md:h-5 md:w-5 text-[#006767]" />
                          </div>
                          <span className="font-semibold text-[#0b1c30] text-sm md:text-base">{result.testName}</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div>
                          <p className="font-medium text-[#0b1c30] text-sm md:text-base">{result.provider}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Building2 className="h-3 w-3 text-[#6d7979]" />
                            <span className="text-[10px] md:text-xs text-[#6d7979]">{result.providerAddress}</span>
                          </div>
                        </div>
                       </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 md:h-3.5 md:w-3.5 text-[#6d7979]" />
                          <span className="text-[#6d7979] text-xs md:text-sm">{result.orderedDate}</span>
                        </div>
                       </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold whitespace-nowrap",
                          config.bgColor
                        )}>
                          <StatusIcon className="h-3 w-3" />
                          {result.status}
                        </span>
                       </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredResults.length === 0 && (
            <div className="text-center py-12">
              <FileCheck className="h-12 w-12 mx-auto mb-3 text-[#6d7979] opacity-50" />
              <p className="text-[#6d7979]">No results found</p>
              <Button variant="link" asChild className="mt-2 text-[#006767]">
                <Link href="/patient/bookings">Book a diagnostic test</Link>
              </Button>
            </div>
          )}

          {/* Pagination */}
          {filteredResults.length > 0 && (
            <div className="px-4 md:px-6 py-3 md:py-4 bg-[#eff4ff]/30 border-t border-[#bcc9c8]/20 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-xs md:text-sm text-[#6d7979]">
                Showing {filteredResults.length} of {diagnosticResults.length} results
              </span>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg border border-[#bcc9c8]/30 hover:bg-white disabled:opacity-50 transition-all" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="p-2 rounded-lg border border-[#bcc9c8]/30 hover:bg-white transition-all">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Important Information Card */}
        <div className="mt-5 md:mt-6 bg-[#006767]/5 rounded-2xl border border-[#006767]/20 p-4 md:p-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#006767]/10 flex items-center justify-center flex-shrink-0">
              <Info className="h-4 w-4 md:h-5 md:w-5 text-[#006767]" />
            </div>
            <div>
              <h4 className="font-bold text-[#0b1c30] mb-2 text-sm md:text-base">How to Get Your Results</h4>
              <div className="space-y-2 text-xs md:text-sm text-[#515f78]">
                <p>Results are only available for physical collection at the diagnostic center.</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>When status shows <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#006767]/10 text-[#006767] text-xs font-semibold">Ready</span>, visit the diagnostic center to collect your results</li>
                  <li>Bring your ID and appointment card number for verification</li>
                  <li>Results cannot be viewed or downloaded online for security and privacy reasons</li>
                  <li>You will receive an SMS/Email notification when your results are ready</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Components
function StatCard({ title, count, icon: Icon, color, bgColor }: { 
  title: string
  count: number
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
}) {
  return (
    <div className="bg-white rounded-xl p-3 md:p-4 border border-[#bcc9c8]/20 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9px] md:text-xs font-semibold text-[#6d7979] uppercase tracking-wider">{title}</p>
          <p className="text-xl md:text-2xl font-bold text-[#0b1c30] mt-1">{count}</p>
        </div>
        <div className={cn("p-1.5 md:p-2 rounded-xl", bgColor)}>
          <Icon className={cn("h-4 w-4 md:h-5 md:w-5", color)} />
        </div>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, children }: { 
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap",
        active 
          ? "bg-white shadow-sm text-[#006767]" 
          : "text-[#515f78] hover:bg-[#d6e3ff]/50"
      )}
    >
      {children}
    </button>
  )
}