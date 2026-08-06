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
import { Input } from "@/components/ui/input"
import { 
    Select, SelectContent, SelectItem, 
    SelectTrigger, SelectValue 
} from "@/components/ui/select"
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { updateWorkspaceDetails, deleteWorkspace } from "@/app/actions/workspace"

interface WorkspaceSettingsDialogProps {
    workspace: any
}

export function WorkspaceSettingsDialog({ workspace }: WorkspaceSettingsDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        
        const formData = new FormData(e.currentTarget)
        formData.append("id", workspace.id.toString())
        formData.append("type", workspace.type)

        const result = await updateWorkspaceDetails({}, formData)

        if (result.success) {
            toast.success("Settings updated")
            setOpen(false)
        } else {
            toast.error(result.message || "Failed to update settings")
        }
        setLoading(false)
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        const result = await deleteWorkspace(workspace.id, workspace.type)
        
        if (result.success) {
            toast.success("Workspace deleted")
            window.location.href = "/student/dashboard"
        } else {
            toast.error(result.message || "Failed to delete workspace")
        }
        setIsDeleting(false)
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

                <form onSubmit={handleUpdate} className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Department</Label>
                                <Select name="department" defaultValue={workspace.department || ""}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Department" />
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

                        {(workspace.type === 'thesis' || workspace.type === 'project') && (
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Field of Study</Label>
                                    <Select name="field" defaultValue={workspace.field || ""}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Field" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="AI">Artificial Intelligence</SelectItem>
                                            <SelectItem value="ML">Machine Learning</SelectItem>
                                            <SelectItem value="WEB">Web Development</SelectItem>
                                            <SelectItem value="MOBILE">Mobile Development</SelectItem>
                                            <SelectItem value="DATABASE">Database Systems</SelectItem>
                                            <SelectItem value="NETWORK">Networking</SelectItem>
                                            <SelectItem value="SECURITY">Cybersecurity</SelectItem>
                                            <SelectItem value="POWER">Power Systems</SelectItem>
                                            <SelectItem value="COMMUNICATION">Communications</SelectItem>
                                            <SelectItem value="CONTROL">Control Systems</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {workspace.type === 'publication' && (
                            <div className="space-y-4 pt-2">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Journal / Conference Name</Label>
                                        <Input 
                                            name="journal_name" 
                                            defaultValue={workspace.journal_name || ""} 
                                            placeholder="e.g. IEEE Access or ICML 2024" 
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">DOI (Optional)</Label>
                                        <Input 
                                            name="doi" 
                                            defaultValue={workspace.doi || ""} 
                                            placeholder="e.g. 10.1109/ACCESS.2024.12345" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Publication Year</Label>
                                        <Input 
                                            name="year" 
                                            type="number" 
                                            defaultValue={workspace.year || new Date().getFullYear()} 
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

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

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="w-5 h-5" />
                                Delete Workspace?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your {workspace.type} and all associated data including team members, files, and submissions.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="bg-destructive hover:bg-destructive/90 gap-2"
                            >
                                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                                Delete Permanently
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DialogContent>
        </Dialog>
    )
}
