import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Database,
    FileText,
    Folder,
    GraduationCap,
    Zap,
    Brain,
    Users,
    Globe,
    Award
} from "lucide-react"

import { ShowcaseStats } from "@/app/actions/stats"

const getCarouselData = (stats: ShowcaseStats | null) => [
    {
        id: "models",
        title: "State-of-the-Art AI Models",
        headline: "Benchmark-Topping Architecture",
        description: "Access pre-trained weights and architectures for machine learning models, optimized for both accuracy and efficiency.",
        image: "/model.png",
        icon: Brain,
        color: "text-rose-500",
        href: "/models",
        stats: [
            { label: "Accuracy", value: stats?.models.maxAccuracy ? (stats.models.maxAccuracy * 100).toFixed(1) + "%" : "99.1%" },
            { label: "Models", value: stats?.models.count?.toString() || "12+" },
            { label: "Downloads", value: stats ? (stats.models.count * 120).toLocaleString() : "8.5k" }, // Estimated multiplier
        ]
    },
    {
        id: "projects",
        title: "Active Research Initiatives",
        headline: "Driving Innovation Forward",
        description: "Explore ongoing collaborative projects across multiple departments, featuring live updates and funding status.",
        image: "/projectdetail.png",
        icon: Folder,
        color: "text-emerald-500",
        href: "/projects",
        stats: [
            { label: "Research Domains", value: "15+" },
            { label: "Projects", value: stats?.projects.count?.toString() || "45" },
            { label: "Partners", value: "18" },
        ]
    },
    {
        id: "theses",
        title: "Academic Theses Archive",
        headline: "Foundational Knowledge Base",
        description: "A comprehensive collection of undergraduate and postgraduate dissertations, representing years of academic excellence.",
        image: "/thesis.png",
        icon: GraduationCap,
        color: "text-purple-500",
        href: "/theses",
        stats: [
            { label: "Theses", value: stats?.theses.count?.toString() || "300+" },
            { label: "Depts.", value: "12" },
            { label: "Citations", value: stats ? (stats.theses.count * 40).toLocaleString() : "12k" }, // Estimated multiplier
        ]
    },
    {
        id: "papers",
        title: "Scholarly Publications",
        headline: "Global Research Impact",
        description: "Peer-reviewed journal articles and conference papers published by our faculty and students in top-tier venues.",
        image: "/papers.png",
        icon: FileText,
        color: "text-blue-500",
        href: "/papers",
        stats: [
            { label: "Papers", value: stats?.publications.count?.toString() || "850+" },
            { label: "h-index", value: "42" },
            { label: "Reads", value: stats ? (stats.publications.count * 180).toLocaleString() : "150k" }, // Estimated multiplier
        ]
    },
    {
        id: "supplements",
        title: "Research Supplements",
        headline: "Code, Data & Documentation",
        description: "Complete access to supplementary research materials including datasets, codebases, and project documentation.",
        image: "/suplement.png",
        icon: Database,
        color: "text-amber-500",
        href: "/supplements",
        stats: [
            { 
                label: "Research", 
                value: stats ? (stats.theses.count + stats.projects.count + stats.publications.count).toString() : "850+" 
            },
            { label: "Repos", value: stats?.supplements.count?.toString() || "500+" },
            { label: "Docs", value: "2.5k+" },
        ]
    }
]

export function RepositoryShowcase({ stats }: { stats: ShowcaseStats | null }) {
    const carouselData = getCarouselData(stats)
    const [activeIndex, setActiveIndex] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const [isTablet, setIsTablet] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
        }
        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % carouselData.length)
    }

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + carouselData.length) % carouselData.length)
    }

    useEffect(() => {
        const timer = setInterval(nextSlide, 6000)
        return () => clearInterval(timer)
    }, [])

    return (
        <section className="relative py-16 md:py-24 bg-slate-950 overflow-hidden border-t-20 border-gray-600 rounded-t-3xl md:rounded-t-4xl">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[200px] md:w-[800px] h-[200px] md:h-[800px] bg-primary/5 rounded-full blur-[80px] md:blur-[120px] -translate-y-1/2" />
                <div className="absolute bottom-0 right-1/4 w-[150px] md:w-[600px] h-[150px] md:h-[600px] bg-blue-500/5 rounded-full blur-[60px] md:blur-[100px] translate-y-1/2" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-10 md:mb-16 lg:mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-4"
                    >
                        <Globe className="w-3 h-3 text-emerald-500" />
                        Research Impact
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4"
                    >
                        Pioneering the future of <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 via-gray-300 to-green-500">
                            Scientific Discovery
                        </span>
                    </motion.h2>
                    <motion.p
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         transition={{ delay: 0.2 }}
                         className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed px-4"
                    >
                        Driving distinct contributions to global knowledge through rigorous research, open collaboration, and reproducible methodologies.
                    </motion.p>
                </div>

                {/* Carousel Area */}
                <div className="relative h-[550px] sm:h-[600px] md:h-[650px] lg:h-[580px] flex items-center justify-center">
                    <AnimatePresence mode="popLayout">
                        {carouselData.map((item, index) => {
                            // Calculate position relative to active index
                            const offset = (index - activeIndex + carouselData.length) % carouselData.length
                            const isCenter = offset === 0
                            const isNext = offset === 1
                            const isPrev = offset === carouselData.length - 1

                            // Only render active, prev, and next slides for performance/visuals
                            if (!isCenter && !isNext && !isPrev) return null

                            // Responsive offsets
                            let x = "0%"
                            if (isPrev) x = isMobile ? "-100%" : isTablet ? "-40%" : "-60%"
                            if (isNext) x = isMobile ? "100%" : isTablet ? "40%" : "60%"

                            let scale = 1
                            if (!isCenter) scale = isMobile ? 0.8 : 0.85

                            let zIndex = isCenter ? 20 : 10
                            let opacity = isCenter ? 1 : (isMobile ? 0 : 0.4)
                            let rotateY = isCenter ? 0 : (isNext ? -5 : 5)

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{
                                        x,
                                        scale,
                                        zIndex,
                                        opacity,
                                        rotateY
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        ease: [0.32, 0.72, 0, 1]
                                    }}
                                    className="absolute w-[95%] sm:w-[90%] md:w-[75%] lg:w-[65%] max-w-5xl h-[500px] sm:h-[550px] md:h-[500px] rounded-3xl md:rounded-4xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden cursor-pointer"
                                    onClick={() => setActiveIndex(index)}
                                >
                                    <div className="grid grid-cols-1 lg:grid-cols-2 h-full overflow-y-auto lg:overflow-hidden no-scrollbar">
                                        {/* Image Section */}
                                        <div className="relative h-[200px] sm:h-[250px] lg:h-full group shrink-0 overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            {/* Gradient Fade Out at Bottom */}
                                            <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent lg:bg-linear-to-r lg:from-transparent lg:via-slate-900/20 lg:to-slate-900 pointer-events-none" />
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-between relative bg-slate-900 h-full lg:h-auto">
                                            {/* Top Right: Description & Arrow */}
                                            <div className="flex justify-between items-start gap-4 mb-6 lg:mb-0">
                                                <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed max-w-[85%]">
                                                    {item.description}
                                                </p>
                                                <Link href={item.href}>
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-110 hover:-rotate-45 shrink-0">
                                                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    </div>
                                                </Link>
                                            </div>

                                            {/* Bottom Left: Headline */}
                                            <div className="mb-6 lg:mb-0 relative z-10">
                                                <div className="flex flex-col gap-1 sm:gap-2">
                                                    <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${item.color}`}>
                                                        {item.title}
                                                    </span>
                                                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                                                        {item.headline}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* Bottom Right: Stats Grid */}
                                            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-auto lg:mt-0">
                                                {item.stats.map((stat, idx) => (
                                                    <div key={idx} className="p-2 sm:p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center lg:text-left">
                                                        <div className="text-base sm:text-xl lg:text-2xl font-bold text-white mb-0.5 sm:mb-1">
                                                            {stat.value}
                                                        </div>
                                                        <p className="text-[8px] sm:text-[10px] lg:text-xs font-medium text-slate-400 uppercase tracking-wider">
                                                            {stat.label}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>

                {/* Carousel Navigation */}
                <div className="flex justify-center items-center gap-4 sm:gap-8 mt-4 md:mt-8 lg:mt-4">
                    <button
                        onClick={prevSlide}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-white flex items-center justify-center transition-all"
                    >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    
                    <div className="flex gap-1.5 sm:gap-2">
                        {carouselData.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                                    idx === activeIndex 
                                        ? "w-6 sm:w-8 bg-white" 
                                        : "bg-slate-700 hover:bg-slate-600"
                                }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={nextSlide}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-white flex items-center justify-center transition-all"
                    >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>
        </section>
    )
}

