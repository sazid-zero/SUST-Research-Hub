import { getPendingClaims } from "@/app/actions/claims"
import { AdminClaimsClient } from "@/components/admin/claims-client"

export const revalidate = 0

export default async function AdminClaimsPage() {
    const claims = await getPendingClaims()
    return <AdminClaimsClient initialClaims={claims} />
}
