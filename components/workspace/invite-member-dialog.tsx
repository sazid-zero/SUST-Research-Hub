
"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserPlus, Loader2, User, Mail, Hash } from "lucide-react"
import { useState, useEffect } from "react"
import { useActionState } from "react"
import { inviteMember, searchUsersAction, addGhostAuthor } from "@/app/actions/workspace"

const initialState = {
  message: "",
  success: false,
}

interface User {
  id: number
  full_name: string
  email: string
  student_id?: string
}

interface InviteMemberDialogProps {
  workspaceId: number
  type: "thesis" | "project" | "publication"
  children?: React.ReactNode
}

export function InviteMemberDialog({ workspaceId, type, children }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isAddingGhost, setIsAddingGhost] = useState(false)
  const [ghostError, setGhostError] = useState("")
  const [ghostSuccess, setGhostSuccess] = useState("")
  
  // @ts-ignore
  const [state, formAction, pending] = useActionState(inviteMember, initialState)

  const handleAddGhost = async () => {
    if (!searchQuery || searchQuery.trim() === '') return
    setIsAddingGhost(true)
    setGhostError("")
    setGhostSuccess("")
    
    const result = await addGhostAuthor(workspaceId, searchQuery.trim())
    if (result.success) {
      setGhostSuccess(result.message || "Ghost author added")
      setTimeout(() => {
        handleClose()
      }, 1500)
    } else {
      setGhostError(result.message || "Failed to add ghost author")
    }
    setIsAddingGhost(false)
  }

  // Search users as user types
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true)
        try {
          const result = await searchUsersAction(searchQuery)
          if (result.success) {
            setSearchResults(result.users as User[])
            setShowDropdown(true)
          }
        } catch (error) {
          console.error("Search error:", error)
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
        setShowDropdown(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
    setSearchQuery(user.full_name)
    setShowDropdown(false)
  }

  const handleClose = () => {
    setOpen(false)
    setSearchQuery("")
    setSelectedUser(null)
    setSearchResults([])
    setGhostError("")
    setGhostSuccess("")
  }

  // Show role selector only for project
  const showRoleSelector = type === 'project'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite {type === 'project' ? 'Member' : 'Co-Author'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
            <input type="hidden" name="workspaceId" value={workspaceId} />
            <input type="hidden" name="type" value={type} />
            {selectedUser && <input type="hidden" name="userId" value={selectedUser.id} />}
            
            <DialogHeader>
            <DialogTitle>Invite {type === 'project' ? 'Member' : 'Co-Author'}</DialogTitle>
            <DialogDescription>
                {type === 'project' 
                  ? `Add a collaborator to your project team.`
                  : `Invite a co-author to collaborate on your ${type}.`}
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            
            {state?.message && !ghostError && !ghostSuccess && (
                <div className={`p-2 text-sm rounded ${state.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {state.message}
                </div>
            )}
            {ghostError && (
                <div className="p-2 text-sm rounded bg-red-100 text-red-800">
                    {ghostError}
                </div>
            )}
            {ghostSuccess && (
                <div className="p-2 text-sm rounded bg-green-100 text-green-800">
                    {ghostSuccess}
                </div>
            )}

            {/* User Search */}
            <div className="grid grid-cols-4 items-center gap-4 relative">
                <Label htmlFor="user-search" className="text-right">
                Search User
                </Label>
                <div className="col-span-3 relative">
                  <Input
                    id="user-search"
                    placeholder="Type name, email, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                    className="w-full"
                  />
                  
                  {/* Dropdown Results */}
                  {showDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                      {isSearching ? (
                        <div className="p-3 text-center text-gray-500">
                          <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
                          Searching...
                        </div>
                      ) : searchResults.length > 0 ? (
                        searchResults.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => handleSelectUser(user)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-100 last:border-b-0 transition"
                          >
                            <div className="font-medium text-gray-900">{user.full_name}</div>
                            <div className="flex gap-4 text-xs text-gray-500 mt-1">
                              {user.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {user.email}
                                </span>
                              )}
                              {user.student_id && (
                                <span className="flex items-center gap-1">
                                  <Hash className="h-3 w-3" />
                                  {user.student_id}
                                </span>
                              )}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-center text-gray-500 text-sm">
                          <p className="mb-2">No users found</p>
                          {type === 'publication' && (
                              <Button 
                                type="button" 
                                variant="secondary" 
                                size="sm" 
                                className="w-full mt-2 text-xs"
                                onClick={handleAddGhost}
                                disabled={isAddingGhost}
                              >
                                {isAddingGhost ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <UserPlus className="w-3 h-3 mr-2" />}
                                Add &quot;{searchQuery}&quot; as Ghost Author
                              </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
            </div>

            {/* Selected User Display */}
            {selectedUser && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-xs text-gray-500">Selected</Label>
                <div className="col-span-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                  <div className="font-medium text-sm">{selectedUser.full_name}</div>
                  <div className="text-xs text-gray-600">{selectedUser.email}</div>
                </div>
              </div>
            )}

            {/* Role Selector (for thesis and project only) */}
            {showRoleSelector && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                Role
                </Label>
                <Select name="role" defaultValue="member">
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="leader">Co-Leader</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            )}
            </div>
            <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending || !selectedUser}>
                {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Send Invite
            </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
