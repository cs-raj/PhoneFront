import NewsClient from "@/components/news-client"
import { TickerBar } from "@/components/ticker-bar"
import { LanguageToggle } from "@/components/language-toggle"
import { Impressions } from "@/components/impressions"
import { NewsPageClient } from "@/components/news/news-page-client"

export default async function Page() {
  const initialUrl = "/api/news?page=1&pageSize=4&sort=latest"
  
  // Fallback data in case fetch fails
  const fallbackData = {
    items: [],
    page: 1,
    pageSize: 4,
    total: 0,
    personalized: false
  }
  
  let initialData = fallbackData
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}${initialUrl}`, {
      next: { revalidate: 60 }
    })
    
    if (response.ok) {
      initialData = await response.json()
    } else {
      console.error('Failed to fetch news:', response.status)
    }
  } catch (error) {
    console.error('Error fetching initial news data:', error)
    // Use fallback data
  }

  return (
    <NewsPageClient>
      <div>
        <TickerBar />
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-end mb-4">
            <LanguageToggle />
          </div>
          <NewsClient initialUrl={initialUrl} initialData={initialData} />
          {/* Track impressions for news page experiences - auto-detect from SDK */}
          <Impressions 
            autoDetectExperiences={true}
            useBulkTrigger={true}
          />
        </div>
      </div>
    </NewsPageClient>
  )
}
