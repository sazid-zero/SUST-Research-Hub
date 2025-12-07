"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ThemeToggle } from "@/components/theme-toggle"
import { Bell, Mail, Shield, Palette } from "lucide-react"

export default function StudentSettings() {
  return (
    <main className="flex-1 mb-20">
      <div className="border-b border-border bg-card p-3 sm:p-4 md:p-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage your account preferences</p>
        </div>
      </div>

      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 max-w-full lg:max-w-4xl">
        <Card className="border-border bg-card p-3 sm:p-4 md:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
              <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">Appearance</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Customize how the app looks</p>
              <div className="flex items-center justify-between">
                <Label htmlFor="theme" className="text-foreground text-sm sm:text-base">
                  Theme
                </Label>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-border bg-card p-3 sm:p-4 md:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">Notifications</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Manage your notification preferences</p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="thesis-updates" className="text-foreground text-sm sm:text-base">
                    Thesis status updates
                  </Label>
                  <Switch id="thesis-updates" defaultChecked />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="supervisor-feedback" className="text-foreground text-sm sm:text-base">
                    Supervisor feedback
                  </Label>
                  <Switch id="supervisor-feedback" defaultChecked />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="deadline-reminders" className="text-foreground text-sm sm:text-base">
                    Deadline reminders
                  </Label>
                  <Switch id="deadline-reminders" defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-border bg-card p-3 sm:p-4 md:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">Email Preferences</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Control what emails you receive</p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="email-notifications" className="text-foreground text-sm sm:text-base">
                    Email notifications
                  </Label>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="weekly-digest" className="text-foreground text-sm sm:text-base">
                    Weekly digest
                  </Label>
                  <Switch id="weekly-digest" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-border bg-card p-3 sm:p-4 md:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">Privacy</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Manage your privacy settings</p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="profile-visibility" className="text-foreground text-sm sm:text-base">
                    Public profile
                  </Label>
                  <Switch id="profile-visibility" defaultChecked />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="show-email" className="text-foreground text-sm sm:text-base">
                    Show email address
                  </Label>
                  <Switch id="show-email" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
