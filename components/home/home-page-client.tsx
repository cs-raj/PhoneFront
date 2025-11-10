'use client'

import { useState, useEffect } from "react"
import { FullScreenLoader } from "@/components/ui/loader"

interface HomePageClientProps {
  children: React.ReactNode
}

export function HomePageClient({ children }: HomePageClientProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500) // 1.5 seconds loading time

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <FullScreenLoader text="Loading Homepage..." variant="spinner" />
  }

  return <>{children}</>
}
