"use client"

import { useEffect, useState } from "react"
import { getDebugNotifications } from "@/app/actions/debug-notifications"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function NotificationsDebugPage() {
  const [debugData, setDebugData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchDebugData = async () => {
    setLoading(true)
    try {
      const data = await getDebugNotifications()
      setDebugData(data)
      console.log("[Debug] Notifications data:", data)
    } catch (error) {
      console.error("[Debug] Error:", error)
      setDebugData({ error: "Failed to fetch debug data" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugData()
  }, [])

  if (loading) return <div className="p-8 text-lg">Loading...</div>

  if (debugData?.error) {
    return (
      <div className="p-8">
        <Card className="p-4 bg-red-50 border-red-200">
          <h2 className="text-lg font-bold text-red-900">Error</h2>
          <p className="text-red-800">{debugData.error}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notifications Debug</h1>
        <Button onClick={fetchDebugData}>Refresh</Button>
      </div>

      {/* User Info */}
      <Card className="p-4 bg-blue-50">
        <h2 className="text-lg font-bold mb-2">Current User</h2>
        <p><strong>Name:</strong> {debugData?.user?.name}</p>
        <p><strong>ID:</strong> {debugData?.user?.id}</p>
        <p><strong>Email:</strong> {debugData?.user?.email}</p>
      </Card>

      {/* Summary */}
      <Card className="p-4">
        <h2 className="text-lg font-bold mb-4">Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Total Notifications</p>
            <p className="text-2xl font-bold">{debugData?.totalNotificationCount || 0}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Thesis Invitations</p>
            <p className="text-2xl font-bold">{debugData?.invitationSummary?.thesis || 0}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Publication Invitations</p>
            <p className="text-2xl font-bold">{debugData?.invitationSummary?.publications || 0}</p>
          </div>
        </div>
      </Card>

      {/* Recent Notifications */}
      <Card className="p-4">
        <h2 className="text-lg font-bold mb-4">Recent Notifications (Last 10)</h2>
        {debugData?.notificationsInDB && debugData.notificationsInDB.length > 0 ? (
          <div className="space-y-3">
            {debugData.notificationsInDB.map((n: any) => (
              <div key={n.id} className="p-3 border rounded bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold">{n.title}</p>
                  <Badge variant={n.type === 'invite' ? 'default' : 'secondary'}>
                    {n.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 mb-1">{n.message}</p>
                <p className="text-xs text-gray-500">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No notifications found</p>
        )}
      </Card>
    </div>
  )
}

