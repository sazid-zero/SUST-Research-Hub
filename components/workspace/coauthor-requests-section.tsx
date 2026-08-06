"use client"

import { useState, useEffect } from "react"
import { getPendingCoauthorRequests, acceptCoauthorRequest, declineCoauthorRequest } from "@/app/actions/workspace"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface CoauthorRequestsSectionProps {
  publicationId: number
  canManage: boolean
}

export function CoauthorRequestsSection({ publicationId, canManage }: CoauthorRequestsSectionProps) {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [processingId, setProcessingId] = useState<number | null>(null)

  useEffect(() => {
    if (canManage) {
      fetchRequests()
    }
  }, [publicationId, canManage])

  const fetchRequests = async () => {
    setLoading(true)
    const result = await getPendingCoauthorRequests(publicationId)
    setRequests(result.requests || [])
    setLoading(false)
  }

  const handleAccept = async (requestId: number) => {
    setProcessingId(requestId)
    const result = await acceptCoauthorRequest(requestId, publicationId)
    if (result.success) {
      toast.success("Co-author invitation accepted!")
      setRequests(prev => prev.filter(r => r.id !== requestId))
    } else {
      toast.error(result.message)
    }
    setProcessingId(null)
  }

  const handleDecline = async (requestId: number) => {
    setProcessingId(requestId)
    const result = await declineCoauthorRequest(requestId, publicationId)
    if (result.success) {
      toast.success("Co-author invitation declined")
      setRequests(prev => prev.filter(r => r.id !== requestId))
    } else {
      toast.error(result.message)
    }
    setProcessingId(null)
  }

  if (!canManage || requests.length === 0) {
    return null
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Users className="h-5 w-5" />
          Pending Co-author Invitations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          requests.map(request => (
            <div key={request.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-100">
              <div className="flex items-center gap-3 flex-1">
                <Clock className="h-4 w-4 text-yellow-600" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{request.full_name}</p>
                  <p className="text-xs text-muted-foreground">{request.email}</p>
                </div>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  Pending
                </Badge>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDecline(request.id)}
                  disabled={processingId === request.id}
                  className="text-red-600 hover:text-red-700"
                >
                  {processingId === request.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  <span className="ml-1 hidden sm:inline">Decline</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAccept(request.id)}
                  disabled={processingId === request.id}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {processingId === request.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <CheckCircle className="h-3 w-3" />
                  )}
                  <span className="ml-1 hidden sm:inline">Accept</span>
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
