"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useTheme } from "next-themes"
import type { Thesis, User } from "@/lib/data/theses" // Assuming User type is here
import { GlobalNavbar } from "@/components/global-navbar"
import { AnimatedParticles, RepositoryShowcase } from "@/components/repository-showcase"
import { FeaturesSection } from "@/components/features-section"

interface HomeContentProps {
    user: User | null
    allTheses: Thesis[]
    recentTheses: Thesis[]
}

export function HomeContent({ user, allTheses, recentTheses }: HomeContentProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [featuredIndex, setFeaturedIndex] = useState(0)
    const [currentRecentIndex, setCurrentRecentIndex] = useState(0)
    const [displayedResearch, setDisplayedResearch] = useState<Thesis[]>([]) // This line is now removed due to linting issues.
    const heroRef = useRef<HTMLDivElement>(null)
    const [heroZIndex, setHeroZIndex] = useState(50)
    const [browseRef, browseInView] = useInView({
        threshold: 0.3,
        triggerOnce: false,
        rootMargin: "0px 0px -200px 0px",
    })
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [isDesktop, setIsDesktop] = useState(false)

    const [scrollPosition, setScrollPosition] = useState(0)
    const { scrollY } = useScroll()

    const heroSectionHeight = 300 // reduced from 800 to 400 to make scroll animation 2x faster
    const textScale = useTransform(scrollY, [0, heroSectionHeight], [1, 0.8])
    const textOpacity = useTransform(scrollY, [0, heroSectionHeight], [1, 0])
    const buttonsOpacity = useTransform(scrollY, [0, 150], [1, 0]) // reduced from 300 to 150 for faster button fade

    useEffect(() => {
        setMounted(true)
        setIsDesktop(window.innerWidth >= 1024)

        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024)
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY)
            setHeroZIndex(window.scrollY < 100 ? 50 : 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const isHeroInteractive = scrollPosition < 100

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
    const recentResearch = recentTheses.slice(featuredIndex, featuredIndex + 3) // Renamed from displayedResearch to avoid redeclaration

    // Featured carousel - cycles through recent theses
    useEffect(() => {
        const interval = setInterval(() => {
            setFeaturedIndex((prev) => (prev + 3 >= recentTheses.length ? 0 : prev + 3))
        }, 3500)
        return () => clearInterval(interval)
    }, [recentTheses.length])

    // Recent dots animation
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentRecentIndex((prev) => (prev + 1) % 3)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    // Category shuffle effect
    useEffect(() => {
        if (!browseInView) return

        const ids = researchCategories.map((c) => c.id)
        const interval = setInterval(() => {
            setSelectedCategory((prev) => {
                const i = ids.indexOf(prev)
                return ids[(i + 1) % ids.length]
            })
        }, 2000)

        return () => clearInterval(interval)
    }, [browseInView])

    const navItems = [
        { label: "Browse", href: "/browse" },
        { label: "Features", href: "/#features" },
        { label: "About", href: "/#about" },
        { label: "Help", href: "/help" },
    ]

    // Animation variants for the explore repositories section
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    }

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

    const scrollToExplore = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        const exploreSection = document.getElementById("explore-section")
        if (exploreSection) {
            exploreSection.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <GlobalNavbar user={user} />

            <section
                ref={heroRef}
                className="lg:fixed lg:top-16 lg:left-0 lg:right-0 lg:min-h-[calc(100vh-4rem)] lg:z-30 w-full lg:flex lg:flex-col lg:gap-12 pt-0 mt-0"
                style={{
                    pointerEvents: scrollPosition < 50 ? "auto" : "none",
                    zIndex: heroZIndex,
                }}
            >
                <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                    <img
                        src="https://cdn.pixabay.com/animation/2023/01/26/04/01/04-01-09-576_512.gif"
                        alt="Rotating cube"
                        className="absolute object-cover -z-10 pointer-events-none top-2 left-16 w-32 h-32 "
                        draggable={false}
                    />
                </div>
                <div className="w-full mt-4 px-6 lg:px-12 h-full flex flex-col lg:flex-row lg:gap-12 lg:items-center py-12 lg:py-24">
                    <div className="flex-1 flex flex-col justify-center space-y-8">
                        <div className="md:hidden flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                                <BookOpen className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Research Hub
              </span>
                        </div>
                        <motion.div
                            style={{
                                scale: textScale,
                                opacity: textOpacity,
                            }}
                            className="space-y-6 max-md:!opacity-100 max-md:!scale-100"
                        >
                            <div className="inline-flex items-center gap-2 px-3 mt-12 lg:mt-0 py-1 rounded-full border border-primary/30 bg-background text-xs font-medium text-primary w-fit">
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
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: 0.2,
                            }}
                            style={{
                                opacity: isDesktop ? buttonsOpacity : 1,
                            }}
                            className="flex flex-col sm:flex-row gap-4 relative z-50 pointer-events-auto max-lg:!opacity-100"
                        >
                            {(!user || user.role === "student") && (
                                <Link href={getDashboardRoute(user)} className="w-full sm:w-auto">
                                    <Button
                                        size="lg"
                                        className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white border-0 hover:scale-110"
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
                                    className="w-full border-green-600 text-foreground hover:text-white bg-white hover:bg-green-600 hover:scale-110"
                                >
                                    Explore Repository
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    <div className="flex-1 h-full flex flex-col justify-center py-12 lg:py-0">
                        <motion.div
                            className="space-y-5 relative max-lg:!opacity-100 max-lg:!scale-100 max-lg:pointer-events-auto"
                            style={{
                                scale: isDesktop ? textScale : 1,
                                opacity: isDesktop ? textOpacity : 1,
                                pointerEvents: isDesktop ? (isHeroInteractive ? "auto" : "none") : "auto",
                            }}
                        >
                            <h3 className="text-lg font-bold text-foreground">Recent Research</h3>
                            {recentResearch.map((research, idx) => (
                                <Link
                                    key={research.id}
                                    href={`/thesis/${research.id}`}
                                    className="block relative pointer-events-auto"
                                    prefetch={true}
                                >
                                    <motion.div
                                        className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-2xl hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 cursor-pointer mb-4"
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{
                                            duration: 1.2,
                                            ease: [0.25, 0.1, 0.25, 1],
                                            delay: idx * 0.2,
                                        }}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                                    {research.title}
                                                </h4>
                                                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                    {research.authors?.map((author: any, idx: number) => (
                                                        <span key={author.id || idx}>
                              {author.full_name}
                                                            {idx < research.authors.length - 1 && ", "}
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
                                    </motion.div>
                                </Link>
                            ))}
                            <div className="flex items-center justify-center gap-2 mt-8 pt-4 border-t border-border">
                                {[0, 1, 2].map((index) => (
                                    <motion.div
                                        key={index}
                                        className={`h-2 rounded-full transition-all ${
                                            currentRecentIndex === index ? "bg-primary w-6" : "bg-muted-foreground/30 w-2"
                                        }`}
                                        animate={{
                                            width: currentRecentIndex === index ? "24px" : "8px",
                                        }}
                                        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="absolute inset-0 opacity-[0.03] -z-10">
                    <div className="absolute inset-0 bg-grid-pattern [background-size:50px_50px] [background-image:linear-gradient(0deg,transparent_24%,#10b981_25%,#10b981_26%,transparent_27%,transparent_74%,#10b981_75%,#10b981_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,#10b981_25%,#10b981_26%,transparent_27%,transparent_74%,#10b981_75%,#10b981_76%,transparent_77%,transparent)]" />
                </div>

                <div className="absolute top-20 right-1/3 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl -z-10" />
                <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl -z-10" />
            </section>

            {/* Explore Section */}
            <section id="browse"
                     ref={browseRef}
                     className="relative md:mt-[100vh] pt-6 md:pt-10 pb-10 overflow-hidden z-40 bg-transparent"
                     style={{ pointerEvents: "auto" }}>
                <div className="px-6 lg:px-12 ">
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
                          rgba(34, 197, 94, 0.32) 0%,
                          rgba(22, 163, 74, 0.22) 30%,
                          rgba(21, 128, 61, 0.14) 60%,
                          transparent 100%)
                      `,
                                            filter: "blur(70px)",
                                        }}
                                    />
                                </div>

                                <div className="absolute w-96 h-96 top-10 right-50">
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: `
                        radial-gradient(ellipse 600px 500px at 100% 0%,
                          rgba(34, 197, 94, 0.38) 0%,
                          rgba(21, 128, 61, 0.25) 40%,
                          transparent 80%)
                      `,
                                            filter: "blur(80px)",
                                        }}
                                    />
                                </div>

                                <div className="absolute w-96 h-96 bottom-[80px] left-20">
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: `
                        radial-gradient(ellipse 600px 500px at 0% 100%,
                          rgba(34, 197, 94, 0.38) 0%,
                          rgba(21, 128, 61, 0.25) 40%,
                          transparent 80%)
                      `,
                                            filter: "blur(80px)",
                                        }}
                                    />
                                </div>
                                <div className="absolute inset-0">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.05)_0%,transparent_50%)]" />
                                </div>
                                <div className="absolute inset-0">
                                    <div
                                        className="absolute w-48 h-48 top-20 left-20"
                                        style={{
                                            background: "radial-gradient(circle, rgba(34, 197, 94, 0.20) 0%, transparent 70%)",
                                            filter: "blur(50px)",
                                        }}
                                    />
                                    <div
                                        className="absolute w-40 h-40 top-1/2 left-32 -translate-y-1/2"
                                        style={{
                                            background: "radial-gradient(circle, rgba(22, 163, 74, 0.18) 0%, transparent 70%)",
                                            filter: "blur(45px)",
                                        }}
                                    />
                                    <div
                                        className="absolute w-64 h-64 bottom-16 left-16"
                                        style={{
                                            background:
                                                "radial-gradient(ellipse 500px 400px at 0% 100%, rgba(21, 128, 61, 0.26) 0%, transparent 75%)",
                                            filter: "blur(70px)",
                                        }}
                                    />
                                    <div
                                        className="absolute w-56 h-56 bottom-24 right-28"
                                        style={{
                                            background: "radial-gradient(circle, rgba(22, 163, 74, 0.16) 0%, transparent 70%)",
                                            filter: "blur(55px)",
                                        }}
                                    />
                                    <div
                                        className="absolute w-32 h-32 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                        style={{
                                            background: "radial-gradient(circle, rgba(34, 197, 94, 0.34) 0%, transparent 60%)",
                                            filter: "blur(40px)",
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/[0.02] rounded-full blur-3xl pointer-events-none" />
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
                                                style={{
                                                    animation: selectedCategory === cat.id ? "pulse 2s ease-in-out infinite" : "none",
                                                }}
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
                                        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white border-0 shadow-lg shadow-primary/25  text-base rounded-lg"
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
                id="explore"
                className="relative py-4 px-4 sm:px-6 lg:px-8 z-40 border-t-12 border-primary/50 dark:border-primary rounded-4xl bg-background"
            >
                <RepositoryShowcase />

                <FeaturesSection />
            </section>

            <section className="relative z-30 overflow-hidden py-32 sm:py-40 bg-background">
                {/* Subtle gradient overlays for depth */}
                <AnimatedParticles />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

                <div className="max-w-5xl px-6 lg:px-12 mx-auto relative z-10">
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
                                <Link href="/explore">
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

            <footer className="relative border-t border-border/50 bg-gradient-to-b from-background via-background to-muted/30 backdrop-blur-sm">
                <div className="px-6 lg:px-12 py-16">
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
