import type React from "react"
import { StudentSidebar } from "@/components/student-sidebar"

export const metadata = {
  title: "Student Dashboard - SUST Research Hub",
  description: "Student dashboard for thesis submissions and management",
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
