"use client"

import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ClipboardList, CreditCard, Trophy } from "lucide-react"

export function QuickActions() {
  const router = useRouter()

  const actions = [
    { label: "Start Quiz", icon: <ClipboardList className="w-6 h-6" />, color: "bg-primary", path: "/quiz" },
    { label: "Review Flashcards", icon: <CreditCard className="w-6 h-6" />, color: "bg-secondary", path: "/flashcards" }, // Placeholder
    { label: "Take Practice Exam", icon: <Trophy className="w-6 h-6" />, color: "bg-accent", path: "/exam" },
  ]

  return (
    <Card className="border-border lg:col-span-1">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            className="w-full justify-start gap-3 h-auto py-4 bg-transparent hover:bg-muted/50 text-foreground border border-input"
            variant="ghost"
            onClick={() => {
              if (action.path) router.push(action.path)
            }}
          >
            <span className="text-2xl">{action.icon}</span>
            <span className="font-medium">{action.label}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
