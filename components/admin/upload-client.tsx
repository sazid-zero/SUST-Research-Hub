"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, Search, User as UserIcon, Loader2, Info } from "lucide-react"
import { uploadLegacyWorkspace } from "@/app/actions/admin-upload"

interface RegisteredUser {
  id: number
  full_name: string
  role: string
  department: string | null
}

interface AdminUploadClientProps {
  registeredUsers: RegisteredUser[]
}

export default function AdminUploadClient({ registeredUsers }: AdminUploadClientProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [type, setType] = useState<"thesis" | "publication" | "project">("publication")
  
  // Form fields
  const [title, setTitle] = useState("")
  const [abstract, setAbstract] = useState("")
  const [department, setDepartment] = useState("")
  const [field, setField] = useState("")
  const [year, setYear] = useState(new Date().getFullYear().toString())
  // Publication-specific
  const [doi, setDoi] = useState("")
  const [journalName, setJournalName] = useState("")
  const [status, setStatus] = useState("approved")
  
  // Hybrid Author System
  const [authors, setAuthors] = useState<{name: string, userId: number | null}[]>([])
  const [currentAuthorInput, setCurrentAuthorInput] = useState("")
  const [selectedRegisteredUser, setSelectedRegisteredUser] = useState<string>("none")

  const handleAddGhostAuthor = () => {
      if (!currentAuthorInput.trim()) return
      setAuthors([...authors, { name: currentAuthorInput.trim(), userId: null }])
      setCurrentAuthorInput("")
  }

  const handleAddRegisteredAuthor = () => {
      if (selectedRegisteredUser === "none") return
      const user = registeredUsers.find(u => u.id.toString() === selectedRegisteredUser)
      if (user) {
          // Check if already added
          if (authors.some(a => a.userId === user.id)) {
              toast.error("User is already added as an author.")
              return
          }
          setAuthors([...authors, { name: user.full_name, userId: user.id }])
          setSelectedRegisteredUser("none")
      }
  }

  const handleRemoveAuthor = (index: number) => {
      setAuthors(authors.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!title || authors.length === 0) {
          toast.error("Please provide a title and at least one author.")
          return
      }

      setIsSubmitting(true)
      const formData = new FormData()
      formData.append("type", type)
      formData.append("title", title)
      formData.append("abstract", abstract)
      formData.append("department", department)
      formData.append("field", field)
      formData.append("year", year)
      formData.append("status", status)
      formData.append("authors", JSON.stringify(authors))
      if (type === 'publication') {
          formData.append("doi", doi)
          formData.append("journal_name", journalName)
      }

      try {
          const result = await uploadLegacyWorkspace(formData)
          if (result.success) {
              toast.success(result.message)
              router.push('/admin/theses')
          } else {
              toast.error(result.message)
          }
      } catch (err) {
          toast.error("Failed to upload legacy record.")
      } finally {
          setIsSubmitting(false)
      }
  }

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-[#0b1120] min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
            <h1 className="text-3xl font-black text-foreground">Import Legacy Record</h1>
            <p className="text-muted-foreground mt-2">Add historical theses, publications, or projects. You can mix registered users and unregistered "ghost" authors.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle>Core Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Record Type</label>
                            <Select value={type} onValueChange={(v: any) => setType(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="publication">Scholarly Publication</SelectItem>
                                    <SelectItem value="thesis">Academic Thesis</SelectItem>
                                    <SelectItem value="project">Research Project</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Publication Year</label>
                            <Input value={year} onChange={e => setYear(e.target.value)} type="number" />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Title</label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Analysis of Deep Learning Models..." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Department</label>
                            <Input value={department} onChange={e => setDepartment(e.target.value)} placeholder="e.g. Computer Science and Engineering" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Field / Specialization</label>
                            <Input value={field} onChange={e => setField(e.target.value)} placeholder="e.g. Machine Learning" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Status</label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="approved">Approved & Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="pending_review">Pending Review</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {type === 'publication' && (
                        <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Journal / Conference Name</label>
                                <Input value={journalName} onChange={e => setJournalName(e.target.value)} placeholder="e.g. IEEE Access" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">DOI <span className="text-xs text-muted-foreground">(for citation sync)</span></label>
                                <Input value={doi} onChange={e => setDoi(e.target.value)} placeholder="e.g. 10.1109/ACCESS.2024.12345" />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Abstract / Description</label>
                        <textarea 
                            value={abstract} 
                            onChange={e => setAbstract(e.target.value)} 
                            className="w-full min-h-[150px] bg-background border border-input rounded-md p-3 text-sm focus:ring-2 focus:ring-primary/20"
                            placeholder="Optional abstract or description..."
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-sm overflow-hidden">
                <div className="bg-primary h-1" />
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-primary" />
                        Hybrid Author Assignment
                    </CardTitle>
                    <CardDescription>
                        Search for an existing user to link their profile immediately, or type a plain text name for a "Ghost Author". Unregistered authors can claim their work later.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Add Registered User */}
                    <div className="flex gap-3 items-end">
                        <div className="flex-1 space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Select Registered User</label>
                            <Select value={selectedRegisteredUser} onValueChange={setSelectedRegisteredUser}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Search users..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">-- Select a user --</SelectItem>
                                    {registeredUsers.map(user => (
                                        <SelectItem key={user.id} value={user.id.toString()}>
                                            {user.full_name} ({user.role})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="button" onClick={handleAddRegisteredAuthor} variant="secondary" className="h-11 px-6 font-bold">
                            Add User
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">OR</span></div>
                    </div>

                    {/* Add Ghost Author */}
                    <div className="flex gap-3 items-end">
                        <div className="flex-1 space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Add Ghost Author (Unregistered)</label>
                            <Input 
                                value={currentAuthorInput} 
                                onChange={e => setCurrentAuthorInput(e.target.value)} 
                                placeholder="Type author's full name... e.g. Dr. Muhammed Zafar Iqbal"
                                className="h-11"
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter') {
                                        e.preventDefault()
                                        handleAddGhostAuthor()
                                    }
                                }}
                            />
                        </div>
                        <Button type="button" onClick={handleAddGhostAuthor} variant="outline" className="h-11 px-6 font-bold border-dashed border-2">
                            Add Ghost
                        </Button>
                    </div>

                    {/* Authors List */}
                    {authors.length > 0 && (
                        <div className="pt-4 space-y-3">
                            <h4 className="text-sm font-semibold">Assigned Authors</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {authors.map((author, idx) => (
                                    <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border ${author.userId ? 'bg-primary/5 border-primary/20' : 'bg-muted/50 border-dashed'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${author.userId ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                                {author.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold">{author.name}</span>
                                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                                                    {author.userId ? 'Registered User' : 'Ghost Author'}
                                                </span>
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => handleRemoveAuthor(idx)} className="text-muted-foreground hover:text-rose-500 p-2">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()} className="h-12 px-8 rounded-full font-bold">
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="h-12 px-8 rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Upload className="w-5 h-5 mr-2" />}
                    Import Record
                </Button>
            </div>
        </form>
      </div>
    </div>
  )
}
