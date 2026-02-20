import { getSystemSettings } from "@/app/actions/admin"
import SettingsClient from "@/components/admin/settings-client"

export const revalidate = 0 // Always fetch fresh data

export default async function AdminSettingsPage() {
  const result = await getSystemSettings()
  
  if (!result.success || !result.settings) {
    return <div className="p-8 text-center text-red-500">Error loading system settings</div>
  }

  return <SettingsClient initialSettings={result.settings as any} />
}
