// app/patient/dashboard/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
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
  User as UserIcon,
  Settings,
  LogOut,
  Bell
} from "lucide-react"

const upcomingAppointments = [
  {
    id: "1",
    providerName: "Dr. Sara Tesfaye",
    providerType: "doctor",
    specialty: "Cardiologist",
    date: "May 15, 2026",
    time: "10:00 AM",
    location: "Black Lion Hospital, Addis Ababa",
    type: "Consultation",
    status: "Confirmed",
    cardNumber: "4512-7893-1023-6745"
  },
  {
    id: "2",
    providerName: "Addis Diagnostic Center",
    providerType: "diagnostic",
    specialty: "Laboratory",
    date: "May 18, 2026",
    time: "8:30 AM",
    location: "Bole, Addis Ababa",
    type: "Blood Test",
    status: "Confirmed",
    cardNumber: "8923-4567-1234-9876"
  },
]

const diagnosticResults = [
  { id: "1", test: "Complete Blood Count", date: "May 5, 2026", status: "Ready" },
  { id: "2", test: "Lipid Panel", date: "May 5, 2026", status: "In Progress" },
  { id: "3", test: "Thyroid Function", date: "May 3, 2026", status: "Collected" },
]

const recentActivities = [
  { id: "1", action: "Booked appointment with Dr. Sara", date: "May 10, 2026", type: "appointment" },
  { id: "2", action: "Viewed test results", date: "May 8, 2026", type: "result" },
  { id: "3", action: "Updated health profile", date: "May 5, 2026", type: "profile" },
]

const statusColors: Record<string, string> = {
  "Pending": "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Ready": "bg-green-100 text-green-700",
  "Collected": "bg-gray-100 text-gray-700",
  "Confirmed": "bg-green-100 text-green-700",
}

const providerTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  doctor: Stethoscope,
  clinic: Building2,
  diagnostic: FlaskConical,
}

export default function PatientDashboard() {
  const [notifications] = useState(3)

  return (
    <div className="space-y-8">
      {/* Header with Welcome and Profile */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Sarah!</h1>
          <p className="text-muted-foreground">Here's an overview of your health activities</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Appointments"
          value="12"
          description="2 upcoming"
          icon={CalendarPlus}
          trend="+2 this month"
        />
        <StatCard
          title="Test Results"
          value="8"
          description="3 ready to view"
          icon={FileCheck}
          trend="2 new this week"
        />
        <StatCard
          title="Active Cards"
          value="4"
          description="Valid check-in cards"
          icon={CreditCard}
          trend="2 expiring soon"
        />
        <StatCard
          title="Health Score"
          value="92"
          description="Excellent"
          icon={Activity}
          trend="+5% from last month"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Upcoming Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled appointments</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/patient/appointments">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.map((apt) => {
              const ProviderIcon = providerTypeIcons[apt.providerType] || Stethoscope
              return (
                <div
                  key={apt.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-all"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      <ProviderIcon className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="font-medium">{apt.providerName}</span>
                      <Badge variant="secondary" className={statusColors[apt.status]}>
                        {apt.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{apt.specialty} • {apt.type}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {apt.date} at {apt.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {apt.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/patient/card-number?appointment=${apt.id}`}>
                        View Card
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
            {upcomingAppointments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarPlus className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming appointments</p>
                <Button variant="link" asChild>
                  <Link href="/patient/search">Book your first appointment</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Results */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Results</CardTitle>
              <CardDescription>Diagnostic test status</CardDescription>
            </div>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/patient/results">
                <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {diagnosticResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{result.test}</p>
                    <p className="text-xs text-muted-foreground">{result.date}</p>
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
        <Card>
          <CardHeader>
            <CardTitle>Health Profile</CardTitle>
            <CardDescription>Your personal health information</CardDescription>
          </CardHeader>
          <CardContent>
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
              <Button variant="outline" asChild>
                <Link href="/patient/profile">
                  Update Health Profile
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
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
}: {
  title: string
  value: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  trend: string
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="mt-4">
          <Badge variant="secondary" className="text-xs">
            {trend}
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
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}