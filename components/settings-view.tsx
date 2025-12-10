"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateProfile } from "@/lib/actions/user-actions"
import { toast } from "sonner"

export function SettingsView() {
    const { data: session, update } = useSession()

    const [name, setName] = useState(session?.user?.name || "")
    const [email, setEmail] = useState(session?.user?.email || "")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        const user = session?.user as { id: string, name?: string | null, email?: string | null } | undefined
        if (!user?.id) return

        setLoading(true)
        try {
            const formData = {
                name,
                email,
                ...(newPassword ? { password: currentPassword, newPassword } : {})
            }

            const res = await updateProfile(user.id, formData)

            if (res.error) {
                toast.error(res.error)
            } else if (res.success) {
                toast.success(res.success)
                update({ name }) // Optimistically update session
                setCurrentPassword("")
                setNewPassword("")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@gmail.com"
                                disabled // Email change might require verification, keeping disabled for now
                            />
                        </div>

                        <div className="pt-4 border-t">
                            <h3 className="font-medium mb-4">Change Password (Optional)</h3>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <Input
                                        id="current-password"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="mt-4">
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
