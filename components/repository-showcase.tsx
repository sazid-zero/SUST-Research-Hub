"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Database, Cpu, FileText, Folder, GraduationCap } from "lucide-react"
import { useEffect, useState, useRef } from "react"
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

 export function AnimatedParticles() {
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
                    className="absolute rounded-full bg-white border border-white shadow-lg shadow-primary/30"
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
    const [activeRepo, setActiveRepo] = useState<"theses" | "papers" | "projects" | "models" | "datasets">("projects")

    const handleTabClick = (tab: "theses" | "papers" | "projects" | "models" | "datasets") => {
        setActiveRepo(tab)
    }

    const renderContent = () => {
        const imageSrc = `/${activeRepo === "theses" ? "thesis" : activeRepo}.png`
        
        return (
            <AnimatePresence mode="wait">
                <motion.div 
                    key={activeRepo}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="relative w-full h-full"
                >
                    <Image
                        src={imageSrc}
                        alt={`${activeRepo} repository preview`}
                        fill
                        className="object-cover object-top"
                        priority
                    />
                </motion.div>
            </AnimatePresence>
        )
    }
    // @ts-ignore
    // @ts-ignore
    return (
        <section className="relative py-8 sm:py-12 md:py-16 lg:py-24 px-2 sm:px-4 md:px-6 lg:px-8 overflow-hidden  ">
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
                <div
                    className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20 space-y-2 sm:space-y-3 md:space-y-4"
                >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                        Explore{" "}
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              All Repositories
            </span>
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
                        Discover our comprehensive collection of research resources with advanced filtering and organization
                    </p>
                </div>

                {/* Large Browser Window */}
                <div
                    className="relative lg:mx-10 -mr-2 ml-2 sm:mx-0"
                >
                    {/* Glowing aura behind window */}
                    <div
                        className={`absolute -inset-4 bg-gradient-to-r ${getRepoColor(activeRepo)} opacity-20 blur-3xl rounded-3xl`}
                    />

                    {/* Browser Window with glowing border */}
                    <div className="relative max-w-5xl mx-auto overflow-visible">
                        <div
                            className={`absolute -inset-[2px] bg-gradient-to-r ${getRepoColor(activeRepo)} rounded-2xl opacity-75 blur-sm`}
                        />
                        <div className="relative rounded-2xl overflow-hidden border-2 border-border bg-background shadow-2xl min-w-[800px]">
                            {/* Browser Chrome */}
                            <div className="border-b border-border px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 bg-muted/30 flex items-center gap-1 sm:gap-1.5 md:gap-2">
                                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-red-500 shadow-sm"></div>
                                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500 shadow-sm"></div>
                                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-green-500 shadow-sm"></div>
                                <div className="ml-2 sm:ml-3 md:ml-4 px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 rounded-md bg-background/50 text-[10px] sm:text-xs text-muted-foreground flex-1 max-w-md">
                                    sust-research-hub.vercel.app/{activeRepo}
                                </div>
                            </div>

                            {/* Content Window */}
                            <div className="h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden bg-background relative">
                                {renderContent()}
                            </div>
                        </div>
                    </div>

                    {/* Shadow effect */}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-10 bg-black/20 dark:bg-white/10 blur-3xl rounded-full" />
                </div>

                <div
                    className="flex justify-center mt-4 sm:mt-6 md:mt-8 lg:mt-10"
                >
                    <div className="relative inline-flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 md:p-1.5 rounded-full border border-border/50 bg-muted/30 dark:bg-white/10 backdrop-blur-sm shadow-lg overflow-x-auto max-w-full scrollbar-hide">
                        <TabButton
                            active={activeRepo === "theses"}
                            onClick={() => handleTabClick("theses")}
                            icon={GraduationCap}
                            label="Theses"
                        />
                        <TabButton
                            active={activeRepo === "papers"}
                            onClick={() => handleTabClick("papers")}
                            icon={FileText}
                            label="Papers"
                        />
                        <TabButton
                            active={activeRepo === "projects"}
                            onClick={() => handleTabClick("projects")}
                            icon={Folder}
                            label="Projects"
                        />
                        <TabButton
                            active={activeRepo === "models"}
                            onClick={() => handleTabClick("models")}
                            icon={IconBrandUnity}
                            label="Models"
                        />
                        <TabButton
                            active={activeRepo === "datasets"}
                            onClick={() => handleTabClick("datasets")}
                            icon={Database}
                            label="Datasets"
                        />
                    </div>
                </div>

                {/* Explore Button */}
                <div
                    className="flex justify-center mt-6 sm:mt-8 md:mt-10 lg:mt-12"
                >
                    <Link href={getRepoHref(activeRepo)}>
                        <button
                            className={`inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-xl bg-gradient-to-r ${getRepoColor(activeRepo)} text-white text-sm sm:text-base md:text-lg font-semibold shadow-lg hover:shadow-2xl transition-all`}
                        >
                            Explore {getRepoTitle(activeRepo)}
                        </button>
                    </Link>
                </div>
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
                   }: {
    active: boolean
    onClick: () => void
    icon: React.ElementType
    label: string
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
        <button
            onClick={onClick}
            className={`relative px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-full font-medium transition-all duration-300 ${
                active ? `bg-gradient-to-r ${tabColor} text-white shadow-lg` : "text-muted-foreground hover:text-foreground"
            }`}
        >
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                <span className="text-xs sm:text-sm">{label}</span>
            </div>
        </button>
    )
}
