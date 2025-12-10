"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";

const SettingsSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    newPassword: z.string().min(6).optional(),
});

export async function updateProfile(userId: string, values: z.infer<typeof SettingsSchema>) {
    const validated = SettingsSchema.safeParse(values);
    if (!validated.success) return { error: "Invalid settings" };

    const { name, email, password, newPassword } = validated.data;

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return { error: "User not found" };

    const updateData: any = { name, email };

    if (newPassword && password) {
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
            return { error: "Incorrect current password" };
        }
        updateData.password = await bcrypt.hash(newPassword, 10);
    }

    try {
        await db.user.update({
            where: { id: userId },
            data: updateData,
        });
        revalidatePath("/dashboard/profile");
        return { success: "Profile updated" };
    } catch (error) {
        return { error: "Update failed" };
    }
}
