"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { sql } from "@/lib/db"
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
import { acceptCoauthorRequest, declineCoauthorRequest } from "@/app/actions/workspace"

interface MyInvitationsDialogProps {
  userId?: number
}

export function MyInvitationsDialog({ userId }: MyInvitationsDialogProps) {
  const [open, setOpen] = useState(false)
  const [invitations, setInvitations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [processingId, setProcessingId] = useState<number | null>(null)

  useEffect(() => {
    if (open && userId) {
      fetchMyInvitations()
    }
  }, [open, userId])

  const fetchMyInvitations = async () => {
    if (!userId) return
    setLoading(true)
    try {
      // This would ideally be a server action, but for now we show it in the dialog
      setInvitations([])
    } catch (error) {
      console.error("Failed to fetch invitations:", error)
    }
    setLoading(false)
  }

  const handleAccept = async (requestId: number, publicationId: number) => {
    setProcessingId(requestId)
    const result = await acceptCoauthorRequest(requestId, publicationId)
    if (result.success) {
      toast.success("Invitation accepted!")
      setInvitations(prev => prev.filter(i => i.id !== requestId))
    } else {
      toast.error(result.message)
    }
    setProcessingId(null)
  }

  const handleDecline = async (requestId: number, publicationId: number) => {
    setProcessingId(requestId)
    const result = await declineCoauthorRequest(requestId, publicationId)
    if (result.success) {
      toast.success("Invitation declined")
      setInvitations(prev => prev.filter(i => i.id !== requestId))
    } else {
      toast.error(result.message)
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
          <DialogTitle>Co-author Invitations</DialogTitle>
          <DialogDescription>
            Manage your pending co-author invitations
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
              <div key={invitation.id} className="p-4 border rounded-lg bg-card hover:bg-accent transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm">{invitation.publication_title}</p>
                    <p className="text-xs text-muted-foreground">Invited by {invitation.inviter_name}</p>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    <Clock className="h-2 w-2 mr-1" />
                    Pending
                  </Badge>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDecline(invitation.id, invitation.publication_id)}
                    disabled={processingId === invitation.id}
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
                    onClick={() => handleAccept(invitation.id, invitation.publication_id)}
                    disabled={processingId === invitation.id}
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
