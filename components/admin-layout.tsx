import { LandingHeader } from "@/components/landing-header"
import { Footer } from "@/components/footer"
import { AdminNav } from "@/components/admin-nav"

export function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <LandingHeader variant="dashboard" title="Admin" />

            <div className="flex flex-1 pt-16">
                {/* Sidebar */}
                <div className="hidden md:block w-64 fixed h-[calc(100vh-4rem)] top-16 left-0 border-r border-border bg-card overflow-y-auto">
                    <AdminNav />
                </div>

                {/* Main Content */}
                <main className="flex-1 md:ml-64 p-6 overflow-y-auto min-h-[calc(100vh-4rem)]">
                    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>

            <div className="md:ml-64">
                <Footer />
            </div>
        </div>
    )
}
