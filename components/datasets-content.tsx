"use client"

import { GlobalNavbar } from "@/components/global-navbar"
import { Card } from "@/components/ui/card"
import { Database, Search, X, ArrowUpDown } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

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
]

export default function DatasetsContent({ user }: DatasetsContentProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterModality, setFilterModality] = useState("all")
    const [sortBy, setSortBy] = useState("trending")

    const filteredDatasets = sampleDatasets.filter((dataset) => {
        const matchesSearch = dataset.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesModality = filterModality === "all" || dataset.modality === filterModality
        return matchesSearch && matchesModality
    })

    const clearFilters = () => {
        setSearchQuery("")
        setFilterModality("all")
    }

    const hasActiveFilters = searchQuery !== "" || filterModality !== "all"

    return (
        <div className="min-h-screen bg-background">
            <GlobalNavbar user={user} />

            <div className="mx-auto lg:mx-22 px-4 lg:px-8 pt-6 pb-12 mt-2">
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
                                        <SelectTrigger className="bg-background border-border text-foreground h-8 text-sm">
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

                        {/* Datasets Grid - 2 columns on lg */}
                        {filteredDatasets.length > 0 ? (
                            <motion.div className="grid gap-3 md:grid-cols-2">
                                {filteredDatasets.map((dataset, index) => (
                                    <motion.div
                                        key={dataset.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <div className="border border-border hover:border-primary/50 rounded-lg p-4 transition-all hover:shadow-sm group cursor-pointer">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-muted-foreground flex-shrink-0">
                                                    <Database className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                                        {dataset.name}
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground">{dataset.modality}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 text-xs text-muted-foreground">
                                                <span>Updated {dataset.updated}</span>
                                                <span>👁️ {dataset.views}</span>
                                                <span>⬇️ {dataset.downloads}</span>
                                                <span>👍 {dataset.likes}</span>
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
