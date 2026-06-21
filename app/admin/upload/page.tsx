import { AdminUploadClient } from "@/components/admin/admin-upload-client"
import { getAllUsers } from "@/lib/db/users"

export default async function AdminUploadPage() {
    const users = await getAllUsers()
    return <AdminUploadClient allUsers={users} />
}
