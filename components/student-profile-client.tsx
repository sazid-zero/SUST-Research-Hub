"use client"

import Link from "next/link"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, MapPin, Calendar, FileText, User, Award, Phone, GraduationCap, School, BookOpen, Edit2, Shield, BellRing, UserCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { updateStudentProfile } from "@/app/actions/profile"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"

interface StudentProfileClientProps {
  student: any
  isOwnProfile: boolean
  currentUserRole?: string
}

export function StudentProfileClient({ student, isOwnProfile, currentUserRole }: StudentProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: student.full_name || "",
    email: student.email || "",
    phone: student.phone || "",
    department: student.department || "",
    bio: student.bio || "",
    session: student.session || "",
    semester: student.semester || "",
    degree: student.degree || "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    const result = await updateStudentProfile(formData)
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
                <AvatarFallback className="bg-linear-to-br from-primary to-accent text-primary-foreground text-4xl font-black">
                  {student.full_name?.split(" ").map((n: string) => n[0]).join("") || "S"}
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
                  {student.full_name}
                </h1>
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors uppercase tracking-widest text-[10px] font-bold px-3 py-1">
                  Student
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5 bg-background/50 backdrop-blur-sm px-3 py-1 rounded-full border border-border/50 text-sm">
                  <School className="h-4 w-4 text-primary" />
                  {student.department}
                </div>
                <div className="flex items-center gap-1.5 bg-background/50 backdrop-blur-sm px-3 py-1 rounded-full border border-border/50 text-sm">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Reg: {student.student_id}
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
                    !isEditing && "bg-linear-to-r from-primary to-accent hover:scale-105 shadow-xl shadow-primary/20 border-none"
                  )}
                >
                  {isEditing ? "Discard Changes" : "Redesign Profile"}
                </Button>
                {isEditing && (
                  <Button onClick={handleSave} className="rounded-xl font-bold bg-primary px-8 py-6 h-auto shadow-xl shadow-primary/20">
                    Save Changes
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Info & Stats */}
            <div className="lg:col-span-1 space-y-8">
              <Card className="p-6 rounded-3xl border-border/50 bg-background/80 backdrop-blur-md shadow-sm">
                <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-primary" />
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-muted/50 transition-colors group">
                    <div className="p-2 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 mb-0.5">Email</p>
                      <p className="text-sm font-semibold">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-muted/50 transition-colors group">
                    <div className="p-2 rounded-xl bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors">
                      <Phone className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 mb-0.5">Phone</p>
                      <p className="text-sm font-semibold">{student.phone || "Not set"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-muted/50 transition-colors group">
                    <div className="p-2 rounded-xl bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors">
                      <Calendar className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 mb-0.5">Joined Hub</p>
                      <p className="text-sm font-semibold">{new Date(student.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 rounded-3xl border-border/50 bg-background/80 backdrop-blur-md shadow-sm overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                  <BookOpen className="h-32 w-32" />
                </div>
                <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-indigo-500" />
                  Academic Status
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 hover:bg-indigo-500/10 transition-colors">
                    <p className="text-[9px] uppercase tracking-widest font-bold text-indigo-400 mb-1">Session</p>
                    <p className="text-sm font-bold">{student.session || "N/A"}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
                    <p className="text-[9px] uppercase tracking-widest font-bold text-primary mb-1">Semester</p>
                    <p className="text-sm font-bold">{student.semester || "N/A"}</p>
                  </div>
                  <div className="col-span-2 p-4 rounded-2xl bg-slate-500/5 border border-slate-500/10 hover:bg-slate-500/10 transition-colors">
                    <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mb-1">Degree</p>
                    <p className="text-sm font-bold">{student.degree || "B.Sc. in Engineering"}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column: Content/Editor */}
            <div className="lg:col-span-2 space-y-8">
              {isEditing ? (
                <Card className="p-8 rounded-3xl border-border/50 bg-background shadow-xl ring-1 ring-primary/5">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Edit2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold tracking-tight">Edit Your Identity</h2>
                      <p className="text-xs text-muted-foreground font-medium">Refine how you appear to supervisors and peers.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2.5">
                        <Label htmlFor="fullName" className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Full Name</Label>
                        <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} className="rounded-xl bg-muted/30 border-none focus:ring-2 focus:ring-primary h-12 px-4 font-medium" />
                      </div>
                      <div className="space-y-2.5">
                        <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Institutional Email</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="rounded-xl bg-muted/30 border-none focus:ring-2 focus:ring-primary h-12 px-4 font-medium" />
                      </div>
                      <div className="space-y-2.5">
                        <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Contact Number</Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="rounded-xl bg-muted/30 border-none focus:ring-2 focus:ring-primary h-12 px-4 font-medium" />
                      </div>
                      <div className="space-y-2.5">
                        <Label htmlFor="department" className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Department</Label>
                        <Input id="department" name="department" value={formData.department} onChange={handleInputChange} className="rounded-xl bg-muted/30 border-none focus:ring-2 focus:ring-primary h-12 px-4 font-medium" />
                      </div>
                      <div className="space-y-2.5">
                        <Label htmlFor="session" className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Academic Session</Label>
                        <Input id="session" name="session" value={formData.session} onChange={handleInputChange} className="rounded-xl bg-muted/30 border-none focus:ring-2 focus:ring-primary h-12 px-4 font-medium" />
                      </div>
                      <div className="space-y-2.5">
                        <Label htmlFor="semester" className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Current Semester</Label>
                        <Input id="semester" name="semester" value={formData.semester} onChange={handleInputChange} className="rounded-xl bg-muted/30 border-none focus:ring-2 focus:ring-primary h-12 px-4 font-medium" />
                      </div>
                      <div className="space-y-2.5 md:col-span-2">
                        <Label htmlFor="degree" className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Degree Program</Label>
                        <Input id="degree" name="degree" value={formData.degree} onChange={handleInputChange} className="rounded-xl bg-muted/30 border-none focus:ring-2 focus:ring-primary h-12 px-4 font-medium" />
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="bio" className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Short Biography / Research Interests</Label>
                      <Textarea 
                        id="bio" 
                        name="bio" 
                        value={formData.bio} 
                        onChange={handleInputChange} 
                        placeholder="Tell us about yourself and your research path..."
                        className="rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-primary min-h-[160px] p-4 font-medium leading-relaxed" 
                      />
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="space-y-8">
                  <Card className="p-10 rounded-3xl border-border/50 bg-background shadow-sm relative overflow-hidden group">
                    <div className="absolute -top-12 -right-12 h-40 w-40 bg-primary/5 rounded-full blur-3xl" />
                    <h3 className="text-base font-black text-foreground uppercase tracking-wider mb-6 flex items-center gap-3">
                      <User className="h-5 w-5 text-primary" />
                      Biographical Summary
                    </h3>
                    <div className="relative">
                      <p className="text-lg text-foreground/80 leading-relaxed font-medium italic">
                        {student.bio ? `"${student.bio}"` : "This researcher has not added a biography yet. Edit your profile to introduce yourself to supervisors and potential team members."}
                      </p>
                    </div>
                  </Card>

                  <Tabs defaultValue="theses" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="theses">Research Portfolio</TabsTrigger>
                      <TabsTrigger value="insights">Hub Status</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="theses" className="mt-8 space-y-6">
                      {/* Theses Section */}
                      {student.theses?.length > 0 ? (
                        <div className="space-y-4">
                          <h4 className="text-sm font-black text-foreground uppercase tracking-wider flex items-center gap-2 mb-2">
                             <BookOpen className="h-4 w-4 text-primary" />
                             Theses ({student.theses.length})
                          </h4>
                          {student.theses.map((thesis: any) => (
                            <Link key={thesis.id} href={`/thesis/${thesis.id}`} className="block group">
                              <Card className="p-5 rounded-2xl border-border/50 bg-background/50 backdrop-blur-sm hover:bg-muted/30 transition-all border-l-4 border-l-primary/30 group-hover:border-l-primary">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{thesis.title}</h5>
                                  <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary border-primary/20 bg-primary/5">{thesis.year}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                                  {thesis.abstract}
                                </p>
                                <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                                  <span className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {thesis.supervisor_name}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(thesis.created_at).getFullYear()}
                                  </span>
                                </div>
                              </Card>
                            </Link>
                          ))}
                        </div>
                      ) : null}

                      {/* Publications Section */}
                      {student.publications?.length > 0 ? (
                        <div className="space-y-4">
                          <h4 className="text-sm font-black text-foreground uppercase tracking-wider flex items-center gap-2 mt-8 mb-2">
                             <FileText className="h-4 w-4 text-accent" />
                             Published Papers ({student.publications.length})
                          </h4>
                          {student.publications.map((pub: any) => (
                            <Link key={pub.id} href={`/paper/${pub.id}`} className="block group">
                              <Card className="p-5 rounded-2xl border-border/50 bg-background/50 backdrop-blur-sm hover:bg-muted/30 transition-all border-l-4 border-l-accent/30 group-hover:border-l-accent">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-bold text-foreground group-hover:text-accent transition-colors line-clamp-1">{pub.title}</h5>
                                  <Badge variant="outline" className="text-[10px] uppercase font-bold text-accent border-accent/20 bg-accent/5">{pub.year}</Badge>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                  <Badge variant="secondary" className="text-[9px] h-4 py-0 font-bold uppercase ring-1 ring-inset ring-accent/20 bg-accent/5 text-accent">{pub.publication_type}</Badge>
                                  <span className="text-xs text-muted-foreground font-medium truncate italic">{pub.journal_name}</span>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                                  <span className="flex items-center gap-1">
                                    <Award className="h-3 w-3" />
                                    {pub.citations || 0} Citations
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {pub.year}
                                  </span>
                                </div>
                              </Card>
                            </Link>
                          ))}
                        </div>
                      ) : null}

                      {(!student.theses || student.theses.length === 0) && (!student.publications || student.publications.length === 0) && (
                        <div className="flex flex-col items-center justify-center p-16 bg-muted/20 border-2 border-dashed border-border/50 rounded-3xl">
                          <div className="p-4 rounded-3xl bg-background shadow-sm mb-4">
                            <BookOpen className="h-8 w-8 text-muted-foreground/40" />
                          </div>
                          <h4 className="text-lg font-bold text-foreground">No Published Works</h4>
                          <p className="text-sm text-muted-foreground text-center max-w-sm mt-1">Complete your research projects and datasets to showcase them in your hub portfolio.</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="insights" className="mt-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-6 rounded-3xl bg-linear-to-br from-primary/5 to-accent/5 border border-primary/10">
                          <div className="flex items-center gap-3 mb-4">
                            <BellRing className="h-5 w-5 text-primary" />
                            <h4 className="text-sm font-bold tracking-tight">System Status</h4>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">Account verified and synchronized with SUST Hub services.</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

