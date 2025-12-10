"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, BookOpen, Clock, Trophy } from "lucide-react"

export function StatsSection() {
    const stats = [
        {
            label: "Pass Rate",
            value: "98%",
            icon: Trophy,
            description: "Of our learners pass first time"
        },
        {
            label: "Practice Questions",
            value: "5,000+",
            icon: BookOpen,
            description: "Covering every traffic rule"
        },
        {
            label: "Active Learners",
            value: "10k+",
            icon: Users,
            description: "Trust TWARA NEZA"
        },
        {
            label: "Access",
            value: "24/7",
            icon: Clock,
            description: "Study anytime, anywhere"
        }
    ]

    return (
        <section className="container mx-auto px-4 py-8 relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="border-none shadow-lg bg-card/95 backdrop-blur">
                        <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                <stat.icon className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
                            <p className="font-semibold text-muted-foreground">{stat.label}</p>
                            <p className="text-sm text-muted-foreground/80">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}
