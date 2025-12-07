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
} from "@/lib/auth"
import { sendRegistrationEmail, sendAdminNotificationEmail } from "@/lib/utils/email"

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

    if (formData.password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters" }
    }

    // Check if email already exists
    const existingUser = await getUserByEmail(formData.email)
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
        email, password_hash, full_name, role, student_id, department, is_approved
      )
      VALUES (
        ${formData.email}, ${passwordHash}, ${formData.fullName}, ${formData.role}, 
        ${formData.studentId || null}, ${formData.department || null}, 
        ${formData.role === "admin"}
      )
      RETURNING *
    `

    const user = results[0]

    // Create registration request for admin approval
    await sql`INSERT INTO registration_requests (user_id, status) VALUES (${user.id}, 'pending')`

    try {
      await sendRegistrationEmail(user.email, user.full_name)

      const adminEmail = process.env.ADMIN_EMAIL || "admin@thesis.com"
      const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/dashboard`
      const userRole = formData.role === "student" ? "Student" : "Supervisor"

      await sendAdminNotificationEmail(adminEmail, user.full_name, user.email, userRole, dashboardUrl)
    } catch (emailError: any) {
      // Email error is not critical, continue
    }

    return {
      success: true,
      message: "Registration successful! Please wait for admin approval. You will receive an email once approved.",
    }
  } catch (error: any) {
    console.error("[Auth] Registration error:", error)
    return { success: false, error: error.message || "Registration failed. Please try again." }
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

    const passwordValid = await verifyPassword(password, user.password_hash)

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
