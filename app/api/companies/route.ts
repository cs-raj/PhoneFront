import { type NextRequest, NextResponse } from "next/server";
import { getAllEntries } from "@/lib/contentstack-delivery";
import { COMPANIES, getTotalPhones } from "@/lib/data/companies";
import Personalize from '@contentstack/personalize-edge-sdk';

type SortKey = "name" | "phones" | "latest"

export async function GET(req: NextRequest) {
  console.log('🚀 [COMPANIES API] ==========================================');
  console.log('🚀 [COMPANIES API] COMPANIES API CALLED - STARTING REQUEST');
  console.log('🚀 [COMPANIES API] ==========================================');
  console.log('🚀 [COMPANIES API] Starting companies API request');
  console.log('🚀 [COMPANIES API] Request URL:', req.url);
  console.log('🚀 [COMPANIES API] Request method:', req.method);
  console.log('🚀 [COMPANIES API] Request headers:', Object.fromEntries(req.headers.entries()));
  console.log('🚀 [COMPANIES API] Environment variables:', {
    hasApiKey: !!process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
    hasDeliveryToken: !!process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN,
    hasEnvironment: !!process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
    hasRegion: !!process.env.NEXT_PUBLIC_CONTENTSTACK_REGION
  });
  
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "100");  // Default to 100 to fetch all
  const sortBy = (searchParams.get("sortBy") ?? "name") as SortKey;

  console.log('🚀 [COMPANIES API] Query parameters:', { page, pageSize, sortBy });
  console.log('🚀 [COMPANIES API] All search params:', Object.fromEntries(searchParams.entries()));

  try {
    // Extract variant param from URL search params
    let variantParam = searchParams.get(Personalize.VARIANT_QUERY_PARAM);
    console.log('🚀 [COMPANIES API] Variant param from Edge (URL):', variantParam);
    console.log('🚀 [COMPANIES API] Personalize.VARIANT_QUERY_PARAM value:', Personalize.VARIANT_QUERY_PARAM);
    
    // Fallback: also check for cs_variant parameter
    if (!variantParam) {
      variantParam = searchParams.get('cs_variant');
      console.log('🚀 [COMPANIES API] Fallback cs_variant param:', variantParam);
    }
    
    // FALLBACK STRATEGY: If Edge returns 0_null or nothing, parse manifest directly
    if (!variantParam || variantParam.includes('_null')) {
      console.log('⚠️ [COMPANIES API] Edge returned 0_null or no variant - using fallback strategy');
      const cookieHeader = req.headers.get('cookie');
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
              console.log('✅ [COMPANIES API] Extracted variant from manifest:', variantParam);
            }
          } catch (e) {
            console.log('⚠️ [COMPANIES API] Could not parse manifest cookie');
          }
        }
      }
    }
    
    console.log('🚀 [COMPANIES API] Final variant param to use:', variantParam);
    console.log('🔍 [COMPANIES API] Variant parameter:', variantParam || "none");

    let items = [...COMPANIES];
    let personalized = false;

    // Try to fetch from Contentstack (with or without personalization)
    console.log('🚀 [COMPANIES API] Attempting to fetch companies from Contentstack');
    console.log('🚀 [COMPANIES API] Using variant param:', variantParam || 'none (default content)');
    
    try {
      console.log('🚀 [COMPANIES API] About to call getAllEntries...');
      console.log('🚀 [COMPANIES API] Parameters:', { contentTypeUid: 'companies', variantParam: variantParam || undefined });
      
      const contentstackEntries = await getAllEntries("companies", variantParam || undefined);
      
      console.log('🚀 [COMPANIES API] getAllEntries returned!');
      console.log('🚀 [COMPANIES API] Response type:', typeof contentstackEntries);
      console.log('🚀 [COMPANIES API] Response is null/undefined:', contentstackEntries === null || contentstackEntries === undefined);
      console.log('🚀 [COMPANIES API] Has entries property:', !!contentstackEntries?.entries);
      console.log('🚀 [COMPANIES API] Entries type:', typeof contentstackEntries?.entries);
      console.log('🚀 [COMPANIES API] Entries is array:', Array.isArray(contentstackEntries?.entries));
      console.log('🚀 [COMPANIES API] Entries length:', contentstackEntries?.entries?.length);
      console.log('🚀 [COMPANIES API] Full response keys:', contentstackEntries ? Object.keys(contentstackEntries) : 'null');
      console.log('🚀 [COMPANIES API] Contentstack response (first 500 chars):', JSON.stringify(contentstackEntries, null, 2).substring(0, 500));

      if (contentstackEntries?.entries?.length > 0) {
        const isPersonalized = !!variantParam;
        console.log(`✅ [COMPANIES API] Successfully fetched ${isPersonalized ? 'personalized' : 'default'} companies from Contentstack`);
        console.log('🚀 [COMPANIES API] Companies count:', contentstackEntries.entries.length);
        console.log('🚀 [COMPANIES API] Raw Contentstack response:', JSON.stringify(contentstackEntries, null, 2));
        
        // Use Contentstack data
        items = contentstackEntries.entries;
        personalized = isPersonalized;
        console.log('🚀 [COMPANIES API] Items structure:', {
          itemsCount: items.length,
          firstItemKeys: items[0] ? Object.keys(items[0]) : [],
          hasName: items[0] ? 'name' in items[0] : false,
          hasPhonesCount: items[0] ? 'phonesCount' in items[0] : false
        });
      } else {
        console.log('⚠️ [COMPANIES API] No company entries found in Contentstack response');
      }
    } catch (contentstackError) {
      console.error('❌ [COMPANIES API] Error fetching from Contentstack:', contentstackError);
      console.log('🚀 [COMPANIES API] Will fall back to static data due to Contentstack error');
    }

    // Normalize data structure for consistent sorting
    const normalizedItems = items.map(item => {
      // Check if this is Contentstack data or static data
      if ('title' in item && 'phones' in item && 'created_at' in item) {
        // Contentstack data - normalize to expected structure
        return {
          ...item,
          name: item.title,
          phonesCount: item.phones,
          createdAt: item.created_at,
          logoUrl: item.logo?.url || null
        };
      }
      // Static data - already in correct format
      return item;
    });

    // Apply sorting
    console.log('🚀 [COMPANIES API] Applying sorting to', normalizedItems.length, 'companies');
    normalizedItems.sort((a, b) => {
      if (sortBy === "name") {
        console.log('🚀 [COMPANIES API] Sorting by name');
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "phones") {
        console.log('🚀 [COMPANIES API] Sorting by phone count');
        return b.phonesCount - a.phonesCount;
      }
      // latest: newest createdAt first
      console.log('🚀 [COMPANIES API] Sorting by latest');
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Apply pagination
    const total = normalizedItems.length;
    const start = Math.max(0, (page - 1) * pageSize);
    const paged = normalizedItems.slice(start, start + pageSize);

    console.log('✅ [COMPANIES API] Returning paginated companies:', paged.length, 'of', total);

    const response = NextResponse.json({
      items: paged,
      page,
      pageSize,
      total,
      totalPhones: getTotalPhones(COMPANIES),
      totalCompanies: total,
      personalized,
      variantParam: variantParam || null
    });
    console.log('🚀 [COMPANIES API] Response status:', response.status);
    console.log('🚀 [COMPANIES API] Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('🚀 [COMPANIES API] Response body preview:', JSON.stringify({
      itemsCount: paged.length,
      page,
      pageSize,
      total,
      totalPhones: getTotalPhones(COMPANIES),
      totalCompanies: total,
      personalized,
      variantParam: variantParam || null
    }, null, 2));
    return response;

  } catch (error) {
    console.error('❌ [COMPANIES API] Unexpected error in companies API:', error);
    console.error('❌ [COMPANIES API] Error stack:', error.stack);
    
    // Return static data as final fallback
    const fallbackItems = [...COMPANIES];
    fallbackItems.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "phones") return b.phonesCount - a.phonesCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const total = fallbackItems.length;
    const start = Math.max(0, (page - 1) * pageSize);
    const paged = fallbackItems.slice(start, start + pageSize);

    const errorResponse = NextResponse.json({
      items: paged,
      page,
      pageSize,
      total,
      totalPhones: getTotalPhones(COMPANIES),
      totalCompanies: total,
      personalized: false,
      variantAliases: [],
      error: 'Fallback to static data due to error'
    });
    console.log('🚀 [COMPANIES API] Error fallback response status:', errorResponse.status);
    console.log('🚀 [COMPANIES API] Error fallback response headers:', Object.fromEntries(errorResponse.headers.entries()));
    console.log('🚀 [COMPANIES API] Error fallback response body preview:', JSON.stringify({
      itemsCount: paged.length,
      page,
      pageSize,
      total,
      totalPhones: getTotalPhones(COMPANIES),
      totalCompanies: total,
      personalized: false,
      variantAliases: [],
      error: 'Fallback to static data due to error'
    }, null, 2));
    return errorResponse;
  }
}
