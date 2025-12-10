"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"

const registrationData = [
    { name: "Week 1", students: 12 },
    { name: "Week 2", students: 19 },
    { name: "Week 3", students: 15 },
    { name: "Week 4", students: 25 },
]

const passRateData = [
    { name: "Theory", value: 300 },
    { name: "Signs", value: 450 },
    { name: "Hazard", value: 200 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

export function ManagerAnalytics() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in zoom-in duration-500">
            <Card>
                <CardHeader>
                    <CardTitle>Student Registrations</CardTitle>
                    <CardDescription>New learners over the last month</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={registrationData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--foreground)' }}
                                    cursor={{ fill: 'var(--muted)' }}
                                />
                                <Bar dataKey="students" fill="#2563eb" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Module Popularity</CardTitle>
                    <CardDescription>Distribution of practice sessions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={passRateData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {passRateData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-4 text-sm text-muted-foreground mt-4">
                            {passRateData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    {entry.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
