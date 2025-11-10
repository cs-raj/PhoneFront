"use client"

import { useEffect, useState } from "react"
import type { CareersPage } from "@/lib/types"
import { FullScreenLoader } from "@/components/ui/loader"

export default function CareersPageComponent() {
  const [pageData, setPageData] = useState<CareersPage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await fetch("/api/careers_page")
        if (response.ok) {
          const data = await response.json()
          console.log("Careers page data received:", data)
          setPageData(data)
        }
      } catch (error) {
        console.error("Error fetching careers page data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPageData()
  }, [])

  if (loading) {
    return <FullScreenLoader text="Loading Careers Page..." variant="spinner" />
  }

  if (!pageData?.sections) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Unable to load careers page content.</p>
      </div>
    )
  }

  const heroSection = pageData.sections.find(s => s.hero_section)?.hero_section
  const whyJoinSection = pageData.sections.find(s => s.why_join_section)?.why_join_section
  const perksSection = pageData.sections.find(s => s.perks_benefits_section)?.perks_benefits_section
  const positionsSection = pageData.sections.find(s => s.open_positions_section)?.open_positions_section
  const ctaSection = pageData.sections.find(s => s.cta_section)?.cta_section

  return (
    <main>
      <div className="container mx-auto px-4 py-12 md:py-16">
      {/* Hero Section */}
      {heroSection && (
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {heroSection.heading.split(' ').map((word) => 
              word === 'PhoneFront' ? (
                <span key={word} className="text-primary">{word}</span>
              ) : (
                <span key={word}> {word}</span>
              )
            )}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {heroSection.subheading}
          </p>
        </div>
      )}

      {/* Why Join Section */}
      {whyJoinSection && (
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl font-semibold text-foreground text-center mb-12">
            {whyJoinSection.heading}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyJoinSection.items.map((item) => (
              <div key={item._metadata.uid} className="bg-card rounded-xl p-6 border border-border text-center hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <div dangerouslySetInnerHTML={{ __html: item.icon_svg }} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Perks & Benefits Section */}
      {perksSection && (
        <div className="max-w-5xl mx-auto mb-20">
          <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-2xl p-8 md:p-12 border border-border">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 text-center">
              {perksSection.heading}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {perksSection.benefits.map((benefit) => (
                <div key={benefit._metadata.uid} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Open Positions */}
      {positionsSection && (
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl font-semibold text-foreground text-center mb-12">
            {positionsSection.heading}
          </h2>
          <div className="space-y-4">
            {positionsSection.positions.map((position) => (
              <div 
                key={position._metadata.uid}
                className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {position.title}
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      {position.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {position.department}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                        {position.location}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                        {position.type}
                      </span>
                    </div>
                  </div>
                  <a
                    href={position.apply_link.href}
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
                  >
                    {position.apply_link.title}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      {ctaSection && (
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl p-8 md:p-12 border border-border">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              {ctaSection.heading}
            </h2>
            <p className="text-muted-foreground mb-6">
              {ctaSection.description}
            </p>
            {ctaSection.button && ctaSection.button.length > 0 && (
              <a 
                href={ctaSection.button[0].button_link.href} 
                className="inline-flex items-center justify-center px-6 py-3 bg-card text-foreground border border-border rounded-lg font-medium hover:bg-secondary transition-colors"
              >
                {ctaSection.button[0].button_text}
              </a>
            )}
          </div>
        </div>
      )}
      </div>
    </main>
  )
}
