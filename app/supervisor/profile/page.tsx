import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/app/actions/auth'
import { getSupervisorProfileWithAuth } from '@/app/actions/profile'
import { SupervisorProfileClient } from '@/components/supervisor-profile-client'

export default async function SupervisorProfilePage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'supervisor') {
    redirect('/login')
  }

  const result = await getSupervisorProfileWithAuth(user.id)
  
  if (!result.success || !result.data) {
    redirect('/supervisor/dashboard')
  }

  return (
    <SupervisorProfileClient 
      supervisor={result.data} 
      isOwnProfile={true}
      currentUserRole="supervisor"
    />
  )
}
