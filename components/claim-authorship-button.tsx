"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserCheck, Loader2 } from "lucide-react"
import { submitAuthorshipClaim } from "@/app/actions/claims"
import { toast } from "sonner"

interface ClaimAuthorshipButtonProps {
    workspaceType: "thesis" | "publication"
    workspaceId: number
    authorName: string
    isLoggedIn: boolean
}

export function ClaimAuthorshipButton({ workspaceType, workspaceId, authorName, isLoggedIn }: ClaimAuthorshipButtonProps) {
    const [isClaiming, setIsClaiming] = useState(false)
    const [claimed, setClaimed] = useState(false)

    const handleClaim = async () => {
        if (!isLoggedIn) {
            toast.error("Please log in to claim authorship.")
            return
        }

        setIsClaiming(true)
        const result = await submitAuthorshipClaim(workspaceType, workspaceId, authorName)
        if (result.success) {
            toast.success(result.message)
            setClaimed(true)
        } else {
            toast.error(result.message)
        }
        setIsClaiming(false)
    }

    if (claimed) {
        return (
            <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/20 px-2 py-0.5">
                Claim Pending
            </Badge>
        )
    }

    return (
        <Button
            size="sm"
            variant="ghost"
            onClick={handleClaim}
            disabled={isClaiming}
            className="h-6 px-2 text-[10px] text-primary hover:bg-primary/10 hover:text-primary font-bold"
        >
            {isClaiming ? (
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
            ) : (
                <UserCheck className="w-3 h-3 mr-1" />
            )}
            Claim
        </Button>
    )
}
