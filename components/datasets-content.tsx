"use client"

import { GlobalNavbar } from "@/components/global-navbar"
import { Card } from "@/components/ui/card"
import { Database, Search, X, ArrowUpDown, Rows3, Download, Heart } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { IconBrandDatabricks, IconChartBubble } from "@tabler/icons-react"

interface DatasetsContentProps {
    user: any
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
]

const formatNumber = (num: number) => {
    if (num >= 1000) {
        return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "k"
    }
    return num.toString()
}

export default function DatasetsContent({ user }: DatasetsContentProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterModality, setFilterModality] = useState("all")
    const [selectedYearFrom, setSelectedYearFrom] = useState("All")
    const [selectedYearTo, setSelectedYearTo] = useState("All")
    const [sortBy, setSortBy] = useState("trending")

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i)

    const filteredDatasets = sampleDatasets.filter((dataset) => {
        const matchesSearch = dataset.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesModality = filterModality === "all" || dataset.modality === filterModality
        return matchesSearch && matchesModality
    })

    const clearFilters = () => {
        setSearchQuery("")
        setFilterModality("all")
        setSelectedYearFrom("All")
        setSelectedYearTo("All")
    }

    const hasActiveFilters =
        searchQuery !== "" || filterModality !== "all" || selectedYearFrom !== "All" || selectedYearTo !== "All"

    return (
        <div className="min-h-screen bg-background">
            <GlobalNavbar user={user} />

            <div className="mx-auto lg:mx-22 sm:mx-20 px-4 lg:px-8 pt-6 pb-12 mt-2">
                <div className="grid gap-6 lg:gap-8 lg:grid-cols-4">
                    {/* Desktop Sidebar Filters */}
                    <div className="hidden lg:block lg:col-span-1">
                        <Card className="border border-border bg-card p-6 sticky top-20">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-sm font-bold text-foreground">Filters</h2>
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

                            <div className="space-y-4">
                                <div>
                                    <Label className="text-xs text-foreground font-medium mb-2 block">Modality</Label>
                                    <Select value={filterModality} onValueChange={setFilterModality}>
                                        <SelectTrigger className="bg-background border-border text-foreground h-8 text-xs">
                                            <SelectValue placeholder="All Modalities" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border-border">
                                            <SelectItem value="all">All Modalities</SelectItem>
                                            <SelectItem value="Image">Image</SelectItem>
                                            <SelectItem value="Tabular">Tabular</SelectItem>
                                            <SelectItem value="Text">Text</SelectItem>
                                            <SelectItem value="3D">3D</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-xs text-foreground font-medium mb-3 block">Year</Label>
                                    <div className="flex gap-4">
                                        <div className="flex gap-1 items-center">
                                            <p className="text-xs text-muted-foreground mb-1">From</p>
                                            <Select value={selectedYearFrom} onValueChange={setSelectedYearFrom}>
                                                <SelectTrigger className="bg-background border-border text-foreground h-8 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-popover border-border">
                                                    <SelectItem value="All">All</SelectItem>
                                                    {years.map((year) => (
                                                        <SelectItem key={year} value={String(year)}>
                                                            {year}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex gap-1 items-center">
                                            <p className="text-xs text-muted-foreground mb-1">To</p>
                                            <Select value={selectedYearTo} onValueChange={setSelectedYearTo}>
                                                <SelectTrigger className="bg-background border-border text-foreground h-8 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-popover border-border">
                                                    <SelectItem value="All">All</SelectItem>
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

                                <div className="pt-4 border-t border-border">
                                    <p className="text-xs text-muted-foreground">
                                        Showing <span className="font-semibold text-foreground">{filteredDatasets.length}</span> of{" "}
                                        <span className="font-semibold text-foreground">{sampleDatasets.length}</span>
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3 space-y-4">
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

                        {filteredDatasets.length > 0 ? (
                            <motion.div
                                className="grid gap-x-10 gap-y-6 sm:grid-cols-1 mt-10"
                                style={{ gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))" }}
                            >
                                {filteredDatasets.map((dataset, index) => (
                                    <motion.div
                                        key={dataset.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="group cursor-pointer"
                                    >
                                        <div className="space-y-2 border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                                            <h3 className="text-base font-normal font-sans text-foreground group-hover:text-primary transition-colors flex items-center gap-1 flex-nowrap min-w-0">
                                                <IconBrandDatabricks className="h-4 w-4 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
                                                <span className="truncate">{dataset.name}</span>
                                            </h3>
                                            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                        <span className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md">
                          <IconChartBubble className="h-3 w-3 ml-1" />
                            {dataset.modality}
                        </span>
                                                <span>•</span>
                                                <span>Updated {dataset.updated}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                          <Rows3 className="h-3 w-3" />
                                                    {formatNumber(dataset.views)}
                        </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                                                    {formatNumber(dataset.downloads)}
                        </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                                                    {formatNumber(dataset.likes)}
                        </span>
                                            </div>
                                        </div>
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
