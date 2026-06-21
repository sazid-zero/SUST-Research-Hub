"use client"

import { useState, useEffect } from "react"
import { 
    Plus, Search, 
    FileText, Link as LinkIcon, Database, Github,
    Trash2, ExternalLink,
    File as FileIcon, FileVideo, FileAudio, Presentation,
    ImageIcon, Upload, Code, Brain
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
    Dialog, DialogContent, DialogHeader, 
    DialogTitle, DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { 
    getWorkspaceDocuments,
    getResourceLinks, 
    addResourceLink, 
    deleteResourceLink,
    uploadDocument,
    deleteDocument,
    getWorkspaceModels,
    createModel,
    deleteWorkspaceModel,
    uploadPublicationPDF,
    deletePublicationPDF,
    getWorkspaceDatasets,
    createDataset,
    deleteWorkspaceDataset
} from "@/app/actions/workspace"

interface ResourcesTabProps {
  workspace: any
}

export function ResourcesTab({ workspace }: ResourcesTabProps) {
  const [documents, setDocuments] = useState<any[]>([])
  const [links, setLinks] = useState<any[]>([])
  const [models, setModels] = useState<any[]>([])
  const [datasets, setDatasets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Link Dialog State
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false)
  const [linkCategory, setLinkCategory] = useState<'code' | 'dataset' | 'model'>('code')

  // Dataset Dialog State
  const [isAddDatasetOpen, setIsAddDatasetOpen] = useState(false)

  // Model Dialog State
  const [isAddModelOpen, setIsAddModelOpen] = useState(false)

  // Upload Document Dialog State
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  // Publication Main PDF State
  const [isUploadPaperOpen, setIsUploadPaperOpen] = useState(false)
  const [paperFile, setPaperFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(workspace.publication?.pdf_url || null)

  useEffect(() => {
    fetchResources()
  }, [workspace.id])

  const fetchResources = async () => {
    setLoading(true)
    const [docsData, linksData, modelsData, datasetsData] = await Promise.all([
        getWorkspaceDocuments(workspace.id, workspace.type),
        getResourceLinks(workspace.id, workspace.type),
        getWorkspaceModels(workspace.id, workspace.type),
        getWorkspaceDatasets(workspace.id, workspace.type)
    ])
    setDocuments(docsData)
    setLinks(linksData)
    setModels(modelsData)
    setDatasets(datasetsData)
    setLoading(false)
  }

  const handleFileUpload = async () => {
      if (!uploadFile) return

      const formData = new FormData()
      formData.append("file", uploadFile)

      const result = await uploadDocument(workspace.id, workspace.type, formData, 'document')
      if (result.success) {
          toast.success(result.message)
          setIsUploadDocOpen(false)
          setUploadFile(null)
          fetchResources()
      } else {
          toast.error(result.message)
      }
  }

  const handlePaperUpload = async () => {
      if (!paperFile) return

      const formData = new FormData()
      formData.append("file", paperFile)

      const result = await uploadPublicationPDF(workspace.id, formData)
      if (result.success) {
          toast.success(result.message)
          setIsUploadPaperOpen(false)
          setPaperFile(null)
          setPdfUrl(`/uploads/publication/${workspace.id}/${paperFile.name}`)
          fetchResources()
      } else {
          toast.error(result.message)
      }
  }

  const handlePaperDelete = async () => {
      const result = await deletePublicationPDF(workspace.id)
      if (result.success) {
          toast.success("Main paper PDF removed")
          setPdfUrl(null)
          fetchResources()
      } else {
          toast.error(result.message)
      }
  }

  const handleAddLink = async (formData: FormData) => {
    const title = formData.get("title") as string
    const url = formData.get("url") as string

    const result = await addResourceLink(workspace.id, workspace.type, title, url, linkCategory)
    if (result.success) {
        toast.success(result.message)
        setIsAddLinkOpen(false)
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

  const handleDeleteDoc = async (id: number) => {
      const result = await deleteDocument(id, workspace.id, workspace.type)
      if (result.success) {
          toast.success(result.message)
          fetchResources()
      } else {
          toast.error(result.message)
      }
  }

  const handleDeleteModel = async (id: number) => {
      const result = await deleteWorkspaceModel(id, workspace.id, workspace.type)
      if (result.success) {
          toast.success(result.message)
          fetchResources()
      } else {
          toast.error(result.message)
      }
  }

  const handleAddDataset = async (formData: FormData) => {
      formData.append("workspaceId", workspace.id.toString())
      formData.append("workspaceType", workspace.type)
      const result = await createDataset(null, formData)
      if (result.success) {
          toast.success(result.message)
          setIsAddDatasetOpen(false)
          fetchResources()
      } else {
          toast.error(result.message)
      }
  }

  const handleDeleteDataset = async (id: number) => {
      const result = await deleteWorkspaceDataset(id, workspace.id, workspace.type)
      if (result.success) {
          toast.success(result.message)
          fetchResources()
      } else {
          toast.error(result.message)
      }
  }

  const handleAddModel = async (formData: FormData) => {
      formData.append("workspaceId", workspace.id.toString())
      formData.append("workspaceType", workspace.type)
      const result = await createModel(null, formData)
      if (result.success) {
          toast.success(result.message)
          setIsAddModelOpen(false)
          fetchResources()
      } else {
          toast.error(result.message)
      }
  }

  const getFileIcon = (name: string) => {
      const ext = name.split('.').pop()?.toLowerCase()
      if (ext === 'pdf') return <FileText className="w-5 h-5 text-red-500" />
      if (['mp4', 'mov', 'avi'].includes(ext!)) return <FileVideo className="w-5 h-5 text-purple-500" />
      if (['mp3', 'wav'].includes(ext!)) return <FileAudio className="w-5 h-5 text-emerald-500" />
      if (['pptx', 'ppt'].includes(ext!)) return <Presentation className="w-5 h-5 text-orange-500" />
      if (['jpg', 'png', 'svg'].includes(ext!)) return <ImageIcon className="w-5 h-5 text-blue-500" />
      return <FileIcon className="w-5 h-5 text-muted-foreground" />
  }

  const openLinkDialog = (category: 'code' | 'dataset' | 'model') => {
      setLinkCategory(category)
      setIsAddLinkOpen(true)
  }

  const filteredDocs = documents.filter(doc => 
    doc.file_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredLinks = links.filter(link => 
    link.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.url?.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredModels = models.filter(m => 
    m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredDatasets = datasets.filter(d => 
    d.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const codeLinks = filteredLinks.filter(l => l.category === 'code')

  const allModels = filteredModels.map(m => ({ id: m.id, name: m.name, url: m.external_url || m.file_url, description: m.description }))
  const allDatasets = filteredDatasets.map(d => ({ id: d.id, title: d.title, url: d.location, description: d.description }))

  const getLinkDialogTitle = () => {
      if (linkCategory === 'code') return "Link Code Repository"
      if (linkCategory === 'dataset') return "Link Dataset"
      return "Link Model"
  }

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
        {/* Toolbar */}
        <div className="px-8 py-4 border-b bg-card flex flex-col md:flex-row gap-4 items-center justify-between">
             <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                    placeholder="Search resources..." 
                    className="pl-10 bg-background w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {loading ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">Loading resources...</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                    
                    {/* Section 1: Documents (Theses/Projects) OR Main Publication PDF (Publications) */}
                    {workspace.type === 'publication' ? (
                        <Card className="shadow-sm">
                            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                    <FileText className="w-5 h-5 text-primary" />
                                    Main Publication PDF
                                </CardTitle>
                                {!pdfUrl && (
                                    <Button onClick={() => setIsUploadPaperOpen(true)} size="sm" variant="outline" className="h-8 gap-1">
                                        <Upload className="w-3.5 h-3.5" /> Upload PDF
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent className="p-0">
                                {pdfUrl ? (
                                    <div className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors group">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <FileText className="w-5 h-5 text-red-500" />
                                            <div className="truncate">
                                                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary truncate block">
                                                    {pdfUrl.split('/').pop() || "Main Paper PDF"}
                                                </a>
                                                <span className="text-xs text-muted-foreground block truncate">{pdfUrl}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={handlePaperDelete}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-muted-foreground text-sm italic">No main paper PDF uploaded.</div>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="shadow-sm">
                            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                    <FileText className="w-5 h-5 text-primary" />
                                    Files & Documents
                                </CardTitle>
                                <Button onClick={() => setIsUploadDocOpen(true)} size="sm" variant="outline" className="h-8 gap-1">
                                    <Upload className="w-3.5 h-3.5" /> Upload Document
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                {filteredDocs.length > 0 ? (
                                    <div className="divide-y">
                                        {filteredDocs.map((doc) => (
                                            <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors group">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    {getFileIcon(doc.file_name)}
                                                    <div className="truncate">
                                                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary truncate block">
                                                            {doc.file_name}
                                                        </a>
                                                        <span className="text-xs text-muted-foreground">{doc.resource_type} • {(doc.file_size / 1024).toFixed(1)} KB</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteDoc(doc.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-muted-foreground text-sm italic">No files uploaded.</div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Section 2: Code Repositories */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                <Code className="w-5 h-5 text-primary" />
                                Code Repositories
                            </CardTitle>
                            <Button onClick={() => openLinkDialog('code')} size="sm" variant="outline" className="h-8 gap-1">
                                <Plus className="w-3.5 h-3.5" /> Link Code
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {codeLinks.length > 0 ? (
                                <div className="divide-y">
                                    {codeLinks.map((link) => (
                                        <div key={link.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors group">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <Github className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                                <div className="truncate">
                                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary truncate block">
                                                        {link.title}
                                                    </a>
                                                    <span className="text-xs text-muted-foreground truncate">{link.url}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteLink(link.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-muted-foreground text-sm italic">No code repositories linked.</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Section 3: Datasets */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                <Database className="w-5 h-5 text-primary" />
                                Datasets
                            </CardTitle>
                            <Button onClick={() => setIsAddDatasetOpen(true)} size="sm" variant="outline" className="h-8 gap-1">
                                <Plus className="w-3.5 h-3.5" /> Add Dataset
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {allDatasets.length > 0 ? (
                                <div className="divide-y">
                                    {allDatasets.map((dataset) => (
                                        <div key={`db-${dataset.id}`} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors group">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <Database className="w-5 h-5 text-indigo-500" />
                                                <div className="truncate">
                                                    <a href={dataset.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary truncate block">
                                                        {dataset.title}
                                                    </a>
                                                    {dataset.description && <span className="text-xs text-muted-foreground block truncate">{dataset.description}</span>}
                                                    <span className="text-xs text-muted-foreground truncate">{dataset.url}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-destructive" 
                                                    onClick={() => handleDeleteDataset(dataset.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-muted-foreground text-sm italic">No datasets linked.</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Section 4: Models */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                <Brain className="w-5 h-5 text-primary" />
                                Models
                            </CardTitle>
                            <Button onClick={() => setIsAddModelOpen(true)} size="sm" variant="outline" className="h-8 gap-1">
                                <Plus className="w-3.5 h-3.5" /> Add Model
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {allModels.length > 0 ? (
                                <div className="divide-y">
                                    {allModels.map((model) => (
                                        <div key={`db-${model.id}`} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors group">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <Brain className="w-5 h-5 text-green-500" />
                                                <div className="truncate">
                                                    <a href={model.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary truncate block">
                                                        {model.name}
                                                    </a>
                                                    {model.description && <span className="text-xs text-muted-foreground block truncate">{model.description}</span>}
                                                    <span className="text-xs text-muted-foreground truncate">{model.url}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-destructive" 
                                                    onClick={() => handleDeleteModel(model.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-muted-foreground text-sm italic">No trained models shared.</div>
                            )}
                        </CardContent>
                    </Card>

                </div>
            )}
        </div>

        {/* Dialog 1: Add Link Dialog */}
        <Dialog open={isAddLinkOpen} onOpenChange={setIsAddLinkOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{getLinkDialogTitle()}</DialogTitle>
                </DialogHeader>
                <form action={handleAddLink} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input name="title" placeholder={linkCategory === 'code' ? "e.g. GitHub Repository" : linkCategory === 'dataset' ? "e.g. Kaggle Dataset" : "e.g. HuggingFace Model"} required />
                    </div>
                    <div className="space-y-2">
                        <Label>URL</Label>
                        <Input name="url" type="url" placeholder="https://..." required />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add Link</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        {/* Dialog 2: Upload Document Dialog */}
        <Dialog open={isUploadDocOpen} onOpenChange={setIsUploadDocOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Document</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Select File</Label>
                        <Input 
                            type="file" 
                            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleFileUpload} disabled={!uploadFile}>Upload</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Dialog 3: Upload Main Publication PDF Dialog */}
        <Dialog open={isUploadPaperOpen} onOpenChange={setIsUploadPaperOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Main Publication PDF</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Select PDF File</Label>
                        <Input 
                            type="file" 
                            accept=".pdf"
                            onChange={(e) => setPaperFile(e.target.files?.[0] || null)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handlePaperUpload} disabled={!paperFile}>Upload</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Dialog 4: Add Dataset Dialog */}
        <Dialog open={isAddDatasetOpen} onOpenChange={setIsAddDatasetOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Dataset</DialogTitle>
                </DialogHeader>
                <form action={handleAddDataset} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Title *</Label>
                        <Input name="title" placeholder="e.g. Bengali Sentiment Analysis Corpus" required />
                    </div>
                    <div className="space-y-2">
                        <Label>Dataset URL *</Label>
                        <Input name="location" type="url" placeholder="https://kaggle.com/..." required />
                    </div>
                    <div className="space-y-2">
                        <Label>Modality / Type</Label>
                        <select name="type" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option value="">Select type...</option>
                            <option value="text">Text</option>
                            <option value="image">Image</option>
                            <option value="tabular">Tabular</option>
                            <option value="audio">Audio</option>
                            <option value="video">Video</option>
                            <option value="geospatial">Geospatial</option>
                            <option value="3d">3D</option>
                            <option value="time-series">Time Series</option>
                            <option value="multimodal">Multimodal</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Size (approx.)</Label>
                        <Input name="size" placeholder="e.g. 2.5 GB, 50K rows" />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Input name="description" placeholder="Brief description of the dataset" />
                    </div>
                    <div className="space-y-2">
                        <Label>Tags (comma separated)</Label>
                        <Input name="tags" placeholder="e.g. NLP, Bangla, Sentiment" />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add Dataset</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        {/* Dialog 5: Add Model Dialog */}
        <Dialog open={isAddModelOpen} onOpenChange={setIsAddModelOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Model</DialogTitle>
                </DialogHeader>
                <form action={handleAddModel} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Model Name *</Label>
                        <Input name="title" placeholder="e.g. BERT Fine-tuned Bengali" required />
                    </div>
                    <div className="space-y-2">
                        <Label>Model URL *</Label>
                        <Input name="download_url" type="url" placeholder="https://huggingface.co/..." required />
                    </div>
                    <div className="space-y-2">
                        <Label>Model Type / Task</Label>
                        <select name="model_type" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option value="">Select type...</option>
                            <option value="text-classification">Text Classification</option>
                            <option value="text-generation">Text Generation</option>
                            <option value="image-classification">Image Classification</option>
                            <option value="object-detection">Object Detection</option>
                            <option value="question-answering">Question Answering</option>
                            <option value="summarization">Summarization</option>
                            <option value="translation">Translation</option>
                            <option value="text-to-image">Text-to-Image</option>
                            <option value="text-to-speech">Text-to-Speech</option>
                            <option value="speech-to-text">Speech-to-Text</option>
                            <option value="embedding">Embedding</option>
                            <option value="regression">Regression</option>
                            <option value="classification">Classification</option>
                            <option value="neural-network">Neural Network</option>
                            <option value="reinforcement-learning">Reinforcement Learning</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Framework</Label>
                        <select name="framework" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option value="">Select framework...</option>
                            <option value="pytorch">PyTorch</option>
                            <option value="tensorflow">TensorFlow</option>
                            <option value="jax">JAX</option>
                            <option value="scikit-learn">scikit-learn</option>
                            <option value="transformers">Transformers</option>
                            <option value="onnx">ONNX</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Input name="description" placeholder="Brief description of the model" />
                    </div>
                    <div className="space-y-2">
                        <Label>Tags (comma separated)</Label>
                        <Input name="tags" placeholder="e.g. NLP, BERT, Fine-tuned" />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add Model</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </div>
  )
}
