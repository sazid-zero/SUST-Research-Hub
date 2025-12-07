import type React from "react"
import { SupervisorSidebar } from "@/components/supervisor-sidebar"

export default function SupervisorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <SupervisorSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
