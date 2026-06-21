"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supervisorReviewAction } from "@/app/actions/workspace"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
    CheckCircle2, XCircle, ArrowLeft, 
    FileText, Code, Database, Link as LinkIcon 
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface ReviewWorkspaceClientProps {
  workspace: any
}

export function ReviewWorkspaceClient({ workspace }: ReviewWorkspaceClientProps) {
  const router = useRouter()
  const [feedback, setFeedback] = useState("")
  const [loading, setLoading] = useState<string | null>(null)

  const handleAction = async (action: 'approve' | 'request_revision') => {
      if (action === 'request_revision' && !feedback.trim()) {
          toast.error("Please provide feedback for the requested revisions.")
          return
      }

      setLoading(action)
      const result = await supervisorReviewAction(workspace.id, workspace.type, action, feedback)
      if (result.success) {
          toast.success(result.message)
          router.push('/supervisor/requests')
      } else {
          toast.error(result.message)
      }
      setLoading(null)
  }

  return (
    <div className="h-full bg-background overflow-hidden flex flex-col">
        <div className="px-8 py-3 border-b bg-card flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/supervisor/requests"><ArrowLeft className="w-4 h-4" /></Link>
                </Button>
                <div>
                    <h1 className="font-semibold">{workspace.title}</h1>
                    <p className="text-xs text-muted-foreground capitalize">{workspace.type} • ID: {workspace.id}</p>
                </div>
            </div>
            <Badge variant={workspace.status === 'pending_review' ? 'default' : 'secondary'}>
                {workspace.status === 'pending_review' ? 'Needs Review' : workspace.status}
            </Badge>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Col: Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Abstract / Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap font-serif">
                                {workspace.description || "No description provided."}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Resources & Files</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-4 items-center">
                                <FileText className="w-5 h-5 text-muted-foreground" />
                                <span>{workspace.files?.length || 0} Files</span>
                            </div>
                            <div className="flex gap-4 items-center">
                                <Code className="w-5 h-5 text-muted-foreground" />
                                <span>{workspace.resource_links?.filter((l:any) => l.category==='code').length || 0} Code Links</span>
                            </div>
                            <div className="flex gap-4 items-center">
                                <Database className="w-5 h-5 text-muted-foreground" />
                                <span>{workspace.resource_links?.filter((l:any) => l.category==='dataset').length || 0} Datasets</span>
                            </div>
                            <Button variant="outline" asChild className="w-full mt-4">
                                <Link href={`/student/workspace/${workspace.type}/${workspace.id}?tab=resources`} target="_blank">
                                    <LinkIcon className="w-4 h-4 mr-2" /> View All Resources in Workspace
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Col: Review Panel */}
                <div className="space-y-6">
                    <Card className="border-primary/20 shadow-md">
                        <div className="bg-primary h-1" />
                        <CardHeader>
                            <CardTitle>Review Action</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase">Feedback (Required for Revision)</label>
                                <Textarea 
                                    placeholder="Provide feedback, suggestions, or reasons for revision..."
                                    className="min-h-[150px]"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                />
                            </div>

                            <div className="space-y-3 pt-4 border-t">
                                <Button 
                                    variant="outline"
                                    className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
                                    onClick={() => handleAction('request_revision')}
                                    disabled={!!loading || workspace.status !== 'pending_review'}
                                >
                                    <XCircle className="w-4 h-4 mr-2" /> Request Revisions
                                </Button>
                                <Button 
                                    className="w-full"
                                    onClick={() => handleAction('approve')}
                                    disabled={!!loading || workspace.status !== 'pending_review'}
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Approve & Publish
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Team</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {workspace.members?.map((member: any) => (
                                    <div key={member.user_id} className="flex justify-between text-sm">
                                        <span>{member.full_name}</span>
                                        <span className="text-xs text-muted-foreground uppercase">{member.role}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    </div>
  )
}
