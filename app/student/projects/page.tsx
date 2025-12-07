"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Clock, CheckCircle, FileText, AlertCircle } from "lucide-react"
import Link from "next/link"
import { getProjectsByUser } from "@/lib/data/projects"
import type { Project } from "@/lib/data/projects"
import { CreateProjectModal } from "@/components/create-project-modal"

export default function StudentProjectsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [projects, setProjects] = useState<Project[]>(getProjectsByUser("student1"))

  const myProjects = projects.filter((p) => p.createdBy === "student1")
  const collaborations = projects.filter((p) => p.createdBy !== "student1")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "pending_review":
        return "bg-yellow-100 text-yellow-800"
      case "draft_pending_team":
        return "bg-gray-100 text-gray-800"
      case "active_no_supervisor":
        return "bg-orange-100 text-orange-800"
      case "pending_supervisor":
        return "bg-purple-100 text-purple-800"
      case "changes_requested":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "pending_review":
      case "pending_supervisor":
        return <Clock className="h-4 w-4" />
      case "changes_requested":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const stats = [
    { label: "Total Projects", value: projects.length.toString(), icon: FileText, color: "text-primary" },
    {
      label: "In Progress",
      value: projects.filter((p) => p.status === "in_progress").length.toString(),
      icon: Clock,
      color: "text-blue-600",
    },
    {
      label: "Published",
      value: projects.filter((p) => p.status === "published").length.toString(),
      icon: CheckCircle,
      color: "text-green-600",
    },
    { label: "Collaborations", value: collaborations.length.toString(), icon: Users, color: "text-purple-600" },
  ]

  return (
    <div className="flex min-h-screen w-full bg-background">
      <main className="mb-20 w-full">
        <div className="border-b border-border bg-card p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">My Projects</h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Manage your research projects and collaborations
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 text-sm sm:text-base h-9 sm:h-10"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create Project</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 md:space-y-8">
          {/* Stats */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <Card key={idx} className="border-border bg-card p-3 sm:p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mt-1 sm:mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 ${stat.color}`} />
                  </div>
                </Card>
              )
            })}
          </div>

          {/* My Projects */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">My Projects</h2>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
              {myProjects.length === 0 ? (
                <Card className="col-span-full border-border bg-card p-8 text-center">
                  <p className="text-muted-foreground">No projects yet. Create your first project to get started!</p>
                </Card>
              ) : (
                myProjects.map((project) => (
                  <Link key={project.id} href={`/student/projects/${project.id}`}>
                    <Card className="border-border bg-card p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-base sm:text-lg font-semibold text-foreground flex-1 line-clamp-2">
                          {project.title}
                        </h3>
                        <Badge
                          className={`${getStatusColor(project.status)} text-xs flex items-center gap-1 flex-shrink-0`}
                        >
                          {getStatusIcon(project.status)}
                          {getStatusLabel(project.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.abstract}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>
                            {project.collaborators.filter((c) => c.invitationStatus === "accepted").length} members
                          </span>
                        </div>
                        {project.supervisorName && (
                          <div className="flex items-center gap-1">
                            <span>•</span>
                            <span>Supervisor: {project.supervisorName}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 ml-auto">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Collaborations */}
          {collaborations.length > 0 && (
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">Collaborations</h2>
              <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
                {collaborations.map((project) => (
                  <Link key={project.id} href={`/student/projects/${project.id}`}>
                    <Card className="border-border bg-card p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-base sm:text-lg font-semibold text-foreground flex-1 line-clamp-2">
                          {project.title}
                        </h3>
                        <Badge
                          className={`${getStatusColor(project.status)} text-xs flex items-center gap-1 flex-shrink-0`}
                        >
                          {getStatusIcon(project.status)}
                          {getStatusLabel(project.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.abstract}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <span>Created by: {project.createdByName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>•</span>
                          <Users className="h-3 w-3" />
                          <span>
                            {project.collaborators.filter((c) => c.invitationStatus === "accepted").length} members
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setProjects(getProjectsByUser("student1"))
            setShowCreateModal(false)
          }}
        />
      )}
    </div>
  )
}
