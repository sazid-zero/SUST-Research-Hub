"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, Edit } from "lucide-react"
import Link from "next/link"

const supervisorResearch = [
  {
    id: 101,
    title: "Advanced Machine Learning Techniques in Medical Imaging",
    abstract: "Exploring deep learning models for automated disease detection...",
    field: "Machine Learning",
    status: "published",
    collaborators: ["Dr. Sarah Johnson", "Ahmed Khan (Student)"],
    published_date: "2024-10-15",
  },
  {
    id: 102,
    title: "Blockchain Applications in Supply Chain Management",
    abstract: "Investigating the use of blockchain technology for transparent supply chains...",
    field: "Blockchain",
    status: "in_progress",
    collaborators: ["Dr. Ahmed Hassan", "Fatima Ali (Student)"],
    published_date: null,
  },
]

export default function SupervisorResearchPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    const config = {
      in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-800" },
      published: { label: "Published", color: "bg-green-100 text-green-800" },
    }
    const item = config[status as keyof typeof config]
    return <Badge className={item.color}>{item.label}</Badge>
  }

  return (
    <main className="w-full">
      <div className="border-b border-border bg-card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">My Research</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Manage your personal research and collaborations
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Research Project
          </Button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        {supervisorResearch.map((research) => (
          <Card key={research.id} className="border-border bg-card p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">{research.title}</h3>
                  {getStatusBadge(research.status)}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{research.abstract}</p>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    <span className="font-medium">Field:</span> {research.field}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    <span className="font-medium">Collaborators:</span> {research.collaborators.join(", ")}
                  </p>
                  {research.published_date && (
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      <span className="font-medium">Published:</span>{" "}
                      {new Date(research.published_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {research.status === "published" ? (
                  <Link href={`/thesis/${research.id}`}>
                    <Button size="sm" variant="outline" className="text-xs sm:text-sm h-8 sm:h-9 bg-transparent">
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/supervisor/research/${research.id}`}>
                    <Button size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Continue Editing
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  )
}
