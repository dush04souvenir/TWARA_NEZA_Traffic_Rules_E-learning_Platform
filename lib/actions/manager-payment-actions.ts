// lib/actions/manager-payment-actions.ts
"use server";

import { db as prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";

/**
 * Approve a pending payment. Only managers or admins should call this.
 */
export async function approvePayment(paymentId: string, approverId: string) {
    const payment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
            status: "APPROVED",
            managerId: approverId,
        },
    });
    // Notify learner via email
    const learner = await prisma.user.findUnique({ where: { id: payment.learnerId } });
    if (learner?.email) {
        const subject = "Your payment has been approved";
        const html = `<p>Dear ${learner.name || 'Learner'},</p>
            <p>Your payment (ID: ${payment.id}) for the exam has been approved. You can now start your exam.</p>`;
        await sendEmail({ to: learner.email, subject, html });
    }
    // Revalidate any pages that list payments or unlock exams
    await revalidatePath("/manager-dashboard");
    await revalidatePath("/quiz");
    return payment;
}

/**
 * Reject a pending payment with an optional note.
 */
export async function rejectPayment(
    paymentId: string,
    approverId: string,
    note?: string
) {
    const payment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
            status: "REJECTED",
            managerId: approverId,
            notes: note ?? null,
        },
    });
    // Notify learner about rejection
    const learner = await prisma.user.findUnique({ where: { id: payment.learnerId } });
    if (learner?.email) {
        const subject = "Your payment was rejected";
        const html = `<p>Dear ${learner.name || 'Learner'},</p>
            <p>Your payment (ID: ${payment.id}) for the exam was rejected.</p>
            <p>Reason: ${note ?? 'No additional details provided.'}</p>`;
        await sendEmail({ to: learner.email, subject, html });
    }
    await revalidatePath("/manager-dashboard");
    return payment;
}
