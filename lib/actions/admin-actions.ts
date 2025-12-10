"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// --- Topics ---

const TopicSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
});

export async function createTopic(values: z.infer<typeof TopicSchema>) {
    const validated = TopicSchema.safeParse(values);
    if (!validated.success) return { error: "Invalid topic data" };

    try {
        const topic = await db.topic.create({
            data: validated.data,
        });
        revalidatePath("/admin/topics");
        return { success: "Topic created", topic };
    } catch (error) {
        return { error: "Failed to create topic" };
    }
}

export async function deleteTopic(id: string) {
    try {
        await db.topic.delete({ where: { id } });
        revalidatePath("/admin/topics");
        return { success: "Topic deleted" };
    } catch (error) {
        return { error: "Failed to delete topic" };
    }
}

// --- Questions ---

const QuestionSchema = z.object({
    topicId: z.string(),
    text: z.string().min(5),
    points: z.coerce.number().min(1).default(1),
    options: z.array(z.object({
        text: z.string().min(1),
        isCorrect: z.boolean().default(false),
    })).min(2),
});

export async function createQuestion(values: z.infer<typeof QuestionSchema>) {
    const validated = QuestionSchema.safeParse(values);
    if (!validated.success) return { error: "Invalid question data" };

    const { topicId, text, points, options } = validated.data;

    try {
        // Create question and options in a transaction approach (nested write)
        await db.question.create({
            data: {
                topicId,
                text,
                points,
                options: {
                    create: options,
                },
            },
        });
        revalidatePath(`/admin/topics/${topicId}`);
        return { success: "Question created" };
    } catch (error) {
        return { error: "Failed to create question" };
    }
}

export async function deleteQuestion(id: string) {
    try {
        await db.question.delete({ where: { id } });
        return { success: "Question deleted" };
    } catch (error) {
        return { error: "Failed to delete question" };
    }
}

// --- Stats & Users ---

export async function getAdminStats() {
    try {
        const [userCount, questionCount, topicCount] = await Promise.all([
            db.user.count(),
            db.question.count(),
            db.topic.count(),
        ]);

        return {
            users: userCount,
            questions: questionCount,
            topics: topicCount
        };
    } catch (error) {
        return { users: 0, questions: 0, topics: 0 };
    }
}

export async function getUsers() {
    try {
        const users = await db.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            }
        });
        return users;
    } catch (error) {
        return [];
    }
}

export async function deleteUser(id: string) {
    try {
        await db.user.delete({ where: { id } });
        revalidatePath("/admin-dashboard");
        return { success: "User deleted" };
    } catch (error) {
        return { error: "Failed to delete user" };
    }
}

export async function getAdminTopics() {
    try {
        return await db.topic.findMany({
            include: {
                questions: {
                    include: {
                        options: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        return [];
    }
}
