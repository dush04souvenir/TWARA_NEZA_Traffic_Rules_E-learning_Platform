"use client"

import { Button } from "./ui/button"
import { Menu, Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Logo } from "@/components/logo"

interface LandingHeaderProps {
  onLoginClick?: () => void
  variant?: "default" | "dashboard"
  title?: string
}

export function LandingHeader({ onLoginClick, variant = "default", title = "Learner" }: LandingHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const navLinks = [
    { label: "Home", href: "#" },
    { label: "Learn", href: "#features" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ]

  return (
    <header className="border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo with Rwanda tagline */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity duration-300">
          <Logo showText={true} />
        </div>

        {/* Navigation Links - Hide on Dashboard */}
        {variant === "default" && (
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium text-sm"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        <div className="hidden md:flex gap-3 items-center">
          {mounted && (
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              className="hover:scale-105 transition-transform duration-300 bg-transparent"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          )}

          {variant === "default" && onLoginClick && (
            <>
              <Button
                onClick={onLoginClick}
                variant="outline"
                className="hover:scale-105 transition-transform duration-300 bg-transparent"
              >
                Sign In
              </Button>
              <Button onClick={onLoginClick} className="hover:scale-105 transition-transform duration-300">
                Get Started
              </Button>
            </>
          )}

          {variant === "dashboard" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hidden md:inline">Welcome, {title}</span>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex gap-2 items-center">
          {mounted && (
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              className="hover:scale-105 transition-transform duration-300 bg-transparent"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          )}
          <button
            className="md:hidden p-2 hover:bg-accent/10 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu - Only show for default variant or simple links for dashboard */}
      {mobileMenuOpen && variant === "default" && (
        <div className="md:hidden border-t border-border bg-card/95 animate-slide-in-up">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 py-2"
              >
                {link.label}
              </a>
            ))}
            {onLoginClick && (
              <Button onClick={onLoginClick} className="w-full">
                Get Started
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
