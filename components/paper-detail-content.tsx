"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    Award,
    Calendar,
    Copy,
    Download,
    ExternalLink,
    Share2,
    Bookmark,
    TrendingUp,
    FileText,
    Users,
    Building2,
    LinkIcon,
    CheckCircle2,
    BookOpen,
    FolderKanban,
    Code2,
    Database,
    Brain,
    FileBox,
    Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { GlobalNavbar } from "@/components/global-navbar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@supabase/supabase-js"
import { svgTextToDataUri } from "@/lib/utils"
import { useContentTracking } from "@/hooks/use-content-tracking"

interface PaperDetailContentProps {
    publication: any
    user?: User | null
}

export function PaperDetailContent({ publication, user }: PaperDetailContentProps) {
    const [copied, setCopied] = useState(false)
    const [bookmarked, setBookmarked] = useState(false)
    const { trackDownload } = useContentTracking("publication", publication.id)

    const handleCopyDOI = () => {
        if (publication.doi) {
            navigator.clipboard.writeText(`https://doi.org/${publication.doi}`)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: publication.title,
                text: publication.abstract,
                url: window.location.href,
            })
        } else {
            navigator.clipboard.writeText(window.location.href)
            alert("Link copied to clipboard!")
        }
    }

    const getResourceIcon = (type: string) => {
        switch (type) {
            case "code":
                return { icon: Code2, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" }
            case "dataset":
                return { icon: Database, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" }
            case "model":
                return { icon: Brain, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" }
            case "supplementary":
                return { icon: FileBox, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" }
            default:
                return { icon: FileText, color: "text-gray-500", bg: "bg-gray-500/10", border: "border-gray-500/20" }
        }
    }

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return "Unknown size"
        const mb = bytes / (1024 * 1024)
        if (mb < 1) return `${(bytes / 1024).toFixed(1)} KB`
        return `${mb.toFixed(1)} MB`
    }

    const categorizedFiles = {
        code: publication.files?.filter((f: any) => f.resource_type === "code") || [],
        datasets: publication.files?.filter((f: any) => f.resource_type === "dataset") || [],
        models: publication.files?.filter((f: any) => f.resource_type === "model") || [],
        supplementary: publication.files?.filter((f: any) => f.resource_type === "supplementary") || [],
    }

    return (
        <div className="h-screen bg-background flex flex-col">
            {/* Global Navbar */}
            <GlobalNavbar user={user} />

            <div className="container mx-auto px-4 py-6 max-w-7xl flex-1 overflow-hidden flex flex-col">
                {/* Back Button */}

                <div className="hidden lg:grid lg:grid-cols-3 gap-8 h-full">
                    <div className="lg:col-span-2 space-y-6 overflow-y-auto pr-4 no-scrollbar">
                        {/* Header Card */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="p-6 border-border bg-card">
                                {/* Badges */}
                                <div className="flex items-center gap-2 mb-4 flex-wrap">
                                    <Badge
                                        variant="outline"
                                        className="capitalize text-xs font-medium border-primary/30 text-primary bg-primary/5"
                                    >
                                        {publication.publication_type.replace("_", " ")}
                                    </Badge>
                                    <Badge
                                        variant={
                                            publication.status === "published"
                                                ? "default"
                                                : publication.status === "accepted"
                                                    ? "secondary"
                                                    : "outline"
                                        }
                                        className="text-xs capitalize"
                                    >
                                        {publication.status}
                                    </Badge>
                                    {publication.impact_factor && (
                                        <Badge variant="outline" className="text-xs gap-1 border-amber-500/30 text-amber-600">
                                            <Award className="h-3 w-3" />
                                            Impact Factor: {publication.impact_factor}
                                        </Badge>
                                    )}
                                </div>

                                {/* Title */}
                                <h1 className="text-3xl font-bold text-foreground mb-4 leading-tight">{publication.title}</h1>

                                {/* Journal Info */}
                                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                    <Building2 className="h-4 w-4" />
                                    <span className="font-medium text-foreground">{publication.journal_name}</span>
                                    {publication.publisher && <span>• {publication.publisher}</span>}
                                </div>

                                {/* Meta Information */}
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                      {publication.published_date
                          ? new Date(publication.published_date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                          })
                          : publication.year}
                  </span>
                                    {publication.volume && (
                                        <span>
                      Volume {publication.volume}
                                            {publication.issue && `, Issue ${publication.issue}`}
                    </span>
                                    )}
                                    {publication.pages && <span>Pages {publication.pages}</span>}
                                </div>

                                {/* Citations */}
                                {publication.citations > 0 && (
                                    <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg mb-6">
                                        <TrendingUp className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">
                                                Cited by {publication.citations} publications
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                This work has made a significant impact in the research community
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-2">
                                    <Button className="gap-2 bg-primary hover:bg-primary/90" asChild>
                                        <a href={publication.url || "#"} target={publication.url ? "_blank" : undefined} rel={publication.url ? "noopener noreferrer" : undefined}>
                                            <ExternalLink className="h-4 w-4" />
                                            View Full Paper
                                        </a>
                                    </Button>
                                    <Button variant="outline" className="gap-2 bg-transparent" asChild>
                                        <a onClick={() => trackDownload()} href={publication.pdf_url || "#"} target={publication.pdf_url ? "_blank" : undefined} rel={publication.pdf_url ? "noopener noreferrer" : undefined}>
                                            <Download className="h-4 w-4" />
                                            Download PDF
                                        </a>
                                    </Button>
                                    <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setBookmarked(!bookmarked)}>
                                        <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
                                        {bookmarked ? "Saved" : "Save"}
                                    </Button>
                                    <Button variant="outline" className="gap-2 bg-transparent" onClick={handleShare}>
                                        <Share2 className="h-4 w-4" />
                                        Share
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Abstract */}
                        {publication.abstract && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <Card className="p-6 border-border bg-card">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FileText className="h-5 w-5 text-primary" />
                                        <h2 className="text-xl font-bold text-foreground">Abstract</h2>
                                    </div>
                                    <p className="text-foreground leading-relaxed whitespace-pre-line">{publication.abstract}</p>
                                </Card>
                            </motion.div>
                        )}

                        {/* Authors */}
                        {publication.authors && publication.authors.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                <Card className="p-6 border-border bg-card">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Users className="h-5 w-5 text-primary" />
                                        <h2 className="text-xl font-bold text-foreground">Authors</h2>
                                    </div>
                                    <div className="space-y-3">
                                        {publication.authors.map((author: any) => (
                                            <div key={author.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                                                <Avatar className="h-10 w-10 flex-shrink-0">
                                                    {author.profile_pic ? (
                                                        <AvatarImage
                                                            src={svgTextToDataUri(author.profile_pic) || "/placeholder.svg"}
                                                            alt={author.author_name}
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = "none"
                                                            }}
                                                        />
                                                    ) : null}
                                                    <AvatarFallback className="bg-primary/10">
                                                        <Users className="h-5 w-5 text-primary" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold text-foreground">{author.author_name}</p>
                                                        {author.corresponding_author && (
                                                            <Badge variant="outline" className="text-xs">
                                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                Corresponding Author
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {author.affiliation && (
                                                        <p className="text-sm text-muted-foreground mt-1">{author.affiliation}</p>
                                                    )}
                                                </div>
                                                <Badge  className="text-xs">
                                                    {author.author_order === 1
                                                        ? "1st"
                                                        : author.author_order === 2
                                                            ? "2nd"
                                                            : `${author.author_order}th`}{" "}
                                                    Author
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* Keywords */}
                        {publication.keywords && publication.keywords.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                <Card className="p-6 border-border bg-card">
                                    <h2 className="text-xl font-bold text-foreground mb-4">Keywords</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {publication.keywords.map((keyword: string, idx: number) => (
                                            <Badge key={idx} className="text-sm px-3 py-1 bg-primary/10 text-primary border border-primary/20">
                                                {keyword}
                                            </Badge>
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* Related Thesis Section */}
                        {publication.thesis ? (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                <Card className="p-6 border-border bg-card relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/60 to-primary/40" />
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <BookOpen className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-foreground">Related Thesis</h2>
                                            <p className="text-sm text-muted-foreground">This paper is derived from thesis research</p>
                                        </div>
                                    </div>

                                    <Link href={`/thesis/${publication.thesis.id}`}>
                                        <div className="p-5 rounded-lg border border-border hover:border-primary hover:shadow-lg hover:shadow-primary/10 hover:bg-muted/30 transition-all group cursor-pointer">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div className="flex-1">
                                                    <Badge
                                                        variant="outline"
                                                        className="capitalize text-xs font-medium border-primary/30 text-primary bg-primary/10 mb-3"
                                                    >
                                                        {publication.thesis.status}
                                                    </Badge>
                                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 leading-snug text-base">
                                                        {publication.thesis.title}
                                                    </h3>
                                                    {publication.thesis.department && (
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            <span className="font-medium">Department:</span> {publication.thesis.department}
                                                        </p>
                                                    )}
                                                    {publication.thesis.year && (
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Calendar className="h-3 w-3" />
                                                            {publication.thesis.year}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 pt-3 border-t border-border">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-2 text-xs h-8 bg-transparent hover:bg-primary/10 hover:text-primary hover:border-primary"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                    View Thesis
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="gap-2 text-xs h-8 hover:bg-primary/10 hover:text-primary"
                                                >
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                    Full Details
                                                </Button>
                                            </div>
                                        </div>
                                    </Link>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                <Card className="p-6 border-border bg-card relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/30 via-primary/20 to-transparent" />
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                            <BookOpen className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-foreground">Related Thesis</h2>
                                            <p className="text-sm text-muted-foreground">Thesis connection information</p>
                                        </div>
                                    </div>

                                    <div className="text-center py-12">
                                        <div className="bg-primary/5 border-2 border-dashed border-primary/20 rounded-xl w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                            <BookOpen className="h-10 w-10 text-primary/40" />
                                        </div>
                                        <p className="text-base font-medium text-foreground mb-2">No Related Thesis</p>
                                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                            This is an independent publication not derived from a thesis research.
                                        </p>
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </div>

                    <div className="space-y-6 overflow-y-auto pl-2 no-scrollbar">
                        {/* Publication Details */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                            <Card className="p-6 border-border bg-card">
                                <h3 className="text-lg font-bold text-foreground mb-4">Publication Details</h3>
                                <div className="space-y-3 text-sm">
                                    {publication.doi && (
                                        <div>
                                            <p className="text-muted-foreground mb-1">DOI</p>
                                            <div className="flex items-center gap-2">
                                                <code className="text-xs font-mono bg-muted px-2 py-1 rounded flex-1 break-all">
                                                    {publication.doi}
                                                </code>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={handleCopyDOI}>
                                                    {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {publication.isbn && (
                                        <div>
                                            <p className="text-muted-foreground mb-1">ISBN</p>
                                            <code className="text-xs font-mono bg-muted px-2 py-1 rounded block">{publication.isbn}</code>
                                        </div>
                                    )}

                                    {publication.issn && (
                                        <div>
                                            <p className="text-muted-foreground mb-1">ISSN</p>
                                            <code className="text-xs font-mono bg-muted px-2 py-1 rounded block">{publication.issn}</code>
                                        </div>
                                    )}

                                    <Separator />

                                    <div>
                                        <p className="text-muted-foreground mb-1">Publication Type</p>
                                        <p className="font-medium text-foreground capitalize">
                                            {publication.publication_type.replace("_", " ")}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground mb-1">Status</p>
                                        <p className="font-medium text-foreground capitalize">{publication.status}</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {[
                            {
                                type: "code" as const,
                                title: "Code",
                                icon: Code2,
                                color: "text-blue-500",
                                msg: "No code repositories linked",
                            },
                            {
                                type: "datasets" as const,
                                title: "Datasets",
                                icon: Database,
                                color: "text-purple-500",
                                msg: "No datasets available",
                            },
                            {
                                type: "models" as const,
                                title: "Models",
                                icon: Brain,
                                color: "text-green-500",
                                msg: "No trained models shared",
                            },
                            {
                                type: "supplementary" as const,
                                title: "Supplementary Materials",
                                icon: FileBox,
                                color: "text-orange-500",
                                msg: "No supplementary materials",
                            },
                        ].map(({ type, title, icon: Icon, color, msg }, index) => {
                            const files = categorizedFiles[type]
                            return (
                                <motion.div
                                    key={type}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                >
                                    <Card className="p-6 border-border bg-card">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <Icon className={`h-5 w-5 ${color}`} />
                                                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                                                <Badge variant="secondary" className="text-xs font-semibold">
                                                    {files.length}
                                                </Badge>
                                            </div>
                                        </div>

                                        {files.length > 0 ? (
                                            <div className="space-y-3">
                                                {files.map((file: any) => {
                                                    const { icon: FileIcon, color, bg, border } = getResourceIcon(file.resource_type)
                                                    return (
                                                        <a
                                                            key={file.id}
                                                            href={file.file_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={`block p-3 rounded-lg border ${border} ${bg} hover:scale-[1.02] transition-transform group`}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className={`p-2 rounded-lg ${bg} border ${border}`}>
                                                                    <FileIcon className={`h-4 w-4 ${color}`} />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                                                        {file.file_name}
                                                                    </p>
                                                                    {file.description && (
                                                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                                            {file.description}
                                                                        </p>
                                                                    )}
                                                                    <div className="flex items-center gap-2 mt-2">
                                                                        {file.file_size && (
                                                                            <span className="text-xs text-muted-foreground">
                                        {formatFileSize(file.file_size)}
                                      </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                                                            </div>
                                                        </a>
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <div className="bg-muted/50 border-2 border-dashed border-border rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                                    <Icon className="h-8 w-8 text-muted-foreground/60" />
                                                </div>
                                                <p className="text-sm font-medium">{msg}</p>
                                                <p className="text-xs mt-1">This section will appear when resources are added</p>
                                            </div>
                                        )}
                                    </Card>
                                </motion.div>
                            )
                        })}

                        {/* Related Project */}
                        {publication.project && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                                <Card className="p-6 border-border bg-card">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FolderKanban className="h-5 w-5 text-primary" />
                                        <h3 className="text-lg font-bold text-foreground">Related Project</h3>
                                    </div>
                                    <Link href={`/project/${publication.project.id}`}>
                                        <div className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-all group cursor-pointer">
                                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                                                {publication.project.title}
                                            </p>
                                            <Badge variant="secondary" className="text-xs capitalize">
                                                {publication.project.status}
                                            </Badge>
                                        </div>
                                    </Link>
                                    <p className="text-xs text-muted-foreground mt-3">
                                        This paper is associated with the project mentioned above
                                    </p>
                                </Card>
                            </motion.div>
                        )}

                        {/* Quick Links */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
                            <Card className="p-6 border-border bg-card">
                                <h3 className="text-lg font-bold text-foreground mb-4">Quick Links</h3>
                                <div className="space-y-2">
                                    {publication.doi && (
                                        <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" asChild>
                                            <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer">
                                                <LinkIcon className="h-4 w-4" />
                                                View on DOI
                                            </a>
                                        </Button>
                                    )}
                                    {publication.title && (
                                        <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" asChild>
                                            <a
                                                href={`https://scholar.google.com/scholar?q=${encodeURIComponent(publication.title)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                Google Scholar
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>

                <div className="lg:hidden space-y-6 overflow-y-auto h-full">
                    {/* Main Content */}
                    <div className="space-y-6">
                        {/* Header Card */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="p-6 border-border bg-card">
                                {/* Badges */}
                                <div className="flex items-center gap-2 mb-4 flex-wrap">
                                    <Badge
                                        variant="outline"
                                        className="capitalize text-xs font-medium border-primary/30 text-primary bg-primary/5"
                                    >
                                        {publication.publication_type.replace("_", " ")}
                                    </Badge>
                                    <Badge
                                        variant={
                                            publication.status === "published"
                                                ? "default"
                                                : publication.status === "accepted"
                                                    ? "secondary"
                                                    : "outline"
                                        }
                                        className="text-xs capitalize"
                                    >
                                        {publication.status}
                                    </Badge>
                                    {publication.impact_factor && (
                                        <Badge variant="outline" className="text-xs gap-1 border-amber-500/30 text-amber-600">
                                            <Award className="h-3 w-3" />
                                            Impact Factor: {publication.impact_factor}
                                        </Badge>
                                    )}
                                </div>

                                {/* Title */}
                                <h1 className="text-3xl font-bold text-foreground mb-4 leading-tight">{publication.title}</h1>

                                {/* Journal Info */}
                                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                    <Building2 className="h-4 w-4" />
                                    <span className="font-medium text-foreground">{publication.journal_name}</span>
                                    {publication.publisher && <span>• {publication.publisher}</span>}
                                </div>

                                {/* Meta Information */}
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                      {publication.published_date
                          ? new Date(publication.published_date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                          })
                          : publication.year}
                  </span>
                                    {publication.volume && (
                                        <span>
                      Volume {publication.volume}
                                            {publication.issue && `, Issue ${publication.issue}`}
                    </span>
                                    )}
                                    {publication.pages && <span>Pages {publication.pages}</span>}
                                </div>

                                {/* Citations */}
                                {publication.citations > 0 && (
                                    <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg mb-6">
                                        <TrendingUp className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">
                                                Cited by {publication.citations} publications
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                This work has made a significant impact in the research community
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-2">
                                    <Button className="gap-2 bg-primary hover:bg-primary/90" asChild>
                                        <a href={publication.url || "#"} target={publication.url ? "_blank" : undefined} rel={publication.url ? "noopener noreferrer" : undefined}>
                                            <ExternalLink className="h-4 w-4" />
                                            View Full Paper
                                        </a>
                                    </Button>
                                    <Button variant="outline" className="gap-2 bg-transparent" asChild>
                                        <a onClick={() => trackDownload()} href={publication.pdf_url || "#"} target={publication.pdf_url ? "_blank" : undefined} rel={publication.pdf_url ? "noopener noreferrer" : undefined}>
                                            <Download className="h-4 w-4" />
                                            Download PDF
                                        </a>
                                    </Button>
                                    <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setBookmarked(!bookmarked)}>
                                        <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
                                        {bookmarked ? "Saved" : "Save"}
                                    </Button>
                                    <Button variant="outline" className="gap-2 bg-transparent" onClick={handleShare}>
                                        <Share2 className="h-4 w-4" />
                                        Share
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Abstract */}
                        {publication.abstract && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <Card className="p-6 border-border bg-card">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FileText className="h-5 w-5 text-primary" />
                                        <h2 className="text-xl font-bold text-foreground">Abstract</h2>
                                    </div>
                                    <p className="text-foreground leading-relaxed whitespace-pre-line">{publication.abstract}</p>
                                </Card>
                            </motion.div>
                        )}

                        {/* Authors */}
                        {publication.authors && publication.authors.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                <Card className="p-6 border-border bg-card">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Users className="h-5 w-5 text-primary" />
                                        <h2 className="text-xl font-bold text-foreground">Authors</h2>
                                    </div>
                                    <div className="space-y-3">
                                        {publication.authors.map((author: any) => (
                                            <div key={author.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                                                <Avatar className="h-10 w-10 flex-shrink-0">
                                                    {author.profile_pic ? (
                                                        <AvatarImage
                                                            src={svgTextToDataUri(author.profile_pic) || "/placeholder.svg"}
                                                            alt={author.author_name}
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = "none"
                                                            }}
                                                        />
                                                    ) : null}
                                                    <AvatarFallback className="bg-primary/10">
                                                        <Users className="h-5 w-5 text-primary" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold text-foreground">{author.author_name}</p>
                                                        {author.corresponding_author && (
                                                            <Badge variant="outline" className="text-xs">
                                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                Corresponding Author
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {author.affiliation && (
                                                        <p className="text-sm text-muted-foreground mt-1">{author.affiliation}</p>
                                                    )}
                                                </div>
                                                <Badge variant="secondary" className="text-xs">
                                                    {author.author_order === 1
                                                        ? "1st"
                                                        : author.author_order === 2
                                                            ? "2nd"
                                                            : `${author.author_order}th`}{" "}
                                                    Author
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* Keywords */}
                        {publication.keywords && publication.keywords.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                <Card className="p-6 border-border bg-card">
                                    <h2 className="text-xl font-bold text-foreground mb-4">Keywords</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {publication.keywords.map((keyword: string, idx: number) => (
                                            <Badge key={idx} variant="secondary" className="text-sm px-3 py-1">
                                                {keyword}
                                            </Badge>
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* Related Thesis Section */}
                        {publication.thesis ? (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                <Card className="p-6 border-border bg-card relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary via-primary/60 to-primary/40" />
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary-foreground">
                                            <BookOpen className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-foreground">Related Thesis</h2>
                                            <p className="text-sm text-muted-foreground">This paper is derived from thesis research</p>
                                        </div>
                                    </div>

                                    <Link href={`/thesis/${publication.thesis.id}`}>
                                        <div className="p-5 rounded-lg border border-border hover:border-primary hover:shadow-lg hover:shadow-primary/10 hover:bg-muted/30 transition-all group cursor-pointer">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div className="flex-1">
                                                    <Badge
                                                        variant="outline"
                                                        className="capitalize text-xs font-medium border-primary/30 text-primary bg-primary/10 mb-3"
                                                    >
                                                        {publication.thesis.status}
                                                    </Badge>
                                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 leading-snug text-base">
                                                        {publication.thesis.title}
                                                    </h3>
                                                    {publication.thesis.department && (
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            <span className="font-medium">Department:</span> {publication.thesis.department}
                                                        </p>
                                                    )}
                                                    {publication.thesis.year && (
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Calendar className="h-3 w-3" />
                                                            {publication.thesis.year}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 pt-3 border-t border-border">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-2 text-xs h-8 bg-transparent hover:bg-primary/10 hover:text-primary hover:border-primary"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                    View Thesis
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="gap-2 text-xs h-8 hover:bg-primary/10 hover:text-primary"
                                                >
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                    Full Details
                                                </Button>
                                            </div>
                                        </div>
                                    </Link>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                <Card className="p-6 border-border bg-card relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/60 to-primary/40" />
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                            <BookOpen className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-foreground">Related Thesis</h2>
                                            <p className="text-sm text-muted-foreground">Thesis connection information</p>
                                        </div>
                                    </div>

                                    <div className="text-center py-12">
                                        <div className="bg-primary/5 border-2 border-dashed border-primary/20 rounded-xl w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                            <BookOpen className="h-10 w-10 text-primary/40" />
                                        </div>
                                        <p className="text-base font-medium text-foreground mb-2">No Related Thesis</p>
                                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                            This is an independent publication not derived from a thesis research.
                                        </p>
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* Related Project */}
                        {publication.project && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                                <Card className="p-6 border-border bg-card">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FolderKanban className="h-5 w-5 text-primary" />
                                        <h3 className="text-lg font-bold text-foreground">Related Project</h3>
                                    </div>
                                    <Link href={`/project/${publication.project.id}`}>
                                        <div className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-all group cursor-pointer">
                                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                                                {publication.project.title}
                                            </p>
                                            <Badge variant="secondary" className="text-xs capitalize">
                                                {publication.project.status}
                                            </Badge>
                                        </div>
                                    </Link>
                                    <p className="text-xs text-muted-foreground mt-3">
                                        This paper is associated with the project mentioned above
                                    </p>
                                </Card>
                            </motion.div>
                        )}

                        {/* Quick Links */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                            <Card className="p-6 border-border bg-card">
                                <h3 className="text-lg font-bold text-foreground mb-4">Quick Links</h3>
                                <div className="space-y-2">
                                    {publication.doi && (
                                        <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" asChild>
                                            <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer">
                                                <LinkIcon className="h-4 w-4" />
                                                View on DOI
                                            </a>
                                        </Button>
                                    )}
                                    {publication.title && (
                                        <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" asChild>
                                            <a
                                                href={`https://scholar.google.com/scholar?q=${encodeURIComponent(publication.title)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                Google Scholar
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
