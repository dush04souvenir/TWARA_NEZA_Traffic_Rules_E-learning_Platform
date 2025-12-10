"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Mail, Phone, MapPin, Calendar, BookOpen, AlertCircle } from "lucide-react"

export function ManagerStudentList() {
    const [students, setStudents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null)

    useEffect(() => {
        async function fetchStudents() {
            try {
                // Dynamically import the server action to avoid build issues if mixed component types
                const { getStudents } = await import("@/lib/actions/manager-actions")
                const result = await getStudents()

                if (result.students) {
                    // Map DB users to UI format (mocking progress/status for now as they are not in DB yet)
                    const mappedStudents = result.students.map((s: any) => ({
                        id: s.id,
                        name: s.name || "Unknown",
                        email: s.email,
                        progress: Math.floor(Math.random() * 100), // Mock progress
                        status: Math.random() > 0.7 ? "At Risk" : Math.random() > 0.3 ? "Active" : "Ready for Exam", // Mock status
                        phone: "+250 788 000 000", // Placeholder
                        enrolledDate: new Date(s.createdAt).toLocaleDateString(),
                        lastActive: "Just now",
                        recentActivity: "Joined platform",
                        upcomingExam: "N/A"
                    }))
                    setStudents(mappedStudents)
                }
            } catch (error) {
                console.error("Failed to load students", error)
            } finally {
                setLoading(false)
            }
        }
        fetchStudents()
    }, [])

    const [searchQuery, setSearchQuery] = useState("")

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="font-semibold text-lg">Student Directory</h3>
                    <p className="text-sm text-muted-foreground">Manage and monitor student progress</p>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search students..."
                        className="px-4 py-2 border rounded-md text-sm w-full sm:w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredStudents.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                No students found matching "{searchQuery}"
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredStudents.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{student.name}</div>
                                        <div className="text-xs text-muted-foreground">{student.email}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={student.status === "At Risk" ? "destructive" : student.status === "Ready for Exam" ? "default" : "secondary"}>
                                        {student.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="w-full bg-muted rounded-full h-2.5 max-w-[100px]">
                                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${student.progress}%` }}></div>
                                    </div>
                                    <span className="text-xs text-muted-foreground mt-1 block">{student.progress}% completed</span>
                                </TableCell>
                                <TableCell>
                                    <button
                                        onClick={() => setSelectedStudent(student)}
                                        className="text-primary text-sm font-medium hover:underline cursor-pointer focus:outline-none"
                                    >
                                        View Details
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
                <DialogContent className="max-w-md">
                    {selectedStudent && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-4 mb-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarFallback className="text-xl">{selectedStudent.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <DialogTitle className="text-xl">{selectedStudent.name}</DialogTitle>
                                        <DialogDescription className="flex items-center gap-2 mt-1">
                                            <Mail className="w-3 h-3" /> {selectedStudent.email}
                                        </DialogDescription>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                            <Phone className="w-3 h-3" /> {selectedStudent.phone}
                                        </div>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Status Section */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <div className="text-xs text-muted-foreground mb-1">Current Status</div>
                                        <Badge variant={selectedStudent.status === "At Risk" ? "destructive" : selectedStudent.status === "Ready for Exam" ? "default" : "secondary"}>
                                            {selectedStudent.status}
                                        </Badge>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <div className="text-xs text-muted-foreground mb-1">Enrolled</div>
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <Calendar className="w-3 h-3" />
                                            {selectedStudent.enrolledDate}
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Section */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-sm font-semibold">Course Progress</h4>
                                        <span className="text-sm text-muted-foreground">{selectedStudent.progress}%</span>
                                    </div>
                                    <Progress value={selectedStudent.progress} className="h-2" />
                                </div>

                                {/* Activity Feed */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold">Recent Activity</h4>

                                    <div className="flex gap-3 text-sm border-l-2 border-primary/20 pl-3">
                                        <div className="shrink-0 mt-0.5">
                                            <BookOpen className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{selectedStudent.recentActivity}</p>
                                            <p className="text-xs text-muted-foreground">{selectedStudent.lastActive}</p>
                                        </div>
                                    </div>

                                    {selectedStudent.upcomingExam !== "N/A" && (
                                        <div className="flex gap-3 text-sm border-l-2 border-yellow-500/50 pl-3">
                                            <div className="shrink-0 mt-0.5">
                                                <AlertCircle className="w-4 h-4 text-yellow-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Upcoming Event</p>
                                                <p className="text-xs text-muted-foreground">{selectedStudent.upcomingExam}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button variant="outline" onClick={() => setSelectedStudent(null)}>Close</Button>
                                <Button asChild>
                                    <a href={`mailto:${selectedStudent.email}?subject=Course Progress Update&body=Hi ${selectedStudent.name},`}>
                                        Contact Student
                                    </a>
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
