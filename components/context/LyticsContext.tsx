"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

// Type definitions for Lytics jstag
declare global {
  interface Window {
    jstag?: {
      send: (event: string, data?: Record<string, any>) => void;
      identify: (userId: string, traits?: Record<string, any>) => void;
      pageView: (data?: Record<string, any>) => void;
      set: (data: Record<string, any>) => void;
      getid: () => string | undefined;
      on: (event: string, callback: (data: any) => void) => void;
    };
  }
}

interface LyticsContextValue {
  isReady: boolean;
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
  identifyUser: (userId: string, traits?: Record<string, any>) => void;
  trackPageView: (properties?: Record<string, any>) => void;
  setUserAttribute: (key: string, value: any) => void;
  setUserAttributes: (attributes: Record<string, any>) => void;
  getUserId: () => string | undefined;
}

const LyticsContext = createContext<LyticsContextValue | null>(null);

export function LyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if jstag is available
    if (typeof window !== 'undefined' && window.jstag) {
      // Wait a bit for jstag to fully initialize
      const checkReady = () => {
        try {
          // Try to access jstag to verify it's ready
          if (window.jstag && typeof window.jstag.pageView === 'function') {
            setIsReady(true);
            console.log('📊 [LYTICS] Lytics tracking is ready');
          } else {
            // Retry after a short delay
            setTimeout(checkReady, 100);
          }
        } catch (error) {
          console.warn('⚠️ [LYTICS] Error checking Lytics readiness:', error);
          // Continue anyway - tracking will use fallbacks
          setIsReady(false);
        }
      };
      
      checkReady();
    } else {
      console.warn('⚠️ [LYTICS] jstag not found - tracking will be disabled');
      setIsReady(false);
    }
  }, []);

  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    try {
      if (typeof window !== 'undefined' && window.jstag && typeof window.jstag.send === 'function') {
        window.jstag.send(eventName, properties);
        console.log('📊 [LYTICS] Event tracked:', eventName, properties);
      } else {
        console.warn('⚠️ [LYTICS] jstag.send not available - event not tracked:', eventName);
      }
    } catch (error) {
      console.error('❌ [LYTICS] Error tracking event:', error);
      // Don't throw - silently fail to not break user experience
    }
  }, []);

  const identifyUser = useCallback((userId: string, traits?: Record<string, any>) => {
    try {
      if (typeof window !== 'undefined' && window.jstag && typeof window.jstag.identify === 'function') {
        window.jstag.identify(userId, traits);
        console.log('📊 [LYTICS] User identified:', userId, traits);
      } else {
        console.warn('⚠️ [LYTICS] jstag.identify not available');
      }
    } catch (error) {
      console.error('❌ [LYTICS] Error identifying user:', error);
      // Don't throw - silently fail
    }
  }, []);

  const trackPageView = useCallback((properties?: Record<string, any>) => {
    try {
      if (typeof window !== 'undefined' && window.jstag && typeof window.jstag.pageView === 'function') {
        window.jstag.pageView(properties);
        console.log('📊 [LYTICS] Page view tracked:', properties);
      } else {
        console.warn('⚠️ [LYTICS] jstag.pageView not available');
      }
    } catch (error) {
      console.error('❌ [LYTICS] Error tracking page view:', error);
      // Don't throw - silently fail
    }
  }, []);

  const setUserAttribute = useCallback((key: string, value: any) => {
    try {
      if (typeof window !== 'undefined' && window.jstag && typeof window.jstag.set === 'function') {
        window.jstag.set({ [key]: value });
        console.log('📊 [LYTICS] User attribute set:', key, value);
      } else {
        console.warn('⚠️ [LYTICS] jstag.set not available');
      }
    } catch (error) {
      console.error('❌ [LYTICS] Error setting user attribute:', error);
      // Don't throw - silently fail
    }
  }, []);

  const setUserAttributes = useCallback((attributes: Record<string, any>) => {
    try {
      if (typeof window !== 'undefined' && window.jstag && typeof window.jstag.set === 'function') {
        window.jstag.set(attributes);
        console.log('📊 [LYTICS] User attributes set:', attributes);
      } else {
        console.warn('⚠️ [LYTICS] jstag.set not available');
      }
    } catch (error) {
      console.error('❌ [LYTICS] Error setting user attributes:', error);
      // Don't throw - silently fail
    }
  }, []);

  const getUserId = useCallback((): string | undefined => {
    try {
      if (typeof window !== 'undefined' && window.jstag && typeof window.jstag.getid === 'function') {
        return window.jstag.getid();
      }
    } catch (error) {
      console.error('❌ [LYTICS] Error getting user ID:', error);
    }
    return undefined;
  }, []);

  const value: LyticsContextValue = {
    isReady,
    trackEvent,
    identifyUser,
    trackPageView,
    setUserAttribute,
    setUserAttributes,
    getUserId,
  };

  return (
    <LyticsContext.Provider value={value}>
      {children}
    </LyticsContext.Provider>
  );
}

export function useLytics() {
  const context = useContext(LyticsContext);
  
  // Return safe no-op functions if context is not available
  if (!context) {
    console.warn('⚠️ [LYTICS] useLytics called outside LyticsProvider - returning no-op functions');
    return {
      isReady: false,
      trackEvent: () => {},
      identifyUser: () => {},
      trackPageView: () => {},
      setUserAttribute: () => {},
      setUserAttributes: () => {},
      getUserId: () => undefined,
    };
  }
  
  return context;
}

