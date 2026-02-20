"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Mail, Phone, MapPin, Calendar, Award, GraduationCap, School, Edit2, Shield, BellRing, UserCircle, Briefcase, BookOpen } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { updateSupervisorProfile } from "@/app/actions/profile"
import { toast } from "sonner"

interface SupervisorProfileClientProps {
  supervisor: any
  isOwnProfile: boolean
  currentUserRole?: string
}

export function SupervisorProfileClient({ supervisor, isOwnProfile, currentUserRole }: SupervisorProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: supervisor.full_name || "",
    email: supervisor.email || "",
    phone: supervisor.phone || "",
    department: supervisor.department || "",
    designation: supervisor.designation || "",
    bio: supervisor.bio || "",
    degree: supervisor.degree || "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    const result = await updateSupervisorProfile(formData)
    if (result.success) {
      toast.success("Profile updated successfully!")
      setIsEditing(false)
      window.location.reload()
    } else {
      toast.error(result.error || "Failed to update profile")
    }
  }

  return (
    <main className="flex-1 bg-[#f8fafc] dark:bg-[#0b1120] min-h-screen">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-48 bg-linear-to-r from-primary/20 via-primary/10 to-accent/20 border-b border-border/50" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-12">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            <div className="relative group">
              <Avatar className="h-40 w-40 border-4 border-background shadow-2xl rounded-3xl overflow-hidden ring-4 ring-primary/5">
                <AvatarFallback className="bg-linear-to-br from-primary to-accent text-primary-foreground text-4xl font-black uppercase">
                  {supervisor.full_name?.split(" ").map((n: string) => n[0]).join("") || "S"}
                </AvatarFallback>
              </Avatar>
              {isOwnProfile && (
                <button className="absolute bottom-2 right-2 p-2 bg-primary text-primary-foreground rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit2 className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="flex-1 mb-4">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
                  {supervisor.full_name}
                </h1>
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors uppercase tracking-widest text-[10px] font-bold px-3 py-1">
                  Supervisor
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5 bg-background/50 backdrop-blur-sm px-3 py-1 rounded-full border border-border/50 text-sm">
                  <Briefcase className="h-4 w-4 text-primary" />
                  {supervisor.designation || "Faculty Member"}
                </div>
                <div className="flex items-center gap-1.5 bg-background/50 backdrop-blur-sm px-3 py-1 rounded-full border border-border/50 text-sm">
                  <School className="h-4 w-4 text-primary" />
                  {supervisor.department}
                </div>
              </div>
            </div>

            {isOwnProfile && (
              <div className="flex gap-3 mb-4">
                <Button 
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "outline" : "default"}
                  className={cn(
                    "rounded-xl font-bold transition-all px-6 py-6 h-auto",
                    !isEditing && "bg-linear-to-r from-primary to-accent hover:scale-105 shadow-xl shadow-primary/20 border-none px-8"
                  )}
                >
                  {isEditing ? "Discard" : "Update Profile"}
                </Button>
                {isEditing && (
                  <Button onClick={handleSave} className="rounded-xl font-bold bg-primary px-8 py-6 h-auto shadow-xl shadow-primary/20">
                    Save Changes
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="mt-12">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="overview">Hub Overview</TabsTrigger>
                {isOwnProfile && <TabsTrigger value="settings">Account Security</TabsTrigger>}
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Stats & Info */}
                  <div className="lg:col-span-1 space-y-8">
                    <Card className="p-6 rounded-3xl border-border/50 bg-background/80 backdrop-blur-md shadow-sm">
                      <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
                        <UserCircle className="h-4 w-4 text-primary" />
                        Professional Info
                      </h3>
                      <div className="space-y-6">
                        <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-muted/50 transition-colors group">
                          <div className="p-2 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                            <Mail className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 mb-0.5">Contact Email</p>
                            <p className="text-sm font-semibold truncate">{supervisor.email}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-muted/50 transition-colors group">
                          <div className="p-2 rounded-xl bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors">
                            <Phone className="h-5 w-5 text-orange-500" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 mb-0.5">Phone</p>
                            <p className="text-sm font-semibold">{supervisor.phone || "Not scheduled"}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-muted/50 transition-colors group">
                          <div className="p-2 rounded-xl bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors">
                            <GraduationCap className="h-5 w-5 text-emerald-500" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 mb-0.5">Highest Degree</p>
                            <p className="text-sm font-semibold">{supervisor.degree || "Ph.D. Candidate"}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-muted/50 transition-colors group">
                          <div className="p-2 rounded-xl bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors">
                            <Calendar className="h-5 w-5 text-indigo-500" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 mb-0.5">Faculty Since</p>
                            <p className="text-sm font-semibold">{new Date(supervisor.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</p>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 rounded-3xl border-border/50 bg-background/80 backdrop-blur-md shadow-sm">
                      <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Award className="h-4 w-4 text-amber-500" />
                        Research Focus
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="rounded-lg py-1.5 px-3 border-border font-bold text-xs bg-muted/30">AI/ML</Badge>
                        <Badge variant="outline" className="rounded-lg py-1.5 px-3 border-border font-bold text-xs bg-muted/30">Cybersecurity</Badge>
                        <Badge variant="outline" className="rounded-lg py-1.5 px-3 border-border font-bold text-xs bg-muted/30">HCI</Badge>
                      </div>
                    </Card>
                  </div>

                  {/* Right Column: Bio & Editor */}
                  <div className="lg:col-span-2 space-y-8">
                    {isEditing ? (
                      <Card className="p-8 rounded-3xl border-border/50 bg-background shadow-xl ring-1 ring-primary/5">
                        <div className="flex items-center gap-3 mb-8">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Edit2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold tracking-tight">Refine Your Profile</h2>
                            <p className="text-xs text-muted-foreground font-medium">Keep your credentials and bio up to date for students.</p>
                          </div>
                        </div>
                        
                        <div className="space-y-8">
                          <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2.5">
                              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Full Name</Label>
                              <Input name="fullName" value={formData.fullName} onChange={handleInputChange} className="rounded-xl bg-muted/30 border-none focus:ring-2 focus:ring-primary h-12 px-4" />
                            </div>
                            <div className="space-y-2.5">
                              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Faculty Email</Label>
                              <Input name="email" type="email" value={formData.email} onChange={handleInputChange} className="rounded-xl bg-muted/30 border-none focus:ring-2 focus:ring-primary h-12 px-4" />
                            </div>
                            <div className="space-y-2.5">
                              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Phone</Label>
                              <Input name="phone" value={formData.phone} onChange={handleInputChange} className="rounded-xl bg-muted/30 border-none focus:ring-2 focus:ring-primary h-12 px-4" />
                            </div>
                            <div className="space-y-2.5">
                              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Department</Label>
                              <Input name="department" value={formData.department} onChange={handleInputChange} className="rounded-xl bg-muted/30 border-none focus:ring-2 focus:ring-primary h-12 px-4" />
                            </div>
                            <div className="space-y-2.5">
                              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Current Designation</Label>
                              <Input name="designation" value={formData.designation} onChange={handleInputChange} className="rounded-xl bg-muted/30 border-none focus:ring-2 focus:ring-primary h-12 px-4" />
                            </div>
                            <div className="space-y-2.5">
                              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Highest Degree</Label>
                              <Input name="degree" value={formData.degree} onChange={handleInputChange} className="rounded-xl bg-muted/30 border-none focus:ring-2 focus:ring-primary h-12 px-4" />
                            </div>
                          </div>
                          <div className="space-y-2.5">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Professional Biography</Label>
                            <Textarea 
                              name="bio" 
                              value={formData.bio} 
                              onChange={handleInputChange} 
                              placeholder="Describe your research interests and academic background..."
                              className="rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-primary min-h-[160px] p-4 text-sm leading-relaxed" 
                            />
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <div className="space-y-8">
                        <Card className="p-10 rounded-3xl border-border/50 bg-background shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
                            <BookOpen className="h-32 w-32" />
                          </div>
                          <h3 className="text-base font-black text-foreground uppercase tracking-wider mb-6 flex items-center gap-3">
                            <Award className="h-5 w-5 text-primary" />
                            Faculty Bio
                          </h3>
                          <p className="text-lg text-foreground/80 leading-relaxed font-medium italic relative z-10">
                            {supervisor.bio ? `"${supervisor.bio}"` : "This supervisor has not provided a biography yet. Complete your profile to highlight your expertise to students."}
                          </p>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <Card className="p-6 rounded-3xl border-border/50 bg-background shadow-sm border-l-4 border-l-primary">
                             <h4 className="font-bold text-foreground mb-1">Supervision Quota</h4>
                             <p className="text-xs text-muted-foreground mb-4">Currently supervising 12 active projects</p>
                             <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                               <div className="h-full bg-primary rounded-full w-[60%]" />
                             </div>
                           </Card>
                           <Card className="p-6 rounded-3xl border-border/50 bg-background shadow-sm border-l-4 border-l-accent">
                             <h4 className="font-bold text-foreground mb-1">Publications</h4>
                             <p className="text-xs text-muted-foreground mb-4">Last update: 2 days ago</p>
                             <div className="flex -space-x-2">
                               <div className="h-8 w-8 rounded-full border-2 border-background bg-slate-100 flex items-center justify-center text-[10px] font-bold">P1</div>
                               <div className="h-8 w-8 rounded-full border-2 border-background bg-slate-100 flex items-center justify-center text-[10px] font-bold">P2</div>
                               <div className="h-8 w-8 rounded-full border-2 border-background bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">+5</div>
                             </div>
                           </Card>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {isOwnProfile && (
                <TabsContent value="settings">
                  <Card className="p-10 rounded-3xl border-border/50 bg-background shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold tracking-tight">Security & Preferences</h2>
                        <p className="text-xs text-muted-foreground font-medium">Manage how you interact with the research platform.</p>
                      </div>
                    </div>

                    <div className="space-y-10">
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20">
                        <div>
                          <p className="font-bold text-foreground">Email Notifications</p>
                          <p className="text-xs text-muted-foreground">Receive instant alerts for new supervision requests</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20">
                        <div>
                          <p className="font-bold text-foreground">Active Supervision</p>
                          <p className="text-xs text-muted-foreground">Allow students to see your current workload</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <Separator className="bg-border/50" />

                      <div>
                        <Button variant="outline" className="rounded-xl py-6 h-auto border-border text-foreground hover:bg-muted font-bold transition-all">
                          Change Account Password
                        </Button>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  )
}
