// components/common/sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  Users,
  Activity,
  Settings,
  UserCircle,
  Building2,
  ClipboardList,
  FileText,
  CreditCard,
  Star,
  Clock,
  UserPlus,
  BarChart3,
  Stethoscope,
  FlaskRound as Flask,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarItem {
  name: string
  href: string
  icon: React.ElementType
}

interface CommonSidebarProps {
  role: "doctor" | "clinicAdmin" | "diagnosticCenter" | "patient"
  isMobile: boolean
  isHovered: boolean
  onHoverChange: (hovered: boolean) => void
  portalName: string
  portalSubtitle: string
}

const getSidebarItems = (role: string): SidebarItem[] => {
  const items: Record<string, SidebarItem[]> = {
    doctor: [
      { name: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
      { name: "My Services", href: "/doctor/services", icon: Stethoscope },
      { name: "Appointments", href: "/doctor/appointments", icon: Calendar },
      { name: "Schedule", href: "/doctor/schedule", icon: Clock },
      { name: "Patient Check-in", href: "/doctor/checkin", icon: UserPlus },
      { name: "Staff", href: "/doctor/staff", icon: Users },
      { name: "Analytics", href: "/doctor/analytics", icon: BarChart3 }
    ],
    clinicAdmin: [
      { name: "Dashboard", href: "/clinicAdmin/dashboard", icon: LayoutDashboard },
      { name: "My Services", href: "/clinicAdmin/services", icon: Building2 },
      { name: "Appointments", href: "/clinicAdmin/appointments", icon: Calendar },
      { name: "Schedule", href: "/clinicAdmin/schedule", icon: Clock },
      { name: "Patient Check-in", href: "/clinicAdmin/checkin", icon: UserPlus },
      { name: "Staff", href: "/clinicAdmin/staff", icon: Users },
      { name: "Analytics", href: "/clinicAdmin/analytics", icon: BarChart3 },
    ],
    diagnosticCenter: [
      { name: "Dashboard", href: "/diagnosticCenterAdmin/dashboard", icon: LayoutDashboard },
      { name: "Appointments", href: "/diagnosticCenterAdmin/appointments", icon: Calendar },
      { name: "Test Services", href: "/diagnosticCenterAdmin/services", icon: Flask },
      { name: "Schedule", href: "/diagnosticCenterAdmin/schedule", icon: Clock },
      { name: "Patient Check-in", href: "/diagnosticCenterAdmin/checkin", icon: UserPlus },
      { name: "Staff", href: "/diagnosticCenterAdmin/staff", icon: Users },
      { name: "Analytics", href: "/diagnosticCenterAdmin/analytics", icon: BarChart3 },
    ],
    patient: [
      { name: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
      { name: "My Appointments", href: "/patient/appointments", icon: Calendar },
      { name: "Book Appointment", href: "/patient/bookings", icon: ClipboardList },
      { name: "Card Numbers", href: "/patient/card-numbers", icon: CreditCard },
      { name: "Test Results", href: "/patient/results", icon: FileText },
      { name: "Payments", href: "/patient/payments", icon: CreditCard },
      { name: "Reviews", href: "/patient/reviews", icon: Star },
    ],
  }
  return items[role] || []
}

export function CommonSidebar({
  role,
  isMobile,
  isHovered,
  onHoverChange,
  portalName,
  portalSubtitle,
}: CommonSidebarProps) {
  const pathname = usePathname()
  const sidebarItems = getSidebarItems(role)

  if (isMobile) {
    return (
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-lg transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-teal-600">{portalName}</h1>
            <p className="text-xs text-gray-500">{portalSubtitle}</p>
          </div>
          <nav className="flex-1 overflow-y-auto p-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-colors",
                    isActive
                      ? "bg-teal-50 text-teal-600"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="h-5 w-5" strokeWidth={1.5} />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full bg-white border-r shadow-sm transition-all duration-300 z-40",
        isHovered ? "w-64" : "w-20"
      )}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className={cn(
          "h-16 flex items-center border-b",
          isHovered ? "px-4 justify-start" : "justify-center"
        )}>
          {isHovered ? (
            <div>
              <h1 className="font-bold text-teal-600 text-lg">{portalName}</h1>
              <p className="text-xs text-gray-500">{portalSubtitle}</p>
            </div>
          ) : (
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-base">H</span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            if (!isHovered) {
              return (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-center mx-auto w-12 h-12 mb-2 rounded-lg transition-colors",
                        isActive
                          ? "bg-teal-50 text-teal-600"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <Icon className="h-6 w-6" strokeWidth={1.5} />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="ml-2">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg mb-1 transition-colors",
                  isActive
                    ? "bg-teal-50 text-teal-600"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}