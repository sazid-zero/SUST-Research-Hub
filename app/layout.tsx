import type React from "react"
// app/layout.tsx
import { Geist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import GlobalSmoothScroll from "@/components/GlobalSmoothScroll"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })

export const metadata = {
    title: "SUST Research Hub",
    description: "Academic research repository for Shahjalal University of Science and Technology",
}

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`min-h-screen antialiased ${geist.className}`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <GlobalSmoothScroll
            >
                {children}
                <Toaster position="top-center" richColors />
            </GlobalSmoothScroll>
        </ThemeProvider>
        <Analytics />
        </body>
        </html>
    )
}
