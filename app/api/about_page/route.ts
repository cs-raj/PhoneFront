import { type NextRequest, NextResponse } from "next/server";
import { getAllEntries } from "@/lib/contentstack-delivery";
import { AboutPage } from "@/lib/types";

export const dynamic = 'force-dynamic';
import Personalize from '@contentstack/personalize-edge-sdk';

export async function GET(req: NextRequest) {
  console.log("🚀 [ABOUT PAGE API] ==========================================");
  console.log("🚀 [ABOUT PAGE API] ABOUT PAGE API CALLED - STARTING REQUEST");
  console.log("🚀 [ABOUT PAGE API] ==========================================");

  try {
    const { searchParams } = new URL(req.url);
    const variantParam = searchParams.get(Personalize.VARIANT_QUERY_PARAM);
    console.log("🚀 [ABOUT PAGE API] Variant param from URL:", variantParam);

    try {
      const contentstackEntries = await getAllEntries(
        "about_page",
        variantParam || undefined
      );

      if (contentstackEntries?.entries?.length > 0) {
        const isPersonalized = !!variantParam;
        console.log(
          `✅ [ABOUT PAGE API] Successfully fetched ${isPersonalized ? 'personalized' : 'default'} about page from Contentstack`
        );

        const aboutData = contentstackEntries.entries[0] as AboutPage;
        
        return NextResponse.json({
          ...aboutData,
          personalized: isPersonalized,
          variantParam: variantParam || null,
        });
      } else {
        console.log("⚠️ [ABOUT PAGE API] No about page entries found in Contentstack response");
      }
    } catch (contentstackError) {
      console.error("❌ [ABOUT PAGE API] Error fetching from Contentstack:", contentstackError);
    }

    return NextResponse.json({
      message: "No about page data found",
      personalized: false,
      variantParam: variantParam || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ [ABOUT PAGE API] Unexpected error:", error);

    return NextResponse.json({
      message: "About page API error",
      error: error instanceof Error ? error.message : "Unknown error",
      personalized: false,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}


