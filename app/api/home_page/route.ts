import { type NextRequest, NextResponse } from "next/server";
import { getAllEntries } from "@/lib/contentstack-delivery";
import { HomePage } from "@/lib/types";
import Personalize from '@contentstack/personalize-edge-sdk';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  console.log("🚀 [HOME PAGE API] ==========================================");
  console.log("🚀 [HOME PAGE API] HOME PAGE API CALLED - STARTING REQUEST");
  console.log("🚀 [HOME PAGE API] ==========================================");

  try {
    // Extract variant param from URL search params
    const { searchParams } = new URL(req.url);
    let variantParam = searchParams.get(Personalize.VARIANT_QUERY_PARAM);
    console.log("🚀 [HOME PAGE API] Variant param from Edge (URL):", variantParam);
    console.log("🚀 [HOME PAGE API] Personalize.VARIANT_QUERY_PARAM value:", Personalize.VARIANT_QUERY_PARAM);
    console.log("🚀 [HOME PAGE API] All search params:", Object.fromEntries(searchParams.entries()));
    
    // Fallback: also check for cs_variant parameter
    if (!variantParam) {
      variantParam = searchParams.get('cs_variant');
      console.log("🚀 [HOME PAGE API] Fallback cs_variant param:", variantParam);
    }
    
    // FALLBACK STRATEGY: If Edge returns 0_null or nothing, parse manifest directly
    if (!variantParam || variantParam.includes('_null')) {
      console.log('⚠️ [HOME PAGE API] Edge returned 0_null or no variant - using fallback strategy');
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
              console.log('✅ [HOME PAGE API] Extracted variant from manifest:', variantParam);
            }
          } catch (e) {
            console.log('⚠️ [HOME PAGE API] Could not parse manifest cookie');
          }
        }
      }
    }
    
    console.log("🚀 [HOME PAGE API] Final variant param to use:", variantParam);
    console.log("🔍 [HOME PAGE API] Variant parameter:", variantParam || "none");
    console.log("🚀 [HOME PAGE API] About to call getAllEntries with variant:", variantParam || "undefined");

    const contentstackEntries = await getAllEntries("home_page", variantParam || undefined);
    
    console.log("🚀 [HOME PAGE API] getAllEntries completed");
    console.log("🚀 [HOME PAGE API] Contentstack response type:", typeof contentstackEntries);
    console.log("🚀 [HOME PAGE API] Has entries:", !!contentstackEntries?.entries);
    console.log("🚀 [HOME PAGE API] Entries count:", contentstackEntries?.entries?.length || 0);
    console.log("🚀 [HOME PAGE API] Contentstack response (first 500 chars):", JSON.stringify(contentstackEntries, null, 2).substring(0, 500));

    if (contentstackEntries?.entries?.length > 0) {
      const homePageData = contentstackEntries.entries[0] as HomePage;
      console.log("✅ [HOME PAGE API] Home page data fetched successfully");
      console.log("🚀 [HOME PAGE API] Hero section headline:", homePageData.hero_section?.headline);
      console.log("🚀 [HOME PAGE API] Hero section highlight:", homePageData.hero_section?.highlight_text);
      console.log("🚀 [HOME PAGE API] Featured news title:", homePageData.featured_news_section?.section_title);
      console.log("🚀 [HOME PAGE API] Latest phones title:", homePageData.latest_phones_section?.section_title);
      console.log("🚀 [HOME PAGE API] Page title:", homePageData.title);
      console.log("🚀 [HOME PAGE API] Locale:", homePageData.locale);
      console.log("🚀 [HOME PAGE API] Personalized flag:", !!variantParam);
      console.log("🚀 [HOME PAGE API] Variant param in response:", variantParam || null);
      console.log("🚀 [HOME PAGE API] Raw Contentstack response:", JSON.stringify(contentstackEntries, null, 2));
      console.log("🚀 [HOME PAGE API] First entry keys:", contentstackEntries.entries[0] ? Object.keys(contentstackEntries.entries[0]) : 'No entries');
      console.log("🚀 [HOME PAGE API] First entry structure:", contentstackEntries.entries[0]);

      return NextResponse.json({
        ...homePageData,
        personalized: !!variantParam,
        variantParam: variantParam || null
      });
    } else {
      console.log("⚠️ [HOME PAGE API] No home page data found");
      return NextResponse.json(
        { message: "No home page data found", personalized: false, variantParam: variantParam || null },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error("❌ [HOME PAGE API] Error:", error);
    return NextResponse.json(
      { message: "Home page API error", error: error.message },
      { status: 500 }
    );
  }
}

