import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
    ArrowRight,
    Globe
} from "lucide-react"

import { ShowcaseStats } from "@/app/actions/stats"

const getCarouselData = (stats: ShowcaseStats | null) => [
    {
        id: "projects",
        title: "Active Research Initiatives",
        headline: "Projects",
        description: "Explore ongoing collaborative projects across multiple departments, featuring live updates and funding status.",
        theme: {
            bg: "bg-[#fdf6ec] dark:bg-[#fdf6ec]/10",
            pillBg: "bg-white/80 dark:bg-black/30",
            pillDot: "bg-[#d98b53]",
        },
        href: "/projects",
        stats: [
            { label: "Domains", value: "15+" },
            { label: "Projects", value: stats?.projects.count?.toString() || "45" },
            { label: "Partners", value: "18" },
        ]
    },
    {
        id: "papers",
        title: "Scholarly Publications",
        headline: "Papers & Articles",
        description: "Peer-reviewed journal articles and conference papers published by our faculty and students in top-tier venues.",
        theme: {
            bg: "bg-[#f5f5f5] dark:bg-[#f5f5f5]/10",
            pillBg: "bg-white/80 dark:bg-black/30",
            pillDot: "bg-[#1a1a1a]",
        },
        href: "/papers",
        stats: [
            { label: "Papers", value: stats?.publications.count?.toString() || "850+" },
            { label: "h-index", value: "42" },
            { label: "Reads", value: stats ? (stats.publications.count * 180).toLocaleString() : "150k" },
        ]
    },
    {
        id: "theses",
        title: "Academic Theses Archive",
        headline: "Theses",
        description: "A comprehensive collection of undergraduate and postgraduate dissertations, representing years of academic excellence.",
        theme: {
            bg: "bg-[#f0eaff] dark:bg-[#f0eaff]/10",
            pillBg: "bg-white/80 dark:bg-black/30",
            pillDot: "bg-[#8b5cf6]",
        },
        href: "/theses",
        stats: [
            { label: "Theses", value: stats?.theses.count?.toString() || "300+" },
            { label: "Depts.", value: "12" },
            { label: "Citations", value: stats ? (stats.theses.count * 40).toLocaleString() : "12k" },
        ]
    },
    {
        id: "models",
        title: "Scientific Artifacts",
        headline: "Datasets & Models",
        description: "Access simulation parameters, dataset pipelines, software packages, and machine learning models created during research.",
        theme: {
            bg: "bg-[#eef5ed] dark:bg-[#eef5ed]/10",
            pillBg: "bg-white/80 dark:bg-black/30",
            pillDot: "bg-[#4ade80]",
        },
        href: "/models",
        stats: [
            { label: "Scope", value: "Multi-Field" },
            { label: "Models", value: stats?.models.count?.toString() || "12+" },
            { label: "Downloads", value: stats ? (stats.models.count * 120).toLocaleString() : "8.5k" },
        ]
    }
]

const CardGraphic = ({ id }: { id: string }) => {
    if (id === 'projects') return (
        <div className="absolute right-0 top-0 bottom-0 w-[45%] overflow-hidden pointer-events-none opacity-90 dark:opacity-40">
            <div className="absolute right-[5%] top-[5%] w-[55%] h-[35%] bg-gradient-to-r from-[#ebd2b0] to-[#e4bc93] rounded-[1.5rem] md:rounded-[2rem] shadow-sm rotate-45" style={{ transformOrigin: 'center', transform: 'rotate(45deg) translate(20%, -10%)' }} />
            <div className="absolute right-[20%] top-[35%] w-[55%] h-[35%] bg-gradient-to-r from-[#ebd2b0] to-[#e4bc93] rounded-[1.5rem] md:rounded-[2rem] shadow-sm rotate-45" style={{ transformOrigin: 'center', transform: 'rotate(45deg) translate(0%, 0%)' }} />
            <div className="absolute right-[5%] top-[65%] w-[55%] h-[35%] bg-gradient-to-r from-[#ebd2b0] to-[#e4bc93] rounded-[1.5rem] md:rounded-[2rem] shadow-sm rotate-45" style={{ transformOrigin: 'center', transform: 'rotate(45deg) translate(-20%, 10%)' }} />
        </div>
    );
    if (id === 'papers') return (
        <div className="absolute right-0 top-0 bottom-0 w-[45%] overflow-hidden pointer-events-none opacity-90 dark:opacity-40">
            <div className="absolute right-[15%] top-[15%] w-[45%] aspect-square bg-gradient-to-b from-[#e2e2e2] to-[#c8c8c8] rounded-full shadow-sm" />
            <div className="absolute right-[-15%] bottom-[5%] w-[55%] aspect-square bg-gradient-to-t from-[#e2e2e2] to-[#c8c8c8] rounded-tl-full shadow-sm" />
            <div className="absolute right-[30%] bottom-[35%] w-[35%] aspect-[2/1] bg-gradient-to-b from-[#e2e2e2] to-[#c8c8c8] rounded-t-full shadow-sm" />
        </div>
    );
    if (id === 'theses') return (
        <div className="absolute right-0 top-0 bottom-0 w-[45%] overflow-hidden pointer-events-none opacity-90 dark:opacity-40 flex items-center justify-center">
            <div className="relative w-full h-full">
                <div className="absolute right-[-15%] top-1/2 -translate-y-1/2 w-[110%] aspect-square rounded-full bg-gradient-to-br from-[#dfd4f5] to-[#c8b5ed] blur-[1px] opacity-70" />
                <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[45%] aspect-square rounded-full bg-[#b89ded] blur-[1px] opacity-90 shadow-sm" />
                <div className="absolute right-[25%] top-1/2 -translate-y-1/2 w-[15%] aspect-square rounded-full bg-[#f0eaff] opacity-90 shadow-sm" />
            </div>
        </div>
    );
    if (id === 'models') return (
        <div className="absolute right-0 top-0 bottom-0 w-[45%] overflow-hidden pointer-events-none opacity-90 dark:opacity-40">
            <div className="absolute right-[15%] top-[10%] w-[40%] aspect-square bg-gradient-to-b from-[#c2dfc6] to-[#a2ccaa] rounded-[1rem] md:rounded-[1.5rem] shadow-sm" />
            <div className="absolute right-[45%] top-[40%] w-[40%] aspect-square bg-gradient-to-b from-[#c2dfc6] to-[#a2ccaa] rounded-[1rem] md:rounded-[1.5rem] shadow-sm" />
            <div className="absolute right-[15%] top-[70%] w-[40%] aspect-square bg-gradient-to-b from-[#c2dfc6] to-[#a2ccaa] rounded-[1rem] md:rounded-[1.5rem] shadow-sm" />
        </div>
    );
    return null;
}

export function RepositoryShowcase({ stats }: { stats: ShowcaseStats | null }) {
    const data = getCarouselData(stats)

    return (
        <section className="relative py-16 md:py-24 bg-background overflow-hidden border-t border-border/40">
            <div className="container mx-auto px-4 relative z-10 max-w-7xl">
                {/* Header Section */}
                <div className="text-center mb-12 md:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/80 backdrop-blur-sm border border-border text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-4 shadow-sm"
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

                {/* Grid Area - 4 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {data.map((item, index) => {
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`group relative rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between overflow-hidden ${item.theme.bg} transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md border border-black/5 dark:border-white/5 min-h-[360px]`}
                            >
                                <CardGraphic id={item.id} />

                                <div className="relative z-10">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${item.theme.pillBg} text-xs font-medium text-foreground mb-6 md:mb-8 backdrop-blur-sm`}>
                                        <div className={`w-2 h-2 rounded-full ${item.theme.pillDot}`} />
                                        {item.title}
                                    </div>
                                    
                                    <h3 className="text-2xl sm:text-3xl font-semibold text-foreground mb-3 tracking-tight">
                                        {item.headline}
                                    </h3>
                                    
                                    <p className="text-foreground/70 text-sm md:text-base leading-relaxed max-w-[70%]">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Stats and Link */}
                                <div className="relative z-10 mt-10 md:mt-12 flex flex-col items-start gap-5">
                                    <Link href={item.href} className="inline-flex items-center gap-2 text-sm font-semibold text-foreground group/link mt-auto">
                                        <span className="border-b border-foreground/30 group-hover/link:border-foreground transition-colors pb-0.5">
                                            Explore {item.headline.split(' ')[0]}
                                        </span>
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                                    </Link>
                                    
                                    <div className="flex flex-wrap items-center gap-2">
                                        {item.stats.map((stat, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/40 dark:bg-black/20 text-xs font-medium text-foreground/80 backdrop-blur-sm"
                                            >
                                                <span className="font-bold text-foreground">{stat.value}</span>
                                                <span className="text-foreground/70">{stat.label}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
