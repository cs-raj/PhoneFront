"use client"

import { useEffect, useState } from "react"
import type { AboutPage } from "@/lib/types"
import { FullScreenLoader } from "@/components/ui/loader"

export default function AboutPageComponent() {
  const [pageData, setPageData] = useState<AboutPage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await fetch("/api/about_page")
        if (response.ok) {
          const data = await response.json()
          console.log("About page data received:", data)
          setPageData(data)
        }
      } catch (error) {
        console.error("Error fetching about page data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPageData()
  }, [])

  if (loading) {
    return <FullScreenLoader text="Loading About Page..." variant="spinner" />
  }

  if (!pageData?.sections) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Unable to load about page content.</p>
      </div>
    )
  }

  const heroSection = pageData.sections.find(s => s.hero_section)?.hero_section
  const missionSection = pageData.sections.find(s => s.mission_section)?.mission_section
  const whatWeDoSection = pageData.sections.find(s => s.what_we_do_section)?.what_we_do_section
  const valuesSection = pageData.sections.find(s => s.values_section)?.values_section
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

      {/* Mission Section */}
      {missionSection && (
        <div className="max-w-5xl mx-auto mb-20">
          <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-2xl p-8 md:p-12 border border-border">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              {missionSection.heading}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {missionSection.description}
            </p>
          </div>
        </div>
      )}

      {/* What We Do Section */}
      {whatWeDoSection && (
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl font-semibold text-foreground text-center mb-12">
            {whatWeDoSection.heading}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {whatWeDoSection.items.map((item) => (
              <div key={item._metadata.uid} className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <div dangerouslySetInnerHTML={{ __html: item.icon_svg }} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Values Section */}
      {valuesSection && (
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl font-semibold text-foreground text-center mb-12">
            {valuesSection.heading}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {valuesSection.values.map((value) => (
              <div key={value._metadata.uid} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                  <span className="text-primary font-semibold">{value.number}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {ctaSection.buttons?.map((button) => (
                <a 
                  key={button._metadata.uid}
                  href={button.button_url} 
                  className={button._metadata.uid.includes('82eb') 
                    ? "inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    : "inline-flex items-center justify-center px-6 py-3 bg-card text-foreground border border-border rounded-lg font-medium hover:bg-secondary transition-colors"
                  }
                >
                  {button.button_text}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
      </div>
    </main>
  )
}
