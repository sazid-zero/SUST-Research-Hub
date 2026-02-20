"use client"

import { useState } from "react"
import { Search, Plus, GraduationCap, FileText, LayoutDashboard, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { linkRelatedWork } from "@/app/actions/workspace"
import { toast } from "sonner"

interface LinkRelatedWorkDialogProps {
  workspaceId: number
  workspaceType: string
  onLinked: () => void
}

export function LinkRelatedWorkDialog({ workspaceId, workspaceType, onLinked }: LinkRelatedWorkDialogProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<any | null>(null)

  const handleSearch = async () => {
      if (!query) return
      setLoading(true)
      try {
          // We'll add a global search action for this later, for now we mock or fetch directly
          const res = await fetch(`/api/research/search?q=${query}`)
          const data = await res.json()
          setResults(data)
      } catch (error) {
          toast.error("Search failed")
      } finally {
          setLoading(false)
      }
  }

  const handleLink = async () => {
      if (!selected) return

      const result = await linkRelatedWork(
          workspaceId,
          workspaceType,
          selected.id,
          selected.type,
          `Reference to ${selected.title}`
      )

      if (result.success) {
          toast.success("Work linked successfully")
          setOpen(false)
          onLinked()
      } else {
          toast.error(result.message)
      }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-8 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-xs font-bold">
            <Plus className="w-4 h-4 mr-1" /> Link Research
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#1a2436]">
        <DialogHeader>
          <DialogTitle>Link Related Research</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="flex gap-2">
                <Input 
                    placeholder="Search for papers, theses, or projects..." 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </Button>
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-2 custom-scrollbar pr-1">
                {results.map((item) => (
                    <div 
                        key={`${item.type}-${item.id}`}
                        onClick={() => setSelected(item)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            selected?.id === item.id && selected?.type === item.type 
                                ? 'border-indigo-500 bg-indigo-500/5' 
                                : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                                {item.type === 'thesis' ? <GraduationCap className="w-4 h-4" /> : 
                                 item.type === 'publication' ? <FileText className="w-4 h-4" /> : 
                                 <LayoutDashboard className="w-4 h-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold truncate">{item.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-[9px] uppercase tracking-tighter">
                                        {item.type}
                                    </Badge>
                                    <span className="text-[10px] text-slate-500 truncate">{item.department}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {!loading && query && results.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-sm italic">
                        No research works found matching "{query}"
                    </div>
                )}
            </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleLink} disabled={!selected}>Link Reference</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
