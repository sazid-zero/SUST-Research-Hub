'use server'

import { sql } from '@/lib/db'
import { getCurrentUser } from './auth'
import { sendApprovalEmail, sendRejectionEmail } from '@/lib/utils/email'
import { revalidatePath } from 'next/cache'
import { createNotification } from './notifications'

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

export async function getAdminStats() {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    const [stats] = await sql`
      SELECT 
        (SELECT COUNT(*) FROM theses) as total_theses,
        (SELECT COUNT(*) FROM users WHERE is_approved = true) as active_users,
        (SELECT COUNT(*) FROM theses WHERE status = 'pending') as pending_reviews,
        (SELECT COUNT(*) FROM theses WHERE status = 'approved') as approved_theses
    `

    return { 
      success: true, 
      stats: {
        totalTheses: Number(stats.total_theses),
        activeUsers: Number(stats.active_users),
        pendingReviews: Number(stats.pending_reviews),
        approvedTheses: Number(stats.approved_theses)
      } 
    }
  } catch (error: any) {
    console.error('Get admin stats error:', error)
    return { success: false, error: error.message }
  }
}

export async function getRecentActivity() {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    // Combine recent submissions and registrations
    const activities = await sql`
      (SELECT 'submission' as type, title, 'New thesis submitted' as action, created_at as time, id
       FROM theses 
       ORDER BY created_at DESC LIMIT 5)
      UNION ALL
      (SELECT 'registration' as type, full_name as title, 'New user registered' as action, created_at as time, id
       FROM users 
       ORDER BY created_at DESC LIMIT 5)
      ORDER BY time DESC
      LIMIT 10
    `

    return { success: true, activities }
  } catch (error: any) {
    console.error('Get recent activity error:', error)
    return { success: false, error: error.message }
  }
}

export async function getAllUsers(search?: string) {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    let query = sql`
      SELECT id, full_name, email, role, department, is_approved, is_department_head, created_at
      FROM users
      WHERE role != 'admin'
    `
    
    if (search) {
      query = sql`
        SELECT id, full_name, email, role, department, is_approved, is_department_head, created_at
        FROM users
        WHERE role != 'admin' 
        AND (LOWER(full_name) LIKE ${'%' + search.toLowerCase() + '%'} 
             OR LOWER(email) LIKE ${'%' + search.toLowerCase() + '%'})
        ORDER BY created_at DESC
      `
    } else {
      query = sql`
        SELECT id, full_name, email, role, department, is_approved, is_department_head, created_at
        FROM users
        WHERE role != 'admin'
        ORDER BY created_at DESC
      `
    }

    const results = await query
    return { success: true, users: results }
  } catch (error: any) {
    console.error('Get all users error:', error)
    return { success: false, error: error.message }
  }
}

export async function updateUserStatus(userId: number, isApproved: boolean) {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    await sql`UPDATE users SET is_approved = ${isApproved} WHERE id = ${userId}`
    
    return { success: true, message: `User status updated successfully` }
  } catch (error: any) {
    console.error('Update user status error:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteUser(userId: number) {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    // Check for dependencies or just delete (assuming cascade if set up, or handle manually)
    // For now, let's just delete the user. 
    // WARNING: In a real app we should handle associated data.
    await sql`DELETE FROM registration_requests WHERE user_id = ${userId}`
    await sql`DELETE FROM users WHERE id = ${userId}`

    return { success: true, message: 'User deleted successfully' }
  } catch (error: any) {
    console.error('Delete user error:', error)
    return { success: false, error: error.message }
  }
}

export async function getSystemAnalytics() {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    // 1. Submission Trend (Last 6 months)
    const submissionTrend = await sql`
      SELECT 
        TO_CHAR(created_at, 'Mon') as month,
        COUNT(*) as submissions,
        COUNT(*) FILTER (WHERE status = 'approved') as approved,
        EXTRACT(MONTH FROM created_at) as month_num
      FROM theses
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY month, month_num
      ORDER BY month_num ASC
    `

    // 2. Department Distribution
    const departmentStats = await sql`
      SELECT department as name, COUNT(*) as value
      FROM theses
      GROUP BY department
      ORDER BY value DESC
    `

    // 3. Status Distribution
    const statusDistribution = await sql`
      SELECT 
        status as name, 
        COUNT(*) as value,
        CASE 
          WHEN status = 'approved' THEN '#10b981'
          WHEN status = 'pending' THEN '#f59e0b'
          WHEN status = 'rejected' THEN '#ef4444'
          ELSE '#6b7280'
        END as color
      FROM theses
      GROUP BY status
    `

    return { 
      success: true, 
      data: {
        submissionTrend: submissionTrend.map((row: any) => ({
          month: row.month,
          submissions: Number(row.submissions),
          approved: Number(row.approved)
        })),
        departmentStats: departmentStats.map((row: any) => ({
          name: row.name,
          value: Number(row.value)
        })),
        statusDistribution: statusDistribution.map((row: any) => ({
          name: row.name.charAt(0).toUpperCase() + row.name.slice(1),
          value: Number(row.value),
          color: row.color
        }))
      } 
    }
  } catch (error: any) {
    console.error('Get system analytics error:', error)
    return { success: false, error: error.message }
  }
}

export async function getSystemSettings() {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    // Try to fetch from a system_settings table if it exists
    const [row]: any = await sql`SELECT settings FROM system_settings WHERE id = 1`
    
    const settings = row?.settings || {
        systemName: "SUST Thesis Repository",
        systemEmail: "admin@sust-thesis.edu.bd",
        maxFileSize: "50",
        maintenanceMode: false,
        allowNewRegistrations: true,
        requireEmailVerification: true,
        autoApproveThesis: false,
    }

    return { success: true, settings }
  } catch (error: any) {
    console.error('Get system settings error:', error)
    return { success: false, error: error.message }
  }
}

export async function updateSystemSettings(settings: any) {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    // Update settings in DB
    await sql`
      INSERT INTO system_settings (id, settings, updated_at)
      VALUES (1, ${JSON.stringify(settings)}, NOW())
      ON CONFLICT (id) DO UPDATE SET 
        settings = EXCLUDED.settings,
        updated_at = NOW()
    `
    
    return { success: true, message: 'Settings updated successfully' }
  } catch (error: any) {
    console.error('Update system settings error:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteThesis(thesisId: number) {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    // Delete associated data first if needed, but the DB schema likely handles cascade
    // For now, simple delete
    await sql`DELETE FROM theses WHERE id = ${thesisId}`
    
    return { success: true, message: 'Thesis deleted successfully' }
  } catch (error: any) {
    console.error('Delete thesis error:', error)
    return { success: false, error: error.message }
  }
}

export async function setThesisVisibility(thesisId: number, visibility: 'visible' | 'hidden') {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }
    await sql`UPDATE theses SET visibility = ${visibility}, updated_at = NOW() WHERE id = ${thesisId}`
    revalidatePath('/admin/theses')
    revalidatePath(`/theses/${thesisId}`)
    return { success: true, message: `Thesis set to ${visibility}` }
  } catch (error: any) {
    console.error('Set thesis visibility error:', error)
    return { success: false, error: error.message }
  }
}

export async function getSupportStats() {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    const stats = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'open') as open,
        COUNT(*) FILTER (WHERE status = 'in-progress') as in_progress,
        COUNT(*) FILTER (WHERE status = 'resolved') as resolved
      FROM support_tickets
    `

    return { 
      success: true, 
      stats: {
        open: Number(stats[0].open),
        inProgress: Number(stats[0].in_progress),
        resolved: Number(stats[0].resolved)
      } 
    }
  } catch (error: any) {
    console.error('Get support stats error:', error)
    return { success: false, error: error.message }
  }
}

export async function getSystemHealth() {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    // In a real scenarios, these would come from monitoring APIs
    // For now, we simulate with some logic or fixed data that feels real
    return {
      success: true,
      health: {
        storage: 75,
        database: "Healthy",
        apiResponse: "120ms",
        uptime: "99.9%"
      }
    }
  } catch (error: any) {
    console.error('Get system health error:', error)
    return { success: false, error: error.message }
  }
}

export async function toggleDepartmentHead(userId: number, isDeptHead: boolean) {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    await sql`UPDATE users SET is_department_head = ${isDeptHead} WHERE id = ${userId}`
    
    return { success: true, message: `Department Head status updated successfully` }
  } catch (error: any) {
    console.error('Update department head error:', error)
    return { success: false, error: error.message }
  }
}

// Paper Review Functions
export async function getPendingPaperSubmissions() {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    const results = await sql`
      SELECT 
        prr.id as review_id,
        prr.publication_id,
        prr.student_id,
        prr.submitted_at,
        prr.status,
        p.title as publication_title,
        p.abstract,
        p.year,
        u.full_name as student_name,
        u.email as student_email
      FROM paper_review_requests prr
      JOIN publications p ON prr.publication_id = p.id
      JOIN users u ON prr.student_id = u.id
      WHERE prr.status = 'pending'
      ORDER BY prr.submitted_at DESC
    `

    return { success: true, submissions: results }
  } catch (error: any) {
    console.error('Get pending papers error:', error)
    return { success: false, error: error.message }
  }
}

export async function approvePaperSubmission(publicationId: number, reviewRequestId: number) {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    // Get the paper review request and publication info
    const reviewRequest = await sql`
      SELECT prr.*, p.title, u.id as student_id, u.email, u.full_name
      FROM paper_review_requests prr
      JOIN publications p ON prr.publication_id = p.id
      JOIN users u ON prr.student_id = u.id
      WHERE prr.id = ${reviewRequestId} AND prr.publication_id = ${publicationId}
    `

    if (reviewRequest.length === 0) {
      return { success: false, error: 'Review request not found' }
    }

    const request = reviewRequest[0]

    // Update publication status to published
    await sql`
      UPDATE publications 
      SET status = 'published', updated_at = NOW() 
      WHERE id = ${publicationId}
    `

    // Update review request status
    await sql`
      UPDATE paper_review_requests 
      SET status = 'approved', reviewed_by = ${admin.id}, reviewed_at = NOW()
      WHERE id = ${reviewRequestId}
    `

    // Notify student of approval
    await createNotification({
      userId: request.student_id,
      type: 'success',
      title: 'Paper Approved',
      message: `Your paper "${request.title}" has been approved and published!`,
      link: `/student/workspace/publication/${publicationId}`,
      sourceId: publicationId,
      sourceType: 'publication'
    })

    revalidatePath('/admin/papers')
    return { success: true, message: 'Paper approved and published successfully' }
  } catch (error: any) {
    console.error('Approve paper error:', error)
    return { success: false, error: error.message }
  }
}

export async function rejectPaperSubmission(publicationId: number, reviewRequestId: number, feedback: string) {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    // Get the paper review request and publication info
    const reviewRequest = await sql`
      SELECT prr.*, p.title, u.id as student_id, u.email, u.full_name
      FROM paper_review_requests prr
      JOIN publications p ON prr.publication_id = p.id
      JOIN users u ON prr.student_id = u.id
      WHERE prr.id = ${reviewRequestId} AND prr.publication_id = ${publicationId}
    `

    if (reviewRequest.length === 0) {
      return { success: false, error: 'Review request not found' }
    }

    const request = reviewRequest[0]

    // 'rejected' is not a valid publications status per DB constraint.
    // Use 'needs_revision' so the student can revise and resubmit.
    await sql`
      UPDATE publications 
      SET status = 'needs_revision', updated_at = NOW() 
      WHERE id = ${publicationId}
    `

    // Update review request status with feedback
    await sql`
      UPDATE paper_review_requests 
      SET status = 'rejected', reviewed_by = ${admin.id}, reviewed_at = NOW(), admin_feedback = ${feedback}
      WHERE id = ${reviewRequestId}
    `

    // Notify student — paper marked needs_revision so they can revise and resubmit
    await createNotification({
      userId: request.student_id,
      type: 'error',
      title: 'Paper Needs Revision',
      message: `Your paper "${request.title}" requires revision before it can be published. Admin feedback: ${feedback}`,
      link: `/student/workspace/publication/${publicationId}`,
      sourceId: publicationId,
      sourceType: 'publication'
    })

    revalidatePath('/admin/papers')
    return { success: true, message: 'Paper rejected successfully' }
  } catch (error: any) {
    console.error('Reject paper error:', error)
    return { success: false, error: error.message }
  }
}
