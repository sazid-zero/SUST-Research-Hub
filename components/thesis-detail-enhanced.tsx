"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
    Calendar,
    Download,
    ExternalLink,
    Eye,
    FileText,
    Share2,
    UserIcon,
    Bookmark,
    Copy,
    CheckCircle2,
    Clock,
    Building2,
} from "lucide-react"
import { GlobalNavbar } from "@/components/global-navbar"
import type { ThesisWithAuthors } from "@/lib/db/theses"
import type { User } from "@supabase/supabase-js"
import type { Publication } from "@/lib/db/publications"
import { FileIconBadge, getFileIcon } from "@/components/file-icon-helper"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { svgTextToDataUri } from "@/lib/utils"

export function ThesisDetailEnhanced({
                                         thesis,
                                         user,
                                         publications = [],
                                     }: {
    thesis: ThesisWithAuthors
    user?: User | null
    publications?: Publication[]
}) {
    const year = thesis.year || new Date(thesis.created_at).getFullYear()

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return (
                    <Badge variant="default" className="capitalize bg-primary">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Approved
                    </Badge>
                )
            case "pending":
                return (
                    <Badge variant="secondary" className="capitalize">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                    </Badge>
                )
            case "rejected":
                return (
                    <Badge variant="destructive" className="capitalize">
                        Rejected
                    </Badge>
                )
            case "in-review":
                return (
                    <Badge variant="secondary" className="capitalize">
                        In Review
                    </Badge>
                )
            default:
                return null
        }
    }

    const generateCitations = () => {
        const authorsText =
            thesis.authors?.length > 0
                ? thesis.authors.length === 1
                    ? thesis.authors[0].full_name
                    : thesis.authors.length === 2
                        ? `${thesis.authors[0].full_name} and ${thesis.authors[1].full_name}`
                        : `${thesis.authors[0].full_name} et al.`
                : "Unknown Author"

        const authorsLastFirst =
            thesis.authors?.length > 0
                ? thesis.authors
                    .map((a) => {
                        const parts = a.full_name.split(" ")
                        return parts.length > 1 ? `${parts[parts.length - 1]}, ${parts.slice(0, -1).join(" ")}` : a.full_name
                    })
                    .join(", ")
                : "Unknown"

        return {
            bibtex: `@mastersthesis{${thesis.authors?.[0]?.full_name.toLowerCase().replace(/\s+/g, "")}${year},
  title={${thesis.title}},
  author={${authorsText}},
  year={${year}},
  school={Shahjalal University of Science and Technology},
  department={${thesis.department}},
  type={Bachelor's/Master's Thesis}
}`,
            apa: `${authorsLastFirst}. (${year}). ${thesis.title} [Bachelor's/Master's thesis, Shahjalal University of Science and Technology]. SUST Thesis Repository.`,
            ieee: `${authorsText}, "${thesis.title}," B.S./M.S. thesis, ${thesis.department}, Shahjalal University of Science and Technology, Bangladesh, ${year}.`,
        }
    }

    const citations = generateCitations()

    const categorizedFiles = {
        documents: thesis.files?.filter((f) => (f.resource_type || "document") === "document") || [],
        code: thesis.files?.filter((f) => f.resource_type === "code") || [],
        datasets: thesis.files?.filter((f) => f.resource_type === "dataset") || [],
        models: thesis.files?.filter((f) => f.resource_type === "model") || [],
        results: thesis.files?.filter((f) => f.resource_type === "result") || [],
    }

    return (
        <div className="h-screen bg-background flex flex-col">
            <GlobalNavbar user={user} />

            <div className="container mx-auto px-4 py-6 max-w-7xl flex-1 overflow-hidden flex flex-col">
                <div className="lg:grid lg:grid-cols-3 gap-8 h-full">
                    <div className="lg:col-span-2 space-y-6 overflow-y-auto pr-4 no-scrollbar">
                        {/* Header Card */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="p-6 border-border bg-card">
                                {/* Badges */}
                                <div className="flex items-center gap-2 mb-4 flex-wrap">
                                    {getStatusBadge(thesis.status)}
                                    <Badge variant="outline" className="text-xs font-medium border-primary/30 text-primary bg-primary/5">
                                        {thesis.field || "Research"}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        {thesis.department}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        {year}
                                    </Badge>
                                </div>

                                {/* Title */}
                                <h1 className="text-3xl font-bold text-foreground mb-4 leading-tight">{thesis.title}</h1>

                                {/* Meta Information */}
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                      {thesis.submission_date
                          ? new Date(thesis.submission_date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                          })
                          : year}
                  </span>
                                    <span className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                                        {thesis.department}
                  </span>
                                    <span className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    <span className="font-medium text-foreground">{thesis.views || 0}</span> views
                  </span>
                                    <span className="flex items-center gap-1.5">
                    <Download className="h-4 w-4" />
                    <span className="font-medium text-foreground">{thesis.downloads || 0}</span> downloads
                  </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-2">
                                    <Button className="gap-2 bg-primary hover:bg-primary/90">
                                        <FileText className="h-4 w-4" />
                                        View Full Thesis
                                    </Button>
                                    <Button variant="outline" className="gap-2 bg-transparent">
                                        <Download className="h-4 w-4" />
                                        Download PDF
                                    </Button>
                                    <Button variant="outline" className="gap-2 bg-transparent">
                                        <Bookmark className="h-4 w-4" />
                                        Save
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="gap-2 bg-transparent"
                                        onClick={() => navigator.share?.({ title: thesis.title, url: window.location.href })}
                                    >
                                        <Share2 className="h-4 w-4" />
                                        Share
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Abstract */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <Card className="p-6 border-border bg-card">
                                <h2 className="text-xl font-bold text-foreground mb-4">Abstract</h2>
                                <p className="text-foreground/90 leading-relaxed text-base">{thesis.abstract}</p>
                            </Card>
                        </motion.div>

                        {/* Keywords */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <Card className="p-6 border-border bg-card">
                                <h2 className="text-xl font-bold text-foreground mb-4">Keywords</h2>
                                <div className="flex flex-wrap gap-2">
                                    {thesis.keywords.map((keyword, idx) => (
                                        <Badge
                                            key={idx}
                                            variant="outline"
                                            className="border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 px-3 py-1 text-sm font-medium"
                                        >
                                            {keyword}
                                        </Badge>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>

                        {/* Authors & Supervisor */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <Card className="p-6 border-border bg-card">
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                                            {thesis.authors?.length > 1 ? "Authors" : "Author"}
                                        </p>
                                        {thesis.authors?.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {thesis.authors.map((author) => (
                                                    <Link
                                                        key={author.id}
                                                        href={`/student/profile/${author.student_id}`}
                                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/60 transition-colors group"
                                                    >
                                                        <Avatar className="h-10 w-10">
                                                            {author.profile_pic ? (
                                                                <AvatarImage
                                                                    src={svgTextToDataUri(author.profile_pic) || "/placeholder.svg"}
                                                                    alt={author.full_name}
                                                                    onError={(e) => {
                                                                        e.currentTarget.style.display = "none"
                                                                    }}
                                                                />
                                                            ) : null}
                                                            <AvatarFallback className="bg-primary/10">
                                                                <UserIcon className="h-5 w-5 text-primary" />
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium text-foreground group-hover:text-primary transition-colors text-sm">
                                                                {author.full_name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">{author.student_id}</p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No author information available</p>
                                        )}
                                    </div>
                                    <div className="pt-5 border-t border-border">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                            Supervisor
                                        </p>
                                        <p className="font-medium text-foreground">{thesis.supervisor_name || "Not specified"}</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Publications */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <Card className="p-6 border-border bg-card relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary via-primary/60 to-primary/40"></div>
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <FileText className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground">Publications</h2>
                                        <p className="text-sm text-muted-foreground">Papers published from this research</p>
                                    </div>
                                </div>
                                {publications && publications.length > 0 ? (
                                    <div className="space-y-4">
                                        {publications.map((pub) => (
                                            <Link
                                                key={pub.id}
                                                href={`/paper/${pub.id}`}
                                                className="block p-5 rounded-lg border border-border hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 hover:bg-muted/40 transition-all group"
                                            >
                                                <div className="flex items-start justify-between gap-4 mb-3">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                                                            {pub.title}
                                                        </h3>
                                                        <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                                                            {pub.authors && pub.authors.length > 0 && (
                                                                <span className="flex items-center gap-1">
                                  <UserIcon className="h-3.5 w-3.5 text-primary/70" />
                                                                    {pub.authors.length === 1
                                                                        ? pub.authors[0].full_name
                                                                        : pub.authors.length === 2
                                                                            ? `${pub.authors[0].full_name} and ${pub.authors[1].full_name}`
                                                                            : `${pub.authors[0].full_name} et al.`}
                                </span>
                                                            )}
                                                            {pub.journal_name && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>{pub.journal_name}</span>
                                                                </>
                                                            )}
                                                            {pub.publication_date && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>
                                    {new Date(pub.publication_date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                    })}
                                  </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Badge
                                                        variant="outline"
                                                        className="capitalize shrink-0 border-primary/40 text-primary bg-primary/10 font-medium"
                                                    >
                                                        {pub.publication_type.replace("_", " ")}
                                                    </Badge>
                                                </div>
                                                {pub.abstract && (
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{pub.abstract}</p>
                                                )}
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    {pub.citations !== null && pub.citations > 0 && (
                                                        <span className="flex items-center gap-1 px-2 py-1 rounded bg-primary/5 text-primary font-medium">
                              <FileText className="h-3 w-3" />
                                                            {pub.citations} citations
                            </span>
                                                    )}
                                                    {pub.doi && (
                                                        <span className="flex items-center gap-1">
                              <ExternalLink className="h-3 w-3 text-primary/70" />
                              DOI
                            </span>
                                                    )}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <div className="bg-primary/5 border-2 border-dashed border-primary/20 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                            <FileText className="h-8 w-8 text-primary/60" />
                                        </div>
                                        <p className="text-sm font-medium">No publications available</p>
                                        <p className="text-xs mt-1">Papers published from this thesis will appear here</p>
                                    </div>
                                )}
                            </Card>
                        </motion.div>

                        {/* Citations */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                            <Card className="p-6 border-border bg-card">
                                <h2 className="text-xl font-bold text-foreground mb-5">How to Cite</h2>
                                <div className="space-y-5">
                                    {["bibtex", "apa", "ieee"].map((format) => (
                                        <div key={format}>
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-semibold text-foreground capitalize">{format}</h3>
                                                <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5">
                                                    <Copy className="h-3.5 w-3.5" />
                                                    Copy
                                                </Button>
                                            </div>
                                            <pre className="text-xs p-3 rounded-lg border bg-muted overflow-x-auto whitespace-pre-wrap font-mono">
                        <code className="text-foreground/80">
                          {format === "bibtex" ? citations.bibtex : format === "apa" ? citations.apa : citations.ieee}
                        </code>
                      </pre>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    </div>

                    <div className="hidden lg:block space-y-6 overflow-y-auto pl-2 no-scrollbar">
                        <Button className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:scale-[1.02] text-primary-foreground gap-2 h-12 rounded-lg font-semibold transition-all">
                            <Download className="h-5 w-5" />
                            Download All Files
                        </Button>

                        {[
                            { type: "documents" as const, title: "Documents", icon: "pdf", msg: "No documents uploaded" },
                            { type: "code" as const, title: "Code", icon: "code", msg: "No code linked" },
                            { type: "datasets" as const, title: "Datasets", icon: "dataset", msg: "No datasets available" },
                            { type: "models" as const, title: "Models", icon: "model", msg: "No trained models shared" },
                            { type: "results" as const, title: "Results", icon: "result", msg: "No results or visualizations" },
                        ].map(({ type, title, icon, msg }) => {
                            const files = categorizedFiles[type]
                            return (
                                <Card
                                    key={type}
                                    className="border border-border bg-card p-6 shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <FileIconBadge fileType={icon} />
                                            <h3 className="font-bold text-foreground">{title}</h3>
                                            <Badge variant="secondary" className="text-xs font-semibold">
                                                {files.length}
                                            </Badge>
                                        </div>
                                    </div>
                                    {files.length > 0 ? (
                                        <div className="space-y-3">
                                            {files.map((file, idx) => {
                                                const isExternal = !!file.external_url
                                                const config = getFileIcon(file.file_type || file.file_name, isExternal)
                                                const IconComponent = config.icon

                                                return (
                                                    <div key={idx} className="space-y-2">
                                                        <div className="flex items-start justify-between gap-3 p-3 rounded-lg hover:bg-muted/60 transition-colors border border-transparent hover:border-border">
                                                            <div className="flex items-start gap-3 min-w-0 flex-1">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0 mt-0.5">
                                                                    <FileIconBadge fileType={file.file_type || file.file_name} />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-foreground truncate">
                                                                        {file.file_name || "External Link"}
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground mt-1">
                                                                        {isExternal
                                                                            ? "External Repository"
                                                                            : `${(file.file_size / 1024 / 1024).toFixed(1)} MB`}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Button variant="ghost" size="sm" className="h-8 shrink-0 hover:bg-primary/10">
                                                                {isExternal ? (
                                                                    <ExternalLink className="h-4 w-4 text-primary" />
                                                                ) : (
                                                                    <Download className="h-4 w-4 text-primary" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                        {isExternal && (
                                                            <div className="ml-11 px-3 py-2 bg-muted rounded border border-border text-xs text-muted-foreground break-all font-mono hover:bg-muted/80 transition-colors">
                                                                {file.external_url}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <div className="bg-muted/50 border-2 border-dashed border-border rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                                <FileText className="h-8 w-8 text-muted-foreground/60" />
                                            </div>
                                            <p className="text-sm font-medium">{msg}</p>
                                            <p className="text-xs mt-1">This section will appear when resources are added</p>
                                        </div>
                                    )}
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
