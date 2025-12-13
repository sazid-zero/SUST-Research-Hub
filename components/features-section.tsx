"use client"
import { FileText, Search, Shield, BookOpen, Video, BarChart3 } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useTheme } from "./theme-provider"
import { AnimatedParticles } from "@/components/repository-showcase"
import Link from "next/link"
import { motion } from "framer-motion"
import {scrollToExplore} from "@/components/scroll-to-section";

const features = [
    {
        icon: FileText,
        title: "Multi-Repository Support",
        description: "Upload and manage theses, papers, projects, ML models, and datasets all in one unified platform.",
    },
    {
        icon: Search,
        title: "Advanced Discovery",
        description:
            "Search across all repository types with intelligent filtering by department, field, keywords, and more.",
    },
    {
        icon: Shield,
        title: "Secure Collaboration",
        description: "Role-based access with detailed review workflows for supervisors, admins, and researchers.",
    },
    {
        icon: BookOpen,
        title: "Rich Media Storage",
        description: "Store research in multiple formats: PDFs, videos, audio, interactive models, and more.",
    },
    {
        icon: Video,
        title: "Interactive Browsing",
        description: "Beautiful interfaces to explore theses, papers, datasets, models, and projects with ease.",
    },
    {
        icon: BarChart3,
        title: "Analytics & Insights",
        description: "Track submissions, approvals, views, downloads, and repository growth with detailed metrics.",
    },
]

function ScatteredCubes({ isDark }: { isDark: boolean }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isInViewport, setIsInViewport] = useState(false)
    const [rotation, setRotation] = useState(0)

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
        if (!isInViewport) return

        const animate = () => setRotation((prev) => prev + 0.3)
        const interval = setInterval(animate, 50)
        return () => clearInterval(interval)
    }, [isInViewport])

    const cubes = [
        { size: 60, x: "5%", y: "15%", rotateX: 25, rotateY: 45, delay: 0 },
        { size: 45, x: "15%", y: "70%", rotateX: -20, rotateY: 30, delay: 0.5 },
        { size: 80, x: "85%", y: "20%", rotateX: 35, rotateY: -25, delay: 0.3 },
        { size: 50, x: "90%", y: "65%", rotateX: -30, rotateY: 60, delay: 0.7 },
        { size: 35, x: "50%", y: "4%", rotateX: 40, rotateY: -40, delay: 0.2 },
      { size: 55, x: "25%", y: "85%", rotateX: -15, rotateY: 50, delay: 0.6 },
      { size: 40, x: "75%", y: "80%", rotateX: 20, rotateY: -35, delay: 0.4 },
      { size: 70, x: "8%", y: "45%", rotateX: -25, rotateY: 20, delay: 0.8 },
     { size: 30, x: "92%", y: "40%", rotateX: 30, rotateY: 55, delay: 0.1 },                                                                                                 
      { size: 50, x: "60%", y: "90%", rotateX: -35, rotateY: -20, delay: 0.9 },
]
    const colors = isDark
        ? {
            front: "from-gray-200 to-gray-400",
            back: "from-gray-400 to-gray-600",
            left: "from-gray-300 to-gray-500",
            right: "from-gray-100 to-gray-300",
            top: "from-white to-gray-200",
            bottom: "from-gray-500 to-gray-700",
        }
        : {
            front: "from-primary/40 to-primary/70",
            back: "from-primary/70 to-primary/90",
            left: "from-primary/50 to-primary/80",
            right: "from-primary/30 to-primary/50",
            top: "from-primary/10 to-primary/30",
            bottom: "from-primary/80 to-primary",
        }
    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
            {cubes.map((cube, index) => (
                <motion.div
                    key={index}
                    className="absolute"
                    style={{
                        left: cube.x,
                        top: cube.y,
                        perspective: "400px",
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                    <div
                        style={{
                            width: cube.size,
                            height: cube.size,
                            transformStyle: "preserve-3d",
                            transform: `rotateX(${cube.rotateX}deg) rotateY(${rotation + cube.delay * 100}deg)`,
                        }}
                    >
                        <div
                            className={`absolute bg-gradient-to-br ${colors.front}`}
                            style={{
                                width: cube.size,
                                height: cube.size,
                                transform: `translateZ(${cube.size / 2}px)`,
                                boxShadow: "inset 0 0 15px rgba(255,255,255,0.4)",
                            }}
                        />
                        <div
                            className={`absolute bg-gradient-to-br ${colors.back}`}
                            style={{
                                width: cube.size,
                                height: cube.size,
                                transform: `translateZ(-${cube.size / 2}px) rotateY(180deg)`,
                            }}
                        />
                        <div
                            className={`absolute bg-gradient-to-br ${colors.left}`}
                            style={{
                                width: cube.size,
                                height: cube.size,
                                transform: `rotateY(-90deg) translateZ(${cube.size / 2}px)`,
                            }}
                        />
                        <div
                            className={`absolute bg-gradient-to-br ${colors.right}`}
                            style={{
                                width: cube.size,
                                height: cube.size,
                                transform: `rotateY(90deg) translateZ(${cube.size / 2}px)`,
                                boxShadow: "inset 0 0 20px rgba(255,255,255,0.6)",
                            }}
                        />
                        <div
                            className={`absolute bg-gradient-to-br ${colors.top}`}
                            style={{
                                width: cube.size,
                                height: cube.size,
                                transform: `rotateX(90deg) translateZ(${cube.size / 2}px)`,
                                boxShadow: "inset 0 0 25px rgba(255,255,255,0.7)",
                            }}
                        />
                        <div
                            className={`absolute bg-gradient-to-br ${colors.bottom}`}
                            style={{
                                width: cube.size,
                                height: cube.size,
                                transform: `rotateX(-90deg) translateZ(${cube.size / 2}px)`,
                            }}
                        />
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

export function FeaturesSection() {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const isDark = resolvedTheme === "dark"

    if (!mounted) {
        return (
            <section className="relative bg-background py-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen">
                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Powerful Features
            </span>{" "}
                        <span className="text-foreground">for Research Excellence</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Everything you need to manage, share, and discover academic research
                    </p>
                </div>
            </section>
        )
    }

    return (
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen bg-background transition-colors duration-500">
            <AnimatedParticles />
            <ScatteredCubes isDark={isDark} />

            <div className="relative z-10 max-w-6xl mx-auto text-center">
                <h2
                    className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
                >
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Powerful Features
          </span>{" "}
                    <span className={isDark ? "text-white" : "text-foreground"}>for Research Excellence</span>
                </h2>

                <p
                    className="text-lg mb-16 max-w-3xl mx-auto leading-relaxed text-muted-foreground"
                >
                    Everything you need to manage, share, and discover academic research
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`relative rounded-xl p-6 bg-card/80 backdrop-blur-sm
                transition-all duration-300 shadow-xl/30 shadow-primary inset-shadow-sm inset-shadow-primary/80 dark:inset-shadow-primary hover:shadow-xl/50 hover:shadow-primary 
                ${isDark ? "bg-card/50" : "bg-card"}`}
                        >
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                                <feature.icon className="w-6 h-6 text-primary" />
                            </div>

                            <h3 className={`font-semibold text-lg mb-2 ${isDark ? "text-white" : "text-foreground"}`}>
                                {feature.title}
                            </h3>
                            <p className={`text-sm leading-relaxed mb-4 text-muted-foreground`}>{feature.description}</p>

                            <Link
                                href="#explore"
                                onClick={scrollToExplore}
                                className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:text-primary/80 transition-colors"
                            >
                                Learn more
                                <span className="text-lg">→</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
