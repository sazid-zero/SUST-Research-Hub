"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, UploadCloud, Users, ArrowRight, FileUp } from "lucide-react"
import { uploadLegacyWorkspace } from "@/app/actions/admin-upload"
import { DEPARTMENTS, FIELDS_OF_STUDY } from "@/lib/constants/academic-data"

interface AuthorEntry {
    id: string
    name: string
    userId: string
    regNo?: string
}

interface AdminUploadClientProps {
    allUsers?: any[]
}

export function AdminUploadClient({ allUsers = [] }: AdminUploadClientProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [workspaceType, setWorkspaceType] = useState("thesis")
    
    const [authors, setAuthors] = useState<AuthorEntry[]>([
        { id: "1", name: "", userId: "" }
    ])
    
    // File states
    const [documentFile, setDocumentFile] = useState<File | null>(null)
    const [paperFile, setPaperFile] = useState<File | null>(null)
    
    // Link states & metadata
    const [codeUrl, setCodeUrl] = useState("")
    const [codeTitle, setCodeTitle] = useState("Source Code")
    
    const [datasetUrl, setDatasetUrl] = useState("")
    const [datasetTitle, setDatasetTitle] = useState("")
    const [datasetDescription, setDatasetDescription] = useState("")
    const [datasetType, setDatasetType] = useState("")
    const [datasetSize, setDatasetSize] = useState("")
    const [datasetTags, setDatasetTags] = useState("")
    
    const [modelUrl, setModelUrl] = useState("")
    const [modelTitle, setModelTitle] = useState("")
    const [modelDescription, setModelDescription] = useState("")
    const [modelType, setModelType] = useState("")
    const [modelFramework, setModelFramework] = useState("")
    const [modelAccuracy, setModelAccuracy] = useState("")
    const [modelTags, setModelTags] = useState("")

    const addAuthor = () => setAuthors([...authors, { id: Math.random().toString(), name: "", userId: "" }])
    const removeAuthor = (id: string) => { if (authors.length > 1) setAuthors(authors.filter(a => a.id !== id)) }
    const updateAuthor = (id: string, field: keyof AuthorEntry, value: string) => setAuthors(authors.map(a => a.id === id ? { ...a, [field]: value } : a))

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const form = new FormData(e.currentTarget)
            
            const formattedAuthors = authors
                .filter(a => a.name.trim() !== "")
                .map(a => {
                    // Extract ID if selected from datalist e.g. "John Doe (ID: 15)"
                    const match = a.name.match(/\(ID:\s*(\d+)\)$/i)
                    if (match) {
                        return {
                            name: a.name.replace(/\(ID:\s*\d+\)$/i, "").trim(),
                            userId: parseInt(match[1]),
                            regNo: a.regNo?.trim() || null
                        }
                    }
                    return {
                        name: a.name.trim(),
                        userId: null,
                        regNo: a.regNo?.trim() || null
                    }
                })

            if (formattedAuthors.length === 0) {
                toast.error("Please add at least one author")
                setIsSubmitting(false)
                return
            }

            form.set("authors", JSON.stringify(formattedAuthors))
            
            // Direct client-side upload to Cloudinary (Bypasses Vercel 4.5MB payload limit)
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
            const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

            const uploadDirectToCloudinary = async (file: File) => {
                if (!cloudName || !uploadPreset) throw new Error("Cloudinary environment variables missing")
                
                const uploadData = new FormData()
                uploadData.append('file', file)
                uploadData.append('upload_preset', uploadPreset)
                uploadData.append('resource_type', 'auto')

                const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
                    method: 'POST',
                    body: uploadData
                })

                if (!res.ok) {
                    const errorText = await res.text()
                    throw new Error(`Cloudinary upload failed: ${errorText}`)
                }

                const result = await res.json()
                return result.secure_url
            }

            if (documentFile) {
                toast.loading("Uploading document to cloud...", { id: "upload-toast" })
                const docUrl = await uploadDirectToCloudinary(documentFile)
                form.set("documentUrl", docUrl)
                form.set("documentName", documentFile.name)
                form.set("documentSize", documentFile.size.toString())
                toast.dismiss("upload-toast")
            }
            if (paperFile) {
                toast.loading("Uploading paper to cloud...", { id: "upload-toast" })
                const paperUrl = await uploadDirectToCloudinary(paperFile)
                form.set("paperUrl", paperUrl)
                form.set("paperName", paperFile.name)
                form.set("paperSize", paperFile.size.toString())
                toast.dismiss("upload-toast")
            }
            
            if (codeUrl.trim()) {
                form.set("codeUrl", codeUrl)
                form.set("codeTitle", codeTitle)
            }
            if (datasetUrl.trim()) {
                form.set("datasetUrl", datasetUrl)
                form.set("datasetTitle", datasetTitle)
                form.set("datasetDescription", datasetDescription)
                form.set("datasetType", datasetType)
                form.set("datasetSize", datasetSize)
                form.set("datasetTags", datasetTags)
            }
            if (modelUrl.trim()) {
                form.set("modelUrl", modelUrl)
                form.set("modelTitle", modelTitle)
                form.set("modelDescription", modelDescription)
                form.set("modelType", modelType)
                form.set("modelFramework", modelFramework)
                form.set("modelAccuracy", modelAccuracy)
                form.set("modelTags", modelTags)
            }

            const result = await uploadLegacyWorkspace(form)
            
            if (result.success) {
                toast.success(result.message || "Legacy workspace created successfully")
                router.refresh()
            } else {
                toast.error(result.message || "Failed to upload workspace")
            }
        } catch (error: any) {
            toast.dismiss("upload-toast")
            console.error("Upload error:", error)
            toast.error(error.message || "An unexpected error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex-1 bg-background min-h-screen p-4 md:p-8 lg:p-12 text-sm">
            <div className="max-w-[1400px] mx-auto space-y-6">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                        <UploadCloud className="w-6 h-6 text-primary" />
                        Legacy Data Ingestion
                    </h1>
                    <p className="text-muted-foreground text-xs mt-1">
                        Direct insertion to database. Bypasses invitation and review protocols.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <datalist id="all-users-list">
                        {allUsers.map((u: any) => (
                            <option key={u.id} value={`${u.full_name} (ID: ${u.id})`}>
                                {u.student_id ? `Reg: ${u.student_id}` : `Role: ${u.role}`}
                            </option>
                        ))}
                    </datalist>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        
                        {/* LEFT COLUMN: Main Info */}
                        <div className="lg:col-span-2 space-y-4">
                            <Card className="border-border/50 shadow-sm">
                                <CardHeader className="py-3 px-4 bg-muted/20 border-b">
                                    <CardTitle className="text-base">Core Metadata</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-3">
                                    <div className={`grid gap-3 ${workspaceType === 'thesis' ? 'grid-cols-3' : 'grid-cols-2'}`}>
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Type *</Label>
                                            <Select name="type" required value={workspaceType} onValueChange={setWorkspaceType}>
                                                <SelectTrigger className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all"><SelectValue placeholder="Type" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="thesis" className="text-xs">Thesis</SelectItem>
                                                    <SelectItem value="publication" className="text-xs">Publication</SelectItem>
                                                    <SelectItem value="project" className="text-xs">Project</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Status</Label>
                                            <Select name="status" defaultValue="approved">
                                                <SelectTrigger className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="approved" className="text-xs">Approved / Published</SelectItem>
                                                    <SelectItem value="active" className="text-xs">Active</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {workspaceType === 'thesis' && (
                                            <div className="space-y-1.5">
                                                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Visibility</Label>
                                                <Select name="visibility" defaultValue="visible">
                                                    <SelectTrigger className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="visible" className="text-xs">Visible</SelectItem>
                                                        <SelectItem value="hidden" className="text-xs">Hidden</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Title *</Label>
                                        <Input name="title" required className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Abstract / Description</Label>
                                        <Textarea name="abstract" className="min-h-[100px] text-xs resize-none border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all leading-relaxed" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Keywords</Label>
                                        <Input name="keywords" placeholder="e.g. Deep Learning, NLP, Computer Vision (comma separated)" className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Department</Label>
                                            <Select name="department" defaultValue={DEPARTMENTS[0]}>
                                                <SelectTrigger className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {DEPARTMENTS.map(d => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Field of Study</Label>
                                            <Select name="field" defaultValue={FIELDS_OF_STUDY[0]}>
                                                <SelectTrigger className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {FIELDS_OF_STUDY.map(f => <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1.5 md:col-span-2">
                                            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Year</Label>
                                            <Input name="year" type="number" defaultValue={new Date().getFullYear()} className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all w-full md:w-1/2" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 shadow-sm bg-primary/5">
                                <CardHeader className="py-2 px-4 border-b border-primary/10">
                                    <CardTitle className="text-sm">Specific Fields</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-3">
                                    {workspaceType === "publication" && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Publication Type</Label>
                                                <Select name="publication_type" defaultValue="journal">
                                                    <SelectTrigger className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="journal" className="text-xs">Journal</SelectItem>
                                                        <SelectItem value="conference" className="text-xs">Conference</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-1.5 md:col-span-2">
                                                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Journal / Conference Name</Label>
                                                <Input name="journal_name" className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">DOI</Label>
                                                <Input name="doi" className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Citations</Label>
                                                <Input name="citations" type="number" defaultValue={0} className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all" />
                                            </div>
                                            <div className="space-y-1.5 md:col-span-3">
                                                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">External URL</Label>
                                                <Input name="url" type="url" className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all" />
                                            </div>
                                        </div>
                                    )}

                                    {(workspaceType === "thesis" || workspaceType === "project") && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Supervisor Name *</Label>
                                                <Input name="supervisor" list="all-users-list" type="text" placeholder="Search user or type ghost name..." required={workspaceType === "thesis"} className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Linked Publication ID</Label>
                                                <Input name="linkedPublicationId" type="number" className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all" />
                                            </div>
                                        </div>
                                    )}

                                    {workspaceType === "project" && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Funding (USD)</Label>
                                                <Input name="funding" type="number" className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Start Date</Label>
                                                <Input name="startDate" type="date" className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all" />
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Authors */}
                            <Card className="border-border/50 shadow-sm">
                                <CardHeader className="py-2 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <Users className="w-4 h-4" /> Authors
                                    </CardTitle>
                                    <Button type="button" onClick={addAuthor} variant="ghost" size="sm" className="h-6 text-xs px-2">
                                        <Plus className="w-3 h-3 mr-1" /> Add
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y">
                                        {authors.map((author, i) => (
                                            <div key={author.id} className="flex items-center gap-2 p-2 px-4 hover:bg-muted/10">
                                                <span className="text-xs font-medium text-muted-foreground w-4">{i + 1}.</span>
                                                <Input 
                                                    required 
                                                    list="all-users-list"
                                                    value={author.name}
                                                    onChange={e => updateAuthor(author.id, "name", e.target.value)}
                                                    placeholder="Search user or type ghost name..." 
                                                    className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all flex-1"
                                                />
                                                <Input 
                                                    value={author.regNo || ''}
                                                    onChange={e => updateAuthor(author.id, "regNo", e.target.value)}
                                                    placeholder="Reg No (if ghost)" 
                                                    className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all w-32"
                                                />
                                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-rose-500" onClick={() => removeAuthor(author.id)}>
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT COLUMN: File Uploads */}
                        <div className="space-y-4">
                            <Card className="border-border/50 shadow-sm">
                                <CardHeader className="py-3 px-4 bg-muted/20 border-b">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <FileUp className="w-4 h-4" /> File Uploads
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    
                                    {(workspaceType === "thesis" || workspaceType === "project") && (
                                        <>
                                            <div className="space-y-1.5">
                                                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Primary Document (PDF)</Label>
                                                <Input type="file" className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all" onChange={(e) => setDocumentFile(e.target.files?.[0] || null)} />
                                            </div>
                                            <div className="space-y-3 pt-2 border-t">
                                                <div className="space-y-1.5">
                                                    <Label className="text-[11px] font-bold uppercase tracking-wider text-primary">Code Link (GitHub)</Label>
                                                    <Input type="url" value={codeUrl} onChange={(e) => setCodeUrl(e.target.value)} placeholder="https://github.com/..." className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all" />
                                                </div>
                                                {codeUrl && (
                                                    <div className="space-y-1.5 pl-4 border-l-2 border-muted">
                                                        <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Repository Title</Label>
                                                        <Input value={codeTitle} onChange={(e) => setCodeTitle(e.target.value)} placeholder="e.g. YOLOv8 Implementation" className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all" />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="space-y-3 pt-2 border-t">
                                                <div className="space-y-1.5">
                                                    <Label className="text-[11px] font-bold uppercase tracking-wider text-primary">Dataset Link</Label>
                                                    <Input type="url" value={datasetUrl} onChange={(e) => setDatasetUrl(e.target.value)} placeholder="https://..." className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all" />
                                                </div>
                                                {datasetUrl && (
                                                    <div className="space-y-3 pl-4 border-l-2 border-muted">
                                                        <div className="space-y-1.5">
                                                            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Dataset Title</Label>
                                                            <Input value={datasetTitle} onChange={(e) => setDatasetTitle(e.target.value)} placeholder="Dataset Title" className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all" />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="space-y-1.5">
                                                                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Modality / Type</Label>
                                                                <Select value={datasetType} onValueChange={setDatasetType}>
                                                                    <SelectTrigger className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all">
                                                                        <SelectValue placeholder="Select type..." />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="text-xs">
                                                                        <SelectItem value="text">Text</SelectItem>
                                                                        <SelectItem value="image">Image</SelectItem>
                                                                        <SelectItem value="tabular">Tabular</SelectItem>
                                                                        <SelectItem value="audio">Audio</SelectItem>
                                                                        <SelectItem value="video">Video</SelectItem>
                                                                        <SelectItem value="geospatial">Geospatial</SelectItem>
                                                                        <SelectItem value="3d">3D</SelectItem>
                                                                        <SelectItem value="time-series">Time Series</SelectItem>
                                                                        <SelectItem value="multimodal">Multimodal</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Size (approx.)</Label>
                                                                <Input value={datasetSize} onChange={(e) => setDatasetSize(e.target.value)} placeholder="e.g. 2.5 GB" className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all" />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Description</Label>
                                                            <Textarea value={datasetDescription} onChange={(e) => setDatasetDescription(e.target.value)} placeholder="Brief description..." className="min-h-[60px] text-xs resize-none border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all" />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Tags</Label>
                                                            <Input value={datasetTags} onChange={(e) => setDatasetTags(e.target.value)} placeholder="NLP, Bangla (comma separated)" className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-3 pt-2 border-t">
                                                <div className="space-y-1.5">
                                                    <Label className="text-[11px] font-bold uppercase tracking-wider text-primary">Model Link</Label>
                                                    <Input type="url" value={modelUrl} onChange={(e) => setModelUrl(e.target.value)} placeholder="https://..." className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all" />
                                                </div>
                                                {modelUrl && (
                                                    <div className="space-y-3 pl-4 border-l-2 border-muted">
                                                        <div className="space-y-1.5">
                                                            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Model Title</Label>
                                                            <Input value={modelTitle} onChange={(e) => setModelTitle(e.target.value)} placeholder="Model Title" className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all" />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Model Type / Task</Label>
                                                            <Select value={modelType} onValueChange={setModelType}>
                                                                <SelectTrigger className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all">
                                                                    <SelectValue placeholder="Select type..." />
                                                                </SelectTrigger>
                                                                <SelectContent className="text-xs max-h-[200px]">
                                                                    <SelectItem value="text-classification">Text Classification</SelectItem>
                                                                    <SelectItem value="text-generation">Text Generation</SelectItem>
                                                                    <SelectItem value="image-classification">Image Classification</SelectItem>
                                                                    <SelectItem value="object-detection">Object Detection</SelectItem>
                                                                    <SelectItem value="question-answering">Question Answering</SelectItem>
                                                                    <SelectItem value="summarization">Summarization</SelectItem>
                                                                    <SelectItem value="translation">Translation</SelectItem>
                                                                    <SelectItem value="text-to-image">Text-to-Image</SelectItem>
                                                                    <SelectItem value="text-to-speech">Text-to-Speech</SelectItem>
                                                                    <SelectItem value="speech-to-text">Speech-to-Text</SelectItem>
                                                                    <SelectItem value="embedding">Embedding</SelectItem>
                                                                    <SelectItem value="regression">Regression</SelectItem>
                                                                    <SelectItem value="classification">Classification</SelectItem>
                                                                    <SelectItem value="neural-network">Neural Network</SelectItem>
                                                                    <SelectItem value="reinforcement-learning">Reinforcement Learning</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="space-y-1.5">
                                                                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Framework</Label>
                                                                <Select value={modelFramework} onValueChange={setModelFramework}>
                                                                    <SelectTrigger className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all">
                                                                        <SelectValue placeholder="Select framework..." />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="text-xs">
                                                                        <SelectItem value="pytorch">PyTorch</SelectItem>
                                                                        <SelectItem value="tensorflow">TensorFlow</SelectItem>
                                                                        <SelectItem value="jax">JAX</SelectItem>
                                                                        <SelectItem value="scikit-learn">scikit-learn</SelectItem>
                                                                        <SelectItem value="transformers">Transformers</SelectItem>
                                                                        <SelectItem value="onnx">ONNX</SelectItem>
                                                                        <SelectItem value="other">Other</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Accuracy (%)</Label>
                                                                <Input type="number" step="0.1" value={modelAccuracy} onChange={(e) => setModelAccuracy(e.target.value)} placeholder="95.5" className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all" />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Description</Label>
                                                            <Textarea value={modelDescription} onChange={(e) => setModelDescription(e.target.value)} placeholder="Brief description..." className="min-h-[60px] text-xs resize-none border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all" />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Tags</Label>
                                                            <Input value={modelTags} onChange={(e) => setModelTags(e.target.value)} placeholder="NLP, BERT (comma separated)" className="h-9 text-xs border-border/50 shadow-xs focus:ring-1 focus:ring-primary/20 transition-all" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {workspaceType === "publication" && (
                                        <div className="space-y-1">
                                            <Label className="text-xs">Paper PDF</Label>
                                            <Input type="file" accept=".pdf" className="text-xs h-8" onChange={(e) => setPaperFile(e.target.files?.[0] || null)} />
                                        </div>
                                    )}

                                    <Button type="submit" disabled={isSubmitting} className="w-full h-8 text-xs font-bold mt-4">
                                        {isSubmitting ? "Uploading..." : "Save Workspace"}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
