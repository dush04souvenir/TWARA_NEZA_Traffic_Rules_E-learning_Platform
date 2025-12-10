"use client"

import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "./ui/button"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { LayoutDashboard, ClipboardList, CreditCard, TrendingUp, Settings, Car } from "lucide-react"
import { Logo } from "@/components/logo"

export function LearnerNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentView = searchParams.get("view")

  const navItems = [
    { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, href: "/learner-dashboard", view: null }, // Default view
    { label: "Quizzes", icon: <ClipboardList className="w-5 h-5" />, href: "/quiz", view: null },
    { label: "Flashcards", icon: <CreditCard className="w-5 h-5" />, href: "/flashcards", view: null },
    { label: "My Progress", icon: <TrendingUp className="w-5 h-5" />, href: "/learner-dashboard?view=progress", view: "progress" },
    { label: "Settings", icon: <Settings className="w-5 h-5" />, href: "/learner-dashboard?view=settings", view: "settings" },
  ]

  return (
    <nav className="w-64 bg-card border-r border-border hidden md:flex flex-col p-6 h-screen sticky top-0">
      <div className="flex items-center gap-2 mb-8">
        <Logo />
      </div>

      <div className="space-y-2 flex-1">
        {navItems.map((item) => {
          // Active logic:
          // 1. Path must match
          // 2. If item has a view, it must match current view
          // 3. If item has NO view, current view must be null (to avoid hitting Dashboard when on Settings)
          const isPathMatch = pathname === item.href.split('?')[0];
          const isViewMatch = item.view ? currentView === item.view : !currentView;

          // Special case for routes that don't use views (like /quiz)
          const isActive = isPathMatch && (item.href.includes('?') ? isViewMatch : true);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-left",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </div>

      <Button
        variant="outline"
        className="w-full mt-auto bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-accent"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Logout
      </Button>
    </nav>
  )
}
