'use client'

import { useState } from "react"
import { Loader, FullScreenLoader, PageLoader } from "@/components/ui/loader"

export default function GradientDemoPage() {
  const [showFullScreen, setShowFullScreen] = useState(false)

  const gradientClasses = [
    'bg-gradient-to-br from-background via-background to-primary/5',
    'bg-gradient-to-br from-background via-background to-accent/5', 
    'bg-gradient-to-br from-background via-background to-primary/10',
    'bg-gradient-to-br from-background via-background to-accent/10',
    'bg-gradient-to-br from-background via-background to-primary/3',
    'bg-gradient-to-br from-background via-background to-accent/3'
  ]

  const loaderVariants = ['spinner', 'dots', 'pulse', 'wave', 'phone'] as const

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
          🎨 Gradient & Loader Demo
        </h1>
        
        {/* Gradient Showcase */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Gradient Backgrounds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gradientClasses.map((gradientClass) => (
              <div key={gradientClass} className={`${gradientClass} rounded-lg p-8 min-h-[200px] flex items-center justify-center`}>
                <div className="text-center">
                  <div className="text-lg font-semibold text-foreground mb-2">
                    {gradientClass.includes('primary/5') ? 'PRIMARY/5' : 
                     gradientClass.includes('accent/5') ? 'ACCENT/5' :
                     gradientClass.includes('primary/10') ? 'PRIMARY/10' :
                     gradientClass.includes('accent/10') ? 'ACCENT/10' :
                     gradientClass.includes('primary/3') ? 'PRIMARY/3' : 'ACCENT/3'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Beautiful gradient background
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Loader Showcase */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Loader Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loaderVariants.map((variant) => (
              <div key={variant} className="bg-gradient-to-br from-background via-background to-primary/5 rounded-lg p-8 text-center">
                <h3 className="text-lg font-semibold mb-4 text-foreground capitalize">
                  {variant} Loader
                </h3>
                <Loader 
                  variant={variant} 
                  size="lg" 
                  text={`${variant} loading...`}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Interactive Demo</h2>
          <div className="bg-gradient-to-br from-background via-background to-primary/5 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-4 text-foreground">
              Full Screen Loader Demo
            </h3>
            <p className="text-muted-foreground mb-6">
              Click the button below to see the full screen loader in action
            </p>
            <button
              onClick={() => setShowFullScreen(true)}
              className="bg-primary/20 hover:bg-primary/30 text-foreground font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Show Full Screen Loader
            </button>
          </div>
        </section>

        {/* Page Loader Demo */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Page Loader</h2>
          <div className="bg-gradient-to-br from-background via-background to-primary/5 rounded-lg p-8">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              This section uses the page loader style
            </h3>
            <PageLoader text="Page loading example..." />
          </div>
        </section>
      </div>

      {/* Full Screen Loader Modal */}
      {showFullScreen && (
        <FullScreenLoader 
          text="Loading Demo Page..." 
          variant="spinner"
        />
      )}

      {/* Auto-hide full screen loader after 3 seconds */}
      {showFullScreen && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowFullScreen(false)}
            className="bg-primary/20 hover:bg-primary/30 text-foreground font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Close Loader
          </button>
        </div>
      )}
    </div>
  )
}
