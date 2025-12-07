import { BookOpen, Zap, Microscope, TrendingUp, Github, BarChart3 } from "lucide-react"
import { getRecentThesesForDisplay, getPublishedThesesForDisplay } from "@/lib/data/theses-real"
import { HomeContent } from "@/components/home-content"
import { getCurrentUser } from "@/lib/auth"

export const revalidate = 3600 // Revalidate every hour

export default async function Home() {
  let allTheses = []
  let recentTheses = []
  let user = null

  try {
    const [allThesesData, recentThesesData, userData] = await Promise.all([
      getPublishedThesesForDisplay(),
      getRecentThesesForDisplay(9),
      getCurrentUser(),
    ])

    allTheses = allThesesData
    recentTheses = recentThesesData
    user = userData
  } catch (error) {
    console.error("[v0] Error fetching theses:", error)
    // Fallback - empty arrays if database fails
  }

  const researchCategories = [
    { id: "all", label: "All Fields", icon: BookOpen, count: 247 },
    { id: "ai", label: "Artificial Intelligence", icon: Zap, count: 68 },
    { id: "biotech", label: "Biotechnology", icon: Microscope, count: 54 },
    { id: "physics", label: "Physics and Mathematics", icon: TrendingUp, count: 38 },
    { id: "chemistry", label: "Chemistry and Material Science", icon: Microscope, count: 45 },
    { id: "environmental", label: "Environmental Science", icon: TrendingUp, count: 52 },
    { id: "robotics", label: "Robotics and Automation", icon: Github, count: 61 },
    { id: "economics", label: "Economics", icon: BarChart3, count: 43 },
    { id: "agriculture", label: "Agriculture and Food Technology", icon: Microscope, count: 37 },
    { id: "cs", label: "Computer Science", icon: Github, count: 83 },
  ]

  const navItems = [
    { label: "Browse", href: "/browse" },
    { label: "Features", href: "/#features" },
    { label: "About", href: "/#about" },
    { label: "Help", href: "/help" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <HomeContent user={user} allTheses={allTheses} recentTheses={recentTheses} />
    </div>
  )
}
