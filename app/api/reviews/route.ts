import { type NextRequest, NextResponse } from "next/server";
import { getAllEntries } from "@/lib/contentstack-delivery";
import Personalize from '@contentstack/personalize-edge-sdk';

// Returns filtered reviews. Query params:
// ?phone=slug-or-all&rating=number-or-all
// ?page=1&limit=10
export async function GET(req: NextRequest) {
  console.log('🚀 [REVIEWS API] ==========================================');
  console.log('🚀 [REVIEWS API] REVIEWS API CALLED - STARTING REQUEST');
  console.log('🚀 [REVIEWS API] ==========================================');
  console.log('🚀 [REVIEWS API] Starting reviews API request');
  console.log('🚀 [REVIEWS API] Request URL:', req.url);
  console.log('🚀 [REVIEWS API] Request method:', req.method);
  console.log('🚀 [REVIEWS API] Request headers:', Object.fromEntries(req.headers.entries()));
  console.log('🚀 [REVIEWS API] Environment variables:', {
    hasApiKey: !!process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
    hasDeliveryToken: !!process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN,
    hasEnvironment: !!process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
    hasRegion: !!process.env.NEXT_PUBLIC_CONTENTSTACK_REGION
  });
  
  const { searchParams } = new URL(req.url);
  const phone = (searchParams.get("phone") || "all").toLowerCase();
  const ratingRaw = searchParams.get("rating") || "all";
  const page = Number(searchParams.get("page") || 1);
  const limit = Math.min(Number(searchParams.get("limit") || 10), 50);

  console.log('🚀 [REVIEWS API] Query parameters:', { phone, ratingRaw, page, limit });
  console.log('🚀 [REVIEWS API] All search params:', Object.fromEntries(searchParams.entries()));

  try {
    // Extract variant param from URL search params
    const { searchParams } = new URL(req.url);
    const variantParam = searchParams.get(Personalize.VARIANT_QUERY_PARAM);
    console.log('🚀 [REVIEWS API] Variant param from URL:', variantParam);
    console.log('🚀 [REVIEWS API] Personalize variant query param:', Personalize.VARIANT_QUERY_PARAM);

    let items: any[] = [];
    let personalized = false;

    // Try to fetch from Contentstack (with or without personalization)
    console.log('🚀 [REVIEWS API] Attempting to fetch reviews from Contentstack');
    console.log('🚀 [REVIEWS API] Using variant param:', variantParam || 'none (default content)');
    
    try {
      const contentstackEntries = await getAllEntries("reviews", variantParam || undefined);
      console.log('🚀 [REVIEWS API] Contentstack response:', JSON.stringify(contentstackEntries, null, 2));

      if (contentstackEntries?.entries && contentstackEntries.entries.length > 0) {
        const isPersonalized = !!variantParam;
        console.log(`✅ [REVIEWS API] Successfully fetched ${isPersonalized ? 'personalized' : 'default'} reviews from Contentstack`);
        console.log('🚀 [REVIEWS API] Reviews count:', contentstackEntries.entries.length);
        console.log('🚀 [REVIEWS API] Raw Contentstack response:', JSON.stringify(contentstackEntries, null, 2));
        
        // Normalize Contentstack data to match expected Review interface
        const normalizedItems = contentstackEntries.entries.map((item: any) => {
          // Debug specific review
          if (item.slug === 'r-oppo-find-n3-flip') {
            console.log('🔍 [REVIEWS API] DEBUGGING OPPO REVIEW:');
            console.log('🔍 [REVIEWS API] Raw item:', JSON.stringify(item, null, 2));
            console.log('🔍 [REVIEWS API] Author data:', item.author);
            console.log('🔍 [REVIEWS API] Phone data:', item.phone);
            console.log('🔍 [REVIEWS API] Images data:', item.images);
          }

          return {
            id: item.uid || '',
            slug: item.slug || '',
            title: item.title || '',
            rating: Number(item.rating) || 0,
            pros: item.pros || [],
            cons: item.cons || [],
            excerpt: item.excerpt || '',
            content: item.content || '',
            publish_date: item.publish_date || item.created_at || '',
            seo_meta: item.seo_meta || undefined,
            phoneId: item.phone && item.phone.length > 0 ? item.phone[0].uid : undefined,
            phoneName: item.phone && item.phone.length > 0 ? item.phone[0].title : undefined,
            phoneSlug: item.phone && item.phone.length > 0 ? item.phone[0].slug : undefined,
            reviewedOn: item.publish_date || item.created_at || '',
            author: item.author && item.author.length > 0 && item.author[0].name ? {
              name: item.author[0].name || '',
              verified: false, // Not in the structure, defaulting to false
              avatar: item.author[0].avatar?.url || '',
              title: item.author[0].title || '',
              bio: item.author[0].bio || '',
              email: item.author[0].email || '',
              avatarData: item.author[0].avatar ? {
                url: item.author[0].avatar.url || '',
                title: item.author[0].avatar.title || ''
              } : undefined
            } : undefined,
            likes: item.likes || 0,
            comments: item.comments || 0,
            // New fields from Contentstack
            images: item.images ? {
              uid: item.images.uid || '',
              url: item.images.url || '',
              title: item.images.title || '',
              filename: item.images.filename || '',
              content_type: item.images.content_type || '',
              file_size: item.images.file_size || ''
            } : undefined,
            phone: item.phone && item.phone.length > 0 && item.phone[0].title ? {
              uid: item.phone[0].uid || '',
              name: item.phone[0].title || '',
              slug: item.phone[0].slug || '',
              brand: item.phone[0].company && item.phone[0].company.length > 0 ? item.phone[0].company[0].uid : '',
              image: item.phone[0].images?.url || ''
            } : undefined,
            authorData: item.author && item.author.length > 0 && item.author[0].name ? {
              name: item.author[0].name || '',
              verified: false, // Not in the structure, defaulting to false
              avatar: item.author[0].avatar?.url || '',
              title: item.author[0].title || '',
              bio: item.author[0].bio || '',
              email: item.author[0].email || '',
              avatarData: item.author[0].avatar ? {
                url: item.author[0].avatar.url || '',
                title: item.author[0].avatar.title || ''
              } : undefined
            } : undefined
          };
        });

        // Use normalized Contentstack data
        items = normalizedItems;
        personalized = isPersonalized;
        console.log('🚀 [REVIEWS API] Items structure:', {
          itemsCount: items.length,
          firstItemKeys: items[0] ? Object.keys(items[0]) : [],
          hasRating: items[0] ? 'rating' in items[0] : false,
          hasAuthor: items[0] ? 'author' in items[0] : false,
          hasImages: items[0] ? 'images' in items[0] : false,
          hasPhone: items[0] ? 'phone' in items[0] : false
        });
      } else {
        console.log('⚠️ [REVIEWS API] No review entries found in Contentstack response');
        // Return empty response if no entries found
        return NextResponse.json({
          items: [],
          meta: {
            total: 0,
            page: 1,
            limit: 12,
            pages: 0
          }
        });
      }
    } catch (contentstackError) {
      console.error('❌ [REVIEWS API] Error fetching from Contentstack:', contentstackError);
      console.log('🚀 [REVIEWS API] No reviews available from Contentstack');
      // Return empty response instead of falling back to static data
      return NextResponse.json({
        items: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          pages: 0
        }
      });
    }

    // Apply filters
    console.log('🚀 [REVIEWS API] Applying filters to', items.length, 'reviews');
    
    if (phone !== "all") {
      const filteredItems = items.filter((r) => r?.phoneSlug?.toLowerCase() === phone);
      console.log(`🚀 [REVIEWS API] Filtered by phone '${phone}': ${filteredItems.length} reviews`);
      items = filteredItems;
    }

    if (ratingRaw !== "all") {
      const r = Number(ratingRaw);
      if (!Number.isNaN(r)) {
        const filteredItems = items.filter((x) => Math.round(x.rating) === r);
        console.log(`🚀 [REVIEWS API] Filtered by rating ${r}: ${filteredItems.length} reviews`);
        items = filteredItems;
      }
    }

    // Apply pagination
    const total = items.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paged = items.slice(start, end);

    console.log('✅ [REVIEWS API] Returning paginated reviews:', paged.length, 'of', total);

    const response = NextResponse.json({
      items: paged,
      meta: {
        total,
        page,
        limit,
        pages: Math.max(1, Math.ceil(total / limit)),
        personalized,
        variantParam: variantParam || null
      },
    });
    console.log('🚀 [REVIEWS API] Response status:', response.status);
    console.log('🚀 [REVIEWS API] Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('🚀 [REVIEWS API] Response body preview:', JSON.stringify({
      itemsCount: paged.length,
      meta: {
        total,
        page,
        limit,
        pages: Math.max(1, Math.ceil(total / limit)),
        personalized,
        variantParam: variantParam || null
      }
    }, null, 2));
    return response;

  } catch (error) {
    console.error('❌ [REVIEWS API] Unexpected error in reviews API:', error);
    console.error('❌ [REVIEWS API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Return empty response instead of static data fallback
    return NextResponse.json({
      items: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        pages: 0,
        personalized: false,
        variantParam: null,
        error: 'No reviews available due to error'
      }
    });
  }
}
