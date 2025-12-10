"use client"

import { useState } from "react"
import { LandingHeader } from "@/components/landing-header"
import { HeroSection } from "@/components/hero-section"
import { LandingFeatures } from "@/components/landing-features"
import { LandingCTA } from "@/components/landing-cta"
import { Footer } from "@/components/footer"
import { LoginModal } from "@/components/login-modal"

import { StatsSection } from "@/components/stats-section"
import { HowItWorks } from "@/components/how-it-works"
import { Testimonials } from "@/components/testimonials"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader onLoginClick={() => setIsLoginOpen(true)} />
      <HeroSection onLoginClick={() => setIsLoginOpen(true)} />

      <main className="flex flex-col gap-20 pb-20">
        <StatsSection />
        <LandingFeatures />
        <HowItWorks />
        <Testimonials />
        <AboutSection />
        <ContactSection />
        <LandingCTA onGetStarted={() => setIsLoginOpen(true)} />
      </main>
      <Footer />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  )
}
