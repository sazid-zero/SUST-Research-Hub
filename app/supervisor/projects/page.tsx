"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, XCircle, Eye } from "lucide-react"
import Link from "next/link"
import { getProjects } from "@/lib/data/projects"

export default function SupervisorProjectsPage() {
  const allProjects = getProjects()

  const pendingRequests = allProjects.filter((p) => p.status === "active_no_supervisor").slice(0, 3)
  const inProgress = allProjects.filter((p) => p.status === "in_progress")
  const pendingReview = allProjects.filter((p) => p.status === "pending_review")
  const published = allProjects.filter((p) => p.status === "published")

  const stats = [
    { label: "Pending Requests", value: pendingRequests.length.toString(), icon: Clock, color: "text-yellow-600" },
    { label: "In Progress", value: inProgress.length.toString(), icon: Clock, color: "text-blue-600" },
    { label: "Pending Review", value: pendingReview.length.toString(), icon: Eye, color: "text-purple-600" },
    { label: "Published", value: published.length.toString(), icon: CheckCircle, color: "text-green-600" },
  ]

  const getStatusBadge = (status: string) => {
    const config = {
      active_no_supervisor: { label: "Pending Assignment", color: "bg-yellow-100 text-yellow-800" },
      in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-800" },
      pending_review: { label: "Pending Review", color: "bg-purple-100 text-purple-800" },
      published: { label: "Published", color: "bg-green-100 text-green-800" },
    }
    const item = config[status as keyof typeof config]
    return <Badge className={item.color}>{item.label}</Badge>
  }

  return (
    <main className="flex-1 overflow-y-auto mb-20 md:mb-0">
      <div className="border-b border-border bg-card p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Student Projects</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage supervision requests and monitor student progress
        </p>
      </div>

      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <Card key={idx} className="border-border bg-card p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                  </div>
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                </div>
              </Card>
            )
          })}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4 sm:mb-6">
            <TabsTrigger value="requests" className="text-xs sm:text-sm">
              Requests ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-xs sm:text-sm">
              In Progress ({inProgress.length})
            </TabsTrigger>
            <TabsTrigger value="review" className="text-xs sm:text-sm">
              Review ({pendingReview.length})
            </TabsTrigger>
            <TabsTrigger value="published" className="text-xs sm:text-sm">
              Published ({published.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            {pendingRequests.map((project) => (
              <Card key={project.id} className="border-border bg-card p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground">{project.title}</h3>
                      {getStatusBadge(project.status)}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{project.abstract}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">Team:</span>
                      {project.collaborators.map((collab, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                            <AvatarFallback className="text-xs">{collab.userName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-foreground">{collab.userName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs sm:text-sm h-8 sm:h-9 bg-transparent">
                      <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            {inProgress.map((project) => (
              <Card key={project.id} className="border-border bg-card p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground">{project.title}</h3>
                      {getStatusBadge(project.status)}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{project.abstract}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">Team:</span>
                      {project.collaborators.map((collab, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                            <AvatarFallback className="text-xs">{collab.userName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-foreground">{collab.userName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link href={`/supervisor/projects/${project.id}`}>
                    <Button size="sm" variant="outline" className="text-xs sm:text-sm h-8 sm:h-9 bg-transparent">
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      View Progress
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="review" className="space-y-4">
            {pendingReview.map((project) => (
              <Card key={project.id} className="border-border bg-card p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground">{project.title}</h3>
                      {getStatusBadge(project.status)}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{project.abstract}</p>
                    <p className="text-xs text-muted-foreground">
                      Submitted {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Link href={`/supervisor/projects/${project.id}/review`}>
                    <Button size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Review Now
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="published" className="space-y-4">
            {published.map((project) => (
              <Card key={project.id} className="border-border bg-card p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground">{project.title}</h3>
                      {getStatusBadge(project.status)}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{project.abstract}</p>
                    <p className="text-xs text-muted-foreground">
                      Published {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Link href={`/thesis/${project.id}`}>
                    <Button size="sm" variant="outline" className="text-xs sm:text-sm h-8 sm:h-9 bg-transparent">
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      View Publication
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
