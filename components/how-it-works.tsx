"use client"

import { CheckCircle2, Target, BrainCircuit, GraduationCap } from "lucide-react"

export function HowItWorks() {
    const steps = [
        {
            title: "Practice",
            description: "Master specific topics with focused quizzes and instant feedback.",
            icon: Target,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Track",
            description: "Our AI identifies your weak spots so you stop wasting time.",
            icon: BrainCircuit,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            title: "Simulate",
            description: "Take full-length mock exams under real timed conditions.",
            icon: CheckCircle2,
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            title: "Succeed",
            description: "Walk into the exam room with 100% confidence.",
            icon: GraduationCap,
            color: "text-orange-500",
            bg: "bg-orange-500/10"
        }
    ]

    return (
        <section className="container mx-auto px-4 py-20 bg-muted/30">
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">Your Roadmap to Success</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    We've broken down the complex traffic code into a simple, proven 4-step process.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {/* Connector Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-orange-200 -z-10" />

                {steps.map((step, idx) => (
                    <div key={idx} className="relative flex flex-col items-center text-center group">
                        <div className={`w-24 h-24 rounded-2xl ${step.bg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 shadow-sm border border-border/50`}>
                            <step.icon className={`w-10 h-10 ${step.color}`} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
