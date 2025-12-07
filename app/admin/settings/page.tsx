"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save } from "lucide-react"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    systemName: "SUST Thesis Repository",
    systemEmail: "admin@sust-thesis.edu.bd",
    maxFileSize: "50",
    maintenanceMode: false,
    allowNewRegistrations: true,
    requireEmailVerification: true,
    autoApproveThesis: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">System Settings</h1>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card className="border-border bg-card p-8 mb-10">
                <h3 className="text-lg font-semibold text-foreground mb-6">General Settings</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="systemName" className="text-foreground">
                      System Name
                    </Label>
                    <Input
                      id="systemName"
                      name="systemName"
                      value={settings.systemName}
                      onChange={handleInputChange}
                      className="border-border bg-background text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="systemEmail" className="text-foreground">
                      System Email
                    </Label>
                    <Input
                      id="systemEmail"
                      name="systemEmail"
                      type="email"
                      value={settings.systemEmail}
                      onChange={handleInputChange}
                      className="border-border bg-background text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize" className="text-foreground">
                      Max File Size (MB)
                    </Label>
                    <Input
                      id="maxFileSize"
                      name="maxFileSize"
                      type="number"
                      value={settings.maxFileSize}
                      onChange={handleInputChange}
                      className="border-border bg-background text-foreground"
                    />
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div>
                      <p className="font-medium text-foreground">Maintenance Mode</p>
                      <p className="text-sm text-muted-foreground">Disable access for all users except admins</p>
                    </div>
                    <input
                      type="checkbox"
                      name="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onChange={handleInputChange}
                      className="h-5 w-5 rounded border-border"
                    />
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div>
                      <p className="font-medium text-foreground">Allow New Registrations</p>
                      <p className="text-sm text-muted-foreground">Allow new users to create accounts</p>
                    </div>
                    <input
                      type="checkbox"
                      name="allowNewRegistrations"
                      checked={settings.allowNewRegistrations}
                      onChange={handleInputChange}
                      className="h-5 w-5 rounded border-border"
                    />
                  </div>

                  <Button className="bg-primary hover:bg-primary/90">
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <Card className="border-border bg-card p-8">
                <h3 className="text-lg font-semibold text-foreground mb-6">Security Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div>
                      <p className="font-medium text-foreground">Require Email Verification</p>
                      <p className="text-sm text-muted-foreground">
                        Users must verify email before accessing the system
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      name="requireEmailVerification"
                      checked={settings.requireEmailVerification}
                      onChange={handleInputChange}
                      className="h-5 w-5 rounded border-border"
                    />
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div>
                      <p className="font-medium text-foreground">Auto-Approve Thesis</p>
                      <p className="text-sm text-muted-foreground">Automatically approve thesis submissions</p>
                    </div>
                    <input
                      type="checkbox"
                      name="autoApproveThesis"
                      checked={settings.autoApproveThesis}
                      onChange={handleInputChange}
                      className="h-5 w-5 rounded border-border"
                    />
                  </div>

                  <Button className="bg-primary hover:bg-primary/90">
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Email Settings */}
            <TabsContent value="email" className="space-y-6">
              <Card className="border-border bg-card p-8">
                <h3 className="text-lg font-semibold text-foreground mb-6">Email Configuration</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtpServer" className="text-foreground">
                      SMTP Server
                    </Label>
                    <Input
                      id="smtpServer"
                      placeholder="smtp.gmail.com"
                      className="border-border bg-background text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpPort" className="text-foreground">
                      SMTP Port
                    </Label>
                    <Input id="smtpPort" placeholder="587" className="border-border bg-background text-foreground" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emailUsername" className="text-foreground">
                      Email Username
                    </Label>
                    <Input
                      id="emailUsername"
                      placeholder="your-email@gmail.com"
                      className="border-border bg-background text-foreground"
                    />
                  </div>

                  <Button className="bg-primary hover:bg-primary/90">
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
