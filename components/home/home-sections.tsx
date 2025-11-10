"use client"

import { useEffect, useState, Suspense } from "react"
import { LatestPhones } from "@/components/home/latest-phones"
import { LatestNews } from "@/components/home/latest-news"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { HomePage } from "@/lib/types"

// Remove static data imports - use only API data

export function HomeSections() {
  const [pageData, setPageData] = useState<HomePage | null>(null)

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await fetch("/api/home_page")
        if (response.ok) {
          const data = await response.json()
          setPageData(data)
        }
      } catch (error) {
        console.error("Error fetching home page data:", error)
      }
    }

    fetchPageData()
  }, [])

  const newsSection = pageData?.featured_news_section || {
    section_title: "Featured News",
    section_description: "Stay updated with the latest smartphone news",
    show_view_all: true,
    number_of_articles: 1
  }

  const phonesSection = pageData?.latest_phones_section || {
    section_title: "Latest Phones",
    section_description: "Discover the newest smartphones hitting the market",
    show_view_all: true,
    number_of_phones: 12
  }

  return (
    <>
      {/* Featured News Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {newsSection.section_title.split(' ').map((word) => 
                word === 'News' || word === 'Featured' ? (
                  <span key={word} className="text-primary">{word} </span>
                ) : (
                  <span key={word}>{word} </span>
                )
              )}
            </h2>
            <p className="text-sm text-foreground/80 mt-2">
              {newsSection.section_description}
            </p>
          </div>
          {newsSection.show_view_all && (
            <Link
              href="/news"
              className="text-sm font-medium text-primary hover:underline underline-offset-4 flex items-center gap-1"
              aria-label="View all news"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        <Suspense fallback={<div className="animate-pulse bg-muted rounded-xl h-64" />}>
          <LatestNews />
        </Suspense>
      </section>

      {/* Latest Phones Section */}
      <section className="container mx-auto px-4 pb-16 md:pb-20">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {phonesSection.section_title.split(' ').map((word) => 
                word === 'Phones' || word === 'Latest' ? (
                  <span key={word} className="text-primary">{word} </span>
                ) : (
                  <span key={word}>{word} </span>
                )
              )}
            </h2>
            <p className="text-sm text-foreground/80 mt-2">
              {phonesSection.section_description}
            </p>
          </div>
          {phonesSection.show_view_all && (
            <Link
              href="/phones"
              className="text-sm font-medium text-primary hover:underline underline-offset-4 flex items-center gap-1"
              aria-label="View all phones"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-muted rounded-xl h-96" />
            ))}
          </div>
        }>
          <LatestPhones />
        </Suspense>
      </section>
    </>
  )
}

