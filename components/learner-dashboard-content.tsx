"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { LearnerLayout } from "@/components/learner-layout"
import { ProgressCards } from "@/components/progress-cards"
import { QuickActions } from "@/components/quick-actions"
import { RecentActivity } from "@/components/recent-activity"
import { SettingsView } from "@/components/settings-view"
import { ProgressView } from "@/components/progress-view"
import { WeaknessDetector } from "@/components/weakness-detector"
import { LearnerBadges } from "@/components/learner-badges"
import { PendingPaymentsAlert } from "@/components/pending-payments-alert"

function DashboardContent() {
    const searchParams = useSearchParams()
    const view = searchParams.get("view")

    switch (view) {
        case "settings":
            return <SettingsView />
        case "progress":
            return <ProgressView />
        default:
            return (
                <>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground">Welcome back, Learner!</h1>
                        <p className="text-muted-foreground mt-2">Track your progress and continue learning</p>
                    </div>

                    <PendingPaymentsAlert />

                    <div className="mb-8">
                        <LearnerBadges />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <ProgressCards />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="space-y-6">
                            <QuickActions />
                            <WeaknessDetector />
                        </div>
                        <RecentActivity />
                    </div>
                </>
            )
    }
}

export function LearnerDashboardContent() {
    return (
        <LearnerLayout>
            <div className="container mx-auto px-6 py-8">
                <Suspense fallback={<div>Loading dashboard...</div>}>
                    <DashboardContent />
                </Suspense>
            </div>
        </LearnerLayout>
    )
}
