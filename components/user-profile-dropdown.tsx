"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, LogOut, Settings } from 'lucide-react'
import { logout } from "@/app/actions/auth"

interface UserProfileDropdownProps {
  user: {
    full_name: string
    email: string
    role: string
    student_id?: string
    username?: string
  } | null
}

export function UserProfileDropdown({ user }: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 })

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
          right: window.innerWidth - rect.right - window.scrollX,
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
  }, [isOpen])

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

  if (!user) {
    return (
      <Link href="/login">
        <div className="hidden md:flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 cursor-pointer hover:border-primary/50 transition-colors">
          <User className="h-5 w-5 text-primary" />
        </div>
      </Link>
    )
  }

  const profileUrl = user.role === 'student' 
    ? `/student/profile/${user.student_id}`
    : user.role === 'supervisor'
    ? `/supervisor/profile/${user.username}`
    : '/admin/profile'

  const dropdownMenu =
    isOpen && mounted ? (
      <div
        ref={dropdownRef}
        style={{
          position: "absolute",
          top: `${dropdownPosition.top}px`,
          right: `${dropdownPosition.right}px`,
          zIndex: 9999,
        }}
        className="w-64 bg-card border border-border rounded-lg shadow-xl pointer-events-auto"
      >
        <div className="p-4 border-b border-border">
          <p className="font-semibold text-foreground truncate">{user.full_name}</p>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          <p className="text-xs text-muted-foreground mt-1 capitalize">{user.role}</p>
        </div>
        <div className="p-2">
          <Link
            href={profileUrl}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <User className="h-4 w-4" />
            View Profile
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </div>
      </div>
    ) : null

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 cursor-pointer hover:border-primary/50 transition-colors"
      >
        <User className="h-5 w-5 text-primary" />
      </button>

      {mounted && typeof window !== "undefined" && createPortal(dropdownMenu, document.body)}
    </div>
  )
}
