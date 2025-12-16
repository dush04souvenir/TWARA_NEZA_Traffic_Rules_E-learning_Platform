// components/admin-revenue.tsx
"use server";

import { db as prisma } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

/**
 * Server component that shows simple revenue statistics.
 * It aggregates approved payments and groups them by currency.
 */
export async function AdminRevenue() {
    // Total approved revenue (in cents)
    const totalAgg = await prisma.payment.aggregate({
        _sum: { amountCents: true },
        where: { status: "APPROVED" },
    });

    // Revenue per currency
    const perCurrency = await prisma.payment.groupBy({
        by: ["currency"],
        _sum: { amountCents: true },
        where: { status: "APPROVED" },
    });

    const total = (totalAgg._sum?.amountCents ?? 0) / 100;

    return (
        <Card className="max-w-2xl mx-auto mb-8">
            <CardHeader>
                <CardTitle className="text-2xl">Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold mb-2 text-lg">Total Reveneue</h3>
                    <ul className="space-y-2">
                        {perCurrency.map((c) => {
                            const amount = c._sum.amountCents ?? 0;
                            const isRwf = c.currency === "RWF";
                            const displayAmount = isRwf ? amount.toLocaleString() : (amount / 100).toFixed(2);
                            const prefix = isRwf ? "" : "$";
                            const suffix = isRwf ? " RWF" : "";

                            return (
                                <li key={c.currency} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <span className="font-medium text-muted-foreground">{c.currency}</span>
                                    <span className="text-xl font-bold">{prefix}{displayAmount}{suffix}</span>
                                </li>
                            );
                        })}
                        {perCurrency.length === 0 && <p className="text-muted-foreground">No revenue recorded yet.</p>}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
