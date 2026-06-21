import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
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
        title: "Scientific Artifacts & Models",
        headline: "Computational Models & Tools",
        description: "Access simulation parameters, dataset pipelines, software packages, and machine learning models created during research.",
        image: "/model.png",
        icon: Brain,
        color: "text-rose-500",
        href: "/models",
        stats: [
            { label: "Scope", value: "Multi-Field" },
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
    const data = getCarouselData(stats)

    const getColorTheme = (colorText: string) => {
        if (colorText.includes('rose')) return {
            shadow: 'shadow-rose-500 hover:shadow-rose-500',
            gradient: 'from-rose-500/10',
            iconBg: 'bg-rose-500/10',
            iconText: 'text-rose-500',
            arrowHover: 'group-hover:bg-rose-500 group-hover:border-rose-500',
            titleText: 'text-rose-500/80',
            headlineHover: 'group-hover:text-rose-500',
            pillBg: 'bg-rose-500/5 dark:bg-rose-500/10',
            pillText: 'text-rose-500',
        }
        if (colorText.includes('emerald')) return {
            shadow: 'shadow-emerald-500 hover:shadow-emerald-500',
            gradient: 'from-emerald-500/10',
            iconBg: 'bg-emerald-500/10',
            iconText: 'text-emerald-500',
            arrowHover: 'group-hover:bg-emerald-500 group-hover:border-emerald-500',
            titleText: 'text-emerald-500/80',
            headlineHover: 'group-hover:text-emerald-500',
            pillBg: 'bg-emerald-500/5 dark:bg-emerald-500/10',
            pillText: 'text-emerald-500',
        }
        if (colorText.includes('purple')) return {
            shadow: 'shadow-purple-500 hover:shadow-purple-500',
            gradient: 'from-purple-500/10',
            iconBg: 'bg-purple-500/10',
            iconText: 'text-purple-500',
            arrowHover: 'group-hover:bg-purple-500 group-hover:border-purple-500',
            titleText: 'text-purple-500/80',
            headlineHover: 'group-hover:text-purple-500',
            pillBg: 'bg-purple-500/5 dark:bg-purple-500/10',
            pillText: 'text-purple-500',
        }
        if (colorText.includes('blue')) return {
            shadow: 'shadow-blue-500 hover:shadow-blue-500',
            gradient: 'from-blue-500/10',
            iconBg: 'bg-blue-500/10',
            iconText: 'text-blue-500',
            arrowHover: 'group-hover:bg-blue-500 group-hover:border-blue-500',
            titleText: 'text-blue-500/80',
            headlineHover: 'group-hover:text-blue-500',
            pillBg: 'bg-blue-500/5 dark:bg-blue-500/10',
            pillText: 'text-blue-500',
        }
        if (colorText.includes('amber')) return {
            shadow: 'shadow-amber-500 hover:shadow-amber-500',
            gradient: 'from-amber-500/10',
            iconBg: 'bg-amber-500/10',
            iconText: 'text-amber-500',
            arrowHover: 'group-hover:bg-amber-500 group-hover:border-amber-500',
            titleText: 'text-amber-500/80',
            headlineHover: 'group-hover:text-amber-500',
            pillBg: 'bg-amber-500/5 dark:bg-amber-500/10',
            pillText: 'text-amber-500',
        }
        // default primary
        return {
            shadow: 'shadow-primary hover:shadow-primary',
            gradient: 'from-primary/10',
            iconBg: 'bg-primary/10',
            iconText: 'text-primary',
            arrowHover: 'group-hover:bg-primary group-hover:border-primary',
            titleText: 'text-primary/80',
            headlineHover: 'group-hover:text-primary',
            pillBg: 'bg-primary/5 dark:bg-primary/10',
            pillText: 'text-primary',
        }
    }

    return (
        <section className="relative py-16 md:py-24 bg-slate-50/50 dark:bg-background overflow-hidden border-t border-border/40">
            <div className="container mx-auto px-4 relative z-10 max-w-7xl">
                {/* Header Section */}
                <div className="text-center mb-12 md:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-muted/80 backdrop-blur-sm border border-white/50 dark:border-border text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-4 shadow-sm"
                    >
                        <Globe className="w-3 h-3 text-primary" />
                        Research Impact
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4"
                    >
                        Pioneering the future of <br className="hidden md:block" />
                        Scientific Discovery
                    </motion.h2>
                    <motion.p
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         transition={{ delay: 0.2 }}
                         className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed px-4"
                    >
                        Driving distinct contributions to global knowledge through rigorous research, open collaboration, and reproducible methodologies.
                    </motion.p>
                </div>

                {/* Bento Grid Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {data.map((item, index) => {
                        // Create spanning logic for Bento box: first item spans 2 columns on lg
                        const isLarge = index === 0 
                        const gridItemClass = isLarge 
                            ? "md:col-span-2 lg:col-span-2" 
                            : "col-span-1"
                        
                        const theme = getColorTheme(item.color)

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`group relative bg-white/60 dark:bg-card/40 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-lg/20 ${theme.shadow} hover:shadow-xl/30 hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between overflow-hidden ${gridItemClass}`}
                            >
                                {/* Permanent subtle background gradient glow */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} to-transparent pointer-events-none`} />

                                <div className="relative z-10 mb-8">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className={`w-12 h-12 rounded-2xl ${theme.iconBg} backdrop-blur-sm flex items-center justify-center`}>
                                            <item.icon className={`w-6 h-6 ${theme.iconText}`} />
                                        </div>
                                        <Link href={item.href}>
                                            <div className={`w-10 h-10 rounded-full bg-white/80 dark:bg-muted/50 backdrop-blur-sm border border-white/50 dark:border-border text-foreground flex items-center justify-center ${theme.arrowHover} group-hover:text-white transition-all duration-300 transform group-hover:scale-110 group-hover:-rotate-45 shrink-0 shadow-sm`}>
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </Link>
                                    </div>
                                    
                                    <div className="flex flex-col gap-1.5 mb-3">
                                        <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${theme.titleText}`}>
                                            {item.title}
                                        </span>
                                        <h3 className={`text-xl sm:text-2xl font-bold text-foreground ${theme.headlineHover} transition-colors`}>
                                            {item.headline}
                                        </h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mt-2">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Stats as compact inline pills */}
                                <div className="flex flex-wrap items-center gap-2 mt-auto pt-4 relative z-10">
                                    {item.stats.map((stat, idx) => (
                                        <span
                                            key={idx}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${theme.pillBg} text-xs font-semibold text-foreground/80 tracking-wide`}
                                        >
                                            <span className={`${theme.pillText} font-bold`}>{stat.value}</span>
                                            <span className="text-muted-foreground font-medium">{stat.label}</span>
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

