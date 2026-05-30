"use client"

import { useState, ChangeEvent, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation" // Add this import
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Bell,
  Settings,
  HelpCircle,
  User,
  LogOut,
  Search,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TopHeaderProps {
  title?: string
  isMobile?: boolean
  titleColor?: string
  showSearch?: boolean
  searchPlaceholder?: string
  isSidebarOpen?: boolean
  onSidebarToggle?: () => void
  userInitials?: string
  userName?: string
  userEmail?: string
  role?: "doctor" | "clinicAdmin" | "diagnosticCenter" | "patient"
  profileLink?: string
  settingsLink?: string
  notificationsLink?: string // Add this prop
  isMobileMenuOpen?: boolean
}

export function CommonTopHeader({
  title,
  isMobile = false,
  titleColor = "text-teal-600",
  showSearch = false,
  searchPlaceholder = "Search...",
  isSidebarOpen = true,
  onSidebarToggle,
  userInitials = "JD",
  userName = "User",
  userEmail = "user@heallink.com",
  role = "patient",
  profileLink = "/profile",
  settingsLink = "/settings",
  notificationsLink = "/notifications", // Add default value
  isMobileMenuOpen = false,
}: TopHeaderProps) {
  const router = useRouter() // Add this
  const [searchQuery, setSearchQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Calculate left offset based on sidebar state for desktop
  const getLeftOffset = () => {
    if (isMobile) return 0
    if (isSidebarOpen) return 256
    return 80
  }

  const leftOffset = getLeftOffset()

  // Add notification click handler
  const handleNotificationClick = () => {
    router.push(notificationsLink)
  }

  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-16 bg-white border-b z-40 flex items-center justify-between px-4 transition-all duration-300",
        scrolled && "shadow-sm"
      )}
      style={{ left: leftOffset, width: `calc(100% - ${leftOffset}px)` }}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile menu button - only show when sidebar is closed or on mobile */}
        {isMobile && onSidebarToggle && !isMobileMenuOpen && (
          <Button variant="ghost" size="icon" onClick={onSidebarToggle} className="shrink-0">
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Desktop toggle button */}
        {!isMobile && onSidebarToggle && (
          <Button variant="ghost" size="icon" onClick={onSidebarToggle} className="shrink-0">
            {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        )}

        {/* Page Title */}
        {title && (
          <h2 className={cn("text-xl font-bold truncate", titleColor)}>{title}</h2>
        )}

        {/* Search Bar - Desktop */}
        {showSearch && !isMobile && (
          <div className="relative ml-4 flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={handleSearch}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 rounded-lg border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Mobile Search Button */}
        {showSearch && isMobile && (
          <Button variant="ghost" size="icon" className="relative">
            <Search className="h-5 w-5" />
          </Button>
        )}

        {/* Notification Bell - Now clickable with Link or Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={handleNotificationClick} // Add onClick handler
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <HelpCircle className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-teal-100 text-teal-700">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={profileLink} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={settingsLink} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Search Bar - Expandable (simplified) */}
      {showSearch && isMobile && searchQuery && (
        <div className="absolute top-full left-0 right-0 p-3 bg-white border-b shadow-md z-50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={handleSearch}
              placeholder={searchPlaceholder}
              autoFocus
              className="w-full pl-9 pr-4 py-2 rounded-lg border bg-gray-50"
            />
          </div>
        </div>
      )}
    </header>
  )
}