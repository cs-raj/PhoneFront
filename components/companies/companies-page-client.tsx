'use client'

import { useState, useEffect } from "react"
import { FullScreenLoader } from "@/components/ui/loader"

interface CompaniesPageClientProps {
  children: React.ReactNode
}

export function CompaniesPageClient({ children }: CompaniesPageClientProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1900) // 1.9 seconds loading time for companies data

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <FullScreenLoader text="Loading Companies Page..." variant="spinner" />
  }

  return <>{children}</>
}
