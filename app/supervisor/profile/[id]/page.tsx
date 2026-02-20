import { getSupervisorProfile } from '@/app/actions/profile'
import { getCurrentUser } from '@/app/actions/auth'
import { SupervisorProfileClient } from '@/components/supervisor-profile-client'
import { redirect } from 'next/navigation'

export default async function SupervisorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idRaw } = await params
  const supervisorId = Number.parseInt(idRaw)
  const result = await getSupervisorProfile(supervisorId)
  
  if (!result.success || !result.data) {
    redirect('/404')
  }

  const currentUser = await getCurrentUser()
  const isOwnProfile = currentUser?.id === supervisorId

  return <SupervisorProfileClient supervisor={result.data} isOwnProfile={isOwnProfile} currentUserRole={currentUser?.role} />
}
