"use client"

import { useState } from "react"
import { X, Plus, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createProject, createNotification } from "@/lib/data/projects"
import type { ProjectCollaborator } from "@/lib/data/projects"

interface CreateProjectModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function CreateProjectModal({ onClose, onSuccess }: CreateProjectModalProps) {
  const [title, setTitle] = useState("")
  const [abstract, setAbstract] = useState("")
  const [field, setField] = useState("")
  const [department, setDepartment] = useState("")
  const [keywords, setKeywords] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState("")
  const [coAuthors, setCoAuthors] = useState<string[]>([])
  const [coAuthorInput, setCoAuthorInput] = useState("")

  const handleAddKeyword = () => {
    if (keywordInput.trim() && keywords.length < 5) {
      setKeywords([...keywords, keywordInput.trim()])
      setKeywordInput("")
    }
  }

  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index))
  }

  const handleAddCoAuthor = () => {
    if (coAuthorInput.trim() && coAuthors.length < 5) {
      setCoAuthors([...coAuthors, coAuthorInput.trim()])
      setCoAuthorInput("")
    }
  }

  const handleRemoveCoAuthor = (index: number) => {
    setCoAuthors(coAuthors.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const collaborators: ProjectCollaborator[] = [
      {
        id: "1",
        userId: "student1",
        userName: "Sharif Mahmud",
        userEmail: "sharif@example.com",
        role: "primary_author",
        invitationStatus: "accepted",
        invitedAt: new Date().toISOString(),
        acceptedAt: new Date().toISOString(),
      },
      ...coAuthors.map((email, idx) => ({
        id: String(idx + 2),
        userId: `user_${idx + 2}`,
        userName: email.split('@')[0],
        userEmail: email,
        role: "co_author" as const,
        invitationStatus: "pending" as const,
        invitedAt: new Date().toISOString(),
      })),
    ]

    const newProject = createProject({
      title,
      abstract,
      field,
      department,
      keywords,
      status: coAuthors.length > 0 ? "draft_pending_team" : "active_no_supervisor",
      createdBy: "student1",
      createdByName: "Sharif Mahmud",
      collaborators,
      files: [],
    })

    coAuthors.forEach((email) => {
      createNotification({
        userId: `user_${email}`,
        type: "project_invitation",
        title: "Project Invitation",
        message: `Sharif Mahmud invited you to collaborate on "${title}"`,
        read: false,
        actionUrl: `/student/projects/${newProject.id}`,
        actionLabel: "View Invitation",
      })
    })

    // Reset form manually
    setTitle("")
    setAbstract("")
    setField("")
    setDepartment("")
    setKeywords([])
    setCoAuthors([])
    
    onSuccess()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-card border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Create New Project</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div>
            <Label htmlFor="title" className="text-foreground font-medium text-sm sm:text-base">
              Project Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
              className="mt-2 bg-input border-border text-foreground placeholder:text-muted-foreground text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <Label htmlFor="abstract" className="text-foreground font-medium text-sm sm:text-base">
              Abstract *
            </Label>
            <textarea
              id="abstract"
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Brief description of your project"
              className="mt-2 w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
              rows={4}
              required
            />
          </div>

          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            <div>
              <Label htmlFor="field" className="text-foreground font-medium text-sm sm:text-base">
                Field *
              </Label>
              <Select value={field} onValueChange={setField} required>
                <SelectTrigger className="mt-2 bg-input border-border text-foreground text-sm sm:text-base">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="department" className="text-foreground font-medium text-sm sm:text-base">
                Department *
              </Label>
              <Select value={department} onValueChange={setDepartment} required>
                <SelectTrigger className="mt-2 bg-input border-border text-foreground text-sm sm:text-base">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="Computer Science & Engineering">Computer Science & Engineering</SelectItem>
                  <SelectItem value="Electrical & Electronic Engineering">Electrical & Electronic Engineering</SelectItem>
                  <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                  <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-foreground font-medium text-sm sm:text-base">
              Keywords (up to 5)
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddKeyword())}
                placeholder="Add keyword"
                className="bg-input border-border text-foreground placeholder:text-muted-foreground text-sm sm:text-base"
              />
              <Button type="button" onClick={handleAddKeyword} className="text-sm sm:text-base h-9 sm:h-10">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {keywords.map((keyword, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                >
                  <span className="text-xs sm:text-sm">{keyword}</span>
                  <button type="button" onClick={() => handleRemoveKeyword(idx)}>
                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-foreground font-medium text-sm sm:text-base">
              Co-Authors (Optional)
            </Label>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Add email addresses of collaborators. They'll receive invitations to join.
            </p>
            <div className="flex gap-2 mt-2">
              <Input
                value={coAuthorInput}
                onChange={(e) => setCoAuthorInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCoAuthor())}
                placeholder="colleague@example.com"
                type="email"
                className="bg-input border-border text-foreground placeholder:text-muted-foreground text-sm sm:text-base"
              />
              <Button type="button" onClick={handleAddCoAuthor} className="text-sm sm:text-base h-9 sm:h-10">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {coAuthors.map((email, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/50 border border-border"
                >
                  <span className="text-xs sm:text-sm text-foreground">{email}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCoAuthor(idx)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-border hover:bg-muted bg-transparent text-sm sm:text-base h-9 sm:h-10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base h-9 sm:h-10"
            >
              Create Project
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
