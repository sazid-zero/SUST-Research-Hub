"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface DashboardMobileMenuProps {
  items: Array<{
    href: string
    label: string
    icon: React.ComponentType<{ className?: string }>
  }>
  role: "student" | "supervisor" | "admin"
}

export function DashboardMobileMenu({ items, role }: DashboardMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="fixed top-16 left-0 right-0 bottom-0 bg-background border-b border-border shadow-lg z-40 overflow-y-auto">
          <nav className="flex flex-col p-4 space-y-2">
            {items.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}

            <div className="pt-4 border-t border-border">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-sm font-medium">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
