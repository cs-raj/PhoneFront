"use client";

import { useCallback } from 'react';
import { useLytics } from '@/components/context/LyticsContext';
import { usePersonalize } from '@/components/context/PersonalizeContext';
import {
  buildPhoneViewProperties,
  buildFilterProperties,
  buildEventProperties,
  getPersonalizeData,
  mergePersonalizeData,
} from '@/lib/lytics-utils';
import type { Phone } from '@/lib/types';
import type { Filters } from '@/components/phone-filters';

/**
 * Custom hook for Lytics event tracking with Personalize integration
 */
export function useLyticsTracking() {
  const lytics = useLytics();
  const personalizeSdk = usePersonalize();

  /**
   * Get Personalize data from SDK and cookies
   */
  const getPersonalizeContext = useCallback(() => {
    try {
      // Try to get variant param from SDK
      let variantParam: string | undefined;
      if (personalizeSdk && typeof personalizeSdk.getVariantParam === 'function') {
        try {
          variantParam = personalizeSdk.getVariantParam();
        } catch {
          // SDK might not be ready, fallback to cookie/URL
        }
      }
      
      // Get budget category from cookies
      const cookieData = getPersonalizeData();
      
      return {
        budgetCategory: cookieData.budgetCategory,
        variantParam: variantParam || cookieData.variantParam,
        personalized: !!(variantParam || cookieData.variantParam),
      };
    } catch (error) {
      console.warn('⚠️ [USE-LYTICS] Error getting Personalize context:', error);
      return getPersonalizeData();
    }
  }, [personalizeSdk]);

  /**
   * Track phone view event
   */
  const trackPhoneView = useCallback((
    phone: Phone,
    options?: {
      viewPosition?: number;
      viewMode?: 'grid' | 'list';
      searchQuery?: string;
    }
  ) => {
    try {
      const personalizeContext = getPersonalizeContext();
      const properties = mergePersonalizeData(
        buildPhoneViewProperties(phone, options),
        personalizeContext
      );
      
      lytics.trackEvent('phone_viewed', properties);
    } catch (error) {
      console.error('❌ [USE-LYTICS] Error tracking phone view:', error);
      // Don't throw - silently fail
    }
  }, [lytics, getPersonalizeContext]);

  /**
   * Track filter application
   */
  const trackFilterApplied = useCallback((
    filters: Filters,
    budgetCategory?: string
  ) => {
    try {
      const personalizeContext = getPersonalizeContext();
      const properties = mergePersonalizeData(
        buildFilterProperties(filters, budgetCategory || personalizeContext.budgetCategory),
        personalizeContext
      );
      
      lytics.trackEvent('phone_filter_applied', properties);
      
      // Also update user attributes for segmentation
      if (personalizeContext.budgetCategory) {
        lytics.setUserAttribute('budget_preference', personalizeContext.budgetCategory);
      }
    } catch (error) {
      console.error('❌ [USE-LYTICS] Error tracking filter application:', error);
      // Don't throw - silently fail
    }
  }, [lytics, getPersonalizeContext]);

  /**
   * Track search query
   */
  const trackSearch = useCallback((
    query: string,
    resultsCount?: number,
    searchType?: string
  ) => {
    try {
      const personalizeContext = getPersonalizeContext();
      const properties = mergePersonalizeData(
        buildEventProperties({
          query: query.trim(),
          results_count: resultsCount,
          search_type: searchType || 'phones',
        }),
        personalizeContext
      );
      
      lytics.trackEvent('search_performed', properties);
      
      // Update user attribute
      if (query.trim()) {
        lytics.setUserAttribute('last_searched_query', query.trim());
      }
    } catch (error) {
      console.error('❌ [USE-LYTICS] Error tracking search:', error);
      // Don't throw - silently fail
    }
  }, [lytics, getPersonalizeContext]);

  /**
   * Track sort change
   */
  const trackSortChange = useCallback((
    sortKey: string,
    previousSort?: string
  ) => {
    try {
      const properties = buildEventProperties({
        sort_key: sortKey,
        previous_sort: previousSort,
      });
      
      lytics.trackEvent('sort_changed', properties);
    } catch (error) {
      console.error('❌ [USE-LYTICS] Error tracking sort change:', error);
      // Don't throw - silently fail
    }
  }, [lytics]);

  /**
   * Track view mode change
   */
  const trackViewModeChange = useCallback((
    viewMode: 'grid' | 'list',
    previousMode?: 'grid' | 'list'
  ) => {
    try {
      const properties = buildEventProperties({
        view_mode: viewMode,
        previous_mode: previousMode,
      });
      
      lytics.trackEvent('view_mode_changed', properties);
    } catch (error) {
      console.error('❌ [USE-LYTICS] Error tracking view mode change:', error);
      // Don't throw - silently fail
    }
  }, [lytics]);

  /**
   * Track navigation click
   */
  const trackNavigation = useCallback((
    href: string,
    label: string
  ) => {
    try {
      const properties = buildEventProperties({
        navigation_href: href,
        navigation_label: label,
      });
      
      lytics.trackEvent('navigation_click', properties);
    } catch (error) {
      console.error('❌ [USE-LYTICS] Error tracking navigation:', error);
      // Don't throw - silently fail
    }
  }, [lytics]);

  /**
   * Track personalization attribute change
   */
  const trackPersonalizationChange = useCallback((
    attributeName: string,
    attributeValue: string,
    previousValue?: string
  ) => {
    try {
      const properties = buildEventProperties({
        attribute_name: attributeName,
        attribute_value: attributeValue,
        previous_value: previousValue,
        source: 'user_input',
      });
      
      lytics.trackEvent('personalization_attribute_changed', properties);
    } catch (error) {
      console.error('❌ [USE-LYTICS] Error tracking personalization change:', error);
      // Don't throw - silently fail
    }
  }, [lytics]);

  return {
    isReady: lytics.isReady,
    trackPhoneView,
    trackFilterApplied,
    trackSearch,
    trackSortChange,
    trackViewModeChange,
    trackNavigation,
    trackPersonalizationChange,
    // Expose base methods if needed
    trackEvent: lytics.trackEvent,
    identifyUser: lytics.identifyUser,
    trackPageView: lytics.trackPageView,
    setUserAttribute: lytics.setUserAttribute,
    setUserAttributes: lytics.setUserAttributes,
  };
}

