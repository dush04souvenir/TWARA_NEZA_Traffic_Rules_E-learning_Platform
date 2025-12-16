import { ManagerLayout } from "@/components/manager-layout"
import { ManagerStats } from "@/components/manager-stats"
import { ManagerAnalytics } from "@/components/manager-analytics"
import { ManagerInbox } from "@/components/manager-inbox"
import { ManagerStudentList } from "@/components/manager-student-list"
import { DownloadReportButton } from "@/components/download-report-button"
import { ExportDataButtons } from "@/components/export-data-buttons"
import { ManagerQuickActions } from "@/components/manager-quick-actions"
import { getPendingPayments, getPendingPaymentCount, getRevenueStats } from "@/lib/actions/payment-actions"
import { PaymentApprovals } from "@/components/payment-approvals"
import { RevenueReport } from "@/components/revenue-report"

export default async function ManagerDashboard(props: { searchParams: Promise<{ view?: string }> }) {
    const searchParams = await props.searchParams
    const view = searchParams.view || "overview"
    const pendingCount = await getPendingPaymentCount()
    const revenueStats = await getRevenueStats()

    return (
        <ManagerLayout pendingCount={pendingCount}>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground capitalize">
                    {view}
                </h1>
                <p className="text-muted-foreground">
                    {view === "overview" && "Here's what's happening with your learners today."}
                    {view === "students" && "Track, manage, and support your students."}
                    {view === "inbox" && "Messages and inquiries from the platform."}
                    {view === "reports" && "Detailed performance reports and exports."}
                    {view === "approvals" && "Manage pending payment approvals."}
                </p>
            </header>

            {view === "overview" && (
                <div className="space-y-8">
                    <ManagerStats totalRevenue={revenueStats.totalRevenue} />
                    <ManagerAnalytics />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Can add recent activity or simple lists here */}
                        <div className="bg-card rounded-xl border p-6">
                            <h3 className="font-semibold mb-4">Recent Alerts</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex gap-4">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-yellow-500 shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-sm text-yellow-500">Low Pass Rate Alert</h4>
                                        <p className="text-xs text-muted-foreground">"Road Signs" module is seeing a 15% drop in pass rates this week.</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex gap-4">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-sm text-blue-500">New Class Started</h4>
                                        <p className="text-xs text-muted-foreground">Batch 2024-C has begun their training.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ManagerQuickActions />
                    </div>
                </div>
            )}

            {view === "students" && <ManagerStudentList />}

            {view === "inbox" && <div className="bg-card p-6 rounded-xl border"><ManagerInbox /></div>}

            {view === "reports" && (
                <div id="report-content" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">Performance & Revenue Reports</h2>
                            <p className="text-muted-foreground">Detailed insights into student progression and financial performance.</p>
                        </div>
                        <DownloadReportButton />
                    </div>

                    <div className="grid gap-6">
                        <RevenueReport transactions={revenueStats.recentTransactions} />
                    </div>

                    <div className="p-6 border rounded-xl bg-card">
                        <h3 className="font-semibold mb-4 text-lg">Detailed Analytics</h3>
                        <ManagerAnalytics />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 border rounded-xl bg-card">
                            <h3 className="font-semibold mb-4">Export Data</h3>
                            <p className="text-sm text-muted-foreground mb-4">Export raw data for external analysis.</p>
                            <ExportDataButtons />
                        </div>
                    </div>
                </div>
            )}

            {view === "approvals" && (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold">Pending Approvals</h2>
                        <p className="text-muted-foreground">Review and approve pending student payments.</p>
                    </div>
                    <PaymentApprovals initialPayments={await getPendingPayments()} />
                </div>
            )}

        </ManagerLayout>
    )
}
