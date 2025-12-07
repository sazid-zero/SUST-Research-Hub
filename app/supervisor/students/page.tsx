import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Mail, FileText } from "lucide-react"
import Link from "next/link"
import { getAllTheses } from "@/lib/data/theses"

export default async function SupervisorStudentsPage() {
  const allTheses = await getAllTheses()

  const studentMap = new Map()
  allTheses.forEach((thesis) => {
    const studentId = thesis.id
    const studentName = thesis.author
    if (!studentMap.has(studentId)) {
      studentMap.set(studentId, {
        id: studentId,
        name: `${studentName}`,
        email: `student${studentId}@sust.edu`,
        department: thesis.department,
        thesesCount: 0,
        status: studentId % 2 === 0 ? "active" : "inactive",
        lastSubmission: `2024-02-${String((studentId % 28) + 1).padStart(2, "0")}`,
      })
    }
    const student = studentMap.get(studentId)
    student.thesesCount += 1
  })

  const students = Array.from(studentMap.values())

  return (
    <main className="flex-1">
      <div className="p-4 sm:p-6">
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">My Students</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Manage and track your supervised students</p>
        </div>

        <div className="mb-20 grid gap-4">
          {students.map((student) => (
            <Card key={student.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base sm:text-lg">{student.name}</CardTitle>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {student.email}
                    </CardDescription>
                  </div>
                  <Badge variant={student.status === "active" ? "default" : "secondary"}>
                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Department</p>
                      <p className="font-medium">{student.department}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Theses Submitted</p>
                      <p className="font-medium flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {student.thesesCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Submission</p>
                      <p className="font-medium">
                        {student.lastSubmission ? new Date(student.lastSubmission).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Link href={`/student/profile/${student.id}`}>
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline">
                      Send Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
