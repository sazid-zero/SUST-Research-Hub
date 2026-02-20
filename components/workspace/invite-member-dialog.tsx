
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserPlus, Loader2 } from "lucide-react"
import { useState } from "react"
import { useActionState } from "react" // Note: Check if React 19/Next 15 availability or use separate form handling
import { inviteMember } from "@/app/actions/workspace"

// Since useActionState might be experimental or unstable depending on Next.js version,
// we can use a standard form submission for simpler dialog handling or useActionState if available.
// Given the previous usage, assuming it's available.

const initialState = {
  message: "",
  success: false,
}

interface InviteMemberDialogProps {
  workspaceId: number
  type: "thesis" | "project" | "publication"
  children?: React.ReactNode
}

export function InviteMemberDialog({ workspaceId, type, children }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false)
  // @ts-ignore
  const [state, formAction, pending] = useActionState(inviteMember, initialState)

  // Close dialog on success
  // Note: useActionState doesn't easily trigger a callback on success without useEffect.
  // For simplicity, we just show the message.

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
            <input type="hidden" name="workspaceId" value={workspaceId} />
            <input type="hidden" name="type" value={type} />
            
            <DialogHeader>
            <DialogTitle>Invite to Workspace</DialogTitle>
            <DialogDescription>
                Add a collaborator to your research team.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            
            {state?.message && (
                <div className={`p-2 text-sm rounded ${state.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {state.message}
                </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                Email
                </Label>
                <Input
                id="email"
                name="email"
                type="email"
                placeholder="student@example.com"
                className="col-span-3"
                required
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                Role
                </Label>
                <Select name="role" defaultValue="member">
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="leader">Co-Leader</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            </div>
            <DialogFooter>
            <Button type="submit" disabled={pending}>
                {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Send Invite
            </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
