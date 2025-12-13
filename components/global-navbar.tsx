"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {BookOpen, Menu, X, Search, Moon, Sun, FileText, Database, Folder} from "lucide-react"
import { IconCube } from "@tabler/icons-react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { AuthButton } from "@/components/auth-button"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import type { User } from "@supabase/supabase-js"

interface GlobalNavbarProps {
    user?: User | null
}

export function GlobalNavbar({ user }: GlobalNavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()
    const pathname = usePathname()

    useEffect(() => {
        setMounted(true)
    }, [])

    const navItems = [
        { label: "Theses", href: "/theses", icon: BookOpen },
        { label: "Papers", href: "/papers", icon: FileText },
        { label: "Datasets", href: "/datasets", icon: Database },
        { label: "Models", href: "/models", icon: IconCube },
        { label: "Projects", href: "/projects", icon: Folder },
    ]

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

    // @ts-ignore
    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50 border-b border-border/50">
                <div className="max-w-8xl mx-auto px-4 lg:px-8">
                    <div className="flex h-16 items-center justify-between gap-4">
                        {/* Logo and Title */}
                        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                                <BookOpen className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="text-base font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hidden sm:inline">
                Research Hub
              </span>
                        </Link>

                        <div className="hidden md:flex flex-1">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search theses, papers, projects, models, datasets..."
                                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border-2 border-border text-sm text-muted-foreground dark:text-foreground focus:outline-none focus:border-primary/50 focus:bg-background transition-colors"
                                />
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1 ml-auto">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-transform ${
                                        isActive(item.href)
                                            ? "text-primary/80 dark:text-primary font-semibold"
                                            : "text-muted-foreground dark:text-foreground hover:scale-105"
                                    }`}
                                >
                                    <item.icon className={`h-4 w-4 ${isActive(item.href) ? "text-primary/80 dark:text-primary" : ""}`} />
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* Right side actions */}
                        <div className="flex items-center gap-2 md:gap-3">
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:scale-105 transition-transform border-2 "
                            >
                                {mounted && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
                                <span className="hidden md:inline text-xs">{mounted && (theme === "dark" ? "Light" : "Dark")}</span>
                            </button>

                            {/* Mobile menu button */}
                            <button
                                className="md:hidden p-2 hover:scale-105 rounded-lg transition-transform"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>

                            <div className="hidden sm:flex items-center gap-2 md:gap-3">
                                <AuthButton user={user} />
                                {user && <UserProfileDropdown user={user} />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-border/50 bg-background">
                        <div className="px-4 py-3 space-y-2">
                            {/* Mobile search bar */}
                            <div className="mb-4">
                                <div className="relative w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border-2 border-border text-sm text-muted-foreground dark:text-foreground placeholder-[#cfcfcf] dark:placeholder-muted-foreground focus:outline-none focus:border-primary focus:bg-background transition-colors"
                                    />
                                </div>
                            </div>

                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-transform ${
                                        isActive(item.href)
                                            ? "text-primary font-semibold"
                                            : "text-muted-foreground hover:scale-105"
                                    }`}
                                >
                                    <item.icon className={`h-4 w-4 ${isActive(item.href) ? "text-primary" : ""}`} />
                                    {item.label}
                                </Link>
                            ))}

                            <div className="border-t border-border/50 pt-2 mt-2 space-y-2">
                                <button
                                    onClick={() => {
                                        setTheme(theme === "dark" ? "light" : "dark")
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:scale-105 transition-transform"
                                >
                                    {mounted && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
                                    <span>{mounted && (theme === "dark" ? "Light Mode" : "Dark Mode")}</span>
                                </button>

                                {/* Auth buttons */}
                                <div className="pt-2">
                                    <AuthButton user={user} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Spacer for fixed navbar */}
            <div className="h-16" />

        </>
    )
}
