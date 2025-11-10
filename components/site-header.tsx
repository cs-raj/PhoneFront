"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Header, HeaderLink } from "@/lib/types"
import { Menu, X } from "lucide-react"
import { useLyticsTracking } from "@/hooks/use-lytics"

type NavItem = {
  href: string
  label: string
}

export function SiteHeader() {
  const pathname = usePathname()
  const [headerData, setHeaderData] = useState<Header | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Get Lytics tracking hook
  const lytics = useLyticsTracking()

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const response = await fetch("/api/header")
        if (response.ok) {
          const data = await response.json()
          console.log("Full header data received:", data)
          console.log("Data structure check - has group?", !!data.group)
          console.log("Data structure check - group length:", data.group?.length)
          setHeaderData(data)
        }
      } catch (error) {
        console.error("Error fetching header data:", error)
      }
    }

    fetchHeaderData()
  }, [])

  const link = (href: string, label: string, isMobile = false) => {
    const isActive = pathname === href
    return (
      <Link
        href={href}
        onClick={() => {
          try {
            // Track navigation click
            lytics.trackNavigation(href, label);
          } catch (error) {
            // Silently fail - don't break navigation
            console.warn('⚠️ [SITE HEADER] Error tracking navigation:', error);
          }
          if (isMobile) {
            setMobileMenuOpen(false);
          }
        }}
        className={`hover:text-primary ${isActive ? "text-primary font-medium" : "text-muted-foreground"}`}
      >
        {label}
      </Link>
    )
  }

  // Convert header data to nav items
  const getNavItems = (): NavItem[] => {
    if (headerData?.group) {
      console.log("Header data:", headerData.group)
      return headerData.group.map((item: HeaderLink) => ({
        href: item.link.href,
        label: item.link.title
      }))
    }
    return []
  }

  const navItems = getNavItems()
  console.log("Nav items:", navItems)
  console.log("Header title:", headerData?.title)
  
  // Use title from Contentstack
  const headerTitle = headerData?.title
  
  // Don't render until we have data from Contentstack
  if (!headerData) {
    return null
  }
  
  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/" className="font-semibold text-lg tracking-tight">
          <span className="text-primary">{headerTitle}</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
          {navItems.map((item, index) => (
            <div key={`${item.href}-${index}`}>
              {link(item.href, item.label)}
            </div>
          ))}
        </nav>

        {/* Desktop Search */}
        <div className="hidden sm:block ml-auto w-48 md:w-64">
          <input
            aria-label="Search"
            placeholder="Search phones, news, reviews..."
            className="w-full h-9 rounded-md border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => {
            try {
              // Track mobile menu toggle
              lytics.trackEvent('mobile_menu_toggled', {
                is_open: !mobileMenuOpen,
              });
            } catch (error) {
              // Silently fail - don't break menu functionality
              console.warn('⚠️ [SITE HEADER] Error tracking mobile menu toggle:', error);
            }
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className="ml-auto md:hidden p-2 hover:bg-secondary rounded-md transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navItems.map((item, index) => (
              <div key={`${item.href}-mobile-${index}`} className="text-sm">
                {link(item.href, item.label, true)}
              </div>
            ))}
            {/* Mobile Search */}
            <div className="pt-2 border-t border-border">
              <input
                aria-label="Search"
                placeholder="Search..."
                className="w-full h-9 rounded-md border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
