import Personalize from '@contentstack/personalize-edge-sdk';

export default async function handler(request, context) {
  console.log('🚀 [EDGE] ============================================');
  console.log('🚀 [EDGE] EDGE FUNCTION STARTED');
  console.log('🚀 [EDGE] ============================================');
  
  const parsedUrl = new URL(request.url);
  const pathname = parsedUrl.pathname;
  
  console.log('🚀 [EDGE] Request URL:', request.url);
  console.log('🚀 [EDGE] Pathname:', pathname);
  console.log('🚀 [EDGE] Search params:', parsedUrl.searchParams.toString());
  
  // Log cookies
  const cookieHeader = request.headers.get('cookie');
  console.log('🍪 [EDGE] Cookie header:', cookieHeader ? 'Present' : 'None');
  if (cookieHeader) {
    const personalizeCookies = cookieHeader.split(';')
      .filter(c => c.trim().startsWith('cs-personalize'))
      .map(c => c.trim());
    console.log('🍪 [EDGE] Personalize cookies:', personalizeCookies.length > 0 ? personalizeCookies : 'None');
    console.log('🍪 [EDGE] Personalize cookie count:', personalizeCookies.length);
    
    // Look for budget attribute in cookies
    const budgetCookie = cookieHeader.split(';')
      .find(c => c.trim().includes('budget'))
      ?.trim();
    if (budgetCookie) {
      console.log('💰 [EDGE] Budget attribute found in cookies:', budgetCookie);
    } else {
      console.log('💰 [EDGE] No budget attribute found in cookies');
    }
  }

  if (['_next', 'favicon.ico'].some((path) => pathname.includes(path))) {
    console.log('🚀 [EDGE] Skipping personalization for internal path:', pathname);
    return fetch(request);
  }

  console.log('🚀 [EDGE] Environment variables check:');
  console.log('🚀 [EDGE] - PERSONALIZE_PROJECT_UID:', context.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID ? '✅ SET' : '❌ NOT SET');
  console.log('🚀 [EDGE] - PERSONALIZE_EDGE_API_URL:', context.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL ? '✅ SET' : '❌ NOT SET');

  if (context.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL) {
    console.log('🚀 [EDGE] Setting Edge API URL:', context.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL);
    Personalize.setEdgeApiUrl(context.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL);
  }

  console.log('🚀 [EDGE] Initializing Personalize SDK...');
  console.log('🚀 [EDGE] Passing request object with cookies to SDK');
  
  try {
    const personalizeSdk = await Personalize.init(context.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID, {
      request,
    });
    console.log('✅ [EDGE] Personalize SDK initialized successfully');
    console.log('🍪 [EDGE] SDK has read cookies and user context');

    // Read budget cookie and set budget attribute BEFORE getting variant param
    let budgetCategory = null;
    try {
      const budgetCookie = request.headers.get('cookie');
      if (budgetCookie) {
        const budgetMatch = budgetCookie.match(/budget=([^;]+)/);
        if (budgetMatch) {
          budgetCategory = budgetMatch[1];
          console.log('💰 [EDGE] Budget cookie found:', budgetCategory);
          
          // Set budget attribute before any variant operations
          try {
            console.log('💰 [EDGE] Setting budget attribute:', budgetCategory);
            await personalizeSdk.set({ budget: budgetCategory });
            console.log('✅ [EDGE] Budget attribute set successfully');
          } catch (error) {
            console.error('❌ [EDGE] Failed to set budget attribute:', error);
          }
        } else {
          console.log('💰 [EDGE] No budget preference found in cookies');
        }
      } else {
        console.log('💰 [EDGE] No cookies available for budget check');
      }
    } catch (error) {
      console.log('💰 [EDGE] Could not retrieve budget attribute from cookies:', error.message);
    }

    const variantParam = personalizeSdk.getVariantParam();
    console.log('🚀 [EDGE] Variant param (based on cookies):', variantParam);
    console.log('🚀 [EDGE] Variant determination: SDK used cookie data to calculate this variant');
    
    // Trigger impressions directly in the edge function where we have the variant
    try {
      console.log('📊 [EDGE] Triggering impressions for variant:', variantParam);
      
      // Get variant aliases to trigger impressions
      const variantAliases = personalizeSdk.getVariantAliases();
      console.log('📊 [EDGE] Variant aliases:', variantAliases);
      
      if (variantAliases && variantAliases.length > 0) {
        console.log('📊 [EDGE] Triggering impressions for aliases:', variantAliases);
        await personalizeSdk.triggerImpressions({ aliases: variantAliases });
        console.log('✅ [EDGE] Successfully triggered impressions for variant');
      } else {
        console.log('⚠️ [EDGE] No variant aliases found, skipping impression trigger');
      }
    } catch (error) {
      console.error('❌ [EDGE] Error triggering impressions:', error);
      // Don't throw - continue with the request even if impressions fail
    }
    
    parsedUrl.searchParams.set(personalizeSdk.VARIANT_QUERY_PARAM, variantParam);
    console.log('🚀 [EDGE] Modified URL:', parsedUrl.toString());

    const modifiedRequest = new Request(parsedUrl.toString(), request);
    console.log('🚀 [EDGE] Fetching modified request...');
    
    const response = await fetch(modifiedRequest);
    console.log('🚀 [EDGE] Response status:', response.status);

    const modifiedResponse = new Response(response.body, response);
    personalizeSdk.addStateToResponse(modifiedResponse);
    modifiedResponse.headers.set('cache-control', 'no-store');
    modifiedResponse.headers.set('X-Budget-Category', budgetCategory || 'none');
    console.log('💰 [EDGE] Response header set - X-Budget-Category:', budgetCategory || 'none');

    console.log('✅ [EDGE] Edge function completed successfully');
    console.log('🚀 [EDGE] ============================================');
    return modifiedResponse;
  } catch (error) {
    console.error('❌ [EDGE] Error in edge function:', error);
    console.error('❌ [EDGE] Error message:', error.message);
    console.error('❌ [EDGE] Error stack:', error.stack);
    console.log('🚀 [EDGE] ============================================');
    throw error;
  }
}