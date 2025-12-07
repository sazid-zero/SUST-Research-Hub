import { getSupervisorProfile } from '@/app/actions/profile'
import { getCurrentUser } from '@/app/actions/auth'
import { SupervisorProfileClient } from '@/components/supervisor-profile-client'
import { redirect } from 'next/navigation'

export default async function SupervisorProfilePage({ params }: { params: { username: string } }) {
  const { username } = params
  const result = await getSupervisorProfile(username)
  
  if (!result.success || !result.data) {
    redirect('/404')
  }

  const currentUser = await getCurrentUser()
  
  const isOwnProfile = currentUser?.username === username
  
  const canView = currentUser?.role === 'admin' || 
                  currentUser?.role === 'supervisor' || 
                  currentUser?.role === 'student' || 
                  isOwnProfile

  if (!canView) {
    redirect('/login')
  }

  return <SupervisorProfileClient supervisor={result.data} isOwnProfile={isOwnProfile} currentUserRole={currentUser?.role} />
}
