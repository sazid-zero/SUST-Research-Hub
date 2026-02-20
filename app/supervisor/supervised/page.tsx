import { getSupervisedWork } from "@/app/actions/supervisor"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Beaker, Eye, Calendar, FolderOpen, FileText } from "lucide-react"
import Link from "next/link"

export default async function SupervisedWorkPage() {
  const supervisedItems = await getSupervisedWork()

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string, color: string }> = {
      pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
      active: { label: "Active", color: "bg-blue-100 text-blue-800" },
      completed: { label: "Completed", color: "bg-green-100 text-green-800" },
      published: { label: "Published", color: "bg-indigo-100 text-indigo-800" },
    }
    const item = config[status] || { label: status, color: "bg-gray-100 text-gray-800" }
    return <Badge className={item.color}>{item.label}</Badge>
  }

  return (
    <main className="w-full">
      <div className="border-b border-border bg-card p-4 sm:p-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Supervised Work</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Overview of all ongoing theses and projects under your supervision
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        {supervisedItems.map((item) => (
          <Card key={`${item.type}-${item.id}`} className="border-border bg-card p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {item.type === 'thesis' ? <FileText className="h-4 w-4 text-primary" /> : <FolderOpen className="h-4 w-4 text-accent" />}
                    <h3 className="text-base sm:text-lg font-semibold text-foreground line-clamp-1">{item.title}</h3>
                  </div>
                  {getStatusBadge(item.status)}
                </div>
                
                <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Type:</span> 
                    <span className="capitalize">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Department:</span> {item.department}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Started: {new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 shrink-0">
                <Link href={`/${item.type}/${item.id}`}>
                  <Button size="sm" variant="outline" className="text-xs sm:text-sm h-8 sm:h-9 bg-transparent">
                    <Eye className="h-4 w-4 mr-1.5" />
                    Public View
                  </Button>
                </Link>
                {/* Workspace link depending on type - assuming student workspaces are accessible or supervisor has unique workspace views */}
                <Link href={`/student/workspace/${item.type}/${item.id}`}>
                  <Button size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
                    Manage Research
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
        {supervisedItems.length === 0 && (
          <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-border">
            <Beaker className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No supervised work found</h3>
            <p className="text-muted-foreground">Once you accept supervision requests, they will appear here.</p>
          </div>
        )}
      </div>
    </main>
  )
}
