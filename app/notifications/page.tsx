"use server"

import { getCurrentUser } from "@/lib/auth"
import { getNotifications } from "@/app/actions/notifications"
import { Bell, Clock, Info, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { redirect } from "next/navigation"

export default async function NotificationsPage() {
    const user = await getCurrentUser()
    if (!user) redirect("/login")

    const notifications = await getNotifications()

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'supervision_request': return <AlertCircle className="w-5 h-5 text-amber-500" />
            case 'supervision_accept': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            case 'invite': return <Info className="w-5 h-5 text-blue-500" />
            case 'feedback': return <AlertCircle className="w-5 h-5 text-indigo-500" />
            default: return <Bell className="w-5 h-5 text-slate-400" />
        }
    }

    return (
        <div className="p-6 lg:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Notification History</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage and view all your research alerts and invitations.</p>
                </div>

                <div className="grid gap-4">
                    {notifications.length > 0 ? (
                        notifications.map((n) => (
                            <Card key={n.id} className={`bg-white dark:bg-[#1a2436] border-slate-200 dark:border-slate-800 hover:shadow-md transition-all ${!n.is_read ? 'border-l-4 border-l-indigo-500' : ''}`}>
                                <CardContent className="p-6">
                                    <div className="flex gap-4">
                                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#111722] border border-slate-100 dark:border-slate-800">
                                            {getTypeIcon(n.type)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-start justify-between">
                                                <h3 className={`text-base leading-tight ${!n.is_read ? 'font-bold text-indigo-600 dark:text-indigo-400' : 'font-semibold text-slate-900 dark:text-slate-100'}`}>
                                                    {n.title}
                                                </h3>
                                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                                                {n.message}
                                            </p>
                                            <div className="flex items-center gap-3 pt-3">
                                                <Badge variant="secondary" className="text-[9px] uppercase tracking-tighter h-5 px-2 bg-slate-100 dark:bg-slate-800">
                                                    {n.type.replace('_', ' ')}
                                                </Badge>
                                                {n.link && (
                                                    <Link href={n.link}>
                                                        <Button size="sm" variant="link" className="h-auto p-0 text-indigo-500 font-bold text-xs hover:text-indigo-600 transition-colors">
                                                            Review Details
                                                        </Button>
                                                    </Link>
                                                )}

                                                {n.type === 'invite' && (
                                                    <div className="flex gap-2 ml-auto">
                                                        <form action={async () => {
                                                            "use server"
                                                            const { acceptWorkspaceInvitation } = await import("@/app/actions/workspace")
                                                            await acceptWorkspaceInvitation(n.source_id, n.source_type)
                                                        }}>
                                                            <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 rounded-xl shadow-lg shadow-emerald-500/20">
                                                                Accept
                                                            </Button>
                                                        </form>
                                                        <form action={async () => {
                                                            "use server"
                                                            const { declineWorkspaceInvitation } = await import("@/app/actions/workspace")
                                                            await declineWorkspaceInvitation(n.source_id, n.source_type)
                                                        }}>
                                                            <Button size="sm" variant="outline" className="h-8 border-rose-200 dark:border-rose-900/50 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 font-bold px-4 rounded-xl">
                                                                Decline
                                                            </Button>
                                                        </form>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card className="bg-white dark:bg-[#1a2436] border-slate-200 dark:border-slate-800 border-dashed py-20">
                            <CardContent className="flex flex-col items-center justify-center text-slate-400 gap-4">
                                <Bell className="w-12 h-12 opacity-10" />
                                <div className="text-center">
                                    <p className="text-sm font-bold">Safe and Sound</p>
                                    <p className="text-xs">You don't have any notifications at the moment.</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
