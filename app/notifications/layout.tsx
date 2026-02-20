import { getCurrentUser } from "@/lib/auth"
import { GlobalNavbar } from "@/components/global-navbar"
import { StudentSidebar } from "@/components/student-sidebar"
import { SupervisorSidebar } from "@/components/supervisor-sidebar"
import { redirect } from "next/navigation"

export default async function NotificationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background compact-ui">
      <GlobalNavbar user={user} />
      <div className="flex flex-1">
        {user.role === "student" ? <StudentSidebar /> : <SupervisorSidebar />}
        <main className="flex-1 lg:pl-64">
          {children}
        </main>
      </div>
    </div>
  )
}
