"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"

export default function GlobalSmoothScroll({ children }) {
    const container = useRef(null)

    useGSAP(() => {
        container.current.style.willChange = "scroll-position"

    })

    return <div ref={container}>{children}</div>
}