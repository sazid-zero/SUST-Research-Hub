"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { scrollToExplore } from "@/components/scroll-to-section"
import { DetailsShowcase } from "@/components/details-showcase"
import {
    BookOpen,
    Zap,
    Microscope,
    TrendingUp,
    Github,
    ExternalLink,
    Star,
    Eye,
    BarChart3,
    Mail,
    ArrowRight,
} from "lucide-react"
import {useState, useEffect, useRef} from "react"
import { useInView } from "react-intersection-observer"
import { useTheme } from "next-themes"
import type { Thesis, User } from "@/lib/data/theses"
import { GlobalNavbar } from "@/components/global-navbar"
import { AnimatedParticles, RepositoryShowcase } from "@/components/repository-showcase"
import { FeaturesSection } from "@/components/features-section"

interface HomeContentProps {
    user: User | null
    allTheses: Thesis[]
    recentTheses: Thesis[]
    currentRecentIndex: number
}

export function HomeContent({ user, allTheses, recentTheses,currentRecentIndex }: HomeContentProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [featuredIndex, setFeaturedIndex] = useState(0)

    const [browseRef, browseInView] = useInView({
        threshold: 0.3,
        triggerOnce: false,
        rootMargin: "0px 0px -200px 0px",
    })

    const [heroRef, setHeroRef] = useState<HTMLElement | null>(null)

    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
        setMounted(true)
        setIsDesktop(window.innerWidth >= 1024)

        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024)
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const researchCategories = [
        { id: "all", label: "All Fields", icon: BookOpen, count: allTheses.length },
        {
            id: "ai",
            label: "Artificial Intelligence",
            icon: Zap,
            count: allTheses.filter((t) =>
                t.keywords.some((k) => k.toLowerCase().includes("ai") || k.toLowerCase().includes("machine learning")),
            ).length,
        },
        {
            id: "biotech",
            label: "Biotechnology",
            icon: Microscope,
            count: allTheses.filter(
                (t) =>
                    t.department.toLowerCase().includes("biochemistry") ||
                    t.keywords.some((k) => k.toLowerCase().includes("biomedical")),
            ).length,
        },
        {
            id: "physics",
            label: "Physics and Mathematics",
            icon: TrendingUp,
            count: allTheses.filter(
                (t) => t.department.toLowerCase().includes("physics") || t.department.toLowerCase().includes("mathematics"),
            ).length,
        },
        {
            id: "chemistry",
            label: "Chemistry and Material Science",
            icon: Microscope,
            count: allTheses.filter((t) => t.department.toLowerCase().includes("chemistry")).length,
        },
        {
            id: "environmental",
            label: "Environmental Science",
            icon: TrendingUp,
            count: allTheses.filter((t) => t.department.toLowerCase().includes("environmental")).length,
        },
        {
            id: "robotics",
            label: "Robotics and Automation",
            icon: Github,
            count: allTheses.filter((t) => t.department.toLowerCase().includes("robotics")).length,
        },
        {
            id: "economics",
            label: "Economics",
            icon: BarChart3,
            count: allTheses.filter((t) => t.department.toLowerCase().includes("economics")).length,
        },
        {
            id: "agriculture",
            label: "Agriculture and Food Technology",
            icon: Microscope,
            count: allTheses.filter((t) => t.department.toLowerCase().includes("agriculture")).length,
        },
        {
            id: "cs",
            label: "Computer Science",
            icon: Github,
            count: allTheses.filter((t) => t.department.toLowerCase().includes("computer science")).length,
        },
    ]

    const filteredResearch =
        selectedCategory === "all"
            ? allTheses
            : allTheses.filter((r) => {
                const lowerDept = r.department.toLowerCase()
                const lowerKeywords = r.keywords.map((k) => k.toLowerCase())

                switch (selectedCategory) {
                    case "cs":
                        return (
                            lowerDept.includes("computer science") ||
                            lowerKeywords.some(
                                (k) => k.includes("machine learning") || k.includes("ai") || k.includes("blockchain"),
                            )
                        )
                    case "ai":
                        return lowerKeywords.some(
                            (k) =>
                                k.includes("machine learning") ||
                                k.includes("ai") ||
                                k.includes("neural") ||
                                k.includes("deep learning"),
                        )
                    case "biotech":
                        return (
                            lowerDept.includes("biochemistry") ||
                            lowerKeywords.some((k) => k.includes("biomedical") || k.includes("protein") || k.includes("healthcare"))
                        )
                    case "physics":
                        return (
                            lowerDept.includes("physics") ||
                            lowerDept.includes("mathematics") ||
                            lowerKeywords.some((k) => k.includes("quantum") || k.includes("mathematics") || k.includes("physics"))
                        )
                    case "chemistry":
                        return (
                            lowerDept.includes("chemistry") ||
                            lowerKeywords.some(
                                (k) => k.includes("chemistry") || k.includes("nanomaterials") || k.includes("catalysis"),
                            )
                        )
                    case "environmental":
                        return (
                            lowerDept.includes("environmental") ||
                            lowerKeywords.some(
                                (k) => k.includes("climate") || k.includes("environmental") || k.includes("sustainability"),
                            )
                        )
                    case "robotics":
                        return (
                            lowerDept.includes("robotics") ||
                            lowerKeywords.some(
                                (k) => k.includes("robotics") || k.includes("automation") || k.includes("autonomous"),
                            )
                        )
                    case "economics":
                        return (
                            lowerDept.includes("economics") ||
                            lowerKeywords.some(
                                (k) => k.includes("economics") || k.includes("microfinance") || k.includes("economic"),
                            )
                        )
                    case "agriculture":
                        return (
                            lowerDept.includes("agriculture") ||
                            lowerDept.includes("food technology") ||
                            lowerKeywords.some(
                                (k) => k.includes("agriculture") || k.includes("food") || k.includes("farming") || k.includes("crop"),
                            )
                        )
                    default:
                        return false
                }
            })

    const displayedCategoryResearchMobile = filteredResearch.slice(0, 2)
    const displayedCategoryResearchDesktop = filteredResearch.slice(0, 4)
    const recentResearch = recentTheses.slice(currentRecentIndex, currentRecentIndex + 3)

    useEffect(() => {
        const interval = setInterval(() => {
            setFeaturedIndex((prev) => (prev + 3 >= recentTheses.length ? 0 : prev + 3))
        }, 5000) // Increased for less distraction
        return () => clearInterval(interval)
    }, [recentTheses.length])


    // Users can manually click categories instead

    const navItems = [
        { label: "Browse", href: "/browse" },
        { label: "Features", href: "/#features" },
        { label: "About", href: "/#about" },
        { label: "Help", href: "/help" },
    ]

    const getDashboardRoute = (user: User | null) => {
        if (!user) return "/register"
        switch (user.role) {
            case "admin":
                return "/admin/dashboard"
            case "supervisor":
                return "/supervisor/dashboard"
            case "student":
                return "/student/dashboard"
            default:
                return "/register"
        }
    }

    return (
        <div className="bg-background ">
            <GlobalNavbar user={user}/>

            {/* HERO SECTION */}
            <section
                ref={setHeroRef}
                className="hero-section w-full lg:fixed lg:top-0 lg:h-screen relative bg-background overflow-hidden z-0 transition-all duration-300 ease-out "
            >
                <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 opacity-[0.03]">
                        <div className="absolute inset-0 bg-grid-pattern [background-size:50px_50px] [background-image:linear-gradient(0deg,transparent_24%,#10b981_25%,#10b981_26%,transparent_27%,transparent_74%,#10b981_75%,#10b981_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,#10b981_25%,#10b981_26%,transparent_27%,transparent_74%,#10b981_75%,#10b981_76%,transparent_77%,transparent)]" />
                    </div>
                    <div className="blob-1 absolute top-20 right-1/3 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-full animate-fadeIn" />
                    <div className="blob-2 absolute bottom-1/3 left-1/4 w-96 h-96 bg-gradient-to-tl from-teal-400/10 to-transparent rounded-full animate-fadeIn [animation-delay:0.2s]" />
                    <div className="blob-3 absolute top-1/2 right-1/4 w-72 h-72 bg-gradient-to-bl from-cyan-400/10 to-transparent rounded-full animate-fadeIn [animation-delay:0.4s]" />
                </div>
                <div className="max-w-8xl mx-auto">
                <div className="hero-cube absolute top-[17.5%] left-[5%] w-32 h-32 pointer-events-none" style={{ perspective: "800px" }}>
                    <div
                        className="w-full h-full "
                        style={{
                            transformStyle: "preserve-3d",
                            animation: "rotateCube 20s linear infinite",

                        }}
                    >
                        {/* Front */}
                        <div className="absolute w-full h-full bg-gradient-to-br from-primary/20 to-accent/30" style={{ transform: "translateZ(64px)" }} />
                        {/* Back */}
                        <div className="absolute w-full h-full bg-gradient-to-br from-accent/30 to-primary/20" style={{ transform: "translateZ(-64px) rotateY(180deg)" }} />
                        {/* Left */}
                        <div className="absolute w-full h-full bg-gradient-to-br from-primary/10 to-accent/20" style={{ transform: "rotateY(-90deg) translateZ(64px)" }} />
                        {/* Right */}
                        <div className="absolute w-full h-full bg-gradient-to-br from-accent/20 to-primary/10" style={{ transform: "rotateY(90deg) translateZ(64px)" }} />
                        {/* Top */}
                        <div className="absolute w-full h-full bg-gradient-to-br from-white/10 to-primary/10" style={{ transform: "rotateX(90deg) translateZ(64px)" }} />
                        {/* Bottom */}
                        <div className="absolute w-full h-full bg-gradient-to-br from-primary/10 to-white/10" style={{ transform: "rotateX(-90deg) translateZ(64px)" }} />
                    </div>
                </div>


                <div className="hero-cube-2 absolute bottom-[12%] right-[5%] w-20 h-20 pointer-events-none" style={{ perspective: "800px" }}>
                    <div
                        className="w-full h-full"
                        style={{
                            transformStyle: "preserve-3d",
                            animation: "rotateCube 30s linear infinite",
                        }}
                    >
                        {/* Cube faces — same gradient logic as first cube */}
                        <div className="absolute w-full h-full bg-gradient-to-br from-primary/20 to-accent/30" style={{ transform: "translateZ(40px)" }} />
                        <div className="absolute w-full h-full bg-gradient-to-br from-accent/30 to-primary/20" style={{ transform: "translateZ(-40px) rotateY(180deg)" }} />
                        <div className="absolute w-full h-full bg-gradient-to-br from-primary/10 to-accent/20" style={{ transform: "rotateY(-90deg) translateZ(40px)" }} />
                        <div className="absolute w-full h-full bg-gradient-to-br from-accent/20 to-primary/10" style={{ transform: "rotateY(90deg) translateZ(40px)" }} />
                        <div className="absolute w-full h-full bg-gradient-to-br from-white/10 to-primary/10" style={{ transform: "rotateX(90deg) translateZ(40px)" }} />
                        <div className="absolute w-full h-full bg-gradient-to-br from-primary/10 to-white/10" style={{ transform: "rotateX(-90deg) translateZ(40px)" }} />
                    </div>
                </div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 h-full flex flex-col lg:flex-row lg:gap-12 items-center justify-center">
                    {/* Left: Main Content */}
                    <div className="w-1/2 flex flex-col justify-center space-y-6 lg:space-y-8">
                        <div className="md:hidden flex items-center gap-3 mb-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                                <BookOpen className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Research Hub
              </span>
                        </div>

                        {/* Title + Description — GSAP Target */}
                        <div className="hero-title space-y-6 lg:space-y-8 text-center lg:text-left max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-transparent text-xs font-medium text-primary w-fit">
                                <Zap className="h-3 w-3" />
                                Next-Gen Research Repository
                            </div>
                            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-balance leading-tight text-foreground">
                                Discover Academic
                                <span className="block bg-gradient-to-r from-primary via-accent to-blue-500 bg-clip-text text-transparent">
                  Innovation
                </span>
                            </h1>
                            <p className="text-base text-muted-foreground leading-relaxed max-w-md">
                                A centralized platform for managing, sharing and discovering academic research at Shahjalal University
                                of Science and Technology.
                            </p>
                        </div>

                        {/* Buttons — GSAP Target */}
                        <div className="hero-buttons flex flex-col sm:flex-row gap-4 relative z-50">
                            {(!user || user.role === "student") && (
                                <Link href={getDashboardRoute(user)} className="w-full sm:w-auto">
                                    <Button
                                        size="lg"
                                        className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white border-0 hover:scale-105 transition-transform"
                                    >
                                        Start Publishing
                                        <ExternalLink className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            )}
                            <Link href="#explore-section" onClick={scrollToExplore} className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full border-green-600 text-foreground hover:text-white bg-white hover:bg-green-600 hover:scale-105 transition-transform"
                                >
                                    Explore Repository
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right: Recent Research — GSAP Target */}
                    <div className="hero-recent-cards w-1/2 h-full flex flex-col justify-center py-8 lg:py-0">
                        <div className="space-y-5 relative">
                            <h3 className="text-lg font-bold text-foreground">Recent Research</h3>
                            {recentResearch.map((research, idx) => (
                                <Link
                                    key={research.id}
                                    href={`/thesis/${research.id}`}
                                    className="block relative pointer-events-auto"
                                    prefetch={true}
                                >
                                    <div
                                        className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-2xl hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 cursor-pointer mb-4"
                                        style={{
                                            opacity: 0,
                                            transform: "translateX(100px)",
                                            animation: `slideInRight 0.5s ease-out ${idx * 0.1}s forwards`,
                                        }}
                                    >
                                        {/* Card content */}
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                                    {research.title}
                                                </h4>
                                                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                    {research.authors?.map((author: any, aIdx: number) => (
                                                        <span key={author.id || aIdx}>
                              {author.full_name}
                                                            {aIdx < research.authors.length - 1 && ", "}
                            </span>
                                                    )) || research.author}
                                                </p>
                                            </div>
                                            <Star className="h-4 w-4 text-primary/60 group-hover:text-primary transition-colors flex-shrink-0" />
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Eye className="h-3 w-3" />
                                            {research.views.toLocaleString()} views
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {/* Dots */}
                            <div className="flex items-center justify-center gap-2 mt-8 pt-4 border-t border-border">
                                {[0, 1, 2].map((index) => (
                                    <div
                                        key={index}
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            currentRecentIndex === index ? "bg-primary w-6" : "bg-muted-foreground/30 w-2"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Spacer to account for the fixed hero section's height */}
            <div className="lg:h-screen bg-transparent h-0" />

            {/* Explore Section */}
            <section id="explore-section" className="relative z-10 bg-transparent " data-scroll>
                <div className="px-6 lg:px-12 py-12  max-w-7xl mx-auto ">
                    <div className="relative p-[2px] rounded-[24px] bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 shadow-[0_0_60px_rgba(16,185,129,0.25),0_0_100px_rgba(16,185,129,0.15)]">
                        <div className="absolute inset-0 rounded-[24px] bg-gradient-to-r from-green-500/0 via-green-400/10 to-emerald-500/0 blur-xl" />
                        <div className="relative rounded-[21px] overflow-hidden border border-border/50 bg-card">
                            <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-100">
                                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-96">
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: `
                        radial-gradient(ellipse 800px 400px at 50% 50%,
                          rgba(34, 197, 94, 0.25) 0%,
                          rgba(21, 128, 61, 0.15) 30%,
                          rgba(21, 128, 61, 0.08) 60%,
                          transparent 100%)
                      `,
                                            filter: "blur(35px)", // Reduced from blur(70px)
                                        }}
                                    />
                                </div>

                                <div className="absolute w-96 h-96 top-10 right-50">
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: `
                        radial-gradient(ellipse 600px 500px at 100% 0%,
                          rgba(34, 197, 94, 0.28) 0%,
                          rgba(21, 128, 61, 0.18) 40%,
                          transparent 80%)
                      `,
                                            filter: "blur(40px)", // Reduced from blur(80px)
                                        }}
                                    />
                                </div>

                                <div className="absolute w-96 h-96 bottom-[80px] left-20">
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: `
                        radial-gradient(ellipse 600px 500px at 0% 100%,
                          rgba(34, 197, 94, 0.28) 0%,
                          rgba(21, 128, 61, 0.18) 40%,
                          transparent 80%)
                      `,
                                            filter: "blur(40px)", // Reduced from blur(80px)
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                            <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-accent/[0.02] rounded-full blur-3xl pointer-events-none" />

                            <div className="relative z-10 p-4 sm:p-8">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-foreground sm:text-3xl mb-2">Browse by Field</h2>
                                    <p className="text-muted-foreground text-sm sm:text-base">
                                        Explore research across different academic disciplines
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-8 z-30">
                                    {researchCategories.map((cat) => {
                                        const Icon = cat.icon
                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => setSelectedCategory(cat.id)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-sm transition-all border bg-card relative z-30 ${
                                                    selectedCategory === cat.id
                                                        ? "bg-gradient-to-r from-primary to-accent text-primary-foreground border-transparent shadow-lg shadow-primary/25"
                                                        : "border-border text-foreground hover:border-primary/50 hover:bg-accent"
                                                }`}
                                            >
                                                <Icon className="h-3.5 w-3.5" />
                                                <span>{cat.label}</span>
                                                <span className="text-xs opacity-75">({cat.count})</span>
                                            </button>
                                        )
                                    })}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    {/* Mobile view - 2 items */}
                                    <div className="md:hidden contents">
                                        {displayedCategoryResearchMobile.map((research) => (
                                            <Link key={research.id} href={`/thesis/${research.id}`} className="block group">
                                                <Card className="relative overflow-hidden border-border bg-card p-4 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 cursor-pointer h-full backdrop-blur-sm">
                                                    <div className="space-y-3">
                                                        <div>
                                                            <div className="flex items-start justify-between mb-1.5">
                                <span className="inline-block px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium">
                                  {research.year}
                                </span>
                                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                                                                    <span className="text-xs font-medium">{research.downloads}</span>
                                                                </div>
                                                            </div>
                                                            <h3 className="text-base font-bold text-card-foreground group-hover:text-primary transition-colors leading-tight line-clamp-1">
                                                                {research.title}
                                                            </h3>
                                                        </div>

                                                        <div className="space-y-0.5">
                                                            <p className="text-xs text-foreground font-medium line-clamp-1">
                                                                {research.authors?.map((author: any, idx: number) => (
                                                                    <span key={author.id || idx}>
                                    {author.full_name}
                                                                        {idx < research.authors.length - 1 && ", "}
                                  </span>
                                                                )) || research.author}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground line-clamp-1">{research.department}</p>
                                                        </div>

                                                        <p className="text-xs text-muted-foreground line-clamp-1">{research.abstract}</p>

                                                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                                                            {research.keywords.slice(0, 2).map((keyword) => (
                                                                <span
                                                                    key={keyword}
                                                                    className="inline-block px-2 py-0.5 rounded-md bg-primary/5 text-primary text-xs"
                                                                >
                                  {keyword}
                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Desktop view - 4 items */}
                                    <div className="hidden md:contents">
                                        {displayedCategoryResearchDesktop.map((research) => (
                                            <Link key={research.id} href={`/thesis/${research.id}`} className="block group">
                                                <Card className="relative overflow-hidden border-border bg-card p-4 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 cursor-pointer h-full backdrop-blur-sm">
                                                    <div className="space-y-3">
                                                        <div>
                                                            <div className="flex items-start justify-between mb-1.5">
                                <span className="inline-block px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium">
                                  {research.year}
                                </span>
                                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                                                                    <span className="text-xs font-medium">{research.downloads}</span>
                                                                </div>
                                                            </div>
                                                            <h3 className="text-base font-bold text-card-foreground group-hover:text-primary transition-colors leading-tight line-clamp-1">
                                                                {research.title}
                                                            </h3>
                                                        </div>

                                                        <div className="space-y-0.5">
                                                            <p className="text-xs text-foreground font-medium line-clamp-1">
                                                                {research.authors?.map((author: any, idx: number) => (
                                                                    <span key={author.id || idx}>
                                    {author.full_name}
                                                                        {idx < research.authors.length - 1 && ", "}
                                  </span>
                                                                )) || research.author}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground line-clamp-1">{research.department}</p>
                                                        </div>

                                                        <p className="text-xs text-muted-foreground line-clamp-1">{research.abstract}</p>

                                                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                                                            {research.keywords.slice(0, 2).map((keyword) => (
                                                                <span
                                                                    key={keyword}
                                                                    className="inline-block px-2 py-0.5 rounded-md bg-primary/5 text-primary text-xs"
                                                                >
                                  {keyword}
                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <Link href="/browse" className="block mt-6 flex justify-center">
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 px-8"
                                    >
                                        Browse All Research
                                        <ExternalLink className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3D Repository Showcase Section */}
            <section
                id="repository-showcase"
                className="relative py-4 px-4 sm:px-6 lg:px-8 z-40 border-t-12 border-primary/50 dark:border-primary rounded-4xl bg-background"
            >
                <div className="max-w-8xl mx-auto ">
                    <RepositoryShowcase />
                </div>
                    <div className="max-w-8xl mx-auto ">
                    <DetailsShowcase />
                </div>
                <div className="max-w-8xl mx-auto ">
                    <FeaturesSection />
                </div>
            </section>

            <section className="relative z-30 overflow-hidden py-32 sm:py-40 bg-background ">
                {/* Subtle gradient overlays for depth */}
                <AnimatedParticles />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

                <div className="max-w-7xl px-6 lg:px-12 mx-auto relative z-10">
                    <div className="text-center space-y-8">
                        {/* Small eyebrow text */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
                            Join the Research Community
                        </div>

                        {/* Main headline with text-balance for optimal line breaks */}
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                            Share your research.
                            <br />
                            <span className="text-muted-foreground">Inspire the world.</span>
                        </h2>

                        {/* Supporting text */}
                        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
                            Be part of a growing community of researchers and academics at SUST contributing to the advancement of
                            knowledge.
                        </p>

                        {/* CTA buttons with refined spacing */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <Button
                                asChild
                                size="lg"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 px-8"
                            >
                                <Link href="/register">
                                    Get Started
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="ghost"
                                className="text-foreground hover:text-foreground hover:bg-muted/50 px-8"
                            >
                                <Link href="/theses">
                                    Explore Theses
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        {/* Social proof / stats bar */}
                        <div className="pt-12 flex flex-col sm:flex-row gap-8 sm:gap-12 justify-center items-center text-sm">
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background" />
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary border-2 border-background" />
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 border-2 border-background" />
                                </div>
                                <span className="text-muted-foreground">
                  <span className="font-semibold text-foreground">1,200+</span> researchers
                </span>
                            </div>
                            <div className="text-muted-foreground">
                                <span className="font-semibold text-foreground">5,000+</span> theses published
                            </div>
                            <div className="text-muted-foreground">
                                <span className="font-semibold text-foreground">15+</span> research fields
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="relative border-t border-border/50 z-30 bg-gradient-to-b from-background via-background to-muted/30 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
                    {/* Main footer content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
                        {/* Brand section */}
                        <div className="lg:col-span-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                                    <BookOpen className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">SUST Research Hub</h3>
                                    <p className="text-xs text-muted-foreground">Academic Excellence</p>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                                Empowering academic innovation through a centralized platform for research discovery and collaboration
                                at SUST.
                            </p>
                        </div>

                        {/* Navigation links - cleaner grid */}
                        <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-foreground">Platform</h4>
                                <ul className="space-y-3">
                                    <li>
                                        <a
                                            href="#explore"
                                            onClick={scrollToExplore}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                                        >
                                            Explore
                                        </a>
                                    </li>
                                    <li>
                                        <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                            Login
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/register"
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            Register
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-foreground">Resources</h4>
                                <ul className="space-y-3">
                                    <li>
                                        <Link href="/help" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                            Help Center
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/contact"
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            Contact
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                            FAQ
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-foreground">Legal</h4>
                                <ul className="space-y-3">
                                    <li>
                                        <Link
                                            href="/privacy"
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            Privacy
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                            Terms
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Newsletter - minimal design */}
                        <div className="lg:col-span-3 space-y-4">
                            <h4 className="text-sm font-semibold text-foreground">Stay Connected</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Subscribe for research updates and academic insights.
                            </p>
                            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-all"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white border-0"
                                >
                                    Subscribe
                                    <ArrowRight className="ml-2 h-3 w-3" />
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Bottom bar - clean single line */}
                    <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-muted-foreground text-center sm:text-left">
                            © 2025 Shahjalal University of Science and Technology. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Github className="h-4 w-4" />
                            </a>
                            <a href="mailto:contact@sust.edu" className="text-muted-foreground hover:text-primary transition-colors">
                                <Mail className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
