"use client"

import { useState } from "react"
import { Settings, Globe, Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { 
    Dialog, DialogContent, DialogHeader, 
    DialogTitle, DialogFooter, DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { 
    Select, SelectContent, SelectItem, 
    SelectTrigger, SelectValue 
} from "@/components/ui/select"
import { toast } from "sonner"
import { updateWorkspaceSettings } from "@/app/actions/workspace"

interface WorkspaceSettingsDialogProps {
    workspace: any
}

export function WorkspaceSettingsDialog({ workspace }: WorkspaceSettingsDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const handleUpdate = async (formData: FormData) => {
        setLoading(true)
        const department = formData.get("department") as string
        const visibility = formData.get("visibility") as string

        const result = await updateWorkspaceSettings(workspace.id, workspace.type, {
            department,
            visibility
        })

        if (result.success) {
            toast.success("Settings updated")
            setOpen(false)
        } else {
            toast.error(result.message)
        }
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                    <Settings className="w-3.5 h-3.5" /> Manage Workspace
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-primary" />
                        Workspace Settings
                    </DialogTitle>
                    <DialogDescription>
                        Configure your research privacy and metadata. Workflow status is managed through the submission process.
                    </DialogDescription>
                </DialogHeader>

                <form action={handleUpdate} className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Department</Label>
                                <Select name="department" defaultValue={workspace.department}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Dept" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CSE">Computer Science & Engineering</SelectItem>
                                        <SelectItem value="EEE">Electrical & Electronic Engineering</SelectItem>
                                        <SelectItem value="SWE">Software Engineering</SelectItem>
                                        <SelectItem value="MAT">Mathematics</SelectItem>
                                        <SelectItem value="PHY">Physics</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {workspace.type === 'thesis' && (
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Visibility Control</Label>
                                <div className="flex gap-4 p-4 rounded-xl bg-muted border">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">Public Discoverability</p>
                                            <p className="text-[10px] text-muted-foreground">Allow others to find this Hub</p>
                                        </div>
                                    </div>
                                    <Select name="visibility" defaultValue={workspace.visibility || "visible"}>
                                        <SelectTrigger className="w-32 border-0 bg-transparent shadow-none focus:ring-0 text-xs font-bold">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="visible">Visible</SelectItem>
                                            <SelectItem value="hidden">Hidden</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-6 border-t space-y-4">
                        <Label className="text-xs uppercase tracking-widest text-destructive font-bold flex items-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5" /> Danger Zone
                        </Label>
                        <Button 
                            type="button" 
                            variant="outline" 
                            className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive gap-2 border-dashed"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            <Trash2 className="w-4 h-4" /> Delete this Workspace
                        </Button>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="gap-2">
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Save Configuration
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
