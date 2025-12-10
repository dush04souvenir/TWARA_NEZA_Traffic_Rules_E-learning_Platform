"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function submitContactMessage(formData: FormData) {
    const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        message: formData.get("message") as string,
    }

    const result = contactSchema.safeParse(data)

    if (!result.success) {
        return { error: "Invalid form data. Please check your inputs." }
    }

    try {
        await db.contactMessage.create({
            data: result.data,
        })

        revalidatePath("/manager-dashboard")
        return { success: true }
    } catch (error) {
        console.error("Failed to save contact message:", error)
        return { error: "Something went wrong. Please try again later." }
    }
}

export async function getContactMessages() {
    try {
        const messages = await db.contactMessage.findMany({
            orderBy: { createdAt: "desc" },
        })
        return { messages }
    } catch (error) {
        console.error("Failed to fetch messages:", error)
        return { error: "Failed to fetch messages", messages: [] }
    }
}

export async function markMessageAsRead(id: string) {
    try {
        await db.contactMessage.update({
            where: { id },
            data: { status: "read" },
        })
        revalidatePath("/manager-dashboard")
        return { success: true }
    } catch (error) {
        return { error: "Failed to update message" }
    }
}
