'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Clock, Check, X, AlertCircle } from "lucide-react"
import { handleSupervisionRequest } from "@/app/actions/supervisor"
import { toast } from "sonner"

interface RequestsClientProps {
  initialRequests: any[]
}

export function RequestsClient({ initialRequests }: RequestsClientProps) {
  const [requests, setRequests] = useState(initialRequests)
  const [loading, setLoading] = useState<number | null>(null)

  const handleAction = async (id: number, action: 'accept' | 'reject') => {
    setLoading(id)
    const result = await handleSupervisionRequest(id, action)
    if (result.success) {
      toast.success(result.message)
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action === 'accept' ? 'accepted' : 'rejected' } : r))
    } else {
      toast.error(result.message)
    }
    setLoading(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'accepted': return <Badge className="bg-green-100 text-green-800">Accepted</Badge>
      case 'rejected': return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default: return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="grid gap-4 mb-20">
      {requests.map((request) => (
        <Card key={request.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{request.student_name}</CardTitle>
                  {getStatusBadge(request.status)}
                </div>
                <CardDescription>
                  {request.student_department} • Submitted {new Date(request.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-semibold mb-2">Topic Proposal / Thesis Title:</h4>
              <p className="text-sm text-foreground italic">
                {request.topic_proposal || request.thesis_title || "No specific proposal provided."}
              </p>
            </div>

            {request.status === 'pending' && (
              <div className="flex gap-2 justify-end pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleAction(request.id, 'reject')}
                  disabled={loading === request.id}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleAction(request.id, 'accept')}
                  disabled={loading === request.id}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Accept Supervision
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      {requests.length === 0 && (
        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-border">
          <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No supervision requests</h3>
          <p className="text-muted-foreground">You don't have any incoming requests at the moment.</p>
        </div>
      )}
    </div>
  )
}
