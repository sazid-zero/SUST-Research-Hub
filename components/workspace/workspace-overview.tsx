"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { updateWorkspaceDetails, getRelatedWork, linkRelatedWork } from "@/app/actions/workspace"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
    Bold, Italic, Link as LinkIcon, Plus, X, 
    Eye, Share, Search, FileText, Upload, 
    Clock, Calendar, Shield, GraduationCap, CheckCircle2,
    Save, ChevronRight, Info, ExternalLink, MessageSquare,
    Users, Settings, History, Lock, Share2
} from "lucide-react"
import { toast } from "sonner"
import { InviteMemberDialog } from "@/components/workspace/invite-member-dialog"
import { SupervisionRequestDialog } from "@/components/workspace/supervision-request-dialog"
import { LinkRelatedWorkDialog } from "@/components/workspace/link-related-work-dialog"
import { User } from "@/lib/db/users"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

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
  
  useEffect(() => {
     fetchRelatedWork()
  }, [workspace.id])

  const fetchRelatedWork = async () => {
      const data = await getRelatedWork(workspace.id, workspace.type)
      setRelatedWork(data)
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
    setKeywords(keywords.filter((item) => item !== k))
    handleSaveChanges()
  }

  const supervisorsList = workspace.members?.filter((m: any) => m.role === 'supervisor') || []
  const teamMembers = workspace.members?.filter((m: any) => m.role !== 'supervisor') || []

  return (
    <div className="h-full bg-[#f8fafc] dark:bg-[#0d121c] overflow-hidden flex flex-col">
        {/* Top Header / Breadcrumbs placeholder */}
        <div className="px-8 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span>Workspace</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-900 dark:text-slate-200 capitalize">{workspace.type}</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-indigo-500 font-semibold truncate max-w-[200px]">{workspace.title}</span>
            </div>
            <div className="flex items-center gap-3">
                 <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-2 py-0.5 text-[10px] animate-pulse">
                    LIVE
                </Badge>
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
                <span className="text-[10px] font-mono text-slate-400">ID: {workspace.id}-{workspace.type.substring(0,1).toUpperCase()}</span>
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
                                className="w-full bg-transparent border-0 p-0 text-xl lg:text-2xl font-black text-slate-900 dark:text-white focus:ring-0 placeholder-slate-200 dark:placeholder-slate-800 resize-none h-auto leading-[1.2] transition-all scrollbar-hide"
                                placeholder="Untitled Research..."
                                rows={2}
                            />
                            <div className="flex flex-wrap gap-2 items-center">
                                {keywords.map((k) => (
                                    <Badge key={k} variant="secondary" className="bg-white dark:bg-[#1a2436] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium px-2 py-1 rounded-md text-xs group">
                                        #{k}
                                        <button onClick={() => handleRemoveKeyword(k)} className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X className="h-3 w-3 hover:text-red-500" />
                                        </button>
                                    </Badge>
                                ))}
                                <input 
                                    className="bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 px-2 py-0.5 text-xs focus:ring-0 placeholder-slate-400 dark:text-white outline-none w-24 focus:w-40 transition-all font-medium" 
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
                            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-indigo-500" />
                                    Research Abstract
                                </h2>
                                <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-1"><History className="w-3 h-3" /> Auto-saved</span>
                                    <span>{description.split(/\s+/).filter(Boolean).length} Words</span>
                                </div>
                            </div>
                            <div className="relative group">
                                <textarea 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    onBlur={handleSaveChanges}
                                    className="w-full min-h-[400px] bg-white dark:bg-[#111722] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-lg leading-[1.8] text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm font-serif" 
                                    placeholder="Start drafting your research abstract or overview here..."
                                />
                                <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all">
                                    <Button variant="outline" size="sm" className="bg-white dark:bg-[#1a2436] border-slate-200 dark:border-slate-800 text-[10px] h-7 px-3 rounded-full hover:bg-slate-50">
                                        Expand Editor
                                    </Button>
                                </div>
                            </div>
                        </section>

                        {/* Related Work Section */}
                        <section className="space-y-6">
                             <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <LinkIcon className="w-5 h-5 text-indigo-500" />
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
                                    <Card key={rw.id} className="bg-white dark:bg-[#1a2436] border-slate-100 dark:border-slate-800/50 hover:shadow-md transition-all cursor-pointer group">
                                        <CardContent className="p-4 flex items-start gap-4">
                                            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                                <GraduationCap className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Badge variant="outline" className="text-[9px] uppercase tracking-tighter mb-1.5 border-slate-200 dark:border-slate-800">
                                                    {rw.target_type}
                                                </Badge>
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate">{rw.target_title}</h4>
                                                <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{rw.description || "Referenced research work."}</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-300 self-center group-hover:translate-x-1 transition-transform" />
                                        </CardContent>
                                    </Card>
                                )) : (
                                    <div className="col-span-full border-2 border-dashed border-slate-100 dark:border-slate-800/50 rounded-2xl p-10 flex flex-col items-center justify-center text-slate-400 gap-2">
                                        <LinkIcon className="w-8 h-8 opacity-20" />
                                        <p className="text-xs font-medium italic">No related internal works linked yet.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: Metadata & Sidebar Controls */}
                    <div className="lg:col-span-4 space-y-8">
                        
                        {/* Status & Action Card */}
                        <Card className="bg-white dark:bg-[#1a2436] border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                             <div className="bg-indigo-600 h-1" />
                             <CardContent className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</span>
                                        <span className="text-xs font-bold text-indigo-500">45% Complete</span>
                                    </div>
                                    <Progress value={45} className="h-2 bg-indigo-50 dark:bg-slate-800" />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111722] border border-slate-100 dark:border-slate-800">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Status</span>
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">{workspace.status}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111722] border border-slate-100 dark:border-slate-800">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Privacy</span>
                                        <div className="flex items-center gap-1.5">
                                            <Lock className="w-3 h-3 text-slate-400" />
                                            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Private</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Button 
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 shadow-lg shadow-indigo-600/10"
                                        onClick={() => {
                                            const pathType = workspace.type === 'publication' ? 'paper' : workspace.type
                                            const url = `${window.location.origin}/${pathType}/${workspace.id}`
                                            navigator.clipboard.writeText(url)
                                            toast.success("Public link copied to clipboard")
                                        }}
                                    >
                                        <Share className="w-4 h-4 mr-2" /> Share Workspace
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="w-full h-11 border-slate-200 dark:border-slate-800"
                                        onClick={() => {
                                            const pathType = workspace.type === 'publication' ? 'paper' : workspace.type
                                            router.push(`/${pathType}/${workspace.id}`)
                                        }}
                                    >
                                        <Eye className="w-4 h-4 mr-2" /> Live Preview
                                    </Button>
                                </div>
                             </CardContent>
                        </Card>

                        {/* Supervision Card */}
                        <Card className="bg-white dark:bg-[#1a2436] border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4 text-emerald-500" /> Supervision
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {supervisorsList.length > 0 ? (
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 font-bold">
                                            {supervisorsList[0].full_name?.substring(0,1)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate">{supervisorsList[0].full_name}</p>
                                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">Verified Expert</p>
                                        </div>
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    </div>
                                ) : (
                                    <SupervisionRequestDialog 
                                        workspaceId={workspace.id} 
                                        type={workspace.type} 
                                        supervisors={supervisors} 
                                    />
                                )}
                            </CardContent>
                        </Card>

                        {/* Team Members Card */}
                        <Card className="bg-white dark:bg-[#1a2436] border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Users className="w-4 h-4 text-indigo-500" /> Research Team
                                </CardTitle>
                                <InviteMemberDialog workspaceId={workspace.id} type={workspace.type}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </InviteMemberDialog>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {teamMembers.map((member: any) => (
                                     <div key={member.user_id} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors group">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
                                            {member.full_name?.substring(0, 2)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold truncate">{member.full_name}</p>
                                            <Badge variant="outline" className="text-[9px] uppercase tracking-tighter p-0 h-auto text-slate-400 border-0">
                                                {member.role === 'leader' ? 'Principal Investigator' : 'Contributor'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                         {/* Timeline / Dates Card */}
                         <Card className="bg-slate-900 border-0 shadow-lg text-white">
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-4">
                                     <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Initialization</p>
                                            <p className="text-xs font-medium">{new Date(workspace.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric'})}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Last Modified</p>
                                            <p className="text-xs font-medium">{new Date(workspace.updated_at).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-3.5 h-3.5 text-indigo-400" />
                                        <span className="text-[10px] font-bold text-white/60">CC BY-SA 4.0</span>
                                    </div>
                                    <Settings className="w-3.5 h-3.5 text-white/40 hover:text-white cursor-pointer transition-colors" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    </div>
  )
}
