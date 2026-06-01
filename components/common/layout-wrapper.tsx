// components/layout/LayoutWrapper.tsx
"use client"

import { useEffect, useState } from "react"
import { CommonSidebar } from "@/components/common/sidebar"
import { CommonTopHeader } from "@/components/common/top-header"
import { TooltipProvider } from "@/components/ui/tooltip"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { NotificationBellBadge } from "@/components/notifications/NotificationBellBadge"
import { useNotificationStore } from "@/stores/slices/notificationSlice"
import { useAuth } from "@/hooks/useAuth"
import { AuthUser } from "@/types/entities/auth.types"

function getUserDisplayFromAuth(user: AuthUser) {
  const userName =
    user.full_name ||
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    user.email

  const userInitials = userName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return {
    userName,
    userEmail: user.email,
    userInitials,
  }
}

interface LayoutWrapperProps {
  children: React.ReactNode
  role: "doctor" | "clinic" | "diagnosticCenter" | "patient" | "staff"
  portalName: string
  portalSubtitle: string
  titleColor?: string
  searchPlaceholder?: string
  userInitials?: string
  userName?: string
  userEmail?: string
}

const getPageTitle = (pathname: string, role: string): string => {
  const routes: Record<string, Record<string, string>> = {
    doctor: {
      "/doctor/dashboard": "Dashboard",
      "/doctor/services": "My Services",
      "/doctor/appointments": "Appointments",
      "/doctor/schedule": "Schedule",
      "/doctor/checkin": "Check-in",
      "/doctor/staff": "Staff",
      "/doctor/analytics": "Analytics",
      "/doctor/reviews": "Reviews",
      "/doctor/notifications": "Notifications",
    },
    clinic: {
      "/clinic/dashboard": "Dashboard",
      "/clinic/services": "Services",
      "/clinic/appointments": "Appointments",
      "/clinic/schedule": "Schedule",
      "/clinic/checkin": "Check-in",
      "/clinic/staff": "Staff",
      "/clinic/analytics": "Analytics",
      "/clinic/reviews": "Reviews",
      "/clinic/notifications": "Notifications",
    },
    diagnosticCenter: {
      "/diagnosticCenter/dashboard": "Dashboard",
      "/diagnosticCenter/appointments": "Appointments",
      "/diagnosticCenter/services": "Tests",
      "/diagnosticCenter/schedule": "Schedule",
      "/diagnosticCenter/checkin": "Check-in",
      "/diagnosticCenter/staff": "Staff",
      "/diagnosticCenter/analytics": "Analytics",
      "/diagnosticCenter/reviews": "Reviews",
      "/diagnosticCenter/notifications": "Notifications",
    },
    patient: {
      "/patient/dashboard": "Dashboard",
      "/patient/appointments": "Appointments",
      "/patient/bookings": "Book Appointment",
      "/patient/card-numbers": "Cards",
      "/patient/results": "Results",
      "/patient/payments": "Payments",
      "/patient/reviews": "Reviews",
      "/patient/notifications": "Notifications",
    },
    staff: {
      "/staff/dashboard": "Dashboard",
      "/staff/checkin": "Patient Check-in",
      "/staff/results": "Diagnostic Results",
      "/staff/profile": "Profile",
      "/staff/notifications": "Notifications",
    },
  }

  return routes[role]?.[pathname] || "Dashboard"
}

export function LayoutWrapper({
  children,
  role,
  portalName,
  portalSubtitle,
  titleColor = "text-teal-600",
  searchPlaceholder = "Search...",
  userInitials = "JD",
  userName = "User",
  userEmail = "user@heallink.com",
}: LayoutWrapperProps) {
  const { user } = useAuth()
  const authDisplay = user ? getUserDisplayFromAuth(user) : null
  const displayName = authDisplay?.userName ?? userName
  const displayEmail = authDisplay?.userEmail ?? userEmail
  const displayInitials = authDisplay?.userInitials ?? userInitials

  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const pathname = usePathname()
  const unreadCount = useNotificationStore((state) => state.unreadCount)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      if (width >= 1024) {
        setIsMobileMenuOpen(false)
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const toggleSidebar = () => {
    if (isMobile || isTablet) {
      setIsMobileMenuOpen(!isMobileMenuOpen)
    } else {
      setIsSidebarOpen((prev) => !prev)
    }
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const pageTitle = getPageTitle(pathname, role)
  const isDashboard = pathname === `/${role}/dashboard`
  const isResponsive = isMobile || isTablet

  // For mobile/tablet: show sidebar as overlay menu
  const showSidebarAsOverlay = isResponsive && isMobileMenuOpen
  // For desktop: show sidebar normally
  const showSidebarInline = !isResponsive && isSidebarOpen

  return (
    <TooltipProvider>
      <NotificationBellBadge layoutRole={role} />
      <div className="min-h-screen bg-gray-50">
        {/* Mobile/Tablet Menu Button - Fixed on top left when sidebar is hidden */}
        {(isResponsive && !isMobileMenuOpen) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="fixed top-3 left-3 z-50 lg:hidden bg-white shadow-md rounded-md h-10 w-10"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Mobile/Tablet Overlay */}
        {showSidebarAsOverlay && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeMobileMenu}
          />
        )}

        {/* Sidebar - Desktop inline or Mobile overlay */}
        <div
          className={cn(
            "transition-all duration-300",
            showSidebarAsOverlay
              ? "fixed inset-y-0 left-0 z-50 w-64"
              : showSidebarInline
              ? "fixed left-0 top-0 h-full z-40 w-64"
              : "hidden lg:block fixed left-0 top-0 h-full z-40 w-20"
          )}
        >
          <CommonSidebar
            role={role}
            isMobile={isResponsive}
            isOpen={showSidebarAsOverlay || showSidebarInline}
            portalName={portalName}
            portalSubtitle={portalSubtitle}
            onCloseMobile={closeMobileMenu}
          />
        </div>

        <CommonTopHeader
          title={!isDashboard ? pageTitle : ""}
          isMobile={isResponsive}
          titleColor={titleColor}
          showSearch={isDashboard}
          searchPlaceholder={searchPlaceholder}
          isSidebarOpen={showSidebarInline}
          onSidebarToggle={toggleSidebar}
          userInitials={displayInitials}
          userName={displayName}
          userEmail={displayEmail}
          role={role}
          profileLink={`/${role}/profile`}
          notificationsLink={`/${role}/notifications`}
          unreadCount={unreadCount}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        {/* Main Content Area */}
        <main
          className={cn(
            "pt-16 min-h-screen transition-all duration-300",
            !isResponsive && showSidebarInline ? "ml-64" : !isResponsive && !isSidebarOpen ? "ml-20" : "ml-0"
          )}
        >
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </TooltipProvider>
  )
}