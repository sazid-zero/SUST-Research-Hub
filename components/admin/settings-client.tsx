"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Loader2, Shield, Globe, HardDrive, Settings as SettingsIcon, Mail, ToggleLeft, UserPlus, CheckCircle2, Sparkles, LayoutDashboard } from "lucide-react"
import { updateSystemSettings } from "@/app/actions/admin"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface SystemSettings {
  systemName: string
  systemEmail: string
  maxFileSize: string
  maintenanceMode: boolean
  allowNewRegistrations: boolean
  requireEmailVerification: boolean
  autoApproveThesis: boolean
}

interface SettingsClientProps {
  initialSettings: SystemSettings
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [settings, setSettings] = useState<SystemSettings>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await updateSystemSettings(settings)
      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.error)
      }
    } catch (err) {
      toast.error("Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-[#0b1120] min-h-screen">
      {/* Header Area */}
      <div className="relative overflow-hidden bg-white dark:bg-[#0f172a] border-b border-border/50 px-6 py-10 sm:py-12 md:py-16">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-primary/5 to-transparent pointer-events-none" />
          <div className="max-w-6xl mx-auto relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold uppercase tracking-widest border border-orange-500/20">
                          <SettingsIcon className="h-3 w-3" />
                          Platform Configuration
                      </div>
                      <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                        System <span className="bg-linear-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">Preferences</span>
                      </h1>
                      <p className="text-muted-foreground font-medium max-w-lg">
                        Fine-tune platform behavior, manage registration protocols, and control system-wide maintenance states.
                      </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard">
                        <Button variant="ghost" className="font-bold text-muted-foreground hover:bg-muted rounded-2xl h-14 px-6">
                            Cancel
                        </Button>
                    </Link>
                    <Button 
                      className="bg-linear-to-r from-orange-500 to-rose-500 hover:scale-105 transition-all text-white font-bold h-14 px-8 rounded-2xl shadow-xl shadow-orange-500/20 border-none" 
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                      ) : (
                        <Save className="h-5 w-5 mr-3" />
                      )}
                      Save All Core Settings
                    </Button>
                  </div>
              </div>
          </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 sm:p-8 space-y-12 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column: Platform Identity */}
            <div className="lg:col-span-2 space-y-10">
                <section className="space-y-6">
                    <div className="flex items-center gap-2 px-2">
                        <Globe className="h-4 w-4 text-blue-500" />
                        <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Platform Identity</h2>
                    </div>
                    <Card className="border-border/50 bg-background/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm ring-1 ring-primary/5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label htmlFor="systemName" className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest ml-1">
                                    Portal Name
                                </Label>
                                <Input
                                    id="systemName"
                                    name="systemName"
                                    value={settings.systemName}
                                    onChange={handleInputChange}
                                    className="bg-muted/20 border-border/50 h-12 rounded-2xl focus:ring-primary/20 focus:border-primary/50 transition-all font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="systemEmail" className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest ml-1">
                                    Support Email
                                </Label>
                                <Input
                                    id="systemEmail"
                                    name="systemEmail"
                                    type="email"
                                    value={settings.systemEmail}
                                    onChange={handleInputChange}
                                    className="bg-muted/20 border-border/50 h-12 rounded-2xl focus:ring-primary/20 focus:border-primary/50 transition-all font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-3 pt-8 border-t border-border/30 mt-8">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="maxFileSize" className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest ml-1">
                                    Maximum File Size
                                </Label>
                                <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase">{settings.maxFileSize} MB</Badge>
                            </div>
                            <div className="flex gap-4 items-center">
                                <Input
                                    id="maxFileSize"
                                    name="maxFileSize"
                                    type="number"
                                    value={settings.maxFileSize}
                                    onChange={handleInputChange}
                                    className="bg-muted/20 border-border/50 h-12 rounded-2xl focus:ring-primary/20 focus:border-primary/50 transition-all font-bold w-40"
                                />
                                <p className="text-xs font-medium text-muted-foreground italic">
                                    Maximum allowed size for research papers and archive document uploads.
                                </p>
                            </div>
                        </div>
                    </Card>
                </section>

                <section className="space-y-6">
                    <div className="flex items-center gap-2 px-2">
                        <Shield className="h-4 w-4 text-emerald-500" />
                        <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Flow Integrity</h2>
                    </div>
                    <Card className="border-border/50 bg-background/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm ring-1 ring-primary/5 divide-y divide-border/30">
                        <div className="flex items-start justify-between gap-6 p-6 hover:bg-muted/5 transition-all rounded-t-3xl">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-black text-foreground uppercase tracking-tight">Maintenance Protocol</p>
                                    <Badge className="bg-orange-500/10 text-orange-600 border-none text-[9px] font-black uppercase whitespace-nowrap">Root Only</Badge>
                                </div>
                                <p className="text-xs font-medium text-muted-foreground max-w-md">Suspend platform operations for standard users. Administrative overrides remain active.</p>
                            </div>
                            <Switch
                                className="data-[state=checked]:bg-orange-500"
                                checked={settings.maintenanceMode}
                                onCheckedChange={(checked: boolean) => handleSwitchChange("maintenanceMode", checked)}
                            />
                        </div>

                        <div className="flex items-start justify-between gap-6 p-6 hover:bg-muted/5 transition-all">
                            <div className="space-y-1">
                                <p className="text-sm font-black text-foreground uppercase tracking-tight">Onboarding Access</p>
                                <p className="text-xs font-medium text-muted-foreground max-w-md">Toggle public registration gates. Restrict identity creation to administrative provisioning only.</p>
                            </div>
                            <Switch
                                className="data-[state=checked]:bg-blue-500"
                                checked={settings.allowNewRegistrations}
                                onCheckedChange={(checked: boolean) => handleSwitchChange("allowNewRegistrations", checked)}
                            />
                        </div>

                        <div className="flex items-start justify-between gap-6 p-6 hover:bg-muted/5 transition-all rounded-b-3xl">
                            <div className="space-y-1">
                                <p className="text-sm font-black text-foreground uppercase tracking-tight">Autonomous Validation</p>
                                <p className="text-xs font-medium text-muted-foreground max-w-md">Enable zero-touch research approval. New submissions bypass the manual administrative triage queue.</p>
                            </div>
                            <Switch
                                className="data-[state=checked]:bg-emerald-500"
                                checked={settings.autoApproveThesis}
                                onCheckedChange={(checked: boolean) => handleSwitchChange("autoApproveThesis", checked)}
                            />
                        </div>
                    </Card>
                </section>
            </div>

            {/* Right Column: Intelligence & Security */}
            <div className="space-y-10">
                <section className="space-y-6">
                    <div className="flex items-center gap-2 px-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Communications</h2>
                    </div>
                    <Card className="border-border/50 bg-linear-to-br from-primary/5 to-accent/5 p-8 rounded-3xl shadow-sm border ring-1 ring-primary/5">
                        <h4 className="text-sm font-black text-foreground mb-4 uppercase tracking-tighter">Notification Backbone</h4>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                    <ToggleLeft className="h-5 w-5 text-primary" />
                                </div>
                                <span className="text-xs font-bold text-muted-foreground/80 leading-relaxed italic">SMTP processes are synchronized with system environment variables.</span>
                            </div>
                            <div className="bg-white/50 dark:bg-black/20 p-4 rounded-2xl border border-border/30">
                                <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">
                                    Electronic mail configurations are currently immutable via UI for security compliance. Coordinate with the Infrastructure Core for server updates.
                                </p>
                            </div>
                        </div>
                    </Card>
                </section>

                <section className="space-y-6">
                    <div className="flex items-center gap-2 px-2">
                        <Shield className="h-4 w-4 text-emerald-500" />
                        <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Infrastructure</h2>
                    </div>
                    <Card className="border-border/50 bg-card/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-dashed ring-1 ring-emerald-500/5">
                        <h4 className="text-sm font-black text-foreground mb-4 uppercase tracking-tighter">Security Perimeter</h4>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                </div>
                                <span className="text-xs font-bold text-muted-foreground/80">Advanced Identity (SSO) Active</span>
                            </div>
                            <p className="text-[10px] font-medium text-muted-foreground/60 leading-relaxed pl-1">
                                Platform-wide multi-factor authentication and IP-based access control lists are enforced by the primary kernel.
                            </p>
                        </div>
                    </Card>
                </section>
            </div>
        </div>
      </div>
    </div>
  )
}
