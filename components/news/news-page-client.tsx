'use client'

import { useState, useEffect } from "react"
import { FullScreenLoader } from "@/components/ui/loader"

interface NewsPageClientProps {
  children: React.ReactNode
}

export function NewsPageClient({ children }: NewsPageClientProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1800) // 1.8 seconds loading time for news data

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <FullScreenLoader text="Loading News Page..." variant="spinner" />
  }

  return <>{children}</>
}
