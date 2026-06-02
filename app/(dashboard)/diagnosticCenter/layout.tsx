// app/diagnosticCenter/layout.tsx
import { LayoutWrapper } from "@/components/common/layout-wrapper"

export default function DiagnosticCenterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LayoutWrapper
      role="diagnosticCenter"
      portalName="Diagnostic Center"
      portalSubtitle="Accurate Diagnostics"
      searchPlaceholder="Search patients, tests..."
    >
      {children}
    </LayoutWrapper>
  )
}