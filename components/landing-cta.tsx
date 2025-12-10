"use client"

import { Button } from "./ui/button"

interface LandingCTAProps {
  onGetStarted: () => void
}

export function LandingCTA({ onGetStarted }: LandingCTAProps) {
  return (
    <section className="container mx-auto px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-xl blur-3xl -z-10"></div>

      <div className="relative bg-gradient-to-r from-primary to-primary/80 rounded-xl text-primary-foreground text-center py-16 px-8 border border-primary/20 shadow-xl animate-slide-in-up">
        <h2 className="text-3xl font-bold mb-4">Ready to Pass Your Driving Exam?</h2>
        <p className="text-lg mb-8 max-w-xl mx-auto opacity-90">
          Join thousands of Rwandan learners who have successfully prepared with TWARA NEZA
        </p>
        <Button
          onClick={onGetStarted}
          variant="secondary"
          size="lg"
          className="font-semibold hover:scale-110 transition-transform duration-300"
        >
          Get Started Free
        </Button>
      </div>
    </section>
  )
}
