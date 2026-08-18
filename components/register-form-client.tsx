"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { register } from "@/app/actions/auth"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import { DEPARTMENTS } from "@/lib/constants/academic-data"

export default function RegisterFormClient() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userRole, setUserRole] = useState<"student" | "supervisor">("student")
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    studentId: "",
    designation: "",
    password: "",
    confirmPassword: "",
    username: "",
  })

  const [emailError, setEmailError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))

    if (id === "email") {
      const val = value.trim().toLowerCase()
      if (val.includes("@")) {
        const domain = val.split("@")[1] || ""
        if (domain && !domain.endsWith("sust.edu") && !domain.endsWith("sust.edu.bd")) {
          setEmailError("Only SUST institutional emails (@student.sust.edu or @sust.edu) are allowed.")
        } else {
          setEmailError("")
          if (domain.includes("student.sust.edu")) {
            setUserRole("student")
          } else if (domain.includes("sust.edu")) {
            setUserRole("supervisor")
          }
        }
      } else {
        setEmailError("")
      }
    }
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      const emailLower = formData.email.trim().toLowerCase()
      if (!emailLower.endsWith("sust.edu") && !emailLower.endsWith("sust.edu.bd")) {
        toast.error("Only SUST institutional emails (@student.sust.edu or @sust.edu) are allowed.")
        setEmailError("Only SUST institutional emails (@student.sust.edu or @sust.edu) are allowed.")
        setIsLoading(false)
        return
      }

      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match")
        setIsLoading(false)
        return
      }

      // Validate password length
      if (formData.password.length < 8) {
        toast.error("Password must be at least 8 characters long")
        setIsLoading(false)
        return
      }

      if (userRole === "supervisor" && !formData.username) {
        toast.error("Username is required for supervisors")
        setIsLoading(false)
        return
      }

      // Prepare registration data
      const data = {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        fullName: `${formData.firstName} ${formData.lastName}`,
        role: userRole,
        studentId: userRole === "student" ? formData.studentId : undefined,
        department: formData.department,
        specialization: userRole === "supervisor" ? formData.designation : undefined,
        username: userRole === "supervisor" ? formData.username : undefined,
        phone: formData.phone,
      }

      const result = await register(data)

      if (result.success) {
        setShowSuccess(true)
        toast.success(result.message || "Registration submitted successfully!")
      } else {
        toast.error(result.error || "Registration failed. Please try again.")
      }
    } catch (error: any) {
      console.error("[Auth] Registration error:", error)
      toast.error(error.message || "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-accent/5">
        <div className="w-full max-w-md">
          <div className="bg-card p-8 rounded-2xl border border-border text-center space-y-6 shadow-xl">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Check Your Email!</h1>
              <p className="text-sm text-muted-foreground">
                We've sent a verification link to <br />
                <strong className="text-foreground font-mono">{formData.email}</strong>
              </p>
            </div>

            <Alert className="bg-blue-500/5 border-blue-500/20">
              <AlertDescription className="text-xs text-left text-muted-foreground space-y-2">
                <p><strong>Next Steps:</strong></p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Open your SUST Webmail / Inbox.</li>
                  <li>Click the <strong>Verify Email Address</strong> link.</li>
                  <li>Your account will be instantly activated!</li>
                </ol>
              </AlertDescription>
            </Alert>

            <div className="pt-2">
              <Button onClick={() => router.push("/login")} variant="outline" className="w-full rounded-xl">
                Go to Login Page
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground">
              <Image src="/sustlogo.png" alt="Research Hub Logo" width={30} height={30} className="object-contain" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Research Hub
            </span>
          </Link>
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Already have an account? <span className="text-primary font-semibold">Sign in</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-foreground">Create Your Account</h1>
            <p className="text-lg text-muted-foreground">Join our community of researchers and supervisors</p>
          </div>

          <Card className="border-border bg-card p-1.5 shadow-md">
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setUserRole("student")}
                className={`flex-1 py-2.5 px-6 rounded-md transition-all duration-200 font-medium text-sm ${
                  userRole === "student"
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground bg-muted/30"
                }`}
              >
                I'm a Student
              </button>
              <button
                type="button"
                onClick={() => setUserRole("supervisor")}
                className={`flex-1 py-2.5 px-6 rounded-md transition-all duration-200 font-medium text-sm ${
                  userRole === "supervisor"
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground bg-muted/30"
                }`}
              >
                I'm a Supervisor
              </button>
            </div>
          </Card>

          <Card className="border-border bg-card p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role-specific title */}
              <div className="pb-6 border-b border-border">
                <h2 className="text-2xl font-bold text-foreground">
                  {userRole === "student" ? "Student Registration" : "Supervisor Registration"}
                </h2>
              </div>

              {/* Basic Information - Common for both */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-foreground font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="bg-input border-border text-foreground"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-foreground font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="bg-input border-border text-foreground"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Institutional Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={userRole === "student" ? "username@student.sust.edu" : "username@sust.edu"}
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`bg-input border-border text-foreground ${emailError ? "border-amber-500 focus:ring-amber-500" : ""}`}
                  required
                />
                {emailError && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2 text-amber-600 dark:text-amber-400 text-xs font-medium mt-1">
                    <span className="text-base leading-none">⚠️</span>
                    <div>
                      <strong>Only SUST institutional emails allowed:</strong>
                      <p className="mt-0.5">Please use your official <code>@student.sust.edu</code> (student) or <code>@sust.edu</code> (teacher) email address.</p>
                    </div>
                  </div>
                )}
                {!emailError && (
                  <p className="text-xs text-muted-foreground">
                    Must be an official SUST email address ending in <code>@student.sust.edu</code> or <code>@sust.edu</code>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground font-medium">
                  Phone Number <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+880 1XXX XXXXXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="bg-input border-border text-foreground"
                />
              </div>


              <div className="space-y-2">
                <Label htmlFor="department" className="text-foreground font-medium">
                  Department
                </Label>
                <Select value={formData.department} onValueChange={(value) => handleSelectChange("department", value)}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {userRole === "student" && (
                <div className="space-y-2">
                  <Label htmlFor="studentId" className="text-foreground font-medium">
                    Student ID
                  </Label>
                  <Input
                    id="studentId"
                    type="text"
                    placeholder="Enter your registration number"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className="bg-input border-border text-foreground"
                    required
                  />
                </div>
              )}

              {userRole === "supervisor" && (
                <div className="space-y-2">
                  <Label htmlFor="designation" className="text-foreground font-medium">
                    Designation
                  </Label>
                  <Select
                    value={formData.designation}
                    onValueChange={(value) => handleSelectChange("designation", value)}
                  >
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select your designation" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="professor">Professor</SelectItem>
                      <SelectItem value="associate-professor">Associate Professor</SelectItem>
                      <SelectItem value="assistant-professor">Assistant Professor</SelectItem>
                      <SelectItem value="lecturer">Lecturer</SelectItem>
                      <SelectItem value="senior-lecturer">Senior Lecturer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {userRole === "supervisor" && (
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-foreground font-medium">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="ex - ahmed.hassan"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="bg-input border-border text-foreground"
                    pattern="[a-z0-9._-]+"
                    title="Only lowercase letters, numbers, dots, underscores, and hyphens"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be your profile URL (e.g., /supervisor/profile/ahmed.hassan)
                  </p>
                </div>
              )}

              {/* Password Section */}
              <div className="pt-4 border-t border-border space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground font-medium">
                    Create Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="bg-input border-border text-foreground pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    At least 8 characters with uppercase, lowercase, and numbers
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="bg-input border-border text-foreground"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>

              {/* Terms */}
              <p className="text-xs text-center text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline font-medium">
                  Privacy Policy
                </Link>
              </p>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
