"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function SettingsPage() {
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center px-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="container max-w-full py-8 px-4 grid ">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                        <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
                    </div>

                    <Separator />

                    {/* Appearance Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>Customize how the application looks and feels</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Theme</Label>
                                    <p className="text-sm text-muted-foreground">
                                        {mounted
                                            ? theme === "dark"
                                                ? "Dark mode is enabled"
                                                : "Light mode is enabled"
                                            : "Loading theme..."}
                                    </p>
                                </div>
                                <ThemeToggle />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Account</CardTitle>
                            <CardDescription>Manage your account information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <p className="text-sm text-muted-foreground">user@sust.edu</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <p className="text-sm text-muted-foreground">Student</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notification Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>Configure how you receive notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">Receive email updates about your submissions</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
