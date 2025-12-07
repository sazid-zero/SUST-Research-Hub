import React from "react"
import { StudentProfileClient } from '@/components/student-profile-client'
import { getStudentProfileWithAuth } from '@/app/actions/profile'
import { redirect } from 'next/navigation'

export default async function StudentProfilePage({ params }: { params: { id: string } }) {
  const { id } = params
  
  const result = await getStudentProfileWithAuth(id)
  
  if (!result.success || !result.data) {
    redirect('/404')
  }

  return <StudentProfileClient student={result.data} isOwnProfile={result.currentUser?.student_id === id} currentUserRole={result.currentUser?.role} />
}
