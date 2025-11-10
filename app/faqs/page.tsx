"use client"

import { useState, useEffect } from "react"
import type { FAQsPage } from "@/lib/types"
import { FullScreenLoader } from "@/components/ui/loader"

function FAQItem({ question, answer }: Readonly<{ question: string; answer: string }>) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left bg-card hover:bg-secondary/50 transition-colors"
      >
        <span className="font-medium text-foreground">{question}</span>
        <svg
          className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-card border-t border-border">
          <p className="text-muted-foreground leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQsPageComponent() {
  const [pageData, setPageData] = useState<FAQsPage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await fetch("/api/faqs_page")
        if (response.ok) {
          const data = await response.json()
          console.log("FAQs page data received:", data)
          setPageData(data)
        }
      } catch (error) {
        console.error("Error fetching FAQs page data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPageData()
  }, [])

  if (loading) {
    return <FullScreenLoader text="Loading FAQs Page..." variant="spinner" />
  }

  if (!pageData?.sections) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Unable to load FAQs page content.</p>
      </div>
    )
  }

  const heroSection = pageData.sections.find(s => s.hero_section)?.hero_section
  const searchSection = pageData.sections.find(s => s.search_section)?.search_section
  const faqCategoriesSection = pageData.sections.find(s => s.faq_categories_section)?.faq_categories_section
  const ctaSection = pageData.sections.find(s => s.cta_section)?.cta_section

  return (
    <main>
      <div className="container mx-auto px-4 py-12 md:py-16">
      {/* Hero Section */}
      {heroSection && (
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {heroSection.heading.split(' ').slice(0, 3).join(' ')}{' '}
            <span className="text-primary">{heroSection.heading.split(' ').slice(3).join(' ')}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {heroSection.subheading}
          </p>
        </div>
      )}

      {/* Search Box */}
      {searchSection && (
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <input
              type="text"
              placeholder={searchSection.placeholder_text}
              className="w-full px-6 py-4 pl-12 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      )}

      {/* FAQ Categories */}
      {faqCategoriesSection && (
        <div className="max-w-4xl mx-auto space-y-12">
          {faqCategoriesSection.categories.map((category, idx) => (
            <div key={category._metadata.uid}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">{idx + 1}</span>
                </div>
                <h2 className="text-2xl font-semibold text-foreground">
                  {category.category_name}
                </h2>
              </div>
              <div className="space-y-3">
                {category.questions.map((faq) => (
                  <FAQItem key={faq._metadata.uid} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA Section */}
      {ctaSection && (
        <div className="max-w-3xl mx-auto mt-20">
          <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl p-8 md:p-12 border border-border text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              {ctaSection.heading}
            </h2>
            <p className="text-muted-foreground mb-6">
              {ctaSection.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {ctaSection.buttons?.map((button, idx) => (
                <a 
                  key={button._metadata.uid}
                  href={button.button_link.href} 
                  className={idx === 0
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
