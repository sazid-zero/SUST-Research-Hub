
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
import { Textarea } from "@/components/ui/textarea"
import { GraduationCap, Loader2, Search, X, Mail, ChevronDown } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { useActionState } from "react"
import { requestSupervision } from "@/app/actions/workspace"
import { User } from "@/lib/db/users"

const initialState = {
  message: "",
  success: false,
}

interface SupervisionRequestDialogProps {
  workspaceId: number
  type: "thesis" | "project" | "publication"
  supervisors: User[]
}

export function SupervisionRequestDialog({ workspaceId, type, supervisors }: SupervisionRequestDialogProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSupervisor, setSelectedSupervisor] = useState<User | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)

  // @ts-ignore
  const [state, formAction, pending] = useActionState(requestSupervision, initialState)

  // Filter supervisors based on search query
  const filteredSupervisors = useMemo(() => {
    if (!searchQuery) return supervisors
    const query = searchQuery.toLowerCase()
    return supervisors.filter(s => 
      s.full_name?.toLowerCase().includes(query) || 
      s.email?.toLowerCase().includes(query)
    )
  }, [searchQuery, supervisors])

  const handleSelect = (supervisor: User) => {
    setSelectedSupervisor(supervisor)
    setSearchQuery(supervisor.full_name)
    setShowDropdown(false)
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.supervisor-selector-container')) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearchQuery("")
      setSelectedSupervisor(null)
      setShowDropdown(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
            <GraduationCap className="mr-2 h-4 w-4" />
            Request Supervisor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <form action={formAction}>
            <input type="hidden" name="workspaceId" value={workspaceId} />
            <input type="hidden" name="type" value={type} />
            {selectedSupervisor && <input type="hidden" name="supervisorId" value={selectedSupervisor.id} />}
            
            <DialogHeader>
            <DialogTitle>Request Supervision</DialogTitle>
            <DialogDescription>
                Search and select a faculty member to propose your topic.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            
            {state?.message && (
                <div className={`p-3 text-sm rounded-md ${state.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {state.message}
                </div>
            )}

            <div className="space-y-2 relative supervisor-selector-container">
                <Label htmlFor="supervisor-search">Select Supervisor</Label>
                <div className="relative">
                  <Input
                    id="supervisor-search"
                    placeholder="Search by name, email, or specialization..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setShowDropdown(true)
                      if (selectedSupervisor && e.target.value !== selectedSupervisor.full_name) {
                        setSelectedSupervisor(null)
                      }
                    }}
                    onFocus={() => setShowDropdown(true)}
                    className="pr-10"
                    autoComplete="off"
                    required={!selectedSupervisor}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {searchQuery ? (
                      <button 
                        type="button" 
                        onClick={() => {
                          setSearchQuery("")
                          setSelectedSupervisor(null)
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : (
                      <Search className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>

                  {/* Search Results Dropdown */}
                  {showDropdown && filteredSupervisors.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                      {filteredSupervisors.map((supervisor) => (
                        <button
                          key={supervisor.id}
                          type="button"
                          onClick={() => handleSelect(supervisor)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-100 last:border-b-0 transition"
                        >
                          <div className="font-medium text-gray-900">{supervisor.full_name}</div>
                          <div className="flex gap-4 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {supervisor.email}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {showDropdown && searchQuery && filteredSupervisors.length === 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-border rounded-md shadow-xl z-50 p-4 text-center text-sm text-muted-foreground">
                      No matching supervisors found
                    </div>
                  )}
                </div>
                
                {/* Selected Display */}
                {selectedSupervisor && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-md border border-blue-200">
                    <div className="font-medium text-sm">{selectedSupervisor.full_name}</div>
                    <div className="text-xs text-gray-600">{selectedSupervisor.email}</div>
                  </div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="topicProposal">Topic Proposal / Message</Label>
                <Textarea 
                    id="topicProposal" 
                    name="topicProposal" 
                    placeholder="Describe your proposed research topic and why you want to work with this supervisor..."
                    className="min-h-[120px]"
                    required
                />
            </div>
            
            </div>
            <DialogFooter>
            <Button type="submit" disabled={pending || !selectedSupervisor}>
                {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Send Request
            </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
