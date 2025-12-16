"use client"

import { ManagerNav } from "@/components/manager-nav"

export function ManagerLayout({ children, pendingCount }: { children: React.ReactNode, pendingCount?: number }) {
    return (
        <div id="manager-root" className="min-h-screen bg-background flex">
            <aside className="w-64 fixed inset-y-0 z-50 hidden md:block">
                <ManagerNav pendingCount={pendingCount} />
            </aside>
            <main className="flex-1 md:ml-64 p-8 overflow-y-auto h-screen">
                {children}
            </main>
        </div>
    )
}
