"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

interface MobileMenuProps {
  items: Array<{
    label: string
    href: string
  }>
  hasAuth?: boolean
}

export function MobileMenu({ items, hasAuth = false }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-foreground hover:bg-accent rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg z-40">
          <nav className="flex flex-col p-4 space-y-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-foreground hover:bg-accent rounded-lg transition-colors text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {hasAuth && (
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start hover:bg-accent text-sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground border-0 text-sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </div>
  )
}
