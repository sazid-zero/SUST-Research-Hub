"use client"

import { GlobalNavbar } from "@/components/global-navbar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Zap, Search, X, ArrowUpDown } from "lucide-react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface PapersContentProps {
    user: any
}

const samplePapers = [
    {
        id: 1,
        title: "Deep Learning for Medical Image Analysis: A Comprehensive Survey",
        authors: [
            { id: 1, full_name: "Dr. Ahmed Hassan", student_id: "author1" },
            { id: 2, full_name: "Sarah Mohamed", student_id: "author2" },
        ],
        abstract:
            "This paper presents a comprehensive survey of deep learning techniques applied to medical image analysis. We explore various architectures including CNNs, transformers, and hybrid models, discussing their applications in disease detection, segmentation, and diagnosis.",
        journal: "IEEE Transactions on Medical Imaging",
        year: 2024,
        type: "journal",
        keywords: ["Deep Learning", "Medical Imaging", "Computer Vision", "Healthcare AI", "Neural Networks"],
        views: 1250,
        downloads: 342,
    },
    {
        id: 2,
        title: "Optimization Methods in Machine Learning: Recent Advances and Applications",
        authors: [
            { id: 3, full_name: "Dr. Sarah Ibrahim", student_id: "author3" },
            { id: 4, full_name: "Youssef Ali", student_id: "author4" },
        ],
        abstract:
            "We present recent advances in optimization methods for machine learning, focusing on adaptive learning rate algorithms, second-order methods, and distributed optimization techniques for large-scale problems.",
        journal: "NeurIPS 2024",
        year: 2024,
        type: "conference",
        keywords: ["Optimization", "Machine Learning", "Gradient Descent", "Deep Learning", "Algorithms"],
        views: 890,
        downloads: 256,
    },
    {
        id: 3,
        title: "Transformer Architectures for Natural Language Processing",
        authors: [
            { id: 5, full_name: "Prof. Mohamed Khaled", student_id: "author5" },
            { id: 6, full_name: "Fatima Ahmed", student_id: "author6" },
        ],
        abstract:
            "An in-depth analysis of transformer architectures and their impact on NLP tasks. We cover attention mechanisms, positional encoding, and recent variations like BERT, GPT, and their applications in text understanding and generation.",
        journal: "ACL 2024",
        year: 2024,
        type: "conference",
        keywords: ["NLP", "Transformers", "Attention Mechanism", "BERT", "Language Models"],
        views: 2340,
        downloads: 678,
    },
]

export function PapersContent({ user }: PapersContentProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedType, setSelectedType] = useState("All Types")
    const [selectedYear, setSelectedYear] = useState("All")
    const [selectedField, setSelectedField] = useState("All Fields")
    const [sortBy, setSortBy] = useState("trending")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const types = ["All Types", ...new Set(samplePapers.map((p) => p.type))]
    const years = ["All", ...new Set(samplePapers.map((p) => p.year).sort((a, b) => b - a))]
    const fields = ["All Fields", ...new Set(samplePapers.flatMap((p) => p.keywords))]

    const filteredPapers = samplePapers.filter((paper) => {
        const matchesSearch =
            paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            paper.authors?.some((author: any) => author.full_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            paper.keywords.some((k: string) => k.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesType = selectedType === "All Types" || paper.type === selectedType
        const matchesYear = selectedYear === "All" || paper.year === Number.parseInt(selectedYear)
        const matchesField =
            selectedField === "All Fields" ||
            paper.keywords.some((k: string) => k.toLowerCase().includes(selectedField.toLowerCase()))

        return matchesSearch && matchesType && matchesYear && matchesField
    })

    const clearFilters = () => {
        setSearchQuery("")
        setSelectedType("All Types")
        setSelectedYear("All")
        setSelectedField("All Fields")
    }

    const hasActiveFilters =
        searchQuery !== "" || selectedType !== "All Types" || selectedYear !== "All" || selectedField !== "All Fields"

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background">
            <GlobalNavbar user={user} />

            <div className="lg:mx-20 mx-auto px-4 lg:px-8 pb-12">
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
                                    <Select value={selectedType} onValueChange={setSelectedType}>
                                        <SelectTrigger className="bg-background border-border text-foreground h-8 text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border-border">
                                            {types.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-xs text-foreground font-medium mb-2 block">Field</Label>
                                    <Select value={selectedField} onValueChange={setSelectedField}>
                                        <SelectTrigger className="bg-background border-border text-foreground h-8 text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border-border">
                                            {fields.slice(0, 10).map((field) => (
                                                <SelectItem key={field} value={field}>
                                                    {field}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-xs text-foreground font-medium mb-3 block">Year</Label>
                                    <div className="flex gap-4">
                                        <div className="flex gap-1 items-center">
                                            <p className="text-xs text-muted-foreground mb-1">From</p>
                                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                                <SelectTrigger className="bg-background border-border text-foreground h-8 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-popover border-border">
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
                                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                                <SelectTrigger className="bg-background border-border text-foreground h-8 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-popover border-border">
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
                                        Showing <span className="font-semibold text-foreground">{filteredPapers.length}</span> of{" "}
                                        <span className="font-semibold text-foreground">{samplePapers.length}</span>
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3 space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground whitespace-nowrap mr-2">
                                <p className="font-semibold text-lg">Papers </p>
                                {filteredPapers.length}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="relative">
                                    <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
                                    <Input
                                        placeholder="Search papers..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border-2 border-border text-sm text-muted-foreground dark:text-foreground dark:text-foreground focus:outline-none focus:border-primary/50 focus:bg-background transition-colors"
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

                        {filteredPapers.length > 0 ? (
                            <motion.div className="space-y-3">
                                {filteredPapers.map((paper, index) => (
                                    <motion.div
                                        key={paper.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <div className="border border-border hover:border-primary/50 rounded-lg p-4 transition-all hover:shadow-sm group cursor-pointer">
                                            <div className="space-y-3">
                                                {/* Title and Meta */}
                                                <div>
                                                    <Link href={`/paper/${paper.id}`}>
                                                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                                            {paper.title}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        By{" "}
                                                        {paper.authors?.map((author: any, idx: number) => (
                                                            <span key={author.id || idx}>
                                <Link
                                    href={`/author/profile/${author.student_id}`}
                                    className="font-medium hover:text-primary transition-colors"
                                >
                                  {author.full_name}
                                </Link>
                                                                {idx < paper.authors.length - 1 && ", "}
                              </span>
                                                        ))}
                                                        {" • "}
                                                        {paper.journal} • {paper.year}
                                                    </p>
                                                </div>

                                                {/* Abstract */}
                                                <p className="text-xs text-foreground leading-relaxed line-clamp-2">{paper.abstract}</p>

                                                {/* Keywords */}
                                                <div className="flex flex-wrap gap-2">
                                                    {paper.keywords.slice(0, 3).map((keyword, idx) => (
                                                        <Badge key={idx} className="bg-primary/10 text-primary border border-primary/20 text-xs">
                                                            {keyword}
                                                        </Badge>
                                                    ))}
                                                    {paper.keywords.length > 3 && (
                                                        <Badge className="bg-muted text-muted-foreground border border-border text-xs">
                                                            +{paper.keywords.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Stats and Actions */}
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-border">
                                                    <div className="flex gap-4 text-xs text-muted-foreground">
                                                        <div className="flex items-center gap-2">
                                                            <Eye className="h-4 w-4" />
                                                            <span>{paper.views} views</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Zap className="h-4 w-4" />
                                                            <span>{paper.downloads} downloads</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 w-full sm:w-auto">
                                                        <Link href={`/paper/${paper.id}`} className="flex-1 sm:flex-none">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-border hover:bg-muted bg-transparent w-full sm:w-auto text-xs"
                                                            >
                                                                <Eye className="h-4 w-4 mr-1" />
                                                                View
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            size="sm"
                                                            className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
                                                        >
                                                            <Zap className="h-4 w-4 mr-1" />
                                                            Download
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <Card className="border border-border bg-card p-8 text-center">
                                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                                <h3 className="text-sm font-semibold text-foreground mb-1">No papers found</h3>
                                <p className="text-xs text-muted-foreground">Try adjusting your search or filters</p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
