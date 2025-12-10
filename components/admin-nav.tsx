"use client"

import { Button } from "./ui/button"
import { LayoutDashboard, Users, FileQuestion, BarChart, Settings } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { signOut } from "next-auth/react"

export function AdminNav() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentView = searchParams.get("view") || "overview"

  const navItems = [
    { label: "Overview", id: "overview", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Users", id: "users", icon: <Users className="w-5 h-5" /> },
    { label: "Questions", id: "questions", icon: <FileQuestion className="w-5 h-5" /> },
    { label: "Analytics", id: "analytics", icon: <BarChart className="w-5 h-5" /> },
    { label: "Settings", id: "settings", icon: <Settings className="w-5 h-5" /> },
  ]

  const handleNav = (viewId: string) => {
    router.push(`/admin-dashboard?view=${viewId}`)
  }

  return (
    <nav className="h-full flex flex-col p-4 space-y-2">
      <div className="space-y-1 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-left ${currentView === item.id
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full mt-auto bg-transparent border-border text-muted-foreground hover:text-foreground"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Logout
      </Button>
    </nav>
  )
}
