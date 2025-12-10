import { getCurrentUser } from "@/lib/auth"
import DatasetsContent from "@/components/datasets-content"

export default async function DatasetsPage() {
    const user = await getCurrentUser()

    return <DatasetsContent user={user} />
}
