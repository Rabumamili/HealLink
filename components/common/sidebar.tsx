// components/common/sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  Users,
  Clock,
  UserPlus,
  BarChart3,
  Building2,
  ClipboardList,
  CreditCard,
  FileText,
  Star,
  Stethoscope,
  FlaskRound as Flask,
  X,
  FlaskConical,
  CheckCircle,
  Settings,
  User,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

interface SidebarItem {
  name: string
  href: string
  icon: React.ElementType
}

interface CommonSidebarProps {
  role: "doctor" | "clinic" | "diagnosticCenter" | "patient" | "staff"
  isMobile: boolean
  isOpen: boolean
  portalName: string
  portalSubtitle: string
  onCloseMobile?: () => void
}

const getSidebarItems = (role: string): SidebarItem[] => {
  const items: Record<string, SidebarItem[]> = {
    doctor: [
      { name: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
      { name: "Services", href: "/doctor/services", icon: Stethoscope },
      { name: "Appointments", href: "/doctor/appointments", icon: Calendar },
      { name: "Schedule", href: "/doctor/schedule", icon: Clock },
      { name: "Check-in", href: "/doctor/checkin", icon: UserPlus },
      { name: "Staff", href: "/doctor/staff", icon: Users },
      { name: "Analytics", href: "/doctor/analytics", icon: BarChart3 },
      { name: "Reviews", href: "/doctor/reviews", icon: Star },
    ],
    clinic: [
      { name: "Dashboard", href: "/clinic/dashboard", icon: LayoutDashboard },
      { name: "Services", href: "/clinic/services", icon: Building2 },
      { name: "Appointments", href: "/clinic/appointments", icon: Calendar },
      { name: "Schedule", href: "/clinic/schedule", icon: Clock },
      { name: "Check-in", href: "/clinic/checkin", icon: UserPlus },
      { name: "Staff", href: "/clinic/staff", icon: Users },
      { name: "Analytics", href: "/clinic/analytics", icon: BarChart3 },
      { name: "Reviews", href: "/clinic/reviews", icon: Star },
    ],
    diagnosticCenter: [
      { name: "Dashboard", href: "/diagnosticCenter/dashboard", icon: LayoutDashboard },
      { name: "Appointments", href: "/diagnosticCenter/appointments", icon: Calendar },
      { name: "Tests", href: "/diagnosticCenter/services", icon: Flask },
      { name: "Schedule", href: "/diagnosticCenter/schedule", icon: Clock },
      { name: "Check-in", href: "/diagnosticCenter/checkin", icon: UserPlus },
      { name: "Staff", href: "/diagnosticCenter/staff", icon: Users },
      { name: "Analytics", href: "/diagnosticCenter/analytics", icon: BarChart3 },
      { name: "Reviews", href: "/diagnosticCenter/reviews", icon: Star },
    ],
    patient: [
      { name: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
      { name: "Appointments", href: "/patient/appointments", icon: Calendar },
      { name: "Book", href: "/patient/bookings", icon: ClipboardList },
      { name: "Cards", href: "/patient/card-numbers", icon: CreditCard },
      { name: "Results", href: "/patient/results", icon: FileText },
      { name: "Payments", href: "/patient/payments", icon: CreditCard },
      { name: "Reviews", href: "/patient/reviews", icon: Star },
    ],
    staff: [
      { name: "Dashboard", href: "/staff/dashboard", icon: LayoutDashboard },
      { name: "Patient Check-in", href: "/staff/checkin", icon: UserPlus },
      { name: "Diagnostic Results", href: "/staff/results", icon: FlaskConical },
      { name: "Profile", href: "/staff/profile", icon: User },
    ],
  }

  return items[role] || []
}

export function CommonSidebar({
  role,
  isMobile,
  isOpen,
  portalName,
  portalSubtitle,
  onCloseMobile,
}: CommonSidebarProps) {
  const pathname = usePathname()
  const items = getSidebarItems(role)

  // Determine width classes based on open state and device
  const widthClass = isOpen ? "w-50" : "w-20"

  return (
    <aside
      className={cn(
        "h-full bg-white border-r shadow-sm flex flex-col transition-all duration-300",
        widthClass
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between border-b px-4 shrink-0">
        {isOpen ? (
          <>
            <div>
              <h1 className="font-bold text-[18px] text-teal-600">{portalName}</h1>
              <p className="text-[14px] text-gray-500">{portalSubtitle}</p>
            </div>
            {isMobile && onCloseMobile && (
              <Button variant="ghost" size="icon" onClick={onCloseMobile} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            )}
          </>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
              {portalName.charAt(0)}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href

          if (!isOpen) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    onClick={isMobile && onCloseMobile ? onCloseMobile : undefined}
                    className={cn(
                      "flex justify-center items-center h-12 w-12 mx-auto mb-2 rounded-lg transition-colors",
                      active
                        ? "bg-teal-50 text-teal-600"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.name}</TooltipContent>
              </Tooltip>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile && onCloseMobile ? onCloseMobile : undefined}
              className={cn(
                "flex items-center gap-3 px-4 py-2 mx-2 rounded-lg mb-1 transition-colors",
                active
                  ? "bg-teal-50 text-teal-600"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium truncate">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Optional Footer for user info when open on mobile */}
      {isOpen && isMobile && (
        <div className="p-4 border-t mt-auto">
          <div className="text-xs text-gray-500">
            <p>v1.0.0</p>
          </div>
        </div>
      )}
    </aside>
  )
}