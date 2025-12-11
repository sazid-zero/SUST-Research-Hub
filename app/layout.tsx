import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SUST Research Hub",
  description: "Centralized Research Management System for Shahjalal University of Science and Technology",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // suppressHydrationWarning is the official Next.js-recommended way
    // when a client-only provider (next-themes, dark mode, etc.) modifies <html>
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`min-h-screen antialiased ${geist.className}`}
        // Optional: apply monospace where needed
        // style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}
      >
        <ThemeProvider
          attribute="class"              // adds/removes "dark" class on <html>
          defaultTheme="light"           // matches server render
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>

        <Analytics />
      </body>
    </html>
  )
}