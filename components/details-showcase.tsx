"use client"


import ProjectDetailContent from "@/components/project-detail-content"
import {mockProjects} from "@/components/project_mock/[id]/page"
import {AnimatedParticles} from "@/components/repository-showcase";


export function DetailsShowcase() {


    return (
        <section className="bg-background py-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen">
            <AnimatedParticles/>
            <div className="relative z-10 container mx-auto text-center">

                <div className="lg:grid lg:grid-cols-5 lg:gap-16 items-center">
                    <div className="lg:col-span-2 mb-12 lg:mb-0">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl mb-2">
                            A Hub for Academic
                        </h2>
                        <h2 className="text-3xl font-bold tracking-tight text-primary font-serif sm:text-4xl">
                            Excellence
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Discover a centralized platform where groundbreaking research from Shahjalal University of Science and Technology comes to life. Explore a diverse range of studies, connect with innovators, and contribute to a thriving academic community.
                        </p>
                    </div>
                    <div className="lg:col-span-3 flex justify-center" style={{ perspective: "1200px" }}>
                        <div className="w-full max-w-3xl rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.6),0_0_40px_rgba(16,185,129,0.4)]"
                             style={{ transformStyle: "preserve-3d" }}
                            >

                            {/* Browser Frame */}
                            <div className="relative h-110 rounded-xl border-2 border-border/20 bg-background/80 backdrop-blur-md overflow-hidden"
                                 style={{
                                     transformStyle: "preserve-3d",
                                 }}
                            >
                                {/* Browser Chrome */}
                                <div className="border-b border-border/20 px-4 py-2 flex items-center gap-2 bg-muted/50">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="px-4 pl-0 mr-12 py-1.5 rounded-md bg-background/70 text-xs text-muted-foreground flex-1 ">
                                        sust-research-hub/project
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="absolute inset-0 z-50 pointer-events-auto"></div>
                                <div className="h-[600px] overflow-hidden bg-background">
                                    <div className="scale-[0.55] origin-top-left w-[182%] h-[182%]">
                                        <ProjectDetailContent project={mockProjects[0]} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

