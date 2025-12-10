"use client"

import { GlobalNavbar } from "@/components/global-navbar"
import { Card } from "@/components/ui/card"
import { FileText, Search, X, ArrowUpDown } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

interface PapersContentProps {
    user: any
}

const samplePapers = [
    {
        id: 1,
        title: "Deep Learning for Medical Image Analysis",
        authors: ["Dr. Ahmed", "Student X"],
        journal: "IEEE Transactions on Medical Imaging",
        year: 2024,
        doi: "10.1109/TMI.2024.123456",
        views: 1250,
        downloads: 342,
        likes: 89,
        type: "journal",
    },
    {
        id: 2,
        title: "Optimization Methods in Machine Learning",
        authors: ["Dr. Sarah", "Student Y"],
        journal: "NeurIPS 2024",
        year: 2024,
        doi: "10.48550/arXiv.2401.12345",
        views: 890,
        downloads: 256,
        likes: 145,
        type: "conference",
    },
]

export function PapersContent({ user }: PapersContentProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterType, setFilterType] = useState("all")
    const [sortBy, setSortBy] = useState("trending")

    const filteredPapers = samplePapers.filter((paper) => {
        const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = filterType === "all" || paper.type === filterType
        return matchesSearch && matchesType
    })

    const clearFilters = () => {
        setSearchQuery("")
        setFilterType("all")
    }

    const hasActiveFilters = searchQuery !== "" || filterType !== "all"

    return (
        <div className="min-h-screen bg-background">
            <GlobalNavbar user={user} />

            <div className="lg:mx-22 mx-auto px-4 lg:px-8 pt-6 pb-12 mt-2">
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
                                    <Label className="text-xs text-foreground font-medium mb-2 block">Type</Label>
                                    <Select value={filterType} onValueChange={setFilterType}>
                                        <SelectTrigger className="bg-background border-border text-foreground h-8 text-sm">
                                            <SelectValue placeholder="All Types" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border-border">
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="journal">Journal</SelectItem>
                                            <SelectItem value="conference">Conference</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="pt-4 border-t border-border">
                                    <p className="text-xs text-muted-foreground">
                                        Showing <span className="font-semibold text-foreground">{filteredPapers.length}</span> of{" "}
                                        <span className="font-semibold text-foreground">{samplePapers.length}</span>
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Search and Sort Bar */}
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground dark:text-foreground whitespace-nowrap mr-2">
                                <p className="font-semibold text-lg">Papers</p> {samplePapers.length}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="relative">
                                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
                                <Input
                                    placeholder="Search papers..."
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
                                    <SelectItem value="views">Most Viewed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Papers List */}
                        {filteredPapers.length > 0 ? (
                            <motion.div className="space-y-2">
                                {filteredPapers.map((paper, index) => (
                                    <motion.div
                                        key={paper.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <div className="border border-border hover:border-primary/50 rounded-lg p-4 transition-all hover:shadow-sm group cursor-pointer">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                                        {paper.title}
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground mt-1">{paper.authors.join(", ")}</p>
                                                </div>
                                                <span className="text-xs px-2 py-1 rounded ml-2 flex-shrink-0 bg-muted text-muted-foreground">
                          {paper.year}
                        </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mb-3">{paper.journal}</p>
                                            <div className="flex gap-4 text-xs text-muted-foreground">
                                                <span>📊 {paper.views} views</span>
                                                <span>⬇️ {paper.downloads} downloads</span>
                                                <span>👍 {paper.likes} likes</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <Card className="border border-border bg-card p-8 text-center">
                                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                                <h3 className="text-sm font-semibold text-foreground mb-1">No papers found</h3>
                                <p className="text-xs text-muted-foreground">Try adjusting your search</p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
