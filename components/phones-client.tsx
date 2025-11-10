"use client"

import useSWR from "swr"
import { useState, useEffect, useRef } from "react"
import type { Phone } from "@/lib/types"
import { DEFAULT_FILTERS, type Filters, PhoneFilters } from "./phone-filters"
import { Loader } from "./ui/loader"
import { PhoneCard } from "./phone-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Grid3X3, List, ChevronLeft, ChevronRight, Smartphone, Search, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLyticsTracking } from "@/hooks/use-lytics"

type SortKey = "latest" | "price-asc" | "price-desc"

type ApiResponse = {
  items: Phone[]
  page: number
  pageSize: number
  total: number
  personalized: boolean
}

type PriceFiltersResponse = {
  items: Array<{
    id: string
    title: string
    minPrice: number
    maxPrice: number
    createdAt: string
    updatedAt: string
  }>
  total: number
  personalized: boolean
  variantParam: string | null
}

export type PhonesClientProps = {
  initialUrl: string
  initialData: ApiResponse
}

export function PhonesClient({ initialUrl, initialData }: Readonly<PhonesClientProps>) {
  const [url, setUrl] = useState(initialUrl)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [sort, setSort] = useState<SortKey>("latest")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  
  // Get Lytics tracking hook
  const lytics = useLyticsTracking()
  
  // Track previous values for change tracking
  const previousSortRef = useRef<SortKey>("latest")
  const previousViewRef = useRef<"grid" | "list">("grid")

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search input with Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="Search phones"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle search input key events
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setSearchQuery("")
      e.currentTarget.blur()
    }
  }
  
  // Track search queries with debouncing
  // Note: filtered is defined later, so we'll track after it's computed


  // Fetch price filters for dynamic range
  const { data: priceFiltersData } = useSWR<PriceFiltersResponse>(
    '/api/price-filters',
    async (url: string) => {
      console.log('💰 [PHONES CLIENT] Fetching price filters from:', url);
      const response = await fetch(url)
      if (!response.ok) {
        console.error('💰 [PHONES CLIENT] Failed to fetch price filters:', response.status, response.statusText);
        throw new Error('Failed to fetch price filters')
      }
      const data = await response.json();
      console.log('💰 [PHONES CLIENT] Received price filters data:', data);
      return data;
    }
  )

  const { data, error, isLoading } = useSWR<ApiResponse>(url, async (url: string) => {
    const response = await fetch(url, { 
      cache: "no-store",
      credentials: 'include' // Ensure cookies are sent for personalization
    })
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }
    const result = await response.json()
    return result
  }, {
    revalidateOnFocus: false,
  })


  // Parse URL parameters and update filters
  useEffect(() => {
    const urlObj = new URL(url, "http://localhost")
    
    const newFilters: Filters = {
      companies: urlObj.searchParams.get("companies")?.split(",").filter(Boolean) || [],
      os: urlObj.searchParams.get("os")?.split(",").filter(Boolean) || [],
      priceRange: urlObj.searchParams.get("priceRange")?.split(",").filter(Boolean) || [],
      features: urlObj.searchParams.get("features")?.split(",").filter(Boolean) || [],
      screenType: urlObj.searchParams.get("screenType")?.split(",").filter(Boolean) || [],
      phoneType: urlObj.searchParams.get("phoneType")?.split(",").filter(Boolean) || [],
      releaseStatus: urlObj.searchParams.get("releaseStatus")?.split(",").filter(Boolean) || [],
      priceMin: parseInt(urlObj.searchParams.get("priceMin") || "0"),
      priceMax: parseInt(urlObj.searchParams.get("priceMax") || "2000"),
    }
    setFilters(newFilters)
  }, [url])

  // Update price range when API data becomes available
  useEffect(() => {
    if (priceFiltersData?.items && priceFiltersData.items.length > 0) {
      const apiMin = Math.min(...priceFiltersData.items.map(item => item.minPrice));
      const apiMax = Math.max(...priceFiltersData.items.map(item => item.maxPrice));
      
      console.log('💰 [PHONES CLIENT] Using API price range:', { apiMin, apiMax, personalized: priceFiltersData.personalized });
      
      setFilters(prev => ({
        ...prev,
        priceMin: apiMin,
        priceMax: apiMax
      }));
    }
  }, [priceFiltersData])

  const page = data?.page ?? 1
  const total = data?.total ?? 0
  const pageSize = data?.pageSize ?? 12
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const updateParam = (key: string, val: string | number) => {
    const u = new URL(url, "http://localhost")
    u.searchParams.set(key, String(val))
    setUrl(u.pathname + "?" + u.searchParams.toString())
  }

  const applyFilters = (newFilters: Filters) => {
    const u = new URL(url, "http://localhost")
    
    // Clear existing filter params
    u.searchParams.delete("companies")
    u.searchParams.delete("os")
    u.searchParams.delete("features")
    u.searchParams.delete("screenType")
    u.searchParams.delete("phoneType")
    u.searchParams.delete("releaseStatus")
    u.searchParams.delete("priceRange")
    u.searchParams.delete("priceMin")
    u.searchParams.delete("priceMax")
    
    // Add selected filters
    if (newFilters.companies.length > 0) {
      u.searchParams.set("companies", newFilters.companies.join(","))
    }
    if (newFilters.os.length > 0) {
      u.searchParams.set("os", newFilters.os.join(","))
    }
    if (newFilters.features.length > 0) {
      u.searchParams.set("features", newFilters.features.join(","))
    }
    if (newFilters.screenType.length > 0) {
      u.searchParams.set("screenType", newFilters.screenType.join(","))
    }
    if (newFilters.phoneType.length > 0) {
      u.searchParams.set("phoneType", newFilters.phoneType.join(","))
    }
    if (newFilters.releaseStatus.length > 0) {
      u.searchParams.set("releaseStatus", newFilters.releaseStatus.join(","))
    }
    if (newFilters.priceRange.length > 0) {
      u.searchParams.set("priceRange", newFilters.priceRange.join(","))
    }
    if (newFilters.priceMin > 0) {
      u.searchParams.set("priceMin", newFilters.priceMin.toString())
    }
    if (newFilters.priceMax < 2000) {
      u.searchParams.set("priceMax", newFilters.priceMax.toString())
    }
    
    u.searchParams.set("page", "1")
    setUrl(u.pathname + "?" + u.searchParams.toString())
    setFilters(newFilters)
  }



  // Simple search filtering - Phase 2 approach
  const filtered = (data?.items || []).filter((phone) => {
    if (!searchQuery.trim()) return true
    return phone.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  })
  
  // Track search queries with debouncing (moved after filtered is defined)
  useEffect(() => {
    if (searchQuery.trim()) {
      // Only track non-empty searches
      const timer = setTimeout(() => {
        try {
          const resultsCount = filtered.length;
          lytics.trackSearch(searchQuery, resultsCount, 'phones');
        } catch (error) {
          // Silently fail - don't break search functionality
          console.warn('⚠️ [PHONES CLIENT] Error tracking search:', error);
        }
      }, 500); // Debounce for 500ms
      
      return () => clearTimeout(timer);
    }
  }, [searchQuery, filtered.length, lytics])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-semibold">All Phones</h1>
        </header>
        <Loader 
          variant="phone" 
          size="lg" 
          text="Loading phones..." 
          className="min-h-[60vh]"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-semibold">All Phones</h1>
          <p className="text-muted-foreground mt-1">
            Error loading phones: {error.message}
          </p>
        </header>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-semibold">All Phones</h1>
        <p className="text-muted-foreground mt-1">
          Discover the latest smartphones from top brands with detailed specifications
        </p>
      </header>

      {/* Toolbar */}
      <Card className="px-4 py-3">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="inline-flex items-center gap-2">
              <Smartphone className="h-4 w-4" aria-hidden />
              <span className="font-medium text-foreground">
                {searchQuery ? filtered.length : total}
              </span> Phones
            </div>
            {data?.personalized && (
              <div className="inline-flex items-center gap-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Personalized</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Simple Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search phones... (⌘K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="pl-10 pr-10 w-full sm:w-80"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setSearchQuery("")}
                  title="Clear search"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            <span className="text-sm text-muted-foreground">Sort by</span>
            <Select 
              value={sort} 
              onValueChange={(v: SortKey) => {
                try {
                  // Track sort change
                  lytics.trackSortChange(v, previousSortRef.current);
                  previousSortRef.current = v;
                } catch (error) {
                  // Silently fail - don't break sort functionality
                  console.warn('⚠️ [PHONES CLIENT] Error tracking sort change:', error);
                }
                setSort(v);
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Latest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={view === "grid" ? "default" : "outline"}
              size="icon"
              aria-pressed={view === "grid"}
              onClick={() => {
                try {
                  // Track view mode change
                  lytics.trackViewModeChange("grid", previousViewRef.current);
                  previousViewRef.current = "grid";
                } catch (error) {
                  // Silently fail - don't break view mode functionality
                  console.warn('⚠️ [PHONES CLIENT] Error tracking view mode change:', error);
                }
                setView("grid");
              }}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "default" : "outline"}
              size="icon"
              aria-pressed={view === "list"}
              onClick={() => {
                try {
                  // Track view mode change
                  lytics.trackViewModeChange("list", previousViewRef.current);
                  previousViewRef.current = "list";
                } catch (error) {
                  // Silently fail - don't break view mode functionality
                  console.warn('⚠️ [PHONES CLIENT] Error tracking view mode change:', error);
                }
                setView("list");
              }}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-[260px] flex-shrink-0">
          <PhoneFilters initial={filters} onApply={applyFilters} />
        </div>

        <div className="flex-1">
          {/* Search Results Info */}
          {searchQuery && (
            <div className="mb-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {filtered.length === 0 ? (
                  <>No phones found for "<span className="font-medium text-foreground">{searchQuery}</span>"</>
                ) : (
                  <>{filtered.length} phone{filtered.length !== 1 ? 's' : ''} found for "<span className="font-medium text-foreground">{searchQuery}</span>"</>
                )}
              </p>
            </div>
          )}

          {/* No Results Message */}
          {searchQuery && filtered.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No phones found</h3>
                <p className="text-sm">Try searching with different keywords or clear your search</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery("")}
                className="mt-4"
              >
                Clear Search
              </Button>
            </div>
          )}

          {/* Grid View */}
          {!(searchQuery && filtered.length === 0) && view === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
              {filtered.map((p, index) => (
                <div key={p.id} className="w-full h-full">
                  <PhoneCard phone={p} searchQuery={searchQuery} />
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {!(searchQuery && filtered.length === 0) && view === "list" && (
            <div className="grid gap-4">
              {filtered.map((p, index) => (
                <Link 
                  key={p.id} 
                  href={`/phone/${p.slug}`} 
                  className="block"
                  onClick={() => {
                    try {
                      // Track phone view for list view
                      lytics.trackPhoneView(p, {
                        viewPosition: index,
                        viewMode: 'list',
                        searchQuery: searchQuery,
                      });
                    } catch (error) {
                      // Silently fail - don't break navigation
                      console.warn('⚠️ [PHONES CLIENT] Error tracking phone view:', error);
                    }
                  }}
                >
                  <div className="rounded-lg border bg-card p-4 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center flex-shrink-0">
                      <Image
                        src={p.image || "/smartphone-product-render.jpg"}
                        alt={`${p.name} image`}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-semibold">{p.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {p.brand} • {p.os} • {p.type}
                      </div>
                      <div className="text-sm mt-2">
                        {p.specs.display} • {p.specs.battery} • {p.specs.camera}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="text-lg font-semibold">{p.price}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateParam("page", Math.max(1, page - 1))}
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
                    onClick={() => updateParam("page", p)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {p}
                  </Button>
                )
              })}
            {totalPages > 5 && <span className="px-1 text-muted-foreground">…</span>}
            {totalPages > 5 && (
              <Button
                size="sm"
                variant={page === totalPages ? "default" : "outline"}
                onClick={() => updateParam("page", totalPages)}
              >
                {totalPages}
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => updateParam("page", Math.min(totalPages, page + 1))}
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
