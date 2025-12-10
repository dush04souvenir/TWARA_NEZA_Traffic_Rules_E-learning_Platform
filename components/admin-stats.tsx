import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { getAdminStats } from "@/lib/actions/admin-actions"

export async function AdminStats() {
  const { users, questions, topics } = await getAdminStats()

  const stats = [
    { label: "Total Users", value: users.toString(), color: "text-primary" },
    { label: "Total Topics", value: topics.toString(), color: "text-secondary" },
    { label: "Total Questions", value: questions.toString(), color: "text-accent" },
    { label: "System Status", value: "Active", color: "text-green-500" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
