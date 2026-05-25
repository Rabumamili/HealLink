// components/common/layout-wrapper.tsx
"use client"

import { useEffect, useState } from "react"
import { CommonSidebar } from "@/components/common/sidebar"
import { CommonTopHeader } from "@/components/common/top-header"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

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
      "/doctor/schedule": "Schedule Management",
      "/doctor/checkin": "Patient Check-in",
      "/doctor/staff": "Staff Management",
      "/doctor/analytics": "Analytics",
      "/doctor/profile": "Profile",
      "/doctor/settings": "Settings",
    },
    clinicAdmin: {
      "/clinicAdmin/dashboard": "Dashboard",
      "/clinicAdmin/services": "My Services",
      "/clinicAdmin/appointments": "Appointments",
      "/clinicAdmin/schedule": "Schedule Management",
      "/clinicAdmin/checkin": "Patient Check-in",
      "/clinicAdmin/staff": "Staff Management",
      "/clinicAdmin/analytics": "Analytics",
      "/clinicAdmin/clinicInfo": "Clinic Information",
      "/clinicAdmin/profile": "Profile",
      "/clinicAdmin/settings": "Settings",
    },
    diagnosticCenter: {
      "/diagnosticCenter/dashboard": "Dashboard",
      "/diagnosticCenter/appointments": "Appointments",
      "/diagnosticCenter/services": "Test Services",
      "/diagnosticCenter/schedule": "Schedule Management",
      "/diagnosticCenter/checkin": "Patient Check-in",
      "/diagnosticCenter/staff": "Staff Management",
      "/diagnosticCenter/analytics": "Analytics",
      "/diagnosticCenter/centerInfo": "Center Information",
      "/diagnosticCenter/profile": "Profile",
      "/diagnosticCenter/settings": "Settings",
    },
    patient: {
      "/patient/dashboard": "Dashboard",
      "/patient/appointments": "My Appointments",
      "/patient/bookings": "Book Appointment",
      "/patient/card-numbers": "Card Numbers",
      "/patient/results": "Test Results",
      "/patient/payments": "Payments",
      "/patient/reviews": "Reviews",
      "/patient/profile": "Profile",
      "/patient/settings": "Settings",
    },
  }
  return routes[role]?.[pathname] || `${role.charAt(0).toUpperCase() + role.slice(1)} Portal`
}

export function LayoutWrapper({
  children,
  role,
  portalName,
  portalSubtitle,
  titleColor = role === "doctor" || role === "clinicAdmin" ? "text-teal-600" : "text-primary",
  searchPlaceholder = "Search...",
  userInitials = "JD",
  userName = "User Name",
  userEmail = "user@heallink.com",
}: LayoutWrapperProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarHovered, setIsSidebarHovered] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const pageTitle = getPageTitle(pathname, role)
  const isDashboard = pathname === `/${role}/dashboard`

  const handleSidebarToggle = () => {
    setIsSidebarHovered(!isSidebarHovered)
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        <CommonSidebar
          role={role}
          isMobile={isMobile}
          isHovered={isSidebarHovered}
          onHoverChange={setIsSidebarHovered}
          portalName={portalName}
          portalSubtitle={portalSubtitle}
        />

        <CommonTopHeader
          title={!isDashboard ? pageTitle : ""}
          isMobile={isMobile}
          titleColor={titleColor}
          showSearch={isDashboard}
          searchPlaceholder={searchPlaceholder}
          isSidebarHovered={isSidebarHovered}
          onSidebarToggle={handleSidebarToggle}
          userInitials={userInitials}
          userName={userName}
          userEmail={userEmail}
          role={role}
          profileLink={`/${role}/profile`}
          settingsLink={`/${role}/settings`}
        />

        <main
          className={cn(
            "pt-16 min-h-screen transition-all duration-300",
            !isMobile && (isSidebarHovered ? "ml-64" : "ml-16")
          )}
        >
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}