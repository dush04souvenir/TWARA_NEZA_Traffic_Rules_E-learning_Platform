import { LearnerNav } from "@/components/learner-nav"
import { Footer } from "@/components/footer"
import { LandingHeader } from "@/components/landing-header"

interface LearnerLayoutProps {
    children: React.ReactNode
}

export function LearnerLayout({ children }: LearnerLayoutProps) {
    return (
        <div className="flex min-h-screen bg-background">
            <LearnerNav />
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                <LandingHeader variant="dashboard" />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    )
}
