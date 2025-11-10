import { NextRequest, NextResponse } from "next/server";
import { getAllEntries } from "@/lib/contentstack-delivery";
import Personalize from '@contentstack/personalize-edge-sdk';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  console.log('💰 [PRICE FILTER API] ==========================================');
  console.log('💰 [PRICE FILTER API] PRICE FILTER API CALLED - STARTING REQUEST');
  console.log('💰 [PRICE FILTER API] ==========================================');
  console.log('💰 [PRICE FILTER API] Starting price filter API request');
  console.log('💰 [PRICE FILTER API] Request URL:', request.url);
  console.log('💰 [PRICE FILTER API] Request method:', request.method);
  console.log('💰 [PRICE FILTER API] Request headers:', Object.fromEntries(request.headers.entries()));
  console.log('💰 [PRICE FILTER API] Environment variables:', {
    hasApiKey: !!process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
    hasDeliveryToken: !!process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN,
    hasEnvironment: !!process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
    hasRegion: !!process.env.NEXT_PUBLIC_CONTENTSTACK_REGION
  });

  try {
    // Extract variant param from URL search params
    const { searchParams } = new URL(request.url);
    let variantParam = searchParams.get(Personalize.VARIANT_QUERY_PARAM);
    console.log('💰 [PRICE FILTER API] Variant param from Edge (URL):', variantParam);
    
    // FALLBACK STRATEGY: If Edge returns 0_null or nothing, parse manifest directly
    if (!variantParam || variantParam.includes('_null')) {
      console.log('⚠️ [PRICE FILTER API] Edge returned 0_null or no variant - using fallback strategy');
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const manifestCookie = cookieHeader.split(';').find(c => c.trim().startsWith('cs-personalize-manifest'));
        if (manifestCookie) {
          try {
            const manifestValue = manifestCookie.split('=')[1];
            const manifest = JSON.parse(decodeURIComponent(manifestValue));
            if (manifest.activeVariants && Object.keys(manifest.activeVariants).length > 0) {
              const expId = Object.keys(manifest.activeVariants)[0];
              const variantId = manifest.activeVariants[expId];
              variantParam = `${expId}_${variantId}`;
              console.log('✅ [PRICE FILTER API] Extracted variant from manifest:', variantParam);
            }
          } catch (e) {
            console.log('⚠️ [PRICE FILTER API] Could not parse manifest cookie:', e instanceof Error ? e.message : 'Unknown error');
          }
        }
      }
    }
    
    console.log('💰 [PRICE FILTER API] Final variant param to use:', variantParam);

    let items: any[] = [];
    let personalized = false;

    // Try to fetch from Contentstack (with or without personalization)
    console.log('💰 [PRICE FILTER API] Attempting to fetch price filters from Contentstack');
    console.log('💰 [PRICE FILTER API] Using variant param:', variantParam || 'none (default content)');
    
    try {
    console.log('💰 [PRICE FILTER API] About to call getAllEntries...');
    const contentstackEntries = await getAllEntries("price_filter", variantParam || undefined);
    console.log('💰 [PRICE FILTER API] Contentstack response received');
    console.log('💰 [PRICE FILTER API] Raw Contentstack response:', JSON.stringify(contentstackEntries, null, 2));

    // Test budget category calculation on server side
    if (contentstackEntries?.entries && contentstackEntries.entries.length > 0) {
      const apiMin = Math.min(...contentstackEntries.entries.map((item: any) => item.min_price));
      const apiMax = Math.max(...contentstackEntries.entries.map((item: any) => item.max_price));
      const testMin = 500;
      const testMax = 1000;
      
      // Calculate budget category (same logic as client)
      const totalRange = apiMax - apiMin;
      if (totalRange > 0) {
        const oneThird = totalRange / 3;
        const twoThirds = (totalRange * 2) / 3;
        const baseThreshold = apiMin + oneThird;
        const midThreshold = apiMin + twoThirds;
        const avgPrice = (testMin + testMax) / 2;
        
        let budgetCategory = 'mid';
        if (avgPrice <= baseThreshold) {
          budgetCategory = 'base';
        } else if (avgPrice <= midThreshold) {
          budgetCategory = 'mid';
        } else {
          budgetCategory = 'high';
        }
        
        console.log('💰 [PRICE FILTER API] SERVER-SIDE BUDGET TEST:');
        console.log('💰 [PRICE FILTER API] API Range:', { apiMin, apiMax });
        console.log('💰 [PRICE FILTER API] Test Range:', { testMin, testMax, avgPrice });
        console.log('💰 [PRICE FILTER API] Thresholds:', { baseThreshold, midThreshold });
        console.log('💰 [PRICE FILTER API] Budget Category:', budgetCategory);
      }
    }

      if (contentstackEntries?.entries && contentstackEntries.entries.length > 0) {
        personalized = !!variantParam;
        console.log(`✅ [PRICE FILTER API] Successfully fetched ${personalized ? 'personalized' : 'default'} price filters from Contentstack`);
        console.log('💰 [PRICE FILTER API] Price filter entries count:', contentstackEntries.entries.length);

        // Process the price filter data
        const priceFilters = contentstackEntries.entries.map((item: any, index: number) => {
          console.log(`💰 [PRICE FILTER API] Processing entry ${index + 1}:`, {
            uid: item.uid,
            title: item.title,
            min_price: item.min_price,
            max_price: item.max_price,
            created_at: item.created_at,
            updated_at: item.updated_at
          });

          const normalizedItem = {
            id: item.uid,
            title: item.title || 'Price Range',
            minPrice: parseInt(item.min_price) || 0,
            maxPrice: parseInt(item.max_price) || 2000,
            createdAt: item.created_at,
            updatedAt: item.updated_at
          };

          console.log(`💰 [PRICE FILTER API] Normalized entry ${index + 1}:`, normalizedItem);
          return normalizedItem;
        });

        console.log('💰 [PRICE FILTER API] Final normalized items:', priceFilters);
        console.log('💰 [PRICE FILTER API] Total items:', priceFilters.length);

        // Calculate overall range for debugging
        const allMinPrices = priceFilters.map(item => item.minPrice);
        const allMaxPrices = priceFilters.map(item => item.maxPrice);
        const overallMin = Math.min(...allMinPrices);
        const overallMax = Math.max(...allMaxPrices);
        
        console.log('💰 [PRICE FILTER API] Overall price range:', {
          min: overallMin,
          max: overallMax,
          range: overallMax - overallMin
        });

        const response = NextResponse.json({
          items: priceFilters,
          total: priceFilters.length,
          personalized: personalized,
          variantParam: variantParam || null,
        });

        console.log('💰 [PRICE FILTER API] Response status:', response.status);
        console.log('💰 [PRICE FILTER API] Response headers:', Object.fromEntries(response.headers.entries()));
        console.log('💰 [PRICE FILTER API] Response body preview:', JSON.stringify({
          items: priceFilters,
          total: priceFilters.length,
          personalized: personalized,
          variantParam: variantParam || null,
        }, null, 2));

        return response;
      } else {
        console.log('⚠️ [PRICE FILTER API] No price filter entries found in Contentstack response');
      }
    } catch (contentstackError) {
      console.error('❌ [PRICE FILTER API] Error fetching from Contentstack:', contentstackError);
      console.log('💰 [PRICE FILTER API] Will return empty response due to Contentstack error');
    }

    // No fallback - return empty response if no data
    console.log('💰 [PRICE FILTER API] Returning empty response');
    const emptyResponse = NextResponse.json({
      items: [],
      total: 0,
      personalized: false,
      variantParam: variantParam || null,
      message: "No price filter data found",
      timestamp: new Date().toISOString(),
    });

    console.log('💰 [PRICE FILTER API] Empty response status:', emptyResponse.status);
    console.log('💰 [PRICE FILTER API] Empty response headers:', Object.fromEntries(emptyResponse.headers.entries()));
    console.log('💰 [PRICE FILTER API] Empty response body:', JSON.stringify({
      items: [],
      total: 0,
      personalized: false,
      variantParam: variantParam || null,
      message: "No price filter data found",
      timestamp: new Date().toISOString(),
    }, null, 2));

    return emptyResponse;
  } catch (error) {
    console.error('❌ [PRICE FILTER API] Unexpected error in price filter API:', error);
    console.error('❌ [PRICE FILTER API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    // No fallback - return empty response on error
    const errorResponse = NextResponse.json({
      items: [],
      total: 0,
      personalized: false,
      variantParam: null,
      message: "Price filter API error",
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });

    console.log('💰 [PRICE FILTER API] Error response status:', errorResponse.status);
    console.log('💰 [PRICE FILTER API] Error response headers:', Object.fromEntries(errorResponse.headers.entries()));
    console.log('💰 [PRICE FILTER API] Error response body:', JSON.stringify({
      items: [],
      total: 0,
      personalized: false,
      variantParam: null,
      message: "Price filter API error",
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, null, 2));

    return errorResponse;
  }
}
