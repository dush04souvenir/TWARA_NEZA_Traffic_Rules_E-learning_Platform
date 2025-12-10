"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card"
import { getFocusAreas } from "@/lib/actions/learner-actions"
import { AlertTriangle, BookOpen } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

export function WeaknessDetector() {
    const { data: session } = useSession()
    const router = useRouter()
    const [weakQuestions, setWeakQuestions] = useState<{ id: string, text: string, topic: string, topicId: string }[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (session?.user && (session.user as any).id) {
            getFocusAreas((session.user as any).id).then(data => {
                setWeakQuestions(data)
                setLoading(false)
            })
        }
    }, [session])

    if (loading || weakQuestions.length === 0) return null;

    return (
        <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/10">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-orange-700 dark:text-orange-400">
                    <AlertTriangle className="w-5 h-5" />
                    AI Focus Areas
                </CardTitle>
                <CardDescription>Based on your recent mistakes, review these:</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {weakQuestions.map((q, idx) => (
                        <div key={idx} className="bg-background rounded-md p-3 border shadow-sm text-sm">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">{q.topic}</span>
                            </div>
                            <p className="font-medium text-foreground mb-2">{q.text}</p>
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-orange-600 border-orange-200 hover:bg-orange-100"
                        onClick={() => {
                            if (weakQuestions.length > 0) {
                                router.push(`/quiz?topicId=${weakQuestions[0].topicId}`)
                            }
                        }}
                    >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Start Targeted Practice
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
