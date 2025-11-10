import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Smartphone, BatteryCharging, Camera, Monitor } from "lucide-react"
import type { Phone } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"
import { useLyticsTracking } from "@/hooks/use-lytics"

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

// Helper function to get color styles
function getColorStyles(colorClass: string) {
  const colorMap = {
    'bg-green-100': { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' },
    'bg-purple-100': { bg: '#f3e8ff', text: '#6b21a8', border: '#e9d5ff' },
    'bg-blue-100': { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe' },
    'bg-cyan-100': { bg: '#cffafe', text: '#155e75', border: '#a5f3fc' },
    'bg-orange-100': { bg: '#fed7aa', text: '#9a3412', border: '#fed7aa' },
    'bg-emerald-100': { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' },
    'bg-red-100': { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
    'bg-yellow-100': { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
    'bg-indigo-100': { bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe' }
  };

  for (const [key, colors] of Object.entries(colorMap)) {
    if (colorClass.includes(key)) {
      return colors;
    }
  }
  
  return { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' };
}

export function PhoneCard({ phone, searchQuery }: { readonly phone: Phone; searchQuery?: string }) {
  // Get Lytics tracking hook
  const lytics = useLyticsTracking()
  
  // Helper function to highlight search matches
  const highlightSearchMatch = (text: string, query?: string) => {
    if (!query?.trim()) return text
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-primary/20 text-primary font-medium px-1 rounded">
          {part}
        </mark>
      ) : part
    )
  }
  
  // Track phone view when card is clicked
  const handleCardClick = () => {
    try {
      // Try to determine position from parent (if available)
      // For now, we'll track without position as it requires more complex logic
      lytics.trackPhoneView(phone, {
        searchQuery: searchQuery,
        viewMode: 'grid', // Default to grid, can be enhanced later
      });
    } catch (error) {
      // Silently fail - don't break navigation
      console.warn('⚠️ [PHONE CARD] Error tracking phone view:', error);
    }
  }
  
  return (
    <Link 
      href={`/phone/${phone.slug}`} 
      className="block w-full h-full"
      onClick={handleCardClick}
    >
      <Card className="w-full h-full flex flex-col hover:shadow-xl transition-all duration-300 group border-2 hover:border-primary/30">
        <CardHeader className="pb-4">
          <div className="relative aspect-[4/3] rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
            {(() => {
              if (phone.images?.url) {
                return (
                  <Image
                    src={phone.images.url}
                    alt={phone.images.title || phone.name}
                    width={200}
                    height={160}
                    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                    priority={false}
                  />
                );
              }
              if (phone.image) {
                return (
                  <Image
                    src={phone.image}
                    alt={phone.name}
                    width={200}
                    height={160}
                    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                    priority={false}
                  />
                );
              }
              return <Smartphone aria-hidden className="h-10 w-10 text-muted-foreground" />;
            })()}
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="font-medium shadow-md backdrop-blur-sm bg-background/80">
                {highlightSearchMatch(phone.brand, searchQuery)}
              </Badge>
            </div>
          </div>
          <div className="mt-4">
            <CardTitle className="text-base line-clamp-2">
              {highlightSearchMatch(phone.name, searchQuery)}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-sm space-y-3 pb-4 flex-1 flex flex-col">
          <div className="text-2xl font-bold text-primary">{phone.price}</div>
          <div className="space-y-2 flex-1">
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
          
          {/* Display 3 most relevant taxonomies - fixed height container */}
          <div className="min-h-[60px] flex flex-col justify-end">
            {phone.taxonomies && phone.taxonomies.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {phone.taxonomies
                  .filter(taxonomy => 
                    ['phone', 'company'].includes(taxonomy.taxonomy_uid) && 
                    !['google', 'apple', 'samsung', 'oneplus', 'xiaomi', 'huawei', 'oppo', 'nokia'].includes(taxonomy.term_uid)
                  )
                  .slice(0, 3)
                  .map((taxonomy) => {
                    const colorClass = getTaxonomyColor(taxonomy.term_uid);
                    const colors = getColorStyles(colorClass);
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
                          backgroundColor: colors.bg,
                          color: colors.text,
                          borderColor: colors.border
                        }}
                      >
                        {formatTaxonomyLabel(taxonomy.term_uid)}
                      </button>
                    );
                  })}
              </div>
            ) : (
              <div className="h-[60px]"></div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-4 mt-auto">
          <Button className="w-full group/btn" variant="default">
            View Details
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
