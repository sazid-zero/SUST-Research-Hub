"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"
import type { ThesisWithAuthors } from "@/lib/db/theses"

interface ThesisCardProps {
  thesis: ThesisWithAuthors
}

export function ThesisCard({ thesis }: ThesisCardProps) {
  const year = new Date(thesis.created_at).getFullYear()

  const handleThesisClick = () => {
    const state = {
      searchQuery: "",
      navSearchQuery: "",
      selectedDepartment: "All Departments",
      selectedYear: "All Years",
      selectedField: "All Fields",
      scrollPosition: window.scrollY,
    }
    sessionStorage.setItem("browsePageState", JSON.stringify(state))
  }

  return (
    <Card className="border-border bg-card p-4 md:p-6 hover:shadow-lg transition-shadow">
      <div className="space-y-3 md:space-y-4">
        <div>
          <Link href={`/thesis/${thesis.id}`} prefetch={true} onClick={handleThesisClick}>
            <h3 className="text-lg md:text-xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer line-clamp-2">
              {thesis.title}
            </h3>
          </Link>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            By{" "}
            {thesis.authors.map((author, idx) => (
              <span key={author.id}>
                <Link
                  href={`/student/profile/${author.student_id}`}
                  className="font-medium hover:text-primary transition-colors"
                  prefetch={false}
                >
                  {author.full_name}
                </Link>
                {idx < thesis.authors.length - 1 && ", "}
              </span>
            ))}
            {" • "}
            {thesis.department} • {year}
          </p>
          {thesis.supervisor_name && (
            <p className="text-xs text-muted-foreground">
              Supervisor:{" "}
              <Link
                href={`/supervisor/profile/${thesis.supervisor_username}`}
                className="font-medium hover:text-primary transition-colors"
                prefetch={false}
              >
                {thesis.supervisor_name}
              </Link>
            </p>
          )}
        </div>

        <p className="text-sm text-foreground leading-relaxed line-clamp-2">{thesis.abstract}</p>

        <div className="flex flex-wrap gap-2">
          {thesis.keywords.slice(0, 3).map((keyword, idx) => (
            <Badge key={idx} className="bg-primary/10 text-primary border border-primary/20 text-xs">
              {keyword}
            </Badge>
          ))}
          {thesis.keywords.length > 3 && (
            <Badge className="bg-muted text-muted-foreground border border-border text-xs">
              +{thesis.keywords.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 md:pt-4 border-t border-border">
          <div className="flex gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{thesis.views} views</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>{thesis.downloads} downloads</span>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Link
              href={`/thesis/${thesis.id}`}
              className="flex-1 sm:flex-none"
              prefetch={true}
              onClick={handleThesisClick}
            >
              <Button
                variant="outline"
                size="sm"
                className="border-border hover:bg-muted bg-transparent w-full sm:w-auto text-xs md:text-sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </Link>
            <Button
              size="sm"
              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground text-xs md:text-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
