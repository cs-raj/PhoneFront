"use client";

import { useEffect } from 'react';

import { usePersonalize } from './context/PersonalizeContext';

/**
 * Impressions Component
 * 
 * Note: As of the latest update, impressions are now primarily handled in the edge function
 * where the variant is determined. This client-side component serves as a fallback and
 * for cases where client-side impression tracking is explicitly needed.
 * 
 * The edge function automatically triggers impressions when a variant is determined,
 * which is more reliable than client-side tracking.
 */

export interface ImpressionsProps {
  experienceShortUids?: string[];
  aliases?: string[];
  useBulkTrigger?: boolean;
  autoDetectExperiences?: boolean;
}

export const Impressions = ({
  experienceShortUids,
  aliases,
  useBulkTrigger = false,
  autoDetectExperiences = false,
}: ImpressionsProps) => {
  console.log('📊 [IMPRESSIONS] Impressions component rendering');
  console.log('📊 [IMPRESSIONS] Experience short UIDs:', experienceShortUids);
  console.log('📊 [IMPRESSIONS] Aliases:', aliases);
  console.log('📊 [IMPRESSIONS] Use bulk trigger:', useBulkTrigger);
  console.log('📊 [IMPRESSIONS] Auto detect experiences:', autoDetectExperiences);
  
  const personalizeSdk = usePersonalize();
  console.log('📊 [IMPRESSIONS] Personalization SDK available:', personalizeSdk ? 'Yes' : 'No');
  
  // Check if we're in a server-side environment (edge function)
  const isServerSide = typeof window === 'undefined';
  console.log('📊 [IMPRESSIONS] Environment:', isServerSide ? 'Server-side (Edge)' : 'Client-side');

  useEffect(() => {
    console.log('📊 [IMPRESSIONS] useEffect triggered');
    console.log('📊 [IMPRESSIONS] SDK available:', personalizeSdk ? 'Yes' : 'No');
    
    async function runEffect() {
      // Skip impression tracking on client-side since it's now handled in the edge function
      if (isServerSide) {
        console.log('📊 [IMPRESSIONS] Running on server-side (edge function) - impressions handled by edge function');
        return;
      }
      
      if (!personalizeSdk) {
        console.log('⚠️ [IMPRESSIONS] No SDK available on client-side, skipping impression triggers');
        console.log('📊 [IMPRESSIONS] Note: Impressions are now handled in the edge function where variant is determined');
        return;
      }
      
      try {
        let experiencesToTrigger: string[] = [];
        let aliasesToTrigger: string[] = [];

        if (autoDetectExperiences) {
          // Get active experiences from the SDK
          console.log('📊 [IMPRESSIONS] Auto-detecting active experiences from SDK...');
          
          try {
            // Get variant aliases from the SDK
            const variantAliases = personalizeSdk.getVariantAliases();
            console.log('📊 [IMPRESSIONS] Variant aliases from SDK:', variantAliases);
            
            if (variantAliases && variantAliases.length > 0) {
              aliasesToTrigger = variantAliases;
              console.log('📊 [IMPRESSIONS] Using variant aliases for impression tracking:', aliasesToTrigger);
            } else {
              console.log('📊 [IMPRESSIONS] No variant aliases found in SDK');
            }
          } catch (error) {
            console.error('❌ [IMPRESSIONS] Error getting variant aliases from SDK:', error);
          }
        } else {
          // Use provided experiences
          experiencesToTrigger = experienceShortUids || [];
          aliasesToTrigger = aliases || [];
        }

        // Validate input
        if (experiencesToTrigger.length === 0 && aliasesToTrigger.length === 0) {
          console.log('⚠️ [IMPRESSIONS] No experiences or aliases to trigger');
          return;
        }

        if (experiencesToTrigger.length > 0 && aliasesToTrigger.length > 0) {
          console.log('⚠️ [IMPRESSIONS] Both experienceShortUids and aliases provided, using experienceShortUids');
          aliasesToTrigger = [];
        }
        
        console.log('📊 [IMPRESSIONS] Starting impression triggers...');
        console.log('📊 [IMPRESSIONS] Experiences to trigger:', experiencesToTrigger);
        console.log('📊 [IMPRESSIONS] Aliases to trigger:', aliasesToTrigger);
        
        if (useBulkTrigger && (experiencesToTrigger.length > 0 || aliasesToTrigger.length > 0)) {
          // Use triggerImpressions for bulk operations
          const triggerOptions = experiencesToTrigger.length > 0 
            ? { experienceShortUids: experiencesToTrigger } 
            : { aliases: aliasesToTrigger };
          
          console.log('📊 [IMPRESSIONS] Using bulk triggerImpressions with options:', triggerOptions);
          await personalizeSdk.triggerImpressions(triggerOptions);
          console.log('✅ [IMPRESSIONS] Successfully triggered bulk impressions');
        } else {
          // Use individual triggerImpression calls
          const itemsToTrigger = experiencesToTrigger.length > 0 ? experiencesToTrigger : aliasesToTrigger;
          
          for (const item of itemsToTrigger) {
            try {
              console.log(`📊 [IMPRESSIONS] Triggering impression for: ${item}`);
              await personalizeSdk.triggerImpression(item);
              console.log(`✅ [IMPRESSIONS] Successfully triggered impression for: ${item}`);
            } catch (error) {
              console.error(`❌ [IMPRESSIONS] Error triggering impression for ${item}:`, error);
            }
          }
        }
        console.log('📊 [IMPRESSIONS] All impression triggers completed');
      } catch (error) {
        console.error('❌ [IMPRESSIONS] Error in impression triggering:', error);
      }
    }
    runEffect();
  }, [personalizeSdk, experienceShortUids, aliases, useBulkTrigger, autoDetectExperiences, isServerSide]);

  return <></>;
};
