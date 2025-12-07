"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { BookOpen, FileText, LayoutDashboard, LogOut, Settings, Upload, User, Menu, X, Sun, Moon, FolderOpen } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useTheme } from "next-themes"
import React from 'react'
import { LogoutModal } from './logout-modal'

export function StudentSidebar() {
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const navItems = [
        { href: "/student/projects", label: "My Projects", icon: FolderOpen },
        { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/student/submissions", label: "My Submissions", icon: FileText },
        { href: "/student/profile", label: "Profile", icon: User },
        { href: "/student/settings", label: "Settings", icon: Settings },
    ]

    const isProfileActive = pathname.startsWith('/student/profile')

    return (
        <>
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-[999] flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
            >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-[998] bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            <aside
                className={`lg:hidden fixed inset-y-0 left-0 z-[999] w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out ${
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="p-6 border-b border-border">
                    <Link href="/" className="flex items-center gap-3">
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
                        const isActive = item.href === '/student/profile'
                            ? isProfileActive
                            : pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                    isActive
                                        ? "bg-gradient-to-br from-primary to-accent text-primary-foreground"
                                        : "text-foreground hover:bg-accent hover:text-accent-foreground",
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        )
                    })}

                    <button
                        onClick={() => {
                            setTheme(theme === "dark" ? "light" : "dark")
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        {mounted && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        <span className="font-medium">Dark Mode</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-border">
                    <LogoutModal />
                </div>
            </aside>

            {/* Desktop sidebar - hidden on mobile */}
            <aside className="hidden lg:flex relative min-w-64 border-r border-border bg-card min-h-screen flex-col">
                <div className="p-6 border-b border-border">
                    <Link href="/" className="flex items-center gap-3">
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
                        const isActive = item.href === '/student/profile'
                            ? isProfileActive
                            : pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                    isActive
                                        ? "bg-gradient-to-br from-primary to-accent text-primary-foreground"
                                        : "text-foreground hover:bg-accent hover:text-accent-foreground",
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        )
                    })}
                    <button
                        onClick={() => {
                            setTheme(theme === "dark" ? "light" : "dark")
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        {mounted && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        <span className="font-medium">Dark Mode</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-border">
                    <LogoutModal />
                </div>
            </aside>
        </>
    )
}
