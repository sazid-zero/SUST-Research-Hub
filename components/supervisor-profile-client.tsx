"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Phone, MapPin, Calendar, Award } from "lucide-react"
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
    setFormData((prev) => ({ ...prev, [name]: value }))
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
    <main className="flex-1">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            {isOwnProfile ? "My Profile" : "Supervisor Profile"}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {isOwnProfile ? "Manage your account information and settings" : "View supervisor information"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <div className="max-w-full">
          {isOwnProfile ? (
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile Information</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                {/* Profile Header */}
                <Card className="border-border bg-card p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xl font-bold">
                        {supervisor.full_name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("") || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                        {supervisor.full_name}
                      </h2>
                      <p className="text-sm sm:text-base text-muted-foreground">{supervisor.designation}</p>
                      <p className="text-sm sm:text-base text-muted-foreground mt-1">{supervisor.department}</p>
                    </div>
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:scale-105"
                    >
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                  </div>

                  {/* Profile Details */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm sm:text-base text-foreground">{supervisor.email}</p>
                      </div>
                    </div>
                    {supervisor.phone && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="text-sm sm:text-base text-foreground">{supervisor.phone}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Department</p>
                        <p className="text-sm sm:text-base text-foreground">{supervisor.department}</p>
                      </div>
                    </div>
                    {supervisor.designation && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Award className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Designation</p>
                          <p className="text-sm sm:text-base text-foreground">{supervisor.designation}</p>
                        </div>
                      </div>
                    )}
                    {supervisor.degree && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Award className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Degree</p>
                          <p className="text-sm sm:text-base text-foreground">{supervisor.degree}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Member Since</p>
                        <p className="text-sm sm:text-base text-foreground">
                          {new Date(supervisor.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                {supervisor.bio && (
                  <Card className="border-border bg-card p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-primary mb-2">Bio</h2>
                        <p className="text-sm sm:text-base text-muted-foreground">{supervisor.bio}</p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Edit Form */}
                {isEditing && (
                  <Card className="border-border bg-card p-8">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Edit Profile Information</h3>
                    <div className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Input
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="designation">Designation</Label>
                          <Input
                            id="designation"
                            name="designation"
                            value={formData.designation}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="degree">Degree</Label>
                          <Input id="degree" name="degree" value={formData.degree} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell us about your research interests..."
                          className="min-h-24"
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card className="border-border bg-card p-8">
                  <h3 className="text-lg font-semibold text-foreground mb-6">Account Settings</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-border">
                      <div>
                        <p className="font-medium text-foreground">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates about new submissions</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-border" />
                    </div>
                    <div className="pt-4">
                      <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                        Change Password
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-6">
              <Card className="border-border bg-card p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xl font-bold">
                      {supervisor.full_name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("") || "S"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{supervisor.full_name}</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">{supervisor.designation}</p>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1">{supervisor.department}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm sm:text-base text-foreground">{supervisor.email}</p>
                    </div>
                  </div>
                  {supervisor.phone && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm sm:text-base text-foreground">{supervisor.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Department</p>
                      <p className="text-sm sm:text-base text-foreground">{supervisor.department}</p>
                    </div>
                  </div>
                  {supervisor.designation && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Award className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Designation</p>
                        <p className="text-sm sm:text-base text-foreground">{supervisor.designation}</p>
                      </div>
                    </div>
                  )}
                  {supervisor.degree && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Award className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Degree</p>
                        <p className="text-sm sm:text-base text-foreground">{supervisor.degree}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {supervisor.bio && (
                <Card className="border-border bg-card p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-primary mb-2">Bio</h2>
                      <p className="text-sm sm:text-base text-muted-foreground">{supervisor.bio}</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
