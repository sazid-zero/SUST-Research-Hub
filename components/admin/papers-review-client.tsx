"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Search, Loader2, CheckCircle2, XCircle, LayoutDashboard, Filter, Calendar, User, Mail, ExternalLink } from "lucide-react"
import { approvePaperSubmission, rejectPaperSubmission } from "@/app/actions/admin"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { formatDistanceToNow } from "date-fns"

interface PaperSubmission {
  review_id: number
  publication_id: number
  student_id: number
  submitted_at: string
  status: string
  publication_title: string
  abstract?: string
  year: number
  student_name: string
  student_email: string
}

interface PapersReviewClientProps {
  initialSubmissions: PaperSubmission[]
}

export default function PapersReviewClient({ initialSubmissions }: PapersReviewClientProps) {
  const [submissions, setSubmissions] = useState<PaperSubmission[]>(initialSubmissions)
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState<number | null>(null)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<PaperSubmission | null>(null)
  const [rejectFeedback, setRejectFeedback] = useState("")

  const filteredSubmissions = submissions.filter(s =>
    s.publication_title?.toLowerCase().includes(search.toLowerCase()) ||
    s.student_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.student_email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleApprove = async (submission: PaperSubmission) => {
    setIsLoading(submission.review_id)
    try {
      const res = await approvePaperSubmission(submission.publication_id, submission.review_id)
      if (res.success) {
        setSubmissions(prev => prev.filter(s => s.review_id !== submission.review_id))
        toast.success("Paper approved and published successfully!")
      } else {
        toast.error(res.error || "Failed to approve paper")
      }
    } catch (err) {
      toast.error("Failed to approve paper")
      console.error(err)
    } finally {
      setIsLoading(null)
    }
  }

  const handleRejectClick = (submission: PaperSubmission) => {
    setSelectedSubmission(submission)
    setRejectFeedback("")
    setIsRejectDialogOpen(true)
  }

  const handleRejectConfirm = async () => {
    if (!selectedSubmission || !rejectFeedback.trim()) {
      toast.error("Please provide feedback before rejecting")
      return
    }

    setIsLoading(selectedSubmission.review_id)
    try {
      const res = await rejectPaperSubmission(
        selectedSubmission.publication_id,
        selectedSubmission.review_id,
        rejectFeedback
      )
      if (res.success) {
        setSubmissions(prev => prev.filter(s => s.review_id !== selectedSubmission.review_id))
        toast.success("Paper rejected and student notified!")
        setIsRejectDialogOpen(false)
      } else {
        toast.error(res.error || "Failed to reject paper")
      }
    } catch (err) {
      toast.error("Failed to reject paper")
      console.error(err)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-[#0b1120] min-h-screen">
      {/* Header Area */}
      <div className="relative overflow-hidden bg-white dark:bg-[#0f172a] border-b border-border/50 px-6 py-6 sm:py-8 md:py-10">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                <FileText className="h-3 w-3" />
                Paper Review Queue
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                Paper <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">Submissions</span>
              </h1>
              <p className="text-sm text-muted-foreground font-medium max-w-lg">
                Review and approve student paper submissions for publication in the research repository.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 mb-10">
        {/* Controls Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <LayoutDashboard className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Review Queue</h2>
          </div>

          <div className="flex flex-col gap-4 bg-background/80 backdrop-blur-sm p-4 rounded-3xl border border-border/50 shadow-sm ring-1 ring-primary/5">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by paper title, student name, or email..."
                className="pl-12 bg-muted/20 border-border/50 h-10 rounded-xl focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <Card className="border-border/50 bg-background/50">
              <CardContent className="pt-12">
                <div className="text-center space-y-3">
                  <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                  <p className="text-muted-foreground font-medium">
                    {submissions.length === 0 ? "No pending paper submissions" : "No matching papers found"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredSubmissions.map((submission) => (
                <Card key={submission.review_id} className="border-border/50 bg-background/50 hover:bg-background/70 transition-colors">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <h3 className="text-lg font-bold text-foreground line-clamp-2 hover:text-primary transition-colors">
                            {submission.publication_title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{submission.student_name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              <span>{submission.student_email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDistanceToNow(new Date(submission.submitted_at), { addSuffix: true })}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 whitespace-nowrap">
                          Pending Review
                        </Badge>
                      </div>

                      {/* Abstract */}
                      {submission.abstract && (
                        <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            <span className="font-semibold text-foreground">Abstract: </span>
                            {submission.abstract}
                          </p>
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="px-2 py-1 bg-muted/50 rounded text-xs font-medium">Year: {submission.year}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-2 border-t border-border/30">
                        <Button
                          asChild
                          variant="outline"
                          className="flex-1 bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 border border-sky-500/20"
                        >
                          <a href={`/student/workspace/publication/${submission.publication_id}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Workspace
                          </a>
                        </Button>
                        <Button
                          onClick={() => handleApprove(submission)}
                          disabled={isLoading === submission.review_id}
                          className="flex-1 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-500/20"
                          variant="outline"
                        >
                          {isLoading === submission.review_id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Approving...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Approve & Publish
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleRejectClick(submission)}
                          disabled={isLoading === submission.review_id}
                          className="flex-1 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border border-rose-500/20"
                          variant="outline"
                        >
                          {isLoading === submission.review_id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Rejection Feedback Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Reject Paper Submission</DialogTitle>
            <DialogDescription>
              Provide feedback to the student about why their paper is being rejected.
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-4">
              <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                <p className="text-sm font-semibold text-foreground mb-1">Paper:</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{selectedSubmission.publication_title}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Feedback for Student</label>
                <Textarea
                  placeholder="Explain why this paper is being rejected and what improvements are needed..."
                  className="min-h-24 resize-none bg-muted/20 border-border/50 focus:ring-primary/20"
                  value={rejectFeedback}
                  onChange={(e) => setRejectFeedback(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
              disabled={isLoading !== null}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectConfirm}
              disabled={!rejectFeedback.trim() || isLoading !== null}
              className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border border-rose-500/20"
              variant="outline"
            >
              {isLoading === selectedSubmission?.review_id ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                "Confirm Rejection"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
