"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bell, CheckCircle, AlertCircle, Info, Trash2 } from "lucide-react"

interface Notification {
  id: string
  type: "success" | "warning" | "info"
  title: string
  message: string
  timestamp: string
  read: boolean
}

export default function NotificationsPage() {
  const notifications: Notification[] = [
    {
      id: "1",
      type: "success",
      title: "Thesis Approved",
      message: 'Your thesis "Machine Learning in Healthcare" has been approved and published.',
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      type: "warning",
      title: "Changes Requested",
      message: "Supervisor requested changes to the methodology section of your thesis.",
      timestamp: "1 day ago",
      read: false,
    },
    {
      id: "3",
      type: "info",
      title: "New Thesis Submitted",
      message: 'A new thesis "AI in Education" has been submitted for your review.',
      timestamp: "2 days ago",
      read: true,
    },
    {
      id: "4",
      type: "success",
      title: "Submission Received",
      message: "Your thesis submission has been received and is pending review.",
      timestamp: "3 days ago",
      read: true,
    },
    {
      id: "5",
      type: "info",
      title: "System Update",
      message: "The repository system has been updated with new features.",
      timestamp: "1 week ago",
      read: true,
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <Button variant="outline" size="sm">
              Mark all as read
            </Button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`border-border p-6 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer ${
                !notification.read ? "bg-primary/5" : "bg-card"
              }`}
            >
              <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{notification.title}</h3>
                  {!notification.read && <Badge className="bg-primary text-primary-foreground">New</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
              </div>
              <Button variant="ghost" size="sm" className="flex-shrink-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
