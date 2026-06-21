"use client"

import { GlobalNavbar } from "@/components/global-navbar"
import { Card } from "@/components/ui/card"
import NextLink from "next/link"
import {
    Search,
    X,
    ArrowUpDown,
    MessageSquare,
    ImageIcon,
    FileText,
    Languages,
    Mic,
    Ear,
    Link,
    Bot,
    Video,
    Layers,
    Sparkles,
    Eye,
    Grid3x3,
    Wand2,
    AudioLines,
    TableIcon,
    Brain,
    Network,
    HardDrive,
    Box,
    Flame,
    Zap,
    Download,
    Filter,
    TrendingUp,
    ExternalLink
} from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { IconBrandUnity } from "@tabler/icons-react"

interface ModelsContentProps {
    user: any
    initialModels?: any[]
}

const formatNumber = (number: number | null | undefined) => {
    if (number === undefined || number === null) return "0"
    if (number >= 1000) {
        return (number / 1000).toFixed(number % 1000 === 0 ? 0 : 1) + "k"
    }
    return number.toString()
}

const taskCategories: Record<string, any> = {
    "text-generation": { label: "Text Generation", icon: MessageSquare, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    "text-classification": { label: "Text Classification", icon: FileText, color: "bg-green-500/10 text-green-600 border-green-500/20" },
    "question-answering": { label: "Question Answering", icon: MessageSquare, color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
    summarization: { label: "Summarization", icon: FileText, color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
    translation: { label: "Translation", icon: Languages, color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" },
    "text-to-image": { label: "Text-to-Image", icon: ImageIcon, color: "bg-pink-500/10 text-pink-600 border-pink-500/20" },
    "image-classification": { label: "Image Classification", icon: ImageIcon, color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
    "object-detection": { label: "Object Detection", icon: ImageIcon, color: "bg-red-500/10 text-red-600 border-red-500/20" },
    "text-to-speech": { label: "Text-to-Speech", icon: Mic, color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
    "speech-to-text": { label: "Speech-to-Text", icon: Ear, color: "bg-teal-500/10 text-teal-600 border-teal-500/20" },
    embedding: { label: "Embedding", icon: Link, color: "bg-gray-500/10 text-gray-600 border-gray-500/20" },
    "reinforcement-learning": { label: "Reinforcement Learning", icon: Bot, color: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
    regression: { label: "Regression", icon: TrendingUp, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    classification: { label: "Classification", icon: Grid3x3, color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
    neural_network: { label: "Neural Network", icon: Network, color: "bg-fuchsia-500/10 text-fuchsia-600 border-fuchsia-500/20" },
    "neural-network": { label: "Neural Network", icon: Network, color: "bg-fuchsia-500/10 text-fuchsia-600 border-fuchsia-500/20" },
    reinforcement_learning: { label: "Reinforcement Learning", icon: Bot, color: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
}

const libraries = [
    { key: "pytorch", label: "PyTorch", icon: Flame, color: "text-red-600" },
    { key: "tensorflow", label: "TensorFlow", icon: Zap, color: "text-orange-600" },
    { key: "jax", label: "JAX", icon: Sparkles, color: "text-blue-600" },
    { key: "scikit-learn", label: "scikit-learn", icon: Brain, color: "text-blue-500" },
    { key: "transformers", label: "Transformers", icon: Bot, color: "text-yellow-600" },
    { key: "onnx", label: "ONNX", icon: Network, color: "text-gray-600" },
    { key: "other", label: "Other", icon: Layers, color: "text-purple-600" },
]

export default function ModelsContent({ user, initialModels }: ModelsContentProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterFramework, setFilterFramework] = useState("all")
    const [filterTask, setFilterTask] = useState("all")
    const [sortBy, setSortBy] = useState("newest")
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

    const models = initialModels || []

    const filteredModels = models.filter((model) => {
        const title = model.title || model.name || ""
        const desc = model.description || ""
        const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              desc.toLowerCase().includes(searchQuery.toLowerCase())
        
        const framework = (model.framework || "").toLowerCase()
        const matchesFramework = filterFramework === "all" || framework === filterFramework.toLowerCase()
        
        const task = (model.model_type || model.task || "").toLowerCase().replace(/\s+/g, "-")
        const matchesTask = filterTask === "all" || task === filterTask.toLowerCase().replace(/\s+/g, "-")
        
        return matchesSearch && matchesFramework && matchesTask
    })

    const sortedModels = [...filteredModels].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
            case "oldest":
                return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
            case "title":
                return (a.title || a.name || "").localeCompare(b.title || b.name || "")
            default:
                return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        }
    })

    const clearFilters = () => {
        setSearchQuery("")
        setFilterFramework("all")
        setFilterTask("all")
    }

    const hasActiveFilters = searchQuery !== "" || filterFramework !== "all" || filterTask !== "all"

    return (
        <div className="min-h-screen bg-background">
            <GlobalNavbar user={user} />

            <div className="mx-auto max-w-[83.5rem] px-4 lg:px-8 pb-12 mt-8">
                <div className="grid gap-6 lg:gap-8 lg:grid-cols-[280px_1fr]">
                    {/* Desktop Sidebar Filters */}
                    <div className="hidden lg:block">
                        <Card className="border border-border bg-card p-6 pt-6 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-scroll scrollbar-hide" style={{ scrollbarGutter: "stable" }}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold">Filters</h3>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs text-primary hover:underline flex items-center gap-1"
                                    >
                                        <X className="h-3 w-3" />
                                        Clear
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                {/* Tasks Section */}
                                <div>
                                    <h3 className="text-sm font-semibold mb-3">Model Type</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setFilterTask("all")}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-colors border ${
                                                filterTask === "all"
                                                    ? "bg-primary/10 text-primary border-primary/20"
                                                    : "bg-background border-border hover:bg-muted"
                                            }`}
                                        >
                                            All
                                        </button>
                                        {Object.entries(taskCategories).slice(0, 12).map(([key, task]) => {
                                            const Icon = task.icon
                                            return (
                                                <button
                                                    key={key}
                                                    onClick={() => setFilterTask(filterTask === key ? "all" : key)}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-colors border ${
                                                        filterTask === key
                                                            ? "bg-primary/10 text-primary border-primary/20"
                                                            : "bg-background border-border hover:bg-muted"
                                                    }`}
                                                >
                                                    <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                                                    {task.label}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Libraries Section */}
                                <div>
                                    <h3 className="text-sm font-semibold mb-3">Framework</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setFilterFramework("all")}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-colors border ${
                                                filterFramework === "all"
                                                    ? "bg-primary/10 text-primary border-primary/20"
                                                    : "bg-background border-border hover:bg-muted"
                                            }`}
                                        >
                                            All
                                        </button>
                                        {libraries.map((lib) => {
                                            const Icon = lib.icon
                                            return (
                                                <button
                                                    key={lib.key}
                                                    onClick={() => setFilterFramework(filterFramework === lib.key ? "all" : lib.key)}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-colors border ${
                                                        filterFramework === lib.key
                                                            ? "bg-primary/10 text-primary border-primary/20"
                                                            : "bg-background border-border hover:bg-muted"
                                                    }`}
                                                >
                                                    <Icon className={`h-3.5 w-3.5 ${lib.color}`} />
                                                    {lib.label}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-4 mt-4 border-t border-border">
                                <p className="text-xs text-muted-foreground">
                                    Showing <span className="font-medium text-foreground">{sortedModels.length}</span> of{" "}
                                    <span className="font-medium text-foreground">{models.length}</span>
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="space-y-4">
                        {/* Search and Sort Bar */}
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground dark:text-foreground whitespace-nowrap mr-2">
                                <p className="font-semibold text-lg">Models </p>
                                {models.length}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
                                    <Input
                                        placeholder="Search models..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border-2 border-border text-sm text-muted-foreground dark:text-foreground focus:outline-none focus:border-primary/50 focus:bg-background transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Mobile Filter Button */}
                            <button
                                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                                className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg bg-background border-2 border-border hover:border-primary/50 transition-colors"
                            >
                                <Filter className="h-4 w-4" />
                                <span className="text-xs font-medium">Filters</span>
                            </button>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-44 bg-background border-border h-9 text-xs">
                                    <ArrowUpDown className="h-3 w-3 mr-1" />
                                    <SelectValue placeholder="Sort" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border text-xs">
                                    <SelectItem value="newest">Newest First</SelectItem>
                                    <SelectItem value="oldest">Oldest First</SelectItem>
                                    <SelectItem value="title">By Title</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Mobile Filters Modal */}
                        {isMobileFilterOpen && (
                            <div className="fixed inset-0 z-40 lg:hidden">
                                <div
                                    className="absolute inset-0 bg-black/50"
                                    onClick={() => setIsMobileFilterOpen(false)}
                                />
                                <Card className="absolute top-0 right-0 bottom-0 w-full max-w-sm border-l border-border bg-card p-6 overflow-y-auto">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-semibold">Filters</h2>
                                        <button
                                            onClick={() => setIsMobileFilterOpen(false)}
                                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Tasks */}
                                        <div>
                                            <h3 className="text-sm font-semibold mb-3">Model Type</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {Object.entries(taskCategories).slice(0, 12).map(([key, task]) => {
                                                    const Icon = task.icon
                                                    return (
                                                        <button
                                                            key={key}
                                                            onClick={() => {
                                                                setFilterTask(key)
                                                                setIsMobileFilterOpen(false)
                                                            }}
                                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-colors border ${
                                                                filterTask === key
                                                                    ? "bg-primary/10 text-primary border-primary/20"
                                                                    : "bg-background border-border hover:bg-muted"
                                                            }`}
                                                        >
                                                            <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                                                            {task.label}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* Libraries */}
                                        <div>
                                            <h3 className="text-sm font-semibold mb-3">Framework</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {libraries.map((lib) => {
                                                    const Icon = lib.icon
                                                    return (
                                                        <button
                                                            key={lib.key}
                                                            onClick={() => {
                                                                setFilterFramework(lib.key)
                                                                setIsMobileFilterOpen(false)
                                                            }}
                                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-colors border ${
                                                                filterFramework === lib.key
                                                                    ? "bg-primary/10 text-primary border-primary/20"
                                                                    : "bg-background border-border hover:bg-muted"
                                                            }`}
                                                        >
                                                            <Icon className={`h-3.5 w-3.5 ${lib.color}`} />
                                                            {lib.label}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {hasActiveFilters && (
                                            <button
                                                onClick={clearFilters}
                                                className="w-full text-xs text-primary hover:underline flex items-center justify-center gap-1 py-2"
                                            >
                                                <X className="h-3 w-3" />
                                                Clear Filters
                                            </button>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4">
                            {sortedModels.length > 0 ? sortedModels.map((model, index) => {
                                const taskKey = model.model_type || model.task || "unknown"
                                let taskConfig = taskCategories[taskKey]
                                if (!taskConfig) {
                                    const foundKey = Object.keys(taskCategories).find(
                                        key => key.toLowerCase() === taskKey?.toLowerCase()
                                    )
                                    if (foundKey) {
                                        taskConfig = taskCategories[foundKey]
                                    }
                                }
                                if (!taskConfig) {
                                    taskConfig = {
                                        label: taskKey.replace(/-/g, " "),
                                        icon: FileText,
                                        color: "bg-gray-500/10 text-gray-600 border-gray-500/20",
                                    }
                                }
                                const TaskIcon = taskConfig.icon

                                return (
                                    <motion.div
                                        key={model.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <Card className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                                            {/* Line 1: Title */}
                                            <div className="flex items-center gap-1 mb-2">
                                                <IconBrandUnity className="h-4 w-4 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
                                                <h3 className="text-base font-medium font-sans truncate">{model.title || model.name}</h3>
                                                {model.download_url && (
                                                    <a
                                                        href={model.download_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ml-auto flex-shrink-0 text-muted-foreground hover:text-primary"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                    </a>
                                                )}
                                            </div>
                                            
                                            {model.description && (
                                                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{model.description}</p>
                                            )}

                                            {/* Line 2: Attributes */}
                                            <div className="flex items-center gap-2 flex-wrap text-xs">
                                                {model.model_type && (
                                                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded border capitalize ${taskConfig.color}`}>
                                                        <TaskIcon className="h-3 w-3" />
                                                        {model.model_type.replace(/-/g, " ")}
                                                    </span>
                                                )}
                                                
                                                {model.framework && (
                                                    <span className="text-neutral-500 dark:text-neutral-400 capitalize px-2 py-0.5 rounded border bg-muted/50">
                                                        {model.framework}
                                                    </span>
                                                )}

                                                {model.tags && model.tags.length > 0 && (
                                                    <>
                                                        <span className="text-neutral-500 dark:text-neutral-400">•</span>
                                                        {model.tags.slice(0, 3).map((tag: string, i: number) => (
                                                            <span key={i} className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </>
                                                )}
                                                <span className="text-neutral-500 dark:text-neutral-400">•</span>
                                                <span className="text-neutral-500 dark:text-neutral-400">
                                                    {model.created_at ? new Date(model.created_at).toLocaleDateString() : ""}
                                                </span>
                                            </div>
                                        </Card>
                                    </motion.div>
                                )
                            }) : (
                                <Card className="border border-border bg-card p-8 text-center">
                                    <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                                    <h3 className="text-sm font-semibold text-foreground mb-1">
                                        {models.length === 0 ? "No models yet" : "No models found"}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        {models.length === 0 
                                            ? "Models added from research workspaces will appear here." 
                                            : "Try adjusting your search or filters."}
                                    </p>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
