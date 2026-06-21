"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Search, Eye, EyeOff, Trash2, Download, Loader2, Sparkles, Filter, LayoutDashboard, GraduationCap } from "lucide-react"
import { deleteThesis, setThesisVisibility } from "@/app/actions/admin"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Thesis {
  id: number
  title: string
  author: string
  supervisor: string
  department: string
  status: string
  visibility: string
  submittedDate: string
  approvedDate?: string | null
}

interface ThesesManagementClientProps {
  initialTheses: Thesis[]
}

export default function ThesesManagementClient({ initialTheses }: ThesesManagementClientProps) {
  const [theses, setTheses] = useState<Thesis[]>(initialTheses)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState<number | null>(null)
  const [isTogglingVisibility, setIsTogglingVisibility] = useState<number | null>(null)

  const filteredTheses = theses.filter(t => {
    const matchesSearch = 
      t.title?.toLowerCase().includes(search.toLowerCase()) || 
      t.author?.toLowerCase().includes(search.toLowerCase()) ||
      t.supervisor?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || t.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "pending":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "rejected":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20"
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20"
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this research? This action cannot be undone.")) return
    
    setIsLoading(id)
    try {
      const res = await deleteThesis(id)
      if (res.success) {
        setTheses(prev => prev.filter(t => t.id !== id))
        toast.success(res.message)
      } else {
        toast.error(res.error)
      }
    } catch (err) {
      toast.error("Failed to delete research")
    } finally {
      setIsLoading(null)
    }
  }

  const handleToggleVisibility = async (id: number, current: string) => {
    const next = current === 'visible' ? 'hidden' : 'visible'
    setIsTogglingVisibility(id)
    try {
      const res = await setThesisVisibility(id, next)
      if (res.success) {
        setTheses(prev => prev.map(t => t.id === id ? { ...t, visibility: next } : t))
        toast.success(res.message)
      } else {
        toast.error(res.error)
      }
    } catch (err) {
      toast.error("Failed to update visibility")
    } finally {
      setIsTogglingVisibility(null)
    }
  }

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-[#0b1120] min-h-screen">
      {/* Header Area */}
      <div className="relative overflow-hidden bg-white dark:bg-[#0f172a] border-b border-border/50 px-6 py-10 sm:py-12 md:py-16">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-primary/5 to-transparent pointer-events-none" />
          <div className="max-w-6xl mx-auto relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                          <GraduationCap className="h-3 w-3" />
                          Knowledge Repository
                      </div>
                      <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                        Research <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">Vault</span>
                      </h1>
                      <p className="text-muted-foreground font-medium max-w-lg">
                        Audit, validate, and manage the complete body of research work produced across all university departments.
                      </p>
                  </div>
              </div>
          </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 sm:p-8 space-y-10 mb-20">
        {/* Controls Section */}
        <section className="space-y-6">
            <div className="flex items-center gap-2 px-2">
                <LayoutDashboard className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Audit Controls</h2>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-background/80 backdrop-blur-sm p-4 rounded-3xl border border-border/50 shadow-sm ring-1 ring-primary/5">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by title, student, or supervisor..." 
                        className="pl-12 bg-muted/20 border-border/50 h-12 rounded-2xl focus:ring-primary/20 focus:border-primary/50 transition-all font-medium" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
                    {["all", "pending", "approved", "rejected"].map((status) => (
                        <Button 
                            key={status}
                            variant={statusFilter === status ? "default" : "outline"} 
                            size="sm"
                            onClick={() => setStatusFilter(status)}
                            className={cn(
                                "rounded-xl px-5 h-10 font-bold capitalize transition-all",
                                statusFilter === status ? "shadow-lg shadow-primary/20 scale-105" : "border-border/50 bg-white/50 backdrop-blur-sm"
                            )}
                        >
                            {status}
                        </Button>
                    ))}
                </div>
            </div>
        </section>

        {/* Results List */}
        <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Research Entities</h2>
                </div>
                <Badge variant="outline" className="rounded-full border-border bg-muted/30 font-bold px-3 py-1">
                    {filteredTheses.length} Entries Identified
                </Badge>
            </div>

            <div className="space-y-6">
                {filteredTheses.map((thesis) => (
                    <Card key={thesis.id} className="group overflow-hidden border-border/50 bg-background/80 backdrop-blur-sm rounded-3xl shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all ring-1 ring-primary/5">
                        <div className="p-6 sm:p-8">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:scale-110 transition-transform">
                                            <FileText className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                                                {thesis.title}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                                <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                                                    ID: #{thesis.id}
                                                </span>
                                                <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                                                    {thesis.department}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-black border border-border/50">
                                                {thesis.author?.[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/40 leading-none mb-1">Lead Researcher</span>
                                                <span className="text-sm font-bold text-foreground/80">{thesis.author}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-[10px] font-black border border-primary/10">
                                                {thesis.supervisor?.[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/40 leading-none mb-1">Supervisory Lead</span>
                                                <span className="text-sm font-bold text-foreground/80">{thesis.supervisor}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-6 shrink-0">
                                    <Badge className={cn("text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-xl border-2", getStatusColor(thesis.status))}>
                                        {thesis.status}
                                    </Badge>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/40 leading-none mb-1">Submission Date</p>
                                        <p className="text-xs font-bold text-foreground/60">
                                            {thesis.submittedDate ? new Date(thesis.submittedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Pending"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-border/30 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <Link href={`/theses/${thesis.id}`}>
                                        <Button className="rounded-2xl h-11 px-6 bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold transition-all border-none">
                                            <Eye className="h-4 w-4 mr-2" />
                                            Inspect Work
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "rounded-2xl h-11 px-6 font-bold transition-all gap-2",
                                            thesis.visibility === 'hidden'
                                                ? "border-amber-500/40 text-amber-600 hover:bg-amber-500/10"
                                                : "border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10"
                                        )}
                                        onClick={() => handleToggleVisibility(thesis.id, thesis.visibility || 'visible')}
                                        disabled={isTogglingVisibility === thesis.id}
                                    >
                                        {isTogglingVisibility === thesis.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : thesis.visibility === 'hidden' ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                        {thesis.visibility === 'hidden' ? 'Hidden' : 'Visible'}
                                    </Button>
                                </div>
                                
                                <Button 
                                    variant="ghost" 
                                    className="rounded-2xl h-11 px-6 text-rose-500 hover:bg-rose-500/10 font-bold transition-all"
                                    onClick={() => handleDelete(thesis.id)}
                                    disabled={isLoading === thesis.id}
                                >
                                    {isLoading === thesis.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <Trash2 className="h-4 w-4 mr-2" />
                                    )}
                                    Destroy Asset
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}

                {filteredTheses.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 bg-muted/5 rounded-3xl border-2 border-dashed border-border/50">
                        <div className="p-6 rounded-full bg-muted/20">
                            <Search className="h-12 w-12 text-muted-foreground/20" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-black text-foreground/60">Zero Matrices Found</p>
                            <p className="text-sm font-medium text-muted-foreground/60 max-w-xs mx-auto">Your current operational filters yielded no research assets. Try broadening your parameters.</p>
                        </div>
                        <Button variant="outline" className="rounded-2xl font-bold h-12 px-8 border-border" onClick={() => { setSearch(""); setStatusFilter("all"); }}>
                            Reset All Matrix Filters
                        </Button>
                    </div>
                )}
            </div>
        </section>
      </div>
    </div>
  )
}
