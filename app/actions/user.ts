'use server'

import { sql } from '@/lib/db'
import { getCurrentUser } from './auth'

export async function getUserProfile() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    return { success: true, user }
  } catch (error: any) {
    console.error('Get profile error:', error)
    return { success: false, error: error.message }
  }
}

export async function updateUserProfile(data: any) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const result = await sql`
      UPDATE users SET full_name = ${data.full_name}, department = ${data.department}, specialization = ${data.specialization}, updated_at = NOW()
      WHERE id = ${user.id} RETURNING *
    `

    return { success: true, user: result[0] }
  } catch (error: any) {
    console.error('Update profile error:', error)
    return { success: false, error: error.message }
  }
}
