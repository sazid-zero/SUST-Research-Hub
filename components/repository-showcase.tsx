"use client"

import type React from "react"

import { motion } from "framer-motion"
import Link from "next/link"
import { BookOpen, Database, Cpu, FileText, Folder, GraduationCap } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { ThesisContentMock } from "@/components/thesis-content-mock"
import { PapersContent } from "@/components/papers-content"
import ProjectsContent from "@/components/projects-content"
import ModelsContent from "@/components/models-content"
import DatasetsContent from "@/components/datasets-content"
import { IconBrandUnity } from "@tabler/icons-react"

const repositories = [
    {
        id: "publications",
        title: "Publications",
        description: "Academic theses, research papers, and collaborative projects",
        href: "/browse",
        icon: BookOpen,
        color: "from-purple-500 to-pink-500",
        tabs: ["Theses", "Papers", "Projects"],
        counts: { theses: "38", papers: "3", projects: "3" },
    },
    {
        id: "models",
        title: "ML Models",
        description: "Pre-trained machine learning models with advanced filtering",
        href: "/models",
        icon: Cpu,
        color: "from-orange-500 to-amber-500",
        count: "12",
    },
    {
        id: "datasets",
        title: "Research Datasets",
        description: "Curated datasets organized by modality and domain",
        href: "/datasets",
        icon: Database,
        color: "from-rose-500 to-red-500",
        count: "12",
    },
]

const TAB_ROTATION_ORDER: Array<"theses" | "papers" | "projects" | "models" | "datasets"> = [
    "theses",
    "papers",
    "projects",
    "models",
    "datasets",
]

function AnimatedParticles() {
    const [particles, setParticles] = useState<
        Array<{ id: number; x: number; y: number; size: number; duration: number }>
    >([])

    useEffect(() => {
        const particleCount = 80
        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 2,
            duration: Math.random() * 20 + 10,
        }))
        setParticles(newParticles)
    }, [])

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-primary/20 dark:bg-white border border-white shadow-lg shadow-primary/30"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.4, 1, 0.4],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    )
}

export function RepositoryShowcase() {
    const [activeRepo, setActiveRepo] = useState<"theses" | "papers" | "projects" | "models" | "datasets">("models")
    const [isAutoRotating, setIsAutoRotating] = useState(true)
    const [isInViewport, setIsInViewport] = useState(true)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInViewport(entry.isIntersecting)
            },
            { threshold: 0.3 },
        )

        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!isAutoRotating || !isInViewport) return

        const interval = setInterval(() => {
            setActiveRepo((current) => {
                const currentIndex = TAB_ROTATION_ORDER.indexOf(current)
                const nextIndex = (currentIndex + 1) % TAB_ROTATION_ORDER.length
                return TAB_ROTATION_ORDER[nextIndex]
            })
        }, 2000)

        return () => clearInterval(interval)
    }, [isAutoRotating, isInViewport])

    const handleTabClick = (tab: "theses" | "papers" | "projects" | "models" | "datasets") => {
        setActiveRepo(tab)
        setIsAutoRotating(false)

        const resumeTimer = setTimeout(() => {
            setIsAutoRotating(true)
        }, 4000)

        return () => clearTimeout(resumeTimer)
    }

    const renderContent = () => {
        switch (activeRepo) {
            case "theses":
                return <ThesisContentMock user={null} />
            case "papers":
                return <PapersContent user={null} />
            case "projects":
                return <ProjectsContent user={null} />
            case "models":
                return <ModelsContent user={null} />
            case "datasets":
                return <DatasetsContent user={null} />
        }
    }

    return (
        <section ref={containerRef} className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden ">
            {/* Background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent z-0" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse z-0" />
            <div
                className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-pulse z-0"
                style={{ animationDelay: "2s" }}
            />
            <div
                className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] animate-pulse z-0"
                style={{ animationDelay: "4s" }}
            />

            <AnimatedParticles />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20 space-y-4"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                        Explore{" "}
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              All Repositories
            </span>
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                        Discover our comprehensive collection of research resources with advanced filtering and organization
                    </p>
                </motion.div>

                {/* Large Browser Window */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    {/* Glowing aura behind window */}
                    <div
                        className={`absolute -inset-4 bg-gradient-to-r ${getRepoColor(activeRepo)} opacity-20 blur-3xl rounded-3xl`}
                    />

                    {/* Browser Window with glowing border */}
                    <div className="relative">
                        <div
                            className={`absolute -inset-[2px] bg-gradient-to-r ${getRepoColor(activeRepo)} rounded-2xl opacity-75 blur-sm`}
                        />
                        <div className="relative rounded-2xl overflow-hidden border-2 border-border bg-background shadow-2xl">
                            {/* Browser Chrome */}
                            <div className="border-b border-border px-4 py-3 bg-muted/30 flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
                                <div className="ml-4 px-4 py-1 rounded-md bg-background/50 text-xs text-muted-foreground flex-1 max-w-md">
                                    sust-research-hub.vercel.app/{activeRepo}
                                </div>
                            </div>

                            {/* Content Window */}
                            <div className="h-[500px] overflow-hidden bg-background">
                                <div className="scale-[0.65] origin-top-left w-[154%] h-[154%]">{renderContent()}</div>
                            </div>
                        </div>
                    </div>

                    {/* Shadow effect */}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-10 bg-black/20 dark:bg-white/10 blur-3xl rounded-full" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex justify-center mt-10"
                >
                    <div className="relative inline-flex items-center gap-1 p-1.5 rounded-full border border-border/50 bg-muted/30 dark:bg-white/10 backdrop-blur-sm shadow-lg">
                        <TabButton
                            active={activeRepo === "theses"}
                            onClick={() => handleTabClick("theses")}
                            icon={GraduationCap}
                            label="Theses"
                            count="38"
                        />
                        <TabButton
                            active={activeRepo === "papers"}
                            onClick={() => handleTabClick("papers")}
                            icon={FileText}
                            label="Papers"
                            count="3"
                        />
                        <TabButton
                            active={activeRepo === "projects"}
                            onClick={() => handleTabClick("projects")}
                            icon={Folder}
                            label="Projects"
                            count="3"
                        />
                        <TabButton
                            active={activeRepo === "models"}
                            onClick={() => handleTabClick("models")}
                            icon={IconBrandUnity}
                            label="Models"
                            count="12"
                        />
                        <TabButton
                            active={activeRepo === "datasets"}
                            onClick={() => handleTabClick("datasets")}
                            icon={Database}
                            label="Datasets"
                            count="12"
                        />
                    </div>
                </motion.div>

                {/* Explore Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex justify-center mt-12"
                >
                    <Link href={getRepoHref(activeRepo)}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r ${getRepoColor(activeRepo)} text-white text-lg font-semibold shadow-lg hover:shadow-2xl transition-all`}
                        >
                            Explore {getRepoTitle(activeRepo)}
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}

function getRepoColor(repo: string) {
    switch (repo) {
        case "theses":
            return "from-purple-500 to-pink-500"
        case "papers":
            return "from-blue-500 to-violet-500"
        case "projects":
            return "from-green-500 to-emerald-500"
        case "models":
            return "from-orange-500 to-amber-500"
        case "datasets":
            return "from-rose-500 to-red-500"
        default:
            return "from-primary to-accent"
    }
}

function getRepoHref(repo: string) {
    switch (repo) {
        case "theses":
            return "/theses"
        case "papers":
            return "/papers"
        case "projects":
            return "/projects"
        case "models":
            return "/models"
        case "datasets":
            return "/datasets"
    }
}

function getRepoTitle(repo: string) {
    switch (repo) {
        case "theses":
            return "Theses"
        case "papers":
            return "Papers"
        case "projects":
            return "Projects"
        case "models":
            return "ML Models"
        case "datasets":
            return "Datasets"
    }
}

function TabButton({
                       active,
                       onClick,
                       icon: Icon,
                       label,
                       count,
                   }: {
    active: boolean
    onClick: () => void
    icon: React.ElementType
    label: string
    count: string
}) {
    const tabColor = (() => {
        switch (label) {
            case "Theses":
                return "from-purple-500 to-pink-500"
            case "Papers":
                return "from-blue-500 to-violet-500"
            case "Projects":
                return "from-green-500 to-emerald-500"
            case "Models":
                return "from-orange-500 to-amber-500"
            case "Datasets":
                return "from-rose-500 to-red-500"
            default:
                return "from-primary to-accent"
        }
    })()

    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className={`relative px-4 py-2.5 rounded-full font-medium transition-all duration-300 ${
                active ? `bg-gradient-to-r ${tabColor} text-white shadow-lg` : "text-muted-foreground hover:text-foreground"
            }`}
        >
            <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="text-sm">{label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${active ? "bg-white/20" : "bg-muted/50"}`}>
          {count}
        </span>
            </div>
        </motion.button>
    )
}
