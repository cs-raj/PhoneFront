import { type NextRequest, NextResponse } from "next/server";
import { getAllEntries } from "@/lib/contentstack-delivery";
import Personalize from '@contentstack/personalize-edge-sdk';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  console.log('🚀 [NEWS API] ==========================================');
  console.log('🚀 [NEWS API] NEWS API CALLED - STARTING REQUEST');
  console.log('🚀 [NEWS API] ==========================================');
  console.log('🚀 [NEWS API] Starting news API request');
  console.log('🚀 [NEWS API] Request URL:', request.url);
  console.log('🚀 [NEWS API] Request method:', request.method);
  console.log('🚀 [NEWS API] Request headers:', Object.fromEntries(request.headers.entries()));
  console.log('🚀 [NEWS API] Environment variables:', {
    hasApiKey: !!process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
    hasDeliveryToken: !!process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN,
    hasEnvironment: !!process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
    hasRegion: !!process.env.NEXT_PUBLIC_CONTENTSTACK_REGION
  });
  
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category"); // single category
  const priority = searchParams.get("priority"); // priority filter
  const source = searchParams.get("source"); // source filter
  const company = searchParams.get("company"); // company filter
  const sort = (searchParams.get("sort") || "latest").toLowerCase(); // latest | oldest | popular
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const pageSize = Math.max(1, Number(searchParams.get("pageSize") || "100"));  // Default to 100 to fetch all
  const limitParam = Number(searchParams.get("limit") ?? Number.NaN);
  const limit = Number.isFinite(limitParam) ? Math.max(0, limitParam) : undefined;

  console.log('🚀 [NEWS API] Query parameters:', { category, priority, source, company, sort, page, pageSize, limit });
  console.log('🚀 [NEWS API] All search params:', Object.fromEntries(searchParams.entries()));

  try {
    // Extract variant param from URL search params
    const { searchParams } = new URL(request.url);
    let variantParam = searchParams.get(Personalize.VARIANT_QUERY_PARAM);
    console.log('🚀 [NEWS API] Variant param from Edge (URL):', variantParam);
    console.log('🚀 [NEWS API] Personalize.VARIANT_QUERY_PARAM value:', Personalize.VARIANT_QUERY_PARAM);
    
    // Fallback: also check for cs_variant parameter
    if (!variantParam) {
      variantParam = searchParams.get('cs_variant');
      console.log('🚀 [NEWS API] Fallback cs_variant param:', variantParam);
    }
    
    // FALLBACK STRATEGY: If Edge returns 0_null or nothing, parse manifest directly
    if (!variantParam || variantParam.includes('_null')) {
      console.log('⚠️ [NEWS API] Edge returned 0_null or no variant - using fallback strategy');
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
              console.log('✅ [NEWS API] Extracted variant from manifest:', variantParam);
            }
          } catch (e) {
            console.log('⚠️ [NEWS API] Could not parse manifest cookie');
          }
        }
      }
    }
    
    console.log('🚀 [NEWS API] Final variant param to use:', variantParam);
    console.log('🔍 [NEWS API] Variant parameter:', variantParam || "none");

    let items: any[] = [];
    let personalized = false;

    // Try to fetch from Contentstack (with or without personalization)
    console.log('🚀 [NEWS API] Attempting to fetch news from Contentstack');
    console.log('🚀 [NEWS API] Using variant param:', variantParam || 'none (default content)');
    console.log('🚀 [NEWS API] About to call getAllEntries with variant:', variantParam || "undefined");
    
    try {
      console.log('🚀 [NEWS API] About to call getAllEntries...');
      console.log('🚀 [NEWS API] Parameters:', { contentTypeUid: 'news', variantParam: variantParam || undefined });
      
      const contentstackEntries = await getAllEntries("news", variantParam || undefined);
      
      console.log('🚀 [NEWS API] getAllEntries completed');
      console.log('🚀 [NEWS API] Response type:', typeof contentstackEntries);
      console.log('🚀 [NEWS API] Response is null/undefined:', contentstackEntries === null || contentstackEntries === undefined);
      console.log('🚀 [NEWS API] Has entries property:', !!contentstackEntries?.entries);
      console.log('🚀 [NEWS API] Entries type:', typeof contentstackEntries?.entries);
      console.log('🚀 [NEWS API] Entries is array:', Array.isArray(contentstackEntries?.entries));
      console.log('🚀 [NEWS API] Entries length:', contentstackEntries?.entries?.length);
      console.log('🚀 [NEWS API] Full response keys:', contentstackEntries ? Object.keys(contentstackEntries) : 'null');
      console.log('🚀 [NEWS API] Contentstack response (first 500 chars):', JSON.stringify(contentstackEntries, null, 2).substring(0, 500));

      if (contentstackEntries?.entries && contentstackEntries.entries.length > 0) {
        const isPersonalized = !!variantParam;
        console.log(`✅ [NEWS API] Successfully fetched ${isPersonalized ? 'personalized' : 'default'} news from Contentstack`);
        console.log('🚀 [NEWS API] News count:', contentstackEntries.entries.length);
        
        // Log details about the first few news items
        const firstNews = contentstackEntries.entries[0];
        console.log('🚀 [NEWS API] First news title:', firstNews.title);
        console.log('🚀 [NEWS API] First news category:', firstNews.category);
        console.log('🚀 [NEWS API] First news priority:', firstNews.priority);
        console.log('🚀 [NEWS API] First news locale:', firstNews.locale);
        console.log('🚀 [NEWS API] Personalized flag:', isPersonalized);
        console.log('🚀 [NEWS API] Variant param in response:', variantParam || null);
        console.log('🚀 [NEWS API] Raw Contentstack response:', JSON.stringify(contentstackEntries, null, 2));
        console.log('🚀 [NEWS API] First entry keys:', contentstackEntries.entries[0] ? Object.keys(contentstackEntries.entries[0]) : 'No entries');
        console.log('🚀 [NEWS API] First entry structure:', contentstackEntries.entries[0]);
        
        // Map Contentstack entries to NewsArticle format
        items = contentstackEntries.entries.map((entry: any) => {
          // Extract category from taxonomies
          const newsTaxonomy = entry.taxonomies?.find((t: any) => t.taxonomy_uid === 'news');
          const categoryMap: Record<string, string> = {
            'launches': 'Launches',
            'rumors': 'Rumors',
            'deals': 'Deals',
            'reviews': 'Reviews',
            'industry-news': 'Industry News'
          };
          const category = newsTaxonomy?.term_uid ? categoryMap[newsTaxonomy.term_uid] || 'News' : 'News';
          
          // Format date
          const publishDate = new Date(entry.publish_date || entry.created_at);
          const now = new Date();
          const diffMs = now.getTime() - publishDate.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);
          
          let datePretty = '';
          if (diffMins < 60) {
            datePretty = `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
          } else if (diffHours < 24) {
            datePretty = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
          } else if (diffDays < 30) {
            datePretty = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
          } else {
            datePretty = publishDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          }
          
          // Extract all taxonomies
          const allTaxonomies = entry.taxonomies || [];
          const taxonomiesByType: Record<string, string[]> = {};
          
          allTaxonomies.forEach((taxonomy: any) => {
            const type = taxonomy.taxonomy_uid;
            const term = taxonomy.term_uid;
            if (!taxonomiesByType[type]) {
              taxonomiesByType[type] = [];
            }
            taxonomiesByType[type].push(term);
          });

          return {
            id: entry.uid || entry.slug,
            slug: entry.slug,
            title: entry.title,
            excerpt: entry.excerpt || '',
            body: entry.body || '',
            dateISO: entry.publish_date || entry.created_at,
            datePretty,
            category,
            href: `/news/${entry.slug}`,
            imageAlt: entry.featured_image?.title || entry.title,
            imageUrl: entry.featured_image?.url || null,
            author: entry.author?.length > 0 ? entry.author[0].title : undefined,
            authorData: entry.author?.length > 0 ? {
              name: entry.author[0].name || entry.author[0].title,
              email: entry.author[0].email || '',
              bio: entry.author[0].bio || '',
              title: entry.author[0].title || '',
              avatar: entry.author[0].avatar ? {
                url: entry.author[0].avatar.url,
                title: entry.author[0].avatar.title
              } : undefined
            } : undefined,
            taxonomies: taxonomiesByType,
            viewCount: 0,
            commentCount: 0,
            badge: entry.breaking_news ? 'BREAKING' : undefined
          };
        });
        
        personalized = isPersonalized;
        console.log('🚀 [NEWS API] Mapped items structure:', {
          itemsCount: items.length,
          firstItemKeys: items[0] ? Object.keys(items[0]) : [],
          firstItem: items[0]
        });
      } else {
        console.log('⚠️ [NEWS API] No news entries found in Contentstack response');
        // Return empty response if no entries found
        return NextResponse.json({
          items: [],
          total: 0,
          personalized: false,
          variantParam: variantParam || null
        });
      }
    } catch (contentstackError) {
      console.error('❌ [NEWS API] Error fetching from Contentstack:', contentstackError);
      console.log('🚀 [NEWS API] No news available from Contentstack');
      // Return empty response instead of falling back to static data
      return NextResponse.json({
        items: [],
        total: 0,
        personalized: false,
        variantParam: variantParam || null
      });
    }

    // Apply filters and sorting
    console.log('🚀 [NEWS API] Applying filters and sorting to', items.length, 'items');
    
    // Filter by categories (multiple values)
    if (category && category !== "all") {
      const categories = category.split(',');
      const filteredItems = items.filter((n) => {
        if (n.taxonomies?.news) {
          return n.taxonomies.news.some((term: string) => categories.includes(term));
        }
        return false;
      });
      console.log(`🚀 [NEWS API] Filtered by categories '${categories.join(',')}': ${filteredItems.length} items`);
      items = filteredItems;
    }

    // Filter by priority (multiple values)
    if (priority && priority !== "all") {
      const priorities = priority.split(',');
      const filteredItems = items.filter((n) => {
        if (n.taxonomies?.news) {
          return n.taxonomies.news.some((term: string) => priorities.includes(term));
        }
        return false;
      });
      console.log(`🚀 [NEWS API] Filtered by priorities '${priorities.join(',')}': ${filteredItems.length} items`);
      items = filteredItems;
    }

    // Filter by source (multiple values)
    if (source && source !== "all") {
      const sources = source.split(',');
      const filteredItems = items.filter((n) => {
        if (n.taxonomies?.news) {
          return n.taxonomies.news.some((term: string) => sources.includes(term));
        }
        return false;
      });
      console.log(`🚀 [NEWS API] Filtered by sources '${sources.join(',')}': ${filteredItems.length} items`);
      items = filteredItems;
    }

    // Filter by company (multiple values)
    if (company && company !== "all") {
      const companies = company.split(',');
      const filteredItems = items.filter((n) => {
        if (n.taxonomies?.company) {
          return n.taxonomies.company.some((term: string) => companies.includes(term));
        }
        return false;
      });
      console.log(`🚀 [NEWS API] Filtered by companies '${companies.join(',')}': ${filteredItems.length} items`);
      items = filteredItems;
    }

    if (sort === "popular") {
      items.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
      console.log('🚀 [NEWS API] Sorted by popularity');
    } else if (sort === "oldest") {
      items.sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime());
      console.log('🚀 [NEWS API] Sorted by oldest first');
    } else {
      // latest
      items.sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime());
      console.log('🚀 [NEWS API] Sorted by latest first');
    }

    // Handle pagination and limits
    let responseData;
    if (typeof limit === "number") {
      // legacy limit support (used by LatestNews highlight)
      responseData = { 
        items: items.slice(0, limit), 
        total: items.length,
        personalized,
        variantParam: variantParam || null
      };
      console.log('✅ [NEWS API] Returning limited items:', responseData.items.length);
    } else {
      const start = (page - 1) * pageSize;
      const paged = items.slice(start, start + pageSize);
      responseData = { 
        items: paged, 
        total: items.length, 
        page, 
        pageSize,
        personalized,
        variantParam: variantParam || null
      };
      console.log('✅ [NEWS API] Returning paginated items:', paged.length, 'of', items.length);
    }

    const response = NextResponse.json(responseData);
    console.log('🚀 [NEWS API] Response status:', response.status);
    console.log('🚀 [NEWS API] Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('🚀 [NEWS API] Response body preview:', JSON.stringify({
      itemsCount: responseData.items?.length || 0,
      total: responseData.total || 0,
      personalized: responseData.personalized || false,
        variantParam: responseData.variantParam || null
    }, null, 2));
    return response;

  } catch (error) {
    console.error('❌ [NEWS API] Unexpected error in news API:', error);
    console.error('❌ [NEWS API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Return empty response instead of static data fallback
    return NextResponse.json({
      items: [],
      total: 0,
      personalized: false,
      variantParam: null,
      error: 'No news available due to error'
    });
  }
}
