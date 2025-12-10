import { AdminStats } from "@/components/admin-stats"
import { UserManagement } from "@/components/user-management"
import { QuestionManagement } from "@/components/question-management"
import { AdminLayout } from "@/components/admin-layout"
import { AdminSettings } from "@/components/admin-settings"
import { AdminAnalytics } from "@/components/admin-analytics"

interface AdminDashboardProps {
  searchParams: { view?: string }
}

export default async function AdminDashboard(props: { searchParams: Promise<{ view?: string }> }) {
  const searchParams = await props.searchParams
  const view = searchParams.view || "overview"

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          {view === "overview" && "Admin Dashboard"}
          {view === "users" && "User Management"}
          {view === "questions" && "Content Management"}
          {view === "analytics" && "Analytics"}
          {view === "settings" && "Platform Settings"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {view === "overview" && "Platform overview and key statistics"}
          {view === "users" && "Manage registered users and instructions"}
          {view === "questions" && "Create and edit quiz questions"}
          {view === "analytics" && "View platform usage and performance"}
          {view === "settings" && "Configure global application settings"}
        </p>
      </div>

      {view === "overview" && (
        <>
          <AdminStats />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <UserManagement />
            <QuestionManagement />
          </div>
        </>
      )}

      {view === "users" && <UserManagement />}
      {view === "questions" && <QuestionManagement />}
      {view === "stats" || view === "analytics" ? <AdminAnalytics /> : null}
      {view === "settings" && <AdminSettings />}

    </AdminLayout>
  )
}
