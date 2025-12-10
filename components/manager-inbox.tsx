"use client"

import { useEffect, useState } from "react"
import { getContactMessages, markMessageAsRead } from "@/lib/actions/contact-actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle } from "lucide-react"
import { format } from "date-fns"

interface Message {
    id: string
    name: string
    email: string
    message: string
    status: string
    createdAt: Date
}

export function ManagerInbox() {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadMessages()
    }, [])

    async function loadMessages() {
        const result = await getContactMessages()
        if (result.messages) {
            setMessages(result.messages)
        }
        setLoading(false)
    }

    async function handleMarkRead(id: string) {
        await markMessageAsRead(id)
        loadMessages() // Refresh
    }

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Inbox</h2>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {messages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">No messages found</TableCell>
                            </TableRow>
                        ) : (
                            messages.map((msg) => (
                                <TableRow key={msg.id} className={msg.status === "unread" ? "bg-muted/30 font-medium" : ""}>
                                    <TableCell>
                                        <Badge variant={msg.status === "unread" ? "default" : "secondary"}>
                                            {msg.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {format(new Date(msg.createdAt), "MMM d, HH:mm")}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{msg.name}</span>
                                            <span className="text-xs text-muted-foreground">{msg.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-md truncate" title={msg.message}>
                                        {msg.message}
                                    </TableCell>
                                    <TableCell>
                                        {msg.status === "unread" && (
                                            <Button size="sm" variant="ghost" onClick={() => handleMarkRead(msg.id)}>
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Mark Read
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
