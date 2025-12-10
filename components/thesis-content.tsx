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
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ThesisContentProps {
  user: any
  theses: any[]
  pageTitle?: string
}

export function ThesisContent({ user, theses, pageTitle = "Research Theses" }: ThesisContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")
  const [selectedYearFrom, setSelectedYearFrom] = useState("All Years")
  const [selectedYearTo, setSelectedYearTo] = useState("All Years")
  const [selectedField, setSelectedField] = useState("All Fields")
  const [selectedSupervisor, setSelectedSupervisor] = useState("All Supervisors")
  const [sortBy, setSortBy] = useState("trending")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const departments = ["All Departments", ...new Set(theses.map((t) => t.department))]
  const years = ["All Years", ...new Set(theses.map((t) => t.year).sort((a, b) => b - a))]
  const fields = ["All Fields", ...new Set(theses.flatMap((t) => t.keywords))]
  const supervisors = ["All Supervisors", ...new Set(theses.map((t) => t.supervisor).filter(Boolean))]

  const filteredTheses = theses.filter((thesis) => {
    const matchesSearch =
      thesis.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thesis.authors?.some((author: any) => author.full_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      thesis.keywords.some((k: string) => k.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesDepartment = selectedDepartment === "All Departments" || thesis.department === selectedDepartment
    const matchesYear =
      (selectedYearFrom === "All Years" && selectedYearTo === "All Years") ||
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
    setSelectedYearFrom("All Years")
    setSelectedYearTo("All Years")
    setSelectedField("All Fields")
    setSelectedSupervisor("All Supervisors")
  }

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedDepartment !== "All Departments" ||
    selectedYearFrom !== "All Years" ||
    selectedYearTo !== "All Years" ||
    selectedField !== "All Fields" ||
    selectedSupervisor !== "All Supervisors"

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      <GlobalNavbar user={user} />

      <div className="lg:mx-22 mx-auto px-4 lg:px-8 pt-6 pb-12 mt-2">
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
                    <SelectTrigger className="bg-background border-border text-foreground h-8 text-sm">
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
                    <SelectTrigger className="bg-background border-border text-foreground h-8 text-sm">
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
                    <SelectTrigger className="bg-background border-border text-foreground h-8 text-sm">
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
                  <Label className="text-xs text-foreground font-medium mb-2 block">Year From</Label>
                  <Select value={selectedYearFrom} onValueChange={setSelectedYearFrom}>
                    <SelectTrigger className="bg-background border-border text-foreground h-8 text-sm">
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

                <div>
                  <Label className="text-xs text-foreground font-medium mb-2 block">Year To</Label>
                  <Select value={selectedYearTo} onValueChange={setSelectedYearTo}>
                    <SelectTrigger className="bg-background border-border text-foreground h-8 text-sm">
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

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{filteredTheses.length}</span> of{" "}
                    <span className="font-semibold text-foreground">{theses.length}</span>
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground whitespace-nowrap mr-2">
                    <p className="font-semibold text-lg">Theses </p>{filteredTheses.length}
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
                          <Link href={`/thesis/${thesis.id}`}>
                            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                              {thesis.title}
                            </h3>
                          </Link>
                          <p className="text-xs text-muted-foreground mt-1">
                            By{" "}
                            {thesis.authors?.map((author: any, idx: number) => (
                              <span key={author.id || idx}>
                                <Link
                                  href={`/student/profile/${author.student_id}`}
                                  className="font-medium hover:text-primary transition-colors"
                                >
                                  {author.full_name}
                                </Link>
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
                            <Link href={`/thesis/${thesis.id}`} className="flex-1 sm:flex-none">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-border hover:bg-muted bg-transparent w-full sm:w-auto text-xs"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </Link>
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
