import { getAdminStats, getSystemAnalytics } from "@/app/actions/admin"
import AnalyticsClient from "@/components/admin/analytics-client"

export const revalidate = 300 // Cache for 5 minutes

export default async function AdminAnalyticsPage() {
  const [statsRes, analyticsRes] = await Promise.all([
    getAdminStats(),
    getSystemAnalytics()
  ])

  if (!statsRes.success || !analyticsRes.success || !statsRes.stats || !analyticsRes.data) {
    return <div className="p-8 text-center text-red-500">Error loading analytics data</div>
  }

  return (
    <AnalyticsClient 
      stats={statsRes.stats} 
      data={analyticsRes.data} 
    />
  )
}
