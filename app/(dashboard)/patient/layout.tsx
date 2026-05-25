// app/patient/layout.tsx
import { LayoutWrapper } from "@/components/common/layout-wrapper"

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LayoutWrapper
      role="patient"
      portalName="Patient Portal"
      portalSubtitle="Your Health Journey"
      searchPlaceholder="Search doctors, specialties..."
      userInitials="SJ"
      userName="Sarah Johnson"
      userEmail="sarah.johnson@example.com"
    >
      {children}
    </LayoutWrapper>
  )
}