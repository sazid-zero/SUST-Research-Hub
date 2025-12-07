import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, Trash2 } from "lucide-react"
import { getAllTheses } from "@/lib/data/theses"

export default async function StudentSubmissionsPage() {
  const allTheses = await getAllTheses()

  const submissions = allTheses.map((thesis) => ({
    id: thesis.id,
    title: thesis.title,
    status: ["approved", "pending", "rejected", "in-review"][thesis.id % 4],
    submittedDate: `2024-${String((thesis.id % 12) + 1).padStart(2, "0")}-${String((thesis.id % 28) + 1).padStart(2, "0")}`,
    supervisor: thesis.supervisor,
    department: thesis.department,
    files: ["thesis.pdf", "presentation.pptx"],
    feedback:
      ["approved", "pending", "rejected", "in-review"][thesis.id % 4] === "rejected"
        ? "Please revise and resubmit your thesis addressing the comments."
        : undefined,
  }))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "in-review":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex h-scree bg-background">
      <main className="flex-1">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">My Submissions</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Track and manage all your thesis submissions</p>
          </div>

          <div className="space-y-3 sm:space-y-4 mb-20">
            {submissions.map((submission) => (
              <Card key={submission.id} className="hover:shadow-lg transition-shadow gap-0">
                <CardHeader className="p-3 md:p-4 pb-1 md:pb-2">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        <CardTitle className="text-base sm:text-lg md:text-xl ">{submission.title}</CardTitle>
                      </div>
                      <CardDescription className="text-xs sm:text-sm space-y-2">
                        <p>Supervisor: {submission.supervisor}</p> <p>Department: {submission.department}</p>
                      </CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(submission.status)} text-xs flex-shrink-0`}>
                      {submission.status.charAt(0).toUpperCase() + submission.status.slice(1).replace("-", " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3 md:p-4 pt-1 md:pt-2">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                      <span>Submitted: {new Date(submission.submittedDate).toLocaleDateString()}</span>
                      <span>{submission.files.length} file(s)</span>
                    </div>

                    {submission.feedback && (
                      <div className="p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs sm:text-sm font-medium text-red-900 mb-1">Feedback:</p>
                        <p className="text-xs sm:text-sm text-red-800">{submission.feedback}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {submission.files.map((file, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {file}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 bg-transparent text-xs sm:text-sm h-8 sm:h-9"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 bg-transparent text-xs sm:text-sm h-8 sm:h-9"
                      >
                        <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                        Download
                      </Button>
                      {submission.status === "rejected" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 bg-transparent text-xs sm:text-sm h-8 sm:h-9"
                        >
                          Resubmit
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-2 text-red-600 hover:text-red-700 text-xs sm:text-sm h-8 sm:h-9"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
