"use client"

import useSWR from "swr"
import { useState } from "react"
import type { NewsArticle } from "@/lib/data/home"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

type NewsResponse = { items: NewsArticle[]; total: number; page: number; pageSize: number; personalized: boolean }

// News taxonomy-based filters
const NEWS_CATEGORIES = [
  "rumors", "launches", "deals", "reviews", "software_updates"
]

const NEWS_PRIORITY = [
  "low", "medium", "high", "breaking"
]

const NEWS_SOURCE = [
  "analysis", "official", "leak", "opinion"
]

const NEWS_COMPANIES = [
  "apple", "samsung", "google", "oneplus", "xiaomi", "huawei", "oppo", "vivo", "realme", "nothing", "nokia"
]

export type NewsClientProps = {
  readonly initialUrl: string
  readonly initialData: NewsResponse
}

export default function NewsClient({ initialUrl, initialData }: NewsClientProps) {
  const [url, setUrl] = useState(initialUrl)
  const [isNavigating, setIsNavigating] = useState(false)
  
  const { data, error, isLoading } = useSWR<NewsResponse>(url, async (url: string) => {
    const response = await fetch(url, { 
      cache: "no-store",
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }
    const result = await response.json()
    return result
  }, {
    revalidateOnFocus: false,
    fallbackData: isNavigating ? undefined : initialData,
    onSuccess: () => {
      setIsNavigating(false)
    }
  })

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])

  const updateParam = (key: string, value: string) => {
    const u = new URL(url, "http://localhost")
    u.searchParams.set(key, value)
    const newUrl = u.pathname + "?" + u.searchParams.toString()
    
    // Set navigating state for pagination to prevent showing fallback data
    if (key === "page") {
      setIsNavigating(true)
    }
    
    setUrl(newUrl)
  }

  const toggleFilter = (array: string[], setter: (arr: string[]) => void, value: string) => {
    if (array.includes(value)) {
      setter(array.filter(item => item !== value))
    } else {
      setter([...array, value])
    }
  }

  const applyFilters = () => {
    const u = new URL(url, "http://localhost")
    
    // Clear existing filter params
    u.searchParams.delete("category")
    u.searchParams.delete("priority") 
    u.searchParams.delete("source")
    u.searchParams.delete("company")
    
    // Add selected filters
    if (selectedCategories.length > 0) {
      u.searchParams.set("category", selectedCategories.join(","))
    }
    if (selectedPriorities.length > 0) {
      u.searchParams.set("priority", selectedPriorities.join(","))
    }
    if (selectedSources.length > 0) {
      u.searchParams.set("source", selectedSources.join(","))
    }
    if (selectedCompanies.length > 0) {
      u.searchParams.set("company", selectedCompanies.join(","))
    }
    
    u.searchParams.set("page", "1")
    setUrl(u.pathname + "?" + u.searchParams.toString())
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedPriorities([])
    setSelectedSources([])
    setSelectedCompanies([])
    
    const u = new URL(url, "http://localhost")
    u.searchParams.delete("category")
    u.searchParams.delete("priority")
    u.searchParams.delete("source")
    u.searchParams.delete("company")
    u.searchParams.set("page", "1")
    setUrl(u.pathname + "?" + u.searchParams.toString())
  }

  if (error) {
    return <div>Error loading news: {error.message}</div>
  }

  if (!data || isLoading || isNavigating) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full border-4 border-muted border-t-primary w-12 h-12 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading news...</p>
        </div>
      </div>
    )
  }

  const { total, page, pageSize } = data
  const totalPages = Math.ceil(total / pageSize)

  const formatTaxonomyLabel = (type: string, term: string) => {
    const labelMap: Record<string, Record<string, string>> = {
      news: {
        rumors: "Rumors",
        launches: "Launches", 
        deals: "Deals",
        reviews: "Reviews",
        software_updates: "Software Updates",
        low: "Low Priority",
        medium: "Medium Priority",
        high: "High Priority",
        breaking: "Breaking News",
        analysis: "Analysis",
        official: "Official",
        leak: "Leak",
        opinion: "Opinion"
      },
      company: {
        apple: "Apple",
        samsung: "Samsung",
        google: "Google",
        oneplus: "OnePlus",
        xiaomi: "Xiaomi",
        huawei: "Huawei",
        oppo: "Oppo",
        vivo: "Vivo",
        realme: "Realme",
        nothing: "Nothing",
        nokia: "Nokia"
      }
    }
    
    return labelMap[type]?.[term] || term.charAt(0).toUpperCase() + term.slice(1)
  }

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-semibold">Latest News</h1>
        <p className="text-muted-foreground mt-1">
          Stay updated with the latest smartphone news and announcements
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        {/* News Filters Sidebar */}
        <aside className="rounded-lg border bg-card p-4 md:p-6 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Filter News</h2>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
          
          <div className="space-y-6">
            {/* Category Filter */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Category</p>
              <div className="grid gap-2 max-h-32 overflow-y-auto">
                {NEWS_CATEGORIES.map((category) => (
                  <label key={category} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleFilter(selectedCategories, setSelectedCategories, category)}
                      id={`category-${category}`}
                    />
                    <Label htmlFor={`category-${category}`} className="font-normal text-sm">
                      {formatTaxonomyLabel("news", category)}
                    </Label>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Priority</p>
              <div className="grid gap-2 max-h-32 overflow-y-auto">
                {NEWS_PRIORITY.map((priority) => (
                  <label key={priority} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedPriorities.includes(priority)}
                      onCheckedChange={() => toggleFilter(selectedPriorities, setSelectedPriorities, priority)}
                      id={`priority-${priority}`}
                    />
                    <Label htmlFor={`priority-${priority}`} className="font-normal text-sm">
                      {formatTaxonomyLabel("news", priority)}
                    </Label>
                  </label>
                ))}
              </div>
            </div>

            {/* Source Filter */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Source</p>
              <div className="grid gap-2 max-h-32 overflow-y-auto">
                {NEWS_SOURCE.map((source) => (
                  <label key={source} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedSources.includes(source)}
                      onCheckedChange={() => toggleFilter(selectedSources, setSelectedSources, source)}
                      id={`source-${source}`}
                    />
                    <Label htmlFor={`source-${source}`} className="font-normal text-sm">
                      {formatTaxonomyLabel("news", source)}
                    </Label>
                  </label>
                ))}
              </div>
            </div>

            {/* Company Filter */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Company</p>
              <div className="grid gap-2 max-h-32 overflow-y-auto">
                {NEWS_COMPANIES.map((company) => (
                  <label key={company} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedCompanies.includes(company)}
                      onCheckedChange={() => toggleFilter(selectedCompanies, setSelectedCompanies, company)}
                      id={`company-${company}`}
                    />
                    <Label htmlFor={`company-${company}`} className="font-normal text-sm">
                      {formatTaxonomyLabel("company", company)}
                    </Label>
                  </label>
                ))}
              </div>
            </div>

            <Button onClick={applyFilters} className="w-full">
              Apply Filters
            </Button>
          </div>
        </aside>

        {/* News List */}
        <section className="space-y-5">
        {data?.items?.map((article) => (
          <Link key={article.id} href={`/news/${article.slug}`} className="block">
            <Card className="overflow-hidden border border-border hover:shadow-lg transition-shadow">
              <div className="grid gap-0 md:grid-cols-[240px_1fr]">
                <div className="relative">
                  <img
                    src={article.imageUrl || `/placeholder.svg?height=160&width=280&query=${encodeURIComponent(article.imageAlt || "phone news image")}`}
                    alt={article.imageAlt}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4 md:p-6">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="text-lg font-semibold line-clamp-2 text-foreground">
                      {article.title}
                    </h2>
                    {article.badge && (
                      <Badge variant="destructive" className="shrink-0">
                        {article.badge}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                  
                  {/* Display all taxonomies */}
                  {article.taxonomies && Object.keys(article.taxonomies).length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {Object.entries(article.taxonomies).map(([type, terms]) =>
                        terms.map((term) => (
                          <Badge key={`${type}-${term}`} variant="secondary" className="text-xs">
                            {formatTaxonomyLabel(type, term)}
                          </Badge>
                        ))
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {article.authorData?.avatar?.url ? (
                          <img
                            src={article.authorData.avatar.url}
                            alt={article.authorData.avatar.title || article.authorData.name}
                            className="h-6 w-6 rounded-full object-cover border border-primary/20"
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold text-xs">
                              {(article.author || "PhoneFront Staff").charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span>{article.author || "PhoneFront Staff"}</span>
                      </div>
                      <span>{article.datePretty}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <span>0</span>
                        <span>views</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>0</span>
                        <span>comments</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
        </section>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateParam("page", String(Math.max(1, page - 1)))}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) })
              .map((_, i) => {
                const p = i + 1
                const isActive = p === page
                return (
                  <Button
                    key={p}
                    size="sm"
                    variant={isActive ? "default" : "outline"}
                    onClick={() => updateParam("page", String(p))}
                    className="min-w-[2.5rem]"
                  >
                    {p}
                  </Button>
                )
              })
            }
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => updateParam("page", String(Math.min(totalPages, page + 1)))}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}