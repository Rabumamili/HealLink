// components/common/top-header.tsx
"use client"

import { useState, ChangeEvent } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bell,
  Settings,
  HelpCircle,
  User,
  LogOut,
  Menu,
  Search,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TopHeaderProps {
  title?: string
  onMenuClick?: () => void
  isMobile?: boolean
  showViewSelector?: boolean
  activeView?: "monthly" | "weekly"
  onViewChange?: (view: "monthly" | "weekly") => void
  titleColor?: string
  showSearch?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  isSidebarHovered?: boolean
  onSidebarToggle?: () => void
  userInitials?: string
  userName?: string
  userEmail?: string
  role?: "doctor" | "clinicAdmin" | "diagnosticCenter" | "patient"
  profileLink?: string
  settingsLink?: string
}

export function CommonTopHeader({
  title,
  onMenuClick,
  isMobile = false,
  showViewSelector = false,
  activeView = "monthly",
  onViewChange,
  titleColor = "text-primary",
  showSearch = false,
  searchPlaceholder = "Search...",
  onSearch,
  isSidebarHovered = false,
  onSidebarToggle,
  userInitials = "JD",
  userName = "John Doe",
  userEmail = "user@heallink.com",
  role = "patient",
  profileLink = `/${role}/profile`,
  settingsLink = `/${role}/settings`,
}: TopHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  // Calculate header left position based on sidebar state
  const getHeaderLeft = () => {
    if (isMobile) return 0
    return isSidebarHovered ? 256 : 64
  }

  // Role-specific colors for the avatar
  const getAvatarColor = () => {
    switch (role) {
      case "doctor":
        return "bg-teal-100 text-teal-600"
      case "clinicAdmin":
        return "bg-teal-100 text-teal-600"
      case "diagnosticCenter":
        return "bg-primary/10 text-primary"
      case "patient":
        return "bg-primary/10 text-primary"
      default:
        return "bg-primary/10 text-primary"
    }
  }

  return (
    <header
      className="fixed top-0 right-0 h-16 z-40 bg-white border-b shadow-sm transition-all duration-300"
      style={{
        left: getHeaderLeft(),
        width: `calc(100% - ${getHeaderLeft()}px)`
      }}
    >
      <div className="h-full flex justify-between items-center px-4 md:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
            </Button>
          )}

          {/* Desktop Toggle Button (when sidebar is collapsed) */}
          {!isMobile && !isSidebarHovered && onSidebarToggle && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onSidebarToggle}
              className="hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}

          {/* Desktop Toggle Button (when sidebar is expanded) */}
          {!isMobile && isSidebarHovered && onSidebarToggle && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onSidebarToggle}
              className="hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}

          {title && !showSearch && (
            <div className="flex items-center gap-3">
              <h2 className={cn("text-xl font-bold", titleColor)}>{title}</h2>

              {showViewSelector && (
                <div className="flex rounded-full bg-gray-100 p-1">
                  <button
                    onClick={() => onViewChange?.("monthly")}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm transition-all",
                      activeView === "monthly"
                        ? "bg-white shadow font-semibold"
                        : "hover:bg-gray-200"
                    )}
                  >
                    Monthly
                  </button>

                  <button
                    onClick={() => onViewChange?.("weekly")}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm transition-all",
                      activeView === "weekly"
                        ? "bg-white shadow font-semibold"
                        : "hover:bg-gray-200"
                    )}
                  >
                    Weekly
                  </button>
                </div>
              )}
            </div>
          )}

          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearch}
                className="pl-9 pr-4 py-2 w-64 md:w-96 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-all"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="rounded-full h-10 w-10 p-0 hover:bg-gray-100"
              >
                <Avatar>
                  <AvatarFallback className={getAvatarColor()}>
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {userName}
              </DropdownMenuLabel>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground pt-0">
                {userEmail}
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href={profileLink}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href={settingsLink}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild className="text-red-600">
                <Link href="/login">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}