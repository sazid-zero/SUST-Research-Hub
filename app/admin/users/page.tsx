"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, Trash2, Plus } from "lucide-react"

export default function UserManagementPage() {
  const users = [
    {
      id: 1,
      name: "Ahmed Khan",
      email: "ahmed@sust.edu.bd",
      role: "Student",
      department: "Computer Science & Engineering",
      status: "active",
      joined: "2024-09-15",
    },
    {
      id: 2,
      name: "Dr. Hassan Ahmed",
      email: "hassan@sust.edu.bd",
      role: "Supervisor",
      department: "Computer Science & Engineering",
      status: "active",
      joined: "2024-08-20",
    },
    {
      id: 3,
      name: "Fatima Ali",
      email: "fatima@sust.edu.bd",
      role: "Student",
      department: "Electrical & Electronic Engineering",
      status: "active",
      joined: "2024-10-01",
    },
    {
      id: 4,
      name: "Dr. Karim Ahmed",
      email: "karim@sust.edu.bd",
      role: "Supervisor",
      department: "Civil Engineering",
      status: "inactive",
      joined: "2024-07-10",
    },
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Student":
        return "bg-blue-100 text-blue-800"
      case "Supervisor":
        return "bg-purple-100 text-purple-800"
      case "Admin":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  return (
    <main className="overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="md:text-3xl sm:text-2xl text-xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage system users and permissions</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Search and Filters */}
        <Card className="border-border bg-card p-6">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button variant="outline" className="border-border hover:bg-muted bg-transparent">
              Filter
            </Button>
          </div>
        </Card>

        {/* Users Table */}
        <Card className="border-border bg-card overflow-auto mb-20 pt-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4">
                      <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{user.department}</td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(user.status)}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{user.joined}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  )
}
