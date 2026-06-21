"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { BookOpen, FileText, LayoutDashboard, LogOut, Settings, CheckCircle, User, Menu, X, Sun, Moon, FolderOpen, Beaker, Bell } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useTheme } from "next-themes"
import React from "react";
import { LogoutModal } from './logout-modal'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { useSidebar } from "./sidebar-context"

const navItems = [
    { href: "/supervisor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/supervisor/supervised", label: "Supervised Work", icon: FolderOpen },
    { href: "/supervisor/requests", label: "Supervision Requests", icon: CheckCircle },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/supervisor/students", label: "My Students", icon: FileText },
    { href: "/supervisor/profile", label: "Profile", icon: User },
    { href: "/supervisor/settings", label: "Settings", icon: Settings },
]

function SidebarContent({ setIsOpen }: { setIsOpen?: (open: boolean) => void }) {
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-border lg:hidden">
                <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen?.(false)}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                        <BookOpen className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Research Hub
                    </span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen?.(false)}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
                                isActive
                                    ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm"
                                    : "text-foreground hover:bg-accent hover:text-accent-foreground",
                            )}
                        >
                            <Icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground")} />
                            <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                    )
                })}
                <button
                    onClick={() => {
                        setTheme(theme === "dark" ? "light" : "dark")
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors group"
                >
                    {mounted && theme === "dark" ? <Sun className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" /> : <Moon className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />}
                    <span className="font-medium text-sm">Dark Mode</span>
                </button>
            </nav>

            <div className="p-4 border-t border-border">
                <LogoutModal />
            </div>
        </div>
    )
}

export function SupervisorSidebar() {
    const { isOpen, setIsOpen } = useSidebar()

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="fixed left-0 top-16 bottom-0 w-64 border-r border-border bg-card hidden lg:block overflow-y-auto">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent side="left" className="p-0 w-64 bg-card border-r border-border [&>button]:hidden">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Supervisor Navigation</SheetTitle>
                        <SheetDescription>Main navigation menu for supervisors</SheetDescription>
                    </SheetHeader>
                    <SidebarContent setIsOpen={setIsOpen} />
                </SheetContent>
            </Sheet>
        </>
    )
}
