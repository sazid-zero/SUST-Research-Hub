"use client"

import React from "react"
import { motion } from "framer-motion"
import { 
    IconBrandPython, IconBrandGithub, IconBrandReact, 
    IconBrandNextjs, IconBrandTailwind, IconBrandTypescript,
    IconBrandOpenai, IconBrandLinkedin, IconBrandNodejs,
    IconBrandMongodb, IconBrandVercel, IconBrandFramer,
    IconBrandDocker, IconBrandGoogle, IconBrandAws,
    IconDatabase, IconCpu, IconChartBar, IconTerminal,
    IconBrandGolang, IconBrandRust, IconBrandCpp,
    IconBrandDebian, IconBrandGit, IconBrandVscode,
    IconBrandSupabase, IconBrandPrisma, IconBrandFramerMotion
} from "@tabler/icons-react"

const techStacks = [
    { name: "Python", icon: IconBrandPython, color: "text-blue-500" },
    { name: "TensorFlow", icon: IconChartBar, color: "text-orange-600" },
    { name: "React", icon: IconBrandReact, color: "text-cyan-400" },
    { name: "Next.js", icon: IconBrandNextjs, color: "text-slate-900 dark:text-white" },
    { name: "OpenAI", icon: IconBrandOpenai, color: "text-emerald-500" },
    { name: "Tailwind", icon: IconBrandTailwind, color: "text-sky-400" },
    { name: "TypeScript", icon: IconBrandTypescript, color: "text-blue-600" },
    { name: "GitHub", icon: IconBrandGithub, color: "text-slate-900 dark:text-slate-200" },
    { name: "Node.js", icon: IconBrandNodejs, color: "text-green-600" },
    { name: "MongoDB", icon: IconBrandMongodb, color: "text-green-500" },
    { name: "Prisma", icon: IconBrandPrisma, color: "text-indigo-500" },
    { name: "Supabase", icon: IconBrandSupabase, color: "text-emerald-400" },
    { name: "Docker", icon: IconBrandDocker, color: "text-blue-500" },
    { name: "Google Cloud", icon: IconBrandGoogle, color: "text-blue-400" },
    { name: "AWS", icon: IconBrandAws, color: "text-orange-400" },
    { name: "Go", icon: IconBrandGolang, color: "text-cyan-500" },
    { name: "Rust", icon: IconBrandRust, color: "text-orange-700" },
    { name: "C++", icon: IconBrandCpp, color: "text-blue-700" },
    { name: "Git", icon: IconBrandGit, color: "text-orange-600" },
    { name: "VS Code", icon: IconBrandVscode, color: "text-blue-500" },
    { name: "PostgreSQL", icon: IconDatabase, color: "text-blue-400" },
    { name: "Framer", icon: IconBrandFramer, color: "text-purple-500" },
    { name: "Terminal", icon: IconTerminal, color: "text-slate-700 dark:text-slate-300" },
    { name: "Compute", icon: IconCpu, color: "text-rose-500" },
    { name: "Debian", icon: IconBrandDebian, color: "text-rose-600" },
    { name: "Vercel", icon: IconBrandVercel, color: "text-slate-900 dark:text-white" },
]

const TechCard = ({ tech, size = "sm", rotate = 0 }: { tech: any, size?: "sm" | "lg", rotate?: number }) => {
    const sizeClasses = size === "sm" ? "w-14 h-14 sm:w-16 sm:h-16" : "w-30 h-30 sm:w-34 sm:h-34"
    const iconSizes = size === "sm" ? "w-6 h-6 sm:w-7 sm:h-7" : "w-10 h-10 sm:w-14 sm:h-14"
    const textSizes = size === "sm" ? "text-[6px] sm:text-[7px]" : "text-[8px] sm:text-[9px]"

    return (
        <div 
            className="shrink-0 group relative"
            style={{ rotate: `${rotate}deg` }}
        >
            <div className={`${sizeClasses} rounded-2xl bg-white dark:bg-slate-900 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] dark:shadow-none border border-slate-200/80 dark:border-slate-800/80 flex flex-col items-center justify-center transition-all duration-500 overflow-hidden group-hover:border-primary/40 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-primary/5`}>
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <tech.icon className={`${iconSizes} ${tech.color} group-hover:scale-110 transition-transform duration-500 ease-out`} />
                <span className={`mt-2 ${textSizes} font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors text-center px-2`}>
                    {tech.name}
                </span>
            </div>
            {/* Subtle Glow on Hover */}
            <div className={`absolute -inset-1 bg-primary/5 rounded-3xl blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
        </div>
    )
}

const BentoStack = ({ items, type }: { items: any[], type: 'A' | 'B' | 'C' | 'D' }) => {
    // All patterns are precisely 4 rows high (sm=1, lg=2)
    // 4 * sm (64px) + 3 * gap (8px) = 256 + 24 = 280px Standard Block Height
    return (
        <div className="flex shrink-0 gap-2">
            {type === 'A' && (
                <>
                    <div className="flex flex-col gap-2">
                        <TechCard tech={items[0]} size="lg" rotate={-0.1} />
                        <TechCard tech={items[1]} size="sm" rotate={0.3} />
                        <TechCard tech={items[2]} size="sm" rotate={-0.2} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <TechCard tech={items[3]} size="sm" rotate={0.4} />
                        <TechCard tech={items[4]} size="sm" rotate={-0.5} />
                        <TechCard tech={items[5]} size="lg" rotate={0.1} />
                    </div>
                </>
            )}
            {type === 'B' && (
                <>
                    <div className="flex flex-col gap-2">
                        <TechCard tech={items[0]} size="sm" rotate={-0.4} />
                        <TechCard tech={items[1]} size="lg" rotate={0.2} />
                        <TechCard tech={items[2]} size="sm" rotate={0.3} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <TechCard tech={items[3]} size="lg" rotate={-0.1} />
                        <TechCard tech={items[4]} size="sm" rotate={-0.2} />
                        <TechCard tech={items[5]} size="sm" rotate={0.4} />
                    </div>
                </>
            )}
            {type === 'C' && (
                <>
                    <div className="flex flex-col gap-2">
                        <TechCard tech={items[0]} size="lg" rotate={0.1} />
                        <TechCard tech={items[1]} size="lg" rotate={-0.2} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <TechCard tech={items[2]} size="sm" rotate={0.3} />
                        <TechCard tech={items[3]} size="sm" rotate={-0.4} />
                        <TechCard tech={items[4]} size="sm" rotate={0.2} />
                        <TechCard tech={items[5]} size="sm" rotate={-0.1} />
                    </div>
                </>
            )}
            {type === 'D' && (
                <>
                    <div className="flex flex-col gap-2">
                        <TechCard tech={items[0]} size="sm" rotate={0.2} />
                        <TechCard tech={items[1]} size="sm" rotate={-0.3} />
                        <TechCard tech={items[2]} size="lg" rotate={0.1} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <TechCard tech={items[3]} size="sm" rotate={-0.4} />
                        <TechCard tech={items[4]} size="lg" rotate={0.2} />
                        <TechCard tech={items[5]} size="sm" rotate={0.3} />
                    </div>
                </>
            )}
        </div>
    )
}

const generateBentoMarquee = (techs: any[]) => {
    // We need 6 items per block now for the 4-row patterns
    const shuffled = [...techs, ...techs]
    const blocks: any[] = []
    let i = 0
    const patterns: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D']
    
    while (i < shuffled.length - 6) {
        const type = patterns[blocks.length % patterns.length]
        blocks.push({ 
            type, 
            items: shuffled.slice(i, i + 6) 
        })
        i += 6
    }
    return blocks
}

const marqueeBlocks = generateBentoMarquee(techStacks)

const MarqueeRow = ({ blocks, speed = 25 }: { blocks: any[], speed?: number }) => {
    return (
        <div className="flex overflow-hidden gap-4 sm:gap-6 select-none">
            <motion.div
                initial={{ x: 0 }}
                animate={{ x: "-50%" }}
                transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
                className="flex items-center gap-4 sm:gap-6 min-w-max py-12 will-change-transform transform-gpu"
            >
                {[...blocks, ...blocks].map((block, idx) => (
                    <BentoStack key={idx} items={block.items} type={block.type} />
                ))}
            </motion.div>
        </div>
    )
}

export function TechStackShowcase() {
    return (
        <section className="relative pb-10 sm:pb-12 lg:pb-16 mb-12 pt-20 overflow-hidden border-y border-slate-200 dark:border-b-slate-800 dark:border-t-0 bg-white dark:bg-slate-950">
            {/* Background Layering */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Visible Slate Gradient */}
                <div className="absolute inset-0 bg-linear-to-b from-slate-100 via-white to-slate-100 dark:from-transparent dark:via-transparent dark:to-transparent" />
                
                {/* Refined Dot Pattern */}
                <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.2]" 
                    style={{ backgroundImage: `radial-gradient(circle at center, #94a3b8 0.5px, transparent 0.5px)`, backgroundSize: '32px 32px' }} 
                />

                {/* Decorative Glows */}
                <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px] -translate-y-1/2" />
                <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px] -translate-y-1/2" />
            </div>

            <div className="max-w-8xl mx-auto px-4 relative z-10">
                <div className="text-center mb-12 sm:mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/60 dark:bg-zinc-800/40 border border-slate-300 dark:border-zinc-700/50 backdrop-blur-sm text-slate-600 dark:text-zinc-300 text-[10px] font-bold uppercase tracking-widest mb-4"
                    >
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Research Infrastructure
                    </motion.div>
                    
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight"
                    >
                        Built upon <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 font-black">Robust Standards</span>
                    </motion.h2>
                    <p className="text-slate-600 dark:text-zinc-400 max-w-xl mx-auto text-base sm:text-lg">
                        Leveraging industry-standard technologies to support scalable research, data analysis, and reproducible science.
                    </p>
                </div>

                {/* The Looping Bento Mega-Marquee */}
                <div className="relative">
                    {/* Stronger Shadow Masking */}
                    <div className="absolute inset-y-0 left-0 w-32 sm:w-64 bg-linear-to-r from-slate-100 via-slate-100/40 dark:from-transparent dark:via-transparent to-transparent z-20 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-32 sm:w-64 bg-linear-to-l from-slate-100 via-slate-100/40 dark:from-transparent dark:via-transparent to-transparent z-20 pointer-events-none" />
                    
                    <MarqueeRow blocks={marqueeBlocks} speed={100} />
                </div>

                
            </div>
        </section>
    )
}
