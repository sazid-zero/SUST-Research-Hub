
"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Link2, Loader2, BookOpen, Briefcase } from "lucide-react"
import { useState } from "react"
import { useActionState } from "react"
import { linkPublicationToThesis, linkPublicationToProject } from "@/app/actions/workspace"

interface LinkResourceDialogProps {
  publicationId: number
  theses: any[]
  projects: any[]
}

const initialState = {
    message: "",
    success: false
}

export function LinkResourceDialog({ publicationId, theses, projects }: LinkResourceDialogProps) {
  const [open, setOpen] = useState(false)
  const [targetType, setTargetType] = useState<"thesis" | "project">("thesis")
  const [targetId, setTargetId] = useState<string>("")

  // Use standard form submission with a custom handler to choose the action
  const [pending, setPending] = useState(false)
  const [state, setState] = useState(initialState)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!targetId) return

    setPending(true)
    let result;
    if (targetType === "thesis") {
        result = await linkPublicationToThesis(publicationId, parseInt(targetId))
    } else {
        result = await linkPublicationToProject(publicationId, parseInt(targetId))
    }
    
    setState(result)
    setPending(false)
    if (result.success) {
        setTimeout(() => {
             setOpen(false)
             setState(initialState)
             setTargetId("")
        }, 1500)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
            <Link2 className="mr-2 h-4 w-4" />
            Link to Workspace
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
            <DialogHeader>
            <DialogTitle>Link Publication</DialogTitle>
            <DialogDescription>
                Connect this publication to an existing Thesis or Project.
            </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
                {state.message && (
                    <div className={`p-2 text-sm rounded ${state.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {state.message}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium">Resource Type</label>
                    <div className="flex gap-2">
                        <Button 
                            type="button"
                            variant={targetType === "thesis" ? "default" : "outline"} 
                            className="flex-1"
                            onClick={() => { setTargetType("thesis"); setTargetId(""); }}
                        >
                            <BookOpen className="mr-2 h-4 w-4" />
                            Thesis
                        </Button>
                        <Button 
                            type="button"
                            variant={targetType === "project" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => { setTargetType("project"); setTargetId(""); }}
                        >
                            <Briefcase className="mr-2 h-4 w-4" />
                            Project
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Select {targetType === "thesis" ? "Thesis" : "Project"}</label>
                    <Select value={targetId} onValueChange={setTargetId} required>
                        <SelectTrigger>
                            <SelectValue placeholder={`Select a ${targetType}...`} />
                        </SelectTrigger>
                        <SelectContent>
                            {targetType === "thesis" ? (
                                theses.length > 0 ? (
                                    theses.map(t => (
                                        <SelectItem key={t.id} value={t.id.toString()}>{t.title}</SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="none" disabled>No theses found</SelectItem>
                                )
                            ) : (
                                projects.length > 0 ? (
                                    projects.map(p => (
                                        <SelectItem key={p.id} value={p.id.toString()}>{p.title}</SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="none" disabled>No projects found</SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <DialogFooter>
            <Button type="submit" disabled={pending || !targetId}>
                {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Link Now
            </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
