import type React from "react"
import { SupervisorSidebar } from "@/components/supervisor-sidebar"
import { GlobalNavbar } from "@/components/global-navbar"
import { getCurrentUser } from "@/app/actions/auth"

export default async function SupervisorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  
  return (
    <div className="min-h-screen bg-background compact-ui">
      <GlobalNavbar user={user} />
      <div className="flex pt-16 lg:pt-0">
        <SupervisorSidebar />
        <main className="flex-1 w-full lg:pl-64">
          {children}
        </main>
      </div>
    </div>
  )
}
