"use client"

import { useState } from "react"
import { Settings, Shield, Globe, Lock, Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { 
    Dialog, DialogContent, DialogHeader, 
    DialogTitle, DialogFooter, DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
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
        // Note: For now we only expose status/department/visibility, 
        // as title/abstract are edited inline.
        const status = formData.get("status") as string
        const department = formData.get("department") as string
        const visibility = formData.get("visibility") as string

        const result = await updateWorkspaceSettings(workspace.id, workspace.type, {
            status,
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
                <Button variant="outline" size="sm" className="h-8 border-slate-200 dark:border-slate-800 text-xs gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <Settings className="w-3.5 h-3.5" /> Manage Workspace
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-[#1a2436] border-slate-200 dark:border-slate-800 sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-indigo-500" />
                        Workspace Settings
                    </DialogTitle>
                    <DialogDescription>
                        Configure your research privacy, status, and metadata.
                    </DialogDescription>
                </DialogHeader>

                <form action={handleUpdate} className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Research Status</Label>
                                <Select name="status" defaultValue={workspace.status}>
                                    <SelectTrigger className="bg-slate-50 dark:bg-[#111722] border-slate-200 dark:border-slate-800">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="pending">Under Review</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Department</Label>
                                <Select name="department" defaultValue={workspace.department}>
                                    <SelectTrigger className="bg-slate-50 dark:bg-[#111722] border-slate-200 dark:border-slate-800">
                                        <SelectValue placeholder="Select Dept" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CSE">Computer Science</SelectItem>
                                        <SelectItem value="EEE">Electrical Engineering</SelectItem>
                                        <SelectItem value="SWE">Software Engineering</SelectItem>
                                        <SelectItem value="MAT">Mathematics</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                             <Label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Visibility Control</Label>
                             <div className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#111722] border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold">Public Discoverability</p>
                                        <p className="text-[10px] text-slate-500">Allow others to find this Hub</p>
                                    </div>
                                </div>
                                <Select name="visibility" defaultValue="public">
                                    <SelectTrigger className="w-32 border-0 bg-transparent shadow-none focus:ring-0 text-xs font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">Public</SelectItem>
                                        <SelectItem value="private">Private</SelectItem>
                                    </SelectContent>
                                </Select>
                             </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                        <Label className="text-xs uppercase tracking-widest text-red-400 font-bold flex items-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5" /> Danger Zone
                        </Label>
                        <Button 
                            type="button" 
                            variant="outline" 
                            className="w-full border-red-500/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 gap-2 border-dashed"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            <Trash2 className="w-4 h-4" /> Delete this Workspace
                        </Button>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Save Configuration
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
