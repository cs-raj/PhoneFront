"use client"

import useSWR from "swr"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BatteryCharging, Camera, Monitor } from "lucide-react"
import Link from "next/link"

const formatTaxonomyLabel = (term: string) => {
  const labelMap: Record<string, string> = {
    // OS
    android: "Android",
    ios: "iOS",
    
    // Phone Types
    compact: "Compact",
    rugged: "Rugged", 
    camera: "Camera",
    gaming: "Gaming",
    flagship: "Flagship",
    budget: "Budget",
    mid_level: "Mid-level",
    
    // Features
    water_resistant: "Water Resistant",
    wireless_charging: "Wireless Charging",
    stylus_support: "Stylus Support",
    foldable: "Foldable",
    "5g": "5G",
    
    // Screen Types
    mini_led: "Mini LED",
    micro_led: "Micro LED",
    oled: "OLED",
    lcd: "LCD",
    led: "LED",
    
    // Release Status
    discontinued: "Discontinued",
    upcoming: "Upcoming",
    available: "Available",
    announced: "Announced",
    
    // Price Ranges
    "0_300": "$0-300",
    "300_600": "$300-600", 
    "600_2000": "$600-2000",
    
    // Companies
    google: "Google",
    apple: "Apple",
    samsung: "Samsung",
    oneplus: "OnePlus",
    xiaomi: "Xiaomi"
  }
  
  return labelMap[term] || term.charAt(0).toUpperCase() + term.slice(1).replace(/_/g, ' ')
}

const getTaxonomyColor = (term: string) => {
  // OS colors
  if (['android', 'ios'].includes(term)) {
    return 'bg-green-100 text-green-800 border-green-200'
  }
  
  // Phone type colors
  if (['flagship', 'gaming', 'camera'].includes(term)) {
    return 'bg-purple-100 text-purple-800 border-purple-200'
  }
  if (['budget', 'mid_level'].includes(term)) {
    return 'bg-blue-100 text-blue-800 border-blue-200'
  }
  
  // Feature colors
  if (['5g', 'water_resistant', 'wireless_charging'].includes(term)) {
    return 'bg-cyan-100 text-cyan-800 border-cyan-200'
  }
  
  // Screen type colors
  if (['oled', 'mini_led', 'micro_led'].includes(term)) {
    return 'bg-orange-100 text-orange-800 border-orange-200'
  }
  
  // Release status colors
  if (['available'].includes(term)) {
    return 'bg-emerald-100 text-emerald-800 border-emerald-200'
  }
  if (['discontinued'].includes(term)) {
    return 'bg-red-100 text-red-800 border-red-200'
  }
  if (['upcoming', 'announced'].includes(term)) {
    return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  }
  
  // Price colors
  if (['0_300', '300_600', '600_2000'].includes(term)) {
    return 'bg-indigo-100 text-indigo-800 border-indigo-200'
  }
  
  // Default color
  return 'bg-gray-100 text-gray-800 border-gray-200'
}

type Phone = {
  id: string
  slug: string
  name: string
  brand: string
  type: "Flagship" | "Mid-range" | "Budget" | "Gaming"
  os: "iOS" | "Android"
  price: number
  specs: {
    display: string
    battery: string
    camera: string
    processor?: string
    ram?: string
    storage?: string
    screen_size?: string
    resolution?: string
    refresh_rate?: string
    weight?: string
    dimensions?: string
    connectivity?: string
    sensors?: string
    audio?: string
    charging?: string
    water_resistance?: string
    colors?: string
  }
  image?: string
  createdAt?: string
  description?: string
  features?: string[]
  highlights?: string[]
  taxonomies?: Array<{
    taxonomy_uid: string
    term_uid: string
  }>
  company?: Array<{
    uid: string
    _content_type_uid: string
  }>
  raw_price?: string
  release_date?: string
  seo_meta?: {
    title: string
    description: string
    keywords: string[]
  }
  images?: {
    uid: string
    url: string
    title?: string
    filename?: string
    content_type?: string
    file_size?: string
  }
}

type PhonesResponse = { items: Phone[]; total: number }

const fetcher = (url: string) => fetch(url).then((r) => r.json() as Promise<PhonesResponse>)

export function LatestPhones() {
  const { data, error, isLoading } = useSWR<PhonesResponse>("/api/phones?limit=12", fetcher)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={`skeleton-${i}`} className="animate-pulse bg-muted rounded-xl h-96" />
        ))}
      </div>
    )
  }

  if (error || !data?.items?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No phones available at the moment.</p>
      </div>
    )
  }

  const items = data.items

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((phone) => (
        <Card key={phone.id} className="h-full flex flex-col hover:shadow-xl transition-all duration-300 group border-2 hover:border-primary/30">
          <CardHeader className="pb-4">
            <div className="relative aspect-[4/3] rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
              <img
                src={phone.images?.url || phone.image || "/smartphone-product-render.jpg"}
                alt={phone.images?.title || phone.name}
                className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="font-medium shadow-md backdrop-blur-sm bg-background/80">
                  {phone.brand}
                </Badge>
              </div>
            </div>
            <div className="mt-4">
              <CardTitle className="text-base line-clamp-2">
                <Link
                  href={`/phone/${phone.slug}`}
                  className="hover:text-primary transition-colors"
                  aria-label={`View ${phone.name}`}
                >
                  {phone.name}
                </Link>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm space-y-3 pb-4 flex-1">
            <div className="text-2xl font-bold text-primary">{phone.price}</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Monitor className="h-4 w-4 text-primary" aria-hidden />
                <span className="text-xs">{phone.specs.display}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <BatteryCharging className="h-4 w-4 text-accent" aria-hidden />
                <span className="text-xs">{phone.specs.battery}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Camera className="h-4 w-4 text-primary" aria-hidden />
                <span className="text-xs">{phone.specs.camera}</span>
              </div>
            </div>
            
            {/* Display 3 most relevant taxonomies */}
        {phone.taxonomies && phone.taxonomies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {phone.taxonomies
              .filter(taxonomy =>
                ['phone', 'company'].includes(taxonomy.taxonomy_uid) &&
                !['google', 'apple', 'samsung', 'oneplus', 'xiaomi', 'huawei', 'oppo', 'nokia'].includes(taxonomy.term_uid)
              )
              .slice(0, 3)
              .map((taxonomy) => {
                const colorClass = getTaxonomyColor(taxonomy.term_uid);
                return (
                  <button
                    key={`${taxonomy.taxonomy_uid}-${taxonomy.term_uid}`}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 hover:scale-105 hover:shadow-sm cursor-pointer ${colorClass}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // You can add click functionality here, like filtering or navigation
                      console.log('Clicked taxonomy:', taxonomy.term_uid);
                    }}
                    style={{
                      backgroundColor: colorClass.includes('bg-green-100') ? '#dcfce7' : 
                                     colorClass.includes('bg-purple-100') ? '#f3e8ff' :
                                     colorClass.includes('bg-blue-100') ? '#dbeafe' :
                                     colorClass.includes('bg-cyan-100') ? '#cffafe' :
                                     colorClass.includes('bg-orange-100') ? '#fed7aa' :
                                     colorClass.includes('bg-emerald-100') ? '#d1fae5' :
                                     colorClass.includes('bg-red-100') ? '#fee2e2' :
                                     colorClass.includes('bg-yellow-100') ? '#fef3c7' :
                                     colorClass.includes('bg-indigo-100') ? '#e0e7ff' : '#f3f4f6',
                      color: colorClass.includes('text-green-800') ? '#166534' :
                             colorClass.includes('text-purple-800') ? '#6b21a8' :
                             colorClass.includes('text-blue-800') ? '#1e40af' :
                             colorClass.includes('text-cyan-800') ? '#155e75' :
                             colorClass.includes('text-orange-800') ? '#9a3412' :
                             colorClass.includes('text-emerald-800') ? '#065f46' :
                             colorClass.includes('text-red-800') ? '#991b1b' :
                             colorClass.includes('text-yellow-800') ? '#92400e' :
                             colorClass.includes('text-indigo-800') ? '#3730a3' : '#374151',
                      borderColor: colorClass.includes('border-green-200') ? '#bbf7d0' :
                                  colorClass.includes('border-purple-200') ? '#e9d5ff' :
                                  colorClass.includes('border-blue-200') ? '#bfdbfe' :
                                  colorClass.includes('border-cyan-200') ? '#a5f3fc' :
                                  colorClass.includes('border-orange-200') ? '#fed7aa' :
                                  colorClass.includes('border-emerald-200') ? '#a7f3d0' :
                                  colorClass.includes('border-red-200') ? '#fecaca' :
                                  colorClass.includes('border-yellow-200') ? '#fde68a' :
                                  colorClass.includes('border-indigo-200') ? '#c7d2fe' : '#e5e7eb'
                    }}
                  >
                    {formatTaxonomyLabel(taxonomy.term_uid)}
                  </button>
                );
              })}
          </div>
        )}
          </CardContent>
          <CardFooter className="mt-auto pt-4">
            <Button asChild className="w-full group/btn" variant="default">
              <Link href={`/phone/${phone.slug}`} aria-label={`View details for ${phone.name}`}>
                View Details
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
