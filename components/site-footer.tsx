"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Footer, FooterCategory, FooterSocialPlatform } from "@/lib/types"

export function SiteFooter() {
  const [footerData, setFooterData] = useState<Footer | null>(null)

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch("/api/footer")
        if (response.ok) {
          const data = await response.json()
          console.log("Full footer data received:", data)
          console.log("Data structure check - has navigation_links?", !!data.navigation_links)
          console.log("Data structure check - has social_media_links?", !!data.social_media_links)
          setFooterData(data)
        }
      } catch (error) {
        console.error("Error fetching footer data:", error)
      }
    }

    fetchFooterData()
  }, [])

  // Don't render until we have data from Contentstack
  if (!footerData) {
    return null
  }

  const categories = footerData.navigation_links?.categories || []
  const socialPlatforms = footerData.social_media_links?.social_platform || []
  const contactInfo = footerData.contact_information
  const copyrightNotice = footerData.copyright_notice || `© ${new Date().getFullYear()} PhoneFront. All rights reserved.`

  return (
    <footer className="mt-16 w-full bg-secondary/30 border-t border-border">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-3">
        {/* Logo and Contact Info Section */}
        <div className="space-y-4">
          {footerData.footer_logo && (
            <div className="flex items-center gap-2 mb-4">
              <Image 
                src={footerData.footer_logo.url} 
                alt={footerData.footer_logo.title}
                width={220}
                height={88}
                className="h-auto w-auto max-w-[160px] sm:max-w-[200px] md:max-w-[220px]"
                priority
              />
            </div>
          )}
          
          {contactInfo && (
            <div className="space-y-2 text-sm text-muted-foreground">
              {contactInfo.email && (
                <p>
                  <span className="font-medium text-foreground">Email:</span>{" "}
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-primary">
                    {contactInfo.email}
                  </a>
                </p>
              )}
              {contactInfo.phone && (
                <p>
                  <span className="font-medium text-foreground">Phone:</span>{" "}
                  <a href={`tel:${contactInfo.phone}`} className="hover:text-primary">
                    {contactInfo.phone}
                  </a>
                </p>
              )}
              {contactInfo.address && (
                <p>
                  <span className="font-medium text-foreground">Address:</span>{" "}
                  {contactInfo.address}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Navigation Links - Dynamic Categories */}
        {categories.map((category: FooterCategory) => (
          <div key={category._metadata.uid}>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              {category.category_name}
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {category.links?.map((link) => (
                <li key={link._metadata.uid}>
                  <Link href={link.link_url.href} className="hover:text-primary">
                    {link.link_text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Social Media Links */}
      {socialPlatforms.length > 0 && (
        <div className="border-t border-border py-6">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center gap-6">
              {socialPlatforms.map((platform: FooterSocialPlatform) => (
                <a
                  key={platform._metadata.uid}
                  href={platform.platform_url.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={platform.platform_name}
                >
                  <span className="text-sm font-medium">{platform.platform_name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Copyright Notice */}
      <div className="border-t border-border py-4">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          {copyrightNotice}
        </div>
      </div>
    </footer>
  )
}
