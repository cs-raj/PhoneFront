import { PhonesClient } from "@/components/phones-client"
import { Impressions } from "@/components/impressions"
import { PhonesPageClient } from "@/components/phones/phones-page-client"

export const metadata = {
  title: "All Phones",
  description: "Discover the latest smartphones from top brands with detailed specifications and reviews."
}

export default function PhonesPage() {
  const initialUrl = "/api/phones?page=1&pageSize=12"
  const initialData = {
    items: [],
    page: 1,
    pageSize: 12,
    total: 0,
    personalized: false,
  }

  return (
    <PhonesPageClient>
      <main>
        <div className="mx-auto max-w-6xl px-4 py-10">
          <PhonesClient initialUrl={initialUrl} initialData={initialData} />
          {/* Track impressions for phones page experiences - auto-detect from SDK */}
          <Impressions 
            autoDetectExperiences={true}
            useBulkTrigger={true}
          />
        </div>
      </main>
    </PhonesPageClient>
  )
}
