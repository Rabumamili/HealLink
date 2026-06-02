// app/clinicAdmin/layout.tsx
import { LayoutWrapper } from "@/components/common/layout-wrapper"

export default function ClinicAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LayoutWrapper
      role="clinic"
      portalName="Clinic Portal"
      portalSubtitle="Healthcare Management"
      searchPlaceholder="Search patients, appointments..."
    >
      {children}
    </LayoutWrapper>
  )
}