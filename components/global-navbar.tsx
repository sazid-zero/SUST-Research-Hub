"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {BookOpen, Menu, X, Search, Moon, Sun, FileText, Database, Folder} from "lucide-react"
import { IconCube } from "@tabler/icons-react"
import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { AuthButton } from "@/components/auth-button"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import type { User } from "@supabase/supabase-js"

interface GlobalNavbarProps {
    user?: User | null
}

interface SearchResult {
    id: number | string
    title: string
    type: 'thesis' | 'paper' | 'project' | 'dataset' | 'model'
    subtitle?: string
}

export function GlobalNavbar({ user }: GlobalNavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const { theme, setTheme } = useTheme()
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
    }, [])

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Debounced search
    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            setSearchResults([])
            setShowSuggestions(false)
            return
        }

        setIsSearching(true)
        const timer = setTimeout(async () => {
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`)
                const data = await response.json()
                setSearchResults(data.results || [])
                setShowSuggestions(true)
            } catch (error) {
                console.error('Search error:', error)
                setSearchResults([])
            } finally {
                setIsSearching(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery])

    const navItems = [
        { label: "Theses", href: "/theses", icon: BookOpen },
        { label: "Papers", href: "/papers", icon: FileText },
        { label: "Datasets", href: "/datasets", icon: Database },
        { label: "Models", href: "/models", icon: IconCube },
        { label: "Projects", href: "/projects", icon: Folder },
    ]

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

    const getTypeIcon = (type: string) => {
        switch(type) {
            case 'thesis': return <BookOpen className="h-4 w-4" />
            case 'paper': return <FileText className="h-4 w-4" />
            case 'dataset': return <Database className="h-4 w-4" />
            case 'model': return <IconCube className="h-4 w-4" />
            case 'project': return <Folder className="h-4 w-4" />
            default: return <Search className="h-4 w-4" />
        }
    }

    const getDetailPath = (result: SearchResult) => {
        const typeMap = {
            'thesis': 'thesis',
            'paper': 'paper',
            'dataset': 'dataset',
            'model': 'model',
            'project': 'project'
        }
        return `/${typeMap[result.type]}/${result.id}`
    }

    const handleSuggestionClick = (result: SearchResult) => {
        router.push(getDetailPath(result))
        setSearchQuery("")
        setShowSuggestions(false)
        setIsMobileMenuOpen(false)
    }

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
            setSearchQuery("")
            setShowSuggestions(false)
            setIsMobileMenuOpen(false)
        }
    }

    // @ts-ignore
    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50 border-b border-border/50">
                <div className="max-w-8xl mx-auto px-4 lg:px-8">
                    <div className="flex h-16 items-center justify-between gap-4">
                        {/* Logo and Title */}
                        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                                <BookOpen className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="text-base font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hidden sm:inline">
                Research Hub
              </span>
                        </Link>

                        <div className="hidden md:flex flex-1" ref={searchRef}>
                            <form onSubmit={handleSearchSubmit} className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                                    placeholder="Search theses, papers, projects, models, datasets..."
                                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border-2 border-border text-sm text-foreground focus:outline-none focus:border-primary/50 focus:bg-background transition-colors"
                                />
                                
                                {/* Suggestions Dropdown */}
                                {showSuggestions && (searchResults.length > 0 || isSearching) && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                                        {isSearching ? (
                                            <div className="p-4 text-sm text-muted-foreground text-center">
                                                Searching...
                                            </div>
                                        ) : (
                                            <>
                                                {searchResults.map((result) => (
                                                    <button
                                                        key={`${result.type}-${result.id}`}
                                                        onClick={() => handleSuggestionClick(result)}
                                                        className="w-full px-4 py-3 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left border-b border-border last:border-b-0"
                                                    >
                                                        <div className="mt-1 text-muted-foreground">
                                                            {getTypeIcon(result.type)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-medium text-foreground truncate">
                                                                {result.title}
                                                            </div>
                                                            {result.subtitle && (
                                                                <div className="text-xs text-muted-foreground truncate mt-0.5">
                                                                    {result.subtitle}
                                                                </div>
                                                            )}
                                                            <div className="text-xs text-muted-foreground mt-1 capitalize">
                                                                {result.type}
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                                {searchQuery.trim() && (
                                                    <button
                                                        onClick={handleSearchSubmit}
                                                        className="w-full px-4 py-3 text-sm text-primary hover:bg-muted/50 transition-colors text-center border-t border-border"
                                                    >
                                                        View all results for "{searchQuery}"
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1 ml-auto">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-transform ${
                                        isActive(item.href)
                                            ? "text-primary/80 dark:text-primary font-semibold"
                                            : "text-muted-foreground dark:text-foreground hover:scale-105"
                                    }`}
                                >
                                    <item.icon className={`h-4 w-4 ${isActive(item.href) ? "text-primary/80 dark:text-primary" : ""}`} />
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* Right side actions */}
                        <div className="flex items-center gap-2 md:gap-3">
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:scale-105 transition-transform border-2 "
                            >
                                {mounted && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
                                <span className="hidden md:inline text-xs">{mounted && (theme === "dark" ? "Light" : "Dark")}</span>
                            </button>

                            {/* Mobile menu button */}
                            <button
                                className="md:hidden p-2 hover:scale-105 rounded-lg transition-transform"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>

                            <div className="hidden sm:flex items-center gap-2 md:gap-3">
                                <AuthButton user={user} />
                                {user && <UserProfileDropdown user={user} />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-border/50 bg-background">
                        <div className="px-4 py-3 space-y-2">
                            {/* Mobile search bar */}
                            <div className="mb-4">
                                <form onSubmit={handleSearchSubmit} className="relative w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                                    <input
                                        type="text"
                                        placeholder="Search theses, papers, projects..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setShowSuggestions(true)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border-2 border-border text-sm text-muted-foreground dark:text-foreground placeholder-[#cfcfcf] dark:placeholder-muted-foreground focus:outline-none focus:border-primary focus:bg-background transition-colors"
                                    />

                                    {/* Mobile Suggestions dropdown */}
                                    {showSuggestions && searchQuery.trim() && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-background border-2 border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                                            {isSearching ? (
                                                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                                                    Searching...
                                                </div>
                                            ) : searchResults.length === 0 ? (
                                                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                                                    No results found
                                                </div>
                                            ) : (
                                                <>
                                                    {searchResults.map((result) => (
                                                        <button
                                                            key={`${result.type}-${result.id}`}
                                                            onClick={() => handleSuggestionClick(result)}
                                                            className="w-full px-4 py-3 hover:bg-muted/50 transition-colors text-left border-b border-border last:border-b-0"
                                                        >
                                                            <div>
                                                                <div className="font-medium text-sm line-clamp-1">
                                                                    {result.title}
                                                                </div>
                                                                {result.subtitle && (
                                                                    <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                                        {result.subtitle}
                                                                    </div>
                                                                )}
                                                                <div className="text-xs text-muted-foreground mt-1 capitalize">
                                                                    {result.type}
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                    {searchQuery.trim() && (
                                                        <button
                                                            onClick={handleSearchSubmit}
                                                            className="w-full px-4 py-3 text-sm text-primary hover:bg-muted/50 transition-colors text-center border-t border-border"
                                                        >
                                                            View all results for "{searchQuery}"
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </form>
                            </div>

                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-transform ${
                                        isActive(item.href)
                                            ? "text-primary font-semibold"
                                            : "text-muted-foreground hover:scale-105"
                                    }`}
                                >
                                    <item.icon className={`h-4 w-4 ${isActive(item.href) ? "text-primary" : ""}`} />
                                    {item.label}
                                </Link>
                            ))}

                            <div className="border-t border-border/50 pt-2 mt-2 space-y-2">
                                <button
                                    onClick={() => {
                                        setTheme(theme === "dark" ? "light" : "dark")
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:scale-105 transition-transform"
                                >
                                    {mounted && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
                                    <span>{mounted && (theme === "dark" ? "Light Mode" : "Dark Mode")}</span>
                                </button>

                                {/* Auth buttons */}
                                <div className="pt-2">
                                    <AuthButton user={user} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Spacer for fixed navbar */}
            <div className="h-16" />

        </>
    )
}
