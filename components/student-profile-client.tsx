"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, MapPin, Calendar, FileText, User, Award, Phone } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { updateStudentProfile } from "@/app/actions/profile"
import { toast } from "sonner"

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
    <main className="flex-1 overflow-auto">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            {isOwnProfile ? "My Profile" : "Student Profile"}
          </h1>
          <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
            {isOwnProfile ? "Review and update your personal and academic information" : "View student information"}
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {isOwnProfile ? (
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="theses">Theses</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              {/* Profile Card */}
              <Card className="border-border bg-card p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xl font-bold">
                      {student.full_name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("") || "S"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground">{student.full_name}</h2>
                    <p className="text-muted-foreground">{student.department}</p>
                  </div>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:scale-105"
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-foreground text-sm sm:text-base">{student.email}</p>
                    </div>
                  </div>
                  {student.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-foreground text-sm sm:text-base">{student.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Department</p>
                      <p className="text-foreground text-sm sm:text-base">{student.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Registration</p>
                      <p className="text-foreground text-sm sm:text-base">{student.student_id}</p>
                    </div>
                  </div>
                  {student.session && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Session</p>
                        <p className="text-foreground text-sm sm:text-base">{student.session}</p>
                      </div>
                    </div>
                  )}
                  {student.semester && (
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Semester</p>
                        <p className="text-foreground text-sm sm:text-base">{student.semester}</p>
                      </div>
                    </div>
                  )}
                  {student.degree && (
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Degree</p>
                        <p className="text-foreground text-sm sm:text-base">{student.degree}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Member Since</p>
                      <p className="text-foreground text-sm sm:text-base">
                        {new Date(student.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Bio Card */}
              {student.bio && (
                <Card className="border-border bg-card p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold text-primary">Bio</h2>
                  </div>
                  <p className="text-muted-foreground text-sm sm:text-base">🙶 {student.bio}</p>
                </Card>
              )}

              {/* Edit Form */}
              {isEditing && (
                <Card className="border-border bg-card p-8">
                  <h3 className="text-lg font-semibold text-foreground mb-6">Edit Profile Information</h3>
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Name</Label>
                        <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
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
                        <Label htmlFor="session">Session</Label>
                        <Input id="session" name="session" value={formData.session} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="semester">Semester</Label>
                        <Input id="semester" name="semester" value={formData.semester} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
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
                        placeholder="Tell us about yourself..."
                        className="min-h-24"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-accent">
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

            <TabsContent value="theses" className="space-y-4 mb-10">
              <h3 className="text-xl font-bold text-foreground mb-4">Published Theses</h3>
              <p className="text-muted-foreground">No theses published yet.</p>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-6">
            <Card className="border-border bg-card p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xl font-bold">
                    {student.full_name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("") || "S"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground">{student.full_name}</h2>
                  <p className="text-muted-foreground">{student.department}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-foreground text-sm sm:text-base">{student.email}</p>
                  </div>
                </div>
                {student.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-foreground text-sm sm:text-base">{student.phone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Department</p>
                    <p className="text-foreground text-sm sm:text-base">{student.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Registration</p>
                    <p className="text-foreground text-sm sm:text-base">{student.student_id}</p>
                  </div>
                </div>
                {student.session && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Session</p>
                      <p className="text-foreground text-sm sm:text-base">{student.session}</p>
                    </div>
                  </div>
                )}
                {student.semester && (
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Semester</p>
                      <p className="text-foreground text-sm sm:text-base">{student.semester}</p>
                    </div>
                  </div>
                )}
                {student.degree && (
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Degree</p>
                      <p className="text-foreground text-sm sm:text-base">{student.degree}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {student.bio && (
              <Card className="border-border bg-card p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-primary">Bio</h2>
                </div>
                <p className="text-muted-foreground text-sm sm:text-base">🙶 {student.bio}</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
