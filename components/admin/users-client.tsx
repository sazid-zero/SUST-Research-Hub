"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, Trash2, Plus, Loader2, Users, LayoutDashboard, Sparkles, Filter } from "lucide-react"
import { updateUserStatus, deleteUser } from "@/app/actions/admin"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface User {
  id: number
  full_name: string
  email: string
  role: string
  department: string
  is_approved: boolean
  created_at: string | Date
}

interface UsersClientProps {
  initialUsers: User[]
}

export default function UsersClient({ initialUsers }: UsersClientProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState<number | null>(null)

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    user.email?.toLowerCase().includes(search.toLowerCase())
  )

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "student":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "supervisor":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "admin":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20"
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20"
    }
  }

  const getStatusColor = (isApproved: boolean) => {
    return isApproved 
      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
      : "bg-slate-500/10 text-slate-500 border-slate-500/20"
  }

  const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
    setIsLoading(userId)
    try {
      const res = await updateUserStatus(userId, !currentStatus)
      if (res.success) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_approved: !currentStatus } : u))
        toast.success(res.message)
      } else {
        toast.error(res.error)
      }
    } catch (err) {
      toast.error("Failed to update status")
    } finally {
      setIsLoading(null)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return
    
    setIsLoading(userId)
    try {
      const res = await deleteUser(userId)
      if (res.success) {
        setUsers(prev => prev.filter(u => u.id !== userId))
        toast.success(res.message)
      } else {
        toast.error(res.error)
      }
    } catch (err) {
      toast.error("Failed to delete user")
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-[#0b1120] min-h-screen">
      {/* Header Area */}
      <div className="relative overflow-hidden bg-white dark:bg-[#0f172a] border-b border-border/50 px-6 py-10 sm:py-12 md:py-16">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-primary/5 to-transparent pointer-events-none" />
          <div className="max-w-6xl mx-auto relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-widest border border-blue-500/20">
                          <Users className="h-3 w-3" />
                          Identity Management
                      </div>
                      <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                        User <span className="bg-linear-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Directory</span>
                      </h1>
                      <p className="text-muted-foreground font-medium max-w-lg">
                        Manage all platform participants, verify identities, and control administrative access.
                      </p>
                  </div>
                  <div>
                      <Button className="bg-linear-to-r from-blue-500 to-indigo-500 hover:scale-105 transition-all text-white font-bold h-14 px-8 rounded-2xl shadow-xl shadow-blue-500/20 border-none">
                          <Plus className="h-5 w-5 mr-2" />
                          Provision New User
                      </Button>
                  </div>
              </div>
          </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 sm:p-8 space-y-8 mb-20">
        {/* Search and Filters */}
        <section className="space-y-6">
            <div className="flex items-center gap-2 px-2">
                <LayoutDashboard className="h-4 w-4 text-blue-500" />
                <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Operations Console</h2>
            </div>
            <Card className="border-border/50 bg-background/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm ring-1 ring-primary/5">
                <div className="flex gap-4 flex-col md:flex-row">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search identities by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 bg-muted/20 border-border/50 h-12 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
                        />
                    </div>
                    <Button variant="outline" className="h-12 border-border/50 px-6 rounded-2xl bg-white/50 backdrop-blur-sm hover:bg-muted font-bold gap-2">
                        <Filter className="h-4 w-4" />
                        Refine Search
                    </Button>
                </div>
            </Card>
        </section>

        {/* Users Table Area */}
        <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Registered Participants</h2>
                </div>
                <Badge variant="outline" className="rounded-full border-border bg-muted/30 font-bold px-3 py-1">
                    {filteredUsers.length} Results
                </Badge>
            </div>

            <Card className="border-border/50 bg-background/80 backdrop-blur-sm rounded-3xl shadow-sm ring-1 ring-primary/5 overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border/50 bg-muted/10">
                            <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Full Identity</th>
                            <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">System Role</th>
                            <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Affiliation</th>
                            <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Status</th>
                            <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Onboarded</th>
                            <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                    {filteredUsers.map((user) => (
                        <tr key={user.id} className="group hover:bg-muted/30 transition-all">
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-xs font-bold text-blue-600 border border-blue-500/20">
                                        {user.full_name?.[0]}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-foreground group-hover:text-blue-500 transition-colors">
                                            {user.full_name}
                                        </span>
                                        <span className="text-[11px] font-medium text-muted-foreground/80">{user.email}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-6">
                                <Badge className={cn("text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-lg border", getRoleColor(user.role))}>
                                    {user.role}
                                </Badge>
                            </td>
                            <td className="px-6 py-6 text-xs font-semibold text-muted-foreground/80">
                                {user.department || "General"}
                            </td>
                            <td className="px-6 py-6">
                                <Badge 
                                    className={cn(
                                        "cursor-pointer text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-lg border",
                                        getStatusColor(user.is_approved)
                                    )}
                                    onClick={() => handleToggleStatus(user.id, user.is_approved)}
                                >
                                    {isLoading === user.id ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                        user.is_approved ? "Authorized" : "Deactivated"
                                    )}
                                </Badge>
                            </td>
                            <td className="px-6 py-6 text-[11px] font-bold text-muted-foreground/60 uppercase">
                                {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="px-8 py-6 text-right flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm" className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-blue-500/10 hover:text-blue-500">
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500"
                                    onClick={() => handleDeleteUser(user.id)}
                                    disabled={isLoading === user.id}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                        <tr>
                            <td colSpan={6} className="py-24 text-center">
                                <div className="flex flex-col items-center gap-4 text-muted-foreground/40 font-medium italic">
                                    <Search className="h-12 w-12 opacity-20" />
                                    <p className="text-sm">No identities match your current search profile.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            </Card>
        </section>
      </div>
    </div>
  )
}
