
import { db, sql } from "./index"

export interface User {
    id: number
    full_name: string
    email: string
    role: string
    department: string | null
    profile_pic: string | null
    specialization: string | null
}

export async function getSupervisors(department?: string): Promise<User[]> {
    try {
        // Fetch users with role 'supervisor', 'faculty', 'professor' etc.
        // Assuming 'supervisor' role for now.
        let query = sql`
            SELECT id, full_name, email, role, department, profile_pic, specialization
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
            SELECT id, full_name, email, role, department, profile_pic, specialization
            FROM users
            WHERE role IN ('supervisor', 'faculty', 'professor')
            ORDER BY full_name ASC
        `
        
        return result as User[]
    } catch (error) {
        console.error("Error fetching supervisors:", error)
        return []
    }
}
