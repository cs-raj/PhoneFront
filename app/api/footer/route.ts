import { type NextRequest, NextResponse } from "next/server";
import { getAllEntries } from "@/lib/contentstack-delivery";
import { Footer } from "@/lib/types";
import Personalize from '@contentstack/personalize-edge-sdk';

export async function GET(req: NextRequest) {
  console.log("🚀 [FOOTER API] ==========================================");
  console.log("🚀 [FOOTER API] FOOTER API CALLED - STARTING REQUEST");
  console.log("🚀 [FOOTER API] ==========================================");
  console.log("🚀 [FOOTER API] Starting footer API request");
  console.log("🚀 [FOOTER API] Request URL:", req.url);
  console.log("🚀 [FOOTER API] Request method:", req.method);
  console.log("🚀 [FOOTER API] Request headers:", Object.fromEntries(req.headers.entries()));
  console.log("🚀 [FOOTER API] Environment variables:", {
    hasApiKey: !!process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
    hasDeliveryToken: !!process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN,
    hasEnvironment: !!process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
    hasRegion: !!process.env.NEXT_PUBLIC_CONTENTSTACK_REGION
  });

  try {
    // Extract variant param from URL search params
    const { searchParams } = new URL(req.url);
    const variantParam = searchParams.get(Personalize.VARIANT_QUERY_PARAM);
    console.log("🚀 [FOOTER API] Variant param from URL:", variantParam);
    console.log("🚀 [FOOTER API] All search params:", Object.fromEntries(searchParams.entries()));
    console.log("🚀 [FOOTER API] Personalize variant query param:", Personalize.VARIANT_QUERY_PARAM);

    // Try to fetch from Contentstack (with or without personalization)
    console.log(
      "🚀 [FOOTER API] Attempting to fetch footer from Contentstack"
    );
    console.log(
      "🚀 [FOOTER API] Using variant param:",
      variantParam || "none (default content)"
    );
    
    try {
      const contentstackEntries = await getAllEntries(
        "footer",
        variantParam || undefined
      );
      console.log(
        "🚀 [FOOTER API] Contentstack response:",
        JSON.stringify(contentstackEntries, null, 2)
      );

      if (contentstackEntries?.entries?.length > 0) {
        const isPersonalized = !!variantParam;
        console.log(
          `✅ [FOOTER API] Successfully fetched ${isPersonalized ? 'personalized' : 'default'} footer from Contentstack`
        );
        console.log(
          "🚀 [FOOTER API] Footer entries count:",
          contentstackEntries.entries.length
        );
        console.log("🚀 [FOOTER API] Raw Contentstack response:", JSON.stringify(contentstackEntries, null, 2));

        // Handle the response structure
        const footerData = contentstackEntries.entries[0] as Footer;
        console.log("🚀 [FOOTER API] Footer data structure:", {
          hasTitle: !!footerData?.title,
          hasNavigationLinks: !!footerData?.navigation_links,
          hasSocialMediaLinks: !!footerData?.social_media_links,
          hasContactInformation: !!footerData?.contact_information,
          hasUid: !!footerData?.uid,
          keys: footerData ? Object.keys(footerData) : []
        });

        console.log(
          `✅ [FOOTER API] Returning ${isPersonalized ? 'personalized' : 'default'} footer data:`,
          JSON.stringify(footerData)
        );
        const response = NextResponse.json({
          ...footerData,
          personalized: isPersonalized,
          variantParam: variantParam || null,
        });
        console.log("🚀 [FOOTER API] Response status:", response.status);
        console.log(
          "🚀 [FOOTER API] Response headers:",
          Object.fromEntries(response.headers.entries())
        );
        console.log(
          "🚀 [FOOTER API] Response body preview:",
          JSON.stringify(
            {
              ...footerData,
              personalized: isPersonalized,
              variantParam: variantParam || null,
            },
            null,
            2
          )
        );
        return response;
      } else {
        console.log(
          "⚠️ [FOOTER API] No footer entries found in Contentstack response"
        );
      }
    } catch (contentstackError) {
      console.error(
        "❌ [FOOTER API] Error fetching from Contentstack:",
        contentstackError
      );
      console.log(
        "🚀 [FOOTER API] Will return empty response due to Contentstack error"
      );
    }

    // No fallback - return empty response if no data
    console.log("🚀 [FOOTER API] Returning empty response");
    const emptyResponse = NextResponse.json({
      message: "No footer data found",
      personalized: false,
      variantParam: variantParam || null,
      timestamp: new Date().toISOString(),
    });
    console.log("🚀 [FOOTER API] Empty response status:", emptyResponse.status);
    console.log(
      "🚀 [FOOTER API] Empty response headers:",
      Object.fromEntries(emptyResponse.headers.entries())
    );
    console.log(
      "🚀 [FOOTER API] Empty response body:",
      JSON.stringify(
        {
          message: "No footer data found",
          personalized: false,
          variantParam: variantParam || null,
          timestamp: new Date().toISOString(),
        },
        null,
        2
      )
    );
    return emptyResponse;
  } catch (error) {
    console.error("❌ [FOOTER API] Unexpected error in footer API:", error);
    console.error("❌ [FOOTER API] Error stack:", error instanceof Error ? error.stack : 'No stack trace');

    // No fallback - return empty response on error
    const errorResponse = NextResponse.json({
      message: "Footer API error",
      error: error.message,
      personalized: false,
      variantAliases: [],
      timestamp: new Date().toISOString(),
    });
    console.log("🚀 [FOOTER API] Error response status:", errorResponse.status);
    console.log(
      "🚀 [FOOTER API] Error response headers:",
      Object.fromEntries(errorResponse.headers.entries())
    );
    console.log(
      "🚀 [FOOTER API] Error response body:",
      JSON.stringify(
        {
          message: "Footer API error",
          error: error.message,
          personalized: false,
          variantAliases: [],
          timestamp: new Date().toISOString(),
        },
        null,
        2
      )
    );
    return errorResponse;
  }
}


