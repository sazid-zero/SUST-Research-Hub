
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
import { Input } from "@/components/ui/input" // Not needed strictly if using Select, but kept
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GraduationCap, Loader2 } from "lucide-react"
import { useState } from "react"
import { useActionState } from "react"
import { requestSupervision } from "@/app/actions/workspace"
import { User } from "@/lib/db/users"

const initialState = {
  message: "",
  success: false,
}

interface SupervisionRequestDialogProps {
  workspaceId: number
  type: "thesis" | "project" | "publication"
  supervisors: User[]
}

export function SupervisionRequestDialog({ workspaceId, type, supervisors }: SupervisionRequestDialogProps) {
  const [open, setOpen] = useState(false)
  // @ts-ignore
  const [state, formAction, pending] = useActionState(requestSupervision, initialState)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
            <GraduationCap className="mr-2 h-4 w-4" />
            Request Supervisor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <form action={formAction}>
            <input type="hidden" name="workspaceId" value={workspaceId} />
            <input type="hidden" name="type" value={type} />
            
            <DialogHeader>
            <DialogTitle>Request Supervision</DialogTitle>
            <DialogDescription>
                Select a faculty member and propose your topic.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            
            {state?.message && (
                <div className={`p-3 text-sm rounded-md ${state.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {state.message}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="supervisorId">Select Supervisor</Label>
                <Select name="supervisorId" required>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select faculty member..." />
                    </SelectTrigger>
                    <SelectContent>
                        {supervisors.map((supervisor) => (
                            <SelectItem key={supervisor.id} value={supervisor.id.toString()}>
                                <div className="flex flex-col text-left">
                                    <span className="font-medium">{supervisor.full_name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {supervisor.department} {supervisor.specialization ? `• ${supervisor.specialization}` : ''}
                                    </span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="topicProposal">Topic Proposal / Message</Label>
                <Textarea 
                    id="topicProposal" 
                    name="topicProposal" 
                    placeholder="Describe your proposed research topic and why you want to work with this supervisor..."
                    className="min-h-[120px]"
                    required
                />
            </div>
            
            </div>
            <DialogFooter>
            <Button type="submit" disabled={pending}>
                {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Send Request
            </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
