import { type NextRequest, NextResponse } from "next/server";
import { getAllEntries } from "@/lib/contentstack-delivery";
import { CareersPage } from "@/lib/types";

export const dynamic = 'force-dynamic';
import Personalize from '@contentstack/personalize-edge-sdk';

export async function GET(req: NextRequest) {
  console.log("🚀 [CAREERS PAGE API] ==========================================");
  console.log("🚀 [CAREERS PAGE API] CAREERS PAGE API CALLED - STARTING REQUEST");
  console.log("🚀 [CAREERS PAGE API] ==========================================");

  try {
    const { searchParams } = new URL(req.url);
    const variantParam = searchParams.get(Personalize.VARIANT_QUERY_PARAM);
    console.log("🚀 [CAREERS PAGE API] Variant param from URL:", variantParam);

    try {
      const contentstackEntries = await getAllEntries(
        "careers_page",
        variantParam || undefined
      );

      if (contentstackEntries?.entries?.length > 0) {
        const isPersonalized = !!variantParam;
        console.log(
          `✅ [CAREERS PAGE API] Successfully fetched ${isPersonalized ? 'personalized' : 'default'} careers page from Contentstack`
        );

        const careersData = contentstackEntries.entries[0] as CareersPage;
        
        return NextResponse.json({
          ...careersData,
          personalized: isPersonalized,
          variantParam: variantParam || null,
        });
      } else {
        console.log("⚠️ [CAREERS PAGE API] No careers page entries found in Contentstack response");
      }
    } catch (contentstackError) {
      console.error("❌ [CAREERS PAGE API] Error fetching from Contentstack:", contentstackError);
    }

    return NextResponse.json({
      message: "No careers page data found",
      personalized: false,
      variantParam: variantParam || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ [CAREERS PAGE API] Unexpected error:", error);

    return NextResponse.json({
      message: "Careers page API error",
      error: error instanceof Error ? error.message : "Unknown error",
      personalized: false,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}


