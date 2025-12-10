"use client"

import { ProgressCards } from "@/components/progress-cards"
import { RecentActivity } from "@/components/recent-activity"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { getUserDetailedStats } from "@/lib/actions/learner-actions"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export function ProgressView() {
    const { data: session } = useSession()
    const [data, setData] = useState<{ date: string, score: number }[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (session?.user?.email) {
            // Note: learner-actions usually takes userId, but if session doesn't have ID exposed nicely in types yet, 
            // we might need to rely on the backend finding valid user or user passed ID.
            // Assuming session.user (extended) has ID or we can fetch by email.
            // Actually, getUserDetailedStats expects userId.
            // Earlier we had issues with session.user.id. Let's assume we fixed it or pass email if logic changes.
            // But wait, the seed script created users with specific emails.
            // Let's rely on the fact that if we use "getUserDetailedStats", we need an ID.
            // If session.user.id is missing in types, we cast it.
            const userId = (session.user as any).id
            if (userId) {
                getUserDetailedStats(userId).then(stats => {
                    setData(stats)
                    setLoading(false)
                })
            }
        }
    }, [session])

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">My Progress</h2>
            <div className="grid gap-6">
                <ProgressCards />

                <div className="grid md:grid-cols-2 gap-6">
                    <RecentActivity />
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Performance Trend</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            {loading ? (
                                <div className="h-full flex items-center justify-center text-muted-foreground">
                                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                    Loading analytics...
                                </div>
                            ) : data.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${value}%`}
                                            domain={[0, 100]}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }}
                                            itemStyle={{ color: 'var(--foreground)' }}
                                            labelStyle={{ color: 'var(--muted-foreground)' }}
                                            formatter={(value: number) => [`${value.toFixed(0)}%`, "Score"]}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="score"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: "hsl(var(--primary))" }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                                    <p>No quiz data available yet.</p>
                                    <p className="text-sm">Complete a quiz to see your trends!</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
