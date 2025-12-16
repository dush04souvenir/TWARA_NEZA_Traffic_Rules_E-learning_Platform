import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function GET() {
    try {
        const testEmail = "dushimesouvenir@gmail.com";
        // Using the address user specifically asked about

        console.log("Attempting to send debug email...");
        console.log("Config:", {
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            user: process.env.EMAIL_USER ? "(Set)" : "(Missing)",
            pass: process.env.EMAIL_PASS ? "(Set)" : "(Missing)"
        });

        await sendEmail({
            to: testEmail,
            subject: "Twara Neza - Diagnostics Test",
            html: "<h1>It Works!</h1><p>Your email configuration is correct.</p>"
        });

        return NextResponse.json({ success: true, message: `Email sent to ${testEmail}` });
    } catch (error: any) {
        console.error("Test failed:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            details: error.response || error.command || "Unknown SMTP error"
        }, { status: 500 });
    }
}
