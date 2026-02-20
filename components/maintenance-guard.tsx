"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { Hammer, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface MaintenanceGuardProps {
  children: React.ReactNode
  isMaintenanceMode: boolean
  isAdmin: boolean
}

export function MaintenanceGuard({ children, isMaintenanceMode, isAdmin }: MaintenanceGuardProps) {
  const pathname = usePathname()

  // Exclude admin routes, login page, and health checks from maintenance block
  const isExcludedPath = 
    pathname?.startsWith("/admin") || 
    pathname === "/login" || 
    pathname === "/api/health"

  if (isMaintenanceMode && !isAdmin && !isExcludedPath) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative p-6 rounded-3xl bg-card border border-border shadow-2xl">
            <Hammer className="h-16 w-16 text-primary animate-bounce mb-4 mx-auto" />
            <h1 className="text-3xl font-bold text-foreground mb-2">System Under Maintenance</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              We're currently performing some essential updates to the SUST Research Hub. 
              Please check back shortly. We apologize for any inconvenience.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col gap-4 items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border border-border/50">
            <Lock className="h-4 w-4" />
            <span>Admin access is still available</span>
          </div>
          <Link href="/login">
            <Button variant="outline" className="rounded-xl px-8">
              Admin Login
            </Button>
          </Link>
        </div>

        <div className="mt-20 text-xs text-muted-foreground opacity-50">
          © {new Date().getFullYear()} SUST Research Hub. Technical Support: admin@sust-research-hub.edu.bd
        </div>
      </div>
    )
  }

  return <>{children}</>
}
