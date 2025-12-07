"use client"

import { useState } from "react"
import { approveRegistration, rejectRegistration } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

interface Registration {
  id: number
  email: string
  full_name: string
  role: string
  student_id?: string
  department?: string
  username?: string
  requested_at: string
  reviewed_at?: string
  rejection_reason?: string
}

interface Props {
  initialPending: Registration[]
  initialApproved: Registration[]
  initialRejected: Registration[]
}

export default function RegistrationsClient({ initialPending, initialApproved, initialRejected }: Props) {
  const router = useRouter()
  const [rejectDialog, setRejectDialog] = useState({ open: false, userId: 0 })
  const [rejectionReason, setRejectionReason] = useState("")

  const handleApprove = async (userId: number) => {
    const result = await approveRegistration(userId)
    if (result.success) {
      toast.success(result.message)
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason")
      return
    }

    const result = await rejectRegistration(rejectDialog.userId, rejectionReason)
    if (result.success) {
      toast.success(result.message)
      setRejectDialog({ open: false, userId: 0 })
      setRejectionReason("")
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  const RegistrationCard = ({ reg, status }: { reg: Registration; status: "pending" | "approved" | "rejected" }) => (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{reg.full_name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium text-sm">{reg.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-medium capitalize">{reg.role}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{reg.role === "student" ? "Student ID" : "Username"}</p>
            <p className="font-medium">{reg.role === "student" ? reg.student_id : reg.username}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Department</p>
            <p className="font-medium">{reg.department}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Requested</p>
            <p className="font-medium">{new Date(reg.requested_at).toLocaleDateString()}</p>
          </div>
        </div>

        {status === "rejected" && reg.rejection_reason && (
          <div className="mb-4 p-3 bg-destructive/10 rounded-md border border-destructive/20">
            <p className="text-sm">
              <strong>Reason:</strong> {reg.rejection_reason}
            </p>
          </div>
        )}

        {status === "pending" && (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleApprove(reg.id)} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                setRejectDialog({ open: true, userId: reg.id })
                setRejectionReason("")
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold">Registration Approvals</h1>
        <p className="text-muted-foreground">Review and approve pending user registrations</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="relative">
            <Clock className="h-4 w-4 mr-2" />
            Pending
            {initialPending.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                {initialPending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">
            <CheckCircle className="h-4 w-4 mr-2" />
            Approved
          </TabsTrigger>
          <TabsTrigger value="rejected">
            <XCircle className="h-4 w-4 mr-2" />
            Rejected
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {initialPending.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">No pending registrations</p>
              </CardContent>
            </Card>
          ) : (
            initialPending.map((reg) => <RegistrationCard key={reg.id} reg={reg} status="pending" />)
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          {initialApproved.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">No approved registrations</p>
              </CardContent>
            </Card>
          ) : (
            initialApproved.map((reg) => <RegistrationCard key={reg.id} reg={reg} status="approved" />)
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          {initialRejected.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">No rejected registrations</p>
              </CardContent>
            </Card>
          ) : (
            initialRejected.map((reg) => <RegistrationCard key={reg.id} reg={reg} status="rejected" />)
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={rejectDialog.open} onOpenChange={(open) => setRejectDialog({ ...rejectDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Registration</AlertDialogTitle>
            <AlertDialogDescription>Provide a reason for rejecting this registration</AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Reason for rejection (will be sent to the user)"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-24"
          />
          <div className="flex gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} className="bg-destructive">
              Reject
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
