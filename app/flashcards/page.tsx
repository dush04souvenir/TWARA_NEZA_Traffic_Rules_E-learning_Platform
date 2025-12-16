"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getTrafficSigns } from "@/lib/actions/learner-actions"
import { toast } from "sonner"
import { LearnerLayout } from "@/components/learner-layout"
import { Card } from "@/components/ui/card"

import { OctagonAlert, Lock, Clock, RefreshCw, Loader2 } from "lucide-react"

export default function FlashcardsPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [signs, setSigns] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)

    // Payment State
    const [paymentStatus, setPaymentStatus] = useState<'LOADING' | 'NONE' | 'PENDING' | 'APPROVED'>('LOADING')
    const FLASHCARDS_ID = "flashcards_access"

    useEffect(() => {
        if (status === "loading") return
        if (!session) {
            toast.error("Please login to see flashcards")
            router.push("/")
            return
        }

        const checkAccess = async () => {
            // @ts-ignore
            const userId = session.user.id
            const { getPaymentStatus } = await import('@/lib/actions/payment-actions')

            try {
                const status = await getPaymentStatus({ learnerId: userId, topicId: FLASHCARDS_ID });
                if (status === 'APPROVED') {
                    setPaymentStatus('APPROVED')
                    // Load content
                    const data = await getTrafficSigns()
                    setSigns(data)
                    if (data.length === 0) {
                        setSigns([
                            { id: '1', name: 'Stop Sign', description: 'Come to a complete stop.', imageUrl: '', category: 'Regulatory' },
                            { id: '2', name: 'Yield', description: 'Slow down and let others pass.', imageUrl: '', category: 'Regulatory' },
                        ])
                    }
                    setLoading(false)
                } else if (status === 'PENDING') {
                    setPaymentStatus('PENDING')
                    setLoading(false)
                } else {
                    setPaymentStatus('NONE')
                    setLoading(false)
                }
            } catch (e) {
                console.error(e)
                setPaymentStatus('NONE')
                setLoading(false)
            }
        }
        checkAccess()
    }, [session, status, router])

    const handleUnlock = async () => {
        if (!session?.user) return

        // @ts-ignore
        const userId = session.user.id
        const { createPayment } = await import('@/lib/actions/payment-actions')

        if (!confirm("Unlock Flashcards for 500 RWF?")) return;

        try {
            const payment = await createPayment({
                learnerId: userId,
                topicId: FLASHCARDS_ID,
                amountCents: 500, // 500 RWF
                autoApprove: false
            })

            if (payment.status === 'APPROVED') {
                toast.success("Flashcards unlocked!")
                setPaymentStatus('APPROVED')
                const data = await getTrafficSigns()
                setSigns(data)
            } else {
                setPaymentStatus('PENDING')
                toast.info("Payment created. Waiting for approval.")
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to create payment")
        }
    }

    const handleNext = () => {
        setIsFlipped(false)
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % signs.length)
        }, 300)
    }

    const handlePrev = () => {
        setIsFlipped(false)
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + signs.length) % signs.length)
        }, 300)
    }

    if (loading || status === "loading" || paymentStatus === 'LOADING') {
        return <div className="flex h-screen items-center justify-center gap-2"><Loader2 className="animate-spin" /> Checkin access...</div>
    }

    if (paymentStatus === 'PENDING') {
        return (
            <LearnerLayout>
                <div className="min-h-[60vh] flex items-center justify-center p-4">
                    <Card className="max-w-md w-full text-center p-8">
                        <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                            <Clock className="w-8 h-8 text-yellow-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Payment Pending</h2>
                        <p className="text-muted-foreground mb-6">
                            Your payment of 500 RWF for Flashcards is awaiting approval.
                        </p>
                        <Button variant="outline" onClick={() => window.location.reload()}>
                            <RefreshCw className="w-4 h-4 mr-2" /> Check Status
                        </Button>
                    </Card>
                </div>
            </LearnerLayout>
        )
    }

    if (paymentStatus === 'NONE') {
        return (
            <LearnerLayout>
                <div className="min-h-[60vh] flex items-center justify-center p-4">
                    <Card className="max-w-md w-full text-center p-8 bg-card shadow-xl border">
                        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <Lock className="w-10 h-10 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Unlock Flashcards</h2>
                        <p className="text-muted-foreground mb-6 text-lg">
                            Master traffic signs with our interactive flashcards mode.
                        </p>
                        <div className="bg-muted p-4 rounded-lg mb-6">
                            <span className="text-2xl font-bold">500 RWF</span>
                            <span className="text-sm text-muted-foreground block">One-time payment</span>
                        </div>
                        <Button className="w-full text-lg h-12" onClick={handleUnlock}>
                            Unlock Now
                        </Button>
                    </Card>
                </div>
            </LearnerLayout>
        )
    }

    const currentSign = signs[currentIndex] || { name: 'Loading', category: '' }

    return (
        <LearnerLayout>
            <div className="flex flex-col items-center justify-center p-4 min-h-[60vh]">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2">Traffic Sign Flashcards</h1>
                    <p className="text-muted-foreground">Tap card to flip • {currentIndex + 1} of {signs.length}</p>
                </div>

                <div className="perspective-1000 w-full max-w-md h-[400px] cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
                    <div
                        className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}
                    >
                        {/* Front */}
                        <div
                            className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-6 border-2 border-primary/20 rounded-xl bg-card shadow-lg"
                        >
                            <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 overflow-hidden ${currentSign.category === 'Warning' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                                {currentSign.imageUrl ? (
                                    <img src={currentSign.imageUrl} alt={currentSign.name} className="w-full h-full object-cover" />
                                ) : (
                                    <OctagonAlert className="w-16 h-16 text-foreground/80" />
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-center">{currentSign.name}</h2>
                            <p className="mt-4 text-sm font-semibold text-primary uppercase tracking-wider">{currentSign.category}</p>
                            <p className="absolute bottom-4 text-xs text-muted-foreground">Tap to see meaning</p>
                        </div>

                        {/* Back */}
                        <div
                            className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-6 bg-primary text-primary-foreground rotate-y-180 rounded-xl shadow-lg"
                        >
                            <h3 className="text-xl font-bold mb-4">Meaning</h3>
                            <p className="text-center text-lg leading-relaxed">{currentSign.description}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-8 w-full max-w-md">
                    <Button variant="outline" className="flex-1" onClick={(e) => { e.stopPropagation(); handlePrev(); }}>Previous</Button>
                    <Button className="flex-1" onClick={(e) => { e.stopPropagation(); handleNext(); }}>Next Card</Button>
                </div>

                <Button variant="ghost" className="mt-8" onClick={() => router.push("/learner-dashboard")}>
                    Back to Dashboard
                </Button>
            </div>
        </LearnerLayout>
    )
}
