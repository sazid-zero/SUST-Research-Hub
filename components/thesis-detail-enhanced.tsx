"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ArrowLeft,
    Download,
    Share2,
    Search,
    LayoutDashboard,
    X,
    Menu,
    UserIcon,
    BookOpen,
    ExternalLink,
    Copy,
    Check,
    Clock,
    Eye
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import type { ThesisWithAuthors } from "@/lib/data/theses"
import type { AuthUser } from "@/lib/auth"
import { FileIconBadge, getFileIcon } from "@/components/file-icon-helper"

export function ThesisDetailEnhanced({ thesis, user }: { thesis: ThesisWithAuthors; user: AuthUser | null }) {
    const hasScrolled = useRef(false)
    const router = useRouter()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [copiedCitation, setCopiedCitation] = useState<string | null>(null)

    const year = thesis.year || new Date(thesis.created_at).getFullYear()

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return (
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Approved</Badge>
                )
            case "pending":
                return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">Pending</Badge>
            case "rejected":
                return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Rejected</Badge>
            case "in-review":
                return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">In Review</Badge>
            default:
                return null
        }
    }

    const generateCitations = () => {
        const authorsText =
            thesis.authors && thesis.authors.length > 0
                ? thesis.authors.length === 1
                    ? thesis.authors[0].full_name
                    : thesis.authors.length === 2
                        ? `${thesis.authors[0].full_name} and ${thesis.authors[1].full_name}`
                        : `${thesis.authors[0].full_name} et al.`
                : "Unknown Author"

        const authorsLastFirst =
            thesis.authors && thesis.authors.length > 0
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

    const copyCitation = (format: string, text: string) => {
        navigator.clipboard.writeText(text)
        setCopiedCitation(format)
        setTimeout(() => setCopiedCitation(null), 2000)
    }

    const categorizedFiles = {
        documents:
            thesis.files?.filter((f) => {
                const type = f.resource_type || "document"
                return type === "document"
            }) || [],
        code: thesis.files?.filter((f) => f.resource_type === "code") || [],
        datasets: thesis.files?.filter((f) => f.resource_type === "dataset") || [],
        models: thesis.files?.filter((f) => f.resource_type === "model") || [],
        results: thesis.files?.filter((f) => f.resource_type === "result") || [],
    }

    useEffect(() => {
        const navigationType = window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
        const isBackForward = navigationType?.type === "back_forward"

        if (!isBackForward && !hasScrolled.current) {
            window.scrollTo(0, 0)
            hasScrolled.current = true
        }
    }, [thesis.id])

    const getDashboardRoute = () => {
        if (!user) return "/register"
        switch (user.role) {
            case "student":
                return "/student/dashboard"
            case "supervisor":
                return "/supervisor/dashboard"
            case "admin":
                return "/admin/dashboard"
            default:
                return "/register"
        }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
                <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between gap-4">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                                <Search className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <span className="text-lg font-bold text-primary">Research Hub</span>
                        </Link>

                        <div className="flex items-center gap-5">
                            <Link href="/#about" className="text-foreground hover:text-primary font-medium text-sm hidden lg:block">
                                About
                            </Link>
                            <Link href="/help" className="text-foreground hover:text-primary font-medium hidden text-sm lg:block">
                                Help
                            </Link>
                            {user && (
                                <Link href={getDashboardRoute()}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-border hover:bg-primary hover:text-primary-foreground bg-transparent hidden sm:flex"
                                    >
                                        <LayoutDashboard className="h-5 w-5 mr-2" />
                                        <span>Dashboard</span>
                                    </Button>
                                </Link>
                            )}
                            <ThemeToggle />
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg hover:bg-muted transition-colors"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-5 w-5 text-foreground" />
                                ) : (
                                    <Menu className="h-5 w-5 text-foreground" />
                                )}
                            </button>
                            <Link href="/settings" className="hidden sm:block">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/30 cursor-pointer hover:border-primary/50 transition-colors">
                                    <UserIcon className="h-5 w-5 text-primary" />
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden border-t border-border py-4 space-y-2">
                            <Link href="/#about">
                                <Button variant="ghost" className="w-full justify-start text-foreground">
                                    <BookOpen className="h-5 w-5 mr-2" />
                                    About
                                </Button>
                            </Link>
                            <Link href="/help">
                                <Button variant="ghost" className="w-full justify-start text-foreground">
                                    <Search className="h-5 w-5 mr-2" />
                                    Help
                                </Button>
                            </Link>
                            {user && (
                                <Link href={getDashboardRoute()}>
                                    <Button variant="ghost" className="w-full justify-start text-foreground">
                                        <LayoutDashboard className="h-5 w-5 mr-2" />
                                        Dashboard
                                    </Button>
                                </Link>
                            )}
                            <Link href="/settings">
                                <Button variant="ghost" className="w-full justify-start text-foreground">
                                    <UserIcon className="h-5 w-5 mr-2" />
                                    Settings
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* Content */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 cursor-pointer bg-transparent border-none p-0 mb-8 font-medium transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Repository
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ==================== LEFT COLUMN ==================== */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title + Metadata + Stats Row */}
                        <div className="space-y-5">
                            {/* Status, Year, Department */}
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                {getStatusBadge(thesis.status)}
                                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
                                    {year}
          </span>
                                <span className="px-3 py-1.5 bg-muted rounded-full text-muted-foreground text-sm">
            {thesis.department}
          </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                                {thesis.title}
                            </h1>

                            {/* Views, Downloads + Share/Copy Buttons */}
                            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border/60">
                                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        <span className="font-medium text-foreground">{thesis.views || 0} views</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Download className="h-4 w-4" />
                                        <span className="font-medium text-foreground">{thesis.downloads || 0} downloads</span>
                                    </div>
                                </div>

                                {/* Share & Copy Link Buttons */}
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 hover:bg-primary"
                                        onClick={() => {
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: thesis.title,
                                                    url: window.location.href,
                                                })
                                            }
                                        }}
                                    >
                                        <Share2 className="h-4 w-4" />
                                        Share
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 hover:bg-primary"
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href)
                                            // Optional: add toast feedback
                                            alert("Link copied to clipboard!")
                                        }}
                                    >
                                        <Copy className="h-4 w-4" />
                                        Copy Link
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Authors & Supervisor */}
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
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                                        <UserIcon className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground group-hover:text-primary text-sm">
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

                        {/* Abstract */}
                        <Card className="p-6 border-border bg-card">
                            <h2 className="text-xl font-bold text-foreground mb-4">Abstract</h2>
                            <p className="text-foreground/90 leading-relaxed text-base">{thesis.abstract}</p>
                        </Card>

                        {/* Keywords */}
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

                        {/* How to Cite */}
                        <Card className="p-6 border-border bg-card">
                            <h2 className="text-xl font-bold text-foreground mb-5">How to Cite</h2>
                            <div className="space-y-5">
                                {["bibtex", "apa", "ieee"].map((format) => (
                                    <div key={format}>
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-foreground capitalize">{format}</h3>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyCitation(format, citations[format as keyof typeof citations])}
                                                className="ml-auto h-8 text-xs gap-1.5"
                                            >
                                                {copiedCitation === format ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                                {copiedCitation === format ? "Copied" : "Copy"}
                                            </Button>
                                        </div>
                                        <pre className={`text-xs p-3 rounded-lg border overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono ${format === "bibtex" ? "bg-muted" : "bg-muted"}`}>
                <code className="text-foreground/80">
                  {format === "bibtex" ? citations.bibtex : format === "apa" ? citations.apa : citations.ieee}
                </code>
              </pre>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* ==================== RIGHT COLUMN (Resources Only) ==================== */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6 lg:sticky lg:top-24">
                            <Button className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:scale-[1.02] text-primary-foreground gap-2 h-12 rounded-lg font-semibold transition-all">
                                <Download className="h-5 w-5" />
                                Download All Files
                            </Button>

                            {/* Documents Section - Enhanced with file type icons */}
                            {categorizedFiles.documents.length > 0 && (
                                <Card className="border border-border bg-card p-6 shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <FileIconBadge fileType="pdf" />
                                            <h3 className="font-bold text-foreground">Documents</h3>
                                            <Badge variant="secondary" className="text-xs font-semibold">
                                                {categorizedFiles.documents.length}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {categorizedFiles.documents.map((file, idx) => {
                                            const config = getFileIcon(file.file_type || file.file_name)
                                            const IconComponent = config.icon
                                            return (
                                                <div
                                                    key={idx}
                                                    className="flex items-start justify-between gap-3 p-3 rounded-lg hover:bg-muted/60 transition-colors border border-transparent hover:border-border"
                                                >
                                                    <div className="flex items-start gap-3 min-w-0 flex-1">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0 mt-0.5">
                                                            <IconComponent className={`h-5 w-5 ${config.color}`} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-foreground truncate">{file.file_name}</p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {(file.file_size / 1024 / 1024).toFixed(1)} MB
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="h-8 shrink-0 hover:bg-primary/10">
                                                        <Download className="h-4 w-4 text-primary" />
                                                    </Button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </Card>
                            )}

                            {/* Code Section - Enhanced with file type icons */}
                            {categorizedFiles.code.length > 0 && (
                                <Card className="border border-border bg-card p-6 shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <FileIconBadge fileType="code" />
                                            <h3 className="font-bold text-foreground">Code</h3>
                                            <Badge variant="secondary" className="text-xs font-semibold">
                                                {categorizedFiles.code.length}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {categorizedFiles.code.map((file, idx) => {
                                            const isExternal = !!file.external_url
                                            const config = getFileIcon(file.file_type || file.file_name, isExternal)
                                            const IconComponent = config.icon
                                            return (
                                                <div key={idx} className="space-y-2">
                                                    <div className="flex items-start justify-between gap-3 p-3 rounded-lg hover:bg-muted/60 transition-colors border border-transparent hover:border-border">
                                                        <div className="flex items-start gap-3 min-w-0 flex-1">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0 mt-0.5">
                                                                <IconComponent className={`h-5 w-5 ${config.color}`} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-foreground truncate">{file.file_name}</p>
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
                                </Card>
                            )}

                            {/* Datasets Section - Enhanced with external link display */}
                            {categorizedFiles.datasets.length > 0 && (
                                <Card className="border border-border bg-card p-6 shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <FileIconBadge fileType="dataset" />
                                            <h3 className="font-bold text-foreground">Datasets</h3>
                                            <Badge variant="secondary" className="text-xs font-semibold">
                                                {categorizedFiles.datasets.length}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {categorizedFiles.datasets.map((file, idx) => {
                                            const isExternal = !!file.external_url
                                            const config = getFileIcon(file.file_type || file.file_name, isExternal)
                                            const IconComponent = config.icon

                                            return (
                                                <div key={idx} className="space-y-2">
                                                    <div className="flex items-start justify-between gap-3 p-3 rounded-lg hover:bg-muted/60 transition-colors border border-transparent hover:border-border">
                                                        <div className="flex items-start gap-3 min-w-0 flex-1">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0 mt-0.5">
                                                                <IconComponent className={`h-5 w-5 ${config.color}`} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-foreground truncate">{file.file_name}</p>
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {isExternal ? "External Dataset" : `${(file.file_size / 1024 / 1024).toFixed(1)} MB`}
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
                                </Card>
                            )}

                            {/* Models Section */}
                            {categorizedFiles.models.length > 0 && (
                                <Card className="border border-border bg-card p-6 shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <FileIconBadge fileType="model" />
                                            <h3 className="font-bold text-foreground">Models</h3>
                                            <Badge variant="secondary" className="text-xs font-semibold">
                                                {categorizedFiles.models.length}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {categorizedFiles.models.map((file, idx) => {
                                            const isExternal = !!file.external_url
                                            const config = getFileIcon(file.file_type || file.file_name, isExternal)
                                            const IconComponent = config.icon
                                            return (
                                                <div key={idx} className="space-y-2">
                                                    <div className="flex items-start justify-between gap-3 p-3 rounded-lg hover:bg-muted/60 transition-colors border border-transparent hover:border-border">
                                                        <div className="flex items-start gap-3 min-w-0 flex-1">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0 mt-0.5">
                                                                <IconComponent className={`h-5 w-5 ${config.color}`} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-foreground truncate">{file.file_name}</p>
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {isExternal ? "External Model" : `${(file.file_size / 1024 / 1024).toFixed(1)} MB`}
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
                                </Card>
                            )}

                            {/* Results Section */}
                            {categorizedFiles.results.length > 0 && (
                                <Card className="border border-border bg-card p-6 shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <FileIconBadge fileType="result" />
                                            <h3 className="font-bold text-foreground">Results</h3>
                                            <Badge variant="secondary" className="text-xs font-semibold">
                                                {categorizedFiles.results.length}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {categorizedFiles.results.map((file, idx) => {
                                            const isExternal = !!file.external_url
                                            const config = getFileIcon(file.file_type || file.file_name, isExternal)
                                            const IconComponent = config.icon
                                            return (
                                                <div key={idx} className="space-y-2">
                                                    <div className="flex items-start justify-between gap-3 p-3 rounded-lg hover:bg-muted/60 transition-colors border border-transparent hover:border-border">
                                                        <div className="flex items-start gap-3 min-w-0 flex-1">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0 mt-0.5">
                                                                <IconComponent className={`h-5 w-5 ${config.color}`} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-foreground truncate">{file.file_name}</p>
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {isExternal ? "External Results" : `${(file.file_size / 1024 / 1024).toFixed(1)} MB`}
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
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-border bg-background py-12 mt-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
                    <p>© 2025 SUST Thesis Repository. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
