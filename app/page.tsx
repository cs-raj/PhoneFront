import { TickerBar } from "@/components/ticker-bar"
import { HeroSection } from "@/components/home/hero-section"
import { HomeSections } from "@/components/home/home-sections"
import { Impressions } from "@/components/impressions"
import { HomePageClient } from "@/components/home/home-page-client"
import { Metadata } from "next"
import { HomePage } from "@/lib/types"

// Fetch homepage data for metadata
async function getHomePageData(): Promise<HomePage | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/home_page`, {
      cache: 'no-store' // Always fetch fresh data for metadata
    })
    
    if (response.ok) {
      const data = await response.json()
      return data
    }
  } catch (error) {
    console.error('Error fetching homepage data for metadata:', error)
  }
  
  return null
}

export async function generateMetadata(): Promise<Metadata> {
  const homePageData = await getHomePageData()
  
  if (homePageData) {
    return {
      title: homePageData.title || "PhoneFront - Your Trusted Smartphone Guide",
      description: homePageData.seo_metadata?.meta_description || "Your trusted source for smartphone reviews, comparisons, and the latest mobile technology news.",
      keywords: homePageData.seo_metadata?.meta_keywords || ["smartphone reviews", "phone comparisons", "mobile news", "best smartphones"],
      openGraph: {
        title: homePageData.title || "PhoneFront - Your Trusted Smartphone Guide",
        description: homePageData.seo_metadata?.meta_description || "Your trusted source for smartphone reviews, comparisons, and the latest mobile technology news.",
        images: homePageData.seo_metadata?.og_image ? [homePageData.seo_metadata.og_image] : [],
      },
    }
  }
  
  // Fallback metadata
  return {
    title: "PhoneFront - Your Trusted Smartphone Guide",
    description: "Your trusted source for smartphone reviews, comparisons, and the latest mobile technology news.",
  }
}

export default function Page() {
  return (
    <HomePageClient>
      <div>
        <TickerBar />
        <HeroSection />
        <HomeSections />
        {/* Track impressions for homepage experiences - auto-detect from SDK */}
        <Impressions 
          autoDetectExperiences={true}
          useBulkTrigger={true}
        />
      </div>
    </HomePageClient>
  )
}
