"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AuthButton } from "@/components/auth-button"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import { Eye, X, BookOpen, Zap, Microscope, TrendingUp, Github, BarChart3, Menu, Moon, Sun, Search } from "lucide-react"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface BrowseContentProps {
    user: any
    theses: any[]
    pageTitle?: string
}

export function BrowseContent({ user, theses, pageTitle = "Browse Thesis Repository" }: BrowseContentProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedDepartment, setSelectedDepartment] = useState("All Departments")
    const [selectedYearFrom, setSelectedYearFrom] = useState("All Years")
    const [selectedYearTo, setSelectedYearTo] = useState("All Years")
    const [selectedField, setSelectedField] = useState("All Fields")
    const [navSearchQuery, setNavSearchQuery] = useState("")
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [selectedSupervisor, setSelectedSupervisor] = useState("All Supervisors")
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const savedState = sessionStorage.getItem("browsePageState")
        if (savedState) {
            try {
                const state = JSON.parse(savedState)
                setSearchQuery(state.searchQuery || "")
                setNavSearchQuery(state.navSearchQuery || "")
                setSelectedDepartment(state.selectedDepartment || "All Departments")
                setSelectedYearFrom(state.selectedYearFrom || "All Years")
                setSelectedYearTo(state.selectedYearTo || "All Years")
                setSelectedField(state.selectedField || "All Fields")
                setSelectedSupervisor(state.selectedSupervisor || "All Supervisors")

                // Restore scroll position after a short delay to ensure DOM is ready
                setTimeout(() => {
                    window.scrollTo(0, state.scrollPosition || 0)
                }, 100)

                sessionStorage.removeItem("browsePageState")
            } catch (e) {
                console.error("Failed to restore browse page state:", e)
            }
        }
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            // Save scroll position and filter state on scroll
            savePageState()
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        // Save scroll position and filter state on beforeunload
        const handleBeforeUnload = () => {
            savePageState()
        }

        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => window.removeEventListener("beforeunload", handleBeforeUnload)
    }, [])

    const savePageState = () => {
        const state = {
            searchQuery,
            navSearchQuery,
            selectedDepartment,
            selectedYearFrom,
            selectedYearTo,
            selectedField,
            selectedSupervisor,
            scrollPosition: window.scrollY,
        }
        sessionStorage.setItem("browsePageState", JSON.stringify(state))
    }

    const filteredTheses = theses.filter((thesis) => {
        const searchTerm = searchQuery || navSearchQuery
        const matchesSearch =
            thesis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            thesis.authors?.some((author: any) => author.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            thesis.keywords.some((k: string) => k.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesDepartment = selectedDepartment === "All Departments" || thesis.department === selectedDepartment
        const matchesYear =
            (selectedYearFrom === "All Years" && selectedYearTo === "All Years") ||
            (thesis.year >= Number.parseInt(selectedYearFrom) && thesis.year <= Number.parseInt(selectedYearTo))
        const matchesField =
            selectedField === "All Fields" ||
            thesis.keywords.some((k: string) => k.toLowerCase().includes(selectedField.toLowerCase()))
        const matchesSupervisor = selectedSupervisor === "All Supervisors" || thesis.supervisor === selectedSupervisor

        return matchesSearch && matchesDepartment && matchesYear && matchesField && matchesSupervisor
    })

    const clearFilters = () => {
        setSearchQuery("")
        setNavSearchQuery("")
        setSelectedDepartment("All Departments")
        setSelectedYearFrom("All Years")
        setSelectedYearTo("All Years")
        setSelectedField("All Fields")
        setSelectedSupervisor("All Supervisors")
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
            <nav className="hidden md:sticky md:top-0 md:z-50 md:block md:bg-background/95 md:backdrop-blur md:supports-[backdrop-filter]:md:bg-background/60">
                <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between gap-4">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                                <Search className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Research Hub
              </span>
                        </Link>

                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={navSearchQuery}
                                    onChange={(e) => setNavSearchQuery(e.target.value)}
                                    placeholder="Quick search..."
                                    className="pl-9 bg-background border-border text-foreground placeholder:text-muted-foreground h-9"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-5">
                            <Link href="/#about" className="text-foreground hover:text-primary font-medium text-sm">
                                About
                            </Link>
                            <Link href="/help" className="text-foreground hover:text-primary font-medium text-sm">
                                Help
                            </Link>
                            <AuthButton user={user} />
                            <ThemeToggle />
                            <UserProfileDropdown user={user} />
                        </div>
                    </div>
                </div>
            </nav>

            <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
                <div className="px-4 py-3">
                    <div className="relative">
                        <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={navSearchQuery}
                            onChange={(e) => setNavSearchQuery(e.target.value)}
                            placeholder="Search theses..."
                            className="pl-9 bg-background border-border text-foreground placeholder:text-muted-foreground h-9 text-sm"
                        />
                    </div>
                </div>
            </nav>

            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden fixed bottom-6 right-6 z-[999] flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
            >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-[998] bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            <aside
                className={`md:hidden fixed inset-y-0 right-0 z-[999] w-64 bg-background border-l border-border transform transition-transform duration-300 ease-in-out ${
                    isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full p-6">
                    <Link href="/" className="flex items-center gap-3 mb-8" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                            <Search className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Research Hub
            </span>
                    </Link>

                    <nav className="flex-1 space-y-3">
                        <Link
                            href="/#about"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            <BookOpen className="h-5 w-5" />
                            <span className="font-medium">About</span>
                        </Link>

                        <Link
                            href="/help"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            <Zap className="h-5 w-5" />
                            <span className="font-medium">Help</span>
                        </Link>

                        <div className="px-4 py-3">
                            <AuthButton user={user} />
                        </div>

                        <div className="my-2 border-t border-border" />

                        <button
                            onClick={() => {
                                setTheme(theme === "dark" ? "light" : "dark")
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            {mounted && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            <span className="font-medium">Dark Mode</span>
                        </button>

                        <UserProfileDropdown user={user} />
                    </nav>
                </div>
            </aside>

            <div className="border-b border-border bg-gradient-to-br from-background via-background to-muted py-6 md:py-8 px-4 md:px-0 mt-[120px] md:mt-0">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 md:mb-4">{pageTitle}</h1>
                    <p className="text-base md:text-lg text-muted-foreground">Search and discover academic research from SUST</p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                <div className="mb-6 md:hidden">
                    <Card className="border-2 border-border bg-card backdrop-blur-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-foreground">Filters</h2>
                            {(searchQuery !== "" ||
                                selectedDepartment !== "All Departments" ||
                                selectedYearFrom !== "All Years" ||
                                selectedYearTo !== "All Years" ||
                                selectedField !== "All Fields" ||
                                selectedSupervisor !== "All Supervisors") && (
                                <button onClick={clearFilters} className="text-sm text-primary hover:underline flex items-center gap-1">
                                    <X className="h-3 w-3" />
                                    Clear
                                </button>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <Label className="text-foreground font-medium mb-2 block">Field</Label>
                                <Select value={selectedField} onValueChange={setSelectedField}>
                                    <SelectTrigger className="bg-background border-border text-foreground">
                                        <SelectValue placeholder="All Fields" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                        <SelectItem value="All Fields">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="h-4 w-4" />
                                                All Fields
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Machine Learning">
                                            <div className="flex items-center gap-2">
                                                <Zap className="h-4 w-4" />
                                                Artificial Intelligence
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Biomedical">
                                            <div className="flex items-center gap-2">
                                                <Microscope className="h-4 w-4" />
                                                Biotechnology
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Physics">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="h-4 w-4" />
                                                Physics and Mathematics
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Chemistry">
                                            <div className="flex items-center gap-2">
                                                <Microscope className="h-4 w-4" />
                                                Chemistry
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Environmental">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="h-4 w-4" />
                                                Environmental Science
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Robotics">
                                            <div className="flex items-center gap-2">
                                                <Github className="h-4 w-4" />
                                                Robotics and Automation
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Economics">
                                            <div className="flex items-center gap-2">
                                                <BarChart3 className="h-4 w-4" />
                                                Economics
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Agriculture">
                                            <div className="flex items-center gap-2">
                                                <Microscope className="h-4 w-4" />
                                                Agriculture and Food Technology
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Computer Science">
                                            <div className="flex items-center gap-2">
                                                <Github className="h-4 w-4" />
                                                Computer Science
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-foreground font-medium mb-2 block">Department</Label>
                                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                    <SelectTrigger className="bg-background border-border text-foreground">
                                        <SelectValue placeholder="All Departments" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                        <SelectItem value="All Departments">All Departments</SelectItem>
                                        <SelectItem value="Computer Science & Engineering">Computer Science & Engineering</SelectItem>
                                        <SelectItem value="Electrical & Electronic Engineering">
                                            Electrical & Electronic Engineering
                                        </SelectItem>
                                        <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                                        <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                                        <SelectItem value="Biochemistry">Biochemistry</SelectItem>
                                        <SelectItem value="Physics">Physics</SelectItem>
                                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                                        <SelectItem value="Environmental Science">Environmental Science</SelectItem>
                                        <SelectItem value="Robotics & Automation">Robotics & Automation</SelectItem>
                                        <SelectItem value="Economics">Economics</SelectItem>
                                        <SelectItem value="Agriculture & Food Technology">Agriculture & Food Technology</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                <div className="flex-1">
                                    <Label className="text-foreground font-medium mb-2 block">Year From</Label>
                                    <Select value={selectedYearFrom} onValueChange={setSelectedYearFrom}>
                                        <SelectTrigger className="bg-background border-border text-foreground">
                                            <SelectValue placeholder="All Years" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border-border">
                                            <SelectItem value="All Years">All Years</SelectItem>
                                            <SelectItem value="2024">2024</SelectItem>
                                            <SelectItem value="2023">2023</SelectItem>
                                            <SelectItem value="2022">2022</SelectItem>
                                            <SelectItem value="2021">2021</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex-1">
                                    <Label className="text-foreground font-medium mb-2 block">Year To</Label>
                                    <Select value={selectedYearTo} onValueChange={setSelectedYearTo}>
                                        <SelectTrigger className="bg-background border-border text-foreground">
                                            <SelectValue placeholder="All Years" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border-border">
                                            <SelectItem value="All Years">All Years</SelectItem>
                                            <SelectItem value="2024">2024</SelectItem>
                                            <SelectItem value="2023">2023</SelectItem>
                                            <SelectItem value="2022">2022</SelectItem>
                                            <SelectItem value="2021">2021</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label className="text-foreground font-medium mb-2 block">Supervisor</Label>
                                <Select value={selectedSupervisor} onValueChange={setSelectedSupervisor}>
                                    <SelectTrigger className="bg-background border-border text-foreground">
                                        <SelectValue placeholder="All Supervisors" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                        <SelectItem value="All Supervisors">All Supervisors</SelectItem>
                                        <SelectItem value="Dr. Ahmed">Dr. Ahmed</SelectItem>
                                        <SelectItem value="Dr. Sarah">Dr. Sarah</SelectItem>
                                        <SelectItem value="Prof. Hassan">Prof. Hassan</SelectItem>
                                        <SelectItem value="Dr. Fatima">Dr. Fatima</SelectItem>
                                        <SelectItem value="Prof. Ali">Prof. Ali</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <p className="text-sm text-muted-foreground">
                                    Showing <span className="font-semibold text-foreground">{filteredTheses.length}</span> of{" "}
                                    <span className="font-semibold text-foreground">{theses.length}</span> theses
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="grid gap-6 md:gap-8 md:grid-cols-4">
                    <div className="hidden md:block md:col-span-1">
                        <Card className="border-2 border-border bg-card backdrop-blur-sm p-6 md:sticky md:top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-foreground">Filters</h2>
                                {(searchQuery !== "" ||
                                    selectedDepartment !== "All Departments" ||
                                    selectedYearFrom !== "All Years" ||
                                    selectedYearTo !== "All Years" ||
                                    selectedField !== "All Fields" ||
                                    selectedSupervisor !== "All Supervisors") && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-primary hover:underline flex items-center gap-1"
                                    >
                                        <X className="h-3 w-3" />
                                        Clear
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <Label className="text-foreground font-medium mb-2 block">Field</Label>
                                    <Select value={selectedField} onValueChange={setSelectedField}>
                                        <SelectTrigger className="bg-background border-border text-foreground">
                                            <SelectValue placeholder="All Fields" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border-border">
                                            <SelectItem value="All Fields">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4" />
                                                    All Fields
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="Machine Learning">
                                                <div className="flex items-center gap-2">
                                                    <Zap className="h-4 w-4" />
                                                    Artificial Intelligence
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="Biomedical">
                                                <div className="flex items-center gap-2">
                                                    <Microscope className="h-4 w-4" />
                                                    Biotechnology
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="Physics">
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp className="h-4 w-4" />
                                                    Physics and Mathematics
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="Chemistry">
                                                <div className="flex items-center gap-2">
                                                    <Microscope className="h-4 w-4" />
                                                    Chemistry
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="Environmental">
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp className="h-4 w-4" />
                                                    Environmental Science
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="Robotics">
                                                <div className="flex items-center gap-2">
                                                    <Github className="h-4 w-4" />
                                                    Robotics and Automation
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="Economics">
                                                <div className="flex items-center gap-2">
                                                    <BarChart3 className="h-4 w-4" />
                                                    Economics
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="Agriculture">
                                                <div className="flex items-center gap-2">
                                                    <Microscope className="h-4 w-4" />
                                                    Agriculture and Food Technology
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="Computer Science">
                                                <div className="flex items-center gap-2">
                                                    <Github className="h-4 w-4" />
                                                    Computer Science
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-foreground font-medium mb-2 block">Department</Label>
                                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                        <SelectTrigger className="bg-background border-border text-foreground">
                                            <SelectValue placeholder="All Departments" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border-border">
                                            <SelectItem value="All Departments">All Departments</SelectItem>
                                            <SelectItem value="Computer Science & Engineering">Computer Science & Engineering</SelectItem>
                                            <SelectItem value="Electrical & Electronic Engineering">
                                                Electrical & Electronic Engineering
                                            </SelectItem>
                                            <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                                            <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                                            <SelectItem value="Biochemistry">Biochemistry</SelectItem>
                                            <SelectItem value="Physics">Physics</SelectItem>
                                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                                            <SelectItem value="Chemistry">Chemistry</SelectItem>
                                            <SelectItem value="Environmental Science">Environmental Science</SelectItem>
                                            <SelectItem value="Robotics & Automation">Robotics & Automation</SelectItem>
                                            <SelectItem value="Economics">Economics</SelectItem>
                                            <SelectItem value="Agriculture & Food Technology">Agriculture & Food Technology</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                    <div className="flex-1">
                                        <Label className="text-foreground font-medium mb-2 block">Year From</Label>
                                        <Select value={selectedYearFrom} onValueChange={setSelectedYearFrom}>
                                            <SelectTrigger className="bg-background border-border text-foreground">
                                                <SelectValue placeholder="All Years" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-popover border-border">
                                                <SelectItem value="All Years">All Years</SelectItem>
                                                <SelectItem value="2024">2024</SelectItem>
                                                <SelectItem value="2023">2023</SelectItem>
                                                <SelectItem value="2022">2022</SelectItem>
                                                <SelectItem value="2021">2021</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex-1">
                                        <Label className="text-foreground font-medium mb-2 block">Year To</Label>
                                        <Select value={selectedYearTo} onValueChange={setSelectedYearTo}>
                                            <SelectTrigger className="bg-background border-border text-foreground">
                                                <SelectValue placeholder="All Years" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-popover border-border">
                                                <SelectItem value="All Years">All Years</SelectItem>
                                                <SelectItem value="2024">2024</SelectItem>
                                                <SelectItem value="2023">2023</SelectItem>
                                                <SelectItem value="2022">2022</SelectItem>
                                                <SelectItem value="2021">2021</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-foreground font-medium mb-2 block">Supervisor</Label>
                                    <Select value={selectedSupervisor} onValueChange={setSelectedSupervisor}>
                                        <SelectTrigger className="bg-background border-border text-foreground">
                                            <SelectValue placeholder="All Supervisors" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border-border">
                                            <SelectItem value="All Supervisors">All Supervisors</SelectItem>
                                            <SelectItem value="Dr. Ahmed">Dr. Ahmed</SelectItem>
                                            <SelectItem value="Dr. Sarah">Dr. Sarah</SelectItem>
                                            <SelectItem value="Prof. Hassan">Prof. Hassan</SelectItem>
                                            <SelectItem value="Dr. Fatima">Dr. Fatima</SelectItem>
                                            <SelectItem value="Prof. Ali">Prof. Ali</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="pt-4 border-t border-border">
                                    <p className="text-sm text-muted-foreground">
                                        Showing <span className="font-semibold text-foreground">{filteredTheses.length}</span> of{" "}
                                        <span className="font-semibold text-foreground">{theses.length}</span> theses
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="md:col-span-3 space-y-4 md:space-y-6">
                        {filteredTheses.length > 0 ? (
                            <motion.div className="space-y-4">
                                {filteredTheses.map((thesis, index) => (
                                    <motion.div
                                        key={thesis.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="group"
                                    >
                                        <Card className="border-border bg-card p-4 md:p-6 hover:shadow-lg transition-shadow group-hover:border-primary/50">
                                            <div className="space-y-3 md:space-y-4">
                                                <div>
                                                    <Link href={`/thesis/${thesis.id}`}>
                                                        <h3 className="text-lg md:text-xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer line-clamp-2">
                                                            {thesis.title}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                                                        By{" "}
                                                        {thesis.authors?.map((author: any, idx: number) => (
                                                            <span key={author.id || idx}>
                                <Link
                                    href={`/student/profile/${author.student_id}`}
                                    className="font-medium hover:text-primary transition-colors"
                                >
                                  {author.full_name}
                                </Link>
                                                                {idx < thesis.authors.length - 1 && ", "}
                              </span>
                                                        ))}
                                                        {" • "}
                                                        {thesis.department} • {thesis.year}
                                                    </p>
                                                </div>

                                                <p className="text-sm text-foreground leading-relaxed line-clamp-2">{thesis.abstract}</p>

                                                <div className="flex flex-wrap gap-2">
                                                    {thesis.keywords.slice(0, 3).map((keyword, idx) => (
                                                        <Badge key={idx} className="bg-primary/10 text-primary border border-primary/20 text-xs">
                                                            {keyword}
                                                        </Badge>
                                                    ))}
                                                    {thesis.keywords.length > 3 && (
                                                        <Badge className="bg-muted text-muted-foreground border border-border text-xs">
                                                            +{thesis.keywords.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 md:pt-4 border-t border-border">
                                                    <div className="flex gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-2">
                                                            <Eye className="h-4 w-4" />
                                                            <span>{thesis.views} views</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Zap className="h-4 w-4" />
                                                            <span>{thesis.downloads} downloads</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 w-full sm:w-auto">
                                                        <Link href={`/thesis/${thesis.id}`} className="flex-1 sm:flex-none">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-border hover:bg-muted bg-transparent w-full sm:w-auto text-xs md:text-sm"
                                                            >
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            size="sm"
                                                            className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground text-xs md:text-sm"
                                                        >
                                                            <Zap className="h-4 w-4 mr-2" />
                                                            Download
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <Card className="border-border bg-card p-8 md:p-12 text-center">
                                <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-semibold text-foreground mb-2">No theses found</h3>
                                <p className="text-sm md:text-base text-muted-foreground">Try adjusting your search or filters</p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            <footer className="border-t border-border bg-background py-8 md:py-12 mt-12 md:mt-16 px-4">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-xs md:text-sm text-muted-foreground">
                    <p>© 2025 SUST Thesis Repository. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
