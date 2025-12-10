"use client"

import { Button } from "./ui/button"
import { Shield, Target, Zap } from "lucide-react"

export function AboutSection() {
    return (
        <section id="about" className="container mx-auto px-4 py-20 bg-background">
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        About TWARA NEZA
                    </h2>
                    <h3 className="text-xl font-semibold text-foreground">
                        Empowering Rwandan Drivers for Safer Roads
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                        TWARA NEZA was built with a simple mission: to make traffic education accessible, engaging, and effective for everyone in Rwanda. We believe that safe roads start with well-prepared drivers.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        Our platform combines the official traffic code with modern learning techniques like spaced repetition and gamification to ensure you don't just memorize the rules—you master them.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            <span className="font-medium">Safety First</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary" />
                            <span className="font-medium">Exam Focused</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-primary" />
                            <span className="font-medium">Fast Learning</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-lg transform rotate-2"></div>
                    <div className="relative bg-card border border-border rounded-xl p-2 shadow-2xl overflow-hidden aspect-video flex items-center justify-center">
                        {/* Abstract visual or image could go here */}
                        <div className="text-center px-8">
                            <span className="text-4xl font-black text-muted-foreground/10 select-none">TWARA NEZA</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
