"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent } from "./ui/card"
import { checkBadgeEligibility } from "@/lib/actions/learner-actions"
import { Award, Share2 } from "lucide-react"
import { Button } from "./ui/button"

export function LearnerBadges() {
    const { data: session } = useSession()
    const [eligible, setEligible] = useState(false)

    useEffect(() => {
        if (session?.user && (session.user as any).id) {
            checkBadgeEligibility((session.user as any).id).then(isEligible => {
                setEligible(isEligible)
            })
        }
    }, [session])

    if (!eligible) return null;

    return (
        <Card className="border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/10 mb-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Award className="w-32 h-32 text-yellow-600" />
            </div>
            <CardContent className="flex items-center justify-between p-6 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                        <Award className="w-6 h-6" />
                        <span className="font-bold tracking-tight uppercase text-sm">Certification Ready</span>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Road Ready Badge Unlocked!</h3>
                    <p className="text-muted-foreground max-w-md">
                        You've consistently scored above 80%. You are ready for the real exam!
                    </p>
                </div>
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white border-0 shadow-lg">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Achievement
                </Button>
            </CardContent>
        </Card>
    )
}
