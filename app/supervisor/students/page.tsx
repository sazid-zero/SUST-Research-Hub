import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Mail, FileText } from "lucide-react"
import Link from "next/link"
import { getAllTheses } from "@/lib/data/theses"

import { getSupervisedStudents } from "@/app/actions/supervisor"

export default async function SupervisorStudentsPage() {
  const students = await getSupervisedStudents()

  return (
    <main className="flex-1">
      <div className="p-4 sm:p-6">
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">My Students</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Manage and track your supervised students</p>
        </div>

        <div className="mb-20 grid gap-4">
          {students.map((student: any) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
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
                  <Badge variant="default">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Department</p>
                      <p className="font-medium">{student.department}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Student ID</p>
                      <p className="font-medium">{student.student_id}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Link href={`/supervisor/students/${student.id}`}>
                      <Button size="sm" variant="outline">
                        View Workspace
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
          {students.length === 0 && (
            <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-border">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No students found</h3>
              <p className="text-muted-foreground">Once you accept supervision requests, students will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
