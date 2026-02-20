import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { GlobalNavbar } from "@/components/global-navbar"
import { getCurrentUser } from "@/app/actions/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1120] compact-ui">
      <GlobalNavbar user={user} />
      <div className="flex pt-16 lg:pt-0">
        <AdminSidebar />
        <main className="flex-1 w-full lg:pl-64">
          {children}
        </main>
      </div>
    </div>
  )
}
