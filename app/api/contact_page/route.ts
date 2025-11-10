import { type NextRequest, NextResponse } from "next/server";
import { getAllEntries } from "@/lib/contentstack-delivery";
import { ContactPage } from "@/lib/types";

export const dynamic = 'force-dynamic';
import Personalize from '@contentstack/personalize-edge-sdk';

export async function GET(req: NextRequest) {
  console.log("🚀 [CONTACT PAGE API] ==========================================");
  console.log("🚀 [CONTACT PAGE API] CONTACT PAGE API CALLED - STARTING REQUEST");
  console.log("🚀 [CONTACT PAGE API] ==========================================");

  try {
    const { searchParams } = new URL(req.url);
    const variantParam = searchParams.get(Personalize.VARIANT_QUERY_PARAM);
    console.log("🚀 [CONTACT PAGE API] Variant param from URL:", variantParam);

    try {
      const contentstackEntries = await getAllEntries(
        "contact_page",
        variantParam || undefined
      );

      if (contentstackEntries?.entries?.length > 0) {
        const isPersonalized = !!variantParam;
        console.log(
          `✅ [CONTACT PAGE API] Successfully fetched ${isPersonalized ? 'personalized' : 'default'} contact page from Contentstack`
        );

        const contactData = contentstackEntries.entries[0] as ContactPage;
        
        return NextResponse.json({
          ...contactData,
          personalized: isPersonalized,
          variantParam: variantParam || null,
        });
      } else {
        console.log("⚠️ [CONTACT PAGE API] No contact page entries found in Contentstack response");
      }
    } catch (contentstackError) {
      console.error("❌ [CONTACT PAGE API] Error fetching from Contentstack:", contentstackError);
    }

    return NextResponse.json({
      message: "No contact page data found",
      personalized: false,
      variantParam: variantParam || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ [CONTACT PAGE API] Unexpected error:", error);

    return NextResponse.json({
      message: "Contact page API error",
      error: error instanceof Error ? error.message : "Unknown error",
      personalized: false,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

