"use client"

import { GlobalNavbar } from "@/components/global-navbar"
import { Card } from "@/components/ui/card"
// Components
import NextLink from "next/link"
import {
    Database,
    Search,
    X,
    ArrowUpDown,
    Download,
    Heart,
    Box,
    Mic,
    FileText,
    Map,
    ImageIcon,
    Table,
    Type,
    TrendingUp,
    Video,
    Sparkles,
    Bot,
    MessageSquare,
    Brain,
    Wand2,
    Grid3x3,
    TableIcon,
    Link,
    Ear, AudioLines, Layers, Network, Languages, Package, Globe, FileJson, FileSpreadsheet, Folder, Music, Eye, Filter,
} from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { IconBrandDatabricks, IconChartBubble } from "@tabler/icons-react"

interface DatasetsContentProps {
    user: any
    initialDatasets?: any[]
}

const sampleDatasets = [
    {
        id: 1,
        name: "Medical Imaging Dataset",
        modality: "Image",
        format: "dicom",
        views: 3421,
        downloads: 1203,
        likes: 342,
        updated: "2 days ago",
    },
    {
        id: 2,
        name: "Climate Data 2020-2024",
        modality: "Tabular",
        format: "csv",
        views: 2156,
        downloads: 876,
        likes: 198,
        updated: "5 days ago",
    },
    {
        id: 3,
        name: "Natural Language Corpus",
        modality: "Text",
        format: "json",
        views: 4521,
        downloads: 1567,
        likes: 512,
        updated: "1 day ago",
    },
    {
        id: 4,
        name: "3D Point Cloud Objects",
        modality: "3D",
        format: "parquet",
        views: 1876,
        downloads: 634,
        likes: 156,
        updated: "3 days ago",
    },
    {
        id: 5,
        name: "TuringEnterprises/Turing-Open-Reasoning",
        modality: "Audio",
        format: "parquet",
        views: 1876,
        downloads: 634,
        likes: 156,
        updated: "3 days ago",
    },
    {
        id: 6,
        name: "open-thoughts/OpenThoughts-Agent-v1-SFT",
        modality: "Tabular",
        format: "parquet",
        views: 1876,
        downloads: 634,
        likes: 156,
        updated: "3 days ago",
    },
    {
        id: 7,
        name: "natolambert/GeneralThought-430K-filtered3D Point Cloud Objects",
        modality: "Video",
        format: "parquet",
        views: 1876,
        downloads: 634,
        likes: 156,
        updated: "3 days ago",
    },
    {
        id: 8,
        name: "OSS-forge/Extended_Shellcode_IA323D Point Cloud Objects",
        modality: "Geospatial",
        format: "parquet",
        views: 1876,
        downloads: 634,
        likes: 156,
        updated: "3 days ago",
    },
    {
        id: 9,
        name: "builddotai/Egocentric-100K",
        modality: "Time Series",
        format: "parquet",
        views: 1876,
        downloads: 634,
        likes: 156,
        updated: "3 days ago",
    },
    {
        id: 10,
        name: "TeichAI/claude-4.5-opus-high-reasoning-250x",
        modality: "Tabular",
        format: "parquet",
        views: 1876,
        downloads: 634,
        likes: 156,
        updated: "3 days ago",
    },
    {
        id: 11,
        name: "Satellite Imagery Dataset",
        modality: "Image",
        format: "parquet",
        views: 2543,
        downloads: 892,
        likes: 267,
        updated: "1 week ago",
    },
    {
        id: 12,
        name: "Financial Time Series Data",
        modality: "Tabular",
        format: "csv",
        views: 1654,
        downloads: 543,
        likes: 189,
        updated: "4 days ago",
    },
]

const formatNumber = (num: number | undefined | null) => {
    if (num === undefined || num === null) return "0"
    if (num >= 1000) {
        return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "k"
    }
    return num.toString()
}

const allTasks = {
    multimodal: [
        { key: "audio-text-to-text", label: "Audio-Text-to-Text", icon: AudioLines, color: "text-orange-600" },
        { key: "image-text-to-text", label: "Image-Text-to-Text", icon: ImageIcon, color: "text-orange-600" },
        {
            key: "visual-question-answering",
            label: "Visual Question Answering",
            icon: Eye,
            color: "text-orange-600",
        },
        {
            key: "document-question-answering",
            label: "Document Question Answering",
            icon: FileText,
            color: "text-orange-600",
        },
        { key: "video-text-to-text", label: "Video-Text-to-Text", icon: Video, color: "text-orange-600" },
        { key: "visual-document-retrieval", label: "Visual Document Retrieval", icon: Search, color: "text-orange-600" },
        { key: "any-to-any", label: "Any-to-Any", icon: Sparkles, color: "text-orange-600" },
    ],
    "computer-vision": [
        { key: "depth-estimation", label: "Depth Estimation", icon: Layers, color: "text-blue-600" },
        { key: "image-classification", label: "Image Classification", icon: ImageIcon, color: "text-blue-600" },
        { key: "object-detection", label: "Object Detection", icon: Grid3x3, color: "text-blue-600" },
        { key: "image-segmentation", label: "Image Segmentation", icon: Layers, color: "text-blue-600" },
        { key: "text-to-image", label: "Text-to-Image", icon: Wand2, color: "text-blue-600" },
        { key: "image-to-text", label: "Image-to-Text", icon: FileText, color: "text-blue-600" },
        { key: "image-to-image", label: "Image-to-Image", icon: ImageIcon, color: "text-blue-600" },
        { key: "image-to-video", label: "Image-to-Video", icon: Video, color: "text-blue-600" },
        {
            key: "unconditional-image-generation",
            label: "Unconditional Image Generation",
            icon: Sparkles,
            color: "text-blue-600",
        },
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
        { key: "text-to-3d", label: "Text-to-3D", icon: Box, color: "text-blue-600" },
        { key: "image-to-3d", label: "Image-to-3D", icon: Box, color: "text-blue-600" },
        { key: "image-feature-extraction", label: "Image Feature Extraction", icon: Network, color: "text-blue-600" },
        { key: "keypoint-detection", label: "Keypoint Detection", icon: Grid3x3, color: "text-blue-600" },
        { key: "video-to-video", label: "Video-to-Video", icon: Video, color: "text-blue-600" },
    ],
    nlp: [
        { key: "text-classification", label: "Text Classification", icon: FileText, color: "text-green-600" },
        { key: "token-classification", label: "Token Classification", icon: FileText, color: "text-green-600" },
        { key: "table-question-answering", label: "Table Question Answering", icon: TableIcon, color: "text-green-600" },
        { key: "question-answering", label: "Question Answering", icon: MessageSquare, color: "text-green-600" },
        { key: "zero-shot-classification", label: "Zero-Shot Classification", icon: Sparkles, color: "text-green-600" },
        { key: "translation", label: "Translation", icon: Languages, color: "text-green-600" },
        { key: "summarization", label: "Summarization", icon: FileText, color: "text-green-600" },
        { key: "feature-extraction", label: "Feature Extraction", icon: Network, color: "text-green-600" },
        { key: "text-generation", label: "Text Generation", icon: MessageSquare, color: "text-green-600" },
        { key: "fill-mask", label: "Fill-Mask", icon: FileText, color: "text-green-600" },
        { key: "sentence-similarity", label: "Sentence Similarity", icon: Link, color: "text-green-600" },
        { key: "text-ranking", label: "Text Ranking", icon: ArrowUpDown, color: "text-green-600" },
    ],
    audio: [
        { key: "text-to-speech", label: "Text-to-Speech", icon: Mic, color: "text-purple-600" },
        { key: "text-to-audio", label: "Text-to-Audio", icon: AudioLines, color: "text-purple-600" },
        { key: "automatic-speech-recognition", label: "Automatic Speech Recognition", icon: Ear, color: "text-purple-600" },
        { key: "audio-to-audio", label: "Audio-to-Audio", icon: AudioLines, color: "text-purple-600" },
        { key: "audio-classification", label: "Audio Classification", icon: AudioLines, color: "text-purple-600" },
        { key: "voice-activity-detection", label: "Voice Activity Detection", icon: Mic, color: "text-purple-600" },
    ],
    tabular: [
        { key: "tabular-classification", label: "Tabular Classification", icon: TableIcon, color: "text-cyan-600" },
        { key: "tabular-regression", label: "Tabular Regression", icon: TableIcon, color: "text-cyan-600" },
        { key: "time-series-forecasting", label: "Time Series Forecasting", icon: ArrowUpDown, color: "text-cyan-600" },
    ],
    rl: [
        { key: "reinforcement-learning", label: "Reinforcement Learning", icon: Brain, color: "text-pink-600" },
        { key: "robotics", label: "Robotics", icon: Bot, color: "text-pink-600" },
    ],
    other: [{ key: "graph-machine-learning", label: "Graph Machine Learning", icon: Network, color: "text-gray-600" }],
}

const featuredTaskKeys = [
    "text-generation",
    "image-text-to-text",
    "image-to-image",
    "text-to-video",
    "text-to-speech",
    "any-to-any",
]

const datasetLibraries = [
    { key: "datasets", label: "Datasets", icon: Database, color: "text-yellow-600" },
    { key: "croissant", label: "Croissant", icon: Package, color: "text-orange-600" },
    { key: "polars", label: "Polars", icon: Sparkles, color: "text-blue-600" },
    { key: "pandas", label: "pandas", icon: Table, color: "text-green-600" },
    { key: "dask", label: "Dask", icon: Layers, color: "text-red-600" },
    { key: "webdataset", label: "WebDataset", icon: Globe, color: "text-cyan-600" },
    { key: "distilabel", label: "Distilabel", icon: Bot, color: "text-purple-600" },
    { key: "argilla", label: "Argilla", icon: FileText, color: "text-orange-500" },
    { key: "fiftyone", label: "FiftyOne", icon: ImageIcon, color: "text-blue-500" },
]

const modalities = [
    { key: "3d", label: "3D", icon: Box, color: "text-blue-600" },
    { key: "audio", label: "Audio", icon: Mic, color: "text-purple-600" },
    { key: "document", label: "Document", icon: FileText, color: "text-red-600" },
    { key: "geospatial", label: "Geospatial", icon: Map, color: "text-orange-600" },
    { key: "image", label: "Image", icon: ImageIcon, color: "text-green-600" },
    { key: "tabular", label: "Tabular", icon: Table, color: "text-gray-600" },
    { key: "text", label: "Text", icon: Type, color: "text-red-700" },
    { key: "time-series", label: "Time-series", icon: TrendingUp, color: "text-orange-700" },
    { key: "video", label: "Video", icon: Video, color: "text-blue-700" },
]

const formats = [
    { key: "json", label: "json", icon: FileJson },
    { key: "csv", label: "csv", icon: FileSpreadsheet },
    { key: "parquet", label: "parquet", icon: Package },
    { key: "imagefolder", label: "imagefolder", icon: Folder },
    { key: "soundfolder", label: "soundfolder", icon: Music },
    { key: "webdataset", label: "webdataset", icon: Globe },
    { key: "text", label: "text", icon: Type },
    { key: "arrow", label: "arrow", icon: ArrowUpDown },
]

const modalityColors: Record<string, { icon: any; colorClass: string; bgClass: string; borderClass: string }> = {
    "3D": {
        icon: Box,
        colorClass: "text-blue-600",
        bgClass: "bg-blue-600/10",
        borderClass: "border-blue-600/20",
    },
    Audio: {
        icon: Music,
        colorClass: "text-purple-600",
        bgClass: "bg-purple-600/10",
        borderClass: "border-purple-600/20",
    },
    Document: {
        icon: FileText,
        colorClass: "text-orange-600",
        bgClass: "bg-orange-600/10",
        borderClass: "border-orange-600/20",
    },
    Geospatial: {
        icon: Map,
        colorClass: "text-blue-600",
        bgClass: "bg-blue-600/10",
        borderClass: "border-blue-600/20",
    },
    Image: {
        icon: ImageIcon,
        colorClass: "text-blue-600",
        bgClass: "bg-blue-600/10",
        borderClass: "border-blue-600/20",
    },
    Tabular: {
        icon: Table,
        colorClass: "text-cyan-600",
        bgClass: "bg-cyan-600/10",
        borderClass: "border-cyan-600/20",
    },
    Text: {
        icon: Type,
        colorClass: "text-green-600",
        bgClass: "bg-green-600/10",
        borderClass: "border-green-600/20",
    },
    "Time Series": {
        icon: TrendingUp,
        colorClass: "text-cyan-600",
        bgClass: "bg-cyan-600/10",
        borderClass: "border-cyan-600/20",
    },
    Video: {
        icon: Video,
        colorClass: "text-blue-600",
        bgClass: "bg-blue-600/10",
        borderClass: "border-blue-600/20",
    },
}

const domains = [
    { key: "computer-vision", label: "Computer Vision", icon: Eye, color: "text-blue-600" },
    { key: "natural-language", label: "Natural Language", icon: MessageSquare, color: "text-green-600" },
    { key: "audio-processing", label: "Audio Processing", icon: AudioLines, color: "text-purple-600" },
    { key: "medical-imaging", label: "Medical Imaging", icon: Heart, color: "text-red-600" },
    { key: "geospatial", label: "Geospatial Data", icon: Map, color: "text-orange-600" },
    { key: "finance", label: "Finance", icon: TrendingUp, color: "text-yellow-600" },
    { key: "climate", label: "Climate", icon: Globe, color: "text-cyan-600" },
    { key: "biology", label: "Biology", icon: Bot, color: "text-pink-600" },
]

const featuredDomainKeys = ["computer-vision", "natural-language", "audio-processing", "medical-imaging"]

export default function DatasetsContent({ user, initialDatasets }: DatasetsContentProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterModality, setFilterModality] = useState("all")
    const [filterTask, setFilterTask] = useState("all")
    const [filterLibrary, setFilterLibrary] = useState("all")
    const [filterFormat, setFilterFormat] = useState("all")
    const [filterDomain, setFilterDomain] = useState("all")
    const [selectedYearFrom, setSelectedYearFrom] = useState("All")
    const [selectedYearTo, setSelectedYearTo] = useState("All")
    const [sortBy, setSortBy] = useState("trending")
    const [activeTab, setActiveTab] = useState<"main" | "tasks" | "libraries" | "domains">("main")
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

    // Use real datasets if provided, otherwise fallback to sample data
    const datasets = initialDatasets && initialDatasets.length > 0 ? initialDatasets : sampleDatasets

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i)

    const totalTasks = Object.values(allTasks).flat().length
    const remainingTasks = totalTasks - featuredTaskKeys.length
    const remainingDomains = domains.length - featuredDomainKeys.length

    const filteredDatasets = datasets.filter((dataset) => {
        const name = dataset.name || dataset.title || ""
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase())
        const datasetType = dataset.modality || dataset.dataset_type || ""
        const matchesModality = filterModality === "all" || datasetType === filterModality
        const format = dataset.format || dataset.file_format || ""
        const matchesFormat = filterFormat === "all" || format === filterFormat
        const matchesTask = filterTask === "all" || datasetType === filterTask
        const matchesLibrary = filterLibrary === "all"
        const matchesDomain = filterDomain === "all"
        return matchesSearch && matchesModality && matchesFormat && matchesTask && matchesLibrary && matchesDomain
    })

    const clearFilters = () => {
        setSearchQuery("")
        setFilterModality("all")
        setFilterTask("all")
        setFilterLibrary("all")
        setFilterFormat("all")
        setFilterDomain("all")
        setSelectedYearFrom("All")
        setSelectedYearTo("All")
    }

    const hasActiveFilters =
        searchQuery !== "" ||
        filterModality !== "all" ||
        filterTask !== "all" ||
        filterLibrary !== "all" ||
        filterFormat !== "all" ||
        filterDomain !== "all" ||
        selectedYearFrom !== "All" ||
        selectedYearTo !== "All"

    return (
        <div className="min-h-screen bg-background overflow-x-hidden">
            <GlobalNavbar user={user} />

            <div className="mx-auto max-w-[83.5rem] px-4 lg:px-8 pb-12 mt-8">
                <div className="grid gap-6 lg:gap-8 lg:grid-cols-[400px_1fr]">
                    {/* Desktop Sidebar Filters */}
                    <div className="hidden lg:block">
                        <Card
                            className="border border-border bg-card p-6 pt-6 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-scroll scrollbar-hide"
                            style={{ scrollbarGutter: "stable" }}
                        >
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

                            {activeTab === "main" && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-semibold mb-3">Modalities</h3>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => setFilterModality("all")}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-colors border ${
                                                    filterModality === "all"
                                                        ? "bg-primary/10 text-primary border-primary/20"
                                                        : "bg-background border-border hover:bg-muted"
                                                }`}
                                            >
                                                All
                                            </button>
                                            {modalities.map((modality) => {
                                                const Icon = modality.icon
                                                return (
                                                    <button
                                                        key={modality.key}
                                                        onClick={() => setFilterModality(filterModality === modality.key ? "all" : modality.key)}
                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-colors border ${
                                                            filterModality === modality.key
                                                                ? "bg-primary/10 text-primary border-primary/20"
                                                                : "bg-background border-border hover:bg-muted"
                                                        }`}
                                                    >
                                                        <Icon className={`h-3.5 w-3.5 ${modality.color}`} />
                                                        {modality.label}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold mb-3">Domains</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => setFilterDomain("all")}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors border text-left ${
                                                    filterDomain === "all"
                                                        ? "bg-primary/10 text-primary border-primary/20"
                                                        : "bg-background border-border hover:bg-muted"
                                                }`}
                                            >
                                                All
                                            </button>
                                            {featuredDomainKeys.map((domainKey) => {
                                                const domain = domains.find((d) => d.key === domainKey)
                                                if (!domain) return null
                                                const Icon = domain.icon
                                                return (
                                                    <button
                                                        key={domain.key}
                                                        onClick={() => setFilterDomain(filterDomain === domain.label ? "all" : domain.label)}
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

                                    <div>
                                        <h3 className="text-sm font-medium mb-3">Format</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => setFilterFormat("all")}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors border ${
                                                    filterFormat === "all"
                                                        ? "bg-primary/10 text-primary border-primary/20"
                                                        : "bg-background border-border hover:bg-muted"
                                                }`}
                                            >
                                                All
                                            </button>
                                            {formats.map((format) => {
                                                const Icon = format.icon
                                                return (
                                                    <button
                                                        key={format.key}
                                                        onClick={() => setFilterFormat(filterFormat === format.key ? "all" : format.key)}
                                                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors border ${
                                                            filterFormat === format.key
                                                                ? "bg-primary/10 text-primary border-primary/20"
                                                                : "bg-background border-border hover:bg-muted"
                                                        }`}
                                                    >
                                                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                                                        {format.label}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "tasks" && (
                                <div className="space-y-4">
                                    <Input placeholder="Filter Tasks by name" className="text-xs h-9 bg-background" />

                                    {Object.entries(allTasks).map(([category, tasks]) => (
                                        <div key={category}>
                                            <h3 className="text-sm font-semibold text-foreground mb-2 capitalize">
                                                {category.replace("-", " ")}
                                            </h3>
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

                            {activeTab === "libraries" && (
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-foreground">All Libraries</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {datasetLibraries.map((lib) => {
                                            const Icon = lib.icon
                                            return (
                                                <button
                                                    key={lib.key}
                                                    onClick={() => {
                                                        setFilterLibrary(lib.key)
                                                        setActiveTab("main")
                                                    }}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors border text-left ${
                                                        filterLibrary === lib.key
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
                                    Showing <span className="font-semibold text-foreground">{filteredDatasets.length}</span> of{" "}
                                    <span className="font-semibold text-foreground">{sampleDatasets.length}</span>
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="space-y-4">
                        {/* Search and Sort Bar */}
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground dark:text-foreground whitespace-nowrap mr-2">
                                <p className="font-semibold text-lg">Datasets </p>
                                {sampleDatasets.length}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="relative">
                                    <Database className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
                                    <Input
                                        placeholder="Search datasets..."
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
                                    <SelectItem value="downloads">Most Downloaded</SelectItem>
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
                                        {/* Modalities */}
                                        <div>
                                            <h3 className="text-sm font-semibold mb-3">Modalities</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {modalities.map((modality) => {
                                                    const Icon = modality.icon
                                                    return (
                                                        <button
                                                            key={modality.key}
                                                            onClick={() => {
                                                                setFilterModality(modality.key)
                                                                setIsMobileFilterOpen(false)
                                                            }}
                                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-colors border ${
                                                                filterModality === modality.key
                                                                    ? "bg-primary/10 text-primary border-primary/20"
                                                                    : "bg-background border-border hover:bg-muted"
                                                            }`}
                                                        >
                                                            <Icon className={`h-3.5 w-3.5 ${modality.color}`} />
                                                            {modality.label}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* Format */}
                                        <div>
                                            <h3 className="text-sm font-semibold mb-3">Format</h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {formats.map((format) => {
                                                    const Icon = format.icon
                                                    return (
                                                        <button
                                                            key={format.key}
                                                            onClick={() => {
                                                                setFilterFormat(format.key)
                                                                setIsMobileFilterOpen(false)
                                                            }}
                                                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors border ${
                                                                filterFormat === format.key
                                                                    ? "bg-primary/10 text-primary border-primary/20"
                                                                    : "bg-background border-border hover:bg-muted"
                                                            }`}
                                                        >
                                                            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                                                            {format.label}
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

                        {filteredDatasets.length > 0 ? (
                            <motion.div
                                className="grid gap-x-4 gap-y-6 sm:grid-cols-1"
                                /* slightly smaller min width to avoid reflow on small gutter changes */
                                style={{ gridTemplateColumns: "repeat(auto-fit, minmax(412px, 1fr))" }}
                            >
                                {filteredDatasets.map((dataset, index) => (
                                    <motion.div
                                        key={dataset.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        /* ensure item can shrink and not force the grid wider */
                                        className="group cursor-pointer min-w-0"
                                    >
                                        <NextLink href={`/dataset/${dataset.id}`}>
                                        <div className="space-y-2 border border-border rounded-lg p-4 hover:border-primary/50 transition-colors min-w-0">
                                            <h3 className="text-sm font-semibold font-sans text-foreground group-hover:text-primary transition-colors flex items-center gap-1 flex-nowrap min-w-0">
                                                <IconBrandDatabricks className="h-4 w-4 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
                                                <span className="truncate">{dataset.name || dataset.title}</span>
                                            </h3>
                                            <div className="flex items-center flex-wrap gap-x-[5px] gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                {(() => {
                                                    const modality = dataset.modality || dataset.dataset_type
                                                    const modalityInfo = modalityColors[modality] || {
                                                        icon: IconChartBubble,
                                                        colorClass: "text-primary",
                                                        bgClass: "bg-primary/10",
                                                        borderClass: "border-primary/20",
                                                    }
                                                    const ModalityIcon = modalityInfo.icon
                                                    return (
                                                        <span
                                                            className={`flex items-center gap-1 ${modalityInfo.bgClass} ${modalityInfo.colorClass} border ${modalityInfo.borderClass} px-2 py-0.5 rounded-md`}
                                                        >
                              <ModalityIcon className="h-3 w-3" />
                                                            {modality}
                            </span>
                                                    )
                                                })()}
                                                <span>•</span>
                                                <span>Updated {dataset.updated || (dataset.updated_at ? new Date(dataset.updated_at).toLocaleDateString() : "")}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                                                    {formatNumber(dataset.views)}
                        </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                                                    {formatNumber(dataset.downloads)}
                        </span>
                                            </div>
                                        </div>
                                        </NextLink>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <Card className="border border-border bg-card p-8 text-center">
                                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                                <h3 className="text-sm font-semibold text-foreground mb-1">No datasets found</h3>
                                <p className="text-xs text-muted-foreground">Try adjusting your search</p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
