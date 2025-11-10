"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect, useMemo } from "react"
import useSWR from "swr"
import { usePersonalize } from "@/components/context/PersonalizeContext"
import { useLyticsTracking } from "@/hooks/use-lytics"

type Filters = {
  companies: string[]
  os: string[]
  priceRange: string[]
  features: string[]
  screenType: string[]
  phoneType: string[]
  releaseStatus: string[]
  priceMin: number
  priceMax: number
}

type PriceFilter = {
  id: string
  title: string
  minPrice: number
  maxPrice: number
  createdAt: string
  updatedAt: string
}

type PriceFiltersResponse = {
  items: PriceFilter[]
  total: number
  personalized: boolean
  variantParam: string | null
}

// Phone taxonomy-based filter options
const COMPANY_OPTIONS = [
  { value: "apple", label: "Apple" },
  { value: "samsung", label: "Samsung" },
  { value: "google", label: "Google" },
  { value: "oneplus", label: "OnePlus" },
  { value: "xiaomi", label: "Xiaomi" },
  { value: "huawei", label: "Huawei" },
  { value: "oppo", label: "Oppo" },
  { value: "vivo", label: "Vivo" },
  { value: "realme", label: "Realme" },
  { value: "nothing", label: "Nothing" },
  { value: "honor", label: "Honor" },
  { value: "redmi", label: "Redmi" },
  { value: "nokia", label: "Nokia" },
  { value: "sony", label: "Sony" },
  { value: "motorola", label: "Motorola" },
  { value: "asus", label: "Asus" },
  { value: "lenovo", label: "Lenovo" }
]

const OS_OPTIONS = [
  { value: "ios", label: "iOS" },
  { value: "android", label: "Android" }
]

// Dynamic price range options will be fetched from Contentstack

const FEATURES_OPTIONS = [
  { value: "water_resistant", label: "Water Resistant" },
  { value: "stylus_support", label: "Stylus Support" },
  { value: "wireless_charging", label: "Wireless Charging" },
  { value: "foldable", label: "Foldable" },
  { value: "5g", label: "5G" }
]

const SCREEN_TYPE_OPTIONS = [
  { value: "mini_led", label: "Mini LED" },
  { value: "micro_led", label: "Micro LED" },
  { value: "oled", label: "OLED" },
  { value: "lcd", label: "LCD" },
  { value: "led", label: "LED" }
]

const PHONE_TYPE_OPTIONS = [
  { value: "compact", label: "Compact" },
  { value: "rugged", label: "Rugged" },
  { value: "camera", label: "Camera" },
  { value: "gaming", label: "Gaming" },
  { value: "flagship", label: "Flagship" },
  { value: "mid_level", label: "Mid-level" },
  { value: "budget", label: "Budget" }
]

const RELEASE_STATUS_OPTIONS = [
  { value: "discontinued", label: "Discontinued" },
  { value: "upcoming", label: "Upcoming" },
  { value: "available", label: "Available" },
  { value: "announced", label: "Announced" }
]

export function PhoneFilters({
  initial,
  onApply,
}: {
  readonly initial: Filters
  readonly onApply: (f: Filters) => void
}) {
  const [companies, setCompanies] = useState<string[]>(initial.companies)
  const [os, setOs] = useState<string[]>(initial.os)
  const [priceRange, setPriceRange] = useState<string[]>(initial.priceRange)
  const [features, setFeatures] = useState<string[]>(initial.features)
  const [screenType, setScreenType] = useState<string[]>(initial.screenType)
  const [phoneType, setPhoneType] = useState<string[]>(initial.phoneType)
  const [releaseStatus, setReleaseStatus] = useState<string[]>(initial.releaseStatus)
  
  // Get personalization SDK
  const personalizeSdk = usePersonalize()
  
  // Get Lytics tracking hook
  const lytics = useLyticsTracking()

  // Function to determine budget category based on price range using API data
  // This works with both USD and INR by using the actual min/max prices from the API
  // to create proper 1/3rd partitions regardless of currency
  const getBudgetCategory = (minPrice: number, maxPrice: number): string => {
    // Get the actual min and max prices from the API data
    const apiMinPrice = priceRangeOptions.length > 0 ? Math.min(...priceRangeOptions.map(opt => opt.minPrice)) : 0
    const apiMaxPrice = priceRangeOptions.length > 0 ? Math.max(...priceRangeOptions.map(opt => opt.maxPrice)) : 2000
    
    // Calculate 1/3rd partitions based on actual API data
    const totalRange = apiMaxPrice - apiMinPrice
    
    // Handle edge case where all prices are the same
    if (totalRange === 0) {
      console.log(`💰 [BUDGET CATEGORY] All prices are the same (${apiMinPrice}), defaulting to 'mid'`)
      return 'mid'
    }
    
    const oneThird = totalRange / 3
    const twoThirds = (totalRange * 2) / 3
    
    const baseThreshold = apiMinPrice + oneThird
    const midThreshold = apiMinPrice + twoThirds
    
    const avgPrice = (minPrice + maxPrice) / 2
    
    console.log(`💰 [BUDGET CATEGORY] API Range: $${apiMinPrice}-$${apiMaxPrice}`)
    console.log(`💰 [BUDGET CATEGORY] Thresholds - Base: $${baseThreshold.toFixed(0)}, Mid: $${midThreshold.toFixed(0)}`)
    console.log(`💰 [BUDGET CATEGORY] User Range: $${minPrice}-$${maxPrice}, Avg: $${avgPrice.toFixed(0)}`)
    
    if (avgPrice <= baseThreshold) {
      console.log(`💰 [BUDGET CATEGORY] Result: 'low' (avg: $${avgPrice.toFixed(0)} <= $${baseThreshold.toFixed(0)})`)
      return 'low'
    } else if (avgPrice <= midThreshold) {
      console.log(`💰 [BUDGET CATEGORY] Result: 'mid' (avg: $${avgPrice.toFixed(0)} <= $${midThreshold.toFixed(0)})`)
      return 'mid'
    } else {
      console.log(`💰 [BUDGET CATEGORY] Result: 'high' (avg: $${avgPrice.toFixed(0)} > $${midThreshold.toFixed(0)})`)
      return 'high'
    }
  }
  
  // Log component initialization
  useEffect(() => {
    console.log('💰 [PHONE FILTERS] ==========================================');
    console.log('💰 [PHONE FILTERS] PhoneFilters component initialized');
    console.log('💰 [PHONE FILTERS] Initial filters:', initial);
    console.log('💰 [PHONE FILTERS] Initial price range:', { min: initial.priceMin, max: initial.priceMax });
    
    // Test budget category calculation immediately
    console.log('💰 [PHONE FILTERS] Testing budget category calculation...');
    
    // Test getBudgetCategory function directly (only if priceRangeOptions is available)
    if (priceRangeOptions.length > 0) {
      const testCategory = getBudgetCategory(initial.priceMin, initial.priceMax);
      console.log('💰 [PHONE FILTERS] Direct test - budget category:', testCategory);
      // Also log to server for debugging
      console.log('💰 [CLIENT] Budget category calculated:', testCategory);
    } else {
      console.log('💰 [PHONE FILTERS] Price range options not available yet, skipping direct test');
      console.log('💰 [CLIENT] Price range options not available yet');
    }
    
    setBudgetAttribute(initial.priceMin, initial.priceMax);
  }, []);

  // Log when personalization SDK becomes available
  useEffect(() => {
    console.log('💰 [PHONE FILTERS] Personalization SDK status changed:', {
      available: !!personalizeSdk,
      timestamp: new Date().toISOString()
    });
    
    if (personalizeSdk) {
      console.log('💰 [PHONE FILTERS] Personalization SDK is now available - budget personalization ready');
      // Set budget attribute when SDK becomes available
      setBudgetAttribute(range[0], range[1]);
    } else {
      console.log('💰 [PHONE FILTERS] Personalization SDK not available - budget personalization disabled');
    }
  }, [personalizeSdk])
  // Fetch dynamic price filters from Contentstack
  const { data: priceFiltersData } = useSWR<PriceFiltersResponse>(
    '/api/price-filters',
    async (url: string) => {
      console.log('💰 [PHONE FILTERS] Fetching price filters from:', url);
      const response = await fetch(url)
      if (!response.ok) {
        console.error('💰 [PHONE FILTERS] Failed to fetch price filters:', response.status, response.statusText);
        throw new Error('Failed to fetch price filters')
      }
      const data = await response.json();
      console.log('💰 [PHONE FILTERS] Received price filters data:', data);
      return data;
    }
  )

  // Generate price range options from Contentstack data
  const priceRangeOptions = useMemo(() => {
    console.log('💰 [PHONE FILTERS] Generating price range options from data:', priceFiltersData);
    
    if (!priceFiltersData?.items) {
      console.log('💰 [PHONE FILTERS] No price filter items available, using empty array');
      return [];
    }
    
    const options = priceFiltersData.items.map((filter) => ({
      value: `${filter.minPrice}_${filter.maxPrice}`,
      label: `${filter.minPrice}-${filter.maxPrice}`,
      minPrice: filter.minPrice,
      maxPrice: filter.maxPrice
    }));
    
    console.log('💰 [PHONE FILTERS] Generated price range options:', options);
    return options;
  }, [priceFiltersData?.items])

  // Initialize range with actual values from initial filters
  const [range, setRange] = useState<number[]>([initial.priceMin, initial.priceMax])
  const [min, max] = range

  // Update range when initial values change (from URL parsing)
  useEffect(() => {
    setRange([initial.priceMin, initial.priceMax])
  }, [initial.priceMin, initial.priceMax])

  // Update range when API data becomes available (for personalized content)
  useEffect(() => {
    if (priceFiltersData?.items && priceFiltersData.items.length > 0) {
      const apiMin = Math.min(...priceFiltersData.items.map(item => item.minPrice));
      const apiMax = Math.max(...priceFiltersData.items.map(item => item.maxPrice));
      
      console.log('💰 [PHONE FILTERS] Updating range from API data:', {
        apiMin,
        apiMax,
        currentRange: range,
        personalized: priceFiltersData.personalized,
        variantParam: priceFiltersData.variantParam
      });
      
      // Only update if the API data provides a different range than the current one
      if (apiMin !== range[0] || apiMax !== range[1]) {
        setRange([apiMin, apiMax]);
        console.log('💰 [PHONE FILTERS] Range updated to:', [apiMin, apiMax]);
      }
      
      // Set budget attribute with the current range
      setBudgetAttribute(range[0], range[1]);
    }
  }, [priceFiltersData?.items, priceFiltersData?.personalized, priceFiltersData?.variantParam])

  // Test budget category when priceRangeOptions becomes available
  useEffect(() => {
    if (priceRangeOptions.length > 0) {
      console.log('💰 [PHONE FILTERS] Price range options now available, testing budget category...');
      const testCategory = getBudgetCategory(range[0], range[1]);
      console.log('💰 [PHONE FILTERS] Budget category with current range:', testCategory);
      setBudgetAttribute(range[0], range[1]);
    }
  }, [priceRangeOptions])

  // Function to set budget attribute in personalization
  const setBudgetAttribute = async (minPrice: number, maxPrice: number) => {
    console.log('💰 [BUDGET PERSONALIZATION] ==========================================');
    console.log('💰 [BUDGET PERSONALIZATION] Setting budget attribute for price range:', { minPrice, maxPrice });
    console.log('💰 [BUDGET PERSONALIZATION] Personalize SDK available:', !!personalizeSdk);
    console.log('💰 [BUDGET PERSONALIZATION] Price range options available:', priceRangeOptions.length);
    
    // Always call getBudgetCategory for debugging, even if SDK is not available
    const budgetCategory = getBudgetCategory(minPrice, maxPrice)
    console.log(`💰 [BUDGET PERSONALIZATION] Determined budget category: ${budgetCategory}`)
    
    // Get previous budget category for tracking
    const previousBudgetCookie = document.cookie.split(';').find(c => c.trim().startsWith('budget='));
    const previousBudget = previousBudgetCookie ? previousBudgetCookie.split('=')[1] : undefined;
    
    // Set budget as a cookie (this will be available to Edge function)
    // Only store the category (low/mid/high), not the price values
    document.cookie = `budget=${budgetCategory}; path=/; max-age=86400; SameSite=Lax`;
    console.log(`💰 [BUDGET PERSONALIZATION] Set budget cookie: budget=${budgetCategory}`);
    
    // Track personalization change if budget category changed
    try {
      if (previousBudget && previousBudget !== budgetCategory) {
        lytics.trackPersonalizationChange('budget', budgetCategory, previousBudget);
      } else if (!previousBudget) {
        // First time setting budget
        lytics.trackPersonalizationChange('budget', budgetCategory);
      }
    } catch (error) {
      // Silently fail - don't break personalization functionality
      console.warn('⚠️ [BUDGET PERSONALIZATION] Error tracking personalization change:', error);
    }
    
    if (personalizeSdk) {
      console.log(`💰 [BUDGET PERSONALIZATION] Calling personalizeSdk.set({ budget: '${budgetCategory}' })`)
      
      try {
        const result = await personalizeSdk.set({ budget: budgetCategory })
        console.log(`✅ [BUDGET PERSONALIZATION] Budget attribute set successfully:`, result)
        console.log(`✅ [BUDGET PERSONALIZATION] Category '${budgetCategory}' should now be available for personalization`)
      } catch (error) {
        console.error(`❌ [BUDGET PERSONALIZATION] Failed to set budget attribute:`, error)
        console.error(`❌ [BUDGET PERSONALIZATION] Error details:`, {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : 'No stack trace',
          name: error instanceof Error ? error.name : 'Unknown error'
        })
      }
    } else {
      console.log(`⚠️ [BUDGET PERSONALIZATION] Personalize SDK not available - using cookie fallback`)
      console.log(`⚠️ [BUDGET PERSONALIZATION] Budget category set in cookie: ${budgetCategory}`)
    }
  }

  const toggle = (list: string[], setList: (v: string[]) => void, v: string) => {
    setList(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])
  }

  const handleApply = async () => {
    console.log('💰 [PHONE FILTERS] ==========================================');
    console.log('💰 [PHONE FILTERS] Apply button clicked');
    console.log('💰 [PHONE FILTERS] Current range:', range);
    console.log('💰 [PHONE FILTERS] Current filters:', { companies, os, features, screenType, phoneType, releaseStatus });
    
    // Set budget personalization attribute
    await setBudgetAttribute(range[0], range[1])
    
    const filtersToApply = {
      companies,
      os,
      priceRange,
      features,
      screenType,
      phoneType,
      releaseStatus,
      priceMin: range[0],
      priceMax: range[1],
    };
    
    console.log('💰 [PHONE FILTERS] Applying filters:', filtersToApply);
    
    // Track filter application with Lytics
    try {
      const budgetCategory = getBudgetCategory(range[0], range[1]);
      lytics.trackFilterApplied(filtersToApply, budgetCategory);
      
      // Track personalization change if budget category changed
      // Note: We track this separately to capture budget personalization specifically
    } catch (error) {
      // Silently fail - don't break filter functionality
      console.warn('⚠️ [PHONE FILTERS] Error tracking filter application:', error);
    }
    
    onApply(filtersToApply);
  }

  const handleClearAll = () => {
    setCompanies([])
    setOs([])
    setPriceRange([])
    setFeatures([])
    setScreenType([])
    setPhoneType([])
    setReleaseStatus([])
    setRange([0, 2000])
    
    const clearedFilters = {
      companies: [],
      os: [],
      priceRange: [],
      features: [],
      screenType: [],
      phoneType: [],
      releaseStatus: [],
      priceMin: 0,
      priceMax: 2000,
    };
    
    // Track filter clear with Lytics
    try {
      lytics.trackFilterApplied(clearedFilters);
      lytics.trackEvent('filters_cleared', {
        previous_filters_count: companies.length + os.length + features.length + 
                                screenType.length + phoneType.length + releaseStatus.length,
      });
    } catch (error) {
      // Silently fail - don't break filter functionality
      console.warn('⚠️ [PHONE FILTERS] Error tracking filter clear:', error);
    }
    
    onApply(clearedFilters);
  }

  return (
    <aside className="rounded-lg border bg-card p-4 md:p-6 flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Filter Phones</h2>

      <div className="space-y-6 flex-1 overflow-y-auto max-h-[60vh]">
        {/* Company */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3">Company</p>
          <div className="grid gap-2 max-h-32 overflow-y-auto">
            {COMPANY_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <Checkbox
                  checked={companies.includes(option.value)}
                  onCheckedChange={() => toggle(companies, setCompanies, option.value)}
                  id={`company-${option.value}`}
                />
                <Label htmlFor={`company-${option.value}`} className="font-normal text-sm">
                  {option.label}
                </Label>
              </label>
            ))}
          </div>
        </div>

        <Separator />

        {/* OS */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3">Operating System</p>
          <div className="grid gap-2">
            {OS_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <Checkbox
                  checked={os.includes(option.value)}
                  onCheckedChange={() => toggle(os, setOs, option.value)}
                  id={`os-${option.value}`}
                />
                <Label htmlFor={`os-${option.value}`} className="font-normal text-sm">
                  {option.label}
                </Label>
              </label>
            ))}
          </div>
        </div>

        <Separator />

        {/* Phone Type */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3">Phone Type</p>
          <div className="grid gap-2 max-h-32 overflow-y-auto">
            {PHONE_TYPE_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <Checkbox
                  checked={phoneType.includes(option.value)}
                  onCheckedChange={() => toggle(phoneType, setPhoneType, option.value)}
                  id={`phone-type-${option.value}`}
                />
                <Label htmlFor={`phone-type-${option.value}`} className="font-normal text-sm">
                  {option.label}
                </Label>
              </label>
            ))}
          </div>
        </div>

        <Separator />

        {/* Features */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3">Features</p>
          <div className="grid gap-2">
            {FEATURES_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <Checkbox
                  checked={features.includes(option.value)}
                  onCheckedChange={() => toggle(features, setFeatures, option.value)}
                  id={`feature-${option.value}`}
                />
                <Label htmlFor={`feature-${option.value}`} className="font-normal text-sm">
                  {option.label}
                </Label>
              </label>
            ))}
          </div>
        </div>

        <Separator />

        {/* Screen Type */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3">Screen Type</p>
          <div className="grid gap-2">
            {SCREEN_TYPE_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <Checkbox
                  checked={screenType.includes(option.value)}
                  onCheckedChange={() => toggle(screenType, setScreenType, option.value)}
                  id={`screen-${option.value}`}
                />
                <Label htmlFor={`screen-${option.value}`} className="font-normal text-sm">
                  {option.label}
                </Label>
              </label>
            ))}
          </div>
        </div>

        <Separator />

        {/* Release Status */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3">Release Status</p>
          <div className="grid gap-2">
            {RELEASE_STATUS_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <Checkbox
                  checked={releaseStatus.includes(option.value)}
                  onCheckedChange={() => toggle(releaseStatus, setReleaseStatus, option.value)}
                  id={`status-${option.value}`}
                />
                <Label htmlFor={`status-${option.value}`} className="font-normal text-sm">
                  {option.label}
                </Label>
              </label>
            ))}
          </div>
        </div>

        <Separator />


        {/* Price Range Slider */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3">Price Range ($)</p>
          <Slider 
            value={range} 
            onValueChange={(newRange) => {
              console.log('💰 [PHONE FILTERS] Slider value changed:', { oldRange: range, newRange });
              setRange(newRange)
            }} 
            max={priceRangeOptions.length > 0 ? Math.max(...priceRangeOptions.map(opt => opt.maxPrice)) : 2000} 
            min={priceRangeOptions.length > 0 ? Math.min(...priceRangeOptions.map(opt => opt.minPrice)) : 0} 
            step={10} 
            className="mb-3" 
          />
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-1">
              <Label htmlFor="min" className="text-xs">Min</Label>
              <Input
                id="min"
                inputMode="numeric"
                value={min}
                onChange={(e) => {
                  const newMin = Number(e.target.value || 0)
                  const newRange = [newMin, max]
                  console.log('💰 [PHONE FILTERS] Min input changed:', { oldMin: min, newMin, newRange });
                  setRange(newRange)
                }}
                className="h-8"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="max" className="text-xs">Max</Label>
              <Input
                id="max"
                inputMode="numeric"
                value={max}
                onChange={(e) => {
                  const newMax = Number(e.target.value || 0)
                  const newRange = [min, newMax]
                  console.log('💰 [PHONE FILTERS] Max input changed:', { oldMax: max, newMax, newRange });
                  setRange(newRange)
                }}
                className="h-8"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t space-y-2">
        <Button
          className="w-full"
          onClick={handleApply}
        >
          Apply Filters
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleClearAll}
        >
          Clear All
        </Button>
      </div>
    </aside>
  )
}

export type { Filters }
export const DEFAULT_FILTERS: Filters = {
  companies: [],
  os: [],
  priceRange: [],
  features: [],
  screenType: [],
  phoneType: [],
  releaseStatus: [],
  priceMin: 0,
  priceMax: 2000,
}