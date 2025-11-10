/**
 * Lytics utility functions for formatting event data and integrating with Personalize
 */

import type { Phone } from '@/lib/types';

/**
 * Get current page URL (safe for client-side)
 */
export function getCurrentPageUrl(): string {
  if (typeof window === 'undefined') return '';
  try {
    return window.location.pathname + window.location.search;
  } catch {
    return '';
  }
}

/**
 * Extract Personalize data from cookies or context
 * Returns budget category and variant information
 */
export function getPersonalizeData(): {
  budgetCategory?: string;
  variantParam?: string;
  personalized?: boolean;
} {
  if (typeof window === 'undefined') return {};
  
  try {
    const cookies = document.cookie.split(';').map(c => c.trim());
    
    // Extract budget category from cookie
    const budgetCookie = cookies.find(c => c.startsWith('budget='));
    const budgetCategory = budgetCookie ? budgetCookie.split('=')[1] : undefined;
    
    // Extract variant param from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const variantParam = urlParams.get('_cs_pp') || undefined;
    
    return {
      budgetCategory: budgetCategory || undefined,
      variantParam: variantParam || undefined,
      personalized: !!variantParam,
    };
  } catch (error) {
    console.warn('⚠️ [LYTICS UTILS] Error extracting Personalize data:', error);
    return {};
  }
}

/**
 * Build event properties with Personalize data
 */
export function buildEventProperties(
  baseProperties: Record<string, any> = {},
  includePersonalize = true
): Record<string, any> {
  const properties = { ...baseProperties };
  
  // Always include page URL
  properties.page = getCurrentPageUrl();
  
  // Include Personalize data if requested
  if (includePersonalize) {
    const personalizeData = getPersonalizeData();
    if (personalizeData.budgetCategory) {
      properties.budget_category = personalizeData.budgetCategory;
    }
    if (personalizeData.variantParam) {
      properties.variant_param = personalizeData.variantParam;
    }
    if (personalizeData.personalized !== undefined) {
      properties.personalized = personalizeData.personalized;
    }
  }
  
  return properties;
}

/**
 * Build properties for phone_viewed event
 */
export function buildPhoneViewProperties(
  phone: Phone,
  options?: {
    viewPosition?: number;
    viewMode?: 'grid' | 'list';
    searchQuery?: string;
  }
): Record<string, any> {
  const baseProperties: Record<string, any> = {
    phone_name: phone.name,
    phone_brand: phone.brand,
    phone_slug: phone.slug,
    phone_price: phone.price,
    phone_os: phone.os,
    phone_type: phone.type,
  };
  
  // Add specifications if available
  if (phone.specs) {
    baseProperties.phone_display = phone.specs.display;
    baseProperties.phone_battery = phone.specs.battery;
    baseProperties.phone_camera = phone.specs.camera;
  }
  
  // Add taxonomies if available
  if (phone.taxonomies && phone.taxonomies.length > 0) {
    baseProperties.phone_taxonomies = phone.taxonomies.map(t => t.term_uid);
  }
  
  // Add view context
  if (options) {
    if (options.viewPosition !== undefined) {
      baseProperties.view_position = options.viewPosition;
    }
    if (options.viewMode) {
      baseProperties.view_mode = options.viewMode;
    }
    if (options.searchQuery) {
      baseProperties.search_query = options.searchQuery;
    }
  }
  
  return buildEventProperties(baseProperties, true);
}

/**
 * Build properties for phone_filter_applied event
 */
export function buildFilterProperties(
  filters: {
    companies?: string[];
    os?: string[];
    features?: string[];
    screenType?: string[];
    phoneType?: string[];
    releaseStatus?: string[];
    priceRange?: string[];
    priceMin?: number;
    priceMax?: number;
  },
  budgetCategory?: string
): Record<string, any> {
  const properties: Record<string, any> = {};
  
  // Count active filters
  let totalFilters = 0;
  
  if (filters.companies && filters.companies.length > 0) {
    properties.filter_companies = filters.companies;
    totalFilters += filters.companies.length;
  }
  
  if (filters.os && filters.os.length > 0) {
    properties.filter_os = filters.os;
    totalFilters += filters.os.length;
  }
  
  if (filters.features && filters.features.length > 0) {
    properties.filter_features = filters.features;
    totalFilters += filters.features.length;
  }
  
  if (filters.screenType && filters.screenType.length > 0) {
    properties.filter_screen_type = filters.screenType;
    totalFilters += filters.screenType.length;
  }
  
  if (filters.phoneType && filters.phoneType.length > 0) {
    properties.filter_phone_type = filters.phoneType;
    totalFilters += filters.phoneType.length;
  }
  
  if (filters.releaseStatus && filters.releaseStatus.length > 0) {
    properties.filter_release_status = filters.releaseStatus;
    totalFilters += filters.releaseStatus.length;
  }
  
  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    properties.price_min = filters.priceMin ?? 0;
    properties.price_max = filters.priceMax ?? 2000;
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      totalFilters += 1;
    }
  }
  
  properties.total_filters = totalFilters;
  
  // Add budget category if provided
  if (budgetCategory) {
    properties.budget_category = budgetCategory;
  }
  
  return buildEventProperties(properties, true);
}

/**
 * Merge Personalize data from context into event properties
 */
export function mergePersonalizeData(
  eventProperties: Record<string, any>,
  personalizeData?: {
    budgetCategory?: string;
    variantParam?: string;
    personalized?: boolean;
  }
): Record<string, any> {
  const merged = { ...eventProperties };
  
  if (personalizeData) {
    if (personalizeData.budgetCategory) {
      merged.budget_category = personalizeData.budgetCategory;
    }
    if (personalizeData.variantParam) {
      merged.variant_param = personalizeData.variantParam;
    }
    if (personalizeData.personalized !== undefined) {
      merged.personalized = personalizeData.personalized;
    }
  }
  
  return merged;
}

