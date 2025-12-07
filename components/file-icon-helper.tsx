import type React from "react"
import {
    FileText,
    Music,
    Video,
    Presentation,
    Package,
    BarChart3,
    Code2,
    File,
    Database,
    LinkIcon,
    Brain,
} from "lucide-react"

export type FileType =
    | "pdf"
    | "doc"
    | "docx"
    | "txt"
    | "audio"
    | "video"
    | "presentation"
    | "ppt"
    | "code"
    | "dataset"
    | "model"
    | "result"
    | "zip"
    | "external"
    | "unknown"

export type ResourceType = "document" | "code" | "dataset" | "model" | "result"

export interface FileIconConfig {
    icon: React.ComponentType<any>
    color: string
    label: string
}

const FILE_TYPE_MAP: Record<FileType, FileIconConfig> = {
    pdf: {
        icon: FileText,
        color: "text-primary",
        label: "PDF Document",
    },
    doc: {
        icon: FileText,
        color: "text-primary",
        label: "Word Document",
    },
    docx: {
        icon: FileText,
        color: "text-primary",
        label: "Word Document",
    },
    txt: {
        icon: FileText,
        color: "text-primary",
        label: "Text File",
    },
    audio: {
        icon: Music,
        color: "text-primary",
        label: "Audio File",
    },
    video: {
        icon: Video,
        color: "text-primary",
        label: "Video File",
    },
    presentation: {
        icon: Presentation,
        color: "text-primary",
        label: "Presentation",
    },
    ppt: {
        icon: Presentation,
        color: "text-primary",
        label: "PowerPoint",
    },
    code: {
        icon: Code2,
        color: "text-primary",
        label: "Source Code",
    },
    dataset: {
        icon: Database,
        color: "text-primary",
        label: "Dataset",
    },
    model: {
        icon: Brain,
        color: "text-primary",
        label: "Model File",
    },
    result: {
        icon: BarChart3,
        color: "text-primary",
        label: "Results",
    },
    zip: {
        icon: Package,
        color: "text-primary",
        label: "Archive",
    },
    external: {
        icon: LinkIcon,
        color: "text-primary",
        label: "External Link",
    },
    unknown: {
        icon: File,
        color: "text-primary",
        label: "File",
    },
}

export function getFileIcon(fileTypeOrName: string | undefined, isExternal = false): FileIconConfig {
    if (isExternal) {
        return FILE_TYPE_MAP.external
    }

    if (!fileTypeOrName) {
        return FILE_TYPE_MAP.unknown
    }

    const normalized = fileTypeOrName.toLowerCase().replace(/^\./, "")

    if (normalized in FILE_TYPE_MAP) {
        return FILE_TYPE_MAP[normalized as FileType]
    }

    // Try to infer from extension
    if (fileTypeOrName.includes(".")) {
        const ext = fileTypeOrName.split(".").pop()?.toLowerCase() || ""
        if (ext in FILE_TYPE_MAP) {
            return FILE_TYPE_MAP[ext as FileType]
        }
    }

    return FILE_TYPE_MAP.unknown
}

export function FileIconBadge({
                                  fileType,
                                  isExternal = false,
                                  className = "",
                              }: {
    fileType?: string
    isExternal?: boolean
    className?: string
}) {
    const config = getFileIcon(fileType, isExternal)
    const IconComponent = config.icon

    return (
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0 ${className}`}>
            <IconComponent className={`h-5 w-5 ${config.color}`} />
        </div>
    )
}

export function getResourceIcon(resourceType?: string) {
    const typeMap: Record<string, FileIconConfig> = {
        document: FILE_TYPE_MAP.pdf,
        code: FILE_TYPE_MAP.code,
        dataset: FILE_TYPE_MAP.dataset,
        model: FILE_TYPE_MAP.model,
        result: FILE_TYPE_MAP.result,
    }

    return typeMap[resourceType || "document"] || FILE_TYPE_MAP.unknown
}
