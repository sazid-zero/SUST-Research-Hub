"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/auth"
import { LayoutDashboard } from "lucide-react"

interface AuthButtonProps {
  user: User | null
}

export function AuthButton({ user }: AuthButtonProps) {
  if (!user) {
    return (
      <div className="flex gap-2">
        <Button variant="ghost" asChild>
          <Link href="/login">Sign In</Link>
        </Button>
        <Button asChild className="bg-linear-to-r from-primary to-accent hover:scale-105 shadow-xl shadow-primary/20 border-none transition-all duration-300">
          <Link href="/register">Sign Up</Link>
        </Button>
      </div>
    )
  }

  // Redirect to appropriate dashboard based on role
  const dashboardUrl =
    user.role === "admin"
      ? "/admin/dashboard"
      : user.role === "supervisor"
        ? "/supervisor/dashboard"
        : "/student/dashboard"

  return (
    <Button asChild className="bg-linear-to-r from-primary to-accent hover:scale-105 shadow-xl shadow-primary/20 border-none transition-all duration-300">
        <div className="flex items-center gap-2">
      <LayoutDashboard className=" h-4 w-4" />
      <Link href={dashboardUrl}>Dashboard</Link>
        </div>
    </Button>
  )
}
