
"use client"

import { useState, useMemo } from "react"
import { Folder, FileCode, FileText, File, ChevronRight, Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"

interface FileItem {
  id: number
  file_name: string
  file_path: string | null
  file_url: string
  file_type?: string
  file_size?: number
  uploaded_at?: string
}

interface FileBrowserProps {
  files: FileItem[]
  workspaceId: number
  readOnly?: boolean
}

type FileNode = {
  name: string
  path: string
  type: "file" | "folder"
  file?: FileItem
  children?: Record<string, FileNode>
}

export function FileBrowser({ files, workspaceId, readOnly = false }: FileBrowserProps) {
  const [currentPath, setCurrentPath] = useState<string[]>([])

  // specific to thesis_files/project_files. 
  // We need to build a tree from file_path (e.g. "src/components/Button.tsx")
  
  const fileTree = useMemo(() => {
    const root: Record<string, FileNode> = {}

    files.forEach(file => {
      const pathParts = (file.file_path || file.file_name).split('/').filter(p => p)
      // If file_path is null, treat file_name as root level file
      
      let currentLevel = root
      
      pathParts.forEach((part, index) => {
        const isFile = index === pathParts.length - 1
        
        if (!currentLevel[part]) {
          currentLevel[part] = {
            name: part,
            path: pathParts.slice(0, index + 1).join('/'),
            type: isFile ? "file" : "folder",
            file: isFile ? file : undefined,
            children: isFile ? undefined : {}
          }
        }
        
        if (!isFile) {
          currentLevel = currentLevel[part].children!
        }
      })
    })

    return root
  }, [files])

  const currentFolder = useMemo(() => {
    let current = fileTree
    for (const part of currentPath) {
      if (current[part] && current[part].children) {
        current = current[part].children!
      } else {
        return {} // Should not happen if path is valid
      }
    }
    return current
  }, [fileTree, currentPath])

  const sortedItems = useMemo(() => {
    return Object.values(currentFolder).sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name)
      return a.type === "folder" ? -1 : 1
    })
  }, [currentFolder])

  const navigateTo = (folderName: string) => {
    setCurrentPath([...currentPath, folderName])
  }

  const navigateUp = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1))
  }
  
  const resetPath = () => setCurrentPath([])

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.tsx') || fileName.endsWith('.ts') || fileName.endsWith('.js') || fileName.endsWith('.py')) return <FileCode className="h-4 w-4 text-blue-500" />
    if (fileName.endsWith('.md') || fileName.endsWith('.txt')) return <FileText className="h-4 w-4 text-gray-500" />
    return <File className="h-4 w-4 text-gray-400" />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
               <BreadcrumbLink onClick={resetPath} className="cursor-pointer font-semibold">root</BreadcrumbLink>
            </BreadcrumbItem>
            {currentPath.map((part, index) => (
                <div key={part} className="flex items-center">
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        {index === currentPath.length - 1 ? (
                            <BreadcrumbPage>{part}</BreadcrumbPage>
                        ) : (
                            <BreadcrumbLink onClick={() => navigateUp(index)} className="cursor-pointer">{part}</BreadcrumbLink>
                        )}
                    </BreadcrumbItem>
                </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        
        {!readOnly && (
            <div className="flex gap-2">
                 <Button size="sm" variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload File
                 </Button>
            </div>
        )}
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-[100px]">Size</TableHead>
              <TableHead className="w-[150px]">Uploaded</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPath.length > 0 && (
                <TableRow className="hover:bg-muted/50 cursor-pointer" onClick={() => setCurrentPath(currentPath.slice(0, -1))}>
                    <TableCell><Folder className="h-4 w-4 fill-blue-100 text-blue-500" /></TableCell>
                    <TableCell className="font-medium">..</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            )}
            
            {sortedItems.length > 0 ? sortedItems.map((item) => (
              <TableRow 
                key={item.name} 
                className={item.type === 'folder' ? "hover:bg-muted/50 cursor-pointer" : ""}
                onClick={() => item.type === 'folder' && navigateTo(item.name)}
              >
                <TableCell>
                    {item.type === 'folder' ? (
                        <Folder className="h-4 w-4 fill-blue-100 text-blue-500" />
                    ) : (
                        getFileIcon(item.name)
                    )}
                </TableCell>
                <TableCell className="font-medium">
                    {item.type === 'file' && item.file ? (
                        <a href={item.file.file_url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            {item.name}
                        </a>
                    ) : (
                        item.name
                    )}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                    {item.type === 'file' && item.file?.file_size ? `${(item.file.file_size / 1024).toFixed(1)} KB` : '-'}
                </TableCell>
                 <TableCell className="text-muted-foreground text-xs">
                     {item.type === 'file' && item.file?.uploaded_at ? new Date(item.file.uploaded_at).toLocaleDateString() : '-'}
                 </TableCell>
                 <TableCell>
                    {item.type === 'file' && item.file && (
                         <a href={item.file.file_url} download target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                            <Download className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </a>
                    )}
                 </TableCell>
              </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Empty directory
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
