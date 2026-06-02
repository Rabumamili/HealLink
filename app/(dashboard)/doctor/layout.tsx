
import { LayoutWrapper } from "@/components/common/layout-wrapper"

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LayoutWrapper
      role="doctor"
      portalName="Doctor Portal"
      portalSubtitle="Providing Quality Care"
      searchPlaceholder="Search patients, appointments..."
    >
      {children}
    </LayoutWrapper>
  )
}