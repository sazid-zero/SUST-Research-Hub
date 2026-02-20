"use client"

import { useState, useEffect, useCallback } from "react"
import { 
    Plus, RefreshCw, FilePlus, FolderPlus, FileCode, 
    UploadCloud, Folder, Loader2, ChevronRight, ChevronDown,
    File, FileJson, FileText, Image as ImageIcon,
    MoreVertical, Trash2, Edit2, Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuSeparator,
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { saveCodeFile, createFolder, deleteCodeFile, getCodeFiles, renameCodeItem } from "@/app/actions/workspace"
import { CreateItemModal, RenameModal, DeleteItemModal } from "./repo-modals"
import { useRef } from "react"
import { toast } from "sonner"

interface CodeFile {
    id: number
    name: string
    path: string
    is_directory: boolean
    content: string | null
    updated_at: string
}

interface CodeRepositoryProps {
    workspaceId: number
    workspaceType: string
    onFileSelect?: (file: CodeFile | null) => void
    selectedFilePath?: string | null
}

// Get file icon and color based on extension
function getFileIcon(name: string) {
    const ext = name.split('.').pop()?.toLowerCase()
    switch (ext) {
        case 'ts': case 'tsx':
            return { icon: FileCode, color: 'text-blue-400' }
        case 'js': case 'jsx': case 'mjs':
            return { icon: FileCode, color: 'text-yellow-400' }
        case 'py':
            return { icon: FileCode, color: 'text-green-400' }
        case 'json':
            return { icon: FileJson, color: 'text-orange-400' }
        case 'md': case 'txt':
            return { icon: FileText, color: 'text-slate-400' }
        case 'css': case 'scss':
            return { icon: FileCode, color: 'text-pink-400' }
        case 'html':
            return { icon: FileCode, color: 'text-red-400' }
        case 'png': case 'jpg': case 'jpeg': case 'svg': case 'gif':
            return { icon: ImageIcon, color: 'text-purple-400' }
        case 'sh': case 'bash':
            return { icon: FileCode, color: 'text-emerald-400' }
        default:
            return { icon: File, color: 'text-slate-400' }
    }
}

export function CodeRepository({ workspaceId, workspaceType, onFileSelect, selectedFilePath }: CodeRepositoryProps) {
    const [files, setFiles] = useState<CodeFile[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set([""]))
    
    // Modal state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [createModalType, setCreateModalType] = useState<"file" | "folder">("file")
    const [createModalParentPath, setCreateModalParentPath] = useState("")
    
    // Rename Modal state
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false)
    const [renamingItem, setRenamingItem] = useState<{path: string, name: string, type: "file" | "folder"} | null>(null)

    // Delete Modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deletingItem, setDeletingItem] = useState<{path: string, name: string, type: "file" | "folder"} | null>(null)

    // Upload refs
    const fileInputRef = useRef<HTMLInputElement>(null)
    const folderInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetchFiles()
    }, [workspaceId, workspaceType])

    const fetchFiles = async () => {
        setLoading(true)
        const result = await getCodeFiles(workspaceId, workspaceType)
        setFiles(result as CodeFile[])
        setLoading(false)
    }

    const toggleFolder = (path: string) => {
        const newExpanded = new Set(expandedFolders)
        if (newExpanded.has(path)) {
            newExpanded.delete(path)
        } else {
            newExpanded.add(path)
        }
        setExpandedFolders(newExpanded)
    }

    const handleCreateFile = (parentPath: string = "") => {
        setCreateModalType("file")
        setCreateModalParentPath(parentPath)
        setIsCreateModalOpen(true)
    }

    const handleCreateFolder = (parentPath: string = "") => {
        setCreateModalType("folder")
        setCreateModalParentPath(parentPath)
        setIsCreateModalOpen(true)
    }

    const handleRename = (path: string, name: string, isDirectory: boolean) => {
        setRenamingItem({ path, name, type: isDirectory ? "folder" : "file" })
        setIsRenameModalOpen(true)
    }

    const processCreation = async (name: string) => {
        const path = createModalParentPath ? `${createModalParentPath}/${name}` : name
        
        if (createModalType === "file") {
            // Optimistic update
            const tempFile: CodeFile = {
                id: Date.now(),
                name,
                path,
                is_directory: false,
                content: "",
                updated_at: new Date().toISOString()
            }
            setFiles(prev => [...prev, tempFile])
            
            const res = await saveCodeFile(workspaceId, workspaceType, path, "", name)
            if (res.success) {
                toast.success(`Created "${name}"`)
                fetchFiles() // Refresh to get real ID
            } else {
                setFiles(prev => prev.filter(f => f.id !== tempFile.id)) // Rollback
                toast.error("Failed to create file")
            }
        } else {
            // Optimistic update for folder
            const tempFolder: CodeFile = {
                id: Date.now(),
                name,
                path,
                is_directory: true,
                content: null,
                updated_at: new Date().toISOString()
            }
            setFiles(prev => [...prev, tempFolder])
            
            const res = await createFolder(workspaceId, workspaceType, path, name)
            if (res.success) {
                toast.success(`Created folder "${name}"`)
                fetchFiles()
            } else {
                setFiles(prev => prev.filter(f => f.id !== tempFolder.id))
                toast.error("Failed to create folder")
            }
        }
    }

    const processRename = async (newName: string) => {
        if (!renamingItem) return
        
        // Optimistic update
        const oldPath = renamingItem.path
        const newPath = renamingItem.path.split('/').slice(0, -1).concat(newName).join('/')
        setFiles(prev => prev.map(f => 
            f.path === oldPath ? { ...f, name: newName, path: newPath } : f
        ))
        
        const res = await renameCodeItem(workspaceId, workspaceType, oldPath, newName)
        if (res.success) {
            toast.success(`Renamed to "${newName}"`)
            // Update selected file if it was renamed
            if (selectedFilePath === oldPath) {
                onFileSelect?.(null)
            }
        } else {
            fetchFiles() // Rollback by refetching
            toast.error("Failed to rename")
        }
    }

    const handleDelete = (path: string, name: string, isDirectory: boolean) => {
        setDeletingItem({ path, name, type: isDirectory ? "folder" : "file" })
        setIsDeleteModalOpen(true)
    }

    const processDelete = async () => {
        if (!deletingItem) return
        
        // Optimistic update
        setFiles(prev => prev.filter(f => !f.path.startsWith(deletingItem.path)))
        if (selectedFilePath === deletingItem.path) onFileSelect?.(null)
        
        const res = await deleteCodeFile(workspaceId, workspaceType, deletingItem.path)
        if (res.success) {
            toast.success(`Deleted "${deletingItem.name}"`)
        } else {
            fetchFiles() // Rollback
            toast.error("Failed to delete")
        }
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, isFolder: boolean = false) => {
        const selectedFiles = e.target.files
        if (!selectedFiles || selectedFiles.length === 0) return

        const toastId = toast.loading(`Uploading ${selectedFiles.length} file(s)...`)

        try {
            let successCount = 0
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i]
                const relativePath = isFolder ? file.webkitRelativePath : file.name
                
                const content = await new Promise<string>((resolve) => {
                    const reader = new FileReader()
                    reader.onload = (e) => resolve(e.target?.result as string || "")
                    reader.readAsText(file)
                })

                const pathParts = relativePath.split('/')
                if (pathParts.length > 1) {
                    let currentPath = ""
                    for (let j = 0; j < pathParts.length - 1; j++) {
                        const folderName = pathParts[j]
                        const newPath = currentPath ? `${currentPath}/${folderName}` : folderName
                        await createFolder(workspaceId, workspaceType, newPath, folderName)
                        currentPath = newPath
                    }
                }

                const res = await saveCodeFile(workspaceId, workspaceType, relativePath, content, file.name)
                if (res.success) successCount++
            }
            toast.success(`Uploaded ${successCount} file(s)`, { id: toastId })
            fetchFiles()
        } catch (error) {
            toast.error("Some files failed to upload", { id: toastId })
            console.error(error)
        }
        
        // Reset input
        e.target.value = ""
    }

    const getExistingNames = (parentPath: string) => {
        return files
            .filter(f => {
                const parts = f.path.split('/')
                if (parentPath === "") return parts.length === 1
                const parentParts = parentPath.split('/')
                return parts.length === parentParts.length + 1 && f.path.startsWith(parentPath + '/')
            })
            .map(f => f.name)
    }

    const renderFileTree = (parentPath: string = "", depth: number = 0) => {
        const levelFiles = files.filter(f => {
            const parts = f.path.split('/')
            if (parentPath === "") return parts.length === 1
            const parentParts = parentPath.split('/')
            return parts.length === parentParts.length + 1 && f.path.startsWith(parentPath + '/')
        }).sort((a, b) => {
            // Folders first, then files
            if (a.is_directory && !b.is_directory) return -1
            if (!a.is_directory && b.is_directory) return 1
            return a.name.localeCompare(b.name)
        })

        if (levelFiles.length === 0 && parentPath === "") {
             return (
                 <div className="p-6 text-center text-muted-foreground flex flex-col items-center gap-3">
                     <p className="text-xs">No files yet.</p>
                     <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => handleCreateFile()}>
                             <FilePlus className="h-3 w-3 mr-1" /> New File
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => handleCreateFolder()}>
                             <FolderPlus className="h-3 w-3 mr-1" /> New Folder
                        </Button>
                     </div>
                 </div>
             )
        }

        return levelFiles.map(file => {
            const isSelected = selectedFilePath === file.path
            const { icon: FileIcon, color } = getFileIcon(file.name)
            
            return (
                <div key={file.id} className="select-none">
                    <div 
                        className={`
                            group flex items-center justify-between py-[3px] px-2 cursor-pointer text-xs transition-all rounded-sm mx-1
                            ${isSelected 
                                ? 'bg-indigo-500/20 text-indigo-300 dark:bg-indigo-500/25 dark:text-indigo-200 ring-1 ring-indigo-500/30' 
                                : 'hover:bg-white/5 dark:hover:bg-white/5 text-slate-300 dark:text-slate-400'
                            }
                        `}
                        style={{ paddingLeft: `${depth * 12 + 8}px` }}
                        onClick={() => {
                            if (file.is_directory) {
                                toggleFolder(file.path)
                            } else {
                                onFileSelect?.(file)
                            }
                        }}
                    >
                        <div className="flex items-center gap-1.5 overflow-hidden min-w-0">
                            {file.is_directory ? (
                                <span className="text-slate-400 shrink-0">
                                    {expandedFolders.has(file.path) 
                                        ? <ChevronDown className="h-3 w-3" /> 
                                        : <ChevronRight className="h-3 w-3" />
                                    }
                                </span>
                            ) : (
                                <span className="w-3 shrink-0" />
                            )}
                            {file.is_directory ? (
                                <Folder className={`h-3.5 w-3.5 shrink-0 ${expandedFolders.has(file.path) ? 'text-yellow-400 fill-yellow-400/20' : 'text-yellow-500 fill-yellow-500/10'}`} />
                            ) : (
                                <FileIcon className={`h-3.5 w-3.5 shrink-0 ${color}`} />
                            )}
                            <span className="truncate font-mono">{file.name}</span>
                        </div>
                        
                        <div className="opacity-0 group-hover:opacity-100 flex items-center shrink-0 transition-opacity">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-white/10">
                                        <MoreVertical className="h-3 w-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="text-xs">
                                    {file.is_directory && (
                                        <>
                                            <DropdownMenuItem className="text-xs" onClick={() => handleCreateFile(file.path)}>
                                                <FilePlus className="h-3 w-3 mr-2" /> New File
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-xs" onClick={() => handleCreateFolder(file.path)}>
                                                <FolderPlus className="h-3 w-3 mr-2" /> New Folder
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                    <DropdownMenuItem className="text-xs" onClick={() => handleRename(file.path, file.name, file.is_directory)}>
                                        <Edit2 className="h-3 w-3 mr-2" /> Rename
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-xs text-destructive" onClick={() => handleDelete(file.path, file.name, file.is_directory)}>
                                        <Trash2 className="h-3 w-3 mr-2" /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    
                    {file.is_directory && expandedFolders.has(file.path) && (
                        <div>
                            {renderFileTree(file.path, depth + 1)}
                        </div>
                    )}
                </div>
            )
        })
    }

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center p-12">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
            </div>
        )
    }

    return (
        <>
            {/* File Tree */}
            <div className="flex flex-col h-full">
                <div className="px-2 py-1.5 border-b border-white/10 flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Files</span>
                    <div className="flex gap-0.5">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-white/10">
                                    <Plus className="h-3 w-3 text-slate-400" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="text-xs">
                                <DropdownMenuItem className="text-xs" onClick={() => handleCreateFile()}>
                                    <FilePlus className="h-3 w-3 mr-2" /> New File
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-xs" onClick={() => handleCreateFolder()}>
                                    <FolderPlus className="h-3 w-3 mr-2" /> New Folder
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-xs" onClick={() => fileInputRef.current?.click()}>
                                    <UploadCloud className="h-3 w-3 mr-2" /> Upload Files
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-xs" onClick={() => folderInputRef.current?.click()}>
                                    <Folder className="h-3 w-3 mr-2" /> Upload Folder
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-white/10" onClick={() => fetchFiles()}>
                            <RefreshCw className={`h-3 w-3 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>
                <div className="hidden">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        multiple 
                        onChange={(e) => handleUpload(e, false)} 
                    />
                    <input 
                        type="file" 
                        ref={folderInputRef} 
                        // @ts-ignore
                        webkitdirectory="" 
                        directory="" 
                        onChange={(e) => handleUpload(e, true)} 
                    />
                </div>
                <div className="flex-1 overflow-auto py-1 custom-scrollbar">
                    {renderFileTree()}
                </div>
            </div>

            <CreateItemModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={processCreation}
                //@ts-ignore
                type={createModalType}
                parentPath={createModalParentPath}
                existingNames={getExistingNames(createModalParentPath)}
            />

            <RenameModal 
                isOpen={isRenameModalOpen}
                onClose={() => setIsRenameModalOpen(false)}
                onRename={processRename}
                currentName={renamingItem?.name || ""}
                type={renamingItem?.type || "file"}
                existingNames={renamingItem ? getExistingNames(renamingItem.path.split('/').slice(0, -1).join('/')) : []}
            />

            <DeleteItemModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={processDelete}
                item={deletingItem}
            />
        </>
    );
}
