import { getPendingRegistrations, getApprovedRegistrations, getRejectedRegistrations } from "@/app/actions/admin"
import RegistrationsClient from "@/components/registrations-client"

export const revalidate = 0 // Always fetch fresh data

export default async function RegistrationsPage() {
  const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
    getPendingRegistrations(),
    getApprovedRegistrations(),
    getRejectedRegistrations(),
  ])

  return (
    <RegistrationsClient
      initialPending={pendingRes.success ? pendingRes.registrations : []}
      initialApproved={approvedRes.success ? approvedRes.registrations : []}
      initialRejected={rejectedRes.success ? rejectedRes.registrations : []}
    />
  )
}
