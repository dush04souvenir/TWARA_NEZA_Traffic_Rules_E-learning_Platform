"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card"
import { getUserProgress } from "@/lib/actions/learner-actions"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Check, X, Eye, FileText } from "lucide-react"
import { Button } from "./ui/button"

export function RecentActivity() {
  const { data: session } = useSession()
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedActivity, setSelectedActivity] = useState<any>(null)

  useEffect(() => {
    if (session?.user?.id) {
      getUserProgress(session.user.id).then((data) => {
        setActivities(data)
        setLoading(false)
      })
    }
  }, [session])

  if (!session) return null;

  return (
    <Card className="border-border lg:col-span-2">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Click on a result to review details</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading activity...</p>
        ) : activities.length === 0 ? (
          <p className="text-muted-foreground">No recent activity. Take a quiz to get started!</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, idx) => (
              <Dialog key={idx}>
                <DialogTrigger asChild>
                  <div
                    className="flex items-center justify-between py-3 border-b border-border last:border-0 cursor-pointer hover:bg-muted/50 transition-colors px-2 rounded-lg"
                    onClick={() => setSelectedActivity(activity)}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        Quiz Result
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`text-lg font-bold ${(activity.score / activity.total) >= 0.8 ? 'text-green-600' : 'text-orange-500'}`}>
                        {Math.round((activity.score / activity.total) * 100)}%
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Quiz Review</DialogTitle>
                    <DialogDescription>
                      Completed on {new Date(activity.createdAt).toLocaleDateString()} • Score: {Math.round((activity.score / activity.total) * 100)}%
                    </DialogDescription>
                  </DialogHeader>

                  <ScrollArea className="h-[60vh] pr-4">
                    {activity.details ? (
                      <Accordion type="single" collapsible className="w-full">
                        {(activity.details as any[]).map((item, qIdx) => {
                          const isCorrect = item.correctOptionId === item.userSelectedId;
                          return (
                            <AccordionItem key={qIdx} value={`item-${qIdx}`}>
                              <AccordionTrigger className={`text-left hover:no-underline ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                                <div className="flex items-center gap-2">
                                  {isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                  <span>Question {qIdx + 1}</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="space-y-4 pt-2">
                                <p className="font-semibold text-base">{item.text}</p>
                                <div className="space-y-2">
                                  {item.options.map((opt: any) => {
                                    const isUserSelected = opt.id === item.userSelectedId;
                                    const isRealCorrect = opt.id === item.correctOptionId;

                                    let className = "p-3 rounded-md border text-sm flex justify-between items-center ";
                                    if (isRealCorrect) className += "bg-green-100 border-green-500 text-green-900 font-medium ";
                                    else if (isUserSelected && !isRealCorrect) className += "bg-red-100 border-red-500 text-red-900 ";
                                    else className += "bg-muted/20 border-border text-muted-foreground ";

                                    return (
                                      <div key={opt.id} className={className}>
                                        <span>{opt.text}</span>
                                        {isRealCorrect && <span className="text-xs font-bold uppercase">Correct Answer</span>}
                                        {isUserSelected && !isRealCorrect && <span className="text-xs font-bold uppercase">Your Answer</span>}
                                      </div>
                                    )
                                  })}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          )
                        })}
                      </Accordion>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                        <p>Detailed review data is not available for this quiz.</p>
                        <p className="text-sm">It may be an older record.</p>
                      </div>
                    )}
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
