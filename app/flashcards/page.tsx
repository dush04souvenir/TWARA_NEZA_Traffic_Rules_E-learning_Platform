"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getTrafficSigns } from "@/lib/actions/learner-actions"
import { toast } from "sonner"
import { LearnerLayout } from "@/components/learner-layout"

import { OctagonAlert } from "lucide-react"

export default function FlashcardsPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [signs, setSigns] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)

    useEffect(() => {
        if (status === "loading") return
        if (!session) {
            toast.error("Please login to see flashcards")
            router.push("/")
            return
        }

        getTrafficSigns().then((data) => {
            setSigns(data)
            setLoading(false)
            if (data.length === 0) {
                // If no real data, use fallback for demo
                setSigns([
                    { id: '1', name: 'Stop Sign', description: 'Come to a complete stop.', imageUrl: '', category: 'Regulatory' },
                    { id: '2', name: 'Yield', description: 'Slow down and let others pass.', imageUrl: '', category: 'Regulatory' },
                    { id: '3', name: 'Speed Limit 50', description: 'Maximum speed is 50 km/h.', imageUrl: '', category: 'Regulatory' },
                ])
            }
        })
    }, [session, status, router])

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

    if (loading) return <div className="flex h-screen items-center justify-center">Loading flashcards...</div>

    const currentSign = signs[currentIndex]

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
