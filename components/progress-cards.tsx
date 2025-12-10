"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { getLearnerStats } from "@/lib/actions/learner-actions"

export function ProgressCards() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({
    quizzesCompleted: 0,
    avgScore: 0,
    streak: 0
  })

  useEffect(() => {
    if (session?.user?.id) {
      getLearnerStats(session.user.id).then(setStats)
    }
  }, [session])

  const statItems = [
    {
      title: "Quizzes Completed",
      value: stats.quizzesCompleted.toString(),
      total: "30", // This could be dynamic too if we count total topics * questions
      percentage: Math.min((stats.quizzesCompleted / 30) * 100, 100),
      color: "bg-primary",
    },
    {
      title: "Average Score",
      value: `${stats.avgScore}%`,
      description: stats.avgScore > 70 ? "Keep it up!" : "Keep practicing!",
      color: "bg-secondary",
    },
    {
      title: "Study Streak",
      value: `${stats.streak} days`,
      description: "Maintain your momentum",
      color: "bg-accent",
    },
  ]

  return (
    <>
      {statItems.map((stat) => (
        <Card key={stat.title} className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              {stat.title === "Quizzes Completed" && <CardDescription>Total quizzes taken</CardDescription>}
              {stat.description && <CardDescription>{stat.description}</CardDescription>}
            </div>
            {stat.percentage !== undefined && (
              <div className="w-full bg-muted rounded-full h-2">
                <div className={`${stat.color} h-2 rounded-full`} style={{ width: `${stat.percentage}%` }} />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  )
}
