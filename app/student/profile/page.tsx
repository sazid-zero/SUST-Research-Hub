import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/app/actions/auth'
import { StudentProfileClient } from '@/components/student-profile-client'
import { getStudentProfileWithAuth } from '@/app/actions/profile'

export default async function StudentProfilePage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  if (user.role !== 'student') {
    redirect('/login')
  }

  // Fetch own profile directly without redirect
  if (!user.student_id) {
    redirect('/student/dashboard')
  }

  const result = await getStudentProfileWithAuth(user.student_id)
  
  if (!result.success || !result.data) {
    redirect('/404')
  }

  return <StudentProfileClient student={result.data} isOwnProfile={true} currentUserRole={user.role} />
}
