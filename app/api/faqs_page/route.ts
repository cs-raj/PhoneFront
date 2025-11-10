import { type NextRequest, NextResponse } from "next/server";
import { getAllEntries } from "@/lib/contentstack-delivery";
import { FAQsPage } from "@/lib/types";

export const dynamic = 'force-dynamic';
import Personalize from '@contentstack/personalize-edge-sdk';

export async function GET(req: NextRequest) {
  console.log("🚀 [FAQS PAGE API] ==========================================");
  console.log("🚀 [FAQS PAGE API] FAQS PAGE API CALLED - STARTING REQUEST");
  console.log("🚀 [FAQS PAGE API] ==========================================");

  try {
    const { searchParams } = new URL(req.url);
    const variantParam = searchParams.get(Personalize.VARIANT_QUERY_PARAM);
    console.log("🚀 [FAQS PAGE API] Variant param from URL:", variantParam);

    try {
      const contentstackEntries = await getAllEntries(
        "faqs_page",
        variantParam || undefined
      );

      if (contentstackEntries?.entries?.length > 0) {
        const isPersonalized = !!variantParam;
        console.log(
          `✅ [FAQS PAGE API] Successfully fetched ${isPersonalized ? 'personalized' : 'default'} faqs page from Contentstack`
        );

        const faqsData = contentstackEntries.entries[0] as FAQsPage;
        
        return NextResponse.json({
          ...faqsData,
          personalized: isPersonalized,
          variantParam: variantParam || null,
        });
      } else {
        console.log("⚠️ [FAQS PAGE API] No faqs page entries found in Contentstack response");
      }
    } catch (contentstackError) {
      console.error("❌ [FAQS PAGE API] Error fetching from Contentstack:", contentstackError);
    }

    return NextResponse.json({
      message: "No FAQs page data found",
      personalized: false,
      variantParam: variantParam || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ [FAQS PAGE API] Unexpected error:", error);

    return NextResponse.json({
      message: "FAQs page API error",
      error: error instanceof Error ? error.message : "Unknown error",
      personalized: false,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}


