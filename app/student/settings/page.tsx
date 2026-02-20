"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ThemeToggle } from "@/components/theme-toggle"
import { Bell, Mail, Shield, Palette, Lock, Eye, BellRing, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function StudentSettings() {
  return (
    <main className="flex-1 bg-[#f8fafc] dark:bg-[#0b1120] min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-md p-6 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-black text-foreground tracking-tight">Account Settings</h1>
            <Badge variant="outline" className="rounded-full border-primary/20 text-primary uppercase tracking-widest text-[10px] bg-primary/5">Security</Badge>
          </div>
          <p className="text-muted-foreground font-medium text-sm sm:text-base">Fine-tune your research experience and account security.</p>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8 max-w-4xl mx-auto mb-20">
        {/* Appearance Section */}
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2 px-2">
            <Palette className="h-4 w-4" />
            Visual Interface
          </h2>
          <Card className="border-border/50 bg-background/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm hover:shadow-md transition-all ring-1 ring-primary/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 shrink-0">
                  <Palette className="h-6 w-6 text-indigo-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Theme Customization</h3>
                  <p className="text-sm text-muted-foreground font-medium">Switch between light and dark modes</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-muted/30 p-2 rounded-2xl border border-border/50">
                <span className="text-xs font-bold text-muted-foreground px-2">Interface Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </Card>
        </section>

        {/* Notifications Section */}
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2 px-2">
            <BellRing className="h-4 w-4" />
            Alerts & Notifications
          </h2>
          <Card className="border-border/50 bg-background/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm ring-1 ring-primary/5">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 shrink-0">
                  <Bell className="h-6 w-6 text-amber-500" />
                </div>
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">In-App Alerts</h3>
                    <p className="text-sm text-muted-foreground font-medium">Control what events trigger a desktop notification</p>
                  </div>
                  
                  <div className="grid gap-6">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/10 hover:bg-muted/30 transition-colors">
                      <Label htmlFor="thesis-updates" className="text-sm font-bold cursor-pointer">Thesis status updates</Label>
                      <Switch id="thesis-updates" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/10 hover:bg-muted/30 transition-colors">
                      <Label htmlFor="supervisor-feedback" className="text-sm font-bold cursor-pointer">Supervisor feedback</Label>
                      <Switch id="supervisor-feedback" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/10 hover:bg-muted/30 transition-colors">
                      <Label htmlFor="deadline-reminders" className="text-sm font-bold cursor-pointer">Deadline reminders</Label>
                      <Switch id="deadline-reminders" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/30" />

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 shrink-0">
                  <Mail className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Email Deliveries</h3>
                    <p className="text-sm text-muted-foreground font-medium">Configure your primary contact inbox</p>
                  </div>
                  <div className="grid gap-6">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/10">
                      <Label htmlFor="email-notifications" className="text-sm font-bold">Digest & Summaries</Label>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Security Section */}
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2 px-2">
            <Shield className="h-4 w-4" />
            Privacy & Security
          </h2>
          <Card className="border-border/50 bg-background/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm ring-1 ring-primary/5">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 shrink-0">
                  <Eye className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Public Visibility</h3>
                      <p className="text-sm text-muted-foreground font-medium">Manage how others view your research profile</p>
                    </div>
                    <Switch id="profile-visibility" defaultChecked />
                  </div>
                </div>
              </div>

              <Separator className="bg-border/30" />

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 shrink-0">
                  <Lock className="h-6 w-6 text-rose-500" />
                </div>
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Account Access</h3>
                    <p className="text-sm text-muted-foreground font-medium">Secure your account with a strong password</p>
                  </div>
                  <Button variant="outline" className="rounded-xl font-bold py-6 px-8 border-border hover:bg-muted transition-all text-foreground h-auto">
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </main>
  )
}
