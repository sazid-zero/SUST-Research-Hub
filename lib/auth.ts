import bcrypt from "bcryptjs"
import { sql } from "./db"
import { cookies } from "next/headers"
import { cache } from "react"

const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) {
    return false
  }

  try {
    const result = await bcrypt.compare(password, hash)
    return result
  } catch (error) {
    console.error("[Auth] Password verification error:", error)
    return false
  }
}

export function generateToken(): string {
  const randomBytes = new Uint8Array(32)
  crypto.getRandomValues(randomBytes)
  return Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export interface User {
  id: number
  email: string
  full_name: string
  role: "student" | "supervisor" | "admin"
  student_id?: string
  department?: string
  specialization?: string
  is_approved: boolean
  created_at: Date
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const results = await sql`SELECT * FROM users WHERE email = ${email}`
  return results[0] || null
}

export async function getUserById(id: number): Promise<User | null> {
  const results = await sql`SELECT * FROM users WHERE id = ${id}`
  return results[0] || null
}

export async function createUser(userData: {
  email: string
  password: string
  full_name: string
  role: "student" | "supervisor" | "admin"
  student_id?: string
  department?: string
  specialization?: string
}): Promise<User> {
  const passwordHash = await hashPassword(userData.password)

  const results = await sql`
    INSERT INTO users (email, password_hash, full_name, role, student_id, department, specialization, is_approved)
    VALUES (${userData.email}, ${passwordHash}, ${userData.full_name}, ${userData.role}, ${userData.student_id || null}, ${userData.department || null}, ${userData.specialization || null}, ${userData.role === "admin" ? true : false})
    RETURNING *
  `

  return results[0]
}

export async function createSession(userId: number): Promise<string> {
  const token = generateToken()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  await sql`INSERT INTO sessions (user_id, token, expires_at) VALUES (${userId}, ${token}, ${expiresAt})`

  return token
}

export async function verifySession(token: string): Promise<User | null> {
  try {
    const results = await sql`
      SELECT u.* FROM users u
      JOIN sessions s ON u.id = s.user_id
      WHERE s.token = ${token} AND s.expires_at > NOW()
      LIMIT 1
    `
    return results[0] || null
  } catch (error) {
    console.error("[Auth] Session verification error:", error)
    return null
  }
}

export async function deleteSession(token: string): Promise<void> {
  await sql`DELETE FROM sessions WHERE token = ${token}`
}

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("session_token")?.value

  if (!sessionToken) {
    return null
  }

  const user = await verifySession(sessionToken)
  return user
})

export async function getPendingRegistrations(): Promise<any[]> {
  const results = await sql`
    SELECT u.id, u.email, u.full_name, u.role, u.student_id, u.department, u.specialization, 
           rr.id as request_id, rr.created_at as requested_at
    FROM users u
    JOIN registration_requests rr ON u.id = rr.user_id
    WHERE rr.status = 'pending'
    ORDER BY rr.created_at DESC
  `
  return results
}

export async function approveRegistration(userId: number, approvedBy: number): Promise<void> {
  await sql`UPDATE users SET is_approved = true, approval_date = NOW() WHERE id = ${userId}`

  await sql`UPDATE registration_requests SET status = 'approved', reviewed_by = ${approvedBy}, reviewed_at = NOW() WHERE user_id = ${userId}`
}

export async function rejectRegistration(userId: number, approvedBy: number, reason: string): Promise<void> {
  await sql`UPDATE registration_requests SET status = 'rejected', reviewed_by = ${approvedBy}, reviewed_at = NOW(), rejection_reason = ${reason} WHERE user_id = ${userId}`
}
