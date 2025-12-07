import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Search, Eye, Trash2, Download } from "lucide-react"
import { getAllTheses } from "@/lib/data/theses"

export default async function AdminThesesPage() {
  const allTheses = await getAllTheses()

  const theses = allTheses.map((thesis) => {
    const submittedDate = thesis.submitted
      ? typeof thesis.submitted === "string"
        ? thesis.submitted.split("T")[0]
        : thesis.submitted.toISOString().split("T")[0]
      : null

    return {
      id: thesis.id,
      title: thesis.title,
      student: `Student ${thesis.id}`,
      supervisor: thesis.supervisor,
      department: thesis.department,
      status: thesis.status,
      submittedDate,
      approvedDate: thesis.status === "approved" && submittedDate ? submittedDate : null,
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6">
          <div className="mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">Thesis Management</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage all theses in the repository</p>
          </div>

          <div className="mb-6 flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search theses by title, student, or supervisor..." className="pl-10" />
            </div>
            <Button variant="outline">Filter</Button>
          </div>

          <div className="space-y-4 mb-20">
            {theses.map((thesis) => (
              <Card key={thesis.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="shrink-0 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        <CardTitle className="text-base sm:text-lg md:text-xl">{thesis.title}</CardTitle>
                      </div>
                      <CardDescription className="text-xs sm:text-sm space-y-2">
                        <p>Student: {thesis.student}</p>
                        <p>Supervisor: {thesis.supervisor}</p>
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(thesis.status)}>
                      {thesis.status.charAt(0).toUpperCase() + thesis.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div>
                        <p className="text-xs uppercase tracking-wide">Department</p>
                        <p className="font-medium text-foreground">{thesis.department}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide">Submitted</p>
                        <p className="font-medium text-foreground">
                          {new Date(thesis.submittedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide">{thesis.approvedDate ? "Approved" : "Status"}</p>
                        <p className="font-medium text-foreground">
                          {thesis.approvedDate ? new Date(thesis.approvedDate).toLocaleDateString() : "Pending"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      <Button size="sm" variant="ghost" className="gap-2 text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
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
