import { getCurrentUser } from "@/lib/auth"
import DatasetsContent from "@/components/datasets-content"
import { getDatasets } from "@/lib/db/datasets"

export default async function DatasetsPage() {
  const user = await getCurrentUser()
  
  // Fetch real datasets from database
  let datasets = []
  try {
    datasets = await getDatasets({ limit: 100 })
  } catch (error) {
    console.error("Error loading datasets:", error)
  }

  return <DatasetsContent user={user} initialDatasets={datasets} />
}
