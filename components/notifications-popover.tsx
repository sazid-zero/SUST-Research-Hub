"use client"

import { useState, useEffect } from "react"
import { Bell, Check, ExternalLink, Clock, Trash2, Loader2 } from "lucide-react"
import { 
    Popover, PopoverContent, PopoverTrigger 
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getNotifications, markNotificationAsRead, getUnreadCount } from "@/app/actions/notifications"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const fetchNotifications = async () => {
    setLoading(true)
    const [data, count] = await Promise.all([
        getNotifications(),
        getUnreadCount()
    ])
    setNotifications(data)
    setUnreadCount(count)
    setLoading(false)
  }

  useEffect(() => {
    fetchNotifications()
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleMarkAsRead = async (id: number) => {
      await markNotificationAsRead(id)
      fetchNotifications()
  }

  const handleNotificationClick = (n: any) => {
      handleMarkAsRead(n.id)
      if (n.link) {
          router.push(n.link)
          setOpen(false)
      }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
          <Bell className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white border-2 border-white dark:border-[#0d121c] animate-bounce">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-white dark:bg-[#1a2436] border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden" align="end">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#111722]/50">
          <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">Notifications</h4>
          {unreadCount > 0 && (
             <Button variant="ghost" className="h-6 text-[10px] font-bold text-indigo-500 hover:text-indigo-600 p-0">
                Mark all read
             </Button>
          )}
        </div>
        <ScrollArea className="h-80">
          <div className="flex flex-col">
            {loading && notifications.length === 0 ? (
               <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
               </div>
            ) : notifications.length > 0 ? (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  onClick={() => handleNotificationClick(n)}
                  className={`p-4 border-b border-slate-50 dark:border-slate-800/50 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-900/50 group relative ${!n.is_read ? 'bg-indigo-500/3' : ''}`}
                >
                  {!n.is_read && (
                      <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-full" />
                  )}
                  <div className="flex flex-col gap-1">
                    <p className={`text-sm leading-tight ${!n.is_read ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {n.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                         <Badge variant="outline" className={`text-[8px] uppercase tracking-tighter px-1.5 h-4 border-slate-200 dark:border-slate-800 ${n.type === 'invite' ? 'text-blue-500' : n.type === 'supervision_request' ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {n.type.replace('_', ' ')}
                         </Badge>
                         <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                         </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
                <Bell className="h-8 w-8 opacity-10" />
                <p className="text-xs font-medium italic">No notifications yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-2 border-t border-slate-50 dark:border-slate-800">
            <Button variant="ghost" className="w-full h-8 text-xs font-bold text-slate-500 hover:text-indigo-500" onClick={() => router.push('/notifications')}>
               View all history
            </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
