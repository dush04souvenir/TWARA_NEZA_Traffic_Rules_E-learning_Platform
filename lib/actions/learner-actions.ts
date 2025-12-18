"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getTopics(userId?: string) {
    try {
        // Security check: Ensure requesting user matches logged in session
        if (userId) {
            const session = await getServerSession(authOptions);
            if (!session || (session.user as any).id !== userId) {
                console.warn(`Unauthorized access attempt to topics for user ${userId}`);
                return []; // Fail silently or throw
            }
        }

        const topics = await db.topic.findMany({
            include: {
                _count: {
                    select: { questions: true },
                },
            },
        });

        if (!userId) {
            return topics.map((t, index) => ({
                ...t,
                paymentStatus: index === 0 ? 'APPROVED' : 'NONE',
                isFree: index === 0
            }));
        }

        // Fetch payments for this user
        const payments = await db.payment.findMany({
            where: {
                learnerId: userId,
                examId: { in: topics.map(t => t.id) }
            }
        });

        return topics.map((topic, index) => {
            if (index === 0) {
                return { ...topic, paymentStatus: 'APPROVED', isFree: true };
            }

            const payment = payments.find(p => p.examId === topic.id);
            // If payment exists, use its status (e.g. APPROVED or PENDING)
            // If no payment, status is NONE
            return {
                ...topic,
                paymentStatus: payment ? payment.status : 'NONE',
                isFree: false
            };
        });

    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getQuizForTopic(topicId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return [];

        const userId = (session.user as any).id;

        // Determine if authorized (Free topic or Paid)
        // 1. Check if it's the free topic (first one)
        // Note: Sort order must match getTopics to be consistent. 
        // We assume default order here as used in getTopics.
        const allTopics = await db.topic.findMany({ select: { id: true } });
        const isFree = allTopics.length > 0 && allTopics[0].id === topicId;

        if (!isFree) {
            // 2. Check payment
            const payment = await db.payment.findFirst({
                where: {
                    learnerId: userId,
                    examId: topicId,
                    status: "APPROVED"
                }
            });
            if (!payment) {
                // Not authorized
                return [];
            }
        }

        const questions = await db.question.findMany({
            where: { topicId },
            include: {
                options: {
                    select: { id: true, text: true }, // Don't send isCorrect to frontend
                },
            },
        });
        return questions;
    } catch (error) {
        return [];
    }
}

export async function submitQuiz(userId: string, topicId: string, answers: Record<string, string>) {
    // answers: { questionId: optionId }

    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).id !== userId) {
        return { error: "Unauthorized" };
    }

    try {
        const questions = await db.question.findMany({
            where: { topicId },
            include: { options: true }
        });

        let score = 0;
        let totalPoints = 0;

        // Prepare review data
        const reviewData = questions.map(q => {
            const correctOption = q.options.find(o => o.isCorrect);
            return {
                questionId: q.id,
                text: q.text,
                options: q.options.map(o => ({ id: o.id, text: o.text, isCorrect: o.isCorrect })),
                correctOptionId: correctOption?.id,
                userSelectedId: answers[q.id]
            };
        });

        questions.forEach((q) => {
            totalPoints += q.points;
            const selectedOptionId = answers[q.id];
            const correctOption = q.options.find(o => o.isCorrect);

            if (correctOption && correctOption.id === selectedOptionId) {
                score += q.points;
            }
        });

        let result;
        try {
            result = await db.quizResult.create({
                data: {
                    userId,
                    score,
                    total: totalPoints,
                    details: reviewData as any
                }
            });
        } catch (err) {
            console.warn("Saving details failed (likely stale client), saving basic result.");
            result = await db.quizResult.create({
                data: {
                    userId,
                    score,
                    total: totalPoints,
                }
            });
        }

        revalidatePath("/dashboard/progress");
        return { success: true, result, reviewData };

    } catch (error) {
        return { error: "Failed to submit quiz" };
    }
}

export async function getUserProgress(userId: string) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).id !== userId) {
        return [];
    }

    try {
        return await db.quizResult.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 10,
            // details is fetched automatically if not excluded
        });
    } catch (error) {
        return [];
    }
}

export async function getLearnerStats(userId: string) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).id !== userId) {
        return { quizzesCompleted: 0, avgScore: 0, streak: 0 };
    }
    try {
        const results = await db.quizResult.findMany({
            where: { userId }
        });

        const totalQuizzes = results.length;
        const totalScore = results.reduce((acc: number, curr: { score: number }) => acc + curr.score, 0);
        const maxScore = results.reduce((acc: number, curr: { total: number }) => acc + curr.total, 0);

        const avgPercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

        return {
            quizzesCompleted: totalQuizzes,
            avgScore: avgPercentage,
            streak: 0 // Placeholder logic for now
        };
    } catch (error) {
        return { quizzesCompleted: 0, avgScore: 0, streak: 0 };
    }
}

export async function getTrafficSigns() {
    try {
        return await db.trafficSign.findMany();
    } catch (error) {
        return [];
    }
}

export async function getUserDetailedStats(userId: string) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).id !== userId) {
        return [];
    }
    try {
        const results = await db.quizResult.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
            take: 20 // Last 20 quizzes
        });

        // Format for Recharts: { date: 'DD/MM', score: number }
        return results.map(r => ({
            date: r.createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }),
            score: (r.score / r.total) * 100, // Normalized to percentage
        }));
    } catch (error) {
        return [];
    }
}

export async function generatePracticeExam() {
    try {
        // Fetch all questions with options
        const allQuestions = await db.question.findMany({
            include: {
                options: {
                    select: { id: true, text: true }, // Hide isCorrect
                }
            }
        });

        // Shuffle and take 20
        const shuffled = allQuestions.sort(() => 0.5 - Math.random());
        const examQuestions = shuffled.slice(0, 20);

        return examQuestions;
    } catch (error) {
        return [];
    }
}

export async function submitExam(userId: string, answers: Record<string, string>) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).id !== userId) {
        return { error: "Unauthorized" };
    }
    try {
        const questionIds = Object.keys(answers);
        const questions = await db.question.findMany({
            where: { id: { in: questionIds } },
            include: { options: true }
        });

        let score = 0;
        let totalPoints = 0;

        // Prepare review data
        const reviewData = questions.map(q => {
            const correctOption = q.options.find(o => o.isCorrect);
            return {
                questionId: q.id,
                text: q.text,
                options: q.options.map(o => ({ id: o.id, text: o.text, isCorrect: o.isCorrect })),
                correctOptionId: correctOption?.id,
                userSelectedId: answers[q.id]
            };
        });

        questions.forEach((q) => {
            totalPoints += q.points;
            const selectedOptionId = answers[q.id];
            const correctOption = q.options.find(o => o.isCorrect);

            if (correctOption && correctOption.id === selectedOptionId) {
                score += q.points;
            }
        });

        let result;
        try {
            result = await db.quizResult.create({
                data: {
                    userId,
                    score,
                    total: totalPoints,
                    details: reviewData as any
                }
            });
        } catch (err) {
            console.warn("Saving details failed (likely stale client), saving basic result.");
            result = await db.quizResult.create({
                data: {
                    userId,
                    score,
                    total: totalPoints,
                }
            });
        }

        revalidatePath("/learner-dashboard");
        revalidatePath("/learner-dashboard");
        return { success: true, result, score, total: totalPoints, reviewData };
    } catch (error) {
        return { error: "Failed to submit exam" };
    }
}

export async function getFocusAreas(userId: string) {
    try {
        const results = await db.quizResult.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            // Select details
        });

        // Collect incorrect question IDs
        const incorrectQuestionIds = new Set<string>();
        results.forEach(r => {
            if (r.details && Array.isArray(r.details)) {
                (r.details as any[]).forEach(d => {
                    if (d.userSelectedId !== d.correctOptionId) {
                        incorrectQuestionIds.add(d.questionId);
                    }
                });
            }
        });

        if (incorrectQuestionIds.size === 0) return [];

        // Fetch actual question data
        const questions = await db.question.findMany({
            where: { id: { in: Array.from(incorrectQuestionIds).slice(0, 3) } }, // Limit to 3
            include: {
                topic: true,
                options: { where: { isCorrect: true }, take: 1 }
            }
        });

        return questions.map(q => ({
            id: q.id,
            text: q.text,
            topic: q.topic.title,
            topicId: q.topic.id,
            correctAnswer: q.options[0]?.text || "Review topic for answer"
        }));
    } catch (error) {
        return [];
    }
}

export async function checkBadgeEligibility(userId: string) {
    try {
        const results = await db.quizResult.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        // Simple logic: If average of last 5 > 80%, grant "Road Ready" badge
        if (results.length < 3) return false;

        const avg = results.reduce((acc, curr) => acc + (curr.score / curr.total), 0) / results.length;
        return avg >= 0.8;
    } catch (error) {
        return false;
    }
}
