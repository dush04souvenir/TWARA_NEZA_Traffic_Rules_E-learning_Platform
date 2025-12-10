"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { ArrowRight } from "lucide-react"

interface HeroSectionProps {
  onLoginClick: () => void
}

export function HeroSection({ onLoginClick }: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = [
    "/kigali_convention_traffic_1765296978155.png",
    "/rwanda_traffic_police_1765297067145.png",
    "/kigali_driving_school_1765297130506.png",
    "/car-dashboard-interior.jpg",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
      {/* Background Slider */}
      {images.map((img, index) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-40" : "opacity-0"
            }`}
          style={{
            backgroundImage: `url('${img}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      {/* Overlay Gradient */}
      {/* Overlay Gradient - Darker for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent/30"></div>
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
        <div className="space-y-8 animate-slide-in-up">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight tracking-tight drop-shadow-md">
            Pass Your Exam <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">The First Time</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Prepare confidently for your driving license exam with our comprehensive, interactive learning platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button size="lg" onClick={onLoginClick} className="font-semibold px-8 py-6 text-lg animate-glow shadow-lg shadow-primary/25">
              Start Learning Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-semibold px-8 py-6 text-lg hover:bg-accent/10 hover:text-accent transition-colors bg-transparent border-primary/20 backdrop-blur-sm"
            >
              Watch Demo
            </Button>
          </div>

          {/* Social Proof Trust Badge */}
          <div className="pt-8 flex flex-col items-center gap-2 animate-fade-in opacity-80">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                  <img src={`/placeholder-user.jpg`} className="w-full h-full object-cover" alt="User" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-background bg-primary text-[10px] text-primary-foreground flex items-center justify-center font-bold">
                +2k
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Join <span className="text-foreground font-bold">10,000+</span> successful learners today</p>
          </div>
        </div>
      </div>


    </section>
  )
}
