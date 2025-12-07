"use client"

import type React from "react"

import { use, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
    Upload,
    X,
    FileText,
    Download,
    Send,
    Clock,
    CheckCircle,
    MessageSquare,
    UserCheck,
    Code2,
    Database, Brain, BarChart3, Image
} from "lucide-react"
import { getProjectById, createSupervisorRequest } from "@/lib/data/projects"
import Link from "next/link"

const mockSupervisors = [
  {
    id: "supervisor1",
    name: "Dr. Ahmed Hassan",
    department: "Computer Science & Engineering",
    specialization: "Machine Learning",
    currentProjects: 5,
  },
  {
    id: "supervisor2",
    name: "Dr. Sarah Khan",
    department: "Computer Science & Engineering",
    specialization: "IoT & Networks",
    currentProjects: 3,
  },
  {
    id: "supervisor3",
    name: "Dr. Michael Wong",
    department: "Computer Science & Engineering",
    specialization: "Blockchain & Security",
    currentProjects: 4,
  },
  {
    id: "supervisor4",
    name: "Dr. Emily Davis",
    department: "Electrical & Electronic Engineering",
    specialization: "Power Systems",
    currentProjects: 6,
  },
]

export default function ProjectWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const project = getProjectById(id)

  const [files, setFiles] = useState<{ name: string; type: string; size: number }[]>([])
  const [keywords, setKeywords] = useState<string[]>(["Machine Learning", "AI"])
  const [keywordInput, setKeywordInput] = useState("")
  const [activity] = useState([
    { user: "Sarah", action: "uploaded thesis.pdf", time: "2 hours ago" },
    { user: "Ahmed", action: "added comments on methodology", time: "5 hours ago" },
    { user: "You", action: "updated abstract", time: "1 day ago" },
  ])

  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [selectedSupervisor, setSelectedSupervisor] = useState<string>("")
  const [requestMessage, setRequestMessage] = useState("")
    const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)

  if (!project) {
    return (
      <main className="flex-1 p-4 sm:p-6">
        <Card className="border-border bg-card p-6 text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Project Not Found</h2>
          <p className="text-sm text-muted-foreground mb-4">The project you're looking for doesn't exist.</p>
          <Link href="/student/projects">
            <Button>Back to Projects</Button>
          </Link>
        </Card>
      </main>
    )
  }

  const availableSupervisors = mockSupervisors.filter((s) => s.department === project.department)

  const handleAddKeyword = () => {
    if (keywordInput.trim() && keywords.length < 5) {
      setKeywords([...keywords, keywordInput.trim()])
      setKeywordInput("")
    }
  }

  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index))
  }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "document" | "code" | "dataset" | "model" | "result") => {
        const uploaded = e.target.files
        if (!uploaded) return

        // In real app: save with correct resource_type
        console.log("Uploading as:", type, Array.from(uploaded))

        // Example: show uploaded files per section (optional enhancement)
    }

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSendRequest = () => {
    if (!selectedSupervisor || !requestMessage.trim()) return

    const supervisor = availableSupervisors.find((s) => s.id === selectedSupervisor)
    if (!supervisor) return

    createSupervisorRequest({
      projectId: project.id,
      supervisorId: supervisor.id,
      supervisorName: supervisor.name,
      status: "pending",
      requestMessage: requestMessage.trim(),
    })

    setIsRequestDialogOpen(false)
    setSelectedSupervisor("")
    setRequestMessage("")

    // Show success message (in real app, use toast)
    alert(`Supervision request sent to ${supervisor.name}!`)
  }

  const getStatusBadge = () => {
    const statusConfig = {
      draft_pending_team: { label: "Pending Team", color: "bg-yellow-100 text-yellow-800" },
      active_no_supervisor: { label: "Need Supervisor", color: "bg-orange-100 text-orange-800" },
      pending_supervisor: { label: "Pending Supervisor", color: "bg-blue-100 text-blue-800" },
      in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-800" },
      pending_review: { label: "Under Review", color: "bg-purple-100 text-purple-800" },
      published: { label: "Published", color: "bg-green-100 text-green-800" },
    }
    const config = statusConfig[project.status as keyof typeof statusConfig]
    return <Badge className={config.color}>{config.label}</Badge>
  }

    function LinkManager() {
        const [links, setLinks] = useState<string[]>([])
        const [input, setInput] = useState("")

        const addLink = () => {
            const url = input.trim()
            if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
                setLinks([...links, url])
                setInput("")
            }
        }

        const removeLink = (index: number) => {
            setLinks(links.filter((_, i) => i !== index))
        }

        // @ts-ignore
        return (
            <div className="space-y-3">
                {/* Show all added links */}
                {links.map((link, i) => (
                    <div key={i} className="flex items-center justify-between bg-muted/50 px-4 py-2.5 rounded-lg">
                        <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate mr-3">
                            {link}
                        </a>
                        <button onClick={() => removeLink(i)} className="text-muted-foreground hover:text-destructive">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}

                {/* Always show one empty input for next link */}
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLink())}
                        placeholder="https://github.com/username/repo"
                        className="flex-1"
                    />
                    <Button onClick={addLink} size="sm"> Add Link
        </Button>
      </div>

      {input && !input.startsWith("http") && (
        <p className="text-xs text-red-600">Please include http:// or https://</p>
      )}
    </div>
  )
}

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 mb-20">
          {/* Header */}
          <div className="border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      {/* Left: Title + Status */}
                      <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                              <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate pr-4">
                                  {project.title}
                              </h1>
                              {getStatusBadge()}
                          </div>
                          <p className="text-sm text-muted-foreground mt-4">
                              Created on {new Date(project.createdAt).toLocaleDateString()} • {project.department}
                          </p>

                          {/* Team Members – Compact */}
                          <div className="flex items-center gap-3 mt-4 flex-wrap">
                              <span className="text-sm font-medium text-muted-foreground">Team:</span>
                              {project.collaborators.map((collab, idx) => (
                                  <div key={idx} className="flex items-center gap-2">
                                      <Avatar className="h-7 w-7">
                                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                              {collab.userName.charAt(0)}
                                          </AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm text-foreground">{collab.userName}</span>
                                      {collab.role === "primary_author" && (
                                          <Badge variant="secondary" className="text-xs">Lead</Badge>
                                      )}
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* Right: Action Buttons – This is the star */}
                      <div className="flex flex-col gap-3 sm:items-end">
                          {/* Only show Submit button when ready */}
                          {project.status === "in_progress" && (
                              <Button
                                  size="lg"
                                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 px-8"
                                  onClick={() => setIsSubmitDialogOpen(true)}
                              >
                                  <Send className="h-5 w-5 mr-2" />
                                  Submit for Review
                              </Button>
                          )}

                          {/* Draft Save – subtle */}
                          <Button variant="outline" size="sm" className="w-full sm:w-auto mt-4">
                              Save Draft
                          </Button>
                      </div>
                  </div>
              </div>
        </div>

        {/* Tabs Content */}
        <div className="p-3 sm:p-4 md:p-6">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-4 sm:mb-6 h-auto">
              <TabsTrigger value="overview" className="text-xs sm:text-sm py-2">
                Overview
              </TabsTrigger>
              <TabsTrigger value="content" className="text-xs sm:text-sm py-2">
                Content
              </TabsTrigger>
              <TabsTrigger value="files" className="text-xs sm:text-sm py-2">
                Files
              </TabsTrigger>
              <TabsTrigger value="activity" className="text-xs sm:text-sm py-2">
                Activity
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs sm:text-sm py-2">
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                  <Card className="border-border bg-card p-4 md:p-6">
                      <h2 className="text-md md:text-lg font-semibold text-foreground "> Research Overview</h2>

                      <div className="space-y-6">
                          {/* Abstract */}
                          <div>
                              <Label className="text-sm font-medium text-muted-foreground">Abstract</Label>
                              <p className="mt-2 text-foreground leading-relaxed text-sm">
                                  {project.abstract}
                              </p>
                          </div>

                          {/* Keywords */}
                          <div>
                              <Label className="text-sm font-medium text-muted-foreground">Keywords</Label>
                              <div className="mt-3 flex flex-wrap gap-2">
                                  {keywords.length > 0 ? (
                                      keywords.map((keyword, idx) => (
                                          <Badge
                                              key={idx}
                                              variant="secondary"
                                              className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary border border-primary/20"
                                          >
                                              {keyword}
                                          </Badge>
                                      ))
                                  ) : (
                                      <p className="text-sm text-muted-foreground italic">No keywords added yet</p>
                                  )}
                              </div>
                          </div>

                          {/* Field & Supervisor */}
                          <div className="grid gap-6 md:grid-cols-2">
                              <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Research Field</Label>
                                  <p className="mt-2 text-md font-medium text-foreground">{project.field}</p>
                              </div>
                              <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Supervisor</Label>
                                  <p className="mt-2 text-md font-medium text-foreground">
                                      {project.supervisorName || (
                                          <span className="text-muted-foreground italic">Not assigned yet</span>
                                      )}
                                  </p>
                              </div>
                          </div>
                      </div>
                  </Card>

                  {/* Timeline Card (unchanged) */}
                  <Card className="border-border bg-card p-6 md:p-8">
                      <h2 className="text-xl font-bold text-foreground mb-6">Timeline</h2>
                      <div className="space-y-5">
                          <div className="flex items-start gap-4">
                              <CheckCircle className="h-6 w-6 text-emerald-600 mt-0.5 flex-shrink-0" />
                              <div>
                                  <p className="font-medium text-foreground">Project Created</p>
                                  <p className="text-sm text-muted-foreground">
                                      {new Date(project.createdAt).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                      })}
                                  </p>
                              </div>
                          </div>
                          <div className="flex items-start gap-4">
                              <Clock className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
                              <div>
                                  <p className="font-medium text-foreground">Currently Active</p>
                                  <p className="text-sm text-muted-foreground">Team collaboration in progress</p>
                              </div>
                          </div>
                      </div>
                  </Card>
              </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4 sm:space-y-6">
              <Card className="border-border bg-card p-3 sm:p-4 md:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Research Content</h2>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-foreground font-medium text-xs sm:text-sm">
                      Title
                    </Label>
                    <Input
                      id="title"
                      defaultValue={project.title}
                      className="mt-2 bg-input border-border text-foreground text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="abstract" className="text-foreground font-medium text-xs sm:text-sm">
                      Abstract
                    </Label>
                    <textarea
                      id="abstract"
                      defaultValue={project.abstract}
                      className="mt-2 w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground text-xs sm:text-sm"
                      rows={6}
                    />
                  </div>

                  <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="department" className="text-foreground font-medium text-xs sm:text-sm">
                        Department
                      </Label>
                      <Select defaultValue="cse">
                        <SelectTrigger className="mt-2 bg-input border-border text-foreground text-xs sm:text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cse">Computer Science & Engineering</SelectItem>
                          <SelectItem value="eee">Electrical & Electronic Engineering</SelectItem>
                          <SelectItem value="ce">Civil Engineering</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="field" className="text-foreground font-medium text-xs sm:text-sm">
                        Field
                      </Label>
                      <Input
                        id="field"
                        defaultValue={project.field}
                        className="mt-2 bg-input border-border text-foreground text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border-border bg-card p-3 sm:p-4 md:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Keywords</h2>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddKeyword())}
                      placeholder="Add keyword and press Enter"
                      className="bg-input border-border text-foreground text-xs sm:text-sm"
                    />
                    <Button
                      type="button"
                      onClick={handleAddKeyword}
                      size="sm"
                      className="text-xs sm:text-sm h-8 sm:h-9"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        <span className="text-xs sm:text-sm">{keyword}</span>
                        <button type="button" onClick={() => handleRemoveKeyword(idx)} className="hover:opacity-70">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Files Tab */}
              <TabsContent value="files" className="space-y-8">
                  {[
                      { title: "Documents", icon: FileText, accept: ".pdf,.docx,.pptx,.doc", type: "document", hasLinks: false },
                      { title: "Code Repository", icon: Code2, accept: ".zip,.rar,.7z", type: "code", hasLinks: true },
                      { title: "Datasets", icon: Database, accept: ".csv,.json,.parquet,.zip", type: "dataset", hasLinks: true },
                      { title: "Trained Models", icon: Brain, accept: ".pth,.pt,.h5,.onnx,.safetensors", type: "model", hasLinks: true },
                      { title: "Results & Images", icon: BarChart3, accept: "image/*,.csv,.xlsx,.pdf", type: "result", hasLinks: false },
                  ].map(({ title, icon: Icon, accept, type, hasLinks }) => (
                      <Card key={title} className="p-6 border-border bg-card">
                          <h3 className="font-semibold text-foreground flex items-center gap-2 ">
                              <Icon className="h-5 w-5 text-primary" />
                              {title}
                          </h3>

                          {/* Only show link section for Code, Datasets, Models */}
                          {hasLinks && <LinkManager />}

                          {/* File Upload – Always shown */}
                          <div className="mt-2">
                              <p className="text-sm font-medium text-foreground mb-3">Upload files (optional)</p>
                              <label className="block">
                                  <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:bg-muted/50 transition cursor-pointer">
                                      <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                      <p className="font-medium">Click to upload or drag & drop</p>
                                      <p className="text-sm text-muted-foreground mt-1">Supported: {accept}</p>
                                  </div>
                                  <input
                                      type="file"
                                      multiple
                                      accept={accept}
                                      className="hidden"
                                      onChange={(e) => e.target.files?.length && console.log(`${title} files:`, e.target.files)}
                                  />
                              </label>
                          </div>
                      </Card>
                  ))}
              </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <Card className="border-border bg-card p-3 sm:p-4 md:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Recent Activity</h2>
                <div className="space-y-3 sm:space-y-4">
                  {activity.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="text-xs">{item.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-foreground">
                          <span className="font-medium">{item.user}</span> {item.action}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3">
                  <Label className="text-xs sm:text-sm font-medium text-foreground">Add Comment</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Write a comment..."
                      className="bg-input border-border text-foreground text-xs sm:text-sm"
                    />
                    <Button size="sm" className="h-8 sm:h-9">
                      <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4 sm:space-y-6">
              <Card className="border-border bg-card p-3 sm:p-4 md:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Team Management</h2>
                <div className="space-y-3 sm:space-y-4">
                  {project.collaborators.map((collab, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{collab.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-foreground">{collab.userName}</p>
                          <p className="text-xs text-muted-foreground capitalize">{collab.role.replace("_", " ")}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${collab.invitationStatus === "accepted" ? "text-green-600" : "text-yellow-600"}`}
                      >
                        {collab.invitationStatus}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {(project.status === "active_no_supervisor" || project.status === "pending_supervisor") && (
                <Card className="border-border bg-card p-3 sm:p-4 md:p-6">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <UserCheck className="h-5 w-5 text-primary" />
                    <h2 className="text-base sm:text-lg font-semibold text-foreground">Supervisor Assignment</h2>
                  </div>

                  {project.status === "pending_supervisor" ? (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                      <Clock className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-foreground">Supervision request pending</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Waiting for supervisor response. You'll be notified once they accept or decline.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                        Select a supervisor from your department ({project.department}) to guide your research project.
                      </p>

                      <div className="space-y-3">
                        <Label className="text-xs sm:text-sm font-medium text-foreground">Available Supervisors</Label>
                        <Select value={selectedSupervisor} onValueChange={setSelectedSupervisor}>
                          <SelectTrigger className="bg-input border-border text-foreground text-xs sm:text-sm">
                            <SelectValue placeholder="Select a supervisor" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSupervisors.map((supervisor) => (
                              <SelectItem key={supervisor.id} value={supervisor.id}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{supervisor.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {supervisor.specialization} • {supervisor.currentProjects} projects
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {selectedSupervisor && (
                          <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
                            {(() => {
                              const supervisor = availableSupervisors.find((s) => s.id === selectedSupervisor)
                              return supervisor ? (
                                <div className="space-y-2">
                                  <p className="text-xs sm:text-sm font-medium text-foreground">{supervisor.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Specialization: {supervisor.specialization}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Current Projects: {supervisor.currentProjects}
                                  </p>
                                </div>
                              ) : null
                            })()}
                          </div>
                        )}

                        <Button
                          onClick={() => setIsRequestDialogOpen(true)}
                          disabled={!selectedSupervisor}
                          size="sm"
                          className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9 mt-2"
                        >
                          <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Send Supervision Request
                        </Button>
                      </div>
                    </>
                  )}
                </Card>
              )}

              {project.supervisorId && (
                <Card className="border-border bg-card p-3 sm:p-4 md:p-6">
                  <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Supervisor</h2>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-foreground">{project.supervisorName}</p>
                      <p className="text-xs text-muted-foreground">Supervising your project</p>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
        <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Submit Thesis for Review?</DialogTitle>
                </DialogHeader>
                <div className="py-6 space-y-5">
                    <div className="flex gap-4">
                        <CheckCircle className="h-12 w-12 text-emerald-600 flex-shrink-0" />
                        <div className="space-y-3">
                            <p className="font-semibold">You are submitting:</p>
                            <p className="text-lg font-bold text-foreground">{project.title}</p>
                            <p className="text-sm text-muted-foreground">
                                After submission, the thesis will be locked and sent to your supervisor for final approval.
                            </p>
                        </div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex gap-3">
                        <Clock className="h-5 w-5 text-amber-600 flex-shrink-0" />
                        <p className="text-sm">You will no longer be able to edit the content after confirming.</p>
                    </div>
                </div>
                <DialogFooter className="gap-3">
                    <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                        onClick={() => {
                            alert("Thesis successfully submitted! Your supervisor has been notified.")
                            setIsSubmitDialogOpen(false)
                            // Update project status in real app
                        }}
                    >
                        <Send className="h-4 w-4 mr-2" />
                        Confirm & Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Supervision Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-medium text-foreground mb-2">Supervisor</Label>
              <p className="text-sm text-muted-foreground">
                {availableSupervisors.find((s) => s.id === selectedSupervisor)?.name}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground mb-2">Project</Label>
              <p className="text-sm text-muted-foreground">{project.title}</p>
            </div>
            <div>
              <Label htmlFor="message" className="text-sm font-medium text-foreground mb-2">
                Request Message *
              </Label>
              <Textarea
                id="message"
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Explain why you'd like this supervisor to guide your research..."
                className="min-h-[120px] bg-input border-border text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Include your research topic, methodology, and why you chose this supervisor.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendRequest} disabled={!requestMessage.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
