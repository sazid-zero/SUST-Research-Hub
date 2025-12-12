"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GlobalNavbar } from "@/components/global-navbar"
import { svgTextToDataUri } from "@/lib/utils"
import {
    FileText,
    BookOpen,
    Database,
    Brain,
    Eye,
    User,
    Download,
    Share2,
    Code2,
    FileBox,
    ExternalLink,
    Users,
    Bookmark,
    Calendar,
    Building2,
    DollarSign,
} from "lucide-react"
import { getFileIcon } from "@/components/file-icon-helper"

interface ProjectMember {
    id: number
    full_name: string
    role: string
    profile_pic: string | null
    email: string
}

interface ProjectFile {
    id: number
    type: string
    filename: string
    title: string
    description: string
    url: string
    file_size: number
    external_url: string
    file_type: string
    file_name: string
}

interface Project {
    id: number
    title: string
    description: string
    status: string
    department: string
    field: string
    startDate: string
    endDate: string | null
    funding: string
    fundingSource: string
    objectives: string[]
    team: ProjectMember[]
    keywords: string[]
    theses: Array<{ id: number; title: string; status: string }>
    publications: Array<{ id: number; title: string; journal: string; year: number }>
    datasets: Array<{ id: number; name: string; size: string; format: string }>
    models: Array<{ id: number; name: string; accuracy: string; framework: string }>
    collaborations: string[]
    views: number
    created_at: string
    updated_at: string
    files?: ProjectFile[]
}

interface ProjectDetailContentProps {
    project: Project
}

export default function ProjectDetailContent({ project }: ProjectDetailContentProps) {
    const [activeTab, setActiveTab] = useState("overview")

    const getResourceIcon = (type: string) => {
        switch (type) {
            case "code":
                return {
                    icon: Code2,
                    color: "text-blue-500",
                    bg: "bg-blue-500/10",
                    border: "border-blue-500/20 dark:border-blue-500/40",
                }
            case "dataset":
                return {
                    icon: Database,
                    color: "text-purple-500",
                    bg: "bg-purple-500/10",
                    border: "border-purple-500/20 dark:border-purple-500/40",
                }
            case "model":
                return {
                    icon: Brain,
                    color: "text-green-500",
                    bg: "bg-green-500/10",
                    border: "border-green-500/20 dark:border-green-500/40",
                }
            case "document":
                return {
                    icon: FileText,
                    color: "text-orange-500",
                    bg: "bg-orange-500/10",
                    border: "border-orange-500/20 dark:border-orange-500/40",
                }
            case "result":
                return {
                    icon: FileBox,
                    color: "text-red-500",
                    bg: "bg-red-500/10",
                    border: "border-red-500/20 dark:border-red-500/40",
                }
            default:
                return {
                    icon: FileBox,
                    color: "text-gray-500",
                    bg: "bg-gray-500/10",
                    border: "border-gray-500/20 dark:border-gray-500/40",
                }
        }
    }

    const categorizedFiles = {
        documents: project.files?.filter((f) => (f.type || "document") === "document") || [],
        code: project.files?.filter((f) => f.type === "code") || [],
        datasets: project.files?.filter((f) => f.type === "dataset") || [],
        models: project.files?.filter((f) => f.type === "model") || [],
        results: project.files?.filter((f) => f.type === "result") || [],
    }

    const resourceSections = [
        {
            type: "documents" as const,
            singularType: "document",
            title: "Documents",
            icon: FileText,
            msg: "No documents uploaded",
        },
        { type: "code" as const, singularType: "code", title: "Code", icon: Code2, msg: "No code linked" },
        {
            type: "datasets" as const,
            singularType: "dataset",
            title: "Datasets",
            icon: Database,
            msg: "No datasets available",
        },
        { type: "models" as const, singularType: "model", title: "Models", icon: Brain, msg: "No trained models shared" },
        {
            type: "results" as const,
            singularType: "result",
            title: "Results",
            icon: FileBox,
            msg: "No results or visualizations",
        },
    ]

    const renderResources = () => {
        return resourceSections.map(({ type, singularType, title, icon, msg }) => {
            const files = categorizedFiles[type]
            const resourceStyle = getResourceIcon(singularType)
            const SectionIcon = icon

            return (
                <Card
                    key={type}
                    className={`border-2 bg-card p-6 shadow-md hover:shadow-lg transition-shadow ${resourceStyle.border}`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${resourceStyle.bg}`}>
                                <SectionIcon className={`h-5 w-5 ${resourceStyle.color}`} />
                            </div>
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

                                const linkHref = file.external_url || file.url || "#"

                                return (
                                    <a
                                        key={idx}
                                        href={linkHref}
                                        target={isExternal ? "_blank" : "_self"}
                                        rel={isExternal ? "noopener noreferrer" : ""}
                                        className={`block p-3 rounded-lg border ${resourceStyle.border} ${resourceStyle.bg} hover:scale-[1.02] transition-transform group`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3 min-w-0 flex-1">
                                                <div
                                                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${resourceStyle.bg} flex-shrink-0 mt-0.5`}
                                                >
                                                    <IconComponent className={`h-5 w-5 ${resourceStyle.color}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-foreground truncate">
                                                        {file.file_name || file.title || "External Link"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {isExternal
                                                            ? "External Repository"
                                                            : file.file_size
                                                                ? `${(file.file_size / 1024 / 1024).toFixed(1)} MB`
                                                                : "Size not available"}
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
                                            <div className="pt-2 pl-11 pr-3 text-xs text-muted-foreground break-all font-mono">
                                                {file.external_url}
                                            </div>
                                        )}
                                    </a>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <div className="bg-muted/50 border-2 border-dashed border-border rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <SectionIcon className="h-8 w-8 text-muted-foreground/60" />
                            </div>
                            <p className="text-sm font-medium">{msg}</p>
                            <p className="text-xs mt-1">This section will appear when resources are added</p>
                        </div>
                    )}
                </Card>
            )
        })
    }

    return (
        <div className="h-screen bg-background flex flex-col">
            <GlobalNavbar user={null} />

            <div className="container mx-auto px-4 py-6 max-w-7xl flex-1 overflow-hidden flex flex-col">
                <div className="lg:grid lg:grid-cols-3 gap-8 h-full">
                    <div className="lg:col-span-2 space-y-6 overflow-y-auto pr-4 no-scrollbar">
                        {/* Header Card */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="p-6 border-border bg-card">
                                {/* Badges */}
                                <div className="flex items-center gap-2 mb-4 flex-wrap">
                                    <Badge
                                        variant={project.status === "active" ? "default" : "secondary"}
                                        className="capitalize text-xs font-medium"
                                    >
                                        {project.status}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs font-medium border-primary/30 text-primary bg-primary/5">
                                        {project.field}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        {project.department}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        {new Date(project.startDate).getFullYear()}
                                        {project.endDate && ` - ${new Date(project.endDate).getFullYear()}`}
                                    </Badge>
                                </div>

                                {/* Title */}
                                <h1 className="text-3xl font-bold text-foreground mb-4 leading-tight">{project.title}</h1>

                                {/* Meta Information */}
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                      {new Date(project.startDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                      })}
                      {project.endDate &&
                          ` - ${new Date(project.endDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                          })}`}
                  </span>
                                    <span className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                                        {project.department}
                  </span>
                                    <span className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    <span className="font-medium text-foreground">{project.views || 0}</span> views
                  </span>
                                    <span className="flex items-center gap-1.5">
                    <Download className="h-4 w-4" />
                    <span className="font-medium text-foreground">0</span> downloads
                  </span>
                                </div>

                                {/* Funding Badge (if applicable) */}
                                {project.funding && (
                                    <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg mb-6">
                                        <DollarSign className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">
                                                Funded Project - {project.funding.toLocaleString()} USD
                                            </p>
                                            <p className="text-xs text-muted-foreground">Supported by institutional and external funding</p>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-2">
                                    <Button className="gap-2 bg-primary hover:bg-primary/90">
                                        <ExternalLink className="h-4 w-4" />
                                        View Project Details
                                    </Button>
                                    <Button variant="outline" className="gap-2 bg-transparent">
                                        <Download className="h-4 w-4" />
                                        Download Resources
                                    </Button>
                                    <Button variant="outline" className="gap-2 bg-transparent">
                                        <Bookmark className="h-4 w-4" />
                                        Save
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="gap-2 bg-transparent"
                                        onClick={() => navigator.share?.({ title: project.title, url: window.location.href })}
                                    >
                                        <Share2 className="h-4 w-4" />
                                        Share
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Description Card */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <Card className="p-6 border-border bg-card">
                                <h2 className="text-xl font-bold text-foreground mb-4">Project Description</h2>
                                <p className="text-foreground/90 leading-relaxed text-base">{project.description}</p>
                            </Card>
                        </motion.div>

                        {/* Team Card */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <Card className="p-6 border-border bg-card">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Project Team
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {project.team.map((member) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/60 transition-colors group"
                                        >
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage
                                                    src={member.profile_pic ? svgTextToDataUri(member.profile_pic) : undefined}
                                                    alt={member.full_name}
                                                />
                                                <AvatarFallback>
                                                    <User className="h-4 w-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-foreground group-hover:text-primary transition-colors text-sm">
                                                    {member.full_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{member.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>

                        {/* Details Card */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <Card className="p-6 border-border bg-card">
                                <h3 className="text-lg font-bold text-foreground mb-4">Project Information</h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-muted-foreground mb-1">Status</p>
                                        <Badge variant={project.status === "active" ? "default" : "secondary"} className="capitalize">
                                            {project.status}
                                        </Badge>
                                    </div>
                                    <Separator />
                                    <div>
                                        <p className="text-muted-foreground mb-1">Duration</p>
                                        <p className="font-medium text-foreground">
                                            {new Date(project.startDate).getFullYear()}
                                            {project.endDate && ` - ${new Date(project.endDate).getFullYear()}`}
                                        </p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <p className="text-muted-foreground mb-1">Department</p>
                                        <p className="font-medium text-foreground">{project.department}</p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <p className="text-muted-foreground mb-1">Funding</p>
                                        <p className="font-medium text-foreground">{project.funding}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{project.fundingSource}</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Research Outputs Card */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <Card className="p-6 border-border bg-card relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary via-primary/60 to-primary/40"></div>
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <BookOpen className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold">Research Outputs</h3>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-semibold text-md mb-3 flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                                            Related Theses ({project.theses.length})
                                        </h4>
                                        {project.theses.length > 0 ? (
                                            <div className="space-y-3">
                                                {project.theses.map((thesis) => (
                                                    <Link
                                                        key={thesis.id}
                                                        href={`/thesis/${thesis.id}`}
                                                        className="block p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 hover:bg-muted/30 transition-all group"
                                                    >
                                                        <p className="font-medium mb-2 group-hover:text-primary transition-colors">
                                                            {thesis.title}
                                                        </p>
                                                        <Badge
                                                            variant="secondary"
                                                            className="capitalize text-xs border-primary/20 bg-primary/5 text-primary"
                                                        >
                                                            {thesis.status.replace("_", " ")}
                                                        </Badge>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="bg-primary/5 border-2 border-dashed border-primary/20 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                                                    <BookOpen className="h-6 w-6 text-primary/60" />
                                                </div>
                                                <p className="text-sm text-muted-foreground">No theses linked yet</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="pt-6 border-t border-primary/10">
                                        <h4 className="font-semibold text-md mb-3 flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                                            Publications ({project.publications.length})
                                        </h4>
                                        {project.publications.length > 0 ? (
                                            <div className="space-y-3">
                                                {project.publications.map((pub) => (
                                                    <Link
                                                        key={pub.id}
                                                        href={`/paper/${pub.id}`}
                                                        className="block p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 hover:bg-muted/30 transition-all group"
                                                    >
                                                        <p className="font-medium mb-1 group-hover:text-primary transition-colors">{pub.title}</p>
                                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                            <span className="text-primary/70">{pub.journal}</span>
                                                            <span>•</span>
                                                            <span>{pub.year}</span>
                                                        </p>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="bg-primary/5 border-2 border-dashed border-primary/20 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                                                    <FileText className="h-6 w-6 text-primary/60" />
                                                </div>
                                                <p className="text-sm text-muted-foreground">No publications yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>

                    <div className="hidden lg:block space-y-6 overflow-y-auto pl-2 no-scrollbar">
                        <Button className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:scale-[1.02] text-primary-foreground gap-2 h-12 rounded-lg font-semibold transition-all">
                            <Download className="h-5 w-5" />
                            Download All Files
                        </Button>
                        {renderResources()}
                    </div>
                </div>
            </div>
        </div>
    )
}
