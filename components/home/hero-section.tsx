"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import * as LucideIcons from "lucide-react"
import { HomePage } from "@/lib/types"

export function HeroSection() {
  const [pageData, setPageData] = useState<HomePage | null>(null)

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await fetch("/api/home_page")
        if (response.ok) {
          const data = await response.json()
          console.log("Home page data received:", data)
          setPageData(data)
        }
      } catch (error) {
        console.error("Error fetching home page data:", error)
      }
    }

    fetchPageData()
  }, [])

  // Use actual data from API, with minimal fallback for loading state
  const hero = pageData?.hero_section

  const getIcon = (iconName?: string) => {
    if (!iconName) return null
    const Icon = (LucideIcons as any)[iconName]
    return Icon ? <Icon className="mr-2 h-5 w-5" /> : null
  }

  const getStatColorClass = (color: string) => {
    switch (color) {
      case 'accent':
        return 'text-accent'
      case 'secondary':
        return 'text-secondary'
      default:
        return 'text-primary'
    }
  }

  // Show loading state if data is not available
  if (!hero) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container relative mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center space-y-10 sm:space-y-12 md:space-y-16">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded-full w-64 mx-auto mb-6"></div>
              <div className="h-16 bg-muted rounded w-96 mx-auto mb-6"></div>
              <div className="h-6 bg-muted rounded w-80 mx-auto mb-10"></div>
              <div className="flex justify-center gap-4 mb-10">
                <div className="h-12 bg-muted rounded w-32"></div>
                <div className="h-12 bg-muted rounded w-32"></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-16 bg-muted rounded"></div>
                <div className="h-16 bg-muted rounded"></div>
                <div className="h-16 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />
      <div className="container relative mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center space-y-10 sm:space-y-12 md:space-y-16">
          {/* Badge */}
          {hero.badge_text && (
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Star className="h-4 w-4 fill-primary" />
              <span>{hero.badge_text}</span>
            </div>
          )}
          
          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-tight sm:leading-tight md:leading-tight lg:leading-tight">
            <span className="block mb-2 sm:mb-3 md:mb-4">
              {hero.headline}
            </span>
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {hero.highlight_text}
            </span>
          </h1>
          
          {/* Subheadline */}
          {hero.subheadline && (
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
              {hero.subheadline}
            </p>
          )}
          
          {/* CTA Buttons */}
          {hero.cta_buttons && hero.cta_buttons.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {hero.cta_buttons.map((button) => {
              let variant: "default" | "outline" | "secondary" = "default"
              if (button.button_style === 'outline') variant = 'outline'
              else if (button.button_style === 'secondary') variant = 'secondary'

              return (
                <Button 
                  key={button._metadata?.uid || button.button_text}
                  asChild 
                  size="lg" 
                  variant={variant}
                  className="w-full sm:w-auto group"
                >
                  <Link href={button.button_link.href}>
                    {getIcon(button.icon_name)}
                    {button.button_text}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              )
            })}
            </div>
          )}

          {/* Stats */}
          {hero.stats && hero.stats.length > 0 && (
            <div className="grid grid-cols-3 gap-4 pt-8 md:pt-12">
              {hero.stats.map((stat) => (
              <div key={stat._metadata?.uid || stat.label} className="space-y-1">
                <div className={`text-2xl md:text-3xl font-bold ${getStatColorClass(stat.color)}`}>
                  {stat.number}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

