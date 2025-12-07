"use client"

import { useState, useEffect, useRef } from "react"
import { Bell } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { getNotificationsByUser, getUnreadCount, markNotificationAsRead } from "@/lib/data/projects"
import type { Notification } from "@/lib/data/projects"
import { createPortal } from "react-dom"

export function NotificationBell({ userId = "student1" }: { userId?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    loadNotifications()
  }, [])

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      updateDropdownPosition()
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleScroll = () => {
      if (isOpen && buttonRef.current) {
        updateDropdownPosition()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('scroll', handleScroll, true)
      window.addEventListener('resize', handleScroll)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleScroll)
    }
  }, [isOpen])

  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.right - 384, // 384px is w-96 width
      })
    }
  }

  const loadNotifications = () => {
    const userNotifications = getNotificationsByUser(userId)
    setNotifications(userNotifications.slice(0, 5)) // Show only 5 recent
    setUnreadCount(getUnreadCount(userId))
  }

  const handleNotificationClick = (notificationId: string) => {
    markNotificationAsRead(notificationId)
    loadNotifications()
    setIsOpen(false)
  }

  const getNotificationIcon = (type: string) => {
    // You can customize icons based on type
    return "📬"
  }

  return (
    <div className="relative pointer-events-auto">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        className="relative pointer-events-auto"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {mounted && isOpen && createPortal(
        <Card
          ref={dropdownRef}
          className="fixed w-96 max-h-[32rem] overflow-y-auto bg-card border-border shadow-xl z-[9999] pointer-events-auto"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
        >
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">{unreadCount} new</Badge>
              )}
            </div>
          </div>

          <div className="divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.actionUrl || "/notifications"}
                  onClick={() => handleNotificationClick(notification.id)}
                  className="block p-4 hover:bg-muted/50 transition-colors pointer-events-auto"
                >
                  <div className="flex gap-3">
                    <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm text-foreground">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-2 border-t border-border">
              <Link href="/notifications" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full text-primary hover:bg-primary/10 pointer-events-auto">
                  View All Notifications
                </Button>
              </Link>
            </div>
          )}
        </Card>,
        document.body
      )}
    </div>
  )
}
