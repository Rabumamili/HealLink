// app/staff/layout.tsx
import { LayoutWrapper } from "@/components/common/layout-wrapper"

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LayoutWrapper
      role="staff"
      portalName="Staff Portal"
      portalSubtitle="Manage Daily Operations"
      searchPlaceholder="Search diagnostic results..."
      userInitials="JD"
      userName="John Doe"
      userEmail="john.doe@heallink.com"
    >
      {children}
    </LayoutWrapper>
  )
}