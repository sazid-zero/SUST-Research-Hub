"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import Link from "next/link"
import { login } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { BookOpen, Eye, EyeOff } from "lucide-react"

export function LoginFormClient() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login(formData)

      if (result.success) {
        toast.success("Login successful!")

        startTransition(() => {
          if (result.user?.role === "admin") {
            router.push("/admin/dashboard")
          } else if (result.user?.role === "student") {
            router.push("/student/dashboard")
          } else if (result.user?.role === "supervisor") {
            router.push("/supervisor/dashboard")
          } else {
            router.push("/")
          }
        })
      } else {
        toast.error(result.error || "Login failed")
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SUST Research Hub
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-sm">Don't have an account?</span>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-primary to-accent text-background hover:bg-foreground/90">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center px-4 py-12 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          <Card className="border-border bg-card p-8 shadow-lg">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
              <p className="text-muted-foreground">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground font-medium">
                    Password
                  </Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground pr-10"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium h-10 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 hover:scale-[1.02]"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-border"/>
            </div>
              <span className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">Don't have an account?
              <Link href="/register" className="text-primary/80 font-bold"> Sign Up</Link>
              </span>


            <p className="text-center text-xs text-muted-foreground mt-6">
              By signing in, you agree to our{" "}
              <a href="/terms" className="text-primary hover:underline font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-primary hover:underline font-medium">
                Privacy Policy
              </a>
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
