"use client"

import { GlobalNavbar } from "@/components/global-navbar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Zap, Search, X, ArrowUpDown } from "lucide-react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

// Mock thesis data from seed scripts
const MOCK_THESES = [
  {
    id: "1",
    title: "Green Chemistry: Environmentally Benign Synthesis Methods",
    authors: [
      { id: "s1", full_name: "Mahmud Hassan", student_id: "1" },
      { id: "s2", full_name: "Ayesha Khan", student_id: "2" },
    ],
    department: "Chemistry",
    year: 2025,
    abstract:
      "The chemical industry remains one of the largest contributors to environmental pollution through the extensive use of hazardous reagents, volatile organic solvents, and energy-intensive processes that generate substantial toxic waste. This thesis presents a comprehensive investigation into environmentally benign synthetic methods.",
    keywords: ["green chemistry", "sustainable synthesis", "environmental chemistry"],
    views: 1156,
    downloads: 423,
    supervisor: "Dr. Ahmed Hassan",
  },
  {
    id: "2",
    title: "Condensed Matter Physics: Superconductivity in Novel Materials",
    authors: [
      { id: "s3", full_name: "Sabbir Rahman", student_id: "3" },
      { id: "s4", full_name: "Rahman Hossain", student_id: "4" },
    ],
    department: "Physics",
    year: 2025,
    abstract:
      "Investigation of high-temperature superconductivity in newly discovered materials. This work explores the quantum mechanical properties and potential applications of these materials in next-generation computing and energy systems.",
    keywords: ["condensed matter", "superconductivity", "materials science"],
    views: 789,
    downloads: 267,
    supervisor: "Prof. Karim Uddin",
  },
  {
    id: "3",
    title: "Particle Physics: Higgs Boson Decay Channels Analysis",
    authors: [
      { id: "s5", full_name: "Rahman Hossain", student_id: "5" },
      { id: "s6", full_name: "Sabbir Rahman", student_id: "6" },
    ],
    department: "Physics",
    year: 2025,
    abstract:
      "Detailed analysis of Higgs boson decay channels using Large Hadron Collider data. This research contributes to our understanding of fundamental particle physics and the Standard Model.",
    keywords: ["particle physics", "Higgs boson", "LHC"],
    views: 892,
    downloads: 345,
    supervisor: "Dr. Fatima Ahmed",
  },
  {
    id: "4",
    title: "Machine Learning for Medical Image Classification",
    authors: [
      { id: "s7", full_name: "Ayesha Khan", student_id: "7" },
      { id: "s8", full_name: "Sarah Ibrahim", student_id: "8" },
    ],
    department: "Computer Science & Engineering",
    year: 2024,
    abstract:
      "Development of deep learning models for automated medical image analysis. The system achieves 95% accuracy in detecting abnormalities across multiple imaging modalities including CT, MRI, and X-ray.",
    keywords: ["machine learning", "medical imaging", "deep learning"],
    views: 2341,
    downloads: 567,
    supervisor: "Dr. Mohamed Khaled",
  },
  {
    id: "5",
    title: "Natural Language Processing: Sentiment Analysis in Arabic",
    authors: [
      { id: "s9", full_name: "Fatima Ahmed", student_id: "9" },
      { id: "s10", full_name: "Noor Al-Rashid", student_id: "10" },
    ],
    department: "Computer Science & Engineering",
    year: 2024,
    abstract:
      "Advanced NLP techniques for understanding sentiment in Arabic text across social media platforms. This work addresses the unique linguistic challenges of the Arabic language.",
    keywords: ["NLP", "sentiment analysis", "Arabic"],
    views: 1534,
    downloads: 423,
    supervisor: "Dr. Laila Hassan",
  },
  {
    id: "6",
    title: "Biomedical Engineering: Artificial Organ Development",
    authors: [
      { id: "s11", full_name: "Omar Al-Sayed", student_id: "11" },
      { id: "s12", full_name: "Sarah Ibrahim", student_id: "12" },
    ],
    department: "Biomedical Engineering",
    year: 2024,
    abstract:
      "Research on 3D bioprinting and tissue engineering for creating functional artificial organs. This breakthrough technology has potential applications in transplantation and disease modeling.",
    keywords: ["bioengineering", "tissue engineering", "3D printing"],
    views: 2156,
    downloads: 789,
    supervisor: "Dr. Youssef Ali",
  },
  {
    id: "7",
    title: "Renewable Energy: Solar Cell Efficiency Enhancement",
    authors: [
      { id: "s13", full_name: "Hassan Karim", student_id: "13" },
      { id: "s14", full_name: "Leila Mansour", student_id: "14" },
    ],
    department: "Mechanical Engineering",
    year: 2024,
    abstract:
      "Novel approaches to increase photovoltaic cell efficiency through nanostructure optimization. The proposed design achieves 28% efficiency, a significant improvement over current commercial standards.",
    keywords: ["renewable energy", "solar cells", "nanotechnology"],
    views: 1876,
    downloads: 612,
    supervisor: "Prof. Hassan Khalid",
  },
  {
    id: "8",
    title: "Robotics: Autonomous Navigation in Complex Environments",
    authors: [
      { id: "s15", full_name: "Amira Khalid", student_id: "15" },
      { id: "s16", full_name: "Hassan Karim", student_id: "16" },
    ],
    department: "Mechanical Engineering",
    year: 2024,
    abstract:
      "Development of autonomous robot navigation systems using advanced sensor fusion and AI. Applications include search and rescue, exploration, and industrial automation.",
    keywords: ["robotics", "autonomous systems", "AI"],
    views: 2089,
    downloads: 834,
    supervisor: "Dr. Rashid Al-Mansouri",
  },
  {
    id: "9",
    title: "Environmental Science: Climate Change Impact Assessment",
    authors: [
      { id: "s17", full_name: "Noor Al-Rashid", student_id: "17" },
      { id: "s18", full_name: "Omar Al-Sayed", student_id: "18" },
    ],
    department: "Environmental Science",
    year: 2023,
    abstract:
      "Comprehensive analysis of climate change impacts on regional ecosystems and biodiversity. The research provides data-driven recommendations for mitigation and adaptation strategies.",
    keywords: ["climate change", "environmental impact", "sustainability"],
    views: 3245,
    downloads: 1023,
    supervisor: "Dr. Leila Hassan",
  },
  {
    id: "10",
    title: "Biotechnology: CRISPR Gene Editing Applications",
    authors: [
      { id: "s19", full_name: "Amir Hassan", student_id: "19" },
      { id: "s20", full_name: "Amira Khalid", student_id: "20" },
    ],
    department: "Biotechnology",
    year: 2023,
    abstract:
      "Application of CRISPR-Cas9 technology for treating genetic disorders. This work demonstrates successful correction of disease-causing mutations in laboratory models with potential clinical applications.",
    keywords: ["biotechnology", "CRISPR", "gene therapy"],
    views: 2876,
    downloads: 945,
    supervisor: "Prof. Safiya Ahmed",
  },
]

interface ThesisContentMockProps {
  user?: any
  pageTitle?: string
}

export function ThesisContentMock({ user, pageTitle = "Research Theses" }: ThesisContentMockProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")
  const [selectedYearFrom, setSelectedYearFrom] = useState("All")
  const [selectedYearTo, setSelectedYearTo] = useState("All")
  const [selectedField, setSelectedField] = useState("All Fields")
  const [selectedSupervisor, setSelectedSupervisor] = useState("All Supervisors")
  const [sortBy, setSortBy] = useState("trending")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const departments = ["All Departments", ...new Set(MOCK_THESES.map((t) => t.department))]
  const years = ["All", ...new Set(MOCK_THESES.map((t) => t.year).sort((a, b) => b - a))]
  const fields = ["All Fields", ...new Set(MOCK_THESES.flatMap((t) => t.keywords))]
  const supervisors = ["All Supervisors", ...new Set(MOCK_THESES.map((t) => t.supervisor).filter(Boolean))]

  const filteredTheses = MOCK_THESES.filter((thesis) => {
    const matchesSearch =
      thesis.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thesis.authors?.some((author: any) => author.full_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      thesis.keywords.some((k: string) => k.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesDepartment = selectedDepartment === "All Departments" || thesis.department === selectedDepartment
    const matchesYear =
      (selectedYearFrom === "All" && selectedYearTo === "All") ||
      (thesis.year >= Number.parseInt(selectedYearFrom) && thesis.year <= Number.parseInt(selectedYearTo))
    const matchesField =
      selectedField === "All Fields" ||
      thesis.keywords.some((k: string) => k.toLowerCase().includes(selectedField.toLowerCase()))
    const matchesSupervisor = selectedSupervisor === "All Supervisors" || thesis.supervisor === selectedSupervisor

    return matchesSearch && matchesDepartment && matchesYear && matchesField && matchesSupervisor
  })

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedDepartment("All Departments")
    setSelectedYearFrom("All")
    setSelectedYearTo("All")
    setSelectedField("All Fields")
    setSelectedSupervisor("All Supervisors")
  }

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedDepartment !== "All Departments" ||
    selectedYearFrom !== "All" ||
    selectedYearTo !== "All" ||
    selectedField !== "All Fields" ||
    selectedSupervisor !== "All Supervisors"

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      <GlobalNavbar user={user} />

      <div className="max-w-[83.5rem] mx-auto px-4 lg:px-8 pb-12">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-4">
          <div className="hidden lg:block lg:col-span-1">
            <Card className="border border-border bg-card p-6 sticky top-20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold text-foreground">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-foreground font-medium mb-2 block">Department</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="bg-background border-border text-foreground h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-foreground font-medium mb-2 block">Field</Label>
                  <Select value={selectedField} onValueChange={setSelectedField}>
                    <SelectTrigger className="bg-background border-border text-foreground h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {fields.slice(0, 10).map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-foreground font-medium mb-2 block">Supervisor</Label>
                  <Select value={selectedSupervisor} onValueChange={setSelectedSupervisor}>
                    <SelectTrigger className="bg-background border-border text-foreground h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {supervisors.slice(0, 10).map((sup) => (
                        <SelectItem key={sup} value={sup}>
                          {sup}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-foreground font-medium mb-3 block">Year</Label>
                  <div className="flex gap-4">
                    <div className="flex gap-1 items-center">
                      <p className="text-xs text-muted-foreground mb-1">From</p>
                      <Select value={selectedYearFrom} onValueChange={setSelectedYearFrom}>
                        <SelectTrigger className="bg-background border-border text-foreground h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {years.map((year) => (
                            <SelectItem key={year} value={String(year)}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-1 items-center">
                      <p className="text-xs text-muted-foreground mb-1">To</p>
                      <Select value={selectedYearTo} onValueChange={setSelectedYearTo}>
                        <SelectTrigger className="bg-background border-border text-foreground h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {years.map((year) => (
                            <SelectItem key={year} value={String(year)}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{filteredTheses.length}</span> of{" "}
                    <span className="font-semibold text-foreground">{MOCK_THESES.length}</span>
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground whitespace-nowrap mr-2">
                <p className="font-semibold text-lg">Theses </p>
                {filteredTheses.length}
              </div>
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
                  <Input
                    placeholder="Search theses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border-2 border-border text-sm text-muted-foreground dark:text-foreground dark:text-foreground focus:outline-none focus:border-primary/50 focus:bg-background transition-colors"
                  />
                </div>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44 bg-background border-border h-9 text-xs">
                  <ArrowUpDown className="h-3 w-3 mr-1" />
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border text-xs">
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredTheses.length > 0 ? (
              <motion.div className="space-y-3">
                {filteredTheses.map((thesis, index) => (
                  <motion.div
                    key={thesis.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="border border-border hover:border-primary/50 rounded-lg p-4 transition-all hover:shadow-sm group cursor-pointer">
                      <div className="space-y-3">
                        {/* Title and Meta */}
                        <div>
                          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {thesis.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            By{" "}
                            {thesis.authors?.map((author: any, idx: number) => (
                              <span key={author.id || idx}>
                                <span className="font-medium hover:text-primary transition-colors">
                                  {author.full_name}
                                </span>
                                {idx < thesis.authors.length - 1 && ", "}
                              </span>
                            ))}
                            {" • "}
                            {thesis.department} • {thesis.year}
                          </p>
                        </div>

                        {/* Abstract */}
                        <p className="text-xs text-foreground leading-relaxed line-clamp-2">{thesis.abstract}</p>

                        {/* Keywords */}
                        <div className="flex flex-wrap gap-2">
                          {thesis.keywords.slice(0, 3).map((keyword, idx) => (
                            <Badge key={idx} className="bg-primary/10 text-primary border border-primary/20 text-xs">
                              {keyword}
                            </Badge>
                          ))}
                          {thesis.keywords.length > 3 && (
                            <Badge className="bg-muted text-muted-foreground border border-border text-xs">
                              +{thesis.keywords.length - 3} more
                            </Badge>
                          )}
                        </div>

                        {/* Stats and Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-border">
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              <span>{thesis.views} views</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Zap className="h-4 w-4" />
                              <span>{thesis.downloads} downloads</span>
                            </div>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-border hover:bg-muted bg-transparent w-full sm:w-auto text-xs"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
                            >
                              <Zap className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <Card className="border border-border bg-card p-8 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-sm font-semibold text-foreground mb-1">No theses found</h3>
                <p className="text-xs text-muted-foreground">Try adjusting your search or filters</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
