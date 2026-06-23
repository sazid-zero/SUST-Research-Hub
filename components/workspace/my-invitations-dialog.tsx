"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Inbox, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getPendingInvitationsForUser, acceptInvitation, declineInvitation } from "@/app/actions/workspace"

interface MyInvitationsDialogProps {
  userId?: number
}

export function MyInvitationsDialog({ userId }: MyInvitationsDialogProps) {
  const [open, setOpen] = useState(false)
  const [invitations, setInvitations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [processingId, setProcessingId] = useState<number | null>(null)
  const router = useRouter()

  // Fetch invitations on mount to show badge count
  useEffect(() => {
    fetchMyInvitations()
  }, [])

  useEffect(() => {
    if (open) {
      // Refresh when dialog opens
      fetchMyInvitations()
      const interval = setInterval(fetchMyInvitations, 5000) // Poll every 5 seconds while open
      return () => clearInterval(interval)
    }
  }, [open])

  const fetchMyInvitations = async () => {
    setLoading(true)
    try {
      const result = await getPendingInvitationsForUser()
      setInvitations(result.invitations || [])
    } catch (error) {
      console.error("Failed to fetch invitations:", error)
      toast.error("Failed to load invitations")
    }
    setLoading(false)
  }

  const handleAccept = async (invitationId: number, type: string, workspaceId: number) => {
    setProcessingId(invitationId)
    try {
      const result = await acceptInvitation(invitationId, type, workspaceId)
      if (result.success) {
        toast.success("Invitation accepted!")
        setInvitations(prev => prev.filter(i => i.id !== invitationId))
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Failed to accept invitation")
    }
    setProcessingId(null)
  }

  const handleDecline = async (invitationId: number, type: string, workspaceId: number) => {
    setProcessingId(invitationId)
    try {
      const result = await declineInvitation(invitationId, type, workspaceId)
      if (result.success) {
        toast.success("Invitation declined")
        setInvitations(prev => prev.filter(i => i.id !== invitationId))
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Failed to decline invitation")
    }
    setProcessingId(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Inbox className="h-4 w-4" />
          {invitations.length > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Workspace Invitations</DialogTitle>
          <DialogDescription>
            Manage your pending invitations to join theses, projects, and publications
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No pending invitations</p>
            </div>
          ) : (
            invitations.map(invitation => (
              <div key={`${invitation.type}-${invitation.id}`} className="p-4 border rounded-lg bg-card hover:bg-accent transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{invitation.workspace_title}</p>
                    <p className="text-xs text-muted-foreground">Invited by {invitation.inviter_name}</p>
                    <Badge variant="outline" className="mt-2 bg-yellow-100 text-yellow-800 text-[10px]">
                      <Clock className="h-2 w-2 mr-1" />
                      {invitation.type.charAt(0).toUpperCase() + invitation.type.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDecline(invitation.id, invitation.type, invitation.workspace_id)}
                    disabled={processingId === invitation.id}
                    className="text-red-600 hover:text-red-700"
                  >
                    {processingId === invitation.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    <span className="ml-1">Decline</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAccept(invitation.id, invitation.type, invitation.workspace_id)}
                    disabled={processingId === invitation.id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {processingId === invitation.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <CheckCircle className="h-3 w-3" />
                    )}
                    <span className="ml-1">Accept</span>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
