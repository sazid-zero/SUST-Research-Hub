"use client"

import { GlobalNavbar } from "@/components/global-navbar"
import { Card } from "@/components/ui/card"
import NextLink from "next/link"
import {
    Database,
    Search,
    X,
    ArrowUpDown,
    Download,
    Box,
    Mic,
    FileText,
    Map,
    ImageIcon,
    Table,
    Type,
    TrendingUp,
    Video,
    Eye,
    Filter,
    ExternalLink,
    Music,
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

const formatNumber = (num: number | undefined | null) => {
    if (num === undefined || num === null) return "0"
    if (num >= 1000) {
        return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "k"
    }
    return num.toString()
}

const modalities = [
    { key: "text", label: "Text", icon: Type, color: "text-green-600" },
    { key: "image", label: "Image", icon: ImageIcon, color: "text-pink-600" },
    { key: "tabular", label: "Tabular", icon: Table, color: "text-cyan-600" },
    { key: "audio", label: "Audio", icon: Mic, color: "text-purple-600" },
    { key: "video", label: "Video", icon: Video, color: "text-indigo-600" },
    { key: "geospatial", label: "Geospatial", icon: Map, color: "text-orange-600" },
    { key: "3d", label: "3D", icon: Box, color: "text-blue-600" },
    { key: "time-series", label: "Time Series", icon: TrendingUp, color: "text-amber-600" },
    { key: "multimodal", label: "Multimodal", icon: Database, color: "text-red-600" },
]

const modalityColors: Record<string, { icon: any; colorClass: string; bgClass: string; borderClass: string }> = {
    "3d": { icon: Box, colorClass: "text-blue-600", bgClass: "bg-blue-600/10", borderClass: "border-blue-600/20" },
    audio: { icon: Music, colorClass: "text-purple-600", bgClass: "bg-purple-600/10", borderClass: "border-purple-600/20" },
    geospatial: { icon: Map, colorClass: "text-emerald-600", bgClass: "bg-emerald-600/10", borderClass: "border-emerald-600/20" },
    image: { icon: ImageIcon, colorClass: "text-pink-600", bgClass: "bg-pink-600/10", borderClass: "border-pink-600/20" },
    tabular: { icon: Table, colorClass: "text-cyan-600", bgClass: "bg-cyan-600/10", borderClass: "border-cyan-600/20" },
    text: { icon: Type, colorClass: "text-green-600", bgClass: "bg-green-600/10", borderClass: "border-green-600/20" },
    "time-series": { icon: TrendingUp, colorClass: "text-amber-600", bgClass: "bg-amber-600/10", borderClass: "border-amber-600/20" },
    video: { icon: Video, colorClass: "text-indigo-600", bgClass: "bg-indigo-600/10", borderClass: "border-indigo-600/20" },
    multimodal: { icon: Database, colorClass: "text-red-600", bgClass: "bg-red-600/10", borderClass: "border-red-600/20" },
}

export default function DatasetsContent({ user, initialDatasets }: DatasetsContentProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterModality, setFilterModality] = useState("all")
    const [sortBy, setSortBy] = useState("newest")
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

    const datasets = initialDatasets || []

    const filteredDatasets = datasets.filter((dataset) => {
        const title = dataset.title || dataset.name || ""
        const desc = dataset.description || ""
        const matchesSearch =
            title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            desc.toLowerCase().includes(searchQuery.toLowerCase())

        const datasetType = (dataset.type || "").toLowerCase().replace(/\s+/g, "-")
        const normalizedFilter = filterModality.toLowerCase().replace(/\s+/g, "-")
        const matchesModality = filterModality === "all" || datasetType === normalizedFilter

        return matchesSearch && matchesModality
    })

    const sortedDatasets = [...filteredDatasets].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
            case "oldest":
                return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
            case "title":
                return (a.title || "").localeCompare(b.title || "")
            default:
                return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        }
    })

    const clearFilters = () => {
        setSearchQuery("")
        setFilterModality("all")
    }

    const hasActiveFilters = searchQuery !== "" || filterModality !== "all"

    return (
        <div className="min-h-screen bg-background overflow-x-hidden">
            <GlobalNavbar user={user} />

            <div className="mx-auto max-w-[83.5rem] px-4 lg:px-8 pb-12 mt-8">
                <div className="grid gap-6 lg:gap-8 lg:grid-cols-[280px_1fr]">
                    {/* Desktop Sidebar Filters */}
                    <div className="hidden lg:block">
                        <Card
                            className="border border-border bg-card p-6 pt-6 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-scroll scrollbar-hide"
                            style={{ scrollbarGutter: "stable" }}
                        >
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
                                {/* Modalities */}
                                <div>
                                    <h3 className="text-sm font-semibold mb-3">Modality</h3>
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
                                                    onClick={() =>
                                                        setFilterModality(
                                                            filterModality === modality.key ? "all" : modality.key
                                                        )
                                                    }
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
                            </div>

                            <div className="pt-4 mt-4 border-t border-border">
                                <p className="text-xs text-muted-foreground">
                                    Showing <span className="font-semibold text-foreground">{sortedDatasets.length}</span> of{" "}
                                    <span className="font-semibold text-foreground">{datasets.length}</span>
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
                                {datasets.length}
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
                                        {/* Modalities */}
                                        <div>
                                            <h3 className="text-sm font-semibold mb-3">Modality</h3>
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

                        {sortedDatasets.length > 0 ? (
                            <motion.div
                                className="grid gap-x-4 gap-y-6 sm:grid-cols-1"
                                style={{ gridTemplateColumns: "repeat(auto-fit, minmax(412px, 1fr))" }}
                            >
                                {sortedDatasets.map((dataset, index) => (
                                    <motion.div
                                        key={dataset.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="group cursor-pointer min-w-0"
                                    >
                                        <div className="space-y-2 border border-border rounded-lg p-4 hover:border-primary/50 transition-colors min-w-0">
                                            <h3 className="text-sm font-semibold font-sans text-foreground group-hover:text-primary transition-colors flex items-center gap-1 flex-nowrap min-w-0">
                                                <IconBrandDatabricks className="h-4 w-4 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
                                                <span className="truncate">{dataset.title || dataset.name}</span>
                                                {dataset.location && (
                                                    <a
                                                        href={dataset.location}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ml-auto flex-shrink-0 text-muted-foreground hover:text-primary"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                    </a>
                                                )}
                                            </h3>
                                            {dataset.description && (
                                                <p className="text-xs text-muted-foreground line-clamp-2">
                                                    {dataset.description}
                                                </p>
                                            )}
                                            <div className="flex items-center flex-wrap gap-x-[5px] gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                {(() => {
                                                    const dataType = (dataset.type || "").toLowerCase()
                                                    const modalityInfo = modalityColors[dataType] || {
                                                        icon: IconChartBubble,
                                                        colorClass: "text-primary",
                                                        bgClass: "bg-primary/10",
                                                        borderClass: "border-primary/20",
                                                    }
                                                    const ModalityIcon = modalityInfo.icon
                                                    return dataset.type ? (
                                                        <span
                                                            className={`flex items-center gap-1 ${modalityInfo.bgClass} ${modalityInfo.colorClass} border ${modalityInfo.borderClass} px-2 py-0.5 rounded-md capitalize`}
                                                        >
                                                            <ModalityIcon className="h-3 w-3" />
                                                            {dataset.type}
                                                        </span>
                                                    ) : null
                                                })()}
                                                {dataset.size && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{dataset.size}</span>
                                                    </>
                                                )}
                                                {dataset.tags && dataset.tags.length > 0 && (
                                                    <>
                                                        <span>•</span>
                                                        {dataset.tags.slice(0, 3).map((tag: string, i: number) => (
                                                            <span key={i} className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </>
                                                )}
                                                <span>•</span>
                                                <span>
                                                    {dataset.created_at
                                                        ? new Date(dataset.created_at).toLocaleDateString()
                                                        : ""}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <Card className="border border-border bg-card p-8 text-center">
                                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                                <h3 className="text-sm font-semibold text-foreground mb-1">
                                    {datasets.length === 0 ? "No datasets yet" : "No datasets found"}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    {datasets.length === 0
                                        ? "Datasets added from research workspaces will appear here."
                                        : "Try adjusting your search or filters."}
                                </p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
