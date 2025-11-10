'use client'

import { useState, useEffect } from "react"
import { FullScreenLoader } from "@/components/ui/loader"

interface PhonesPageClientProps {
  children: React.ReactNode
}

export function PhonesPageClient({ children }: PhonesPageClientProps) {
  return <>{children}</>
}
