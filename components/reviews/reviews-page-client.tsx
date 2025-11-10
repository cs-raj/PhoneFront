'use client'

import { useState, useEffect } from "react"
import { FullScreenLoader } from "@/components/ui/loader"

interface ReviewsPageClientProps {
  children: React.ReactNode
}

export function ReviewsPageClient({ children }: ReviewsPageClientProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2200) // 2.2 seconds loading time for reviews data

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <FullScreenLoader text="Loading Reviews Page..." variant="spinner" />
  }

  return <>{children}</>
}
