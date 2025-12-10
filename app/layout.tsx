import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TWARA NEZA - Rwanda Traffic Rules Learning Platform",
  description:
    "Master Rwanda traffic rules with interactive quizzes, flashcards, and comprehensive exam preparation. Official traffic code learning and driver licensing preparation platform for Rwanda.",
  keywords: [
    "Rwanda traffic rules",
    "driving license exam",
    "traffic code",
    "driver education",
    "road safety",
    "TWARA NEZA",
    "Kigali",
  ],
  authors: [{ name: "TWARA NEZA" }],
  creator: "TWARA NEZA",
  publisher: "TWARA NEZA",
  formatDetection: {
    email: true,
    telephone: true,
    address: true,
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_RW",
    url: "https://tawaraneza.rw",

  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'system';
                const htmlElement = document.documentElement;
                if (theme === 'system') {
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  htmlElement.classList.toggle('dark', prefersDark);
                } else {
                  htmlElement.classList.toggle('dark', theme === 'dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
