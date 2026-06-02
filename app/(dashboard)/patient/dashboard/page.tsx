// app/patient/dashboard/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { appointmentService } from "@/services/appointment.service"
import {
  CalendarPlus,
  CreditCard,
  FileCheck,
  Clock,
  MapPin,
  ArrowRight,
  ChevronRight,
  Building2,
  FlaskConical,
  Stethoscope,
  Activity,
  Heart,

  Syringe,
  Pill,
  Sparkles,
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  Clipboard,
  User,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

const providerTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  doctor: Stethoscope,
  clinic: Building2,
  diagnostic: FlaskConical,
}

const statusColors: Record<string, string> = {
  "Pending": "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Ready": "bg-green-100 text-green-700",
  "Collected": "bg-gray-100 text-gray-700",
  "Confirmed": "bg-teal-100 text-teal-700",
}

export default function PatientDashboard() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [diagnosticResults] = useState([
    { id: 1, test: "Blood Work", date: "Oct 20, 2026", status: "Ready" },
    { id: 2, test: "X-Ray Chest", date: "Oct 18, 2026", status: "In Progress" },
    { id: 3, test: "MRI Scan", date: "Oct 15, 2026", status: "Pending" },
  ])
  const [recentActivities] = useState([
    { id: 1, action: "Booked appointment with Dr. Smith", date: "Oct 22, 2026", type: "appointment" },
    { id: 2, action: "Viewed lab results", date: "Oct 20, 2026", type: "result" },
    { id: 3, action: "Updated health profile", date: "Oct 18, 2026", type: "profile" },
  ])

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        const data = await appointmentService.listMyAppointments()
        // Transform API data to match UI expectations
        const transformedData = data.map((apt: any) => ({
          ...apt,
          providerName: 'Provider',
          specialty: 'General',
          date: apt.appointment_at ? new Date(apt.appointment_at).toLocaleDateString() : '',
          time: apt.appointment_at ? new Date(apt.appointment_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '',
          location: 'Location',
          queueNumber: null,
          providerType: 'doctor',
        }))
        setAppointments(transformedData)
      } catch (error) {
        console.error('Failed to fetch appointments:', error)
        setAppointments([])
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  const filteredAppointments = appointments.filter(apt =>
    apt.providerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const displayName = user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Patient'
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

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
              <span className="text-white/80 text-[20px] font-medium">Selam</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{displayName}</h2>
            <p className="text-teal-50 text-base">Welcome to your health dashboard</p>
          </div>
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-white" />
                </div>
                  <div>
                      <p className="text-xs font-semibold text-white/70 uppercase tracking-wide">Today's Date</p>
                      <p className="text-lg font-bold text-white">{currentDate}</p>
                   </div>
                 </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Appointments"
          value="12"
          description="3 upcoming"
          icon={CalendarPlus}
          trend="+2 this month"
          trendUp={true}
        />
        <StatCard
          title="Test Results"
          value="8"
          description="1 ready to view"
          icon={FileCheck}
          trend="2 new this week"
          trendUp={true}
        />
        <StatCard
          title="Active Cards"
          value="2"
          description="Valid check-in cards"
          icon={CreditCard}
          trend="1 expiring soon"
          trendUp={false}
        />
        <StatCard
          title="Health Score"
          value="92"
          description="Excellent"
          icon={Activity}
          trend="+5% from last month"
          trendUp={true}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Upcoming Appointments */}
        <Card className="lg:col-span-2 border shadow-sm overflow-hidden">
          <div className="bg-gray-50/50 px-6 py-4 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Upcoming Appointments</h3>
                <p className="text-sm text-gray-500 mt-1">Your scheduled appointments</p>
              </div>
              <div className="relative">
                <input 
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm w-64"
                  placeholder="Search appointments..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-3"></div>
                <p>Loading appointments...</p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredAppointments.map((apt) => {
                  const ProviderIcon = providerTypeIcons[apt.providerType] || Stethoscope
                  return (
                    <div
                      key={apt.id}
                      className="group bg-white rounded-xl border-2 border-gray-200 hover:border-teal-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                      <div className="p-5">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                          <div className="flex items-start gap-4 flex-1">
                            <Avatar className="h-16 w-16 rounded-xl shrink-0">
                              <AvatarFallback className="bg-teal-50 text-teal-600 text-xl font-bold">
                                <ProviderIcon className="h-6 w-6" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                <h4 className="font-bold text-gray-900 text-lg">{apt.providerName}</h4>
                                <Badge className={statusColors[apt.status]}>
                                  {apt.status}
                                </Badge>
                                {apt.queueNumber && (
                                  <Badge variant="outline" className="border-teal-300 text-teal-700 font-semibold">
                                    Queue #{apt.queueNumber}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                                <span className="flex items-center gap-1.5">
                                  <Stethoscope className="h-4 w-4 text-teal-600" />
                                  {apt.specialty}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Clock className="h-4 w-4 text-teal-600" />
                                  {apt.date} at {apt.time}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                                <span className="flex items-center gap-1.5">
                                  <MapPin className="h-4 w-4 text-teal-600" />
                                  {apt.location}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex lg:flex-col gap-2 shrink-0">
                            <Button variant="outline" size="sm" className="rounded-lg border-teal-300 text-teal-700 hover:bg-teal-50 font-medium">
                              View Details
                            </Button>
                          </div>
                        </div>

                        {/* Additional Info - Always visible */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1.5">
                              <Clipboard className="h-4 w-4 text-teal-600" />
                              <span className="font-medium">Type:</span> {apt.type}
                            </span>
                            <button className="text-teal-600 hover:text-teal-700 flex items-center gap-1.5 font-medium ml-auto">
                              <Phone className="h-4 w-4" />
                              Contact Provider
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {filteredAppointments.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <CalendarPlus className="h-12 w-12 mx-auto mb-3 opacity-50 text-teal-600" />
                    <p>No upcoming appointments found</p>
                    <Button variant="link" asChild className="text-teal-600">
                      <Link href="/patient/search">Book your first appointment</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Results */}
        <Card className="border shadow-sm overflow-hidden">
          <div className="bg-gray-50/50 px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Recent Results</h3>
                <p className="text-sm text-gray-500 mt-1">Diagnostic test status</p>
              </div>
              <Button variant="ghost" size="icon" asChild className="text-teal-600 hover:bg-teal-50">
                <Link href="/patient/results">
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              {diagnosticResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-800">{result.test}</p>
                    <p className="text-xs text-gray-500">{result.date}</p>
                  </div>
                  <Badge className={statusColors[result.status]}>
                    {result.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Health Profile Summary */}
        <Card className="border shadow-sm overflow-hidden">
          <div className="bg-gray-50/50 px-6 py-4 border-b">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Health Profile</h3>
              <p className="text-sm text-gray-500 mt-1">Your personal health information</p>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileItem 
                icon={Heart}
                label="Blood Type" 
                value="O+" 
              />
              <ProfileItem 
                icon={Syringe}
                label="Allergies" 
                value="Penicillin" 
              />
              <ProfileItem 
                icon={Activity}
                label="Chronic Conditions" 
                value="None recorded" 
              />
              <ProfileItem 
                icon={Pill}
                label="Current Medications" 
                value="None" 
              />
            </div>
            <div className="mt-6">
              <Button className="bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm hover:shadow transition-all">
                Update Health Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border shadow-sm overflow-hidden">
          <div className="bg-gray-50/50 px-6 py-4 border-b">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
              <p className="text-sm text-gray-500 mt-1">Your latest actions</p>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                    <Link href={`/patient/${activity.type}s`}>
                      View
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendUp,
}: {
  title: string
  value: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  trend: string
  trendUp: boolean
}) {
  return (
    <Card className="border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-teal-50 flex items-center justify-center">
            <Icon className="h-6 w-6 text-teal-600" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={cn(
            "text-xs font-semibold",
            trendUp ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
          )}>
            {trend}
            {trendUp && <TrendingUp className="ml-1 h-3 w-3" />}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

function ProfileItem({ 
  label, 
  value, 
  icon: Icon 
}: { 
  label: string; 
  value: string;
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-teal-50/30 transition-colors">
      <div className="h-8 w-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-teal-600" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-gray-800">{value}</p>
      </div>
    </div>
  )
}