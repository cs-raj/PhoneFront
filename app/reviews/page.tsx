import ReviewsClient from "@/components/reviews-client"
import { Impressions } from "@/components/impressions"
import { ReviewsPageClient } from "@/components/reviews/reviews-page-client"

export const metadata = {
  title: "Phone Reviews",
  description: "Read in-depth reviews of the latest smartphones from top tech reviewers."
}

function getInitial() {
  return {
    items: [],
    meta: {
      total: 0,
      page: 1,
      limit: 12,
      pages: 0
    }
  }
}

export default function ReviewsPage() {
  return (
    <ReviewsPageClient>
      <main>
        <div className="mx-auto max-w-6xl px-4 py-10">
          <ReviewsClient />
          {/* Track impressions for reviews page experiences - auto-detect from SDK */}
          <Impressions 
            autoDetectExperiences={true}
            useBulkTrigger={true}
          />
        </div>
      </main>
    </ReviewsPageClient>
  )
}