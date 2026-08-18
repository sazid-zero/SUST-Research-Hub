"use server"

import { redirect } from "next/navigation"
import { setSessionCookie, deleteSessionCookie } from "@/lib/utils/cookies"
import { sql } from "@/lib/db"
import {
  hashPassword,
  verifyPassword,
  verifySession,
  createSession,
  deleteSession as deleteSessionDb,
  getUserByEmail,
  generateToken,
  User
} from "@/lib/auth"
import { sendRegistrationEmail, sendAdminNotificationEmail, sendVerificationLinkEmail } from "@/lib/utils/email"

export interface RegisterFormData {
  email: string
  password: string
  fullName: string
  role: "student" | "supervisor"
  studentId?: string
  department?: string
  specialization?: string
  username?: string
  phone?: string
}

export interface LoginFormData {
  email: string
  password: string
}

export async function register(formData: RegisterFormData) {
  try {
    // Validate input
    if (!formData.email || !formData.password || !formData.fullName) {
      return { success: false, error: "Missing required fields" }
    }

    const emailLower = formData.email.trim().toLowerCase()

    // Validate email domain strictly to SUST institutional emails
    if (!emailLower.endsWith("sust.edu") && !emailLower.endsWith("sust.edu.bd")) {
      return {
        success: false,
        error: "Only SUST institutional email addresses (@student.sust.edu or @sust.edu) are allowed for registration."
      }
    }

    if (formData.password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters" }
    }

    // Check if email already exists
    const existingUser = await getUserByEmail(emailLower)
    if (existingUser) {
      return { success: false, error: "Email already registered" }
    }

    // Student validation
    if (formData.role === "student") {
      if (!formData.studentId || !formData.department) {
        return { success: false, error: "Student ID and department are required for students" }
      }

      // Check if student ID already exists
      const existingStudent = await sql`SELECT id FROM users WHERE student_id = ${formData.studentId}`
      if (existingStudent.length > 0) {
        return { success: false, error: "Student ID already registered" }
      }
    }

    // Supervisor validation
    if (formData.role === "supervisor") {
      if (!formData.department) {
        return { success: false, error: "Department is required for supervisors" }
      }
    }

    const passwordHash = await hashPassword(formData.password)

    const results = await sql`
      INSERT INTO users (
        email, password_hash, full_name, role, student_id, department, phone, username, is_approved
      )
      VALUES (
        ${emailLower}, ${passwordHash}, ${formData.fullName}, ${formData.role}, 
        ${formData.studentId || null}, ${formData.department || null}, ${formData.phone || null},
        ${formData.username || null},
        ${(formData.role as string) === "admin"}
      )
      RETURNING *
    `

    const user = results[0] as User

    // Create registration request record
    await sql`INSERT INTO registration_requests (user_id, status) VALUES (${user.id}, 'pending')`

    // Generate Verification Token for automated email verification
    const token = generateToken()
    await sql`
      INSERT INTO email_verification_tokens (user_id, token, expires_at)
      VALUES (${user.id}, ${token}, NOW() + INTERVAL '24 hours')
    `

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const verifyUrl = `${siteUrl}/verify-email?token=${token}`

    try {
      await sendVerificationLinkEmail(user.email, user.full_name, verifyUrl)
    } catch (emailError: any) {
      console.error("[Auth] Verification email error:", emailError)
    }

    return {
      success: true,
      requiresVerification: true,
      message: "Registration submitted! We've sent a verification link to your SUST email. Please check your inbox and verify to activate your account.",
    }
  } catch (error: any) {
    console.error("[Auth] Registration error:", error)
    return { success: false, error: error.message || "Registration failed. Please try again." }
  }
}

export async function verifyEmailToken(token: string) {
  try {
    if (!token) {
      return { success: false, error: "Token is required" }
    }

    // Find token in DB that is not expired
    const tokens = await sql`
      SELECT evt.*, u.id as user_id, u.email, u.full_name, u.role
      FROM email_verification_tokens evt
      JOIN users u ON evt.user_id = u.id
      WHERE evt.token = ${token} AND evt.expires_at > NOW()
    `

    if (tokens.length === 0) {
      return {
        success: false,
        error: "Invalid or expired verification link. Please request a new verification email or contact support."
      }
    }

    const tokenRecord = tokens[0]
    const userId = tokenRecord.user_id

    // Approve the user automatically upon email verification
    await sql`UPDATE users SET is_approved = true, updated_at = NOW() WHERE id = ${userId}`
    await sql`UPDATE registration_requests SET status = 'approved' WHERE user_id = ${userId}`

    // Clean up token
    await sql`DELETE FROM email_verification_tokens WHERE user_id = ${userId}`

    // Automatically create session and log the user in
    const sessionId = await createSession(userId)
    await setSessionCookie(sessionId)

    return {
      success: true,
      role: tokenRecord.role,
      message: "Email verified successfully! Welcome to SUST Research Hub."
    }
  } catch (error: any) {
    console.error("[Auth] Verify email error:", error)
    return { success: false, error: error.message || "Failed to verify email." }
  }
}


export async function login(formData: LoginFormData) {
  try {
    const { email, password } = formData

    if (!email || !password) {
      return { success: false, error: "Email and password are required" }
    }

    const user = await getUserByEmail(email)

    if (!user) {
      return { success: false, error: "Invalid email or password" }
    }

    // Check if user is approved
    if (!user.is_approved) {
      return {
        success: false,
        error: "Your registration is pending admin approval. Please check your email for updates.",
      }
    }

    const passwordValid = await verifyPassword(password, user.password_hash || "")

    if (!passwordValid) {
      return { success: false, error: "Invalid email or password" }
    }

    // Create session
    const token = await createSession(user.id)

    // Set session cookie
    await setSessionCookie(token)

    return { success: true, user }
  } catch (error: any) {
    console.error("[Auth] Login error:", error)
    return { success: false, error: error.message || "Login failed" }
  }
}

export async function logout() {
  const cookieStore = await import("next/headers").then((m) => m.cookies())
  const token = cookieStore.get("session_token")?.value

  if (token) {
    await deleteSessionDb(token)
  }

  await deleteSessionCookie()

  redirect("/login")
}

export async function getCurrentUser() {
  try {
    const cookieStore = await import("next/headers").then((m) => m.cookies())
    const token = cookieStore.get("session_token")?.value

    if (!token) {
      return null
    }

    const user = await verifySession(token)
    return user || null
  } catch (error: any) {
    console.error("Get current user error:", error)
    return null
  }
}

export async function validateSession(token?: string) {
  try {
    if (!token) {
      const cookieStore = await import("next/headers").then((m) => m.cookies())
      token = cookieStore.get("session_token")?.value
    }

    if (!token) {
      return { valid: false, user: null }
    }

    const user = await verifySession(token)
    if (!user) {
      return { valid: false, user: null }
    }

    return { valid: true, user }
  } catch (error: any) {
    console.error("Validate session error:", error)
    return { valid: false, user: null }
  }
}
