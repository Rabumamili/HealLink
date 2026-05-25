import fs from "fs"
import path from "path"

const root = path.resolve(".")

const roles = [
  {
    role: "doctor",
    appPath: "app/(dashboard)/doctor",
    componentPath: "components/doctor",
    pages: [
      { dir: "dashboard", file: "doctor-dashboard.tsx", exportName: "DoctorDashboard" },
      { dir: "appointments", file: "doctor-appointments.tsx", exportName: "DoctorAppointmentsPage" },
      { dir: "checkin", file: "doctor-checkin.tsx", exportName: "DoctorCheckin" },
      { dir: "schedule", file: "doctor-schedule.tsx", exportName: "DoctorSchedulePage" },
      { dir: "services", file: "doctor-services.tsx", exportName: "DoctorServices" },
      { dir: "staff", file: "doctor-staff.tsx", exportName: "DoctorStaff" },
      { dir: "analytics", file: "doctor-analytics.tsx", exportName: "DoctorAnalytics" },
      { dir: "profile", file: "doctor-profile.tsx", exportName: "DoctorProfile" },
    ],
  },
  {
    role: "patient",
    appPath: "app/(dashboard)/patient",
    componentPath: "components/patient",
    pages: [
      { dir: "dashboard", file: "patient-dashboard.tsx", exportName: "PatientDashboard" },
      { dir: "appointments", file: "patient-appointments.tsx", exportName: "PatientAppointmentsPage" },
      { dir: "bookings", file: "patient-bookings.tsx", exportName: "BookAppointmentPage" },
      { dir: "results", file: "patient-results.tsx", exportName: "DiagnosticResultsPage" },
      { dir: "payments", file: "patient-payments.tsx", exportName: "PaymentsPage" },
      { dir: "card-numbers", file: "patient-card-numbers.tsx", exportName: "CardNumbersPage" },
      { dir: "reviews", file: "patient-reviews.tsx", exportName: "ReviewsPage" },
      { dir: "notifications", file: "patient-notifications.tsx", exportName: "NotificationsPage" },
      { dir: "profile", file: "patient-profile.tsx", exportName: "HealthProfilePage" },
    ],
  },
  {
    role: "clinicAdmin",
    appPath: "app/(dashboard)/clinicAdmin",
    componentPath: "components/clinic-admin",
    pages: [
      { dir: "dashboard", file: "clinic-admin-dashboard.tsx", exportName: "ClinicAdminDashboard" },
      { dir: "appointments", file: "clinic-appointments.tsx", exportName: "ClinicAppointmentsPage" },
      { dir: "schedule", file: "clinic-schedule.tsx", exportName: "ClinicSchedulePage" },
      { dir: "checkin", file: "clinic-checkin.tsx", exportName: "ClinicCheckinPage" },
      { dir: "staff", file: "clinic-staff.tsx", exportName: "StaffManagementPage" },
      { dir: "services", file: "clinic-services.tsx", exportName: "ServicesPage" },
      { dir: "analytics", file: "clinic-analytics.tsx", exportName: "ClinicAnalyticsPage" },
      { dir: "profile", file: "clinic-profile.tsx", exportName: "ClinicProfilePage" },
    ],
  },
  {
    role: "diagonsticCenterAdmin",
    appPath: "app/(dashboard)/diagonsticCenterAdmin",
    componentPath: "components/diagnostic-center",
    pages: [
      { dir: "dashboard", file: "diagnostic-center-dashboard.tsx", exportName: "DiagnosticCenterDashboard" },
      { dir: "appointments", file: "diagnostic-appointments.tsx", exportName: "AppointmentsPage" },
      { dir: "schedule", file: "diagnostic-schedule.tsx", exportName: "DiagnosticCenterSchedulePage" },
      { dir: "checkin", file: "diagnostic-checkin.tsx", exportName: "CheckinPage" },
      { dir: "staff", file: "diagnostic-staff.tsx", exportName: "StaffManagementPage" },
      { dir: "services", file: "diagnostic-services.tsx", exportName: "ServicesPage" },
      { dir: "analytics", file: "diagnostic-analytics.tsx", exportName: "AnalyticsPage" },
      { dir: "profile", file: "diagnostic-profile.tsx", exportName: "DiagnosticCenterProfilePage" },
    ],
  },
]

function toNamedExport(content, exportName) {
  let updated = content

  // Remove unused TopHeader imports (layout provides header)
  updated = updated.replace(/^import \{ TopHeader \} from "@\/components\/doctor\/top-header"\s*\n/gm, "")

  if (/export default function/.test(updated)) {
    updated = updated.replace(/export default function (\w+)/, `export function ${exportName}`)
  } else if (/export default function/.test(updated) === false && /export function/.test(updated) === false) {
    throw new Error("Could not find export in file")
  }

  return updated
}

function createWrapper(importPath, exportName) {
  return `import { ${exportName} } from "@/${importPath.replace(/\\/g, "/").replace(/\.tsx$/, "")}"

export default function Page() {
  return <${exportName} />
}
`
}

let created = 0
let updated = 0

for (const { appPath, componentPath, pages } of roles) {
  for (const { dir, file, exportName } of pages) {
    const pageFile = path.join(root, appPath, dir, "page.tsx")
    const componentFile = path.join(root, componentPath, dir, file)
    const importPath = path.join(componentPath, dir, file)

    if (!fs.existsSync(pageFile)) {
      console.warn(`SKIP missing page: ${pageFile}`)
      continue
    }

  const content = fs.readFileSync(pageFile, "utf8")

  // Skip if already refactored (thin wrapper)
  if (content.includes(`from "@/${componentPath.replace(/\\/g, "/")}`) && content.length < 200) {
    console.log(`SKIP already refactored: ${pageFile}`)
    continue
  }

    fs.mkdirSync(path.dirname(componentFile), { recursive: true })
    fs.writeFileSync(componentFile, toNamedExport(content, exportName), "utf8")
    fs.writeFileSync(pageFile, createWrapper(importPath, exportName), "utf8")

    created++
    updated++
    console.log(`OK ${componentPath}/${dir}/${file}`)
  }
}

console.log(`\nDone: ${created} components created, ${updated} pages updated`)
