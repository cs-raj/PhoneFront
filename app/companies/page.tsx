import { CompaniesClient } from "@/components/companies-client"
import { COMPANIES, getTotalPhones } from "@/lib/data/companies"
import { CompaniesPageClient } from "@/components/companies/companies-page-client"

export const metadata = {
  title: "Mobile Companies",
}

// Fallback function using static data
function getStaticFallback() {
  const page = 1
  const pageSize = 12
  const items = [...COMPANIES].sort((a, b) => a.name.localeCompare(b.name)).slice(0, pageSize)
  return {
    items,
    page,
    pageSize,
    total: COMPANIES.length,
    totalPhones: getTotalPhones(COMPANIES),
    totalCompanies: COMPANIES.length,
    personalized: false,
  }
}

export default async function CompaniesPage() {
  const initialUrl = "/api/companies?page=1&pageSize=12&sortBy=name"
  
  console.log('🏢 [COMPANIES PAGE] ==========================================')
  console.log('🏢 [COMPANIES PAGE] Fetching initial data from API for SSR')
  console.log('🏢 [COMPANIES PAGE] ==========================================')
  
  let initialData
  
  try {
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
    const apiUrl = `${baseUrl}${initialUrl}`
    
    console.log('🏢 [COMPANIES PAGE] Fetching from:', apiUrl)
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    })
    
    if (response.ok) {
      initialData = await response.json()
      console.log('✅ [COMPANIES PAGE] Successfully fetched initial data from API')
      console.log('🏢 [COMPANIES PAGE] Items count:', initialData.items?.length)
      console.log('🏢 [COMPANIES PAGE] Personalized:', initialData.personalized)
    } else {
      console.error('❌ [COMPANIES PAGE] API responded with status:', response.status)
      console.log('🏢 [COMPANIES PAGE] Falling back to static data')
      initialData = getStaticFallback()
    }
  } catch (error) {
    console.error('❌ [COMPANIES PAGE] Error fetching initial data:', error)
    console.log('🏢 [COMPANIES PAGE] Falling back to static data')
    initialData = getStaticFallback()
  }
  
  console.log('🏢 [COMPANIES PAGE] ==========================================')

  return (
    <CompaniesPageClient>
      <main>
        <div className="mx-auto max-w-6xl px-4 py-10">
          <header className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Mobile Companies
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground mb-4">
              Discover Leading Mobile Brands
            </h1>
            <p className="mt-2 text-pretty text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore phones from the world&apos;s leading mobile manufacturers and discover their latest innovations, cutting-edge technology, and exceptional designs.
            </p>
          </header>

          <CompaniesClient initialUrl={initialUrl} initialData={initialData} />
        </div>
      </main>
    </CompaniesPageClient>
  )
}
