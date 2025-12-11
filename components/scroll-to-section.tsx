export const scrollToExplore = (e?: React.MouseEvent<HTMLAnchorElement>) => {
    if (e) e.preventDefault()

    const exploreSection = document.getElementById("explore")

    if (exploreSection) {
        exploreSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
        })

        // Update URL without page reload
        window.history.pushState(null, "", "#explore")
    }
}

// More reusable scroll functions
export const scrollToSection = (sectionId: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    const section = document.getElementById(sectionId)
    if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" })
        window.history.pushState(null, "", `#${sectionId}`)
    }
}