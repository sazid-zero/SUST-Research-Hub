import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { LoginFormClient } from "@/components/login-form-client"

export default async function LoginPage() {
  const user = await getCurrentUser()

  if (user) {
    if (user.role === "admin") {
      redirect("/admin/dashboard")
    } else if (user.role === "student") {
      redirect("/student/dashboard")
    } else if (user.role === "supervisor") {
      redirect("/supervisor/dashboard")
    }
  }

  return <LoginFormClient />
}
