
"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FilePlus, FolderPlus, Loader2, Edit3, AlertTriangle, CheckCircle2, UploadCloud } from "lucide-react"

interface CreateItemModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (name: string) => Promise<void>
  type: "file" | "folder"
  parentPath?: string
  existingNames?: string[]
}

export function CreateItemModal({
  isOpen,
  onClose,
  onCreate,
  type,
  parentPath,
  existingNames = [],
}: CreateItemModalProps) {
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setName("")
      setError(null)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()
    
    if (!trimmedName) {
      setError("Name cannot be empty")
      return
    }

    if (/[<>:"|?*]/.test(trimmedName)) {
      setError("Name contains invalid characters")
      return
    }

    if (existingNames.includes(trimmedName)) {
      setError(`A ${type} with this name already exists in this directory`)
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      await onCreate(trimmedName)
      onClose()
    } catch (err) {
      setError("Failed to create item. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-2xl animate-in fade-in zoom-in duration-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {type === "file" ? (
              <FilePlus className="h-5 w-5 text-primary" />
            ) : (
              <FolderPlus className="h-5 w-5 text-primary" />
            )}
            Create New {type === "file" ? "File" : "Folder"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="item-name" className="text-sm font-medium">
              {type === "file" ? "File Name" : "Folder Name"}
              {parentPath && (
                <span className="text-muted-foreground font-normal ml-1">
                  in <code className="bg-muted px-1 rounded text-xs">{parentPath}</code>
                </span>
              )}
            </Label>
            <Input
              id="item-name"
              placeholder={type === "file" ? "e.g., script.py" : "e.g., src"}
              value={name}
              onChange={(e) => {
                  setName(e.target.value)
                  if (error) setError(null)
              }}
              className="bg-background border-border focus:ring-primary/20"
              autoFocus
            />
            {error && <p className="text-xs text-destructive mt-1 font-medium">{error}</p>}
          </div>
          <DialogFooter className="flex sm:justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
              className="hover:bg-accent"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[80px]">
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface RenameModalProps {
  isOpen: boolean
  onClose: () => void
  onRename: (newName: string) => Promise<void>
  currentName: string
  type: "file" | "folder"
  existingNames?: string[]
}

export function RenameModal({
  isOpen,
  onClose,
  onRename,
  currentName,
  type,
  existingNames = [],
}: RenameModalProps) {
  const [name, setName] = useState(currentName)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setName(currentName)
      setError(null)
    }
  }, [isOpen, currentName])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()

    if (!trimmedName) {
      setError("Name cannot be empty")
      return
    }

    if (trimmedName === currentName) {
      onClose()
      return
    }

    if (/[<>:"|?*]/.test(trimmedName)) {
      setError("Name contains invalid characters")
      return
    }

    if (existingNames.includes(trimmedName)) {
      setError(`A ${type} with this name already exists in this directory`)
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      await onRename(trimmedName)
      onClose()
    } catch (err) {
      setError("Failed to rename item. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-2xl animate-in fade-in zoom-in duration-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Edit3 className="h-5 w-5 text-primary" />
            Rename {type === "file" ? "File" : "Folder"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rename-name" className="text-sm font-medium">
              New Name
            </Label>
            <Input
              id="rename-name"
              value={name}
              onChange={(e) => {
                  setName(e.target.value)
                  if (error) setError(null)
              }}
              className="bg-background border-border focus:ring-primary/20"
              autoFocus
            />
            {error && <p className="text-xs text-destructive mt-1 font-medium">{error}</p>}
          </div>
            <DialogFooter className="flex sm:justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
              className="hover:bg-accent"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[80px]">
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Rename"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface UploadStatusModalProps {
  isOpen: boolean
  onClose: () => void
  totalItems: number
  processedItems: number
  isComplete: boolean
  error?: string | null
}

export function UploadStatusModal({
  isOpen,
  onClose,
  totalItems,
  processedItems,
  isComplete,
  error,
}: UploadStatusModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={isComplete ? onClose : undefined}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-2xl animate-in fade-in zoom-in duration-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {isComplete ? (
              error ? <AlertTriangle className="h-5 w-5 text-destructive" /> : <CheckCircle2 className="h-5 w-5 text-primary" />
            ) : (
              <UploadCloud className="h-5 w-5 text-primary animate-bounce" />
            )}
            {isComplete ? (error ? "Upload Failed" : "Upload Complete") : "Uploading Items..."}
          </DialogTitle>
        </DialogHeader>
        <div className="py-6 space-y-4">
          <div className="flex justify-between text-sm font-medium">
            <span>{isComplete ? (error ? "Error occurred" : "All items processed") : "Progress"}</span>
            <span>{processedItems} / {totalItems}</span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-in-out" 
              style={{ width: `${(processedItems / totalItems) * 100}%` }}
            />
          </div>
          {error && <p className="text-sm text-destructive font-medium">{error}</p>}
          {isComplete && !error && (
            <p className="text-sm text-muted-foreground">
              Successfully uploaded {totalItems} item(s) to your workspace.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose} disabled={!isComplete} className="w-full">
            {isComplete ? "Close" : "Uploading..."}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type: "success" | "error" | "info"
}

export function FeedbackModal({
  isOpen,
  onClose,
  title,
  message,
  type,
}: FeedbackModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-2xl animate-in fade-in zoom-in duration-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {type === "success" && <CheckCircle2 className="h-5 w-5 text-primary" />}
            {type === "error" && <AlertTriangle className="h-5 w-5 text-destructive" />}
            {type === "info" && <Loader2 className="h-5 w-5 text-primary animate-spin" />}
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            Dismiss
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface DeleteItemModalProps {
    isOpen: boolean
    onClose: () => void
    onDelete: () => Promise<void>
    item: { path: string, name: string, type: "file" | "folder" } | null
}

export function DeleteItemModal({
    isOpen,
    onClose,
    onDelete,
    item
}: DeleteItemModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleDelete = async () => {
        setIsSubmitting(true)
        try {
            await onDelete()
            onClose()
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!item) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-card border-border shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Delete {item.type === "file" ? "File" : "Folder"}
                    </DialogTitle>
                </DialogHeader>
                <div className="py-6">
                    <p className="text-sm text-foreground mb-2 font-bold">Are you absolutely sure?</p>
                    <p className="text-sm text-muted-foreground">
                        This will permanently delete <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">{item.path}</code> and cannot be undone.
                    </p>
                </div>
                <DialogFooter className="flex sm:justify-end gap-2">
                    <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Permanently"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
