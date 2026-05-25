// components/common/sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import {
  LayoutDashboard,
  CalendarCheck,
  TrendingUp,
  User,
  UsersRound,
  LogOut,
  X,
  Stethoscope,
  UserCheck,
  Building2,
  Settings,
  Menu,
  Calendar,
  CalendarPlus,
  CreditCard,
  FileCheck,
  Star,
  Activity,
  FlaskConical,
  Clock,
} from "lucide-react"

// Menu configuration for different roles
const menuConfig = {
  doctor: [
    { title: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
    { title: "My Services", href: "/doctor/services", icon: Stethoscope },
    { title: "Appointments", href: "/doctor/appointments", icon: CalendarCheck },
    { title: "Schedule", href: "/doctor/schedule", icon: CalendarCheck },
    { title: "Patient Check-in", href: "/doctor/checkin", icon: UserCheck },
    { title: "Staff", href: "/doctor/staff", icon: UsersRound },
    { title: "Analytics", href: "/doctor/analytics", icon: TrendingUp },
  ],
  clinicAdmin: [
    { title: "Dashboard", href: "/clinicAdmin/dashboard", icon: LayoutDashboard },
    { title: "Appointments", href: "/clinicAdmin/appointments", icon: CalendarCheck },
    { title: "Services", href: "/clinicAdmin/services", icon: Stethoscope },
    { title: "Patient Check-in", href: "/clinicAdmin/checkin", icon: UserCheck },
    { title: "Schedule Management", href: "/clinicAdmin/schedule", icon: Clock },
    { title: "Staff Management", href: "/clinicAdmin/staff", icon: UsersRound },
    { title: "Analytics", href: "/clinicAdmin/analytics", icon: TrendingUp },
    
  ],
  diagnosticCenter: [
    { title: "Dashboard", href: "/diagnosticCenter/dashboard", icon: LayoutDashboard },
    { title: "Appointments", href: "/diagnosticCenter/appointments", icon: CalendarCheck },
    { title: "Test Services", href: "/diagnosticCenter/services", icon: FlaskConical },
    { title: "Patient Check-in", href: "/diagnosticCenter/checkin", icon: UserCheck },
    { title: "Schedule Management", href: "/diagnosticCenter/schedule", icon: Clock },
    { title: "Staff Management", href: "/diagnosticCenter/staff", icon: UsersRound },
    { title: "Analytics", href: "/diagnosticCenter/analytics", icon: TrendingUp },
   
  ],
  patient: [
    { title: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
    { title: "My Appointments", href: "/patient/appointments", icon: Calendar },
    { title: "Book Appointment", href: "/patient/bookings", icon: CalendarPlus },
    { title: "Card Numbers", href: "/patient/card-numbers", icon: CreditCard },
    { title: "Test Results", href: "/patient/results", icon: FileCheck },
    { title: "Payments", href: "/patient/payments", icon: CreditCard },
    { title: "Reviews", href: "/patient/reviews", icon: Star },
   
  ],
}

// Color configurations for different roles
const roleColors = {
  doctor: {
    primary: "teal",
    primaryHex: "#0d9488",
    bgLight: "bg-teal-50",
    text: "text-teal-600",
    hover: "hover:bg-teal-50",
    active: "bg-teal-50 text-teal-600",
  },
  clinicAdmin: {
    primary: "teal",
    primaryHex: "#0d9488",
    bgLight: "bg-teal-50",
    text: "text-teal-600",
    hover: "hover:bg-teal-50",
    active: "bg-teal-50 text-teal-600",
  },
  diagnosticCenter: {
    primary: "primary",
    primaryHex: "#006767",
    bgLight: "bg-primary/10",
    text: "text-primary",
    hover: "hover:bg-primary/5",
    active: "bg-primary/10 text-primary",
  },
  patient: {
    primary: "primary",
    primaryHex: "#006767",
    bgLight: "bg-primary/10",
    text: "text-primary",
    hover: "hover:bg-primary/5",
    active: "bg-primary/10 text-primary",
  },
}

interface SidebarProps {
  role: "doctor" | "clinicAdmin" | "diagnosticCenter" | "patient"
  isMobile: boolean
  isHovered?: boolean
  onHoverChange?: (hovered: boolean) => void
  portalName: string
  portalSubtitle: string
}

export function CommonSidebar({
  role,
  isMobile,
  isHovered = false,
  onHoverChange,
  portalName,
  portalSubtitle,
}: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuItems = menuConfig[role]
  const colors = roleColors[role]

  const handleMouseEnter = () => {
    if (!isMobile) {
      onHoverChange?.(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile) {
      onHoverChange?.(false)
    }
  }

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMobileClose = () => {
    setMobileOpen(false)
  }

  const sidebarWidth = !isMobile ? (isHovered ? "w-64" : "w-16") : "w-64"
  const isOpen = !isMobile ? true : mobileOpen

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div
          onClick={handleMobileClose}
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        />
      )}

      {/* Mobile Menu Button */}
      {isMobile && !mobileOpen && (
        <button
          onClick={handleMobileToggle}
          className="fixed top-4 left-4 z-50 bg-white rounded-lg p-2 shadow-md hover:shadow-lg transition-all"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
      )}

      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "fixed top-0 left-0 h-full bg-white border-r z-50 flex flex-col transition-all duration-300 ease-in-out shadow-lg",
          sidebarWidth,
          isMobile && !mobileOpen && "-translate-x-full",
          isMobile && mobileOpen && "translate-x-0",
          !isMobile && "translate-x-0"
        )}
      >
        {/* Collapsed sidebar indicator dots */}
        {!isMobile && !isHovered && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 flex flex-col gap-2">
            {menuItems.map((item, idx) => (
              <div key={idx} className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            ))}
          </div>
        )}

        {/* Mobile Close Button */}
        {isMobile && mobileOpen && (
          <div className="flex justify-end p-2 border-b">
            <Button size="icon" variant="ghost" onClick={handleMobileClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className={cn(
          "border-b transition-all duration-300",
          !isMobile && !isHovered ? "p-4" : "p-6"
        )}>
          <Link href={`/${role}/dashboard`} onClick={handleMobileClose}>
            <h1 className="font-bold">
              <span className="text-2xl">
                <span className={colors.text}>Heal</span>
                <span className="text-gray-800">Link</span>
              </span>
              {((!isMobile && isHovered) || isMobile) && (
                <span className={cn("text-xs block font-normal mt-1", colors.text)}>
                  {portalName}
                </span>
              )}
            </h1>
          </Link>
          {((!isMobile && isHovered) || isMobile) && (
            <p className="text-xs text-muted-foreground mt-1">{portalSubtitle}</p>
          )}
        </div>

        <nav className="flex-1 p-2 overflow-y-auto">
          {menuItems.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/")
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleMobileClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg transition-colors my-1",
                  (!isMobile && !isHovered) ? "justify-center py-3" : "justify-start px-4 py-3",
                  active ? colors.active : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", active && colors.text)} />
                {((!isMobile && isHovered) || isMobile) && (
                  <span className="whitespace-nowrap">{item.title}</span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t">
          <Link
            href="/login"
            onClick={handleMobileClose}
            className={cn(
              "flex items-center gap-3 text-red-500 hover:text-red-600 transition-colors rounded-lg",
              (!isMobile && !isHovered) ? "justify-center" : "justify-start"
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {((!isMobile && isHovered) || isMobile) && <span>Logout</span>}
          </Link>
        </div>
      </aside>
    </>
  )
}