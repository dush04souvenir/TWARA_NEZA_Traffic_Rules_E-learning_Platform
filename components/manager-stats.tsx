"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, UserCheck, TrendingUp } from "lucide-react"

interface ManagerStatsProps {
    totalRevenue?: number;
}

export function ManagerStats({ totalRevenue = 0 }: ManagerStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <div className="h-4 w-4 text-primary font-bold">RWF</div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Total earnings</p>
                </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Learners</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">2,350</div>
                    <p className="text-xs text-muted-foreground">+180 from last month</p>
                </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Pass Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">78%</div>
                    <p className="text-xs text-muted-foreground">+5% improvement</p>
                </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Quizzes</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">128</div>
                    <p className="text-xs text-muted-foreground">in the last hour</p>
                </CardContent>
            </Card>
        </div>
    )
}
