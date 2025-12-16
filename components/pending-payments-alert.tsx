"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { getTopics } from "@/lib/actions/learner-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"

export function PendingPaymentsAlert() {
    const { data: session } = useSession()
    const [pendingCount, setPendingCount] = useState(0)

    useEffect(() => {
        if ((session?.user as any)?.id) {
            getTopics((session!.user as any).id).then(topics => {
                const count = topics.filter((t: any) => t.paymentStatus === 'PENDING').length
                setPendingCount(count)
            })
        }
    }, [session])

    if (pendingCount === 0) return null

    return (
        <Alert className="border-yellow-500/50 bg-yellow-500/10 mb-6">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-700 font-semibold">Payment Pending</AlertTitle>
            <AlertDescription className="text-yellow-600 flex items-center justify-between">
                <span>
                    You have {pendingCount} topic{pendingCount > 1 ? 's' : ''} awaiting payment approval. Access will be granted once approved.
                </span>
                <Button variant="link" className="h-auto p-0 text-yellow-800 ml-4 font-bold" asChild>
                    <Link href="/quiz">
                        View Topics <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </Button>
            </AlertDescription>
        </Alert>
    )
}
