import { getAllUsers } from "@/app/actions/admin"
import UsersClient from "@/components/admin/users-client"
import { redirect } from "next/navigation"

export const revalidate = 0 // Always fetch fresh data

export default async function UserManagementPage() {
  const result = await getAllUsers()
  
  if (!result.success) {
    // Handle error, maybe redirect or show a simple error message
    return <div className="p-8 text-center text-red-500">Error loading users: {result.error}</div>
  }

  return <UsersClient initialUsers={(result.users as any) || []} />
}
