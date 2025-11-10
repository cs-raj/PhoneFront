"use client"
import useSWR from "swr"
import * as React from "react"
import type { Company } from "@/lib/data/companies"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { CompanyCard } from "@/components/company-card"
import { ChevronLeft, ChevronRight } from "lucide-react"

type ApiResponse = {
  items: Company[]
  page: number
  pageSize: number
  total: number
  totalPhones: number
  totalCompanies: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export type CompaniesClientProps = {
  initialUrl: string
  initialData: ApiResponse
}

export function CompaniesClient({ initialUrl, initialData }: Readonly<CompaniesClientProps>) {
  const [url, setUrl] = React.useState(initialUrl)
  const [isNavigating, setIsNavigating] = React.useState(false)

  const { data, isLoading } = useSWR<ApiResponse>(url, async (url: string) => {
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
    fallbackData: isNavigating ? undefined : initialData,
    revalidateOnFocus: false,
    onSuccess: () => {
      setIsNavigating(false)
    }
  })

  const page = data?.page ?? 1
  const total = data?.total ?? 0
  const pageSize = data?.pageSize ?? 9
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const updateParam = (key: string, val: string | number) => {
    const u = new URL(url, "http://localhost")
    u.searchParams.set(key, String(val))
    const newUrl = u.pathname + "?" + u.searchParams.toString()
    
    // Set navigating state for pagination to prevent showing fallback data
    if (key === "page") {
      setIsNavigating(true)
    }
    
    setUrl(newUrl)
  }

  if (!data || isLoading || isNavigating) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full border-4 border-muted border-t-primary w-12 h-12 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading companies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Card className="px-6 py-4 bg-gradient-to-r from-card to-card/80 border-primary/10 shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Companies:</span>
              <span className="font-bold text-foreground text-lg">{data?.totalCompanies ?? 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-muted-foreground">Total Phones:</span>
              <span className="font-bold text-foreground text-lg">{data?.totalPhones ?? 0}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Sort by</span>
            <Select
              defaultValue={new URL(url, "http://localhost").searchParams.get("sortBy") || "name"}
              onValueChange={(v) => updateParam("sortBy", v)}
            >
              <SelectTrigger className="w-[180px] bg-background border-primary/20 hover:border-primary/40 transition-colors">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="phones">Total Phones</SelectItem>
                <SelectItem value="latest">Latest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data?.items?.map((c) => (
          <CompanyCard key={c.id} {...c} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateParam("page", Math.max(1, page - 1))}
            disabled={page <= 1}
            aria-label="Previous page"
            className="hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ChevronLeft className="size-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages })
              .slice(0, 5)
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
                    className={isActive ? "bg-primary text-primary-foreground" : "hover:bg-primary/10 hover:border-primary/40"}
                  >
                    {p}
                  </Button>
                )
              })}
            {totalPages > 5 && <span className="px-2 text-muted-foreground">…</span>}
            {totalPages > 5 && (
              <Button
                size="sm"
                variant={page === totalPages ? "default" : "outline"}
                onClick={() => updateParam("page", totalPages)}
                className={page === totalPages ? "bg-primary text-primary-foreground" : "hover:bg-primary/10 hover:border-primary/40"}
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
            className="hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
