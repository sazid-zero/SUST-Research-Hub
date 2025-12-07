import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import RegisterFormClient from "@/components/register-form-client"

export default async function RegisterPage() {
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

  return <RegisterFormClient />
}
