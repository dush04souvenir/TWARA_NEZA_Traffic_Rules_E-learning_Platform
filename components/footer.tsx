"use client"

import { Logo } from "@/components/logo"
import { Separator } from "./ui/separator"
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Shield, AlertCircle, BookOpen } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo showText={true} />
            </div>
            <p className="text-muted-foreground text-sm">
              Rwanda's trusted platform for comprehensive traffic rules education, driver licensing preparation, and
              road safety awareness.
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              Committed to reducing road accidents and improving driving standards in Rwanda
            </p>
          </div>

          {/* Learning Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" />
              Learning Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Rwanda Traffic Code
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Practice Mock Exams
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Road Signs & Signals
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Safety Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Vehicle Regulations
                </a>
              </li>
            </ul>
          </div>

          {/* For Instructors & Driving Schools */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-secondary" />
              For Instructors
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Instructor Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Student Management
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Question Bank
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Performance Analytics
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  School Registration
                </a>
              </li>
            </ul>
          </div>

          {/* Safety & Compliance */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              Road Safety
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Accident Prevention
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  DUI Regulations
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Defensive Driving
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Vehicle Maintenance
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Licensing Info
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-1 text-accent flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                    +250 788 123 456
                  </span>
                  <span className="text-xs text-muted-foreground">Mon-Fri, 8am-5pm EAT</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>support@tawaraneza.rw</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 text-secondary flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Kigali, Rwanda</span>
                  <span className="text-xs text-muted-foreground">Head Office</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {currentYear} TWARA NEZA. All rights reserved. | Promoting Road Safety & Traffic Education in Rwanda
          </p>

          <div className="flex items-center gap-6 flex-wrap justify-center">
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 transform duration-200"
                title="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 transform duration-200"
                title="Follow us on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 transform duration-200"
                title="Connect on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex gap-4 text-sm flex-wrap justify-center">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <span className="text-border">|</span>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <span className="text-border">|</span>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
