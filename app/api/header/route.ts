import { type NextRequest, NextResponse } from "next/server";
import { getAllEntries } from "@/lib/contentstack-delivery";
import { Header } from "@/lib/types";
import Personalize from '@contentstack/personalize-edge-sdk';

export async function GET(req: NextRequest) {
  console.log("🚀 [HEADER API] ==========================================");
  console.log("🚀 [HEADER API] HEADER API CALLED - STARTING REQUEST");
  console.log("🚀 [HEADER API] ==========================================");
  console.log("🚀 [HEADER API] Starting header API request");
  console.log("🚀 [HEADER API] Request URL:", req.url);
  console.log("🚀 [HEADER API] Request method:", req.method);
  console.log("🚀 [HEADER API] Request headers:", Object.fromEntries(req.headers.entries()));
  console.log("🚀 [HEADER API] Environment variables:", {
    hasApiKey: !!process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
    hasDeliveryToken: !!process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN,
    hasEnvironment: !!process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
    hasRegion: !!process.env.NEXT_PUBLIC_CONTENTSTACK_REGION
  });

  try {
    // Extract variant param from URL search params
    const { searchParams } = new URL(req.url);
    const variantParam = searchParams.get(Personalize.VARIANT_QUERY_PARAM);
    console.log("🚀 [HEADER API] Variant param from URL:", variantParam);
    console.log("🚀 [HEADER API] All search params:", Object.fromEntries(searchParams.entries()));
    console.log("🚀 [HEADER API] Personalize variant query param:", Personalize.VARIANT_QUERY_PARAM);

    // Try to fetch from Contentstack (with or without personalization)
    console.log(
      "🚀 [HEADER API] Attempting to fetch header from Contentstack"
    );
    console.log(
      "🚀 [HEADER API] Using variant param:",
      variantParam || "none (default content)"
    );
    console.log("🚀 [HEADER API] About to call getAllEntries with variant:", variantParam || "undefined");
    
    try {
      const contentstackEntries = await getAllEntries(
        "header",
        variantParam || undefined
      );
      
      console.log("🚀 [HEADER API] getAllEntries completed");
      console.log("🚀 [HEADER API] Contentstack response type:", typeof contentstackEntries);
      console.log("🚀 [HEADER API] Has entries:", !!contentstackEntries?.entries);
      console.log("🚀 [HEADER API] Entries count:", contentstackEntries?.entries?.length || 0);
      console.log(
        "🚀 [HEADER API] Contentstack response:",
        JSON.stringify(contentstackEntries, null, 2)
      );

      if (contentstackEntries?.entries?.length > 0) {
        const isPersonalized = !!variantParam;
        console.log(
          `✅ [HEADER API] Successfully fetched ${isPersonalized ? 'personalized' : 'default'} header from Contentstack`
        );
        console.log(
          "🚀 [HEADER API] Header entries count:",
          contentstackEntries.entries.length
        );
        
        // Get header data for detailed logging
        const headerData = contentstackEntries.entries[0] as Header;
        console.log("🚀 [HEADER API] Header title:", headerData.title);
        console.log("🚀 [HEADER API] Header group count:", headerData.group?.length || 0);
        console.log("🚀 [HEADER API] Header logo:", headerData.logo?.title || "No logo");
        console.log("🚀 [HEADER API] Header locale:", headerData.locale);
        console.log("🚀 [HEADER API] Personalized flag:", isPersonalized);
        console.log("🚀 [HEADER API] Variant param in response:", variantParam || null);
        console.log("🚀 [HEADER API] Raw Contentstack response:", JSON.stringify(contentstackEntries, null, 2));

        // Handle the response structure
        console.log("🚀 [HEADER API] Header data structure:", {
          hasTitle: !!headerData?.title,
          hasGroup: !!headerData?.group,
          hasTags: !!headerData?.tags,
          hasUid: !!headerData?.uid,
          keys: headerData ? Object.keys(headerData) : []
        });

        console.log(
          `✅ [HEADER API] Returning ${isPersonalized ? 'personalized' : 'default'} header data:`,
          JSON.stringify(headerData)
        );
        const response = NextResponse.json({
          ...headerData,
          personalized: isPersonalized,
          variantParam: variantParam || null,
        });
        console.log("🚀 [HEADER API] Response status:", response.status);
        console.log(
          "🚀 [HEADER API] Response headers:",
          Object.fromEntries(response.headers.entries())
        );
        console.log(
          "🚀 [HEADER API] Response body preview:",
          JSON.stringify(
            {
              ...headerData,
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
          "⚠️ [HEADER API] No header entries found in Contentstack response"
        );
      }
    } catch (contentstackError) {
      console.error(
        "❌ [HEADER API] Error fetching from Contentstack:",
        contentstackError
      );
      console.log(
        "🚀 [HEADER API] Will return empty response due to Contentstack error"
      );
    }

    // No fallback - return empty response if no data
    console.log("🚀 [HEADER API] Returning empty response");
    const emptyResponse = NextResponse.json({
      message: "No header data found",
      personalized: false,
      variantParam: variantParam || null,
      timestamp: new Date().toISOString(),
    });
    console.log("🚀 [HEADER API] Empty response status:", emptyResponse.status);
    console.log(
      "🚀 [HEADER API] Empty response headers:",
      Object.fromEntries(emptyResponse.headers.entries())
    );
    console.log(
      "🚀 [HEADER API] Empty response body:",
      JSON.stringify(
        {
          message: "No header data found",
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
    console.error("❌ [HEADER API] Unexpected error in header API:", error);
    console.error("❌ [HEADER API] Error stack:", error instanceof Error ? error.stack : 'No stack trace');

    // No fallback - return empty response on error
    const errorResponse = NextResponse.json({
      message: "Header API error",
      error: error.message,
      personalized: false,
      variantAliases: [],
      timestamp: new Date().toISOString(),
    });
    console.log("🚀 [HEADER API] Error response status:", errorResponse.status);
    console.log(
      "🚀 [HEADER API] Error response headers:",
      Object.fromEntries(errorResponse.headers.entries())
    );
    console.log(
      "🚀 [HEADER API] Error response body:",
      JSON.stringify(
        {
          message: "Header API error",
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
