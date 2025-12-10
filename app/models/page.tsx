import { getCurrentUser } from "@/lib/auth"
import ModelsContent from "@/components/models-content"

export default async function ModelsPage() {
    const user = await getCurrentUser()

    return <ModelsContent user={user} />
}
