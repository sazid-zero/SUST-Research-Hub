'use server'

import { sql } from '@/lib/db'
import { getCurrentUser } from './auth'
import { sendApprovalEmail, sendRejectionEmail } from '@/lib/utils/email'

export async function getPendingRegistrations() {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    const results = await sql`
      SELECT u.id, u.email, u.full_name, u.role, u.student_id, u.department, u.username,
             rr.created_at as requested_at
      FROM users u
      JOIN registration_requests rr ON u.id = rr.user_id
      WHERE rr.status = 'pending'
      ORDER BY rr.created_at ASC
    `

    return { success: true, registrations: results }
  } catch (error: any) {
    console.error('Get pending registrations error:', error)
    return { success: false, error: error.message }
  }
}

export async function approveRegistration(userId: number) {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    const userResult = await sql`SELECT * FROM users WHERE id = ${userId}`
    if (userResult.length === 0) {
      return { success: false, error: 'User not found' }
    }

    const user = userResult[0]

    await sql`UPDATE users SET is_approved = true, approval_date = NOW() WHERE id = ${userId}`

    await sql`UPDATE registration_requests SET status = 'approved', reviewed_by = ${admin.id}, reviewed_at = NOW() WHERE user_id = ${userId}`

    // Send approval email
    const loginUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/login`
    await sendApprovalEmail(user.email, user.full_name, loginUrl)

    return { success: true, message: `Registration approved for ${user.full_name}` }
  } catch (error: any) {
    console.error('Approve registration error:', error)
    return { success: false, error: error.message }
  }
}

export async function rejectRegistration(userId: number, reason: string) {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    const userResult = await sql`SELECT * FROM users WHERE id = ${userId}`
    if (userResult.length === 0) {
      return { success: false, error: 'User not found' }
    }

    const user = userResult[0]

    const reapplyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/register`
    await sendRejectionEmail(user.email, user.full_name, reason, reapplyUrl)

    await sql`DELETE FROM registration_requests WHERE user_id = ${userId}`
    await sql`DELETE FROM users WHERE id = ${userId}`

    return { success: true, message: `Registration rejected and removed for ${user.full_name}` }
  } catch (error: any) {
    console.error('Reject registration error:', error)
    return { success: false, error: error.message }
  }
}

export async function getApprovedRegistrations() {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    const results = await sql`
      SELECT u.id, u.email, u.full_name, u.role, u.student_id, u.department, u.username,
             rr.reviewed_at, rr.created_at as requested_at
      FROM users u
      JOIN registration_requests rr ON u.id = rr.user_id
      WHERE rr.status = 'approved'
      ORDER BY rr.reviewed_at DESC
    `

    return { success: true, registrations: results }
  } catch (error: any) {
    console.error('Get approved registrations error:', error)
    return { success: false, error: error.message }
  }
}

export async function getRejectedRegistrations() {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    const results = await sql`
      SELECT u.id, u.email, u.full_name, u.role, u.student_id, u.department, u.username,
             rr.reviewed_at, rr.rejection_reason, rr.created_at as requested_at
      FROM users u
      JOIN registration_requests rr ON u.id = rr.user_id
      WHERE rr.status = 'rejected'
      ORDER BY rr.reviewed_at DESC
    `

    return { success: true, registrations: results }
  } catch (error: any) {
    console.error('Get rejected registrations error:', error)
    return { success: false, error: error.message }
  }
}
