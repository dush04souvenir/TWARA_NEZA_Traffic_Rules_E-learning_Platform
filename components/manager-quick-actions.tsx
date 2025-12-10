"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { addStudent, createQuiz } from "@/lib/actions/manager-actions"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function ManagerQuickActions() {
    // Add Student State
    const [studentOpen, setStudentOpen] = useState(false)
    const [studentLoading, setStudentLoading] = useState(false)
    const [studentName, setStudentName] = useState("")
    const [studentEmail, setStudentEmail] = useState("")
    const [studentPassword, setStudentPassword] = useState("")

    // Create Quiz State
    const [quizOpen, setQuizOpen] = useState(false)
    const [quizLoading, setQuizLoading] = useState(false)
    const [quizTitle, setQuizTitle] = useState("")
    const [quizDesc, setQuizDesc] = useState("")

    async function handleAddStudent(e: React.FormEvent) {
        e.preventDefault()
        setStudentLoading(true)

        const res = await addStudent({ name: studentName, email: studentEmail, password: studentPassword })

        setStudentLoading(false)
        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success(res.success)
            setStudentOpen(false)
            setStudentName("")
            setStudentEmail("")
            setStudentPassword("")
        }
    }

    async function handleCreateQuiz(e: React.FormEvent) {
        e.preventDefault()
        setQuizLoading(true)

        const res = await createQuiz({ title: quizTitle, description: quizDesc })

        setQuizLoading(false)
        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success(res.success)
            setQuizOpen(false)
            setQuizTitle("")
            setQuizDesc("")
        }
    }

    return (
        <div className="bg-card rounded-xl border p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">

                {/* Add Student Dialog */}
                <Dialog open={studentOpen} onOpenChange={setStudentOpen}>
                    <DialogTrigger asChild>
                        <div className="p-4 border rounded-lg hover:bg-accent text-left transition-colors cursor-pointer">
                            <span className="block font-medium">Add Student</span>
                            <span className="text-xs text-muted-foreground">Enroll new learner manually</span>
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Student</DialogTitle>
                            <DialogDescription>
                                Create a new learner account. Set a temporary password or leave blank for 'password123'.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddStudent} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="student-name">Full Name</Label>
                                <Input
                                    id="student-name"
                                    placeholder="e.g. Jean Pierre"
                                    value={studentName}
                                    onChange={e => setStudentName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="student-email">Email Address</Label>
                                <Input
                                    id="student-email"
                                    type="email"
                                    placeholder="e.g. jean@gmail.com"
                                    value={studentEmail}
                                    onChange={e => setStudentEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="student-password">Password (Optional)</Label>
                                <Input
                                    id="student-password"
                                    type="password"
                                    placeholder="Leave blank for default: password123"
                                    value={studentPassword}
                                    onChange={e => setStudentPassword(e.target.value)}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={studentLoading}>
                                    {studentLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Create Account
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Create Quiz Dialog */}
                <Dialog open={quizOpen} onOpenChange={setQuizOpen}>
                    <DialogTrigger asChild>
                        <div className="p-4 border rounded-lg hover:bg-accent text-left transition-colors cursor-pointer">
                            <span className="block font-medium">Create Quiz</span>
                            <span className="text-xs text-muted-foreground">Draft new question set</span>
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Quiz Topic</DialogTitle>
                            <DialogDescription>
                                Start a new topic for questions. You can add specific questions later in the content manager.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateQuiz} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="quiz-title">Topic Title</Label>
                                <Input
                                    id="quiz-title"
                                    placeholder="e.g. Advanced Parking"
                                    value={quizTitle}
                                    onChange={e => setQuizTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quiz-desc">Description</Label>
                                <Textarea
                                    id="quiz-desc"
                                    placeholder="Brief description of what this topic covers..."
                                    value={quizDesc}
                                    onChange={e => setQuizDesc(e.target.value)}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={quizLoading}>
                                    {quizLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Create Topic
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    )
}
