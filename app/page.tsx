import { BookOpen, Zap, Microscope, TrendingUp, Github, BarChart3 } from "lucide-react"
import { getRecentThesesForDisplay, getPublishedThesesForDisplay } from "@/lib/data/theses-real"
import { HomeContent } from "@/components/home-content"
import { getCurrentUser, User } from "@/lib/auth"
import HomePageWrapper from "@/components/HomePageWrapper"
import { getShowcaseStats, ShowcaseStats } from "@/app/actions/stats"
import { Thesis } from "@/lib/data/theses"
import { getAllProjects } from "@/lib/db/projects"
import { getAllPublications } from "@/lib/db/publications"


export const revalidate = 0 // Disable cache for development

export default async function Home() {
  let allTheses: Thesis[] = []
  let recentTheses: Thesis[] = []
  let allProjects: any[] = []
  let allPublications: any[] = []
  let user: User | null = null
  let stats: ShowcaseStats | null = null

  try {
    const [allThesesData, recentThesesData, allProjectsData, allPublicationsData, userData, statsData] = await Promise.all([
      getPublishedThesesForDisplay(),
      getRecentThesesForDisplay(9),
      getAllProjects(),
      getAllPublications(),
      getCurrentUser(),
      getShowcaseStats()
    ])

    allTheses = allThesesData
    recentTheses = recentThesesData
    allProjects = allProjectsData
    allPublications = allPublicationsData
    user = userData
    stats = statsData
  } catch (error) {
    console.error("[v0] Error fetching home data:", error)
    // Fallback - null stats will be handled by components
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
        <HomePageWrapper
            user={user}
            allTheses={allTheses}
            recentTheses={recentTheses}
            allProjects={allProjects}
            allPublications={allPublications}
            stats={stats}
        />
    </div>
  )
}



<div className="bg-white border border-gray-200 rounded-lg w-full flex justify-between">
  <div className="w-1/2">
    details here
  </div>

  <div className="w-1/2 flex justify-between bg-gray-400 rounded-lg border border-white">
    <div className="w-[20%]">
      explorer here
    </div>
    <div className="w-[30%] bg-gray-800 rounded-lg border border-gray-400">
    <div>
      code editor here
    </div>
  </div>
  </div>
</div>