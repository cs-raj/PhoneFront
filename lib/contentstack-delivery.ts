import Contentstack from "@contentstack/delivery-sdk"
import Personalize from '@contentstack/personalize-edge-sdk';

const Stack = Contentstack.stack({
  apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || "",
  deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN || "",
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || "",
  region: process.env.NEXT_PUBLIC_CONTENTSTACK_REGION as any || "us",
})

export const getEntryBySlug = async (contentTypeUid: string, slug: string, variantParam?: string) => {
  console.log(`🔍 [CONTENTSTACK] ==========================================`);
  console.log(`🔍 [CONTENTSTACK] FETCHING ENTRY BY SLUG - ${contentTypeUid}/${slug}`);
  console.log(`🔍 [CONTENTSTACK] ==========================================`);
  console.log(`🔍 [CONTENTSTACK] Using variant param:`, variantParam || 'none (default content)');
  console.log(`🔍 [CONTENTSTACK] Stack configuration:`, {
    apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY ? '***SET***' : 'NOT_SET',
    deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN ? '***SET***' : 'NOT_SET',
    environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'NOT_SET',
    region: process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'us'
  });

  try {
    const query = Stack
      .contentType(contentTypeUid)
      .entry()
      .includeReference(['companies','author','phone','images'])
      .includeFallback()
    
    let result;
    if (variantParam) {
      const variantAlias = Personalize.variantParamToVariantAliases(variantParam).join(',');
      console.log(`🔍 [CONTENTSTACK] Using variant aliases: ${variantAlias}`);
      result = await query.variants(variantAlias).find();
    } else {
      console.log(`🔍 [CONTENTSTACK] Using default content (no variants)`);
      result = await query.find();
    }
    
    console.log(`✅ [CONTENTSTACK] Successfully fetched entries for ${contentTypeUid}`);
    console.log(`🔍 [CONTENTSTACK] Response structure:`, {
      hasEntries: !!result?.entries,
      entriesCount: result?.entries?.length || 0,
      responseKeys: Object.keys(result || {})
    });
    
    // Find the entry with matching slug
    const entry = result?.entries?.find((entry: any) => entry.slug === slug);
    
    if (entry) {
      console.log(`✅ [CONTENTSTACK] Found entry with slug ${slug}`);
      console.log(`🔍 [CONTENTSTACK] Entry preview:`, JSON.stringify(entry, null, 2));
    } else {
      console.log(`❌ [CONTENTSTACK] No entry found with slug ${slug}`);
      console.log(`🔍 [CONTENTSTACK] Available slugs:`, result?.entries?.map((e: any) => e.slug));
    }
    
    return entry
  } catch (error) {
    console.error(`❌ [CONTENTSTACK] ==========================================`);
    console.error(`❌ [CONTENTSTACK] ERROR FETCHING ENTRY BY SLUG - ${contentTypeUid}/${slug}`);
    console.error(`❌ [CONTENTSTACK] ==========================================`);
    console.error(`❌ [CONTENTSTACK] Error details:`, error);
    console.error(`❌ [CONTENTSTACK] Error message:`, error instanceof Error ? error.message : 'Unknown error');
    console.error(`❌ [CONTENTSTACK] Error stack:`, error instanceof Error ? error.stack : 'No stack trace');
    return null
  }
}

export const getAllEntries = async (contentTypeUid: string, variantParam?: string) => {
  console.log(`🔍 [CONTENTSTACK] ==========================================`);
  console.log(`🔍 [CONTENTSTACK] FETCHING ALL ENTRIES - ${contentTypeUid}`);
  console.log(`🔍 [CONTENTSTACK] ==========================================`);
  console.log(`🔍 [CONTENTSTACK] Using variant param:`, variantParam || 'none (default content)');
  console.log(`🔍 [CONTENTSTACK] Stack configuration:`, {
    apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY ? '***SET***' : 'NOT_SET',
    deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN ? '***SET***' : 'NOT_SET',
    environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'NOT_SET',
    region: process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'us'
  });

  try {
    console.log(`🔍 [CONTENTSTACK] Building query for ${contentTypeUid}...`);
    const query = Stack
      .contentType(contentTypeUid)
      .entry().includeReference(['companies','author','phone','images'])
      .includeFallback()
    
    console.log(`🔍 [CONTENTSTACK] Query built successfully`);
    
    let result;
    if (variantParam) {
      console.log(`🔍 [CONTENTSTACK] Converting variant param to aliases...`);
      console.log(`🔍 [CONTENTSTACK] Variant param:`, variantParam);
      
      const variantAliases = Personalize.variantParamToVariantAliases(variantParam);
      console.log(`🔍 [CONTENTSTACK] Variant aliases array:`, variantAliases);
      
      const variantAlias = variantAliases.join(',');
      console.log(`🔍 [CONTENTSTACK] Variant aliases string:`, variantAlias);
      
      console.log(`🔍 [CONTENTSTACK] Executing query with variants...`);
      result = await query.variants(variantAlias).find();
      console.log(`🔍 [CONTENTSTACK] Query with variants completed!`);
    } else {
      console.log(`🔍 [CONTENTSTACK] Using default content (no variants)`);
      console.log(`🔍 [CONTENTSTACK] Executing query without variants...`);
      result = await query.find();
      console.log(`🔍 [CONTENTSTACK] Query without variants completed!`);
    }
    
    console.log(`✅ [CONTENTSTACK] Query execution successful for ${contentTypeUid}!`);
    console.log(`🔍 [CONTENTSTACK] Result type:`, typeof result);
    console.log(`🔍 [CONTENTSTACK] Result is null/undefined:`, result === null || result === undefined);
    console.log(`🔍 [CONTENTSTACK] Analyzing response structure...`);
    console.log(`🔍 [CONTENTSTACK] Response structure:`, {
      hasEntries: !!result?.entries,
      entriesCount: result?.entries?.length || 0,
      responseKeys: Object.keys(result || {}),
      contentTypeUid: (result as any)?.content_type?.uid || 'unknown',
      totalCount: result?.count || 0,
      entriesIsArray: Array.isArray(result?.entries)
    });
    
    if (result?.entries && result.entries.length > 0) {
      console.log(`🔍 [CONTENTSTACK] Entries found! Count:`, result.entries.length);
      console.log(`🔍 [CONTENTSTACK] First entry keys:`, result.entries[0] ? Object.keys(result.entries[0]) : []);
      console.log(`🔍 [CONTENTSTACK] First entry preview (first 300 chars):`, JSON.stringify(result.entries[0], null, 2).substring(0, 300));
      console.log(`🔍 [CONTENTSTACK] All entry slugs:`, result.entries.map((e: any) => e.slug || e.uid || 'NO_SLUG'));
    } else {
      console.log(`⚠️ [CONTENTSTACK] No entries found in response`);
      console.log(`⚠️ [CONTENTSTACK] Result object:`, JSON.stringify(result, null, 2).substring(0, 500));
    }
    
    console.log(`🔍 [CONTENTSTACK] ==========================================`);
    console.log(`🔍 [CONTENTSTACK] CONTENTSTACK QUERY COMPLETED - ${contentTypeUid}`);
    console.log(`🔍 [CONTENTSTACK] ==========================================`);
    
    return result
  } catch (error) {
    console.error(`❌ [CONTENTSTACK] ==========================================`);
    console.error(`❌ [CONTENTSTACK] ERROR FETCHING ALL ENTRIES - ${contentTypeUid}`);
    console.error(`❌ [CONTENTSTACK] ==========================================`);
    console.error(`❌ [CONTENTSTACK] Error details:`, error);
    console.error(`❌ [CONTENTSTACK] Error message:`, error instanceof Error ? error.message : 'Unknown error');
    console.error(`❌ [CONTENTSTACK] Error stack:`, error instanceof Error ? error.stack : 'No stack trace');
    console.error(`❌ [CONTENTSTACK] ContentType UID:`, contentTypeUid);
    console.error(`❌ [CONTENTSTACK] Variant param used:`, variantParam);
    console.error(`❌ [CONTENTSTACK] ==========================================`);
    return { entries: [] }
  }
}