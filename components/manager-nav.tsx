"use client"

import { Button } from "./ui/button"
import { LayoutDashboard, Users, Mail, PieChart, Settings, LogOut } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { signOut } from "next-auth/react"

export function ManagerNav() {
    const router = useRouter()
    const searchParams = useSearchParams()
    // Use state or props if controlled by parent, but for sidebar pattern query params are good
    const currentView = searchParams.get("view") || "overview"

    const navItems = [
        { label: "Overview", id: "overview", icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: "Students", id: "students", icon: <Users className="w-5 h-5" /> },
        { label: "Inbox", id: "inbox", icon: <Mail className="w-5 h-5" /> },
        { label: "Reports", id: "reports", icon: <PieChart className="w-5 h-5" /> },
    ]

    const handleNav = (viewId: string) => {
        // If we are using client state in the parent, this might need an event handler.
        // However, to align with Admin Dashboard pattern, we can use query params.
        // If the user wants a maximized feel, persistent URL state is better.
        router.push(`/manager-dashboard?view=${viewId}`)
    }

    return (
        <nav className="h-full flex flex-col justify-between p-4 bg-card border-r">
            <div className="space-y-6">
                <div className="px-4 py-2">
                    <h2 className="text-lg font-bold tracking-tight text-primary">Manager Portal</h2>
                    <p className="text-xs text-muted-foreground">TWARA NEZA</p>
                </div>
                <div className="space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNav(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-left ${currentView === item.id
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="border-t pt-4">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-destructive gap-3 px-4"
                    onClick={() => signOut({ callbackUrl: "/" })}
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </Button>
            </div>
        </nav>
    )
}
