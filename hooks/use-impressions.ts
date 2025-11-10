"use client";

import { useCallback } from 'react';
import { usePersonalize } from '@/components/context/PersonalizeContext';

export interface TriggerImpressionOptions {
  experienceShortUids?: string[];
  aliases?: string[];
}

export const useImpressions = () => {
  const personalizeSdk = usePersonalize();

  const triggerImpression = useCallback(async (experienceShortUid: string) => {
    if (!personalizeSdk) {
      console.log('⚠️ [USE-IMPRESSIONS] No SDK available, skipping impression trigger');
      return;
    }

    try {
      console.log(`📊 [USE-IMPRESSIONS] Triggering impression for: ${experienceShortUid}`);
      await personalizeSdk.triggerImpression(experienceShortUid);
      console.log(`✅ [USE-IMPRESSIONS] Successfully triggered impression for: ${experienceShortUid}`);
    } catch (error) {
      console.error(`❌ [USE-IMPRESSIONS] Error triggering impression for ${experienceShortUid}:`, error);
      throw error;
    }
  }, [personalizeSdk]);

  const triggerImpressions = useCallback(async (options: TriggerImpressionOptions) => {
    if (!personalizeSdk) {
      console.log('⚠️ [USE-IMPRESSIONS] No SDK available, skipping impression triggers');
      return;
    }

    if (!options.experienceShortUids && !options.aliases) {
      console.log('⚠️ [USE-IMPRESSIONS] No experience UIDs or aliases provided');
      return;
    }

    try {
      console.log('📊 [USE-IMPRESSIONS] Triggering bulk impressions with options:', options);
      await personalizeSdk.triggerImpressions(options);
      console.log('✅ [USE-IMPRESSIONS] Successfully triggered bulk impressions');
    } catch (error) {
      console.error('❌ [USE-IMPRESSIONS] Error triggering bulk impressions:', error);
      throw error;
    }
  }, [personalizeSdk]);

  const triggerPageImpression = useCallback(async (pageName: string, experienceShortUids?: string[]) => {
    if (!personalizeSdk) {
      console.log('⚠️ [USE-IMPRESSIONS] No SDK available, skipping page impression');
      return;
    }

    try {
      console.log(`📊 [USE-IMPRESSIONS] Triggering page impression for: ${pageName}`);
      
      if (experienceShortUids && experienceShortUids.length > 0) {
        await personalizeSdk.triggerImpressions({ experienceShortUids });
        console.log(`✅ [USE-IMPRESSIONS] Successfully triggered page impressions for: ${pageName}`);
      } else {
        // Auto-detect active experiences from SDK
        try {
          const variantAliases = personalizeSdk.getVariantAliases();
          if (variantAliases && variantAliases.length > 0) {
            console.log(`📊 [USE-IMPRESSIONS] Auto-detected variant aliases for ${pageName}:`, variantAliases);
            await personalizeSdk.triggerImpressions({ aliases: variantAliases });
            console.log(`✅ [USE-IMPRESSIONS] Successfully triggered auto-detected impressions for: ${pageName}`);
          } else {
            console.log(`📊 [USE-IMPRESSIONS] No active experiences found for page: ${pageName}`);
          }
        } catch (error) {
          console.error(`❌ [USE-IMPRESSIONS] Error getting variant aliases for ${pageName}:`, error);
        }
      }
    } catch (error) {
      console.error(`❌ [USE-IMPRESSIONS] Error triggering page impression for ${pageName}:`, error);
      throw error;
    }
  }, [personalizeSdk]);

  return {
    triggerImpression,
    triggerImpressions,
    triggerPageImpression,
    isReady: !!personalizeSdk,
  };
};
