"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { generatePracticeExam, submitExam } from "@/lib/actions/learner-actions"
import { toast } from "sonner"
import { Loader2, CheckCircle, XCircle, Timer, AlertTriangle, Info, Check, X, Lock, RefreshCw, Clock } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ExamPage() {
    const { data: session } = useSession()
    const router = useRouter()

    // Exam State
    const [questions, setQuestions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [examStarted, setExamStarted] = useState(false)

    // Active Exam State
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [submitting, setSubmitting] = useState(false)
    const [result, setResult] = useState<{ score: number, total: number } | null>(null)
    const [reviewData, setReviewData] = useState<any[]>([])

    // Timer State (20 minutes = 1200 seconds)
    const [timeLeft, setTimeLeft] = useState(20 * 60)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    // Payment State
    const [paymentStatus, setPaymentStatus] = useState<'LOADING' | 'NONE' | 'PENDING' | 'APPROVED'>('LOADING')
    const [pendingPaymentId, setPendingPaymentId] = useState<string | null>(null)
    const PRACTICE_EXAM_ID = "comprehensive_practice_exam"

    useEffect(() => {
        const checkExamAccess = async () => {
            if (session?.user) {
                // @ts-ignore
                const userId = session.user.id
                const { getPaymentStatus } = await import('@/lib/actions/payment-actions')

                const status = await getPaymentStatus({ learnerId: userId, topicId: PRACTICE_EXAM_ID });
                if (status === 'APPROVED') {
                    setPaymentStatus('APPROVED')
                    // Load exam content
                    generatePracticeExam().then(data => {
                        setQuestions(data)
                        setLoading(false)
                    })
                } else if (status === 'PENDING') {
                    // We need to fetch the payment ID to show it? getPaymentStatus returns status string only.
                    // For now just show pending state.
                    setPaymentStatus('PENDING')
                    setLoading(false)
                } else {
                    setPaymentStatus('NONE')
                    setLoading(false)
                }
            }
        }
        checkExamAccess()
    }, [session])

    const handleUnlockExam = async () => {
        if (!session?.user) return

        // @ts-ignore
        const userId = session.user.id
        const { createPayment } = await import('@/lib/actions/payment-actions')

        try {
            const payment = await createPayment({
                learnerId: userId,
                topicId: PRACTICE_EXAM_ID,
                amountCents: 1000,
                autoApprove: false
            })

            if (payment.status === 'APPROVED') {
                toast.success("Exam unlocked!")
                setPaymentStatus('APPROVED')
                // Load content
                const data = await generatePracticeExam()
                setQuestions(data)
            } else {
                setPaymentStatus('PENDING')
                setPendingPaymentId(payment.id)
                toast.info("Payment created. Waiting for approval.")
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to create payment")
        }
    }

    useEffect(() => {
        if (examStarted && !result && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!)
                        // Auto-submit or handle timeout
                        toast.error("Time's up! Submitting exam...")
                        handleSubmit()
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [examStarted, result, timeLeft])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleOptionSelect = (questionId: string, optionId: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionId }))
    }

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1)
        }
    }

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1)
        }
    }

    const handleSubmit = async () => {
        // Allow submit even if not all answered if time is up, but warn otherwise
        if (timeLeft > 0 && Object.keys(answers).length < questions.length) {
            toast.warning("Please answer all questions before submitting.")
            return
        }

        if (timerRef.current) clearInterval(timerRef.current)
        setSubmitting(true)

        // @ts-ignore - session.user type
        const res = await submitExam(session?.user?.id as string, answers)

        if (res.success) {
            setResult({ score: res.score!, total: res.total! })
            if (res.reviewData) {
                setReviewData(res.reviewData)
            }
            toast.success("Exam submitted successfully!")
        } else {
            toast.error("Failed to submit exam.")
        }
        setSubmitting(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p>Checking exam access...</p>
            </div>
        )
    }

    if (paymentStatus === 'PENDING') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
                <Card className="max-w-md w-full text-center p-8">
                    <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                        <Clock className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Exam Payment Pending</h2>
                    <p className="text-muted-foreground mb-6">
                        Your payment of <span className="font-bold text-foreground">1000 RWF</span> is awaiting approval.
                        Please ask an instructor to approve it.
                    </p>
                    <div className="flex justify-center gap-2">
                        <Button variant="outline" onClick={() => router.push("/learner-dashboard")}>Dashboard</Button>
                        <Button onClick={() => window.location.reload()}>
                            <RefreshCw className="w-4 h-4 mr-2" /> Check Status
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    if (paymentStatus === 'NONE') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
                <Card className="max-w-lg w-full text-center">
                    <CardHeader>
                        <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
                            <Lock className="w-10 h-10 text-primary" />
                        </div>
                        <CardTitle className="text-3xl">Practice Exam</CardTitle>
                        <CardDescription className="text-lg mt-2">
                            Comprehensive mock exam simulating the real test environment.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-muted p-4 rounded-lg text-left space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Price</span>
                                <span className="font-bold">1000 RWF</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Questions</span>
                                <span className="font-bold">20 Random Questions</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Time Limit</span>
                                <span className="font-bold">20 Minutes</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full text-lg h-12" onClick={handleUnlockExam}>
                            Unlock Now
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    // Exam Results Screen
    if (result) {
        const percentage = Math.round((result.score / result.total) * 100)
        const passed = percentage >= 80

        if (passed) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            })
        }

        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/20">
                <Card className="w-full max-w-3xl text-center">
                    <CardHeader>
                        <CardTitle className="text-3xl">Exam Results</CardTitle>
                        <CardDescription>Practice Exam Completed</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className={`text-6xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                            {percentage}%
                        </div>
                        <p className="text-muted-foreground text-lg">
                            Score: {result.score} / {result.total}
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            {passed ? (
                                <div className="flex items-center text-green-600 gap-2 font-bold bg-green-100 px-4 py-2 rounded-full">
                                    <CheckCircle className="w-6 h-6" /> PASSED
                                </div>
                            ) : (
                                <div className="flex items-center text-red-600 gap-2 font-bold bg-red-100 px-4 py-2 rounded-full">
                                    <XCircle className="w-6 h-6" /> FAILED
                                </div>
                            )}
                        </div>

                        {/* REVIEW SECTION */}
                        {reviewData.length > 0 && (
                            <div className="mt-8 text-left">
                                <h3 className="text-xl font-bold mb-4">Exam Review</h3>
                                <ScrollArea className="h-[400px] border rounded-md p-4 bg-white/50">
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
                    </CardContent>
                    <CardFooter className="justify-center gap-4">
                        <Button variant="outline" onClick={() => window.location.reload()}>Retake Exam</Button>
                        <Button onClick={() => router.push("/learner-dashboard")}>Back to Dashboard</Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    // Instructions Screen
    if (!examStarted) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Info className="w-6 h-6 text-primary" />
                            Practice Exam Instructions
                        </CardTitle>
                        <CardDescription>Please read carefully before starting.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-200 dark:border-yellow-800 flex gap-3">
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                            <p className="text-sm">Once started, the timer cannot be paused. Ensure you have a stable internet connection.</p>
                        </div>

                        <ul className="space-y-3">
                            <li className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">1</span>
                                <div>
                                    <p className="font-medium">Time Limit</p>
                                    <p className="text-sm text-muted-foreground">You have <span className="font-bold text-foreground">20 minutes</span> to complete the exam.</p>
                                </div>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">2</span>
                                <div>
                                    <p className="font-medium">Questions</p>
                                    <p className="text-sm text-muted-foreground">The exam consists of <span className="font-bold text-foreground">{questions.length} questions</span> randomly selected.</p>
                                </div>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">3</span>
                                <div>
                                    <p className="font-medium">Scoring</p>
                                    <p className="text-sm text-muted-foreground">You need <span className="font-bold text-foreground">80%</span> to pass. Good luck!</p>
                                </div>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full text-lg h-12" onClick={() => setExamStarted(true)}>
                            Start Practice Exam
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    const currentQuestion = questions[currentIndex]

    return (
        <div className="min-h-screen flex flex-col bg-muted/20">
            {/* Header */}
            <header className="bg-card border-b p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="font-bold text-lg hidden md:block">Twara Neza Exam</div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                        <Timer className="w-5 h-5" />
                        {formatTime(timeLeft)}
                    </div>

                    <div className="text-sm text-muted-foreground">
                        Question <span className="font-bold text-foreground">{currentIndex + 1}</span> of {questions.length}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-3xl min-h-[400px] flex flex-col">
                    <CardHeader>
                        <div className="flex justify-between items-start gap-4">
                            <CardTitle className="text-xl leading-relaxed">{currentQuestion.text}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3 flex-1">
                        {currentQuestion.options.map((option: any) => (
                            <div
                                key={option.id}
                                onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                                className={`p-4 rounded-lg border cursor-pointer transition-all ${answers[currentQuestion.id] === option.id
                                    ? "bg-primary/10 border-primary shadow-sm ring-1 ring-primary"
                                    : "hover:bg-accent border-border"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${answers[currentQuestion.id] === option.id
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-muted-foreground"
                                        }`}>
                                        {answers[currentQuestion.id] === option.id && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                    </div>
                                    <span className="text-lg">{option.text}</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter className="justify-between pt-6 border-t mt-4">
                        <Button
                            variant="outline"
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className="w-32"
                        >
                            Previous
                        </Button>

                        {currentIndex === questions.length - 1 ? (
                            <Button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="bg-primary hover:bg-primary/90 w-32"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Submit
                            </Button>
                        ) : (
                            <Button onClick={handleNext} className="w-32">Next</Button>
                        )}
                    </CardFooter>
                </Card>
            </main>
        </div>
    )
}
