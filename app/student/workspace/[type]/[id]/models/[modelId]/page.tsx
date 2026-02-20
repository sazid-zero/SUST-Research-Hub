import { getModel } from "@/app/actions/workspace"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
    ChevronLeft, Cpu, BarChart3, Clock, 
    GitBranch, Save, Download, Globe,
    Activity, Layers, Info, History
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ModelDetailsPageProps {
  params: Promise<{
    type: string
    id: string
    modelId: string
  }>
}

export default async function ModelDetailsPage({ params }: ModelDetailsPageProps) {
  const { type, id, modelId: modelIdStr } = await params
  const modelId = parseInt(modelIdStr)
  
  const model = await getModel(modelId)
  
  if (!model) {
    notFound()
  }

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-[#0d121c] overflow-y-auto custom-scrollbar">
        {/* Navigation Header */}
        <div className="px-8 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] sticky top-0 z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href={`/student/workspace/${type}/${id}`}>
                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-indigo-500 gap-1 rounded-lg">
                        <ChevronLeft className="w-4 h-4" /> Back to Registry
                    </Button>
                </Link>
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
                <h1 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[300px]">{model.name}</h1>
            </div>
            <div className="flex items-center gap-3">
                 <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 px-2 py-0.5 text-[10px]">
                    ITERATION {model.version}
                </Badge>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 h-8 text-xs font-bold rounded-lg px-4">
                    <Save className="w-3.5 h-3.5 mr-2" /> Save Changes
                </Button>
            </div>
        </div>

        <div className="max-w-6xl mx-auto p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Hero Section */}
                    <div className="p-8 rounded-3xl bg-white dark:bg-[#1a2436] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Cpu className="w-32 h-32" />
                        </div>
                        <div className="relative space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
                                    <Cpu className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{model.name}</h2>
                                    <div className="flex items-center gap-4 mt-1">
                                         <Badge variant="secondary" className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black tracking-widest uppercase">
                                            {model.framework}
                                        </Badge>
                                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" /> Registered on {new Date(model.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                                {model.description || "No description provided for this model iteration."}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {model.tags && typeof model.tags === 'string' ? (
                                    // @ts-ignore
                                    model.tags.split(',').map((tag, i) => (
                                        <Badge key={i} variant="outline" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 text-[10px] py-1 px-3 rounded-full">
                                            #{tag.trim()}
                                        </Badge>
                                    ))
                                ) : Array.isArray(model.tags) && model.tags.map((tag, i) => (
                                    <Badge key={i} variant="outline" className="bg-slate-200/50 dark:bg-slate-800/50 border-0 text-slate-500 text-[10px] py-1 px-3 rounded-full">
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Metrics Dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <Card className="bg-white dark:bg-[#1a2436] border-slate-200 dark:border-slate-800 rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-emerald-500" /> PRIMARY ACCURACY
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-4xl font-black text-slate-900 dark:text-white">{model.accuracy || "N/A"}</div>
                                <Progress value={model.accuracy ? parseFloat(model.accuracy) : 0} className="h-2 bg-slate-100 dark:bg-slate-800" />
                                <p className="text-xs text-slate-500 italic">Validated against local test split (20% validation).</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-[#1a2436] border-slate-200 dark:border-slate-800 rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-indigo-500" /> STATUS
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${model.status === 'production' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                                    <span className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                        {model.status || "Development"}
                                    </span>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-[#111722] rounded-xl flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Version Control</span>
                                    <div className="flex items-center gap-1 text-xs font-bold font-mono">
                                        <GitBranch className="w-3 h-3" /> main/HEAD
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="bg-white dark:bg-[#1a2436] border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                        <CardHeader className="bg-slate-50 dark:bg-[#111722]/50 border-b border-slate-100 dark:border-slate-800 p-6">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Layers className="w-4 h-4 text-indigo-500" /> Architecture Logic
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                             <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed font-serif text-lg">
                                <p>Detailed architectural notes and hyperparameters for this training run. This section includes specific layers, learning rates, and optimizer settings used to achieve the current performance metrics.</p>
                             </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="bg-slate-900 border-0 shadow-2xl text-white rounded-3xl overflow-hidden">
                        <CardContent className="p-8 space-y-8">
                             <div className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                        <Download className="w-3 h-3" /> Model Weights
                                    </h3>
                                    {model.model_url || model.file_path ? (
                                        <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold h-12 rounded-xl">
                                            Download Weights
                                        </Button>
                                    ) : (
                                        <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-center">
                                            <p className="text-xs font-medium text-white/60">No weight file uploaded.</p>
                                            <Button variant="ghost" className="text-[10px] font-black text-indigo-400 h-auto p-0 mt-2 hover:bg-transparent">
                                                UPLOAD NOW
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Parameters</span>
                                        <span className="text-xs font-mono font-bold">23.5M</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Batch Size</span>
                                        <span className="text-xs font-mono font-bold">32</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Epochs</span>
                                        <span className="text-xs font-mono font-bold">150</span>
                                    </div>
                                </div>
                             </div>

                             <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/10 h-10 text-[11px] font-bold uppercase tracking-widest rounded-xl">
                                <History className="w-3.5 h-3.5 mr-2" /> View Iteration Log
                             </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-[#1a2436] border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest">Linked Notebooks</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                             <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                                <div className="w-8 h-8 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                    <Globe className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold truncate flex-1">training_pipeline.ipynb</span>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500" />
                             </div>
                        </CardContent>
                    </Card>

                    <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 space-y-2">
                         <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs">
                             <Info className="w-4 h-4" /> COMPUTE NOTES
                         </div>
                         <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                             This model was trained using an NVIDIA RTX 3090. Total training time: 4h 12m. Datasets used are linked in the workspace resources tab.
                         </p>
                    </div>
                </div>

            </div>
        </div>
    </div>
  )
}
