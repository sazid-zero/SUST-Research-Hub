'use server'

import { neon } from '@neondatabase/serverless'
import { getCurrentUser } from './auth'

const sql = neon(process.env.DATABASE_URL!)

// Only query columns that exist in the actual database schema

// Optimized combined query for student profile
export async function getStudentProfileWithAuth(studentId: string) {
  try {
    const currentUser = await getCurrentUser()
    
    // Check authorization first
    const canView = currentUser?.role === 'admin' || 
                   currentUser?.role === 'supervisor' || 
                   currentUser?.student_id === studentId
    
    if (!canView) {
      return { success: false, error: 'Not authorized', data: null, currentUser: null }
    }

    const [student] = await sql`
      SELECT 
        id, full_name, email, department, student_id,
        created_at, role, is_approved
      FROM users
      WHERE student_id = ${studentId} AND role = 'student'
      LIMIT 1
    `
    
    if (!student) {
      return { success: false, error: 'Student not found', data: null, currentUser }
    }

    return { success: true, data: student, currentUser }
  } catch (error: any) {
    console.error('[Profile] Error:', error)
    return { success: false, error: 'Failed to fetch student profile', data: null, currentUser: null }
  }
}

export async function getSupervisorProfileWithAuth(supervisorId: number) {
  try {
    const currentUser = await getCurrentUser()
    
    // Check authorization - only allow admins or the supervisor viewing their own profile
    const canView = currentUser?.role === 'admin' || 
                   currentUser?.id === supervisorId
    
    if (!canView) {
      return { success: false, error: 'Not authorized', data: null, currentUser: null }
    }

    const [supervisor] = await sql`
      SELECT 
        id, full_name, email, department,
        created_at, role, is_approved
      FROM users
      WHERE id = ${supervisorId} AND role = 'supervisor'
      LIMIT 1
    `
    
    if (!supervisor) {
      return { success: false, error: 'Supervisor not found', data: null, currentUser }
    }

    return { success: true, data: supervisor, currentUser }
  } catch (error: any) {
    console.error('[Profile] Error:', error)
    return { success: false, error: 'Failed to fetch supervisor profile', data: null, currentUser: null }
  }
}

export async function getStudentProfile(studentId: string) {
  try {
    const [student] = await sql`
      SELECT 
        id, full_name, email, department, student_id,
        created_at, role
      FROM users
      WHERE student_id = ${studentId} AND role = 'student'
    `
    
    if (!student) {
      return { success: false, error: 'Student not found' }
    }

    return { success: true, data: student }
  } catch (error: any) {
    console.error('[Profile] Get student error:', error)
    return { success: false, error: 'Failed to fetch student profile' }
  }
}

export async function getSupervisorProfile(supervisorId: number) {
  try {
    const [supervisor] = await sql`
      SELECT 
        id, full_name, email, department,
        created_at, role
      FROM users
      WHERE id = ${supervisorId} AND role = 'supervisor'
    `
    
    if (!supervisor) {
      return { success: false, error: 'Supervisor not found' }
    }

    return { success: true, data: supervisor }
  } catch (error: any) {
    console.error('[Profile] Get supervisor error:', error)
    return { success: false, error: 'Failed to fetch supervisor profile' }
  }
}

export async function updateStudentProfile(data: any) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' }
    }

    await sql`
      UPDATE users
      SET 
        full_name = ${data.fullName},
        email = ${data.email},
        department = ${data.department}
      WHERE id = ${currentUser.id} AND role = 'student'
    `

    return { success: true }
  } catch (error: any) {
    console.error('[Profile] Update student error:', error)
    return { success: false, error: 'Failed to update profile' }
  }
}

export async function updateSupervisorProfile(data: any) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' }
    }

    await sql`
      UPDATE users
      SET 
        full_name = ${data.fullName},
        email = ${data.email},
        department = ${data.department}
      WHERE id = ${currentUser.id} AND role = 'supervisor'
    `

    return { success: true }
  } catch (error: any) {
    console.error('[Profile] Update supervisor error:', error)
    return { success: false, error: 'Failed to update profile' }
  }
}
