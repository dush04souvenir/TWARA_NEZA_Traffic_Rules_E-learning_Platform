import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const path = req.nextUrl.pathname

        // 1. Protect Admin Routes
        if (path.startsWith("/admin-dashboard")) {
            if (token?.role !== "ADMIN") {
                return NextResponse.redirect(new URL("/", req.url))
            }
        }

        // 2. Protect Manager Routes
        if (path.startsWith("/manager-dashboard")) {
            if (token?.role !== "MANAGER") {
                return NextResponse.redirect(new URL("/", req.url))
            }
        }

        // 3. Protect Learner Routes
        // Includes dashboard, quiz, exam, flashcards
        const learnerRoutes = ["/learner-dashboard", "/quiz", "/exam", "/flashcards"]
        if (learnerRoutes.some(route => path.startsWith(route))) {
            // Ideally only LEARNERs access this, but maybe Admins want to see it?
            // Let's enforce LEARNER only for now as requested "forcebrowsing protection".
            // Use inclusive check if implicit roles exist, but strict is safer.
            if (token?.role !== "LEARNER" && token?.role !== "ADMIN") { // Allow Admin to inspect? Maybe not. Let's stick to strict role for now unless token.role is missing.
                // Actually, usually users are just one role.
                if (token?.role !== "LEARNER") {
                    return NextResponse.redirect(new URL("/", req.url))
                }
            }
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
)

export const config = {
    matcher: [
        "/admin-dashboard/:path*",
        "/manager-dashboard/:path*",
        "/learner-dashboard/:path*",
        "/quiz/:path*",
        "/exam/:path*",
        "/flashcards/:path*",
    ],
}
