"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ThemeToggle } from "@/components/theme-toggle"
import { Bell, Mail, Shield, Palette } from "lucide-react"

export default function SupervisorSettings() {
  return (
    <main className="flex-1">
      {/* Header */}
      <div className="border-b border-border bg-card p-4 sm:p-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your account preferences</p>
        </div>
      </div>

      {/* Content */}
      <div className="mb-20 p-4 sm:p-6 space-y-4 max-w-4xl">
        {/* Appearance */}
        <Card className="border-border bg-card p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">Appearance</h3>
              <p className="text-sm text-muted-foreground mb-4">Customize how the app looks</p>
              <div className="flex items-center justify-between">
                <Label htmlFor="theme" className="text-foreground">
                  Theme
                </Label>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">Notifications</h3>
                <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="new-submissions" className="text-foreground">
                    New thesis submissions
                  </Label>
                  <Switch id="new-submissions" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="student-messages" className="text-foreground">
                    Student messages
                  </Label>
                  <Switch id="student-messages" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="review-reminders" className="text-foreground">
                    Review reminders
                  </Label>
                  <Switch id="review-reminders" defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Email Preferences */}
        <Card className="border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">Email Preferences</h3>
                <p className="text-sm text-muted-foreground">Control what emails you receive</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="text-foreground">
                    Email notifications
                  </Label>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="daily-summary" className="text-foreground">
                    Daily summary
                  </Label>
                  <Switch id="daily-summary" defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Privacy */}
        <Card className="border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">Privacy</h3>
                <p className="text-sm text-muted-foreground">Manage your privacy settings</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="profile-visibility" className="text-foreground">
                    Public profile
                  </Label>
                  <Switch id="profile-visibility" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-contact" className="text-foreground">
                    Show contact information
                  </Label>
                  <Switch id="show-contact" defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
