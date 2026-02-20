"use client"

import { useState, useEffect } from "react"
import { 
    Plus, Search, Filter, 
    FileText, Link as LinkIcon, Database, Github,
    MoreVertical, Trash2, ExternalLink, Globe,
    File as FileIcon, FileVideo, FileAudio, Presentation,
    ImageIcon, Download, Upload, BarChart3, PieChart, HardDrive,
    Zap, Code
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
    Dialog, DialogContent, DialogHeader, 
    DialogTitle, DialogFooter, DialogTrigger 
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { 
    Select, SelectContent, SelectItem, 
    SelectTrigger, SelectValue 
} from "@/components/ui/select"
import { toast } from "sonner"
import { 
    getWorkspaceDocuments,
    getResourceLinks, 
    addResourceLink, 
    deleteResourceLink,
    uploadDocument,
    getWorkspaceModels,
    createModel
} from "@/app/actions/workspace"

interface ResourcesTabProps {
  workspace: any
}

export function ResourcesTab({ workspace }: ResourcesTabProps) {
  const [documents, setDocuments] = useState<any[]>([])
  const [links, setLinks] = useState<any[]>([])
  const [models, setModels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false)
  const [isRegisterModelOpen, setIsRegisterModelOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadCategory, setUploadCategory] = useState<'document' | 'result' | 'supplementary'>(
      workspace.type === 'publication' ? 'supplementary' : 'document'
  )
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  useEffect(() => {
    fetchResources()
  }, [workspace.id])

  const fetchResources = async () => {
    setLoading(true)
    const [docsData, linksData, modelsData] = await Promise.all([
        getWorkspaceDocuments(workspace.id, workspace.type),
        getResourceLinks(workspace.id, workspace.type),
        getWorkspaceModels(workspace.id, workspace.type)
    ])
    setDocuments(docsData)
    setLinks(linksData)
    setModels(modelsData)
    setLoading(false)
  }

  const handleFileUpload = async () => {
      if (!uploadFile) return

      const formData = new FormData()
      formData.append("file", uploadFile)

      const result = await uploadDocument(workspace.id, workspace.type, formData, uploadCategory as any)
      if (result.success) {
          toast.success(result.message)
          setIsUploadDialogOpen(false)
          setUploadFile(null)
          fetchResources()
      } else {
          toast.error(result.message)
      }
  }

  const handleAddLink = async (formData: FormData) => {
    const title = formData.get("title") as string
    const url = formData.get("url") as string
    const category = formData.get("category") as any

    const result = await addResourceLink(workspace.id, workspace.type, title, url, category)
    if (result.success) {
        toast.success(result.message)
        setIsAddLinkOpen(false)
        fetchResources()
    } else {
        toast.error(result.message)
    }
  }

  const handleRegisterModel = async (formData: FormData) => {
    formData.append("workspaceId", workspace.id.toString())
    formData.append("workspaceType", workspace.type)
    
    const result = await createModel(null, formData)
    if (result.success) {
        toast.success(result.message)
        setIsRegisterModelOpen(false)
        fetchResources()
    } else {
        toast.error(result.message)
    }
  }

  const handleDeleteLink = async (id: number) => {
      const result = await deleteResourceLink(id, workspace.id, workspace.type)
      if (result.success) {
          toast.success("Link removed")
          fetchResources()
      }
  }

  const getFileIcon = (name: string) => {
      const ext = name.split('.').pop()?.toLowerCase()
      if (ext === 'pdf') return <FileText className="w-5 h-5 text-red-500" />
      if (['mp4', 'mov', 'avi'].includes(ext!)) return <FileVideo className="w-5 h-5 text-purple-500" />
      if (['mp3', 'wav'].includes(ext!)) return <FileAudio className="w-5 h-5 text-emerald-500" />
      if (['pptx', 'ppt'].includes(ext!)) return <Presentation className="w-5 h-5 text-orange-500" />
      if (['jpg', 'png', 'svg'].includes(ext!)) return <ImageIcon className="w-5 h-5 text-blue-500" />
      return <FileIcon className="w-5 h-5 text-slate-400" />
  }

  const isPublication = workspace.type === 'publication'

  const filteredDocs = documents.filter(doc => 
    doc.file_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const generalDocs = filteredDocs.filter(doc => (doc.resource_type || 'document') === 'document')
  const resultFiles = filteredDocs.filter(doc => doc.resource_type === 'result')
  const codeFiles = filteredDocs.filter(doc => doc.resource_type === 'code')
  const datasetFiles = filteredDocs.filter(doc => doc.resource_type === 'dataset')
  const modelFiles = filteredDocs.filter(doc => doc.resource_type === 'model')
  const supplementaryFiles = isPublication 
    ? filteredDocs.filter(doc => doc.resource_type === 'supplementary' || doc.resource_type === 'result' || doc.resource_type === 'document')
    : filteredDocs.filter(doc => doc.resource_type === 'supplementary')

  const filteredLinks = links.filter(link => 
    link.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.url?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredModels = models.filter(m => 
    m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.framework?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const codeLinks = filteredLinks.filter(l => l.category === 'code')
  const datasetLinks = filteredLinks.filter(l => l.category === 'dataset')
  const modelLinks = filteredLinks.filter(l => l.category === 'model')
  const resultLinks = filteredLinks.filter(l => l.category === 'result')
  const supplementaryLinks = isPublication
    ? filteredLinks.filter(l => l.category === 'supplementary' || l.category === 'result')
    : filteredLinks.filter(l => l.category === 'supplementary')

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-[#111722] overflow-hidden">
        {/* Sub-headerToolbar */}
        <div className="px-8 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622]/50 backdrop-blur-sm flex flex-col md:flex-row gap-4 items-center">
             <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                    placeholder="Filter resources in this workspace..." 
                    className="pl-10 bg-slate-100/50 dark:bg-[#1a2436] border-slate-200 dark:border-slate-700 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
                <Dialog open={isAddLinkOpen} onOpenChange={setIsAddLinkOpen}>
                    <DialogTrigger asChild>
                         <Button variant="outline" className="border-slate-200 dark:border-slate-700 gap-2 whitespace-nowrap h-10 px-4 rounded-xl font-bold bg-white dark:bg-[#1a2436] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                            <LinkIcon className="w-4 h-4 text-indigo-500" /> 
                            <span className="hidden sm:inline">Add Link</span>
                            <span className="sm:hidden">Link</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-[#192233] border-slate-200 dark:border-[#324467]">
                        <DialogHeader>
                            <DialogTitle>Add External Resource</DialogTitle>
                        </DialogHeader>
                        <form action={handleAddLink} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input name="title" placeholder="e.g. GitHub Repository" required />
                            </div>
                            <div className="space-y-2">
                                <Label>URL</Label>
                                <Input name="url" placeholder="https://..." required />
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select name="category" defaultValue="code">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="code">Code Repository</SelectItem>
                                        <SelectItem value="dataset">Dataset (Drive/Kaggle)</SelectItem>
                                        <SelectItem value="model">Trained Model</SelectItem>
                                        {isPublication ? (
                                            <SelectItem value="supplementary">Supplementary Material</SelectItem>
                                        ) : (
                                            <SelectItem value="result">Result / Visualization</SelectItem>
                                        )}
                                        <SelectItem value="other">Other Link</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Add Link</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={isRegisterModelOpen} onOpenChange={setIsRegisterModelOpen}>
                    <DialogTrigger asChild>
                         <Button variant="outline" className="border-slate-200 dark:border-slate-700 gap-2 whitespace-nowrap h-10 px-4 rounded-xl font-bold bg-white dark:bg-[#1a2436] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
                            <Zap className="w-4 h-4 text-purple-500" /> 
                            <span className="hidden sm:inline">Register Model</span>
                            <span className="sm:hidden">Model</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-[#192233] border-slate-200 dark:border-[#324467] max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-purple-500" />
                                Register AI Model
                            </DialogTitle>
                        </DialogHeader>
                        <form action={handleRegisterModel} className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <Label className="text-[10px] uppercase font-black text-slate-400 pl-1">Model Title</Label>
                                    <Input name="title" placeholder="e.g. BERT-Large Fine-tuned" required className="rounded-xl border-slate-200 dark:border-slate-800" />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label className="text-[10px] uppercase font-black text-slate-400 pl-1">Model Link (GitHub / Drive)</Label>
                                    <Input name="download_url" placeholder="https://github.com/..." required className="rounded-xl border-slate-200 dark:border-slate-800" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black text-slate-400 pl-1">Model Type</Label>
                                    <Select name="model_type" defaultValue="neural_network">
                                        <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-800">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="neural_network">Neural Network</SelectItem>
                                            <SelectItem value="nlp">NLP Model</SelectItem>
                                            <SelectItem value="computer_vision">Computer Vision</SelectItem>
                                            <SelectItem value="classification">Classification</SelectItem>
                                            <SelectItem value="regression">Regression</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black text-slate-400 pl-1">Framework</Label>
                                    <Input name="framework" placeholder="e.g. PyTorch" className="rounded-xl border-slate-200 dark:border-slate-800" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black text-slate-400 pl-1">Accuracy / Metrics</Label>
                                    <Input name="accuracy" placeholder="e.g. 0.985" className="rounded-xl border-slate-200 dark:border-slate-800" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black text-slate-400 pl-1">Version</Label>
                                    <Input name="version" placeholder="e.g. v1.0" className="rounded-xl border-slate-200 dark:border-slate-800" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black text-slate-400 pl-1">Status</Label>
                                    <Select name="status" defaultValue="training">
                                        <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-800">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="training">Training</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="deployed">Deployed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label className="text-[10px] uppercase font-black text-slate-400 pl-1">Description / Notes</Label>
                                    <Input name="description" placeholder="Brief overview of the model..." className="rounded-xl border-slate-200 dark:border-slate-800" />
                                </div>
                            </div>
                            <DialogFooter className="pt-2">
                                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 w-full rounded-xl font-bold h-11 text-white shadow-lg shadow-purple-500/20">
                                    Register Model
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
                
                <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                    <DialogTrigger asChild>
                         <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2 shadow-lg shadow-indigo-500/20 whitespace-nowrap h-10 px-5 rounded-xl font-bold text-white transition-all transform active:scale-95">
                            <Upload className="w-4 h-4" /> 
                            <span className="hidden sm:inline">Upload File</span>
                            <span className="sm:hidden">Upload</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-[#192233] border-slate-200 dark:border-[#324467]">
                        <DialogHeader>
                            <DialogTitle>Upload Research Artifact</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>File</Label>
                                <Input 
                                    type="file" 
                                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                                    className="cursor-pointer bg-slate-50 dark:bg-[#111722] border-slate-200 dark:border-slate-800"
                                />
                                {uploadFile && (
                                    <p className="text-[10px] text-slate-500 font-mono mt-1">
                                        Selected: {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Target Section</Label>
                                <Select 
                                    value={uploadCategory} 
                                    onValueChange={(val: any) => setUploadCategory(val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select target section" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {isPublication ? (
                                            <SelectItem value="supplementary">Supplementary Materials</SelectItem>
                                        ) : (
                                            <>
                                                <SelectItem value="document">Documents</SelectItem>
                                                <SelectItem value="result">Results</SelectItem>
                                            </>
                                        )}
                                    </SelectContent>
                                </Select>
                                <p className="text-[10px] text-slate-400 italic">
                                    {isPublication 
                                        ? "Files will be added to the Supplementary Materials section."
                                        : "Select the appropriate category for the uploaded file."}
                                </p>
                            </div>
                            <DialogFooter className="pt-4">
                                <Button 
                                    onClick={handleFileUpload} 
                                    disabled={!uploadFile}
                                    className="bg-indigo-600 hover:bg-indigo-700 w-full"
                                >
                                    Start Upload
                                </Button>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-10 custom-scrollbar">
            
            {/* Primary Documents Section (Documents or Supplementary) */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        {isPublication ? (
                            <><HardDrive className="w-4 h-4 text-orange-500" /> Supplementary Materials</>
                        ) : (
                            <><FileText className="w-4 h-4 text-indigo-500" /> Documents</>
                        )}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                        {(isPublication ? supplementaryFiles : generalDocs).length} items
                    </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {loading ? Array.from({length: 4}).map((_, i) => (
                        <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl" />
                    )) : (isPublication ? supplementaryFiles : generalDocs).map((doc) => (
                        <Card key={doc.id} className="group bg-white dark:bg-[#1a2436] border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer rounded-2xl shadow-sm hover:shadow-md">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111722] border border-slate-100 dark:border-slate-800 group-hover:bg-indigo-500/10 transition-colors">
                                    {getFileIcon(doc.file_name)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold truncate text-slate-900 dark:text-slate-200">{doc.file_name}</h4>
                                    <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-tighter">
                                        {(doc.file_size / 1024 / 1024).toFixed(2)} MB • {new Date(doc.uploaded_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                    <Download className="w-4 h-4 text-slate-400 hover:text-indigo-400" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    {!loading && (isPublication ? supplementaryFiles : generalDocs).length === 0 && (
                        <div className="col-span-full py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-400 gap-3 bg-white/30 dark:bg-black/10">
                             {isPublication ? <HardDrive className="w-12 h-12 opacity-10 text-orange-500" /> : <FileText className="w-12 h-12 opacity-10 text-indigo-500" />}
                             <p className="text-sm font-medium">No files uploaded yet.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Results Section (only for non-publications) */}
            {!isPublication && (
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-emerald-500" /> Result
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Results Links */}
                        <Card className="bg-white dark:bg-[#1a2436] border-slate-200 dark:border-slate-800 overflow-hidden rounded-3xl shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#111722]/50 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <PieChart className="w-4 h-4 text-emerald-500" /> Dynamic Visualizations
                                </div>
                            </div>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {loading ? <div className="p-8 text-center text-slate-500">Loading...</div> : 
                                     resultLinks.length > 0 ? (
                                        resultLinks.map(link => (
                                            <div key={link.id} className="p-5 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-[#141b2b] transition-colors">
                                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
                                                        <Globe className="w-5 h-5 text-emerald-500" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h5 className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate">{link.title}</h5>
                                                        <p className="text-xs text-indigo-500 truncate hover:underline cursor-pointer flex items-center gap-1 font-medium mt-0.5">
                                                            {link.url} <ExternalLink className="w-3 h-3" />
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-9 w-9 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all rounded-full"
                                                    onClick={() => handleDeleteLink(link.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))
                                     ) : (
                                        <div className="p-16 text-center text-slate-400 text-xs font-medium italic">
                                            <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-10" />
                                            No visualization links added.
                                        </div>
                                     )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Result Files Grid */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 px-2 mt-2">
                                 Analysis Exports & Figures
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {resultFiles.length > 0 ? resultFiles.map((doc) => (
                                    <Card key={doc.id} className="group bg-white dark:bg-[#1a2436] border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer rounded-2xl">
                                        <CardContent className="p-3 flex items-center gap-4">
                                            <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 group-hover:bg-emerald-500/10 transition-colors">
                                                {getFileIcon(doc.file_name)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold truncate text-slate-900 dark:text-slate-200">{doc.file_name}</h4>
                                                <p className="text-[9px] text-slate-500 font-mono mt-0.5 uppercase">
                                                    {(doc.file_size / 1024 / 1024).toFixed(2)} MB • {new Date(doc.uploaded_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-emerald-500 rounded-full">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )) : (
                                    <div className="h-[180px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-400 gap-2 bg-slate-50/50 dark:bg-black/5">
                                         <HardDrive className="w-8 h-8 opacity-10" />
                                         <p className="text-xs font-medium uppercase tracking-tighter">No result files uploaded</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Resources Section (Code, Data, Models) */}
            <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Globe className="w-4 h-4" /> Research Resources
                    </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Code Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
                             Code
                        </div>
                        <Card className="bg-white dark:bg-[#1a2436] border-slate-200 dark:border-slate-800 overflow-hidden rounded-3xl shadow-sm h-full">
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {codeLinks.length > 0 || codeFiles.length > 0 ? (
                                        <>
                                            {codeLinks.map(link => (
                                                <div key={link.id} className="p-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-[#141b2b] transition-colors">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                            <Github className="w-4 h-4 text-slate-900 dark:text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">{link.title}</h5>
                                                            <p className="text-[10px] text-indigo-500 truncate mt-0.5">{link.url}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {codeFiles.map(file => (
                                                <div key={file.id} className="p-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-[#141b2b] transition-colors">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                                            <Github className="w-4 h-4 text-indigo-500" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">{file.file_name}</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="p-12 text-center text-slate-400 text-[10px] italic">No code resources</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Dataset Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
                             Dataset
                        </div>
                        <Card className="bg-white dark:bg-[#1a2436] border-slate-200 dark:border-slate-800 overflow-hidden rounded-3xl shadow-sm h-full">
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {datasetLinks.length > 0 || datasetFiles.length > 0 ? (
                                        <>
                                            {datasetLinks.map(link => (
                                                <div key={link.id} className="p-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-[#141b2b] transition-colors">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                                            <Database className="w-4 h-4 text-blue-500" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">{link.title}</h5>
                                                            <p className="text-[10px] text-blue-500 truncate mt-0.5">{link.url}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {datasetFiles.map(file => (
                                                <div key={file.id} className="p-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-[#141b2b] transition-colors">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                            <Database className="w-4 h-4 text-blue-500" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">{file.file_name}</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="p-12 text-center text-slate-400 text-[10px] italic">No datasets</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                     {/* Model Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                 Model Repo
                            </div>
                        </div>
                        <Card className="bg-white dark:bg-[#1a2436] border-slate-200 dark:border-slate-800 overflow-hidden rounded-3xl shadow-sm h-full ring-1 ring-purple-500/5">
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {modelLinks.length > 0 || filteredModels.length > 0 ? (
                                        <>
                                            {filteredModels.map(model => (
                                                <Link 
                                                    key={model.id} 
                                                    href={`/model/${model.id}`}
                                                    className="p-4 flex items-center justify-between group hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center border border-purple-200 dark:border-purple-500/20">
                                                            <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                <h5 className="text-xs font-black text-slate-900 dark:text-slate-200 truncate">{model.title}</h5>
                                                                {model.accuracy && (
                                                                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none px-1.5 h-4 py-0 text-[8px] font-black">
                                                                        {(parseFloat(model.accuracy) * 100).toFixed(1)}%
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                                                                <span className="flex items-center gap-1">
                                                                    <Code className="w-3 h-3 opacity-50" /> {model.framework || 'Other'}
                                                                </span>
                                                                <span>•</span>
                                                                <span>{model.version || 'v1'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ExternalLink className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </Link>
                                            ))}
                                            {modelLinks.map(link => (
                                                <div key={link.id} className="p-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-[#141b2b] transition-colors">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                                            <LinkIcon className="w-4 h-4 text-slate-400" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">{link.title}</h5>
                                                            <p className="text-[10px] text-purple-500 truncate mt-0.5">{link.url}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="p-12 text-center text-slate-400 text-[10px] italic">No models registered</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    </div>
  )
}
