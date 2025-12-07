"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, ChevronDown } from "lucide-react"

export function DashboardSelector({ variant = "default" }) {
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!isOpen || !buttonRef.current) return

        const updatePosition = () => {
            if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect()
                setDropdownPosition({
                    top: rect.bottom + window.scrollY + 8,
                    left: variant === "default" ? rect.left + rect.width / 2 + window.scrollX : rect.right + window.scrollX,
                    width: rect.width,
                })
            }
        }

        updatePosition()
        window.addEventListener("scroll", updatePosition, true)
        window.addEventListener("resize", updatePosition)

        return () => {
            window.removeEventListener("scroll", updatePosition, true)
            window.removeEventListener("resize", updatePosition)
        }
    }, [isOpen, variant])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
            return () => document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen])

    const dashboards = [
        { href: "/student/dashboard", label: "Student Dashboard" },
        { href: "/supervisor/dashboard", label: "Supervisor Dashboard" },
        { href: "/admin/dashboard", label: "Admin Dashboard" },
    ]

    const dropdownMenu =
        isOpen && mounted ? (
            <div
                ref={dropdownRef}
                style={{
                    position: "absolute",
                    top: `${dropdownPosition.top}px`,
                    left: variant === "default" ? `${dropdownPosition.left}px` : undefined,
                    right: variant === "nav" ? `${window.innerWidth - dropdownPosition.left}px` : undefined,
                    transform: variant === "default" ? "translateX(-50%)" : undefined,
                    zIndex: 9999,
                }}
                className="w-48 bg-card border border-border rounded-lg shadow-xl pointer-events-auto"
            >
                {dashboards.map((dashboard, idx) => (
                    <Link
                        key={dashboard.href}
                        href={dashboard.href}
                        className={`block px-4 py-3 text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-colors pointer-events-auto ${
                            idx === 0 ? "rounded-t-lg" : ""
                        } ${idx === dashboards.length - 1 ? "rounded-b-lg" : "border-b border-border"}`}
                        onClick={() => setIsOpen(false)}
                    >
                        {dashboard.label}
                    </Link>
                ))}
            </div>
        ) : null

    if (variant === "nav") {
        return (
            <div ref={containerRef} className="relative pointer-events-auto">
                <Button
                    ref={buttonRef}
                    onClick={() => setIsOpen(!isOpen)}
                    variant="outline"
                    size="sm"
                    className="border-border hover:bg-primary bg-transparent hidden sm:flex z-50 pointer-events-auto"
                >
                    <LayoutDashboard className="h-5 w-5 mr-2" />
                    <span>Dashboard</span>
                    <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </Button>

                {mounted && typeof window !== "undefined" && createPortal(dropdownMenu, document.body)}
            </div>
        )
    }

    return (
        <div ref={containerRef} className="relative inline-block pointer-events-auto">
            <Button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white border-0 hover:scale-110 flex items-center gap-2 relative z-50 pointer-events-auto"
            >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </Button>

            {mounted && typeof window !== "undefined" && createPortal(dropdownMenu, document.body)}
        </div>
    )
}
