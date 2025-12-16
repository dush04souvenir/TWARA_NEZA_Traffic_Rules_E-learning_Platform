"use client"

import { useState } from "react"
import { approvePayment } from "@/lib/actions/payment-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, CheckCircle, Clock } from "lucide-react"

interface Payment {
    id: string
    amountCents: number
    status: string
    createdAt: Date
    learner: {
        name: string | null
        email: string
    }
}

interface PaymentApprovalsProps {
    initialPayments: Payment[]
}

export function PaymentApprovals({ initialPayments }: PaymentApprovalsProps) {
    const [payments, setPayments] = useState<Payment[]>(initialPayments)
    const [processingId, setProcessingId] = useState<string | null>(null)

    const handleApprove = async (id: string, learnerName: string) => {
        setProcessingId(id)
        try {
            await approvePayment(id)
            setPayments(prev => prev.filter(p => p.id !== id))
            toast.success(`Payment for ${learnerName} approved`)
        } catch (error) {
            console.error(error)
            toast.error("Failed to approve payment")
        } finally {
            setProcessingId(null)
        }
    }

    const handleReject = async (id: string) => {
        if (!confirm("Are you sure you want to reject this payment?")) return;
        toast.error("Rejection not yet implemented in backend.");
    }

    if (payments.length === 0) {
        return (
            <Card className="border-dashed bg-muted/20">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-semibold">All Caught Up!</h3>
                    <p>No pending payments to review at this time.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {payments.map((payment) => (
                <Card key={payment.id} className="overflow-hidden border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="bg-white dark:bg-card pb-3 border-b">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-semibold">
                                    {payment.learner.name || "Unknown Learner"}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {new Date(payment.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-full border border-yellow-200 uppercase tracking-wide">
                                Pending
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                                <span className="text-muted-foreground text-xs uppercase font-semibold">Amount</span>
                                <p className="font-medium text-lg text-emerald-600">${(payment.amountCents / 100).toFixed(2)}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-muted-foreground text-xs uppercase font-semibold">Learner Email</span>
                                <p className="font-medium truncate" title={payment.learner.email}>{payment.learner.email}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                                <span className="text-muted-foreground text-xs uppercase font-semibold">Payment ID</span>
                                <p className="font-mono text-xs text-muted-foreground bg-muted p-1 rounded w-fit">{payment.id}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button
                                variant="outline"
                                className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-white"
                                onClick={() => handleReject(payment.id)}
                                disabled={!!processingId}
                            >
                                Reject
                            </Button>
                            <Button
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleApprove(payment.id, payment.learner.name || 'Learner')}
                                disabled={processingId === payment.id}
                            >
                                {processingId === payment.id ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Approving
                                    </>
                                ) : (
                                    "Approve"
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
