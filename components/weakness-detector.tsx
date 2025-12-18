"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card"
import { getFocusAreas } from "@/lib/actions/learner-actions"
import { AlertTriangle, BookOpen } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function WeaknessDetector() {
    const { data: session } = useSession()
    const router = useRouter()
    const [weakQuestions, setWeakQuestions] = useState<{ id: string, text: string, topic: string, topicId: string, correctAnswer: string }[]>([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (session?.user && (session.user as any).id) {
            getFocusAreas((session.user as any).id).then(data => {
                setWeakQuestions(data as any)
                setLoading(false)
            })
        }
    }, [session])

    if (loading || weakQuestions.length === 0) return null;

    return (
        <>
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
                            onClick={() => setOpen(true)}
                        >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Review Weaknesses
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Review Your Weaknesses</DialogTitle>
                        <DialogDescription>
                            Here are the questions you missed. Review the correct answers to improve.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                        {weakQuestions.map((q, i) => (
                            <div key={i} className="space-y-2 border-b pb-4 last:border-0">
                                <span className="text-xs font-semibold text-muted-foreground uppercase">{q.topic}</span>
                                <h3 className="font-medium text-lg">{q.text}</h3>
                                <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-md border border-green-200 dark:border-green-800">
                                    <span className="text-xs font-bold text-green-700 dark:text-green-400 block mb-1">CORRECT ANSWER</span>
                                    <p className="text-green-800 dark:text-green-300">{q.correctAnswer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-4 flex justify-end">
                        <Button onClick={() => setOpen(false)}>Close Review</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
