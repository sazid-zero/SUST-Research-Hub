"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function HomeSmoothScroll({ children, startCarousel, stopCarousel }) {
    const container = useRef(null)

    useGSAP(() => {
        const heroSection = document.querySelector(".hero-section")
        if (!heroSection) return

        ScrollTrigger.create({
            trigger: document.body,
            start: () => window.innerHeight * 0.3,
            end: () => window.innerHeight,
            scrub: 1,
            onEnter: stopCarousel,
            onEnterBack: stopCarousel,
            onLeaveBack: startCarousel,
            animation: gsap.fromTo(heroSection,
                { scale: 1, opacity: 1 },
                { scale: 0.85, opacity: 0 }
            )
        })
    })

    return <div ref={container}>{children}</div>
}