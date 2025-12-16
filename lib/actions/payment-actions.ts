// lib/actions/payment-actions.ts
"use server";

import { db as prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { isMock } from "@/lib/paymentMode";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "@/lib/email";

/**
 * Create a payment record for a learner attempting an exam (topic).
 * If `isMock` is true, the payment is auto‑approved (or pending based on flag).
 * In production you would integrate Stripe (or another gateway) here.
 */
export async function createPayment(args: {
    learnerId: string;
    topicId: string;
    amountCents: number;
    autoApprove?: boolean;
}) {
    const autoApprove = args.autoApprove ?? false;
    const { learnerId, topicId, amountCents } = args;

    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).id !== learnerId) {
        throw new Error("Unauthorized");
    }

    // ... (previous code)

    if (isMock) {
        // Mock flow – create a payment record directly
        const payment = await prisma.payment.create({
            data: {
                learnerId,
                examId: topicId,
                amountCents,
                currency: "RWF",
                stripeSessionId: `mock_${uuidv4()}`,
                status: autoApprove ? "APPROVED" : "PENDING",
            },
        });
        // Send email notification
        const learner = await prisma.user.findUnique({ where: { id: learnerId } });
        if (learner?.email) {
            try {
                const subject = autoApprove
                    ? "Payment Received – Exam Unlocked"
                    : "Payment Received – Pending Approval";
                const html = `<p>Dear ${learner.name || 'Learner'},</p>
    <p>Your payment of ${amountCents} RWF for the exam has been ${autoApprove ? 'approved' : 'received and is pending manager approval'}.</p>
    <p>Payment ID: ${payment.id}</p>`;
                await sendEmail({ to: learner.email, subject, html });
            } catch (error) {
                console.warn("Failed to send payment confirmation email:", error);
            }
        }
        // ... (rest of function)

        // ...

        // If auto‑approved, unlock the exam immediately
        if (autoApprove) {
            await revalidatePath("/quiz");
        }
        await revalidatePath("/manager-dashboard");
        return payment;
    }

    // ----- REAL PAYMENT PLACEHOLDER -----
    // Here you would call Stripe SDK to create a Checkout Session,
    // store the session ID, and return the URL for the frontend to redirect.
    // For now we throw to remind developers to implement it.
    throw new Error(
        "Real payment integration not implemented. Set PAYMENT_MODE=mock for demo."
    );
}

/**
 * Get aggregated revenue statistics for Admin/Manager
 */
export async function getRevenueStats() {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || (role !== "MANAGER" && role !== "ADMIN")) {
        return { totalRevenue: 0, recentTransactions: [] };
    }

    const payments = await prisma.payment.findMany({
        where: { status: "APPROVED" },
        include: {
            learner: {
                select: { name: true, email: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    const topics = await prisma.topic.findMany();
    const topicMap = new Map(topics.map(t => [t.id, t.title]));
    // Add special case for comprehensive exam if needed
    topicMap.set("comprehensive_practice_exam", "Comprehensive Practice Exam");

    let totalRevenue = 0;
    const recentTransactions = payments.map(p => {
        totalRevenue += p.amountCents;
        return {
            id: p.id,
            learnerName: p.learner.name || "Unknown",
            learnerEmail: p.learner.email,
            item: topicMap.get(p.examId) || "Unknown Item",
            amount: p.amountCents,
            date: p.createdAt,
            status: p.status
        };
    });

    return {
        totalRevenue,
        recentTransactions
    };
}

/** Retrieve payment status for a learner & topic */
export async function getPaymentStatus({ learnerId, topicId }: { learnerId: string; topicId: string }) {
    const payment = await prisma.payment.findFirst({
        where: { learnerId, examId: topicId },
        orderBy: { createdAt: "desc" },
    });
    return payment?.status ?? null;
}

/**
 * Approve a pending payment.
 * This is called by a Manager.
 */
export async function approvePayment(paymentId: string) {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || (role !== "MANAGER" && role !== "ADMIN")) {
        return { error: "Unauthorized" };
    }

    const payment = await prisma.payment.update({
        where: { id: paymentId },
        data: { status: "APPROVED" },
        include: { learner: true } // Include learner to get email
    });

    // Send confirmation email
    if (payment.learner?.email) {
        try {
            const subject = "Payment Approved – Exam Unlocked";
            const html = `<p>Dear ${payment.learner.name || 'Learner'},</p>
<p>Your payment for the exam has been approved by a manager. You can now access the exam.</p>
<p>Happy Learning!</p>`;
            await sendEmail({ to: payment.learner.email, subject, html });
        } catch (error) {
            console.error("Failed to send approval email:", error);
            // We suppress the error so the approval flow completes even if email fails
        }
    }

    // Revalidate paths so UI updates immediately
    revalidatePath("/manager-dashboard");
    revalidatePath("/quiz");

    return { success: true, payment };
}

/**
 * Get all pending payments for manager review
 */
export async function getPendingPayments() {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || (role !== "MANAGER" && role !== "ADMIN")) {
        return [];
    }

    return await prisma.payment.findMany({
        where: { status: "PENDING" },
        include: {
            learner: {
                select: { name: true, email: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });
}

/**
 * Get count of pending payments
 */
export async function getPendingPaymentCount() {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || (role !== "MANAGER" && role !== "ADMIN")) {
        return 0;
    }

    return await prisma.payment.count({
        where: { status: "PENDING" }
    });
}
