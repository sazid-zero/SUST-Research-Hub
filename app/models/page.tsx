import { getCurrentUser } from "@/lib/auth"
import ModelsContent from "@/components/models-content"
import { getModels } from "@/lib/db/models"

export default async function ModelsPage() {
  const user = await getCurrentUser()
  
  // Fetch real models from database
  let models = []
  try {
    models = await getModels({ limit: 100 })
  } catch (error) {
    console.error("Error loading models:", error)
  }

  return <ModelsContent user={user} initialModels={models} />
}
