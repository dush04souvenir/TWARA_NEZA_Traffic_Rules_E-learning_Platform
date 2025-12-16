// lib/email.ts
import nodemailer from "nodemailer";

/**
 * Simple wrapper around nodemailer to send transactional emails.
 * Uses environment variables for SMTP configuration.
 *   EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM
 */
export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT || 587),
        secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM || "no-reply@twara-neza.com",
        to,
        subject,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${to}`);
    } catch (error) {
        console.warn("⚠️ SMTP Connection Failed. Printing email to console instead:");
        console.log("================ MOCK EMAIL PREVIEW ================");
        console.log(`TO: ${to}`);
        console.log(`SUBJECT: ${subject}`);
        console.log("----------------------------------------------------");
        console.log("BODY (HTML):");
        console.log(html);
        console.log("====================================================");
        // We re-throw specifically if we want to handle it upstream, 
        // but often in dev we just want to proceed. 
        // Let's rethrow properly so the caller knows, unless we decide email is optional.
        // Given the previous fix suppressed it in the caller, we can strictly rethrow here 
        // OR just swallow it here to make it global. 
        // Let's throw it so the caller's specific logging still fires, 
        // but the console output above stays as the visual confirmation.
        throw error;
    }
}
