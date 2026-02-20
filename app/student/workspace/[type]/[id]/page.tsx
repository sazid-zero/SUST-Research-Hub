import { getWorkspace, WorkspaceType } from "@/lib/db/workspace"
import { notFound } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Settings, Info, FileText, LayoutDashboard, Database, Cpu, Share2 } from "lucide-react"
import { WorkspaceOverview } from "@/components/workspace/workspace-overview"
import { ResourcesTab } from "@/components/workspace/resources-tab"
import { WorkspaceSettingsDialog } from "@/components/workspace/workspace-settings-dialog"
import { getCurrentUser } from "@/lib/auth"
import { getSupervisors } from "@/lib/db/users"

interface WorkspacePageProps {
  params: Promise<{
    type: string
    id: string
  }>
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { type: typeRaw, id: idStr } = await params
  const type = typeRaw as WorkspaceType
  const id = parseInt(idStr)

  if (!["thesis", "project", "publication"].includes(type) || isNaN(id)) {
    notFound()
  }

  const workspace = await getWorkspace(type, id)
  const supervisors = await getSupervisors(workspace?.department || undefined)
  const user = await getCurrentUser()

  if (!workspace) {
    notFound()
  }

  return (
    <div className="flex-1 content-container">

      <Tabs defaultValue="overview" className="space-y-0 h-full flex flex-col">
        {/* Header & Tabs Row */}
         <div className="flex items-center justify-between px-8 pt-4 pb-0 bg-white dark:bg-[#101622] sticky top-0 z-10">
            <TabsList className="bg-muted/30 dark:bg-slate-800/20 border-none shadow-none">
                <TabsTrigger 
                    value="overview" 
                    className="px-6"
                >
                    Overview
                </TabsTrigger>
                <TabsTrigger 
                    value="resources" 
                    className="px-6"
                >
                    Resources
                </TabsTrigger>
            </TabsList>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2 pb-4">
             <WorkspaceSettingsDialog workspace={workspace} />
          </div>
        </div>

        <TabsContent value="overview" className="mt-0 flex-1 overflow-hidden">
            <WorkspaceOverview workspace={workspace} supervisors={supervisors} />
        </TabsContent>

        <TabsContent value="resources" className="mt-0 flex-1 overflow-hidden">
            <ResourcesTab workspace={workspace} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

