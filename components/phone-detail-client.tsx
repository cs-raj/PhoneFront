"use client"

import { useState, useEffect } from "react"
import { Phone } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Smartphone, Battery, Camera, Monitor, Cpu, DollarSign, HardDrive, MemoryStick, Ruler, Wifi, Volume2, Zap, Droplets, Palette, Building2, Tag, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
type PhoneDetailClientProps = {
  slug: string
}

export function PhoneDetailClient({ slug }: PhoneDetailClientProps) {
  const [phone, setPhone] = useState<Phone | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPhone = async () => {
      try {
        setLoading(true)
        
        // Use the same approach as PhonesClient - let browser handle cookies automatically
        const apiUrl = `/api/phones?pageSize=100`
        console.log('📱 [PHONE DETAIL CLIENT] Fetching from:', apiUrl)
        console.log('📱 [PHONE DETAIL CLIENT] Using automatic cookie handling like PhonesClient')
        
        const response = await fetch(apiUrl, {
          cache: "no-store", // Same as PhonesClient
          credentials: 'include' // Ensure cookies are sent
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch phones: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('📱 [PHONE DETAIL CLIENT] API response:', {
          personalized: data.personalized,
          variantParam: data.variantParam,
          itemsCount: data.items?.length
        })
        
        const foundPhone = data.items.find((p: Phone) => p.slug === slug)
        
        if (!foundPhone) {
          setError("Phone not found")
        } else {
          console.log('📱 [PHONE DETAIL CLIENT] Found phone:', foundPhone.name)
          setPhone(foundPhone)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchPhone()
  }, [slug])

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <Link 
            href="/phones" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Phones
          </Link>
        </div>
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="h-8 bg-muted rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-muted rounded animate-pulse mb-4"></div>
                  <div className="h-6 bg-muted rounded animate-pulse w-32"></div>
                </div>
              </div>
            </div>
            <div className="h-96 bg-muted rounded-lg animate-pulse"></div>
            <div className="h-64 bg-muted rounded-lg animate-pulse"></div>
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-muted rounded-lg animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-10 bg-muted rounded animate-pulse"></div>
              <div className="h-9 bg-muted rounded animate-pulse"></div>
              <div className="h-9 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !phone) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <Link 
            href="/phones" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Phones
          </Link>
        </div>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Phone Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || "The phone you're looking for doesn't exist."}
          </p>
          <Link href="/phones">
            <Button>Browse All Phones</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <Link 
          href="/phones" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Phones
        </Link>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold">{phone.name}</h1>
                  <Badge variant="secondary">{phone.type}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">{phone.brand}</span>
                  </div>
                  <span>•</span>
                  <span>{phone.os}</span>
                  {phone.release_date && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(phone.release_date).toLocaleDateString()}</span>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Taxonomies */}
                {phone.taxonomies && phone.taxonomies.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {phone.taxonomies.map((taxonomy) => (
                      <Badge key={`${taxonomy.taxonomy_uid}-${taxonomy.term_uid}`} variant="secondary" className="text-sm">
                        <Tag className="h-3 w-3 mr-1" />
                        {taxonomy.term_uid}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="text-3xl font-bold text-primary">
                  {phone.price}
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative h-96 w-full rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center">
            {(() => {
              if (phone.images?.url) {
                return (
                  <Image
                    src={phone.images.url}
                    alt={phone.images.title || `${phone.name} hero image`}
                    width={600}
                    height={400}
                    className="w-full h-full object-contain rounded-lg"
                    priority={true}
                  />
                );
              }
              if (phone.image) {
                return (
                  <Image
                    src={phone.image}
                    alt={`${phone.name} hero image`}
                    width={600}
                    height={400}
                    className="w-full h-full object-contain rounded-lg"
                    priority={true}
                  />
                );
              }
              return (
                <Image
                  src="/smartphone-product-render.jpg"
                  alt={`${phone.name} hero image`}
                  width={600}
                  height={400}
                  className="w-full h-full object-contain rounded-lg"
                  priority={true}
                />
              );
            })()}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Full Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Display & Design */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Display & Design</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Display</div>
                      <div className="text-sm text-muted-foreground">{phone.specs.display}</div>
                    </div>
                  </div>
                  {phone.specs.screen_size && (
                    <div className="flex items-center gap-3">
                      <Ruler className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Screen Size</div>
                        <div className="text-sm text-muted-foreground">{phone.specs.screen_size}</div>
                      </div>
                    </div>
                  )}
                  {phone.specs.display_type && (
                    <div className="flex items-center gap-3">
                      <Monitor className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Display Type</div>
                        <div className="text-sm text-muted-foreground">{phone.specs.display_type}</div>
                      </div>
                    </div>
                  )}
                  {phone.specs.resolution && (
                    <div className="flex items-center gap-3">
                      <Monitor className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Resolution</div>
                        <div className="text-sm text-muted-foreground">{phone.specs.resolution}</div>
                      </div>
                    </div>
                  )}
                  {phone.specs.refresh_rate && (
                    <div className="flex items-center gap-3">
                      <Monitor className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Refresh Rate</div>
                        <div className="text-sm text-muted-foreground">{phone.specs.refresh_rate}</div>
                      </div>
                    </div>
                  )}
                  {phone.specs.weight && (
                    <div className="flex items-center gap-3">
                      <Ruler className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Weight</div>
                        <div className="text-sm text-muted-foreground">{phone.specs.weight}</div>
                      </div>
                    </div>
                  )}
                  {phone.specs.dimensions && (
                    <div className="flex items-center gap-3">
                      <Ruler className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Dimensions</div>
                        <div className="text-sm text-muted-foreground">{phone.specs.dimensions}</div>
                      </div>
                    </div>
                  )}
                  {phone.specs.colors && (
                    <div className="flex items-center gap-3">
                      <Palette className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Available Colors</div>
                        <div className="text-sm text-muted-foreground">{phone.specs.colors}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Performance */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Performance</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Cpu className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Operating System</div>
                      <div className="text-sm text-muted-foreground">{phone.os}</div>
                    </div>
                  </div>
                  {phone.specs.processor && (
                    <div className="flex items-center gap-3">
                      <Cpu className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Processor</div>
                        <div className="text-sm text-muted-foreground">{phone.specs.processor}</div>
                      </div>
                    </div>
                  )}
                  {phone.specs.ram && (
                    <div className="flex items-center gap-3">
                      <MemoryStick className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">RAM</div>
                        <div className="text-sm text-muted-foreground">{phone.specs.ram}</div>
                      </div>
                    </div>
                  )}
                  {phone.specs.storage && (
                    <div className="flex items-center gap-3">
                      <HardDrive className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Storage</div>
                        <div className="text-sm text-muted-foreground">{phone.specs.storage}</div>
                      </div>
                    </div>
                  )}
                  {phone.specs.gpu && (
                    <div className="flex items-center gap-3">
                      <Cpu className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">GPU</div>
                        <div className="text-sm text-muted-foreground">{phone.specs.gpu}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Camera & Audio */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Camera & Audio</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Camera className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Camera</div>
                      <div className="text-sm text-muted-foreground">{phone.specs.camera}</div>
                    </div>
                  </div>
                  {phone.specs.audio && (
                    <div className="flex items-center gap-3">
                      <Volume2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Audio</div>
                        <div className="text-sm text-muted-foreground">{phone.specs.audio}</div>
                      </div>
                    </div>
                  )}
                  {phone.specs.main_camera && (
                    <div className="flex items-center gap-3">
                      <Camera className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Main Camera</div>
                        <div className="text-sm text-muted-foreground">{phone.specs.main_camera}</div>
                      </div>
                    </div>
                  )}
                  {phone.specs.ultra_wide_camera && (
                    <div className="flex items-center gap-3">
                      <Camera className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Ultra-wide Camera</div>
                        <div className="text-sm text-muted-foreground">{phone.specs.ultra_wide_camera}</div>
                      </div>
                    </div>
                  )}
                  {phone.specs.telephoto_camera && (
                    <div className="flex items-center gap-3">
                      <Camera className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Telephoto Camera</div>
                        <div className="text-sm text-muted-foreground">{phone.specs.telephoto_camera}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Battery & Connectivity */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Battery & Connectivity</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Battery className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Battery</div>
                      <div className="text-sm text-muted-foreground">{phone.specs.battery}</div>
                    </div>
                  </div>
                  {phone.specs.battery_capacity && (
                    <div className="flex items-center gap-3">
                      <Battery className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Battery Capacity</div>
                        <div className="text-sm text-muted-foreground">{phone.specs.battery_capacity}</div>
                      </div>
                    </div>
                  )}
                  {phone.specs.charging && (
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Wired Charging</div>
                        <div className="text-sm text-muted-foreground">{phone.specs.charging}</div>
                      </div>
                    </div>
                  )}
                  {phone.specs.wireless_charging && (
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Wireless Charging</div>
                        <div className="text-sm text-muted-foreground">{phone.specs.wireless_charging}</div>
                      </div>
                    </div>
                  )}
                  {phone.specs.connectivity && (
                    <div className="flex items-center gap-3">
                      <Wifi className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Connectivity</div>
                        <div className="text-sm text-muted-foreground">{phone.specs.connectivity}</div>
                      </div>
                    </div>
                  )}
                  {phone.specs.water_resistance && (
                    <div className="flex items-center gap-3">
                      <Droplets className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Water Resistance</div>
                        <div className="text-sm text-muted-foreground">{phone.specs.water_resistance}</div>
                      </div>
                    </div>
                  )}
                  {phone.specs.sensors && (
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Sensors</div>
                        <div className="text-sm text-muted-foreground">{phone.specs.sensors}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Specifications */}
              {Object.keys(phone.specs).some(key => 
                !['display', 'battery', 'camera', 'processor', 'ram', 'gpu', 'screen_size', 'display_type', 'resolution', 'refresh_rate', 'weight', 'dimensions', 'colors', 'main_camera', 'ultra_wide_camera', 'telephoto_camera', 'battery_capacity', 'charging', 'wireless_charging', 'connectivity', 'sensors', 'audio', 'water_resistance'].includes(key) && 
                phone.specs[key as keyof typeof phone.specs] && 
                typeof phone.specs[key as keyof typeof phone.specs] === 'string'
              ) && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Additional Specifications</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {Object.keys(phone.specs).map(key => {
                      const value = phone.specs[key as keyof typeof phone.specs];
                      if (
                        !['display', 'battery', 'camera', 'processor', 'ram', 'gpu', 'screen_size', 'display_type', 'resolution', 'refresh_rate', 'weight', 'dimensions', 'colors', 'main_camera', 'ultra_wide_camera', 'telephoto_camera', 'battery_capacity', 'charging', 'wireless_charging', 'connectivity', 'sensors', 'audio', 'water_resistance'].includes(key) && 
                        value && 
                        typeof value === 'string'
                      ) {
                        return (
                          <div key={key} className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <div className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</div>
                              <div className="text-sm text-muted-foreground">{value}</div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description and Features */}
          {(phone.description || phone.features || phone.highlights) && (
            <Card>
              <CardHeader>
                <CardTitle>Description & Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {phone.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">{phone.description}</p>
                  </div>
                )}
                {phone.features && phone.features.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {phone.features.map((feature) => (
                        <li key={feature} className="text-sm text-muted-foreground">{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {phone.highlights && phone.highlights.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Highlights</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {phone.highlights.map((highlight) => (
                        <li key={highlight} className="text-sm text-muted-foreground">{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Brand</span>
                <span className="font-medium">{phone.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <Badge variant="outline">{phone.type}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">OS</span>
                <span className="font-medium">{phone.os}</span>
              </div>
              {phone.release_date && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Release Date</span>
                  <span className="font-medium">{new Date(phone.release_date).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="font-bold text-lg">{phone.price}</span>
              </div>
              {phone.taxonomies && phone.taxonomies.length > 0 && (
                <div>
                  <span className="text-sm text-muted-foreground block mb-2">Categories</span>
                  <div className="flex flex-wrap gap-1">
                    {phone.taxonomies.slice(0, 4).map((taxonomy) => (
                      <Badge key={`${taxonomy.taxonomy_uid}-${taxonomy.term_uid}`} variant="secondary" className="text-xs">
                        {taxonomy.term_uid}
                      </Badge>
                    ))}
                    {phone.taxonomies.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{phone.taxonomies.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="space-y-3">
            <Button className="w-full" size="lg">
              <DollarSign className="h-4 w-4 mr-2" />
              Buy Now
            </Button>
            
            <Button variant="outline" className="w-full">
              <Smartphone className="h-4 w-4 mr-2" />
              Compare with Similar
            </Button>
            
            <Link href="/phones">
              <Button variant="outline" className="w-full">
                Browse All Phones
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}