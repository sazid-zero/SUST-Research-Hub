import type React from "react"
import { StudentSidebar } from "@/components/student-sidebar"
import { GlobalNavbar } from "@/components/global-navbar"
import { getCurrentUser } from "@/app/actions/auth"

export const metadata = {
  title: "Student Dashboard - SUST Research Hub",
  description: "Student dashboard for thesis submissions and management",
}

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  
  return (
    <div className="min-h-screen bg-background compact-ui">
      <GlobalNavbar user={user} />
      <div className="flex flex-1">
        <StudentSidebar />
        <main className="flex-1 lg:pl-64">
          {children}
        </main>
      </div>
    </div>
  )
}
