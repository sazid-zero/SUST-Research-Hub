"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, ExternalLink, UserCheck, Search, Filter } from "lucide-react"
import { resolveAuthorshipClaim } from "@/app/actions/claims"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface AdminClaimsClientProps {
    initialClaims: any[]
}

export function AdminClaimsClient({ initialClaims }: AdminClaimsClientProps) {
    const [claims, setClaims] = useState(initialClaims)
    const [isResolving, setIsResolving] = useState<number | null>(null)
    const [search, setSearch] = useState("")

    const filteredClaims = claims.filter(c => 
        c.claimant_name?.toLowerCase().includes(search.toLowerCase()) || 
        c.author_name_matched?.toLowerCase().includes(search.toLowerCase()) ||
        c.workspace_title?.toLowerCase().includes(search.toLowerCase())
    )

    const handleResolve = async (claimId: number, action: "approved" | "rejected") => {
        setIsResolving(claimId)
        const result = await resolveAuthorshipClaim(claimId, action)
        if (result.success) {
            toast.success(result.message)
            setClaims(claims.filter(c => c.id !== claimId))
        } else {
            toast.error(result.message)
        }
        setIsResolving(null)
    }

    return (
        <div className="flex-1 bg-[#f8fafc] dark:bg-[#0b1120] min-h-screen p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                            <UserCheck className="w-8 h-8 text-primary" />
                            Authorship Claims
                        </h1>
                        <p className="text-muted-foreground mt-2 max-w-2xl">
                            Review requests from users claiming to be "Ghost Authors" on legacy theses or publications. Approving a claim will permanently link their account to the work.
                        </p>
                    </div>
                </div>

                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-3 border-b border-border/50">
                        <div className="flex items-center justify-between">
                            <CardTitle>Pending Reviews ({claims.length})</CardTitle>
                            <div className="flex items-center gap-3 w-72">
                                <div className="relative w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input 
                                        value={search} 
                                        onChange={e => setSearch(e.target.value)} 
                                        placeholder="Search claims..." 
                                        className="pl-9 h-9"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {filteredClaims.length > 0 ? (
                            <div className="divide-y divide-border/50">
                                {filteredClaims.map((claim) => (
                                    <div key={claim.id} className="p-6 flex flex-col lg:flex-row gap-6 hover:bg-muted/20 transition-colors">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start gap-4">
                                                <Badge variant="outline" className={`shrink-0 ${claim.workspace_type === 'thesis' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 'bg-green-500/10 text-green-600 border-green-500/20'}`}>
                                                    {claim.workspace_type.toUpperCase()}
                                                </Badge>
                                                <Link href={`/${claim.workspace_type === 'thesis' ? 'thesis' : 'paper'}/${claim.workspace_id}`} className="font-bold text-lg hover:text-primary transition-colors flex items-center gap-2">
                                                    {claim.workspace_title}
                                                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                                </Link>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 rounded-lg p-4 border border-border/50">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Ghost Author (Target)</p>
                                                    <p className="font-semibold">{claim.author_name_matched}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Claimant User</p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold text-primary">{claim.claimant_name}</p>
                                                        <Badge variant="secondary" className="text-[10px]">{claim.claimant_role}</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">{claim.claimant_email} • {claim.claimant_student_id || 'No Student ID'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex lg:flex-col justify-end gap-3 lg:border-l lg:border-border/50 lg:pl-6 shrink-0">
                                            <Button 
                                                variant="default" 
                                                className="bg-emerald-600 hover:bg-emerald-700 font-bold"
                                                onClick={() => handleResolve(claim.id, "approved")}
                                                disabled={isResolving === claim.id}
                                            >
                                                <Check className="w-4 h-4 mr-2" />
                                                Approve
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                                                onClick={() => handleResolve(claim.id, "rejected")}
                                                disabled={isResolving === claim.id}
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                                    <UserCheck className="w-8 h-8 text-muted-foreground/50" />
                                </div>
                                <h3 className="text-lg font-bold">No pending claims</h3>
                                <p className="text-muted-foreground">You're all caught up! There are no ghost author claims waiting for review.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
