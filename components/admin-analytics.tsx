"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"

const userGrowthData = [
    { name: "Jan", users: 40 },
    { name: "Feb", users: 30 },
    { name: "Mar", users: 20 },
    { name: "Apr", users: 27 },
    { name: "May", users: 18 },
    { name: "Jun", users: 23 },
    { name: "Jul", users: 34 },
]

const roleData = [
    { name: "Learners", value: 856 },
    { name: "Instructors", value: 12 },
    { name: "Admins", value: 4 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export function AdminAnalytics() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <Card className="border-border">
                <CardHeader>
                    <CardTitle>User Growth (Last 7 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={userGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis dataKey="name" className="text-xs" />
                                <YAxis className="text-xs" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                    itemStyle={{ color: 'var(--foreground)' }}
                                />
                                <Bar dataKey="users" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Role Distribution Chart */}
            <Card className="border-border">
                <CardHeader>
                    <CardTitle>User Role Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={roleData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {roleData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-4 text-sm text-muted-foreground mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-[#0088FE] rounded-full"></div> Learners
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-[#00C49F] rounded-full"></div> Instructors
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-[#FFBB28] rounded-full"></div> Admins
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Activity Trends */}
            <Card className="border-border md:col-span-2">
                <CardHeader>
                    <CardTitle>Quiz Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={userGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis dataKey="name" className="text-xs" />
                                <YAxis className="text-xs" />
                                <Tooltip />
                                <Line type="monotone" dataKey="users" stroke="var(--primary)" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
