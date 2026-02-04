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
    Heart, Filter,
} from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { IconBrandUnity } from "@tabler/icons-react"

const sampleModels = [
    {
        id: 1,
        name: "Vision Transformer v2.0",
        framework: "PyTorch",
        task: "image-classification" as keyof typeof taskCategories,
        domain: "Computer Vision",
        trainingType: "Fine-tuned",
        size: 1876000000, // Added size in bytes
        views: 5234,
        downloads: 1876,
        likes: 643,
        updated: "1 day ago",
    },
    {
        id: 2,
        name: "BERT Fine-tuned for Domain",
        framework: "TensorFlow",
        task: "text-classification" as keyof typeof taskCategories,
        domain: "Bangla NLP",
        trainingType: "Fine-tuned",
        size: 438000000, // Added size
        views: 4156,
        downloads: 1543,
        likes: 489,
        updated: "3 days ago",
    },
    {
        id: 3,
        name: "ResNet-50 Backbone",
        framework: "PyTorch",
        task: "object-detection" as keyof typeof taskCategories,
        domain: "Medical Imaging",
        trainingType: "From Scratch",
        size: 102400000, // Added size
        views: 3876,
        downloads: 1234,
        likes: 367,
        updated: "2 days ago",
    },
    {
        id: 4,
        name: "JAX Diffusion Model",
        framework: "JAX",
        task: "text-to-image" as keyof typeof taskCategories,
        domain: "Generative AI",
        trainingType: "Distilled",
        size: 3200000000, // Added size
        views: 2943,
        downloads: 876,
        likes: 256,
        updated: "4 days ago",
    },
    {
        id: 5,
        name: "GPT-2 Text Generator",
        framework: "PyTorch",
        task: "text-generation" as keyof typeof taskCategories,
        domain: "Natural Language",
        trainingType: "Fine-tuned",
        size: 548000000, // Added size
        views: 8543,
        downloads: 3421,
        likes: 1234,
        updated: "5 days ago",
    },
    {
        id: 6,
        name: "BERT Question Answering",
        framework: "TensorFlow",
        task: "question-answering" as keyof typeof taskCategories,
        domain: "Bangla NLP",
        trainingType: "Fine-tuned",
        size: 440000000, // Added size
        views: 3214,
        downloads: 987,
        likes: 456,
        updated: "1 week ago",
    },
    {
        id: 7,
        name: "T5 Summarization Model",
        framework: "PyTorch",
        task: "summarization" as keyof typeof taskCategories,
        domain: "Natural Language",
        trainingType: "Fine-tuned",
        size: 892000000, // Added size
        views: 2876,
        downloads: 743,
        likes: 321,
        updated: "3 days ago",
    },
    {
        id: 8,
        name: "MarianMT Bengali-English",
        framework: "TensorFlow",
        task: "translation" as keyof typeof taskCategories,
        domain: "Bangla NLP",
        trainingType: "From Scratch",
        size: 312000000, // Added size
        views: 4532,
        downloads: 1654,
        likes: 678,
        updated: "2 weeks ago",
    },
    {
        id: 9,
        name: "Tacotron2 TTS Model",
        framework: "PyTorch",
        task: "text-to-speech" as keyof typeof taskCategories,
        domain: "Audio Processing",
        trainingType: "Fine-tuned",
        size: 267000000, // Added size
        views: 1987,
        downloads: 543,
        likes: 234,
        updated: "4 days ago",
    },
    {
        id: 10,
        name: "Whisper ASR Model",
        framework: "PyTorch",
        task: "speech-to-text" as keyof typeof taskCategories,
        domain: "Audio Processing",
        trainingType: "Fine-tuned",
        size: 1420000000, // Added size
        views: 6543,
        downloads: 2345,
        likes: 876,
        updated: "1 day ago",
    },
    {
        id: 11,
        name: "SentenceTransformer Embeddings",
        framework: "PyTorch",
        task: "embedding" as keyof typeof taskCategories,
        domain: "Natural Language",
        trainingType: "Pre-trained",
        size: 420000000, // Added size
        views: 3421,
        downloads: 1234,
        likes: 543,
        updated: "6 days ago",
    },
    {
        id: 12,
        name: "PPO Agent for CartPole",
        framework: "PyTorch",
        task: "reinforcement-learning" as keyof typeof taskCategories,
        domain: "Robotics",
        trainingType: "From Scratch",
        size: 2048000, // Added size
        views: 1654,
        downloads: 432,
        likes: 178,
        updated: "1 week ago",
    },
]
// Declare formatSize function
const formatSize = (size: number | null | undefined) => {
    if (size === undefined || size === null) return "N/A"
    if (size >= 1e12) {
        return `${(size / 1e12).toFixed(1)}TB`
    } else if (size >= 1e9) {
        return `${(size / 1e9).toFixed(1)}GB`
    } else if (size >= 1e6) {
        return `${(size / 1e6).toFixed(1)}MB`
    } else if (size >= 1e3) {
        return `${(size / 1e3).toFixed(1)}KB`
    }
    return `${size}B`
}

// Declare formatNumber function
const formatNumber = (number: number | null | undefined) => {
    if (number === undefined || number === null) return "0"
    if (number >= 1000) {
        return (number / 1000).toFixed(number % 1000 === 0 ? 0 : 1) + "k"
    }
    return number.toString()
}

const allTasks = {
    Multimodal: [
        { key: "audio-text-to-text", label: "Audio-Text-to-Text", icon: AudioLines, color: "text-orange-600" },
        { key: "image-text-to-text", label: "Image-Text-to-Text", icon: ImageIcon, color: "text-orange-600" },
        { key: "visual-qa", label: "Visual Question Answering", icon: Eye, color: "text-orange-600" },
        { key: "document-qa", label: "Document Question Answering", icon: FileText, color: "text-orange-600" },
        { key: "video-text-to-text", label: "Video-Text-to-Text", icon: Video, color: "text-orange-600" },
        { key: "visual-doc-retrieval", label: "Visual Document Retrieval", icon: Search, color: "text-orange-600" },
        { key: "any-to-any", label: "Any-to-Any", icon: Sparkles, color: "text-orange-600" },
    ],
    "Computer Vision": [
        { key: "depth-estimation", label: "Depth Estimation", icon: Layers, color: "text-blue-600" },
        { key: "image-classification", label: "Image Classification", icon: ImageIcon, color: "text-blue-600" },
        { key: "object-detection", label: "Object Detection", icon: Grid3x3, color: "text-blue-600" },
        { key: "image-segmentation", label: "Image Segmentation", icon: Layers, color: "text-blue-600" },
        { key: "text-to-image", label: "Text-to-Image", icon: Wand2, color: "text-blue-600" },
        { key: "image-to-text", label: "Image-to-Text", icon: FileText, color: "text-blue-600" },
        { key: "image-to-image", label: "Image-to-Image", icon: ImageIcon, color: "text-blue-600" },
        { key: "image-to-video", label: "Image-to-Video", icon: Video, color: "text-blue-600" },
        { key: "unconditional-image-gen", label: "Unconditional Image Generation", icon: Sparkles, color: "text-blue-600" },
        { key: "video-classification", label: "Video Classification", icon: Video, color: "text-blue-600" },
        { key: "text-to-video", label: "Text-to-Video", icon: Video, color: "text-blue-600" },
        {
            key: "zero-shot-image-classification",
            label: "Zero-Shot Image Classification",
            icon: Eye,
            color: "text-blue-600",
        },
        { key: "mask-generation", label: "Mask Generation", icon: Layers, color: "text-blue-600" },
        { key: "zero-shot-object-detection", label: "Zero-Shot Object Detection", icon: Grid3x3, color: "text-blue-600" },
        { key: "text-to-3d", label: "Text-to-3D", icon: Box, color: "text-blue-600" }, // Using Box icon
        { key: "image-to-3d", label: "Image-to-3D", icon: Box, color: "text-blue-600" }, // Using Box icon
        { key: "image-feature-extraction", label: "Image Feature Extraction", icon: Network, color: "text-blue-600" },
        { key: "keypoint-detection", label: "Keypoint Detection", icon: Grid3x3, color: "text-blue-600" },
        { key: "video-to-video", label: "Video-to-Video", icon: Video, color: "text-blue-600" },
    ],
    "Natural Language Processing": [
        { key: "text-classification", label: "Text Classification", icon: FileText, color: "text-green-600" },
        { key: "token-classification", label: "Token Classification", icon: FileText, color: "text-green-600" },
        { key: "table-qa", label: "Table Question Answering", icon: TableIcon, color: "text-green-600" },
        { key: "question-answering", label: "Question Answering", icon: MessageSquare, color: "text-green-600" },
        { key: "zero-shot-classification", label: "Zero-Shot Classification", icon: Sparkles, color: "text-green-600" },
        { key: "translation", label: "Translation", icon: Languages, color: "text-green-600" },
        { key: "summarization", label: "Summarization", icon: FileText, color: "text-green-600" },
        { key: "feature-extraction", icon: Network, color: "text-green-600" },
        { key: "text-generation", label: "Text Generation", icon: MessageSquare, color: "text-green-600" },
        { key: "fill-mask", label: "Fill-Mask", icon: FileText, color: "text-green-600" },
        { key: "sentence-similarity", label: "Sentence Similarity", icon: Link, color: "text-green-600" },
        { key: "text-ranking", label: "Text Ranking", icon: ArrowUpDown, color: "text-green-600" },
    ],
    Audio: [
        { key: "text-to-speech", label: "Text-to-Speech", icon: Mic, color: "text-purple-600" },
        { key: "text-to-audio", label: "Text-to-Audio", icon: AudioLines, color: "text-purple-600" },
        { key: "speech-to-text", label: "Automatic Speech Recognition", icon: Ear, color: "text-purple-600" },
        { key: "audio-to-audio", label: "Audio-to-Audio", icon: AudioLines, color: "text-purple-600" },
        { key: "audio-classification", label: "Audio Classification", icon: AudioLines, color: "text-purple-600" },
        { key: "voice-activity-detection", label: "Voice Activity Detection", icon: Mic, color: "text-purple-600" },
    ],
    Tabular: [
        { key: "tabular-classification", label: "Tabular Classification", icon: TableIcon, color: "text-yellow-600" },
        { key: "tabular-regression", label: "Tabular Regression", icon: TableIcon, color: "text-yellow-600" },
        { key: "time-series-forecasting", label: "Time Series Forecasting", icon: ArrowUpDown, color: "text-yellow-600" },
    ],
    "Reinforcement Learning": [
        { key: "reinforcement-learning", label: "Reinforcement Learning", icon: Bot, color: "text-pink-600" },
        { key: "robotics", label: "Robotics", icon: Brain, color: "text-pink-600" },
    ],
    Other: [{ key: "graph-ml", label: "Graph Machine Learning", icon: Network, color: "text-gray-600" }],
}

const libraries = [
    { key: "pytorch", label: "PyTorch", icon: Flame, color: "text-red-600" }, // Using Flame icon
    { key: "tensorflow", label: "TensorFlow", icon: Zap, color: "text-orange-600" }, // Using Zap icon
    { key: "jax", label: "JAX", icon: Sparkles, color: "text-blue-600" },
    { key: "transformers", label: "Transformers", icon: Bot, color: "text-yellow-600" },
    { key: "sentence-transformers", label: "sentence-transformers", icon: MessageSquare, color: "text-green-600" },
    { key: "scikit-learn", label: "scikit-learn", icon: Brain, color: "text-blue-500" },
    { key: "spacy", label: "spaCy", icon: FileText, color: "text-cyan-600" },
    { key: "setfit", label: "SetFit", icon: Layers, color: "text-purple-600" },
    { key: "diffusers", label: "Diffusers", icon: Wand2, color: "text-pink-600" },
    { key: "onnx", label: "ONNX", icon: Network, color: "text-gray-600" },
    { key: "gguf", label: "GGUF", icon: HardDrive, color: "text-indigo-600" },
    { key: "bitsandbytes", label: "bitsandbytes", icon: Box, color: "text-teal-600" }, // Using Box icon
]

const featuredTaskKeys = [
    "text-generation",
    "image-text-to-text",
    "image-classification",
    "text-to-image",
    "translation",
    "text-to-speech",
]

const domains = [
    { key: "computer-vision", label: "Computer Vision", icon: Eye, color: "text-blue-600" },
    { key: "natural-language", label: "Natural Language", icon: MessageSquare, color: "text-green-600" },
    { key: "audio-processing", label: "Audio Processing", icon: AudioLines, color: "text-purple-600" },
    { key: "bangla-nlp", label: "Bangla NLP", icon: Languages, color: "text-cyan-600" },
    { key: "medical-imaging", label: "Medical Imaging", icon: Heart, color: "text-red-600" },
    { key: "generative-ai", label: "Generative AI", icon: Sparkles, color: "text-pink-600" },
    { key: "robotics", label: "Robotics", icon: Bot, color: "text-orange-600" },
]

const featuredDomainKeys = ["computer-vision", "natural-language", "audio-processing", "bangla-nlp"]

interface ModelsContentProps {
    user: any
    initialModels?: any[]
}

const taskCategories = {
    "text-generation": {
        label: "Text Generation",
        icon: MessageSquare,
        color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    "text-classification": {
        label: "Text Classification",
        icon: FileText,
        color: "bg-green-500/10 text-green-600 border-green-500/20",
    },
    "question-answering": {
        label: "Question Answering",
        icon: MessageSquare,
        color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    },
    summarization: {
        label: "Summarization",
        icon: FileText,
        color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    },
    translation: { label: "Translation", icon: Languages, color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" },
    "text-to-image": {
        label: "Text-to-Image",
        icon: ImageIcon,
        color: "bg-pink-500/10 text-pink-600 border-pink-500/20",
    },
    "image-classification": {
        label: "Image Classification",
        icon: ImageIcon,
        color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    },
    "object-detection": {
        label: "Object Detection",
        icon: ImageIcon,
        color: "bg-red-500/10 text-red-600 border-red-500/20",
    },
    "text-to-speech": {
        label: "Text-to-Speech",
        icon: Mic,
        color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    },
    "speech-to-text": { label: "Speech-to-Text", icon: Ear, color: "bg-teal-500/10 text-teal-600 border-teal-500/20" },
    embedding: { label: "Embedding", icon: Link, color: "bg-gray-500/10 text-gray-600 border-gray-500/20" },
    "reinforcement-learning": {
        label: "Reinforcement Learning",
        icon: Bot,
        color: "bg-violet-500/10 text-violet-600 border-violet-500/20",
    },
}

export default function ModelsContent({ user, initialModels }: ModelsContentProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterFramework, setFilterFramework] = useState("all")
    const [filterTask, setFilterTask] = useState("all")
    const [filterDomain, setFilterDomain] = useState("all")
    const [selectedYearFrom, setSelectedYearFrom] = useState("All")
    const [selectedYearTo, setSelectedYearTo] = useState("All")
    const [sortBy, setSortBy] = useState("trending")
    const [activeTab, setActiveTab] = useState<"main" | "tasks" | "libraries" | "domains">("main")
    const [parameterRange, setParameterRange] = useState([0, 500])
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

    // Use real models if provided, otherwise fallback to sample data
    const models = initialModels && initialModels.length > 0 ? initialModels : sampleModels

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i)

    const totalTasks = Object.values(allTasks).flat().length
    const remainingTasks = totalTasks - featuredTaskKeys.length
    const remainingDomains = domains.length - featuredDomainKeys.length

    const filteredModels = models.filter((model) => {
        const name = model.name || model.title || ""
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase())
        const framework = model.framework || ""
        const matchesFramework = filterFramework === "all" || framework === filterFramework
        const task = model.task || ""
        const matchesTask = filterTask === "all" || task === filterTask
        const domain = model.domain || ""
        const matchesDomain = filterDomain === "all" || domain === filterDomain
        return matchesSearch && matchesFramework && matchesTask && matchesDomain
    })

    const clearFilters = () => {
        setSearchQuery("")
        setFilterFramework("all")
        setFilterTask("all")
        setFilterDomain("all")
        setSelectedYearFrom("All")
        setSelectedYearTo("All")
        setParameterRange([0, 500])
    }

    const hasActiveFilters =
        searchQuery !== "" ||
        filterFramework !== "all" ||
        filterTask !== "all" ||
        filterDomain !== "all" ||
        selectedYearFrom !== "All" ||
        selectedYearTo !== "All" ||
        parameterRange[0] !== 0 ||
        parameterRange[1] !== 500

    return (
        <div className="min-h-screen bg-background">
            <GlobalNavbar user={user} />

            <div className="mx-auto max-w-[83.5rem] px-4 lg:px-8 pb-12 mt-8">
                <div className="grid gap-6 lg:gap-8 lg:grid-cols-[400px_1fr]">
                    {/* Desktop Sidebar Filters */}
                    <div className="hidden lg:block">
                        <Card className="border border-border bg-card p-6 pt-6 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-scroll scrollbar-hide" style={{ scrollbarGutter: "stable" }}>
                            <div className="flex items-center justify-between gap-1">
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => setActiveTab("main")}
                                        className={`px-4 py-2 text-xs font-medium rounded-md transition-colors ${
                                            activeTab === "main"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                        }`}
                                    >
                                        Main
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("tasks")}
                                        className={`px-4 py-2 text-xs font-medium rounded-md transition-colors ${
                                            activeTab === "tasks"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                        }`}
                                    >
                                        Tasks
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("libraries")}
                                        className={`px-4 py-2 text-xs font-medium rounded-md transition-colors ${
                                            activeTab === "libraries"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                        }`}
                                    >
                                        Libraries
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("domains")}
                                        className={`px-4 py-2 text-xs font-medium rounded-md transition-colors ${
                                            activeTab === "domains"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                        }`}
                                    >
                                        Domains
                                    </button>
                                </div>

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

                            {/* Main tab: Show featured tasks, parameters, and libraries */}
                            {activeTab === "main" && (
                                <div className="space-y-6">
                                    {/* Tasks Section */}
                                    <div>
                                        <h3 className="text-sm font-semibold mb-3">Tasks</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {featuredTaskKeys.map((taskKey) => {
                                                const task = Object.values(allTasks)
                                                    .flat()
                                                    .find((t) => t.key === taskKey)
                                                if (!task) return null
                                                const Icon = task.icon
                                                return (
                                                    <button
                                                        key={task.key}
                                                        onClick={() => setFilterTask(task.key)}
                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-colors border ${
                                                            filterTask === task.key
                                                                ? "bg-primary/10 text-primary border-primary/20"
                                                                : "bg-background border-border hover:bg-muted"
                                                        }`}
                                                    >
                                                        <Icon className={`h-3.5 w-3.5 ${task.color}`} />
                                                        {task.label}
                                                    </button>
                                                )
                                            })}
                                            {remainingTasks > 0 && (
                                                <button
                                                    onClick={() => setActiveTab("tasks")}
                                                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs transition-colors border bg-background border-border hover:bg-muted"
                                                >
                                                    <span>+{remainingTasks} more</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold mb-3">Domains</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {featuredDomainKeys.map((domainKey) => {
                                                const domain = domains.find((d) => d.key === domainKey)
                                                if (!domain) return null
                                                const Icon = domain.icon
                                                return (
                                                    <button
                                                        key={domain.key}
                                                        onClick={() => setFilterDomain(domain.label)}
                                                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors border text-left ${
                                                            filterDomain === domain.label
                                                                ? "bg-primary/10 text-primary border-primary/20"
                                                                : "bg-background border-border hover:bg-muted"
                                                        }`}
                                                    >
                                                        <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${domain.color}`} />
                                                        <span className="truncate">{domain.label}</span>
                                                    </button>
                                                )
                                            })}
                                            {remainingDomains > 0 && (
                                                <button
                                                    onClick={() => setActiveTab("domains")}
                                                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs transition-colors border bg-background border-border hover:bg-muted"
                                                >
                                                    <span>+{remainingDomains} more</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Parameters Section */}
                                    <div>
                                        <h3 className="text-sm font-semibold mb-3">Parameters</h3>
                                        <div className="space-y-3">
                                            <Slider
                                                value={parameterRange}
                                                onValueChange={setParameterRange}
                                                max={500}
                                                step={1}
                                                className="w-full"
                                            />
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>&lt; 1B</span>
                                                <span>6B</span>
                                                <span>12B</span>
                                                <span>32B</span>
                                                <span>128B</span>
                                                <span>&gt; 500B</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Libraries Section */}
                                    <div>
                                        <h3 className="text-sm font-semibold mb-3">Libraries</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {libraries.slice(0, 4).map((lib) => {
                                                const Icon = lib.icon
                                                return (
                                                    <button
                                                        key={lib.key}
                                                        onClick={() => setFilterFramework(lib.key)}
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
                                            {libraries.length > 4 && (
                                                <button
                                                    onClick={() => setActiveTab("libraries")}
                                                    className="px-3 py-1.5 rounded-md text-xs bg-background border border-border hover:bg-muted transition-colors"
                                                >
                                                    +{libraries.length - 4} more
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tasks tab: Show all tasks organized by categories */}
                            {activeTab === "tasks" && (
                                <div className="space-y-6">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Filter Tasks by name"
                                            className="pl-9 h-9 text-sm"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>

                                    {Object.entries(allTasks).map(([category, tasks]) => (
                                        <div key={category}>
                                            <h3 className="text-sm font-semibold mb-3 text-foreground">{category}</h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {tasks.map((task) => {
                                                    const Icon = task.icon
                                                    return (
                                                        <button
                                                            key={task.key}
                                                            onClick={() => {
                                                                setFilterTask(task.key)
                                                                setActiveTab("main")
                                                            }}
                                                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors border text-left ${
                                                                filterTask === task.key
                                                                    ? "bg-primary/10 text-primary border-primary/20"
                                                                    : "bg-background border-border hover:bg-muted"
                                                            }`}
                                                        >
                                                            <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${task.color}`} />
                                                            <span className="truncate">{task.label}</span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Libraries tab: Show all libraries */}
                            {activeTab === "libraries" && (
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-foreground">All Libraries</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {libraries.map((lib) => {
                                            const Icon = lib.icon
                                            return (
                                                <button
                                                    key={lib.key}
                                                    onClick={() => {
                                                        setFilterFramework(lib.key)
                                                        setActiveTab("main")
                                                    }}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors border text-left ${
                                                        filterFramework === lib.key
                                                            ? "bg-primary/10 text-primary border-primary/20"
                                                            : "bg-background border-border hover:bg-muted"
                                                    }`}
                                                >
                                                    <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${lib.color}`} />
                                                    <span className="truncate">{lib.label}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {activeTab === "domains" && (
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-foreground">All Domains</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {domains.map((domain) => {
                                            const Icon = domain.icon
                                            return (
                                                <button
                                                    key={domain.key}
                                                    onClick={() => {
                                                        setFilterDomain(domain.label)
                                                        setActiveTab("main")
                                                    }}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors border text-left ${
                                                        filterDomain === domain.label
                                                            ? "bg-primary/10 text-primary border-primary/20"
                                                            : "bg-background border-border hover:bg-muted"
                                                    }`}
                                                >
                                                    <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${domain.color}`} />
                                                    <span className="truncate">{domain.label}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                            <div className="pt-4 border-t border-border">
                                <p className="text-xs text-muted-foreground">
                                    Showing <span className="font-medium text-foreground">{filteredModels.length}</span> of{" "}
                                    <span className="font-medium text-foreground">{sampleModels.length}</span>
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
                                {sampleModels.length}
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
                                    <SelectItem value="trending">Trending</SelectItem>
                                    <SelectItem value="recent">Recent</SelectItem>
                                    <SelectItem value="most-downloads">Most Downloads</SelectItem>
                                    <SelectItem value="most-likes">Most Likes</SelectItem>
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
                                            <h3 className="text-sm font-semibold mb-3">Tasks</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {featuredTaskKeys.map((taskKey) => {
                                                    const task = Object.values(allTasks)
                                                        .flat()
                                                        .find((t) => t.key === taskKey)
                                                    if (!task) return null
                                                    const Icon = task.icon
                                                    return (
                                                        <button
                                                            key={task.key}
                                                            onClick={() => {
                                                                setFilterTask(task.key)
                                                                setIsMobileFilterOpen(false)
                                                            }}
                                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-colors border ${
                                                                filterTask === task.key
                                                                    ? "bg-primary/10 text-primary border-primary/20"
                                                                    : "bg-background border-border hover:bg-muted"
                                                            }`}
                                                        >
                                                            <Icon className={`h-3.5 w-3.5 ${task.color}`} />
                                                            {task.label}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* Libraries */}
                                        <div>
                                            <h3 className="text-sm font-semibold mb-3">Libraries</h3>
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

                                        {/* Domains */}
                                        <div>
                                            <h3 className="text-sm font-semibold mb-3">Domains</h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {domains.map((domain) => {
                                                    const Icon = domain.icon
                                                    return (
                                                        <button
                                                            key={domain.key}
                                                            onClick={() => {
                                                                setFilterDomain(domain.label)
                                                                setIsMobileFilterOpen(false)
                                                            }}
                                                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors border text-left ${
                                                                filterDomain === domain.label
                                                                    ? "bg-primary/10 text-primary border-primary/20"
                                                                    : "bg-background border-border hover:bg-muted"
                                                            }`}
                                                        >
                                                            <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${domain.color}`} />
                                                            <span className="truncate">{domain.label}</span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* Year Range */}
                                        <div>
                                            <h3 className="text-sm font-semibold mb-3">Year</h3>
                                            <div className="space-y-2">
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">From</p>
                                                    <Select value={selectedYearFrom} onValueChange={setSelectedYearFrom}>
                                                        <SelectTrigger className="bg-background border-border text-foreground h-8 text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-popover border-border">
                                                            <SelectItem value="All">All Years</SelectItem>
                                                            {years.map((year) => (
                                                                <SelectItem key={year} value={String(year)}>
                                                                    {year}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">To</p>
                                                    <Select value={selectedYearTo} onValueChange={setSelectedYearTo}>
                                                        <SelectTrigger className="bg-background border-border text-foreground h-8 text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-popover border-border">
                                                            <SelectItem value="All">All Years</SelectItem>
                                                            {years.map((year) => (
                                                                <SelectItem key={year} value={String(year)}>
                                                                    {year}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
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
                            {filteredModels.map((model, index) => {
                                const taskKey = model.task || model.model_type || "unknown"
                                const taskConfig = taskCategories[taskKey] || {
                                    label: taskKey,
                                    icon: FileText,
                                    color: "text-gray-500",
                                }
                                const TaskIcon = taskConfig.icon

                                return (
                                    <motion.div
                                        key={model.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <NextLink href={`/model/${model.id}`}>
                                        <Card className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                                            {/* Line 1: Title */}
                                            <div className="flex items-center gap-1">
                                                <IconBrandUnity className="h-4 w-4 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
                                                <h3 className="text-base font-normal font-sans truncate">{model.name || model.title}</h3>
                                            </div>
                                            {/* Line 2: Task → Updated → Views → Downloads → Likes */}
                                            <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded ${taskConfig.color || ""}`}>
                          <TaskIcon className="h-3 w-3" />
                            {taskConfig.label}
                        </span>
                                                <span className="text-neutral-500 dark:text-neutral-400">•</span>
                                                <span className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                          <HardDrive className="h-3 w-3" />
                                                    {formatSize(model.size || (model.model_size_mb ? model.model_size_mb * 1024 * 1024 : undefined))}
                        </span>
                                                <span className="text-neutral-500 dark:text-neutral-400">•</span>
                                                <span className="text-neutral-500 dark:text-neutral-400">Updated {model.updated || (model.updated_at ? new Date(model.updated_at).toLocaleDateString() : "")}</span>
                                                <span className="text-neutral-500 dark:text-neutral-400">•</span>
                                                <span className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                          <Download className="h-3 w-3" />
                                                    {formatNumber(model.downloads)}
                        </span>
                                                <span className="text-neutral-500 dark:text-neutral-400">•</span>
                                                <span className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                          <Eye className="h-3 w-3" />
                                                    {formatNumber(model.views)}
                        </span>
                                            </div>

                                            {/* Line 3: Domain → Framework (libraries) - truncate if needed */}
                                            <div className="flex items-center gap-2 text-xs truncate">
                                                {(model.domain || (model.keywords && model.keywords[0])) && (
                                                    <>
                                                        <span className="text-neutral-500 dark:text-neutral-400">
                                                            {model.domain || model.keywords[0]}
                                                        </span>
                                                        <span className="text-neutral-500 dark:text-neutral-400">•</span>
                                                    </>
                                                )}
                                                <span className="text-neutral-500 dark:text-neutral-400">{model.framework || ""}</span>
                                            </div>
                                        </Card>
                                        </NextLink>
                                    </motion.div>
                                )
                            })}
                        </div>

                        {filteredModels.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No models found matching your filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
