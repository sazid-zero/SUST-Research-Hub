"use client"

import { useEffect, useRef, useState } from "react"
import SmoothScroll from "@/components/SmoothScroll"
import {HomeContent} from "@/components/home-content"
import { ShowcaseStats } from "@/app/actions/stats"

export default function HomePageWrapper({ user, allTheses, recentTheses, allProjects, allPublications, stats }: { 
    user: any, 
    allTheses: any, 
    recentTheses: any, 
    allProjects: any[],
    allPublications: any[],
    stats: ShowcaseStats | null 
}) {
    const [currentRecentIndex, setCurrentRecentIndex] = useState(0)
    const carouselRef = useRef<NodeJS.Timeout | null>(null)

    const startCarousel = () => {
        if (!carouselRef.current) {
            carouselRef.current = setInterval(() => {
                setCurrentRecentIndex(prev => (prev + 1) % 3)
            }, 5000)
        }
    }

    const stopCarousel = () => {
        if (carouselRef.current) {
            clearInterval(carouselRef.current)
            carouselRef.current = null
        }
    }

    useEffect(() => {
        startCarousel()
        return () => stopCarousel()
    }, [])

    return (
        <SmoothScroll
            startCarousel={startCarousel}
            stopCarousel={stopCarousel}
        >
            <HomeContent
                user={user}
                allTheses={allTheses}
                recentTheses={recentTheses}
                allProjects={allProjects}
                allPublications={allPublications}
                currentRecentIndex={currentRecentIndex}
                stats={stats}
            />
        </SmoothScroll>
    )
}