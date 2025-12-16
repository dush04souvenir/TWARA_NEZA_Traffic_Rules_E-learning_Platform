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
import { BookOpen, Check, X, Clock, Lock, RefreshCw } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function QuizContent() {
    const { data: session } = useSession()
    const router = useRouter()

    const [view, setView] = useState<"topics" | "quiz" | "result" | "pending">("topics")
    const [topics, setTopics] = useState<any[]>([])
    const [questions, setQuestions] = useState<any[]>([])
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [selectedTopic, setSelectedTopic] = useState<any>(null);
    const [pendingPaymentId, setPendingPaymentId] = useState<string | null>(null);

    // Results & Review
    const [result, setResult] = useState<any>(null)
    const [reviewData, setReviewData] = useState<any[]>([])

    const searchParams = useSearchParams()

    useEffect(() => {
        // Pass user ID to fetch topics with payment status
        const userId = (session?.user as any)?.id;
        getTopics(userId).then((data) => {
            setTopics(data)
            const topicIdParam = searchParams.get("topicId")
            // Handle deep link logic if needed, but strict payment check will block startQuiz anyway
        }).catch((err) => {
            console.error(err)
            toast.error("Failed to load topics")
        })
    }, [session]) // Re-run if session loads late (e.g. refresh)

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

    // NEW: Payment‑aware start wrapper
    const handleStartQuiz = async (topicId: string, topicObj?: any) => {
        if (!(session?.user as any)?.id) {
            toast.error('You must be logged in to start a quiz');
            return;
        }
        const { getPaymentStatus, createPayment } = await import('@/lib/actions/payment-actions');
        const status = await getPaymentStatus({ learnerId: (session!.user as any).id, topicId });
        if (status === 'APPROVED') {
            toast.success('Payment already approved – starting quiz');
            await startQuiz(topicId, topicObj);
            return;
        }
        const payment = await createPayment({
            learnerId: (session!.user as any).id,
            topicId,
            amountCents: 500,
            autoApprove: false,
        });
        if (payment.status === 'APPROVED') {
            toast.success('Payment successful – starting quiz');
            await startQuiz(topicId, topicObj);
        } else {
            // Payment is pending – store id and show pending UI
            setPendingPaymentId(payment.id);
            setView('pending');
            toast.info('Payment created, awaiting manager approval');
        }
    };

    // Improved start handler that doesn't blindly create payment
    const handleTopicClick = async (topic: any) => {
        if (topic.paymentStatus === 'APPROVED') {
            await startQuiz(topic.id, topic);
        } else if (topic.paymentStatus === 'PENDING') {
            setPendingPaymentId(null); // Just show generic pending or fetch specific ID if needed
            setView("pending");
        } else {
            // Create Payment Flow
            if (confirm(`Unlock "${topic.name}" for 500 RWF?`)) {
                handleStartQuiz(topic.id, topic); // Original function creates payment
            }
        }
    };

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
        if (!(session?.user as any)?.id || !selectedTopic) return

        setSubmitting(true)
        const toastId = toast.loading("Submitting result...")
        try {
            const response = await submitQuiz((session!.user as any).id, selectedTopic.id, answers)

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

    if (view === "pending") {
        return (
            <LearnerLayout>
                <div className="flex flex-col items-center justify-center p-4 min-h-[60vh]">
                    <Card className="max-w-md w-full text-center p-8">
                        <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                            <Clock className="w-8 h-8 text-yellow-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Payment Pending</h2>
                        <p className="text-muted-foreground mb-6">
                            Your payment request has been received. Please ask an instructor or manager to approve it so you can start the quiz.
                        </p>
                        {pendingPaymentId && (
                            <p className="text-xs text-muted-foreground mb-6 p-2 bg-muted rounded">
                                Payment ID: <span className="font-mono">{pendingPaymentId.slice(0, 8)}...</span>
                            </p>
                        )}
                        <div className="flex justify-center gap-2">
                            <Button variant="outline" onClick={() => setView("topics")}>
                                Back to Topics
                            </Button>
                            <Button onClick={() => window.location.reload()}>
                                <RefreshCw className="w-4 h-4 mr-2" /> Check Status
                            </Button>
                        </div>
                    </Card>
                </div>
            </LearnerLayout>
        )
    }

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
                            {topics.map((topic) => {
                                const isLocked = topic.paymentStatus !== 'APPROVED';
                                const isPending = topic.paymentStatus === 'PENDING';

                                return (
                                    <Card
                                        key={topic.id}
                                        className={`cursor-pointer transition-all hover:-translate-y-1 group relative overflow-hidden ${isPending ? 'border-yellow-500/50 bg-yellow-50/10' : 'border-primary/10 hover:shadow-lg'}`}
                                        onClick={() => handleTopicClick(topic)}
                                    >
                                        {isPending && (
                                            <div className="absolute top-0 right-0 bg-yellow-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-bl-lg">
                                                Pending
                                            </div>
                                        )}
                                        {!isLocked && (
                                            <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-bl-lg">
                                                Unlocked
                                            </div>
                                        )}

                                        <CardHeader className="text-center pb-2">
                                            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-colors ${isLocked ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary group-hover:bg-primary/20'}`}>
                                                {isLocked ? <Lock className="w-8 h-8" /> : <BookOpen className="w-8 h-8" />}
                                            </div>
                                            <CardTitle>{topic.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-center space-y-4">
                                            <p className="text-sm text-muted-foreground">{topic._count?.questions || 0} Questions</p>

                                            {isPending ? (
                                                <Button variant="secondary" className="w-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                                                    <Clock className="w-4 h-4 mr-2" /> Awaiting Approval
                                                </Button>
                                            ) : isLocked ? (
                                                <Button className="w-full">
                                                    Unlock for 500 RWF
                                                </Button>
                                            ) : (
                                                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                                                    Start Quiz
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                )
                            })}
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
