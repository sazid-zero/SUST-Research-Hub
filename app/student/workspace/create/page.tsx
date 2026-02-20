
"use client"

import { useActionState, useState } from "react"
import { createWorkspace } from "@/app/actions/workspace"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DEPARTMENTS, FIELDS_OF_STUDY } from "@/lib/constants/academic-data"

const initialState = {
  message: "",
  errors: undefined,
  success: false,
}

export default function CreateWorkspacePage() {
  const [workspaceType, setWorkspaceType] = useState("thesis")
  // @ts-ignore - useActionState types can be tricky with server actions
  const [state, formAction, pending] = useActionState(createWorkspace, initialState)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/student/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Create New Workspace</h1>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-8">
        <div className="mx-auto max-w-2xl">
          <form action={formAction}>
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>
                  Start a new research initiative. You can invite team members later.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {state?.message && !state.success && (
                    <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                        {state.message}
                    </div>
                )}

                <div className="space-y-3">
                  <Label>Workspace Type</Label>
                  <RadioGroup 
                    defaultValue="thesis" 
                    name="type" 
                    className="flex flex-col sm:flex-row gap-4"
                    onValueChange={(val) => setWorkspaceType(val)}
                  >
                    <div className="flex items-center space-x-2 border rounded-md p-4 flex-1 cursor-pointer hover:bg-accent transition-colors">
                      <RadioGroupItem value="thesis" id="thesis" />
                      <Label htmlFor="thesis" className="cursor-pointer font-medium">Thesis/Dissertation</Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-4 flex-1 cursor-pointer hover:bg-accent transition-colors">
                      <RadioGroupItem value="project" id="project" />
                      <Label htmlFor="project" className="cursor-pointer font-medium">Research Project</Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-4 flex-1 cursor-pointer hover:bg-accent transition-colors">
                      <RadioGroupItem value="publication" id="publication" />
                      <Label htmlFor="publication" className="cursor-pointer font-medium">Publication/Paper</Label>
                    </div>
                  </RadioGroup>
                </div>

                {workspaceType === "publication" && (
                    <div className="space-y-3 p-4 border rounded-md bg-muted/30">
                        <Label>Paper Subtype</Label>
                        <RadioGroup defaultValue="journal" name="paper_subtype" className="flex flex-row gap-6">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="journal" id="journal" />
                                <Label htmlFor="journal" className="cursor-pointer">Journal</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="conference" id="conference" />
                                <Label htmlFor="conference" className="cursor-pointer">Conference</Label>
                            </div>
                        </RadioGroup>
                    </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    placeholder="e.g., Analysis of Machine Learning Algorithms in Healthcare" 
                    required 
                    minLength={5}
                  />
                  {state?.errors?.title && <p className="text-destructive text-xs">{state.errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Abstract / Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="Briefly describe your research goals and methodology..." 
                    className="min-h-[120px]"
                    required
                    minLength={20}
                  />
                   {state?.errors?.description && <p className="text-destructive text-xs">{state.errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="department">Department (Optional)</Label>
                        <Select name="department">
                            <SelectTrigger id="department">
                                <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                                {DEPARTMENTS.map((dept) => (
                                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="field">Field of Study (Optional)</Label>
                        <Select name="field">
                            <SelectTrigger id="field">
                                <SelectValue placeholder="Select Field" />
                            </SelectTrigger>
                            <SelectContent>
                                {FIELDS_OF_STUDY.map((field) => (
                                    <SelectItem key={field} value={field}>{field}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

              </CardContent>
              <CardFooter className="flex justify-end gap-3">
                <Button variant="outline" asChild type="button">
                  <Link href="/student/dashboard">Cancel</Link>
                </Button>
                <Button type="submit" disabled={pending} className="min-w-[120px]">
                  {pending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Workspace"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
