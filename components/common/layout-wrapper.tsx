"use client"

import { useEffect, useState } from "react"
import { CommonSidebar } from "@/components/common/sidebar"
import { CommonTopHeader } from "@/components/common/top-header"
import { TooltipProvider } from "@/components/ui/tooltip"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LayoutWrapperProps {
  children: React.ReactNode
  role: "doctor" | "clinicAdmin" | "diagnosticCenter" | "patient"
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
     
    },
    clinicAdmin: {
      "/clinicAdmin/dashboard": "Dashboard",
      "/clinicAdmin/services": "Services",
      "/clinicAdmin/appointments": "Appointments",
      "/clinicAdmin/schedule": "Schedule",
      "/clinicAdmin/checkin": "Check-in",
      "/clinicAdmin/staff": "Staff",
      "/clinicAdmin/analytics": "Analytics",
      "clinicAdmin/reviews": "Reviews",
     
    },
    diagnosticCenter: {
      "/diagnosticCenterAdmin/dashboard": "Dashboard",
      "/diagnosticCenterAdmin/appointments": "Appointments",
      "/diagnosticCenterAdmin/services": "Tests",
      "/diagnosticCenterAdmin/schedule": "Schedule",
      "/diagnosticCenterAdmin/checkin": "Check-in",
      "/diagnosticCenterAdmin/staff": "Staff",
      "/diagnosticCenterAdmin/analytics": "Analytics",
      "/diagnosticCenterAdmin/reviews": "Reviews",
    },
    patient: {
      "/patient/dashboard": "Dashboard",
      "/patient/appointments": "Appointments",
      "/patient/bookings": "Book Appointment",
      "/patient/card-numbers": "Cards",
      "/patient/results": "Results",
      "/patient/payments": "Payments",
      "/patient/reviews": "Reviews",
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
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const pathname = usePathname()

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
          userInitials={userInitials}
          userName={userName}
          userEmail={userEmail}
          role={role}
          profileLink={`/${role}/profile`}
          settingsLink={`/${role}/settings`}
          notificationsLink={`/${role}/notifications`} // Add this line
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