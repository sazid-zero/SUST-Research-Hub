import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"
import { redirect } from "next/navigation"

export default async function AdminProfilePage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "admin") {
    redirect("/login")
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Profile</h1>
        <p className="text-muted-foreground">System administrator account</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Information
          </CardTitle>
          <CardDescription>Your administrator account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="text-lg font-medium mt-1">{user.full_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-lg font-medium mt-1">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Role</label>
                <p className="text-lg font-medium mt-1">
                  <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">Administrator</span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                <p className="text-lg font-medium mt-1">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
