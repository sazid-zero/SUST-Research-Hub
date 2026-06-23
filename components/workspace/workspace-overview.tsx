"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { updateWorkspaceDetails, getRelatedWork, submitForReview } from "@/app/actions/workspace"
import { syncPublicationCitations } from "@/app/actions/citations"
import { getPendingRequests, updateRequestStatus } from "@/app/actions/requests"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link as LinkIcon, X, FileText, GraduationCap, CheckCircle2, ChevronRight, History, Send, AlertCircle, Users, ExternalLink, RefreshCw, ShieldCheck, ShieldX, Loader2, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { InviteMemberDialog } from "@/components/workspace/invite-member-dialog"
import { SupervisionRequestDialog } from "@/components/workspace/supervision-request-dialog"
import { LinkRelatedWorkDialog } from "@/components/workspace/link-related-work-dialog"
import { WorkspaceSettingsDialog } from "@/components/workspace/workspace-settings-dialog"
import { CoauthorRequestsSection } from "@/components/workspace/coauthor-requests-section"
import { User } from "@/lib/db/users"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WorkspaceOverviewProps {
  workspace: any
  supervisors?: User[]
}

export function WorkspaceOverview({ workspace, supervisors = [] }: WorkspaceOverviewProps) {
  const router = useRouter()
  const [title, setTitle] = useState(workspace.title)
  const [description, setDescription] = useState(workspace.description || "")
  const [keywords, setKeywords] = useState<string[]>(workspace.keywords || [])
  const [newKeyword, setNewKeyword] = useState("")
  const [relatedWork, setRelatedWork] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSyncingCitations, setIsSyncingCitations] = useState(false)
  const [citationCount, setCitationCount] = useState<number>(workspace.citations || 0)
  const [accessRequests, setAccessRequests] = useState<any[]>([])
  const [processingRequestId, setProcessingRequestId] = useState<number | null>(null)
  
  useEffect(() => {
     fetchRelatedWork()
     if (workspace.type === 'thesis') {
         fetchAccessRequests()
     }
  }, [workspace.id])

  const fetchRelatedWork = async () => {
      const data = await getRelatedWork(workspace.id, workspace.type)
      setRelatedWork(data)
  }

  const fetchAccessRequests = async () => {
      const data = await getPendingRequests(workspace.id)
      setAccessRequests(data)
  }

  const handleRequestAction = async (requestId: number, status: 'approved' | 'rejected') => {
      setProcessingRequestId(requestId)
      const result = await updateRequestStatus(requestId, workspace.id, status)
      if (result.success) {
          setAccessRequests(prev => prev.filter(r => r.id !== requestId))
      }
      setProcessingRequestId(null)
  }

  const handleSaveChanges = async () => {
      const formData = new FormData()
      formData.append("id", workspace.id.toString())
      formData.append("type", workspace.type)
      formData.append("title", title)
      formData.append("description", description)
      formData.append("keywords", keywords.join(","))
      
      const result = await updateWorkspaceDetails(null, formData)
      if (result.success) {
          toast.success("Workspace auto-saved")
      } else {
          toast.error(result.message)
      }
  }

  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newKeyword && !keywords.includes(newKeyword)) {
      e.preventDefault()
      const updated = [...keywords, newKeyword]
      setKeywords(updated)
      setNewKeyword("")
      handleSaveChanges()
    }
  }

  const handleRemoveKeyword = (k: string) => {
    const updated = keywords.filter((item) => item !== k)
    setKeywords(updated)
    // Need to save changes after state updates
    setTimeout(() => handleSaveChanges(), 0)
  }

  const handleSubmitForReview = async () => {
    setIsSubmitting(true)
    const result = await submitForReview(workspace.id, workspace.type)
    if (result.success) {
        toast.success(result.message)
    } else {
        toast.error(result.message)
    }
    setIsSubmitting(false)
  }

  const handleSyncCitations = async () => {
      if (workspace.type !== 'publication') return;
      setIsSyncingCitations(true);
      const result = await syncPublicationCitations(workspace.id);
      if (result.success) {
          toast.success(result.message);
          if (result.citations !== undefined) {
              setCitationCount(result.citations);
          }
      } else {
          toast.error(result.message);
      }
      setIsSyncingCitations(false);
  }

  const supervisorsList = workspace.members?.filter((m: any) => m.role === 'supervisor') || []
  const teamMembers = workspace.members?.filter((m: any) => m.role !== 'supervisor') || []

  const getStatusDisplay = () => {
    switch(workspace.status) {
        case 'draft': return { label: 'Draft', color: 'bg-slate-100 text-slate-800 border-slate-200' }
        case 'pending_review': return { label: 'Under Review', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
        case 'needs_revision': return { label: 'Needs Revision', color: 'bg-red-100 text-red-800 border-red-200' }
        case 'approved': return { label: 'Approved & Published', color: 'bg-green-100 text-green-800 border-green-200' }
        default: return { label: workspace.status, color: 'bg-slate-100 text-slate-800 border-slate-200' }
    }
  }

  const statusDisplay = getStatusDisplay()

  return (
    <div className="h-full bg-background overflow-hidden flex flex-col">
        <div className="px-8 py-3 border-b bg-card flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span>Workspace</span>
                <ChevronRight className="w-3 h-3" />
                <span className="capitalize">{workspace.type}</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-primary font-semibold truncate max-w-[200px]">{workspace.title}</span>
            </div>
            <div className="flex items-center gap-3">
                 <Badge variant="outline" className={`px-2 py-0.5 text-[10px] ${statusDisplay.color}`}>
                    {statusDisplay.label}
                </Badge>
                <div className="h-4 w-px bg-border" />
                <span className="text-[10px] font-mono text-muted-foreground">ID: {workspace.id}-{workspace.type.substring(0,1).toUpperCase()}</span>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="max-w-[1400px] mx-auto p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* LEFT COLUMN: Main Research Content */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Title Section */}
                        <div className="space-y-4">
                            <textarea
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={handleSaveChanges}
                                className="w-full bg-transparent border-0 p-0 text-xl lg:text-3xl font-bold text-foreground focus:ring-0 placeholder:text-muted-foreground resize-none h-auto leading-[1.2] transition-all scrollbar-hide"
                                placeholder="Untitled Research..."
                                rows={2}
                            />
                            <div className="flex flex-wrap gap-2 items-center">
                                {keywords.map((k) => (
                                    <Badge key={k} variant="secondary" className="bg-muted text-muted-foreground font-medium px-2 py-1 rounded-md text-xs group">
                                        #{k}
                                        <button onClick={() => handleRemoveKeyword(k)} className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X className="h-3 w-3 hover:text-destructive" />
                                        </button>
                                    </Badge>
                                ))}
                                <input 
                                    className="bg-transparent border-b border-dashed border-border px-2 py-0.5 text-xs focus:ring-0 placeholder:text-muted-foreground text-foreground outline-none w-24 focus:w-40 transition-all font-medium" 
                                    placeholder="+ Add keyword" 
                                    type="text"
                                    value={newKeyword}
                                    onChange={(e) => setNewKeyword(e.target.value)}
                                    onKeyDown={handleAddKeyword}
                                />
                            </div>
                        </div>

                        {/* Abstract / Description Section */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between border-b pb-3">
                                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    Research Abstract
                                </h2>
                                <div className="flex items-center gap-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                                    <span className="flex items-center gap-1"><History className="w-3 h-3" /> Auto-saved</span>
                                    <span>{description.split(/\s+/).filter(Boolean).length} Words</span>
                                </div>
                            </div>
                            <div className="relative group">
                                <textarea 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    onBlur={handleSaveChanges}
                                    className="w-full min-h-[400px] bg-card border rounded-xl p-6 text-base leading-[1.8] text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-sans" 
                                    placeholder="Start drafting your research abstract or overview here..."
                                />
                            </div>
                        </section>

                        {/* Related Work Section */}
                        <section className="space-y-6">
                             <div className="flex items-center justify-between border-b pb-3">
                                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <LinkIcon className="w-5 h-5 text-primary" />
                                    Internal References
                                </h2>
                                <LinkRelatedWorkDialog 
                                    workspaceId={workspace.id} 
                                    workspaceType={workspace.type}
                                    onLinked={fetchRelatedWork}
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {relatedWork.length > 0 ? relatedWork.map((rw) => (
                                    <Card key={rw.id} className="bg-card hover:shadow-md transition-all cursor-pointer group">
                                        <CardContent className="p-4 flex items-start gap-4">
                                            <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                                <GraduationCap className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Badge variant="outline" className="text-[9px] uppercase tracking-tighter mb-1.5">
                                                    {rw.target_type}
                                                </Badge>
                                                <h4 className="text-sm font-bold text-foreground truncate">{rw.target_title}</h4>
                                                <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{rw.description || "Referenced research work."}</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-muted-foreground self-center group-hover:translate-x-1 transition-transform" />
                                        </CardContent>
                                    </Card>
                                )) : (
                                    <div className="col-span-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-muted-foreground gap-2">
                                        <LinkIcon className="w-8 h-8 opacity-20" />
                                        <p className="text-xs font-medium italic">No related internal works linked yet.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: Metadata & Sidebar Controls */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Status & Action Card */}
                        <Card className="shadow-sm overflow-hidden border-primary/20">
                             <div className="bg-primary h-1" />
                             <CardContent className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary" />
                                        Workflow Status
                                    </h3>
                                    
                                    <div className={`p-4 rounded-xl border ${statusDisplay.color} bg-opacity-10 bg-current`}>
                                        <span className="block font-bold text-sm mb-1">{statusDisplay.label}</span>
                                        <p className="text-xs opacity-80">
                                            {workspace.status === 'draft' && "Keep working on your research. Submit for review when ready."}
                                            {workspace.status === 'pending_review' && "Your workspace is currently being reviewed by your supervisor."}
                                            {workspace.status === 'needs_revision' && "Supervisor requested revisions. Please check feedback."}
                                            {workspace.status === 'approved' && "Your research has been approved and published!"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t">
                                    {workspace.status === 'draft' || workspace.status === 'needs_revision' ? (
                                        <Button 
                                            className="w-full h-11"
                                            onClick={handleSubmitForReview}
                                            disabled={isSubmitting || (supervisorsList.length === 0 && workspace.type !== 'publication')}
                                        >
                                            <Send className="w-4 h-4 mr-2" /> 
                                            {workspace.status === 'needs_revision' ? "Resubmit for Review" : "Submit for Review"}
                                        </Button>
                                    ) : null}

                                    {workspace.status === 'approved' && (
                                        <Button 
                                            variant="outline"
                                            className="w-full h-11"
                                            onClick={() => {
                                                const pathType = workspace.type === 'publication' ? 'paper' : workspace.type
                                                window.open(`/${pathType}/${workspace.id}`, '_blank')
                                            }}
                                        >
                                            <ExternalLink className="w-4 h-4 mr-2" /> View Public Page
                                        </Button>
                                    )}

                                    {supervisorsList.length === 0 && workspace.type !== 'publication' && workspace.status !== 'approved' && (
                                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-2">
                                            <AlertCircle className="w-3.5 h-3.5 text-yellow-500" />
                                            Assign a supervisor before submitting.
                                        </p>
                                    )}
                                </div>
                             </CardContent>
                        </Card>

                        {/* Supervisor Card */}
                        {workspace.type !== 'publication' && (
                            <Card className="shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-primary" />
                                        Supervisor
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {supervisorsList.length > 0 ? (
                                        <div className="space-y-3">
                                            {supervisorsList.map((sup: any) => (
                                                <div key={sup.user_id} className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                                        {sup.full_name?.charAt(0) || 'S'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold">{sup.full_name}</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase">{sup.role}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <p className="text-xs text-muted-foreground">No supervisor assigned yet.</p>
                                            <SupervisionRequestDialog 
                                                workspaceId={workspace.id} 
                                                type={workspace.type} 
                                                supervisors={supervisors}
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Team Members Card */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Users className="w-4 h-4 text-primary" />
                                    {workspace.type === 'publication' ? 'Authors' : 'Team Members'}
                                </CardTitle>
                                <InviteMemberDialog workspaceId={workspace.id} type={workspace.type} />
                            </CardHeader>
                            <CardContent>
                                {teamMembers.length > 0 ? (
                                    <div className="space-y-3">
                                        {teamMembers.map((member: any) => {
                                            // Determine role display based on workspace type
                                            let roleDisplay = ''
                                            if (workspace.type === 'publication') {
                                                roleDisplay = 'Co-author'
                                            } else if (workspace.type === 'thesis') {
                                                roleDisplay = member.role === 'supervisor' ? 'Supervisor' : 'Co-author'
                                            } else {
                                                roleDisplay = member.role ? (member.role.charAt(0).toUpperCase() + member.role.slice(1)) : 'Member'
                                            }
                                            
                                            return (
                                            <div key={member.user_id || member.id} className="flex items-center justify-between group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold text-xs">
                                                        {member.full_name?.charAt(0) || member.author_name?.charAt(0) || 'M'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">{member.full_name || member.author_name}</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase">
                                                            {roleDisplay} {member.status === 'invited' ? '(Pending)' : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-xs text-muted-foreground italic">No other members.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Co-author Requests Section (Publications only) */}
                        {workspace.type === 'publication' && (
                            <CoauthorRequestsSection 
                                publicationId={workspace.id} 
                                canManage={true}
                            />
                        )}

                        {/* Metadata Card */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                <CardTitle className="text-sm">Metadata</CardTitle>
                                <WorkspaceSettingsDialog workspace={workspace} />
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between items-center py-1 border-b">
                                    <span className="text-muted-foreground">Department</span>
                                    <span className="font-medium">{workspace.department || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center py-1 border-b">
                                    <span className="text-muted-foreground">Field</span>
                                    <span className="font-medium">{workspace.field || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center py-1 border-b">
                                    <span className="text-muted-foreground">Created</span>
                                    <span className="font-medium">{new Date(workspace.created_at).toLocaleDateString()}</span>
                                </div>
                                {workspace.type === 'publication' && (
                                    <div className="flex justify-between items-center py-2 pt-3">
                                        <div className="flex flex-col">
                                            <span className="text-muted-foreground">Citations</span>
                                            <span className="font-bold text-lg">{citationCount}</span>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            variant="secondary" 
                                            onClick={handleSyncCitations}
                                            disabled={isSyncingCitations}
                                            className="h-8 text-xs bg-primary/10 text-primary hover:bg-primary/20"
                                        >
                                            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isSyncingCitations ? 'animate-spin' : ''}`} />
                                            {isSyncingCitations ? 'Syncing...' : 'Sync Live'}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Access Requests Card (Thesis only) */}
                        {workspace.type === 'thesis' && workspace.visibility === 'hidden' && (
                            <Card className="shadow-sm border-amber-500/20">
                                <div className="bg-amber-500 h-1" />
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-amber-500" />
                                        Access Requests
                                        {accessRequests.length > 0 && (
                                            <Badge variant="destructive" className="ml-auto text-[10px] h-5 px-1.5">
                                                {accessRequests.length}
                                            </Badge>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {accessRequests.length > 0 ? (
                                        <div className="space-y-4">
                                            {accessRequests.map((req: any) => (
                                                <div key={req.id} className="p-3 rounded-xl border bg-muted/30 space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-[10px]">
                                                            {req.full_name?.charAt(0) || '?'}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-semibold truncate">{req.full_name}</p>
                                                            <p className="text-[10px] text-muted-foreground">
                                                                {new Date(req.created_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {req.message && (
                                                        <p className="text-xs text-muted-foreground bg-background rounded-lg p-2 border italic">
                                                            "{req.message}"
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            className="h-7 text-[10px] flex-1 gap-1"
                                                            onClick={() => handleRequestAction(req.id, 'approved')}
                                                            disabled={processingRequestId === req.id}
                                                        >
                                                            {processingRequestId === req.id ? (
                                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                            ) : (
                                                                <ShieldCheck className="w-3 h-3" />
                                                            )}
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-7 text-[10px] flex-1 gap-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleRequestAction(req.id, 'rejected')}
                                                            disabled={processingRequestId === req.id}
                                                        >
                                                            <ShieldX className="w-3 h-3" />
                                                            Deny
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-muted-foreground italic">No pending access requests.</p>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
