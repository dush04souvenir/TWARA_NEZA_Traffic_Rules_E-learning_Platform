"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getTopics, getQuizForTopic, submitQuiz } from "@/lib/actions/learner-actions"
import { toast } from "sonner"
import { LearnerLayout } from "@/components/learner-layout"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Check, X } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function QuizPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const [view, setView] = useState<"topics" | "quiz" | "result">("topics")
  const [topics, setTopics] = useState<any[]>([])
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<any>(null)

  // Results & Review
  const [result, setResult] = useState<any>(null)
  const [reviewData, setReviewData] = useState<any[]>([])

  const searchParams = useSearchParams()

  useEffect(() => {
    getTopics().then((data) => {
      setTopics(data)
      const topicIdParam = searchParams.get("topicId")
      if (topicIdParam) {
        const targetTopic = data.find((t: any) => t.id === topicIdParam)
        if (targetTopic) {
          startQuiz(topicIdParam, targetTopic) // This will fire but startQuiz relies on 'topics' state which might not be flushed yet? 
          // Actually startQuiz reads 'topics' from closure scope? No, it reads from state 'topics' which is stale here.
          // I should modify startQuiz to accept the topic object optionally or I should set selectedTopic manually here.
          // Let's modify logic below.
        }
      }
    }).catch((err) => {
      console.error(err)
      toast.error("Failed to load topics")
    })
  }, [])

  // Adjusted startQuiz to support direct call
  const startQuiz = async (topicId: string, topicObj?: any) => {
    setLoading(true)
    const toastId = toast.loading("Loading quiz...")
    try {
      const fetchedQuestions = await getQuizForTopic(topicId)
      if (!fetchedQuestions || fetchedQuestions.length === 0) {
        toast.error("No questions found for this topic")
        return
      }
      setQuestions(fetchedQuestions)
      // Use provided obj or find in state (which might be empty if called immediately after fetch)
      // So we rely on the caller to pass it if state isn't ready.
      if (topicObj) {
        setSelectedTopic(topicObj)
      } else {
        setSelectedTopic(topics.find(t => t.id === topicId))
      }

      setCurrentQuestionIdx(0)
      setAnswers({})
      setReviewData([])
      setView("quiz")
    } catch (error) {
      console.error(error)
      toast.error("Failed to start quiz")
    } finally {
      toast.dismiss(toastId)
      setLoading(false)
    }
  }

  const handleOptionSelect = (optionId: string) => {
    const questionId = questions[currentQuestionIdx].id
    setAnswers(prev => ({ ...prev, [questionId]: optionId }))
  }

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!session?.user?.id || !selectedTopic) return

    setSubmitting(true)
    const toastId = toast.loading("Submitting result...")
    try {
      const response = await submitQuiz(session.user.id, selectedTopic.id, answers)

      if (response.result) {
        setResult(response.result)
        if (response.reviewData) {
          setReviewData(response.reviewData)
        }
        setView("result")
      } else {
        toast.error("Failed to submit")
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    } finally {
      toast.dismiss(toastId)
      setSubmitting(false)
    }
  }

  const resetQuiz = () => {
    setView("topics")
    setQuestions([])
    setResult(null)
    setAnswers({})
    setReviewData([])
    setCurrentQuestionIdx(0)
    setSelectedTopic(null)
  }

  // --- RENDER HELPERS ---

  if (view === "topics") {
    return (
      <LearnerLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Select a Topic</h1>
            <p className="text-muted-foreground">Choose a topic to start your practice quiz</p>
          </div>

          {topics.length === 0 ? (
            <p>Loading topics...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
              {topics.map((topic) => (
                <Card
                  key={topic.id}
                  className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 group border-primary/10"
                  onClick={() => startQuiz(topic.id)}
                >
                  <CardHeader className="text-center pb-2">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <BookOpen className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle>{topic.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">{topic._count?.questions || 0} Questions</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-12">
            <Button variant="outline" onClick={() => router.push("/learner-dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </LearnerLayout>
    )
  }

  if (view === "result" && result) {
    const percentage = Math.round((result.score / result.total) * 100) || 0

    if (percentage >= 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }

    return (
      <LearnerLayout>
        <div className="flex flex-col items-center justify-center p-4 min-h-[80vh]">
          <Card className="max-w-3xl w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Quiz Completed! 🎉</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-4xl font-bold text-primary">{percentage}%</p>
                <p className="text-muted-foreground">You answered {result.score} out of {result.total} correctly</p>
              </div>

              {/* REVIEW SECTION */}
              {reviewData.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Detailed Review</h3>
                  <ScrollArea className="h-[400px] border rounded-md p-4">
                    <Accordion type="single" collapsible className="w-full">
                      {reviewData.map((item, idx) => {
                        const isCorrect = item.correctOptionId === item.userSelectedId;
                        return (
                          <AccordionItem key={item.questionId} value={item.questionId}>
                            <AccordionTrigger className={`text-left hover:no-underline ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                              <div className="flex items-center gap-2">
                                {isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                <span>Question {idx + 1}</span>
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
                  </ScrollArea>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button className="flex-1" onClick={resetQuiz}>
                  Take Another Quiz
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => router.push("/learner-dashboard")}>
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </LearnerLayout>
    )
  }

  // Quiz View
  const currentQ = questions[currentQuestionIdx]
  const progress = ((currentQuestionIdx + 1) / questions.length) * 100

  if (!currentQ) return <LearnerLayout><div>Loading...</div></LearnerLayout>

  return (
    <LearnerLayout>
      <div className="flex flex-col items-center justify-center p-4 min-h-[60vh]">
        <div className="w-full max-w-2xl mb-8 flex justify-between items-center">
          <h2 className="text-xl font-bold">Topic: {selectedTopic?.name}</h2>
          <span className="text-muted-foreground">Question {currentQuestionIdx + 1} of {questions.length}</span>
        </div>

        <Progress value={progress} className="w-full max-w-2xl mb-6 h-2" />

        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-lg leading-relaxed">{currentQ.text}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQ.options.map((option: any) => {
              const isSelected = answers[currentQ.id] === option.id
              return (
                <div
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-accent/50 ${isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />}
                    </div>
                    <span>{option.text}</span>
                  </div>
                </div>
              )
            })}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIdx === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!answers[currentQ.id]}
            >
              {currentQuestionIdx === questions.length - 1 ? (submitting ? "Submitting..." : "Submit Quiz") : "Next"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </LearnerLayout>
  )
}
