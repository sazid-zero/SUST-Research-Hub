
import { db, sql } from "./index"

export interface User {
    id: number
    full_name: string
    email: string
    role: string
    department: string | null
    profile_pic: string | null
    specialization: string | null
    student_id?: string
    is_department_head?: boolean
}

export async function getSupervisors(department?: string): Promise<User[]> {
    try {
        // Fetch users with role 'supervisor', 'faculty', 'professor' etc.
        // Assuming 'supervisor' role for now.
        let query = sql`
            SELECT id, full_name, email, role, department, profile_pic, specialization, is_department_head
            FROM users
            WHERE role IN ('supervisor', 'faculty', 'professor')
        `
        
        if (department) {
            // query = sql`${query} AND department = ${department}` 
            // Neon/One-shot sql tagging might not support appending like this easily without helper.
            // Rewriting for simple logic:
             return await sql`
                SELECT id, full_name, email, role, department, profile_pic, specialization
                FROM users
                WHERE role IN ('supervisor', 'faculty', 'professor')
                AND department = ${department}
                ORDER BY full_name ASC
            ` as User[]
        }

        const result = await sql`
            SELECT id, full_name, email, role, department, profile_pic, specialization, is_department_head
            FROM users
            WHERE role IN ('supervisor', 'faculty', 'professor')
            ORDER BY full_name ASC
        `
        
        return result as User[]
    } catch (error) {
        console.error("Error fetching supervisors:", error)
    }
}

export async function getAllUsers(): Promise<User[]> {
    try {
        const result = await sql`
            SELECT id, full_name, student_id, email, role, department, profile_pic, is_department_head
            FROM users
            ORDER BY full_name ASC
        `
        return result as User[]
    } catch (error) {
        console.error("Error fetching all users:", error)
        return []
    }
}

export async function searchUsers(query: string, limit: number = 10): Promise<User[]> {
    try {
        if (!query || query.trim().length === 0) {
            return []
        }

        const searchTerm = `%${query.toLowerCase()}%`
        const result = await sql`
            SELECT id, full_name, student_id, email, role, department, profile_pic
            FROM users
            WHERE LOWER(full_name) LIKE ${searchTerm}
            OR LOWER(email) LIKE ${searchTerm}
            OR LOWER(student_id) LIKE ${searchTerm}
            ORDER BY 
                CASE 
                    WHEN LOWER(full_name) LIKE ${`${query.toLowerCase()}%`} THEN 1
                    WHEN LOWER(student_id) LIKE ${`${query.toLowerCase()}%`} THEN 2
                    ELSE 3
                END,
                full_name ASC
            LIMIT ${limit}
        `
        return result as User[]
    } catch (error) {
        console.error("Error searching users:", error)
        return []
    }
}
