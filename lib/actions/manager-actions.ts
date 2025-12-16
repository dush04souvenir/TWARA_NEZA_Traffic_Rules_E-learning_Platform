"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const StudentSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
})

const QuizSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
})

export async function addStudent(data: z.infer<typeof StudentSchema>) {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (role !== "MANAGER" && role !== "ADMIN") return { error: "Unauthorized" };

    const validated = StudentSchema.safeParse(data)
    if (!validated.success) return { error: "Invalid data" }

    const { name, email, password } = validated.data
    const finalPassword = password && password.length >= 6 ? password : "password123"

    try {
        const existing = await db.user.findUnique({ where: { email } })
        if (existing) return { error: "Email already exists" }

        const hashedPassword = await bcrypt.hash(finalPassword, 10)

        await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "LEARNER"
            }
        })

        revalidatePath("/manager-dashboard")
        return { success: `Student registered. Password is '${finalPassword}'` }
    } catch (error) {
        return { error: "Failed to register student" }
    }
}

export async function createQuiz(data: z.infer<typeof QuizSchema>) {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (role !== "MANAGER" && role !== "ADMIN") return { error: "Unauthorized" };

    const validated = QuizSchema.safeParse(data)
    if (!validated.success) return { error: "Invalid data" }

    const { title, description } = validated.data

    try {
        await db.topic.create({
            data: {
                title,
                description: description || ""
            }
        })

        revalidatePath("/manager-dashboard")
        return { success: "Quiz topic created successfully" }
    } catch (error) {
        return { error: "Failed to create quiz" }
    }
}

export async function getStudents() {
    try {
        const session = await getServerSession(authOptions);
        const role = (session?.user as any)?.role;
        if (role !== "MANAGER" && role !== "ADMIN") return { error: "Unauthorized" };

        const students = await db.user.findMany({
            where: { role: "LEARNER" },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            }
        })
        return { students }
    } catch (error) {
        return { error: "Failed to fetch students" }
    }
}

export async function sendManagerEmail(studentEmail: string, subject: string, message: string) {
    try {
        const session = await getServerSession(authOptions);
        const role = (session?.user as any)?.role;
        if (role !== "MANAGER" && role !== "ADMIN") return { error: "Unauthorized" };

        const { sendEmail } = await import("@/lib/email");
        await sendEmail({
            to: studentEmail,
            subject: subject,
            html: `<p>You have received a message from your manager:</p>
                    <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #555;">
                        ${message.replace(/\n/g, "<br>")}
                    </blockquote>
                    <p>Regards,<br>Twara Neza Team</p>`
        });
        return { success: "Email sent successfully" };
    } catch (error) {
        console.error("Failed to send manager email:", error);
        return { error: "Failed to send email" };
    }
}
